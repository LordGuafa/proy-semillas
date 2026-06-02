import type { EstadoAprobacion } from "./enums";
import { estadoAprobacionBadge, estadoAprobacionLabel } from "./enums";
import type { FormSchema } from "./formulario";
import type { Guardian } from "./guardian";
import type { Student } from "./student";

export interface Inscripcion {
  readonly id: number;
  idEstudiante: number;
  idAcudiente: number;
  fisrtname?: string;
  idEntrevista?: number;
  estado: EstadoAprobacion;
  fechaInscripcion: string;
  schemaVersion: number;
  informacionForm: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  estudiante?: Student;
  acudiente?: Guardian;
  entrevista?: Entrevista;
  formSchema?: FormSchema;
  status?: EstadoAprobacion | "EN_REVISION" | "ENTREVISTA" | "RECHAZADA";
  studentData?: Record<string, unknown>;
  guardianData?: Record<string, unknown>;
  formSnapshot?: {
    campos: Array<{ id: string; label: string; type: string; value: unknown }>;
  };
  photoURL?: string;
  submittedAt?: string;
  interviewDate?: string;
  assignedTo?: string;
}

export interface AprobarInscripcionPayload {
  id: number;
}

export interface Entrevista {
  readonly id: number;
  idFranjaEntrevista: number;
  schemaVersion?: number;
  informacionAspirante: Record<string, unknown>;
  correoFormAspirante?: string;
  createdAt: string;
  updatedAt: string;
  franja?: FranjaEntrevista;
}

export interface FranjaEntrevista {
  readonly id: number;
  franja: string;
  cuposTotales: number;
  cuposDisponibles?: number;
}

export interface FormAspirante {
  readonly id: number;
  nomPadre?: string;
  nomMadre?: string;
  correo: string;
  celular?: string;
  nomEstudiante?: string;
  edadEstudiante?: number;
  comoConocimiento?: string;
  createdAt: string;
}

export type Matricula = Inscripcion;
export type MatriculaStatus =
  | EstadoAprobacion
  | "EN_REVISION"
  | "ENTREVISTA"
  | "RECHAZADA";
export const matriculaStatusLabel: Record<string, string> = {
  PENDIENTE: estadoAprobacionLabel.PENDIENTE,
  APROBADA: estadoAprobacionLabel.APROBADA,
  EN_REVISION: "En revisión",
  ENTREVISTA: "Entrevista agendada",
  RECHAZADA: "Rechazada",
};
export const matriculaStatusVariant: Record<string, string> = {
  PENDIENTE: estadoAprobacionBadge.PENDIENTE,
  APROBADA: estadoAprobacionBadge.APROBADA,
  EN_REVISION: "warning",
  ENTREVISTA: "info",
  RECHAZADA: "inactive",
};
