import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

/* Temporarily disabled auth header injection to allow testing without authentication.
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});
*/

// Simplified response handling while auth is disabled. Keep error propagation.
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export const studentService = {
  getAll: (params = {}) => api.get("/students/all", { params }),
  getById: (id: string | number) => api.get(`/students/${id}`),
  create: (data: unknown) => api.post("/students", data),
  update: (id: string | number, data: unknown) =>
    api.patch(`/students/${id}`, data),
  remove: (id: string | number) => api.delete(`/students/${id}`),
  delete: (id: string | number) => api.delete(`/students/${id}`),
};

export const guardianService = {
  getByStudent: (studentId: string | number) =>
    api.get(`/students/estudiante/${studentId}`),
  create: (data: unknown) => api.post("/parent/", data),
  updateInfo: (id: string | number, data: unknown) =>
    api.patch(`/parent/${id}`, data),
  delete: (acudienteId: string | number, estudianteId: string | number) =>
    api.delete(`/parent/${acudienteId}/estudiante/${estudianteId}`),
};

export const medicalInfoService = {
  createMedicalHistory: (studentId: unknown) =>
    api.post(`/medical_information`, studentId),
  getMedicalHistory: (studentId: unknown) =>
    api.get(`/medical_information/estudiante/${studentId}`),
  createMedicalEntry: (data: unknown) => api.post(`/medical_entry/`, data),
  listMedEntries: (medHistId: string | number) =>
    api.get(`/medical_entry/por_informacion/medica/${medHistId}`),
  deleteMedicalEntry: (id: string | number) =>
    api.delete(`/medical_entry/${id}`),
  updateMedicalEntry: (id: string | number, data: unknown) =>
    api.put(`/medical_entry/${id}`, data),
};


export const interviewService = {
  getLatestFormSchema: () => api.get("/interview/latest-form-schema"),
  getAvailableTimeSlots: () => api.get("/time_slot/available_time_slots"),
  getAll: (params: unknown = {}) => api.get("/interview", { params }),
  create: (data: unknown) => api.post("/interview/create", data),
  getTimeSlotById: (id: number | string) => api.get(`/time_slot/${id}`),
  createSchema:(data:unknown)=>api.post(`/interview/schema`,data),
  markAsAssisted: (id: number | string) =>
    api.patch(`/interview/${id}/assisted`),

  markAsUnassisted: (id: number | string) =>
    api.patch(`/interview/${id}/unassisted`),
};

export const timeSlotService = {
  getAll: () => api.get("/time_slot/available_time_slots"),
  create: (data: unknown) => api.post("/time_slot/", data),
  getById: (id: number | string) => api.get(`/time_slot/${id}`),
  update: (id: number | string, data: unknown) =>
    api.put(`/time_slot/${id}`, data),
  remove: (id: number | string) => api.delete(`/time_slot/${id}`),
};



export const inscriptionService = {
  create: (data: unknown) => api.post("/inscription/create", data),
  getAll: (params: unknown = {}) => api.get("/inscription", { params }),
  createSchema: (data: unknown) => api.post(`/inscription/schema`, data),
  getSchema: () => api.get(`/inscription/latest-form-schema`),
  approve: (id: string | number) => api.patch(`/inscription/${id}/approve`),
  reject: (id: string | number) => api.delete(`/inscription/${id}/reject`),
};

export const authService = {
  login: (creds: { nombreUsuario: string; password: string }) =>
    api.post("/auth/login", creds),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export default api;
