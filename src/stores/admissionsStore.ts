import { defineStore } from "pinia";
import { interviewService } from "@/services/api";
import { readJSON, writeJSON } from "@/utils/storage";
import type { Campo, FormSchema } from "@/types/formulario";

export type AdmissionPayload = {
  nom_padre?: string;
  nom_madre?: string;
  correo: string;
  celular?: string;
  nom_estudiante?: string;
  edad_estudiante?: number;
  como_conocimiento?: string;
  id_franja_entrevista: number;
  schema_version: number;
  informacion_aspirante: Record<string, unknown>;
};

export type AvailableTimeSlot = {
  id: number;
  franja: string;
  cuposTotales: number;
};

export type TimeSlotDetail = {
  id: number;
  franja: string;
  cuposTotales: number;
};

export type InterviewSetup = {
  schema: FormSchema | null;
  availableTimeSlots: AvailableTimeSlot[];
};

const storageKey = "semillas-admissions";
const interviewFormType = "entrevista";

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : String(value ?? fallback);
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function normalizeCampoType(value: unknown): Campo["type"] {
  const type = toString(value, "text").toLowerCase();

  if (["string", "text", "input"].includes(type)) return "text";
  if (["number", "integer", "decimal", "float"].includes(type)) return "number";
  if (["date", "datetime", "timestamp"].includes(type)) return "date";
  if (["select", "option", "list"].includes(type)) return "select";
  if (["boolean", "bool", "checkbox", "toggle"].includes(type)) return "boolean";
  if (["textarea", "text_area"].includes(type)) return "textarea";

  return "text";
}

function normalizeCampo(value: unknown, index: number): Campo | null {
  const data = toRecord(value);
  const explicitId = toString(
    data.id ?? data.fieldId ?? data.field_id ?? data.key ?? data.name ?? data.nombre,
    "",
  );

  if (explicitId) {
    return {
      id: explicitId,
      label: toString(data.label ?? data.etiqueta ?? data.nombre ?? data.title, explicitId),
      type: normalizeCampoType(data.type ?? data.tipo),
      required: Boolean(data.required ?? data.requerido ?? false),
      visible: data.visible !== false,
      order: toNumber(data.order ?? data.orden, index + 1),
      options: Array.isArray(data.options)
        ? data.options.map((option) => String(option))
        : undefined,
      placeholder:
        typeof data.placeholder === "string" ? data.placeholder : undefined,
      fijo: Boolean(data.fijo ?? data.fixed ?? false),
    };
  }

  const entries = Object.entries(data);
  const firstEntry = entries[0];
  if (!firstEntry) return null;

  const [key] = firstEntry;

  return {
    id: key,
    label: humanizeKey(key),
    type: "text",
    required: false,
    visible: true,
    order: index + 1,
  };
}

function normalizeFormSchema(value: unknown): FormSchema | null {
  const payload = toRecord(value);
  const schema = toRecord(
    payload.form_schema ?? payload.formSchema ?? payload.data ?? value,
  );

  if (!Object.keys(schema).length) return null;

  const campos = Array.isArray(schema.campos)
    ? schema.campos
        .map((campo, index) => normalizeCampo(campo, index))
        .filter((campo): campo is Campo => Boolean(campo))
        .sort((left, right) => left.order - right.order)
    : [];

  return {
    id: toNumber(schema.id, 0),
    formulario: toString(schema.formulario, interviewFormType) as FormSchema["formulario"],
    version: toNumber(schema.version, 1),
    activo: schema.activo !== false,
    campos,
    updatedBy: typeof (schema.updated_by ?? schema.updatedBy) === "string"
      ? String(schema.updated_by ?? schema.updatedBy)
      : undefined,
    createdAt: toString(schema.created_at ?? schema.createdAt, new Date().toISOString()),
    updatedAt: toString(schema.updated_at ?? schema.updatedAt, new Date().toISOString()),
  };
}

function normalizeAvailableTimeSlot(value: unknown): AvailableTimeSlot | null {
  const data = toRecord(value);
  const id = toNumber(data.id, 0);
  if (!id) return null;

  return {
    id,
    franja: toString(data.franja ?? data.franja_entrevista, ""),
    cuposTotales: toNumber(data.cupos_totales ?? data.cuposTotales, 0),
  };
}

function normalizeAvailableTimeSlots(value: unknown): AvailableTimeSlot[] {
  const payload = toRecord(value);
  const slots = Array.isArray(payload.franjas)
    ? payload.franjas
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(value)
        ? value
        : [];

  return slots
    .map((slot) => normalizeAvailableTimeSlot(slot))
    .filter((slot): slot is AvailableTimeSlot => Boolean(slot))
    .sort((left, right) => left.franja.localeCompare(right.franja));
}

function normalizeTimeSlotDetail(value: unknown): TimeSlotDetail | null {
  const payload = toRecord(value);
  const franja = toRecord(payload.franja ?? payload.data ?? value);
  const id = toNumber(franja.id, 0);
  if (!id) return null;

  return {
    id,
    franja: toString(franja.franja ?? franja.fecha ?? "", ""),
    cuposTotales: toNumber(franja.cupos_totales ?? franja.cuposTotales, 0),
  };
}

export const useAdmissionsStore = defineStore("admissions", {
  state: () => ({
    records: readJSON<AdmissionPayload[]>(storageKey, []),
    schema: null as FormSchema | null,
    availableTimeSlots: [] as AvailableTimeSlot[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchInterviewContext() {
      this.loading = true;
      this.error = null;
      try {
        const schemaResponse = await interviewService.getLatestFormSchema();
        console.log("[admissions] latest-form-schema raw:", schemaResponse.data);
        this.schema = normalizeFormSchema(schemaResponse.data);
        console.log("[admissions] latest-form-schema normalized:", this.schema);

        try {
          const slotsResponse = await interviewService.getAvailableTimeSlots();
          console.log("[admissions] available-time-slots raw:", slotsResponse.data);
          this.availableTimeSlots = normalizeAvailableTimeSlots(
            slotsResponse.data,
          );
          console.log(
            "[admissions] available-time-slots normalized:",
            this.availableTimeSlots,
          );
        } catch (slotsError) {
          this.availableTimeSlots = [];
          const message =
            slotsError instanceof Error ? slotsError.message : String(slotsError);
          this.error = `Se cargó el esquema de entrevista, pero no las franjas: ${message}`;
        }

        return {
          schema: this.schema,
          availableTimeSlots: this.availableTimeSlots,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible cargar la información de entrevista: ${message}`;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchAdmissions() {
      return this.fetchInterviewContext();
    },
    async submitInterview(payload: AdmissionPayload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await interviewService.create(payload);
        const created = (response.data ?? payload) as AdmissionPayload;
        this.records = [created, ...this.records];
        writeJSON(storageKey, this.records);
        return created;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible agendar la visita: ${message}`;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async submitAdmission(payload: AdmissionPayload) {
      return this.submitInterview(payload);
    },
    async fetchTimeSlotById(id: number | string) {
      const response = await interviewService.getTimeSlotById(id);
      return normalizeTimeSlotDetail(response.data);
    },
  },
});
