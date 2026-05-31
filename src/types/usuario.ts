import type { RolUsuario } from "./enums";

export interface UsuarioSistema {
  readonly id: string;
  nombreUsuario: string;
  rol: RolUsuario;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: UsuarioSistema & {
    persona: {
      primerNombre: string;
      primerApellido: string;
      correoElectronico?: string;
    };
  };
}
