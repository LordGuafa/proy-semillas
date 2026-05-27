export default interface Student {
  readonly id: number;
  firstname: string;
  lastname: string;
  homeAddress: string;
  city: string;
  department: string;
  strata: string;
  hasLunch: boolean;
  hasTransport: boolean;
  status: "ASPIRANTE" | "ACTIVO" | "RETIRADO" | "EGRESADO";
  photoURL: string;
}
