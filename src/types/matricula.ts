// Representa una respuesta al formulario de tipo MATRICULA
export default interface Matricula {
  readonly id: number;
  // Metadatos de la solicitud
  submittedAt: string;
  status: MatriculaStatus;
  interviewDate?: string;
  assignedTo?: string;
  // Datos del aspirante (mapeados desde los campos dinámicos del formulario)
  studentData: Record<string, string | boolean | number>;
  // Datos del acudiente principal (si el formulario lo incluye)
  guardianData?: Record<string, string | boolean | number>;
  // Foto subida en el formulario
  photoURL?: string;
  // Referencia al estudiante creado si la matrícula fue aprobada
  studentId?: number;
  // Campos originales tal como vienen del formulario (para mostrar dinámicamente)
  formSnapshot: FormSnapshot;
}

export type MatriculaStatus =
  | "PENDIENTE"
  | "EN_REVISION"
  | "ENTREVISTA"
  | "APROBADA"
  | "RECHAZADA";

export const matriculaStatusLabel: Record<MatriculaStatus, string> = {
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  ENTREVISTA: "Entrevista agendada",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

export const matriculaStatusVariant: Record<MatriculaStatus, string> = {
  PENDIENTE: "pending",
  EN_REVISION: "warning",
  ENTREVISTA: "info",
  APROBADA: "active",
  RECHAZADA: "inactive",
};

// Snapshot del formulario en el momento del envío
// (los campos pueden cambiar después, pero la matrícula guarda cómo era)
export interface FormSnapshot {
  campos: Array<{
    id: string;
    label: string;
    type: string;
    value: string | boolean | number | null;
  }>;
}
