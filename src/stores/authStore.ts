import { defineStore } from "pinia";
import { readJSON, removeJSON, writeJSON } from "@/utils/storage";

export type AuthUser = { name: string; email: string; role: string };

const tokenKey = "semillas-auth-token";
const userKey = "semillas-auth-user";

function buildName(email: string): string {
  return (email.split("@")[0] || "Usuario")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: readJSON<string | null>(tokenKey, null),
    user: readJSON<AuthUser | null>(userKey, null) ?? {
      name: "Semillas",
      email: "admin@semillas.edu",
      role: "admin",
    },
  }),
  getters: { isAuthenticated: (state) => Boolean(state.token) },
  actions: {
    async login(credentials: { email: string; password: string }) {
      const email = credentials.email.trim().toLowerCase();
      const password = credentials.password.trim();
      if (!email || !password)
        throw new Error("Ingresa tu correo y contraseña.");
      if (!email.includes("@") || password.length < 4)
        throw new Error("Credenciales inválidas.");
      this.token = btoa(`${email}:${Date.now()}`);
      this.user = {
        name: buildName(email),
        email,
        role: email.includes("admin") ? "admin" : "operador",
      };
      writeJSON(tokenKey, this.token);
      writeJSON(userKey, this.user);
      return { token: this.token, user: this.user };
    },
    logout() {
      this.token = null;
      this.user = {
        name: "Semillas",
        email: "admin@semillas.edu",
        role: "admin",
      };
      removeJSON(tokenKey);
      removeJSON(userKey);
    },
    fetchCurrentUser() {
      this.token = readJSON<string | null>(tokenKey, null);
      this.user = readJSON<AuthUser | null>(userKey, null) ?? this.user;
      return this.user;
    },
  },
});
