import { defineStore } from "pinia";
import { aspirantesService } from "@/services/api";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import { readJSON, writeJSON } from "@/utils/storage";

export type ApplicantStatus = "pending" | "active" | "inactive";
export type ApplicantRecord = {
  id: string;
  fullName: string;
  sentDate: string;
  interviewDate: string;
  status: ApplicantStatus;
  rejectionReason?: string;
  fieldValues: Record<string, string | number | boolean | null>;
};

const storageKey = "semillas-applicants";
const defaultApplicants: ApplicantRecord[] = [
  {
    id: "app-1",
    fullName: "Valentina Pérez",
    sentDate: "2026-05-10",
    interviewDate: "2026-05-14",
    status: "pending",
    fieldValues: {
      guardianName: "Diana Pérez",
      phone: "3125554433",
      birthDate: "2021-03-05",
    },
  },
  {
    id: "app-2",
    fullName: "Mateo Gómez",
    sentDate: "2026-05-11",
    interviewDate: "2026-05-16",
    status: "pending",
    fieldValues: {
      guardianName: "Pedro Gómez",
      phone: "3134445566",
      birthDate: "2020-08-19",
    },
  },
];

function calculateAge(dateValue: string): number {
  const birthDate = new Date(dateValue);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  )
    age -= 1;
  return Math.max(age, 1);
}

export const useAspirantesStore = defineStore("aspirantes", {
  state: () => ({
    aspirantes: readJSON<ApplicantRecord[]>(storageKey, defaultApplicants),
    loading: false,
  }),
  actions: {
    async fetchAspirantes() {
      this.loading = true;
      try {
        const aspirantes =
          (await aspirantesService.getAll()) as ApplicantRecord[];
        this.aspirantes = aspirantes.length ? aspirantes : defaultApplicants;
        writeJSON(storageKey, this.aspirantes);
        return this.aspirantes;
      } finally {
        this.loading = false;
      }
    },
    async aprobarAspirante(id: string) {
      const applicant = this.aspirantes.find((entry) => entry.id === id);
      if (!applicant) return null;
      const studentsStore = useEstudiantesStore();
      await studentsStore.createEstudiante({
        fullName: applicant.fullName,
        age: applicant.fieldValues.birthDate
          ? calculateAge(String(applicant.fieldValues.birthDate))
          : 5,
        group: "Pendiente",
        entryDate: applicant.sentDate,
        status: "active",
        photoUrl: "",
        observations: "",
        graduationYear: null,
        fieldValues: applicant.fieldValues,
      });
      this.aspirantes = this.aspirantes.map((entry) =>
        entry.id === id ? { ...entry, status: "active" } : entry,
      );
      writeJSON(storageKey, this.aspirantes);
      await aspirantesService.approve(id);
      return applicant;
    },
    async rechazarAspirante(id: string, motivo = "") {
      this.aspirantes = this.aspirantes.map((entry) =>
        entry.id === id
          ? { ...entry, status: "inactive", rejectionReason: motivo }
          : entry,
      );
      writeJSON(storageKey, this.aspirantes);
      await aspirantesService.reject(id, motivo);
    },
    async updateFechaEntrevista(id: string, date: string) {
      this.aspirantes = this.aspirantes.map((entry) =>
        entry.id === id ? { ...entry, interviewDate: date } : entry,
      );
      writeJSON(storageKey, this.aspirantes);
      await aspirantesService.updateInterview(id, date);
    },
  },
});
