import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore().logout();
      router.push("/login");
    }
    return Promise.reject(err);
  },
);

export const estudiantesService = {
  getAll: (params = {}) => api.get("/students/all", { params }),
  getById: (id: string | number) => api.get(`/students/${id}`),
  create: (data: unknown) => api.post("/students", data),
  update: (id: string | number, data: unknown) =>
    api.patch(`/students/${id}`, data),
  remove: (id: string | number) => api.delete(`/students/${id}`),
  delete: (id: string | number) => api.delete(`/students/${id}`),
  getAcudientes: (id: number) => api.get(`/students/${id}/guardians`),
  getGuardians: (id: string | number) =>
    api.get(`/students/${id}/guardians`),
  addAcudiente: (id: number, data: unknown) =>
    api.post(`/students/${id}/guardians`, data),
  createGuardian: (id: string | number, data: unknown) =>
    api.post(`/students/${id}/guardians`, data),
  updateAcudiente: (id: number, aid: number, data: unknown) =>
    api.patch(`/students/${id}/guardians/${aid}`, data),
  updateGuardian: (id: string | number, aid: string | number, data: unknown) =>
    api.patch(`/students/${id}/guardians/${aid}`, data),
  removeAcudiente: (id: number, aid: number) =>
    api.delete(`/students/${id}/guardians/${aid}`),
  deleteGuardian: (id: string | number, aid: string | number) =>
    api.delete(`/students/${id}/guardians/${aid}`),
  setPrincipal: (id: number, aid: number) =>
    api.patch(`/students/${id}/guardians/${aid}/principal`),
};

export const inscripcionesService = {
  getAll: (params = {}) => api.get("/inscripciones", { params }),
  getById: (id: number) => api.get(`/inscripciones/${id}`),
  aprobar: (id: number) => api.patch(`/inscripciones/${id}/aprobar`),
  updateEstado: (id: number, estado: string) =>
    api.patch(`/inscripciones/${id}/estado`, { estado }),
};

export const formulariosService = {
  getActivo: (tipo: string) => api.get(`/formularios/${tipo}`),
  save: (tipo: string, campos: unknown) =>
    api.put(`/formularios/${tipo}`, { campos }),
  getHistorial: (tipo: string) => api.get(`/formularios/${tipo}/historial`),
};

export const franjasService = {
  getAll: () => api.get("/franjas"),
  create: (data: unknown) => api.post("/franjas", data),
  remove: (id: number) => api.delete(`/franjas/${id}`),
};

export const formAspirantesService = {
  getAll: (params = {}) => api.get("/form-aspirantes", { params }),
  getByCorreo: (correo: string) => api.get(`/form-aspirantes/${correo}`),
};

export const aspirantesService = {
  getAll: () => api.get("/aspirantes"),
  approve: (id: string | number) => api.post(`/aspirantes/${id}/approve`),
  reject: (id: string | number, motivo?: string) =>
    api.post(`/aspirantes/${id}/reject`, { motivo }),
  updateInterview: (id: string | number, date: string) =>
    api.patch(`/aspirantes/${id}/interview`, { date }),
};

export const formularioService = {
  getFields: () => formulariosService.getActivo("entrevista"),
  saveFields: (fields: unknown) =>
    formulariosService.save("entrevista", fields),
  getByType: (tipo: string) => formulariosService.getActivo(tipo),
  saveByType: (tipo: string, fields: unknown) =>
    formulariosService.save(tipo, fields),
  getLegacyFields: () => api.get("/formulario/campos"),
  saveLegacyFields: (fields: unknown) =>
    api.put("/formulario/campos", { fields }),
};

export const gruposService = {
  getAll: () => api.get("/grupos"),
  create: (payload: unknown) => api.post("/grupos", payload),
  update: (id: string | number, payload: unknown) =>
    api.put(`/grupos/${id}`, payload),
  delete: (id: string | number) => api.delete(`/grupos/${id}`),
};

export const matriculasService = {
  getAll: (params: unknown = {}) => api.get("/inscripciones", { params }),
  getById: (id: string | number) => api.get(`/inscripciones/${id}`),
  updateStatus: (id: string | number, payload: unknown) =>
    api.patch(`/inscripciones/${id}/estado`, payload),
  assignInterview: (id: string | number, payload: unknown) =>
    api.patch(`/inscripciones/${id}/entrevista`, payload),
  approve: (id: string | number) => api.patch(`/inscripciones/${id}/aprobar`),
};

export const authService = {
  login: (creds: { nombreUsuario: string; password: string }) =>
    api.post("/auth/login", creds),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export default api;
