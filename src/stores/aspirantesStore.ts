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

export const useAspirantesStore = defineStore("aspirantes", {
  state: () => ({
    aspirantes: readJSON<ApplicantRecord[]>(storageKey, []),
    loading: false,
  }),
  actions: {
    async fetchAspirantes() {
      this.loading = true;
      try {
        const aspirantes = ((await aspirantesService.getAll()).data ??
          []) as ApplicantRecord[];
        this.aspirantes = Array.isArray(aspirantes) ? aspirantes : [];
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
        status: "active",
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
