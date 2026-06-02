import { defineStore } from "pinia";
import {interviewService } from "@/services/api";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import { readJSON, writeJSON } from "@/utils/storage";

export type ApplicantStatus = "pending" | "active" | "inactive";
export type ApplicantRecord = {
  id: string;
  fullName: string;
  sentDate: string;
  interviewDate: string;
  status: ApplicantStatus;
  rejectionReason?: string;
  fieldValues: Record<string, string | number | boolean | null>;
};

const storageKey = "semillas-applicants";

function formatInterviewDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

export const useAspirantesStore = defineStore("aspirantes", {
  state: () => ({
    aspirantes: readJSON<ApplicantRecord[]>(storageKey, []),
    loading: false,
  }),
  actions: {
    async fetchAspirantes() {
      this.loading = true;
      try {
        // Prefer the interviews endpoint which contains informacion_aspirante
        try {
          const resp = await interviewService.getAll();
          const interviews = (resp.data?.interviews ?? []) as any[];
          const mapped = await Promise.all(interviews.map(async (it) => {
            const info = it.informacion_aspirante ?? {};
            let interviewDate = "";
            try {
              const slotResp = await interviewService.getTimeSlotById(it.id_franja_entrevista);
              const slot = slotResp.data?.franja ?? slotResp.data?.data?.franja ?? slotResp.data?.franja ?? null;
              interviewDate = formatInterviewDate(slot?.franja ?? slot?.fecha ?? slot?.toString?.() ?? "");
            } catch {
              interviewDate = String(it.id_franja_entrevista ?? "");
            }
            return {
              id: String(it.id),
              fullName:
                info.nom_estudiante ?? info.nombre ?? it.correo_form_aspirante ?? 'Sin nombre',
              sentDate: it.created_at ?? '',
              interviewDate,
              status: 'pending' as ApplicantStatus,
              rejectionReason: undefined,
              fieldValues: { ...(info as Record<string, unknown>), correo: it.correo_form_aspirante },
            } as ApplicantRecord;
          }));
          this.aspirantes = mapped;
          writeJSON(storageKey, this.aspirantes);
          return this.aspirantes;
        } catch (err) {
          // fallback to legacy aspirantes endpoint or local cache
          // eslint-disable-next-line no-console
          console.warn('[aspirantes] interview.getAll failed, falling back to /aspirantes or cache', err);
          try {
            const resp = await interviewService.getAll();
            const aspirantes = (resp.data ?? []) as ApplicantRecord[];
            this.aspirantes = Array.isArray(aspirantes) ? aspirantes : [];
            writeJSON(storageKey, this.aspirantes);
            return this.aspirantes;
          } catch (err2) {
            // eslint-disable-next-line no-console
            console.warn('[aspirantes] /aspirantes failed, using local cache', err2);
            this.aspirantes = readJSON<ApplicantRecord[]>(storageKey, []);
            return this.aspirantes;
          }
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
