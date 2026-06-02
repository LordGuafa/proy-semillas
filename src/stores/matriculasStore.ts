import { defineStore } from "pinia";
import { inscriptionService } from "@/services/api";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import type { EstadoAprobacion } from "@/types/enums";
import type { Inscripcion } from "@/types/inscripcion";

export interface InscripcionesFilters {
  search: string;
  estado: EstadoAprobacion | "";
  fechaDesde: string;
  fechaHasta: string;
}

export interface InscripcionesPagination {
  page: number;
  perPage: number;
  total: number;
}

export interface InscripcionesState {
  inscripciones: Inscripcion[];
  selected: Inscripcion | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
  pagination: InscripcionesPagination;
  filters: InscripcionesFilters;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : String(value ?? fallback);
}

function normalizeEstado(value: unknown): EstadoAprobacion {
  return value === "APROBADA" ? "APROBADA" : "PENDIENTE";
}

function normalizeInscripcion(value: unknown): Inscripcion {
  const data = toRecord(value);
  const fechaFallback = new Date().toISOString();
  return {
    id: toNumber(data.id, Date.now()),
    idEstudiante: toNumber(data.idEstudiante ?? data.id_estudiante),
    idAcudiente: toNumber(data.idAcudiente ?? data.id_acudiente),
    idEntrevista:
      data.idEntrevista !== undefined || data.id_entrevista !== undefined
        ? toNumber(data.idEntrevista ?? data.id_entrevista)
        : undefined,
    estado: normalizeEstado(data.estado),
    fechaInscripcion: toString(
      data.fechaInscripcion ?? data.fecha_inscripcion,
      fechaFallback,
    ),
    schemaVersion: toNumber(data.schemaVersion ?? data.schema_version),
    informacionForm: toRecord(data.informacionForm ?? data.informacion_form),
    createdAt: toString(data.createdAt ?? data.created_at, fechaFallback),
    updatedAt: toString(data.updatedAt ?? data.updated_at, fechaFallback),
    estudiante: data.estudiante
      ? (toRecord(data.estudiante) as unknown as Inscripcion["estudiante"])
      : undefined,
    acudiente: data.acudiente
      ? (toRecord(data.acudiente) as unknown as Inscripcion["acudiente"])
      : undefined,
    entrevista: data.entrevista
      ? (toRecord(data.entrevista) as unknown as Inscripcion["entrevista"])
      : undefined,
    formSchema: data.formSchema
      ? (toRecord(data.formSchema) as unknown as Inscripcion["formSchema"])
      : undefined,
  };
}

function normalizeCollection(response: unknown): {
  items: Inscripcion[];
  pagination: InscripcionesPagination;
} {
  if (Array.isArray(response)) {
    return {
      items: response.map((item) => normalizeInscripcion(item)),
      pagination: {
        page: 1,
        perPage: response.length || 10,
        total: response.length,
      },
    };
  }

  const payload = toRecord(response);
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.data)
      ? payload.data
      : [];
  const pagination = toRecord(payload.pagination);
  const page = toNumber(pagination.page ?? payload.page, 1) || 1;
  const perPage =
    toNumber(pagination.perPage ?? payload.perPage, items.length || 10) || 10;
  const total =
    toNumber(pagination.total ?? payload.total, items.length) || items.length;

  return {
    items: items.map((item) => normalizeInscripcion(item)),
    pagination: { page, perPage, total },
  };
}

function replaceInscripcion(
  list: Inscripcion[],
  next: Inscripcion,
): Inscripcion[] {
  const index = list.findIndex((item) => item.id === next.id);
  if (index === -1) return [next, ...list];
  const clone = list.slice();
  clone[index] = next;
  return clone;
}

function matchesSearch(inscripcion: Inscripcion, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [
    inscripcion.estudiante?.primerNombre,
    inscripcion.estudiante?.segundoNombre,
    inscripcion.estudiante?.primerApellido,
    inscripcion.estudiante?.segundoApellido,
    inscripcion.acudiente?.primerNombre,
    inscripcion.acudiente?.segundoNombre,
    inscripcion.acudiente?.primerApellido,
    inscripcion.acudiente?.segundoApellido,
    String(inscripcion.id),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized);
}

function matchesDateRange(
  inscripcion: Inscripcion,
  from: string,
  to: string,
): boolean {
  const fecha = inscripcion.fechaInscripcion.slice(0, 10);
  return (!from || fecha >= from) && (!to || fecha <= to);
}

export const useMatriculasStore = defineStore("matriculas", {
  state: (): InscripcionesState => ({
    inscripciones: [],
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
      estado: "",
      fechaDesde: "",
      fechaHasta: "",
    },
  }),
  getters: {
    inscripcionesFiltradas: (state) =>
      state.inscripciones.filter((inscripcion) => {
        const matchesEstado =
          !state.filters.estado || inscripcion.estado === state.filters.estado;
        return (
          matchesEstado &&
          matchesSearch(inscripcion, state.filters.search) &&
          matchesDateRange(
            inscripcion,
            state.filters.fechaDesde,
            state.filters.fechaHasta,
          )
        );
      }),
    matriculasFiltradas: (state) =>
      state.inscripciones.filter((inscripcion) => {
        const matchesEstado =
          !state.filters.estado || inscripcion.estado === state.filters.estado;
        return (
          matchesEstado &&
          matchesSearch(inscripcion, state.filters.search) &&
          matchesDateRange(
            inscripcion,
            state.filters.fechaDesde,
            state.filters.fechaHasta,
          )
        );
      }),
    pendientesCount: (state) =>
      state.inscripciones.filter(
        (inscripcion) => inscripcion.estado === "PENDIENTE",
      ).length,
    aprobadasCount: (state) =>
      state.inscripciones.filter(
        (inscripcion) => inscripcion.estado === "APROBADA",
      ).length,
    enRevisionCount: () => 0,
  },
  actions: {
    syncInscripcion(inscripcion: Inscripcion) {
      this.inscripciones = replaceInscripcion(this.inscripciones, inscripcion);
      if (this.selected?.id === inscripcion.id) {
        this.selected = inscripcion;
      }
      return inscripcion;
    },
    async fetchInscripciones(params?: Partial<InscripcionesFilters>) {
      this.loading = true;
      this.error = null;
      if (params) {
        this.filters = { ...this.filters, ...params };
        this.pagination.page = 1;
      }
      try {
        const response = await inscriptionService.getAll({
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          search: this.filters.search,
          estado: this.filters.estado,
          fechaDesde: this.filters.fechaDesde,
          fechaHasta: this.filters.fechaHasta,
        });
        const normalized = normalizeCollection(response.data);
        this.inscripciones = normalized.items;
        this.pagination = normalized.pagination;
        return this.inscripciones;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las inscripciones.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchMatriculas(params?: Partial<InscripcionesFilters>) {
      return this.fetchInscripciones(params);
    },

    async aprobarInscripcion(id: number) {
      this.error = null;
      const estudiantesStore = useEstudiantesStore();
      try {
        const response = await inscriptionService.approve(id);
        const inscripcion = normalizeInscripcion(
          response.data ?? { id, estado: "APROBADA" },
        );
        this.syncInscripcion({ ...inscripcion, estado: "APROBADA" });
        await estudiantesStore.fetchEstudiantes();
        return inscripcion;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "No se pudo aprobar la inscripción.";
        throw error;
      }
    },

    async approveAndCreateStudent(id: number) {
      const inscripcion = await this.aprobarInscripcion(id);
      return { studentId: inscripcion.idEstudiante };
    },

  },
});