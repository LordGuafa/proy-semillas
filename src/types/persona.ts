import type { TipoDocumento } from "./enums";

export interface Persona {
  id: number;
  usuarioSistemaId?: string;
  documentoIdentidad: string;
  tipoDocumento: TipoDocumento;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico?: string;
  telefono?: string;
  fechaNacimiento?: string;
  paisNacimiento?: string;
  departamentoNacimiento?: string;
  ciudadNacimiento?: string;
  createdAt: string;
  updatedAt: string;
}

export function nombreCompleto(
  p: Pick<
    Persona,
    "primerNombre" | "segundoNombre" | "primerApellido" | "segundoApellido"
  >,
): string {
  return [p.primerNombre, p.segundoNombre, p.primerApellido, p.segundoApellido]
    .filter(Boolean)
    .join(" ");
}

export function iniciales(
  p: Pick<Persona, "primerNombre" | "primerApellido">,
): string {
  return `${p.primerNombre[0] ?? ""}${p.primerApellido[0] ?? ""}`.toUpperCase();
}
