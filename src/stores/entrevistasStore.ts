import { defineStore } from "pinia";
import { timeSlotService } from "@/services/api";

export type TimeSlotRecord = {
  id: number;
  franja: string;
  cuposTotales: number;
};

type TimeSlotPayload = {
  cupos_totales: number;
  franja: string;
};

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

function normalizeTimeSlot(value: unknown): TimeSlotRecord | null {
  const data = toRecord(value);
  const id = toNumber(data.id, 0);
  if (!id) return null;

  return {
    id,
    franja: toString(data.franja ?? data.fecha ?? data.franja_entrevista, ""),
    cuposTotales: toNumber(data.cupos_totales ?? data.cuposTotales, 0),
  };
}

function normalizeTimeSlotList(value: unknown): TimeSlotRecord[] {
  const payload = toRecord(value);
  const items = Array.isArray(payload.franjas)
    ? payload.franjas
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(value)
        ? value
        : [];

  return items
    .map((item) => normalizeTimeSlot(item))
    .filter((item): item is TimeSlotRecord => Boolean(item))
    .sort((left, right) => left.franja.localeCompare(right.franja));
}

function buildFranja(date: Date, time: string): string {
  const [hours = "0", minutes = "0"] = time.split(":");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(Number(hours)).padStart(2, "0");
  const minute = String(Number(minutes)).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:00-05:00`;
}

export const useEntrevistasStore = defineStore("entrevistas", {
  state: () => ({
    slots: [] as TimeSlotRecord[],
    loading: false,
    saving: false,
    deleting: false,
    error: null as string | null,
    selectedDate: null as Date | null,
    selectedTime: "10:00",
    cuposTotales: 10,
    editingSlot: null as TimeSlotRecord | null,
  }),
  getters: {
    canCreate: (state) => Boolean(state.selectedDate && state.selectedTime && state.cuposTotales > 0),
  },
  actions: {
    setDate(date: Date | null) {
      this.selectedDate = date;
    },
    beginEdit(slot: TimeSlotRecord) {
      const slotDate = new Date(slot.franja);
      this.editingSlot = slot;
      this.selectedDate = Number.isNaN(slotDate.getTime()) ? null : slotDate;
      this.selectedTime = Number.isNaN(slotDate.getTime())
        ? "10:00"
        : `${String(slotDate.getHours()).padStart(2, "0")}:${String(slotDate.getMinutes()).padStart(2, "0")}`;
      this.cuposTotales = slot.cuposTotales;
    },
    clearEditor() {
      this.editingSlot = null;
      this.selectedDate = null;
      this.selectedTime = "10:00";
      this.cuposTotales = 10;
    },
    async fetchSlots() {
      this.loading = true;
      this.error = null;
      try {
        const response = await timeSlotService.getAll();
        this.slots = normalizeTimeSlotList(response.data);
        return this.slots;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible cargar las franjas: ${message}`;
        this.slots = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createSlot() {
      if (!this.selectedDate || !this.selectedTime || this.cuposTotales <= 0) {
        throw new Error("Debes seleccionar fecha, hora y cupos válidos.");
      }

      this.saving = true;
      this.error = null;
      try {
        const payload: TimeSlotPayload = {
          cupos_totales: this.cuposTotales,
          franja: buildFranja(this.selectedDate, this.selectedTime),
        };
        const response = await timeSlotService.create(payload);
        const created = normalizeTimeSlot(response.data ?? payload);
        if (created) {
          this.slots = [created, ...this.slots].sort((left, right) => left.franja.localeCompare(right.franja));
        }
        return created;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible crear la franja: ${message}`;
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateSlot() {
      if (!this.editingSlot || !this.selectedDate || !this.selectedTime || this.cuposTotales <= 0) {
        throw new Error("Debes seleccionar fecha, hora y cupos válidos.");
      }

      this.saving = true;
      this.error = null;
      try {
        const payload: TimeSlotPayload = {
          cupos_totales: this.cuposTotales,
          franja: buildFranja(this.selectedDate, this.selectedTime),
        };
        const response = await timeSlotService.update(this.editingSlot.id, payload);
        const updated = normalizeTimeSlot(response.data ?? { id: this.editingSlot.id, ...payload });
        if (updated) {
          this.slots = this.slots
            .map((slot) => (slot.id === this.editingSlot?.id ? updated : slot))
            .sort((left, right) => left.franja.localeCompare(right.franja));
        }
        this.clearEditor();
        return updated;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible actualizar la franja: ${message}`;
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async deleteSlot(id: number | string) {
      this.deleting = true;
      this.error = null;
      try {
        await timeSlotService.remove(id);
        this.slots = this.slots.filter((slot) => slot.id !== Number(id));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = `No fue posible borrar la franja: ${message}`;
        throw error;
      } finally {
        this.deleting = false;
      }
    },
  },
});