import { defineStore } from "pinia";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import { matriculasService } from "@/services/api";
import type Matricula from "@/types/matricula";
import { type MatriculaStatus, type FormSnapshot } from "@/types/matricula";

type MatriculasResponse =
  | Matricula[]
  | {
      items?: Matricula[];
      pagination?: Partial<MatriculasPagination>;
      data?: Matricula[];
    };

export interface MatriculasFilters {
  search: string;
  status: MatriculaStatus | "";
  dateFrom: string;
  dateTo: string;
}

export interface MatriculasPagination {
  page: number;
  perPage: number;
  total: number;
}

export interface MatriculasState {
  matriculas: Matricula[];
  selected: Matricula | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
  pagination: MatriculasPagination;
  filters: MatriculasFilters;
}

type ApiRecord = Record<string, unknown>;

function toRecord(value: unknown): Record<string, string | boolean | number> {
  if (!value || typeof value !== "object") return {};
  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, string | boolean | number>
  >((accumulator, [key, rawValue]) => {
    if (
      typeof rawValue === "string" ||
      typeof rawValue === "boolean" ||
      typeof rawValue === "number"
    ) {
      accumulator[key] = rawValue;
    }
    return accumulator;
  }, {});
}

function normalizeStatus(value: unknown): MatriculaStatus {
  const status = String(value ?? "").toUpperCase();
  if (
    status === "PENDIENTE" ||
    status === "EN_REVISION" ||
    status === "ENTREVISTA" ||
    status === "APROBADA" ||
    status === "RECHAZADA"
  ) {
    return status;
  }
  return "PENDIENTE";
}

function normalizeFormSnapshot(value: unknown): FormSnapshot {
  const snapshot =
    value && typeof value === "object" ? (value as Partial<FormSnapshot>) : {};
  return {
    campos: Array.isArray(snapshot.campos)
      ? snapshot.campos
          .map((campo) => ({
            id: String(campo?.id ?? ""),
            label: String(campo?.label ?? ""),
            type: String(campo?.type ?? "text"),
            value:
              campo?.value === null ||
              typeof campo?.value === "string" ||
              typeof campo?.value === "boolean" ||
              typeof campo?.value === "number"
                ? campo.value
                : null,
          }))
          .filter((campo) => Boolean(campo.id || campo.label))
      : [],
  };
}

function normalizeMatricula(record: unknown): Matricula {
  const data = (
    record && typeof record === "object" ? record : {}
  ) as ApiRecord;
  const numericId = Number(data.id);
  return {
    id: Number.isFinite(numericId) ? numericId : Date.now(),
    submittedAt: String(data.submittedAt ?? new Date().toISOString()),
    status: normalizeStatus(data.status),
    interviewDate: data.interviewDate ? String(data.interviewDate) : undefined,
    assignedTo: data.assignedTo ? String(data.assignedTo) : undefined,
    studentData: toRecord(
      data.studentData ?? data.alumno ?? data.student ?? {},
    ),
    guardianData: data.guardianData ? toRecord(data.guardianData) : undefined,
    photoURL: data.photoURL ? String(data.photoURL) : undefined,
    studentId:
      data.studentId !== undefined && data.studentId !== null
        ? Number(data.studentId)
        : undefined,
    formSnapshot: normalizeFormSnapshot(
      data.formSnapshot ?? data.form_snapshot ?? { campos: [] },
    ),
  };
}

function normalizeMatriculasResponse(response: MatriculasResponse | unknown): {
  items: Matricula[];
  pagination: MatriculasPagination;
} {
  if (Array.isArray(response)) {
    return {
      items: response.map((item) => normalizeMatricula(item)),
      pagination: {
        page: 1,
        perPage: response.length || 10,
        total: response.length,
      },
    };
  }

  const payload = (
    response && typeof response === "object" ? response : {}
  ) as {
    items?: unknown[];
    data?: unknown[];
    pagination?: Partial<MatriculasPagination>;
    total?: number;
    page?: number;
    perPage?: number;
  };
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.data)
      ? payload.data
      : [];
  const pagination = payload.pagination ?? {};
  const page = Number(pagination.page ?? payload.page ?? 1) || 1;
  const perPage =
    Number((pagination.perPage ?? payload.perPage ?? items.length) || 10) || 10;
  const total =
    Number(pagination.total ?? payload.total ?? items.length) || items.length;
  return {
    items: items.map((item) => normalizeMatricula(item)),
    pagination: { page, perPage, total },
  };
}

function fullNameFromStudentData(
  studentData: Record<string, string | boolean | number>,
): string {
  const firstName = String(
    studentData.firstname ?? studentData.firstName ?? studentData.name ?? "",
  );
  const lastName = String(studentData.lastname ?? studentData.lastName ?? "");
  const composed = `${firstName} ${lastName}`.trim();
  if (composed) return composed;
  const fallback = Object.values(studentData).find(
    (value) => typeof value === "string" && value.trim(),
  );
  return typeof fallback === "string" ? fallback : "";
}

function matchesSearch(matricula: Matricula, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;
  return fullNameFromStudentData(matricula.studentData)
    .toLowerCase()
    .includes(normalizedSearch);
}

function replaceMatricula(
  list: Matricula[],
  nextMatricula: Matricula,
): Matricula[] {
  const index = list.findIndex((item) => item.id === nextMatricula.id);
  if (index === -1) return [nextMatricula, ...list];
  const next = list.slice();
  next[index] = nextMatricula;
  return next;
}

export const useMatriculasStore = defineStore("matriculas", {
  state: (): MatriculasState => ({
    matriculas: [],
    selected: null,
    loading: false,
    loadingDetail: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 10,
      total: 0,
    },
    filters: {
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    },
  }),
  getters: {
    matriculasFiltradas: (state) => {
      return state.matriculas.filter((matricula) =>
        matchesSearch(matricula, state.filters.search),
      );
    },
    pendientesCount: (state) =>
      state.matriculas.filter((matricula) => matricula.status === "PENDIENTE")
        .length,
    enRevisionCount: (state) =>
      state.matriculas.filter((matricula) => matricula.status === "EN_REVISION")
        .length,
  },
  actions: {
    setError(message: string | null) {
      this.error = message;
    },
    syncMatricula(matricula: Matricula) {
      this.matriculas = replaceMatricula(this.matriculas, matricula);
      if (this.selected?.id === matricula.id) {
        this.selected = matricula;
      }
      return matricula;
    },
    async fetchMatriculas(params?: Partial<MatriculasFilters>) {
      this.loading = true;
      this.error = null;
      if (params) {
        this.filters = { ...this.filters, ...params };
        this.pagination.page = 1;
      }
      const query = {
        page: this.pagination.page,
        perPage: this.pagination.perPage,
        search: this.filters.search,
        status: this.filters.status,
        dateFrom: this.filters.dateFrom,
        dateTo: this.filters.dateTo,
      };
      try {
        const response = await matriculasService.getAll(query);
        const normalized = normalizeMatriculasResponse(response);
        this.matriculas = normalized.items;
        this.pagination = { ...this.pagination, ...normalized.pagination };
        return this.matriculas;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las matrículas.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchMatriculaById(id: number) {
      this.loadingDetail = true;
      this.error = null;
      try {
        const response = await matriculasService.getById(id);
        const matricula = normalizeMatricula(response);
        this.selected = matricula;
        this.syncMatricula(matricula);
        return matricula;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudo cargar el detalle de la matrícula.";
        throw error;
      } finally {
        this.loadingDetail = false;
      }
    },
    async updateStatus(id: number, status: MatriculaStatus, motivo?: string) {
      this.error = null;
      try {
        const response = await matriculasService.updateStatus(id, {
          status,
          motivo,
        });
        const current = this.matriculas.find((item) => item.id === id);
        const next = normalizeMatricula(
          response ?? { ...(current ?? { id }), id, status },
        );
        this.syncMatricula({
          ...next,
          id,
          status,
          assignedTo: next.assignedTo ?? current?.assignedTo,
          interviewDate: next.interviewDate ?? current?.interviewDate,
          studentId: next.studentId ?? current?.studentId,
        });
        return this.selected?.id === id ? this.selected : next;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado de la matrícula.";
        throw error;
      }
    },
    async assignInterview(id: number, date: string) {
      this.error = null;
      try {
        const response = await matriculasService.assignInterview(id, {
          interviewDate: date,
        });
        const current = this.matriculas.find((item) => item.id === id);
        const next = normalizeMatricula(
          response ?? {
            ...(current ?? { id }),
            id,
            interviewDate: date,
            status: "ENTREVISTA",
          },
        );
        this.syncMatricula({
          ...next,
          id,
          status: "ENTREVISTA",
          interviewDate: next.interviewDate ?? date,
        });
        return this.selected?.id === id ? this.selected : next;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudo agendar la entrevista.";
        throw error;
      }
    },
    async approveAndCreateStudent(id: number) {
      const estudiantesStore = useEstudiantesStore();
      this.error = null;
      try {
        const response = await matriculasService.approve(id);
        const current = this.matriculas.find((item) => item.id === id);
        const studentId =
          Number(
            (response as ApiRecord | null)?.studentId ??
              (response as ApiRecord | null)?.student_id ??
              current?.studentId ??
              0,
          ) || undefined;
        const next = normalizeMatricula(
          response ?? {
            ...(current ?? { id }),
            id,
            status: "APROBADA",
            studentId,
          },
        );
        this.syncMatricula({
          ...next,
          id,
          status: "APROBADA",
          studentId,
        });
        await estudiantesStore.fetchEstudiantes();
        return { studentId };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudo aprobar la matrícula.";
        throw error;
      }
    },
    async rejectMatricula(id: number, motivo: string) {
      return this.updateStatus(id, "RECHAZADA", motivo);
    },
  },
});
