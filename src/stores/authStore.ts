import { defineStore } from "pinia";
import { authService } from "@/services/api";
import type { AuthResponse, UsuarioSistema } from "@/types/usuario";

type AuthUser = AuthResponse["user"];

const tokenKey = "semillas_token";
const userKey = "semillas_user";

function readStoredToken(): string | null {
  return localStorage.getItem(tokenKey);
}

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  } else {
    localStorage.removeItem(userKey);
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: readStoredToken() as string | null,
    user: readStoredUser() as AuthUser | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    nombreMostrar: (state) =>
      state.user
        ? `${state.user.persona.primerNombre} ${state.user.persona.primerApellido}`.trim()
        : "",
    esDirectivo: (state) => state.user?.rol === "directivo" || state.user?.rol === "administrador",
  },
  actions: {
    async register(data: { name: string; email: string; password: string }) {
      const name = data.name.trim();
      const email = data.email.trim().toLowerCase();
      if (!name || !email || !data.password) {
        throw new Error("Completa todos los campos para crear la cuenta.");
      }
      if (data.password.length < 12) {
        throw new Error("La contraseña debe tener al menos 12 caracteres.");
      }
      return authService.register({ name, email, password: data.password });
    },
    async login(credentials: { nombreUsuario: string; password: string }) {
      const nombreUsuario = credentials.nombreUsuario.trim();
      const password = credentials.password.trim();
      if (!nombreUsuario || !password) {
        throw new Error("Ingresa tu usuario y contraseña.");
      }
      const response = await authService.login({ nombreUsuario, password });
      const payload = response.data as AuthResponse;
      this.token = payload.token;
      this.user = payload.user;
      localStorage.setItem(tokenKey, payload.token);
      persistUser(payload.user);
      return payload;
    },
    async logout() {
      try {
        await authService.logout();
      } catch {
        // Se limpia el estado local aunque el servidor no responda.
      }
      this.clearLocalSession();
    },
    async fetchCurrentUser() {
      if (!this.token) {
        this.token = readStoredToken();
      }
      if (!this.token) return null;
      const response = await authService.me();
      const payload = response.data as UsuarioSistema & {
        persona: AuthUser["persona"];
      };
      this.user = payload as AuthUser;
      persistUser(this.user);
      return this.user;
    },
    clearLocalSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem(tokenKey);
      persistUser(null);
    },
  },
});
