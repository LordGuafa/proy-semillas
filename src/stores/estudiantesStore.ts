import { defineStore } from "pinia";
import { estudiantesService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";

export type StudentStatus = "pending" | "active" | "inactive" | "graduated";
export type StudentRecord = {
  id: string;
  fullName: string;
  age: number;
  group: string;
  entryDate: string;
  status: StudentStatus;
  photoUrl: string;
  observations: string;
  graduationYear?: number | null;
  fieldValues: Record<string, string | number | boolean | null>;
};

const storageKey = "semillas-students";
const defaultStudents: StudentRecord[] = [
  {
    id: "stu-1",
    fullName: "Mariana López",
    age: 5,
    group: "Arcoíris",
    entryDate: "2025-02-10",
    status: "active",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    observations: "Adapting well.",
    graduationYear: null,
    fieldValues: { guardianName: "Laura López", phone: "3001234567" },
  },
  {
    id: "stu-2",
    fullName: "Tomás Herrera",
    age: 6,
    group: "Bosque",
    entryDate: "2024-01-18",
    status: "graduated",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    observations: "Graduated with honors.",
    graduationYear: 2025,
    fieldValues: { guardianName: "Carlos Herrera", phone: "3009876543" },
  },
  {
    id: "stu-3",
    fullName: "Sofía Ramírez",
    age: 4,
    group: "Semilla",
    entryDate: "2025-08-01",
    status: "pending",
    photoUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    observations: "",
    graduationYear: null,
    fieldValues: { guardianName: "Andrea Ramírez", phone: "3012223344" },
  },
];

function matches(student: StudentRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    student.fullName,
    student.group,
    student.observations,
    String(student.age),
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export const useEstudiantesStore = defineStore("estudiantes", {
  state: () => ({
    estudiantes: readJSON<StudentRecord[]>(storageKey, defaultStudents),
    loading: false,
    error: "",
    pagination: {
      page: 1,
      perPage: 6,
      total: readJSON<StudentRecord[]>(storageKey, defaultStudents).length,
    },
  }),
  getters: {
    estudiantesFiltrados: (state) => {
      return (
        query = "",
        groupBy = "group",
        filters: { status?: StudentStatus | "all"; group?: string } = {},
      ) => {
        const filtered = state.estudiantes.filter((student) => {
          const matchesStatus =
            !filters.status ||
            filters.status === "all" ||
            student.status === filters.status;
          const matchesGroup =
            !filters.group ||
            filters.group === "all" ||
            student.group === filters.group;
          return matches(student, query) && matchesStatus && matchesGroup;
        });
        return [...filtered].sort((a, b) =>
          groupBy === "age"
            ? a.age - b.age
            : groupBy === "status"
              ? a.status.localeCompare(b.status)
              : a.group.localeCompare(b.group),
        );
      };
    },
  },
  actions: {
    async fetchEstudiantes(
      filters: { status?: StudentStatus | "all"; group?: string } = {},
    ) {
      this.loading = true;
      this.error = "";
      try {
        const estudiantes =
          (await estudiantesService.getAll()) as StudentRecord[];
        this.estudiantes = estudiantes.filter((student) => {
          const matchesStatus =
            !filters.status ||
            filters.status === "all" ||
            student.status === filters.status;
          const matchesGroup =
            !filters.group ||
            filters.group === "all" ||
            student.group === filters.group;
          return matchesStatus && matchesGroup;
        });
        this.pagination.total = this.estudiantes.length;
        writeJSON(storageKey, this.estudiantes);
        return this.estudiantes;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No fue posible cargar los estudiantes.";
        return this.estudiantes;
      } finally {
        this.loading = false;
      }
    },
    async createEstudiante(
      data: Omit<StudentRecord, "id"> & Partial<Pick<StudentRecord, "id">>,
    ) {
      const nextStudent: StudentRecord = {
        ...data,
        id: data.id ?? `stu-${Date.now()}`,
      };
      this.estudiantes = [nextStudent, ...this.estudiantes];
      this.pagination.total = this.estudiantes.length;
      writeJSON(storageKey, this.estudiantes);
      await estudiantesService.create(nextStudent);
      return nextStudent;
    },
    async updateEstudiante(id: string, data: Partial<StudentRecord>) {
      this.estudiantes = this.estudiantes.map((student) =>
        student.id === id ? { ...student, ...data } : student,
      );
      writeJSON(storageKey, this.estudiantes);
      await estudiantesService.update(id, data);
      return this.estudiantes.find((student) => student.id === id) ?? null;
    },
    async deleteEstudiante(id: string) {
      this.estudiantes = this.estudiantes.filter(
        (student) => student.id !== id,
      );
      this.pagination.total = this.estudiantes.length;
      writeJSON(storageKey, this.estudiantes);
      await estudiantesService.delete(id);
    },
  },
});
