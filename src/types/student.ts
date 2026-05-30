export default interface Student {
  readonly id: number;
  firstname: string;
  lastname: string;
  homeAddress: string;
  city?: string;
  department?: string;
  strata?: string;
  hasLunch: boolean;
  hasTransport: boolean;
  status: "ASPIRANTE" | "ACTIVO" | "RETIRADO" | "EGRESADO";
  photoURL?: string;
}

export const studentStatusLabel: Record<Student["status"], string> = {
  ASPIRANTE: "Aspirante",
  ACTIVO: "Activo",
  RETIRADO: "Retirado",
  EGRESADO: "Egresado",
};

export const studentStatusVariant: Record<Student["status"], string> = {
  ASPIRANTE: "pending",
  ACTIVO: "active",
  RETIRADO: "inactive",
  EGRESADO: "graduated",
};
