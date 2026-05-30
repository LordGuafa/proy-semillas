import { defineStore } from "pinia";
import { estudiantesService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";
import type Guardian from "@/types/guardian";
import type Student from "@/types/student";

type StudentFilter = {
  status?: Student["status"] | "all";
  city?: string;
};

type LegacyStudentRecord = {
  id?: string | number;
  fullName?: string;
  firstname?: string;
  lastname?: string;
  homeAddress?: string;
  city?: string;
  department?: string;
  strata?: string;
  hasLunch?: boolean;
  hasTransport?: boolean;
  status: "pending" | "active" | "inactive" | "graduated" | Student["status"];
  photoURL?: string;
  photoUrl?: string;
  observations?: string;
  age?: number;
  group?: string;
  entryDate?: string;
  graduationYear?: number | null;
  fieldValues?: Record<string, string | number | boolean | null>;
};

const storageKey = "semillas-students";

function parseBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function normalizeStatus(
  status: LegacyStudentRecord["status"] | undefined,
): Student["status"] {
  switch (status) {
    case "pending":
      return "ASPIRANTE";
    case "active":
      return "ACTIVO";
    case "inactive":
      return "RETIRADO";
    case "graduated":
      return "EGRESADO";
    case "ASPIRANTE":
    case "ACTIVO":
    case "RETIRADO":
    case "EGRESADO":
      return status;
    default:
      return "ASPIRANTE";
  }
}

function splitFullName(fullName = ""): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstname: "", lastname: "" };
  return {
    firstname: parts[0] ?? "",
    lastname: parts.slice(1).join(" "),
  };
}

function normalizeStudentRecord(
  record: LegacyStudentRecord,
  index: number,
): Student {
  const names = splitFullName(
    record.fullName ?? `${record.firstname ?? ""} ${record.lastname ?? ""}`,
  );
  const numericId = Number(record.id);
  const fieldValues = record.fieldValues ?? {};

  return {
    id: Number.isFinite(numericId) ? numericId : index + 1,
    firstname: record.firstname ?? names.firstname,
    lastname: record.lastname ?? names.lastname,
    homeAddress:
      record.homeAddress ??
      String(fieldValues.homeAddress ?? fieldValues.address ?? ""),
    city: (record.city ?? String(fieldValues.city ?? "")) || undefined,
    department:
      (record.department ?? String(fieldValues.department ?? "")) || undefined,
    strata: (record.strata ?? String(fieldValues.strata ?? "")) || undefined,
    hasLunch: record.hasLunch ?? parseBoolean(fieldValues.hasLunch),
    hasTransport: record.hasTransport ?? parseBoolean(fieldValues.hasTransport),
    status: normalizeStatus(record.status),
    photoURL: record.photoURL ?? record.photoUrl,
  };
}

function normalizeStudents(records: LegacyStudentRecord[]): Student[] {
  return records.map((record, index) => normalizeStudentRecord(record, index));
}

function normalizeGuardianRecord(
  record: Partial<Guardian> & { id?: string | number },
  index: number,
): Guardian {
  const numericId = Number(record.id);
  return {
    id: Number.isFinite(numericId) ? numericId : index + 1,
    firstName: String(record.firstName ?? ""),
    lastName: String(record.lastName ?? ""),
    kinship: String(record.kinship ?? ""),
    occupation: String(record.occupation ?? ""),
    workplace: String(record.workplace ?? ""),
    homeAddress: String(record.homeAddress ?? ""),
    city: String(record.city ?? ""),
    department: String(record.department ?? ""),
    phone: String(record.phone ?? ""),
    email: String(record.email ?? ""),
    birthdate: record.birthdate ? new Date(record.birthdate) : undefined,
    placeOfBirth: record.placeOfBirth || undefined,
    documentType: String(record.documentType ?? ""),
    documentNumber: String(record.documentNumber ?? ""),
    isMainGuardian: Boolean(record.isMainGuardian),
    isPaymentResponsible: Boolean(record.isPaymentResponsible),
  };
}

function normalizeGuardians(
  records: Array<Partial<Guardian> & { id?: string | number }>,
): Guardian[] {
  return records.map((record, index) => normalizeGuardianRecord(record, index));
}

function nextNumericId(records: Array<{ id: number }>): number {
  return records.length
    ? Math.max(...records.map((record) => record.id)) + 1
    : 1;
}

function matchesStudent(student: Student, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    student.firstname,
    student.lastname,
    student.homeAddress,
    student.city,
    student.department,
    student.strata,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

function isActiveStudent(status: Student["status"]): boolean {
  return status === "ASPIRANTE" || status === "ACTIVO";
}

function cloneStudent(student: Student): Student {
  return { ...student };
}

export const useEstudiantesStore = defineStore("estudiantes", {
  state: () => {
    const persisted = readJSON<LegacyStudentRecord[]>(storageKey, []);
    const seed: LegacyStudentRecord[] = [
      {
        id: 1,
        firstname: "María",
        lastname: "González",
        homeAddress: "Calle 123 #45-67",
        city: "Bogotá",
        department: "Cundinamarca",
        strata: "3",
        hasLunch: true,
        hasTransport: false,
        status: "ACTIVO",
        photoURL: "",
      },
      {
        id: 2,
        firstname: "Juan",
        lastname: "Pérez",
        homeAddress: "Carrera 10 #5-20",
        city: "Medellín",
        department: "Antioquia",
        strata: "2",
        hasLunch: false,
        hasTransport: true,
        status: "ASPIRANTE",
        photoURL: "",
      },
      {
        id: 3,
        firstname: "Lucía",
        lastname: "Ramírez",
        homeAddress: "Av. Siempre Viva 742",
        city: "Cali",
        department: "Valle del Cauca",
        strata: "4",
        hasLunch: true,
        hasTransport: true,
        status: "RETIRADO",
        photoURL: "",
      },
      {
        id: 4,
        firstname: "Carlos",
        lastname: "Santos",
        homeAddress: "Paseo 9 #11",
        city: "Barranquilla",
        department: "Atlántico",
        strata: "3",
        hasLunch: false,
        hasTransport: false,
        status: "EGRESADO",
        photoURL: "",
      },
    ];
    const initial = persisted.length ? persisted : seed;
    // If there was no persisted data, persist the seed so subsequent loads read it
    if (!persisted.length)
      writeJSON(storageKey, initial as LegacyStudentRecord[]);

    return {
      estudiantes: normalizeStudents(initial),
      guardians: {
        1: normalizeGuardians([
          {
            id: 1,
            firstName: "Ana",
            lastName: "González",
            kinship: "Madre",
            occupation: "Contadora",
            workplace: "Empresa S.A.",
            homeAddress: "Calle 123 #45-67",
            city: "Bogotá",
            department: "Cundinamarca",
            phone: "3001234567",
            email: "ana@example.com",
            documentType: "CC",
            documentNumber: "12345678",
            isMainGuardian: true,
            isPaymentResponsible: true,
          },
        ]),
      } as Record<number, Guardian[]>,
      loading: false,
      loadingGuardians: false,
    };
  },
  getters: {
    estudiantesFiltrados: (state) => {
      return (query = "", filters: StudentFilter = {}) => {
        const normalizedQuery = query.trim().toLowerCase();
        return state.estudiantes
          .filter((student) => isActiveStudent(student.status))
          .filter((student) => {
            const matchesQuery =
              !normalizedQuery ||
              `${student.firstname} ${student.lastname}`
                .toLowerCase()
                .includes(normalizedQuery);
            const matchesStatus =
              !filters.status ||
              filters.status === "all" ||
              student.status === filters.status;
            const matchesCity =
              !filters.city ||
              filters.city === "all" ||
              (student.city ?? "") === filters.city;
            return matchesQuery && matchesStatus && matchesCity;
          })
          .sort((a, b) =>
            `${a.firstname} ${a.lastname}`.localeCompare(
              `${b.firstname} ${b.lastname}`,
              "es",
            ),
          );
      };
    },
    exalumnos: (state) => {
      return state.estudiantes
        .filter(
          (student) =>
            student.status === "RETIRADO" || student.status === "EGRESADO",
        )
        .sort((a, b) =>
          `${a.firstname} ${a.lastname}`.localeCompare(
            `${b.firstname} ${b.lastname}`,
            "es",
          ),
        );
    },
  },
  actions: {
    persistStudents() {
      writeJSON(storageKey, this.estudiantes);
    },
    async fetchEstudiantes() {
      this.loading = true;
      try {
        const estudiantes =
          (await estudiantesService.getAll()) as LegacyStudentRecord[];
        const normalized = normalizeStudents(estudiantes);
        // If the external/local source returned entries, use them.
        // Otherwise keep the current (seeded) in-memory list and persist it.
        if (normalized.length) {
          this.estudiantes = normalized;
          this.persistStudents();
          return this.estudiantes;
        }
        // Persist current seeded data so subsequent loads read it from storage
        this.persistStudents();
        return this.estudiantes;
      } finally {
        this.loading = false;
      }
    },
    async createEstudiante(data: LegacyStudentRecord | Omit<Student, "id">) {
      const normalizedStudent = normalizeStudentRecord(
        {
          ...data,
          id: Number("id" in data ? data.id : NaN),
          status: normalizeStatus((data as LegacyStudentRecord).status),
          photoURL:
            (data as LegacyStudentRecord).photoURL ??
            (data as LegacyStudentRecord).photoUrl,
          firstname: (data as { firstname?: string }).firstname,
          lastname: (data as { lastname?: string }).lastname,
        } as LegacyStudentRecord,
        this.estudiantes.length,
      );
      const nextStudent: Student = {
        ...normalizedStudent,
        id: nextNumericId(this.estudiantes),
      };
      this.estudiantes = [cloneStudent(nextStudent), ...this.estudiantes];
      this.persistStudents();
      await estudiantesService.create(
        nextStudent as unknown as Record<string, unknown>,
      );
      return nextStudent;
    },
    async updateEstudiante(
      id: string | number,
      data: Partial<Student> | Partial<LegacyStudentRecord>,
    ) {
      const normalizedId = Number(id);
      const current = this.estudiantes.find(
        (student) => student.id === normalizedId,
      );
      const updated = current
        ? cloneStudent({
            ...current,
            ...data,
            id: normalizedId,
            status: normalizeStatus(
              (data as LegacyStudentRecord).status ?? current.status,
            ),
            photoURL:
              (data as LegacyStudentRecord).photoURL ??
              (data as LegacyStudentRecord).photoUrl ??
              current.photoURL,
          } as Student)
        : null;

      this.estudiantes = this.estudiantes.map((student) =>
        student.id === normalizedId && updated ? updated : student,
      );
      this.persistStudents();
      await estudiantesService.update(
        id,
        (updated ?? data) as Record<string, unknown>,
      );
      return updated;
    },
    async deleteEstudiante(id: string | number) {
      const normalizedId = Number(id);
      this.estudiantes = this.estudiantes.filter(
        (student) => student.id !== normalizedId,
      );
      this.persistStudents();
      await estudiantesService.delete(id);
    },
    async fetchGuardians(studentId: number) {
      // Cache guard: if we already have guardians for this student, return cached
      if (this.guardians[studentId]) {
        return this.guardians[studentId];
      }
      this.loadingGuardians = true;
      try {
        const guardians = (await estudiantesService.getGuardians(
          studentId,
        )) as Array<Partial<Guardian> & { id?: string | number }>;
        this.guardians[studentId] = normalizeGuardians(guardians);
        return this.guardians[studentId];
      } finally {
        this.loadingGuardians = false;
      }
    },
    async createGuardian(studentId: number, data: Omit<Guardian, "id">) {
      const guardians = this.guardians[studentId] ?? [];
      const nextGuardian: Guardian = {
        ...data,
        id: nextNumericId(guardians),
        birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
        isMainGuardian: Boolean(data.isMainGuardian),
        isPaymentResponsible: Boolean(data.isPaymentResponsible),
      };
      const nextGuardians = nextGuardian.isMainGuardian
        ? guardians.map((guardian) => ({ ...guardian, isMainGuardian: false }))
        : guardians.map((guardian) => ({ ...guardian }));
      this.guardians[studentId] = normalizeGuardians([
        ...nextGuardians,
        nextGuardian,
      ]);
      await estudiantesService.createGuardian(
        studentId,
        nextGuardian as unknown as Record<string, unknown>,
      );
      return nextGuardian;
    },
    async updateGuardian(
      studentId: number,
      guardianId: number,
      data: Partial<Guardian>,
    ) {
      const guardians = this.guardians[studentId] ?? [];
      const updatedGuardians = guardians.map((guardian) => {
        if (guardian.id !== guardianId) {
          return data.isMainGuardian
            ? { ...guardian, isMainGuardian: false }
            : guardian;
        }
        return {
          ...guardian,
          ...data,
          birthdate: data.birthdate
            ? new Date(data.birthdate)
            : guardian.birthdate,
          isMainGuardian: Boolean(
            data.isMainGuardian ?? guardian.isMainGuardian,
          ),
          isPaymentResponsible: Boolean(
            data.isPaymentResponsible ?? guardian.isPaymentResponsible,
          ),
        };
      });
      this.guardians[studentId] = normalizeGuardians(updatedGuardians);
      const updatedGuardian =
        this.guardians[studentId].find(
          (guardian) => guardian.id === guardianId,
        ) ?? null;
      await estudiantesService.updateGuardian(
        studentId,
        guardianId,
        (updatedGuardian ?? data) as Record<string, unknown>,
      );
      return updatedGuardian;
    },
    async deleteGuardian(studentId: number, guardianId: number) {
      this.guardians[studentId] = (this.guardians[studentId] ?? []).filter(
        (guardian) => guardian.id !== guardianId,
      );
      await estudiantesService.deleteGuardian(studentId, guardianId);
    },
  },
});
