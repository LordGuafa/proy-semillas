import { defineStore } from "pinia";
import { formularioService } from "@/services/api";
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
      id: "fotoAspirante",
      label: "Foto del aspirante",
      type: "text",
      required: false,
      visible: true,
      order: 1,
    },
    {
      id: "fechaPreferidaEntrevista",
      label: "Fecha preferida de entrevista",
      type: "date",
      required: true,
      visible: true,
      order: 2,
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
        const response = await formularioService.getByType(tipo);
        const campos = toCampoList(response);
        if (campos.length) {
          this.formularios[tipo] = mergeWithFixed(tipo, campos);
        } else if (tipo === "entrevista") {
          const legacyCampos = toCampoList(
            await formularioService.getLegacyFields(),
          );
          this.formularios[tipo] = mergeWithFixed(tipo, legacyCampos);
        } else {
          this.formularios[tipo] = mergeWithFixed(tipo, []);
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
