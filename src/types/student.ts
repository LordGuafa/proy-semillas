import type { EstadoEstudiante } from "./enums";
import { estadoEstudianteBadge, estadoEstudianteLabel } from "./enums";
import type { Persona } from "./persona";
import type { Guardian } from "./guardian";

export interface Student extends Persona {
  direccionResidencia: string;
  ciudadResidencia?: string;
  departamentoResidencia?: string;
  estrato: number;
  tieneAlmuerzo: boolean;
  tieneTranporteRuta: boolean;
  fotoUrl?: string;
  estado: EstadoEstudiante;
  acudientes?: Guardian[];
  firstname?: string;
  lastname?: string;
  homeAddress?: string;
  city?: string;
  department?: string;
  strata?: string;
  hasLunch?: boolean;
  hasTransport?: boolean;
  photoURL?: string;
  status?: EstadoEstudiante;
}

export type StudentPayload = Omit<
  Student,
  "id" | "createdAt" | "updatedAt" | "acudientes" | "usuarioSistemaId"
>;

export const studentStatusLabel: Record<string, string> = estadoEstudianteLabel;
export const studentStatusVariant: Record<string, string> =
  estadoEstudianteBadge;
