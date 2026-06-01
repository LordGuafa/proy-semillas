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
    esDirectivo: (state) => state.user?.rol === "directivo",
  },
  actions: {
    async login(credentials: { nombreUsuario: string; password: string }) {
      const nombreUsuario = credentials.nombreUsuario.trim();
      const password = credentials.password.trim();
      if (!nombreUsuario || !password) {
        throw new Error("Ingresa tu usuario y contraseña.");
      }
      console.log('[auth] login payload:', { nombreUsuario });
      let response;
      try {
        response = await authService.login({ nombreUsuario, password });
        console.log('[auth] login response:', response.data);
      } catch (err) {
        console.error('[auth] login error:', err);
        if (err && typeof err === 'object' && 'response' in err) {
          // @ts-ignore
          console.error('[auth] response data:', err.response?.data);
          // @ts-ignore
          console.error('[auth] response status:', err.response?.status);
          // If the backend login route is not available (404), allow a dev fallback
          // that accepts any email for local testing.
          // WARNING: keep this only for local development.
          // @ts-ignore
          if (err.response?.status === 404) {
            const fakeToken = 'dev-token-' + Date.now();
            const fakeUser = {
              id: 'dev',
              nombreUsuario,
              rol: 'directivo',
              activo: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              persona: {
                primerNombre: nombreUsuario.split('@')[0] || 'Dev',
                primerApellido: '',
                correoElectronico: nombreUsuario,
              },
            } as AuthUser;

            this.token = fakeToken;
            this.user = fakeUser;
            localStorage.setItem(tokenKey, fakeToken);
            persistUser(fakeUser);
            console.warn('[auth] Backend login not found — using development fallback user');
            return { token: fakeToken, user: fakeUser } as unknown as AuthResponse;
          }
        }
        throw err;
      }
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
      this.token = null;
      this.user = null;
      localStorage.removeItem(tokenKey);
      persistUser(null);
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
  },
});
