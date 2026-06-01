<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCalendar from "@/components/ui/BaseCalendar.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import { useEntrevistasStore, type TimeSlotRecord } from "@/stores/entrevistasStore";

const entrevistasStore = useEntrevistasStore();
const deleteModalOpen = ref(false);
const slotToDelete = ref<number | null>(null);

const columns = [
  { key: "franja", label: "Franja" },
  { key: "cuposTotales", label: "Cupos" },
  { key: "id", label: "ID" },
];

const slotsRows = computed(() => entrevistasStore.slots);

function formatFranja(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const weekday = new Intl.DateTimeFormat("es-CO", { weekday: "short" })
    .format(date)
    .replace(/\./g, "")
    .toLowerCase();
  const day = new Intl.DateTimeFormat("es-CO", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("es-CO", { month: "short" })
    .format(date)
    .replace(/\./g, "")
    .toLowerCase();
  const year = new Intl.DateTimeFormat("es-CO", { year: "numeric" }).format(date);
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() < 12 ? "a. m." : "p. m.";

  return `${weekday}, ${day} ${month} ${year}, ${hours}:${minutes} ${period}`;
}

function openEdit(slot: TimeSlotRecord) {
  entrevistasStore.beginEdit(slot);
}

function openEditRow(row: Record<string, unknown>) {
  openEdit(row as TimeSlotRecord);
}

function askDelete(slotId: number) {
  slotToDelete.value = slotId;
  deleteModalOpen.value = true;
}

async function confirmDelete() {
  if (slotToDelete.value == null) return;
  await entrevistasStore.deleteSlot(slotToDelete.value);
  deleteModalOpen.value = false;
  slotToDelete.value = null;
}

async function loadSlots() {
  await entrevistasStore.fetchSlots();
}

async function createSlot() {
  if (entrevistasStore.editingSlot) {
    await entrevistasStore.updateSlot();
  } else {
    const created = await entrevistasStore.createSlot();
    if (created) {
      entrevistasStore.clearEditor();
    }
  }
}

onMounted(() => {
  void loadSlots();
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1>Entrevistas</h1>
      <p class="mt-1 text-sm text-gray-500">
        Crea franjas de entrevistas seleccionando fecha, hora y cupos disponibles.
      </p>
    </div>

    <BaseCard>
      <div class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div class="space-y-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">
              Nueva franja
            </p>
            <h2 class="mt-1 text-lg font-semibold text-gray-900">
              Selecciona la fecha y la hora
            </h2>
          </div>

          <BaseCalendar
            :model-value="entrevistasStore.selectedDate"
            @update:modelValue="entrevistasStore.setDate"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <BaseInput
              v-model="entrevistasStore.selectedTime"
              label="Hora"
              type="time"
              label-position="above"
              :required="true"
            />
            <BaseInput
              v-model="entrevistasStore.cuposTotales"
              label="Cupos disponibles"
              type="number"
              label-position="above"
              :required="true"
              :min="1"
            />
          </div>

          <div class="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <p class="font-semibold text-gray-800">Franja a enviar</p>
            <p class="mt-1">
              {{ entrevistasStore.selectedDate ? formatFranja(`${entrevistasStore.selectedDate.toISOString().split('T')[0]}T${entrevistasStore.selectedTime}:00-05:00`) : 'Selecciona una fecha' }}
            </p>
            <p class="mt-1">
              Cupos: {{ entrevistasStore.cuposTotales || '—' }}
            </p>
          </div>

          <div v-if="entrevistasStore.error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ entrevistasStore.error }}
          </div>

          <div class="flex justify-end gap-3">
            <BaseButton
              v-if="entrevistasStore.editingSlot"
              variant="ghost"
              @click="entrevistasStore.clearEditor()"
            >
              Cancelar edición
            </BaseButton>
            <BaseButton variant="ghost" @click="loadSlots">Refrescar</BaseButton>
            <BaseButton
              variant="primary"
              :loading="entrevistasStore.saving"
              :disabled="!entrevistasStore.canCreate"
              @click="createSlot"
            >
              Crear franja
            </BaseButton>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">
              Franjas creadas
            </p>
            <h2 class="mt-1 text-lg font-semibold text-gray-900">
              Historial de franjas
            </h2>
          </div>

          <BaseTable
            :columns="columns"
            :rows="slotsRows"
            :loading="entrevistasStore.loading"
            empty-message="No hay franjas creadas todavía."
            actions-label="Acciones"
          >
            <template #cell-franja="{ row }">
              {{ formatFranja(row.franja) }}
            </template>

            <template #cell-cuposTotales="{ row }">
              {{ row.cuposTotales }}
            </template>

            <template #actions="{ row }">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-full p-2 text-accent transition hover:bg-accent/10"
                  aria-label="Editar franja"
                  title="Editar franja"
                  @click="openEditRow(row)"
                >
                  <PencilSquareIcon class="h-5 w-5" />
                </button>
                <button
                  type="button"
                  class="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Borrar franja"
                  title="Borrar franja"
                  @click="askDelete(row.id)"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </template>
          </BaseTable>
        </div>
      </div>
    </BaseCard>

    <BaseModal
      :open="deleteModalOpen"
      size="sm"
      title="Borrar franja"
      @close="deleteModalOpen = false"
    >
      <p class="text-sm text-gray-600">
        Esta acción borrará la franja seleccionada usando su `franja_id`.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="deleteModalOpen = false">Cancelar</BaseButton>
          <BaseButton
            variant="danger"
            :loading="entrevistasStore.deleting"
            @click="confirmDelete"
          >
            Borrar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>