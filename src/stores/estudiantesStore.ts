import { defineStore } from "pinia";
import { estudiantesService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";
import type { Guardian } from "@/types/guardian";
import type { Student } from "@/types/student";

type StudentFilter = {
  status?: Student["status"] | "all";
  city?: string;
};

type LegacyStudentRecord = {
  id?: string | number;
  id_persona?: string | number;
  fullName?: string;
  firstname?: string;
  firstName?: string;
  lastname?: string;
  lastName?: string;
  primer_nombre?: string;
  segundo_nombre?: string | null;
  primer_apellido?: string;
  segundo_apellido?: string | null;
  homeAddress?: string;
  direccion_residencia?: string;
  city?: string;
  ciudad_residencia?: string | null;
  department?: string;
  departamento_residencia?: string | null;
  strata?: string;
  estrato?: number | string;
  hasLunch?: boolean;
  tiene_almuerzo?: boolean;
  hasTransport?: boolean;
  tiene_transporte_ruta?: boolean;
  status: "pending" | "active" | "inactive" | "graduated" | Student["status"];
  estado?: Student["status"];
  photoURL?: string;
  photoUrl?: string;
  foto_url?: string | null;
  documentoIdentidad?: string;
  documento_identidad?: string;
  tipoDocumento?: Student["tipoDocumento"];
  tipo_documento?: Student["tipoDocumento"];
  correoElectronico?: string;
  correo_electronico?: string | null;
  telefono?: string;
  created_at?: string;
  updated_at?: string;
  fechaNacimiento?: string;
  fecha_nacimiento?: string;
  paisNacimiento?: string;
  pais_nacimiento?: string | null;
  departamentoNacimiento?: string;
  departamento_nacimiento?: string | null;
  ciudadNacimiento?: string;
  ciudad_nacimiento?: string | null;
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
  const numericId = Number(record.id ?? record.id_persona);
  const fieldValues = record.fieldValues ?? {};
  const primerNombre =
    record.primer_nombre ?? record.firstname ?? record.firstName ?? names.firstname ?? "";
  const segundoNombre = record.segundo_nombre ?? undefined;
  const primerApellido =
    record.primer_apellido ?? record.lastname ?? record.lastName ?? names.lastname ?? "";
  const segundoApellido = record.segundo_apellido ?? undefined;
  const direccionResidencia =
    record.direccion_residencia ?? record.homeAddress ?? String(fieldValues.homeAddress ?? fieldValues.address ?? "");
  const ciudadResidencia =
    record.ciudad_residencia ?? record.city ?? (String(fieldValues.city ?? "") ? String(fieldValues.city ?? "") : undefined);
  const departamentoResidencia =
    record.departamento_residencia ?? record.department ?? (String(fieldValues.department ?? "") ? String(fieldValues.department ?? "") : undefined);
  const estrato = Number(record.estrato ?? record.strata ?? fieldValues.strata ?? 0) || 0;
  const estado = normalizeStatus(record.estado ?? record.status);
  const documentoIdentidad = String(
    record.documento_identidad ??
    record.documentoIdentidad ??
    fieldValues.documentoIdentidad ??
    fieldValues.documentNumber ??
    "",
  );
  const tipoDocumento = String(
    record.tipo_documento ?? record.tipoDocumento ?? fieldValues.tipoDocumento ?? "CC",
  ) as Student["tipoDocumento"];
  const correoElectronico =
    String(record.correo_electronico ?? record.correoElectronico ?? fieldValues.correoElectronico ?? "") || undefined;
  const telefono = String(record.telefono ?? fieldValues.telefono ?? "") || undefined;
  const fechaNacimiento =
    String(record.fecha_nacimiento ?? record.fechaNacimiento ?? fieldValues.fechaNacimiento ?? "") || undefined;
  const paisNacimiento =
    String(record.pais_nacimiento ?? record.paisNacimiento ?? fieldValues.paisNacimiento ?? "") || undefined;
  const departamentoNacimiento =
    String(record.departamento_nacimiento ?? record.departamentoNacimiento ?? fieldValues.departamentoNacimiento ?? "") || undefined;
  const ciudadNacimiento =
    String(record.ciudad_nacimiento ?? record.ciudadNacimiento ?? fieldValues.ciudadNacimiento ?? "") || undefined;
  const photoUrl = record.foto_url ?? record.photoURL ?? record.photoUrl;

  return {
    id: Number.isFinite(numericId) ? numericId : index + 1,
    usuarioSistemaId: undefined,
    documentoIdentidad,
    tipoDocumento,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    correoElectronico,
    telefono,
    fechaNacimiento,
    paisNacimiento,
    departamentoNacimiento,
    ciudadNacimiento,
    createdAt: String(record.created_at ?? new Date().toISOString()),
    updatedAt: String(record.updated_at ?? new Date().toISOString()),
    direccionResidencia,
    ciudadResidencia,
    departamentoResidencia,
    estrato,
    tieneAlmuerzo: parseBoolean(record.tiene_almuerzo ?? record.hasLunch ?? fieldValues.hasLunch),
    tieneTranporteRuta: parseBoolean(record.tiene_transporte_ruta ?? record.hasTransport ?? fieldValues.hasTransport),
    fotoUrl: photoUrl ?? undefined,
    estado: estado as Student["estado"],
    status: estado,
    firstname: primerNombre,
    lastname: primerApellido,
    homeAddress: direccionResidencia,
    city: ciudadResidencia,
    department: departamentoResidencia,
    strata: String(estrato),
    hasLunch: parseBoolean(record.tiene_almuerzo ?? record.hasLunch ?? fieldValues.hasLunch),
    hasTransport: parseBoolean(record.tiene_transporte_ruta ?? record.hasTransport ?? fieldValues.hasTransport),
    photoURL: photoUrl ?? undefined,
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
    usuarioSistemaId: undefined,
    documentoIdentidad: String(
      record.documentNumber ?? record.documentoIdentidad ?? "",
    ),
    tipoDocumento: String(
      record.documentType ?? record.tipoDocumento ?? "CC",
    ) as Guardian["tipoDocumento"],
    primerNombre: String(record.firstName ?? record.primerNombre ?? ""),
    segundoNombre: undefined,
    primerApellido: String(record.lastName ?? record.primerApellido ?? ""),
    segundoApellido: undefined,
    correoElectronico:
      String(record.email ?? record.correoElectronico ?? "") || undefined,
    telefono: String(record.phone ?? record.telefono ?? "") || undefined,
    fechaNacimiento: record.birthdate
      ? new Date(record.birthdate).toISOString()
      : undefined,
    paisNacimiento: undefined,
    departamentoNacimiento: undefined,
    ciudadNacimiento: undefined,
    createdAt: String(
      (record as { createdAt?: string }).createdAt ?? new Date().toISOString(),
    ),
    updatedAt: String(
      (record as { updatedAt?: string }).updatedAt ?? new Date().toISOString(),
    ),
    parentesco: String(record.kinship ?? record.parentesco ?? ""),
    ocupacion: String(record.occupation ?? record.ocupacion ?? "") || undefined,
    nombreEmpresaTrabajo:
      String(record.workplace ?? record.nombreEmpresaTrabajo ?? "") ||
      undefined,
    direccionCasa:
      String(record.homeAddress ?? record.direccionCasa ?? "") || undefined,
    ciudadCasa: String(record.city ?? record.ciudadCasa ?? "") || undefined,
    departamentoCasa:
      String(record.department ?? record.departamentoCasa ?? "") || undefined,
    esPrincipal: Boolean(record.isMainGuardian ?? record.esPrincipal),
    esResponsablePago: Boolean(
      record.isPaymentResponsible ?? record.esResponsablePago,
    ),
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

function mergeStudent(
  existing: Student | undefined,
  next: Partial<Student> & { id: number },
): Student {
  const base = existing ?? {
    id: next.id,
    firstname: "",
    lastname: "",
    homeAddress: "",
    city: undefined,
    department: undefined,
    strata: undefined,
    hasLunch: false,
    hasTransport: false,
    status: "ASPIRANTE" as Student["status"],
    photoURL: undefined,
  };
  return cloneStudent({ ...base, ...next, id: next.id } as Student);
}

export const useEstudiantesStore = defineStore("estudiantes", {
  state: () => {
    const persisted = readJSON<LegacyStudentRecord[]>(storageKey, []);

    return {
      estudiantes: normalizeStudents(persisted),
      guardians: {} as Record<number, Guardian[]>,
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
        const resp = await estudiantesService.getAll();
        const data = resp.data ?? {};
        const estudiantesArr = Array.isArray((data as any).students)
          ? (data as any).students
          : Array.isArray(data)
            ? (data as any)
            : [];
        const normalized = normalizeStudents(estudiantesArr as LegacyStudentRecord[]);
        this.estudiantes = normalized;
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
      const backup = [...this.estudiantes]; // guarda estado previo

      try {
        await estudiantesService.delete(id); // primero el servidor
        this.estudiantes = this.estudiantes.filter(
          (student) => student.id !== normalizedId,
        );
        this.persistStudents();
      } catch (error) {
        this.estudiantes = backup; // revierte si falla
        throw error; // propaga para que la UI pueda mostrar el error
      }
    },
    upsertEstudiante(student: Partial<Student> & { id: number }) {
      const normalizedStudent = mergeStudent(
        this.estudiantes.find(
          (existingStudent) => existingStudent.id === student.id,
        ),
        student,
      );
      this.estudiantes = this.estudiantes.some(
        (existingStudent) => existingStudent.id === student.id,
      )
        ? this.estudiantes.map((existingStudent) =>
          existingStudent.id === student.id
            ? normalizedStudent
            : existingStudent,
        )
        : [normalizedStudent, ...this.estudiantes];
      this.persistStudents();
      return normalizedStudent;
    },
    async fetchGuardians(studentId: number) {
      // Cache guard: if we already have guardians for this student, return cached
      if (this.guardians[studentId]) {
        return this.guardians[studentId];
      }
      this.loadingGuardians = true;
      try {
        const guardians =
          (
            (await estudiantesService.getGuardians(studentId)) as unknown as {
              data?: Array<Partial<Guardian> & { id?: string | number }>;
            }
          ).data ?? [];
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
