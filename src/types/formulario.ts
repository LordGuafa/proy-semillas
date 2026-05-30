export type FormularioTipo = "ENTREVISTA" | "MATRICULA";

export interface Campo {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "boolean" | "textarea";
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
}

export interface Formulario {
  tipo: FormularioTipo;
  campos: Campo[];
  updatedAt?: string;
}
