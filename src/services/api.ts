import axios from "axios";
import type { Router } from "vue-router";
import { readJSON, writeJSON } from "@/utils/storage";
import type { Campo, FormularioTipo } from "@/types/formulario";
import type Guardian from "@/types/guardian";

type ApiRecord = Record<string, unknown>;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

let routerRef: Router | null = null;

export function setApiRouter(router: Router): void {
  routerRef = router;
}

api.interceptors.request.use((config) => {
  const token = readJSON<string | null>("semillas-auth-token", null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      writeJSON("semillas-auth-token", null);
      writeJSON("semillas-auth-user", null);
      if (routerRef) await routerRef.push("/login");
    }
    return Promise.reject(error);
  },
);

function remoteEnabled(): boolean {
  return Boolean(import.meta.env.VITE_API_URL);
}

function readList<T>(key: string, fallback: T[]): T[] {
  return readJSON<T[]>(key, fallback);
}

export const estudiantesService = {
  async getAll() {
    if (remoteEnabled()) return (await api.get("/estudiantes")).data;
    return readList("semillas-students", []);
  },
  async getById(id: string | number) {
    if (remoteEnabled()) return (await api.get(`/estudiantes/${id}`)).data;
    return (
      readList<ApiRecord>("semillas-students", []).find(
        (item) => String(item.id) === String(id),
      ) ?? null
    );
  },
  async create(payload: ApiRecord) {
    if (remoteEnabled()) return (await api.post("/estudiantes", payload)).data;
    const current = readList<ApiRecord>("semillas-students", []);
    const next = [{ ...payload, id: payload.id ?? Date.now() }, ...current];
    writeJSON("semillas-students", next);
    return next;
  },
  async update(id: string | number, payload: ApiRecord) {
    if (remoteEnabled())
      return (await api.put(`/estudiantes/${id}`, payload)).data;
    const current = readList<ApiRecord>("semillas-students", []);
    const next = current.map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload } : item,
    );
    writeJSON("semillas-students", next);
    return next;
  },
  async delete(id: string | number) {
    if (remoteEnabled()) return (await api.delete(`/estudiantes/${id}`)).data;
    const current = readList<ApiRecord>("semillas-students", []);
    const next = current.filter((item) => String(item.id) !== String(id));
    writeJSON("semillas-students", next);
    return next;
  },
  async getGuardians(studentId: string | number) {
    if (remoteEnabled())
      return (await api.get(`/estudiantes/${studentId}/guardians`)).data;
    return readList<Guardian>(`semillas-guardians-${studentId}`, []);
  },
  async createGuardian(studentId: string | number, payload: ApiRecord) {
    if (remoteEnabled())
      return (await api.post(`/estudiantes/${studentId}/guardians`, payload))
        .data;
    const key = `semillas-guardians-${studentId}`;
    const current = readList<ApiRecord>(key, []);
    const next = [{ ...payload, id: payload.id ?? Date.now() }, ...current];
    writeJSON(key, next);
    return next;
  },
  async updateGuardian(
    studentId: string | number,
    guardianId: string | number,
    payload: ApiRecord,
  ) {
    if (remoteEnabled())
      return (
        await api.put(
          `/estudiantes/${studentId}/guardians/${guardianId}`,
          payload,
        )
      ).data;
    const key = `semillas-guardians-${studentId}`;
    const current = readList<ApiRecord>(key, []);
    const next = current.map((item) =>
      String(item.id) === String(guardianId) ? { ...item, ...payload } : item,
    );
    writeJSON(key, next);
    return next;
  },
  async deleteGuardian(
    studentId: string | number,
    guardianId: string | number,
  ) {
    if (remoteEnabled())
      return (
        await api.delete(`/estudiantes/${studentId}/guardians/${guardianId}`)
      ).data;
    const key = `semillas-guardians-${studentId}`;
    const current = readList<ApiRecord>(key, []);
    const next = current.filter(
      (item) => String(item.id) !== String(guardianId),
    );
    writeJSON(key, next);
    return next;
  },
};

export const aspirantesService = {
  async getAll() {
    if (remoteEnabled()) return (await api.get("/aspirantes")).data;
    return readList("semillas-applicants", []);
  },
  async approve(id: string | number) {
    if (remoteEnabled())
      return (await api.post(`/aspirantes/${id}/approve`)).data;
    return id;
  },
  async reject(id: string | number, motivo?: string) {
    if (remoteEnabled())
      return (await api.post(`/aspirantes/${id}/reject`, { motivo })).data;
    return { id, motivo };
  },
  async updateInterview(id: string | number, date: string) {
    if (remoteEnabled())
      return (await api.patch(`/aspirantes/${id}/interview`, { date })).data;
    return { id, date };
  },
};

export const formularioService = {
  async getFields() {
    return formularioService.getByType("ENTREVISTA");
  },
  async saveFields(fields: ApiRecord[]) {
    return formularioService.saveByType(
      "ENTREVISTA",
      fields as unknown as Campo[],
    );
  },
  async getByType(tipo: FormularioTipo) {
    if (remoteEnabled()) return (await api.get(`/formularios/${tipo}`)).data;
    return readJSON<Campo[]>(`semillas-formularios-${tipo}`, []);
  },
  async saveByType(tipo: FormularioTipo, fields: Campo[]) {
    if (remoteEnabled())
      return (await api.put(`/formularios/${tipo}`, { campos: fields })).data;
    writeJSON(`semillas-formularios-${tipo}`, fields);
    return fields;
  },
  async getLegacyFields() {
    return readJSON("semillas-form-fields", []);
  },
  async saveLegacyFields(fields: ApiRecord[]) {
    if (remoteEnabled())
      return (await api.put("/formulario/campos", { fields })).data;
    writeJSON("semillas-form-fields", fields);
    return fields;
  },
};

export const gruposService = {
  async getAll() {
    if (remoteEnabled()) return (await api.get("/grupos")).data;
    return readJSON("semillas-groups", []);
  },
  async create(payload: ApiRecord) {
    if (remoteEnabled()) return (await api.post("/grupos", payload)).data;
    const current = readList<ApiRecord>("semillas-groups", []);
    const next = [{ ...payload, id: payload.id ?? Date.now() }, ...current];
    writeJSON("semillas-groups", next);
    return next;
  },
  async update(id: string | number, payload: ApiRecord) {
    if (remoteEnabled()) return (await api.put(`/grupos/${id}`, payload)).data;
    const current = readList<ApiRecord>("semillas-groups", []);
    const next = current.map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload } : item,
    );
    writeJSON("semillas-groups", next);
    return next;
  },
  async delete(id: string | number) {
    if (remoteEnabled()) return (await api.delete(`/grupos/${id}`)).data;
    const current = readList<ApiRecord>("semillas-groups", []);
    const next = current.filter((item) => String(item.id) !== String(id));
    writeJSON("semillas-groups", next);
    return next;
  },
};

export const matriculasService = {
  async getAll(params: ApiRecord = {}) {
    if (remoteEnabled()) return (await api.get("/matriculas", { params })).data;
    const current = readList<ApiRecord>("semillas-matriculas", []);
    const search = String(params.search ?? "")
      .trim()
      .toLowerCase();
    const status = String(params.status ?? "").trim();
    const dateFrom = String(params.dateFrom ?? "").trim();
    const dateTo = String(params.dateTo ?? "").trim();
    const page = Number(params.page ?? 1) || 1;
    const perPage = Number(params.perPage ?? 10) || 10;
    const filtered = current.filter((item) => {
      const studentData = (item.studentData as Record<string, unknown>) ?? {};
      const fullName =
        `${String(studentData.firstname ?? studentData.firstName ?? "")} ${String(studentData.lastname ?? studentData.lastName ?? "")}`
          .trim()
          .toLowerCase();
      const submittedAt = String(item.submittedAt ?? "");
      const matchesSearch = !search || fullName.includes(search);
      const matchesStatus = !status || String(item.status ?? "") === status;
      const matchesFrom = !dateFrom || submittedAt >= dateFrom;
      const matchesTo = !dateTo || submittedAt <= dateTo;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
    const start = (page - 1) * perPage;
    return {
      items: filtered.slice(start, start + perPage),
      pagination: { page, perPage, total: filtered.length },
    };
  },
  async getById(id: string | number) {
    if (remoteEnabled()) return (await api.get(`/matriculas/${id}`)).data;
    return (
      readList<ApiRecord>("semillas-matriculas", []).find(
        (item) => String(item.id) === String(id),
      ) ?? null
    );
  },
  async updateStatus(id: string | number, payload: ApiRecord) {
    if (remoteEnabled())
      return (await api.patch(`/matriculas/${id}/status`, payload)).data;
    const current = readList<ApiRecord>("semillas-matriculas", []);
    const next = current.map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload } : item,
    );
    writeJSON("semillas-matriculas", next);
    return next.find((item) => String(item.id) === String(id)) ?? null;
  },
  async assignInterview(id: string | number, payload: ApiRecord) {
    if (remoteEnabled())
      return (await api.patch(`/matriculas/${id}/interview`, payload)).data;
    const current = readList<ApiRecord>("semillas-matriculas", []);
    const next = current.map((item) =>
      String(item.id) === String(id)
        ? { ...item, ...payload, status: "ENTREVISTA" }
        : item,
    );
    writeJSON("semillas-matriculas", next);
    return next.find((item) => String(item.id) === String(id)) ?? null;
  },
  async approve(id: string | number) {
    if (remoteEnabled())
      return (await api.post(`/matriculas/${id}/approve`)).data;
    const current = readList<ApiRecord>("semillas-matriculas", []);
    const next = current.map((item) =>
      String(item.id) === String(id)
        ? { ...item, status: "APROBADA", studentId: Date.now() }
        : item,
    );
    writeJSON("semillas-matriculas", next);
    return next.find((item) => String(item.id) === String(id)) ?? null;
  },
};

export default api;
