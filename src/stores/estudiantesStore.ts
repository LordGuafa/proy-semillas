import { defineStore } from "pinia";
import { studentService, guardianService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";
import type { Guardian } from "@/types/guardian";
import type { Student } from "@/types/student";

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
  documentoIdentidad?: string;
  tipoDocumento?: Student["tipoDocumento"];
  correoElectronico?: string;
  telefono?: string;
  fechaNacimiento?: string;
  paisNacimiento?: string;
  departamentoNacimiento?: string;
  ciudadNacimiento?: string;
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
  const numericId = Number(
    record.id ?? (record as any).id_persona ?? (record as any).id_persona,
  );
  const fieldValues = record.fieldValues ?? {};

  const primerNombre =
    (record as any).primer_nombre ?? record.firstname ?? names.firstname ?? "";
  const primerApellido =
    (record as any).primer_apellido ?? record.lastname ?? names.lastname ?? "";

  return {
    id: Number.isFinite(numericId) ? numericId : index + 1,
    usuarioSistemaId: undefined,
    documentoIdentidad: String(
      (record as any).documento_identidad ??
        record.documentoIdentidad ??
        fieldValues.documentoIdentidad ??
        fieldValues.documentNumber ??
        "",
    ),
    tipoDocumento: String(
      (record as any).tipo_documento ??
        record.tipoDocumento ??
        fieldValues.tipoDocumento ??
        "CC",
    ) as Student["tipoDocumento"],
    primerNombre: primerNombre,
    segundoNombre: (record as any).segundo_nombre ?? undefined,
    primerApellido: primerApellido,
    segundoApellido: (record as any).segundo_apellido ?? undefined,
    correoElectronico:
      String(
        (record as any).correo_electronico ??
          record.correoElectronico ??
          fieldValues.correoElectronico ??
          "",
      ) || undefined,
    telefono:
      String(
        (record as any).telefono ??
          record.telefono ??
          fieldValues.telefono ??
          "",
      ) || undefined,
    fechaNacimiento:
      String(
        (record as any).fecha_nacimiento ??
          record.fechaNacimiento ??
          fieldValues.fechaNacimiento ??
          "",
      ) || undefined,
    paisNacimiento:
      String(
        (record as any).pais_nacimiento ??
          record.paisNacimiento ??
          fieldValues.paisNacimiento ??
          "",
      ) || undefined,
    departamentoNacimiento:
      String(
        (record as any).departamento_nacimiento ??
          record.departamentoNacimiento ??
          fieldValues.departamentoNacimiento ??
          "",
      ) || undefined,
    ciudadNacimiento:
      String(
        (record as any).ciudad_nacimiento ??
          record.ciudadNacimiento ??
          fieldValues.ciudadNacimiento ??
          "",
      ) || undefined,
    createdAt: String(
      (record as any).created_at ??
        (record as { createdAt?: string }).createdAt ??
        new Date().toISOString(),
    ),
    updatedAt: String(
      (record as any).updated_at ??
        (record as { updatedAt?: string }).updatedAt ??
        new Date().toISOString(),
    ),
    direccionResidencia:
      (record as any).direccion_residencia ??
      record.homeAddress ??
      String(fieldValues.homeAddress ?? fieldValues.address ?? ""),
    ciudadResidencia:
      ((record as any).ciudad_residencia ??
        record.city ??
        String(fieldValues.city ?? "")) ||
      undefined,
    departamentoResidencia:
      ((record as any).departamento_residencia ??
        record.department ??
        String(fieldValues.department ?? "")) ||
      undefined,
    estrato:
      Number(
        (record as any).estrato ?? record.strata ?? fieldValues.strata ?? 0,
      ) || 0,
    tieneAlmuerzo:
      (record as any).tiene_almuerzo ??
      record.hasLunch ??
      parseBoolean(fieldValues.hasLunch),
    tieneTranporteRuta:
      (record as any).tiene_transporte_ruta ??
      record.hasTransport ??
      parseBoolean(fieldValues.hasTransport),
    fotoUrl: (record as any).foto_url ?? record.photoURL ?? record.photoUrl,
    estado: normalizeStatus(
      (record as any).estado ?? record.status,
    ) as Student["estado"],
    status: normalizeStatus((record as any).estado ?? record.status),
    firstname: primerNombre,
    lastname: primerApellido,
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
    segundoNombre:
      String(record.secondName ?? record.segundoNombre ?? "") || undefined,
    primerApellido: String(record.lastName ?? record.primerApellido ?? ""),
    segundoApellido:
      String(record.secondLastName ?? record.segundoApellido ?? "") ||
      undefined,
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

function cleanOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text ? text : undefined;
}

function cleanOptionalDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime())
    ? undefined
    : date.toISOString().slice(0, 10);
}

function buildGuardianApiPayload(
  guardian: Partial<Guardian>,
  studentId: number,
): Record<string, unknown> {
  // ✅ Extraer campos requeridos primero para poder loguearlos si faltan
  const primerNombre = cleanOptionalString(
    guardian.firstName ?? guardian.primerNombre,
  );
  const primerApellido = cleanOptionalString(
    guardian.lastName ?? guardian.primerApellido,
  );
  const parentesco = cleanOptionalString(
    guardian.kinship ?? guardian.parentesco,
  );
  const documentoIdentidad = cleanOptionalString(
    guardian.documentNumber ?? guardian.documentoIdentidad,
  );

  if (import.meta.env.DEV) {
    if (
      !primerNombre ||
      !primerApellido ||
      !parentesco ||
      !documentoIdentidad
    ) {
      console.error("[buildGuardianApiPayload] Campos requeridos faltantes:", {
        primerNombre,
        primerApellido,
        parentesco,
        documentoIdentidad,
        guardianRecibido: guardian,
      });
    }
  }

  const payload: Record<string, unknown> = {
    documento_identidad: documentoIdentidad,
    tipo_documento:
      cleanOptionalString(
        guardian.documentType ?? guardian.tipoDocumento ?? "CC",
      ) ?? "CC",
    primer_nombre: primerNombre,
    primer_apellido: primerApellido,
    parentesco,
    id_estudiante: studentId,
    es_responsable_pago: Boolean(
      guardian.isPaymentResponsible ?? guardian.esResponsablePago,
    ),
  };

  const optionalFields = {
    segundo_nombre: cleanOptionalString(
      guardian.secondName ?? guardian.segundoNombre, // ✅ secondName ahora llega correctamente
    ),
    segundo_apellido: cleanOptionalString(
      guardian.secondLastName ?? guardian.segundoApellido, // ✅ secondLastName ahora llega correctamente
    ),
    correo_electronico: cleanOptionalString(
      guardian.email ?? guardian.correoElectronico,
    ),
    telefono: cleanOptionalString(guardian.phone ?? guardian.telefono),
    fecha_nacimiento: cleanOptionalDate(guardian.birthdate), // ✅ cleanOptionalDate maneja el string directamente
    ocupacion: cleanOptionalString(guardian.occupation ?? guardian.ocupacion),
    nombre_empresa_trabajo: cleanOptionalString(
      guardian.workplace ?? guardian.nombreEmpresaTrabajo,
    ),
    direccion_casa: cleanOptionalString(
      guardian.homeAddress ?? guardian.direccionCasa,
    ),
    ciudad_casa: cleanOptionalString(guardian.city ?? guardian.ciudadCasa),
    departamento_casa: cleanOptionalString(
      guardian.department ?? guardian.departamentoCasa,
    ),
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value !== undefined) {
      payload[key] = value;
    }
  });

  return payload;
}

function isConflictError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status === 409;
}

function extractApiErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const response = (
    error as {
      response?: { data?: unknown; status?: number };
    }
  ).response;
  const data = response?.data as
    | { detail?: unknown; message?: unknown }
    | string
    | undefined;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const detail = data.detail ?? data.message;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail)) return detail.map(String).join("; ");
  }

  return null;
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
        // DEBUG: log API call and response to help trace missing students
        // eslint-disable-next-line no-console
        console.log("[estudiantes] fetching /students/all...");
        const resp = await studentService.getAll();
        // eslint-disable-next-line no-console
        console.log(
          "[estudiantes] raw response:",
          resp && resp.data ? resp.data : resp,
        );
        const data = resp.data ?? {};
        const estudiantesArr = Array.isArray((data as any).students)
          ? (data as any).students
          : Array.isArray(data)
            ? (data as any)
            : [];
        const normalized = normalizeStudents(
          estudiantesArr as LegacyStudentRecord[],
        );
        // eslint-disable-next-line no-console
        console.log(
          "[estudiantes] normalized count:",
          normalized.length,
          "sample:",
          normalized.slice(0, 3),
        );
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
      await studentService.create(
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
      await studentService.update(
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
      await studentService.delete(id);
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
        const resp = (await guardianService.getByStudent(studentId)) as unknown;
        const raw = (resp && (resp as any).data) ?? resp;
        let guardians: Array<Partial<Guardian> & { id?: string | number }> = [];
        if (Array.isArray(raw)) {
          guardians = raw;
        } else if (raw && Array.isArray((raw as any).parents)) {
          guardians = (raw as any).parents;
        } else if (raw && Array.isArray((raw as any).acudientes)) {
          guardians = (raw as any).acudientes;
        } else if (raw && Array.isArray((raw as any).guardians)) {
          guardians = (raw as any).guardians;
        } else if (raw && (raw as any).parent) {
          guardians = [(raw as any).parent];
        } else {
          guardians = [];
        }

        // Map backend snake_case fields to the shapes expected by normalizeGuardianRecord/UI
        const mapped = guardians.map((g: any) => ({
          // ids
          id: g.id ?? g.id_persona ?? g.idPersona,
          usuarioSistemaId:
            g.usuario_sistema_id ?? g.usuarioSistemaId ?? g.usuario_sistema_id,
          // document
          documentoIdentidad:
            g.documento_identidad ?? g.documentoIdentidad ?? g.document_number,
          documentNumber:
            g.documento_identidad ?? g.documentNumber ?? g.documento_identidad,
          tipoDocumento: g.tipo_documento ?? g.tipoDocumento,
          documentType: g.tipo_documento ?? g.documentType,
          // names
          primerNombre: g.primer_nombre ?? g.primerNombre ?? g.firstName,
          firstName: g.primer_nombre ?? g.firstName,
          segundoNombre: g.segundo_nombre ?? g.segundoNombre ?? g.secondName,
          primerApellido: g.primer_apellido ?? g.primerApellido ?? g.lastName,
          segundoApellido: g.segundo_apellido ?? g.segundoApellido,
          // contact
          correoElectronico:
            g.correo_electronico ?? g.correoElectronico ?? g.email,
          email: g.correo_electronico ?? g.email,
          telefono: g.telefono ?? g.phone,
          phone: g.telefono ?? g.phone,
          // birth & place
          fechaNacimiento:
            g.fecha_nacimiento ?? g.fechaNacimiento ?? g.birthdate,
          birthdate: g.fecha_nacimiento
            ? new Date(g.fecha_nacimiento)
            : g.birthdate
              ? new Date(g.birthdate)
              : undefined,
          paisNacimiento: g.pais_nacimiento ?? g.paisNacimiento,
          departamentoNacimiento:
            g.departamento_nacimiento ?? g.departamentoNacimiento,
          ciudadNacimiento: g.ciudad_nacimiento ?? g.ciudadNacimiento,
          // address
          direccionCasa: g.direccion_casa ?? g.homeAddress ?? g.direccionCasa,
          homeAddress: g.direccion_casa ?? g.homeAddress,
          ciudadCasa: g.ciudad_casa ?? g.city ?? g.ciudadCasa,
          city: g.ciudad_casa ?? g.city,
          departamentoCasa:
            g.departamento_casa ?? g.department ?? g.departamentoCasa,
          department: g.departamento_casa ?? g.department,
          nombreEmpresaTrabajo:
            g.nombre_empresa_trabajo ?? g.workplace ?? g.nombreEmpresaTrabajo,
          workplace: g.nombre_empresa_trabajo ?? g.workplace,
          ocupacion: g.ocupacion ?? g.occupation,
          occupation: g.ocupacion ?? g.occupation,
          // flags
          esPrincipal:
            g.es_principal_estudiante ??
            g.es_principal ??
            g.isMainGuardian ??
            false,
          isMainGuardian: Boolean(
            g.es_principal_estudiante ??
            g.is_principal ??
            g.isMainGuardian ??
            false,
          ),
          esResponsablePago:
            g.es_responsable_pago ??
            g.esResponsablePago ??
            g.isPaymentResponsible ??
            false,
          isPaymentResponsible: Boolean(
            g.es_responsable_pago ??
            g.esResponsablePago ??
            g.isPaymentResponsible ??
            false,
          ),
          // metadata
          createdAt: g.created_at ?? g.createdAt,
          updatedAt: g.updated_at ?? g.updatedAt,
          parentesco: g.parentesco ?? g.kinship,
          kinship: g.parentesco ?? g.kinship,
          fotoUrl: g.firma_url ?? g.foto_url ?? g.firmaUrl,
        }));

        this.guardians[studentId] = normalizeGuardians(mapped as any);
        return this.guardians[studentId];
      } finally {
        this.loadingGuardians = false;
      }
    },
    async createGuardian(studentId: number, data: Omit<Guardian, "id">) {
      if (!Number.isFinite(studentId) || studentId <= 0) {
        throw new Error("ID de estudiante invalido para crear acudiente.");
      }
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

      if (nextGuardian.isMainGuardian) {
        await Promise.all(
          guardians
            .filter((guardian) => guardian.isMainGuardian)
            .map((guardian) =>
              this.updateGuardian(studentId, guardian.id, {
                ...guardian,
                isMainGuardian: false,
              }),
            ),
        );
      }
      console.log("[createGuardian] nextGuardian antes de buildPayload:", {
        firstName: nextGuardian.firstName,
        lastName: nextGuardian.lastName,
        kinship: nextGuardian.kinship,
        documentNumber: nextGuardian.documentNumber,
        secondName: nextGuardian.secondName,
        primerNombre: nextGuardian.primerNombre,
        primerApellido: nextGuardian.primerApellido,
      });
      const payload = buildGuardianApiPayload(nextGuardian, studentId);
      console.log("[createGuardian] payload construido:", payload); // ← Y ESTO

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("[estudiantes] createGuardian payload:", payload);
      }

      try {
        await guardianService.create(payload);
        return nextGuardian;
      } catch (error) {
        const apiMessage = extractApiErrorMessage(error);
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error("[estudiantes] createGuardian failed:", error);
        }
        if (isConflictError(error)) {
          await this.fetchGuardians(studentId);
          const documentNumber = String(
            data.documentNumber ?? data.documentoIdentidad ?? "",
          )
            .trim()
            .toLowerCase();
          const existingGuardian = (this.guardians[studentId] ?? []).find(
            (guardian) =>
              String(
                guardian.documentNumber ?? guardian.documentoIdentidad ?? "",
              )
                .trim()
                .toLowerCase() === documentNumber,
          );

          if (existingGuardian) {
            return this.updateGuardian(studentId, existingGuardian.id, data);
          }
        }

        throw error;
      }
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
      await guardianService.updateInfo(
        guardianId,
        buildGuardianApiPayload(updatedGuardian ?? data, studentId),
      );
      return updatedGuardian;
    },
    async deleteGuardian(studentId: number, guardianId: number) {
      this.guardians[studentId] = (this.guardians[studentId] ?? []).filter(
        (guardian) => guardian.id !== guardianId,
      );
      await guardianService.delete(guardianId, studentId);
    },
  },
});
