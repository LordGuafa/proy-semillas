import type { TipoFormulario } from "./enums";

export type FormularioTipo = TipoFormulario;

export interface Campo {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "boolean" | "textarea";
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
  fijo?: boolean;
}

export interface FormSchema {
  id: number;
  formulario: TipoFormulario;
  version: number;
  activo: boolean;
  campos: Campo[];
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
