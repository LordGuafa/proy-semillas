import type { Persona } from "./persona";

export interface Guardian extends Persona {
  parentesco: string;
  ocupacion?: string;
  nombreEmpresaTrabajo?: string;
  direccionCasa?: string;
  ciudadCasa?: string;
  departamentoCasa?: string;
  esPrincipal: boolean;
  esResponsablePago: boolean;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  secondLastName?: string;
  kinship?: string;
  occupation?: string;
  workplace?: string;
  homeAddress?: string;
  city?: string;
  department?: string;
  phone?: string;
  email?: string;
  birthdate?: Date;
  placeOfBirth?: string;
  documentType?: string;
  documentNumber?: string;
  isMainGuardian?: boolean;
  isPaymentResponsible?: boolean;
}

export type GuardianPayload = Omit<
  Guardian,
  "id" | "createdAt" | "updatedAt" | "usuarioSistemaId"
>;

export interface EstudianteAcudiente {
  idEstudiante: number;
  idAcudiente: number;
  esPrincipal: boolean;
}
