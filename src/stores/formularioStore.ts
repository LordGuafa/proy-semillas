import { defineStore } from "pinia";
import { formularioService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";

export type FormField = {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  required: boolean;
  visible: boolean;
  order: number;
};

const storageKey = "semillas-form-fields";
const defaultFields: FormField[] = [
  {
    id: "fullName",
    label: "Nombre completo",
    type: "text",
    required: true,
    visible: true,
    order: 1,
  },
  {
    id: "birthDate",
    label: "Fecha de nacimiento",
    type: "date",
    required: true,
    visible: true,
    order: 2,
  },
  {
    id: "guardianName",
    label: "Nombre del acudiente",
    type: "text",
    required: true,
    visible: true,
    order: 3,
  },
  {
    id: "phone",
    label: "Teléfono de contacto",
    type: "text",
    required: true,
    visible: true,
    order: 4,
  },
  {
    id: "previousSchool",
    label: "Colegio o jardín anterior",
    type: "text",
    required: false,
    visible: true,
    order: 5,
  },
];

function normalize(fields: FormField[]): FormField[] {
  return [...fields]
    .sort((a, b) => a.order - b.order)
    .map((field, index) => ({ ...field, order: index + 1 }));
}

export const useFormularioStore = defineStore("formulario", {
  state: () => ({
    campos: readJSON<FormField[]>(storageKey, defaultFields),
    loading: false,
  }),
  actions: {
    async fetchCampos() {
      this.loading = true;
      try {
        const fields = (await formularioService.getFields()) as FormField[];
        this.campos = normalize(fields?.length ? fields : defaultFields);
        writeJSON(storageKey, this.campos);
        return this.campos;
      } finally {
        this.loading = false;
      }
    },
    async saveCampos(fields?: FormField[]) {
      const nextFields = fields ?? this.campos;
      this.campos = normalize(nextFields);
      writeJSON(storageKey, this.campos);
      await formularioService.saveFields(this.campos);
      return this.campos;
    },
    addCampo() {
      const nextField: FormField = {
        id: `campo-${Date.now()}`,
        label: "Nuevo campo",
        type: "text",
        required: false,
        visible: true,
        order: this.campos.length + 1,
      };
      this.campos = normalize([...this.campos, nextField]);
      writeJSON(storageKey, this.campos);
      return nextField;
    },
    removeCampo(id: string) {
      this.campos = normalize(this.campos.filter((field) => field.id !== id));
      writeJSON(storageKey, this.campos);
    },
    updateCampo(id: string, data: Partial<FormField>) {
      this.campos = normalize(
        this.campos.map((field) =>
          field.id === id ? { ...field, ...data } : field,
        ),
      );
      writeJSON(storageKey, this.campos);
    },
  },
});
