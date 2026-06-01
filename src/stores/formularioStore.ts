import { defineStore } from "pinia";
import { formularioService, interviewService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";
import type { Campo, FormularioTipo } from "@/types/formulario";

type FormularioState = Record<FormularioTipo, Campo[]>;
type LegacyCampo = {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  required: boolean;
  visible: boolean;
  order: number;
};

const storageKey = "semillas-formularios";

const fixedFields: Record<FormularioTipo, Campo[]> = {
  inscripcion: [],
  entrevista: [
    {
      id: "nom_madre",
      label: "Nombre de la madre",
      type: "text",
      required: true,
      visible: true,
      order: 1,
    },
    {
      id: "nom_padre",
      label: "Nombre del padre",
      type: "text",
      required: true,
      visible: true,
      order: 2,
    },
    {
      id: "correo",
      label: "Correo electrónico",
      type: "text",
      required: true,
      visible: true,
      order: 3,
    },
    {
      id: "celular",
      label: "Número de celular",
      type: "text",
      required: true,
      visible: true,
      order: 4,
    },
    {
      id: "nom_estudiante",
      label: "Nombre del niño o la niña",
      type: "text",
      required: true,
      visible: true,
      order: 5,
    },
    {
      id: "edad_estudiante",
      label: "Edad del estudiante",
      type: "number",
      required: true,
      visible: true,
      order: 6,
    },
    {
      id: "como_conocimiento",
      label: "¿Cómo se enteró de nosotros?",
      type: "text",
      required: true,
      visible: true,
      order: 7,
    },
    {
      id: "fechaPreferidaEntrevista",
      label: "Fecha preferida de entrevista",
      type: "date",
      required: true,
      visible: true,
      order: 8,
    },
  ],
  matricula: [
    {
      id: "fotoEstudiante",
      label: "Foto del estudiante",
      type: "text",
      required: false,
      visible: true,
      order: 1,
    },
    {
      id: "documentoIdentidad",
      label: "Documento de identidad",
      type: "text",
      required: true,
      visible: true,
      order: 2,
    },
  ],
};

function createDefaultState(): FormularioState {
  return {
    inscripcion: [],
    entrevista: fixedFields.entrevista.map((field) => ({ ...field })),
    matricula: fixedFields.matricula.map((field) => ({ ...field })),
  };
}

function createFieldId(): string {
  return `campo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeCampos(campos: Campo[]): Campo[] {
  return [...campos]
    .sort((a, b) => a.order - b.order)
    .map((campo, index) => ({ ...campo, order: index + 1 }));
}

function toCampoList(value: unknown): Campo[] {
  if (Array.isArray(value)) return value as Campo[];
  if (value && typeof value === "object" && "campos" in value) {
    const campos = (value as { campos?: Campo[] }).campos;
    return Array.isArray(campos) ? campos : [];
  }
  return [];
}

function normalizeBackendCampo(value: unknown, index: number): Campo | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const id =
    typeof data.id === "string"
      ? data.id
      : typeof data.nombre === "string"
        ? data.nombre
        : typeof data.name === "string"
          ? data.name
          : "";

  if (!id) return null;

  return {
    id,
    label:
      typeof data.label === "string"
        ? data.label
        : typeof data.etiqueta === "string"
          ? data.etiqueta
          : id,
    type:
      data.type === "number" || data.tipo === "number" || data.tipo === "integer"
        ? "number"
        : data.type === "date" || data.tipo === "date"
          ? "date"
          : data.type === "select" || data.tipo === "select"
            ? "select"
            : data.type === "boolean" || data.tipo === "boolean"
              ? "boolean"
              : data.type === "textarea" || data.tipo === "textarea"
                ? "textarea"
                : "text",
    required: Boolean(data.required ?? data.requerido ?? false),
    visible: data.visible !== false,
    order: typeof data.order === "number" ? data.order : index + 1,
    options: Array.isArray(data.options)
      ? data.options.map((option) => String(option))
      : undefined,
    placeholder:
      typeof data.placeholder === "string" ? data.placeholder : undefined,
    fijo: Boolean(data.fijo ?? data.fixed ?? false),
  };
}

function unwrapLatestSchema(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;

  const payload = value as {
    form_schema?: unknown;
    formSchema?: unknown;
    data?: unknown;
  };

  return payload.form_schema ?? payload.formSchema ?? payload.data ?? value;
}

function normalizeSchemaCampos(value: unknown): Campo[] {
  const schema = unwrapLatestSchema(value);
  if (!schema || typeof schema !== "object") return [];

  const campos = (schema as { campos?: unknown[] }).campos;
  if (!Array.isArray(campos)) return [];

  return campos
    .map((campo, index) => normalizeBackendCampo(campo, index))
    .filter((campo): campo is Campo => Boolean(campo));
}

function mergeWithFixed(tipo: FormularioTipo, campos: Campo[]): Campo[] {
  const dynamicFields = campos.filter(
    (campo) =>
      !fixedFields[tipo].some((fixedField) => fixedField.id === campo.id),
  );
  const fieldsById = new Map(campos.map((campo) => [campo.id, campo]));

  const mergedFixed = fixedFields[tipo].map((field) => ({
    ...field,
    visible: fieldsById.get(field.id)?.visible ?? field.visible,
  }));

  return normalizeCampos([...mergedFixed, ...dynamicFields]);
}

function nextFieldOrder(campos: Campo[]): number {
  return campos.length
    ? Math.max(...campos.map((campo) => campo.order)) + 1
    : 1;
}

export const useFormularioStore = defineStore("formulario", {
  state: () => ({
    formularios: readJSON<FormularioState>(storageKey, createDefaultState()),
    tipoActivo: "ENTREVISTA" as FormularioTipo,
    loading: false,
    error: null as string | null,
    dirty: false,
  }),
  getters: {
    camposActivos: (state) => {
      return [...(state.formularios[state.tipoActivo] ?? [])].sort(
        (a, b) => a.order - b.order,
      );
    },
  },
  actions: {
    persistState() {
      writeJSON(storageKey, this.formularios);
    },
    async fetchFormulario(tipo: FormularioTipo) {
      this.loading = true;
      this.error = null;
      try {
        let campos: Campo[] = [];
        try {
          const response = await formularioService.getByType(tipo);
          campos = toCampoList(response.data);
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[formularioStore] formularioService.getByType response:', response.data);
          }
        } catch (err) {
          // If the formularios endpoint is missing (404) or fails, don't throw —
          // continue with legacy/schema fallbacks so the admin remains usable.
          // eslint-disable-next-line no-console
          console.warn('[formularioStore] getByType failed, falling back to legacy/schema', err);
          campos = [];
        }

        if (campos.length) {
          this.formularios[tipo] = mergeWithFixed(tipo, campos);
        } else if (tipo === "entrevista") {
          try {
            const legacyResp = await formularioService.getLegacyFields();
            const legacyCampos = toCampoList(legacyResp.data);
            this.formularios[tipo] = mergeWithFixed(tipo, legacyCampos);
          } catch (legacyErr) {
            // legacy endpoint also may be missing; start from fixed fields
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.warn('[formularioStore] getLegacyFields failed, using fixedFields only', legacyErr);
            }
            this.formularios[tipo] = mergeWithFixed(tipo, []);
          }
        } else {
          this.formularios[tipo] = mergeWithFixed(tipo, []);
        }
        // Additionally, attempt to fetch the public interview schema and merge any extra campos
        if (tipo === "entrevista") {
          try {
            const latest = await interviewService.getLatestFormSchema();
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.log('[formularioStore] latest schema raw:', latest.data);
            }
            const schemaCampos = normalizeSchemaCampos(latest.data);
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.log('[formularioStore] normalized schema campos:', schemaCampos);
              // eslint-disable-next-line no-console
              console.log('[formularioStore] existing campos before merge:', this.formularios[tipo]);
            }
            if (schemaCampos.length) {
              const existing = this.formularios[tipo] ?? [];
              const existingIds = new Set(existing.map((c) => c.id));
              const extras = schemaCampos.filter((c) => !existingIds.has(c.id));
              if (extras.length) {
                this.formularios[tipo] = normalizeCampos([...existing, ...extras]);
                if (import.meta.env.DEV) {
                  // eslint-disable-next-line no-console
                  console.log('[formularioStore] merged campos:', this.formularios[tipo]);
                }
              }
            }
          } catch (e) {
            // ignore schema merge errors; admin still has formularioService data
          }
        }
        this.persistState();
        this.dirty = false;
        return this.formularios[tipo];
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.error = `Error cargando formulario: ${message}`;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async saveFormulario(tipo: FormularioTipo) {
      this.loading = true;
      this.error = null;
      try {
        const campos = normalizeCampos(this.formularios[tipo] ?? []);
        this.formularios[tipo] = campos;
        this.persistState();
        await formularioService.saveByType(tipo, campos);
        this.dirty = false;
        return campos;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.error = `Error guardando formulario: ${message}`;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    setTipoActivo(tipo: FormularioTipo) {
      this.tipoActivo = tipo;
    },
    addCampo(tipo: FormularioTipo) {
      const nextCampo: Campo = {
        id: createFieldId(),
        label: "Nuevo campo",
        type: "text",
        required: false,
        visible: true,
        order: nextFieldOrder(this.formularios[tipo] ?? []),
      };
      this.formularios[tipo] = normalizeCampos([
        ...(this.formularios[tipo] ?? []),
        nextCampo,
      ]);
      this.persistState();
      this.dirty = true;
      return nextCampo;
    },
    removeCampo(tipo: FormularioTipo, id: string) {
      this.formularios[tipo] = normalizeCampos(
        (this.formularios[tipo] ?? []).filter((campo) => campo.id !== id),
      );
      this.persistState();
      this.dirty = true;
    },
    updateCampo(tipo: FormularioTipo, id: string, changes: Partial<Campo>) {
      this.formularios[tipo] = normalizeCampos(
        (this.formularios[tipo] ?? []).map((campo) =>
          campo.id === id ? { ...campo, ...changes } : campo,
        ),
      );
      this.persistState();
      this.dirty = true;
    },
    reorderCampos(tipo: FormularioTipo, newOrder: Campo[]) {
      this.formularios[tipo] = normalizeCampos(
        newOrder.map((campo, index) => ({ ...campo, order: index + 1 })),
      );
      this.persistState();
      this.dirty = true;
    },
  },
});
