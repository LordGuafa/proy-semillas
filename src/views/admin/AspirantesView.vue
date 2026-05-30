<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseCalendar from "@/components/ui/BaseCalendar.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import {
  useAspirantesStore,
  type ApplicantRecord,
} from "@/stores/aspirantesStore";

const aspirantesStore = useAspirantesStore();
const selectedApplicant = ref<ApplicantRecord | null>(null);
const rejectReason = ref("");
const interviewDate = ref<Date | null>(null);
const readOnlyModalOpen = ref(false);
const rejectModalOpen = ref(false);
const calendarModalOpen = ref(false);
const columns = [
  { key: "fullName", label: "Nombre" },
  { key: "sentDate", label: "Fecha envío" },
  { key: "interviewDate", label: "Fecha entrevista" },
  { key: "status", label: "Estado" },
];
const applicantRows = computed(() =>
  aspirantesStore.aspirantes.filter((item) => item.status === "pending"),
);
function openDetails(applicant: ApplicantRecord) {
  selectedApplicant.value = applicant;
  readOnlyModalOpen.value = true;
}
function openReject(applicant: ApplicantRecord) {
  selectedApplicant.value = applicant;
  rejectReason.value = applicant.rejectionReason ?? "";
  rejectModalOpen.value = true;
}
function openCalendar(applicant: ApplicantRecord) {
  selectedApplicant.value = applicant;
  interviewDate.value = applicant.interviewDate
    ? new Date(applicant.interviewDate)
    : new Date();
  calendarModalOpen.value = true;
}
async function approveApplicant(applicant: ApplicantRecord) {
  await aspirantesStore.aprobarAspirante(applicant.id);
}
async function confirmReject() {
  if (selectedApplicant.value)
    await aspirantesStore.rechazarAspirante(
      selectedApplicant.value.id,
      rejectReason.value,
    );
  rejectModalOpen.value = false;
}
async function confirmInterviewDate() {
  const applicant = selectedApplicant.value;
  const selectedDate = interviewDate.value;
  if (applicant && selectedDate) {
    await aspirantesStore.updateFechaEntrevista(
      applicant.id,
      selectedDate.toISOString().slice(0, 10),
    );
  }
  calendarModalOpen.value = false;
}
onMounted(() => {
  aspirantesStore.fetchAspirantes();
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1>Aspirantes</h1>
      <p class="mt-1 text-sm text-gray-500">
        Revisa las solicitudes enviadas desde el formulario público.
      </p>
    </div>
    <BaseCard>
      <BaseTable
        :columns="columns"
        :rows="applicantRows"
        :loading="aspirantesStore.loading"
        empty-message="No hay aspirantes pendientes."
        ><template #cell-status="{ row }">
          <BaseBadge :status="row.status" /> </template
        ><template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              aria-label="Ver detalles"
              @click="openDetails(row as ApplicantRecord)"
            >
              <EyeIcon class="h-5 w-5" /></button
            ><button
              type="button"
              class="rounded-full p-2 text-primary transition hover:bg-primary/10"
              aria-label="Aprobar aspirante"
              @click="approveApplicant(row as ApplicantRecord)"
            >
              <CheckCircleIcon class="h-5 w-5" /></button
            ><button
              type="button"
              class="rounded-full p-2 text-red-500 transition hover:bg-red-50"
              aria-label="Rechazar aspirante"
              @click="openReject(row as ApplicantRecord)"
            >
              <XCircleIcon class="h-5 w-5" /></button
            ><button
              type="button"
              class="rounded-full p-2 text-accent transition hover:bg-accent/10"
              aria-label="Editar fecha de entrevista"
              @click="openCalendar(row as ApplicantRecord)"
            >
              <CalendarDaysIcon class="h-5 w-5" />
            </button>
          </div>
        </template>
      </BaseTable>
    </BaseCard>
    <BaseModal
      :open="readOnlyModalOpen"
      size="md"
      title="Detalle del aspirante"
      @close="readOnlyModalOpen = false"
    >
      <div v-if="selectedApplicant" class="space-y-4 text-sm text-gray-600">
        <p><strong>Nombre:</strong> {{ selectedApplicant.fullName }}</p>
        <p><strong>Fecha de envío:</strong> {{ selectedApplicant.sentDate }}</p>
        <p>
          <strong>Fecha de entrevista:</strong>
          {{ selectedApplicant.interviewDate }}
        </p>
        <div>
          <p class="mb-2 font-semibold text-primary">Campos del formulario</p>
          <pre class="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-xs">{{
            selectedApplicant.fieldValues
          }}</pre>
        </div>
      </div>
    </BaseModal>
    <BaseModal
      :open="rejectModalOpen"
      size="sm"
      title="Rechazar aspirante"
      @close="rejectModalOpen = false"
    >
      <div class="space-y-4">
        <BaseInput v-model="rejectReason" label="Motivo opcional" />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="rejectModalOpen = false"
            >Cancelar</BaseButton
          >
          <BaseButton variant="danger" @click="confirmReject"
            >Rechazar</BaseButton
          >
        </div>
      </template>
    </BaseModal>
    <BaseModal
      :open="calendarModalOpen"
      size="sm"
      title="Fecha de entrevista"
      @close="calendarModalOpen = false"
    >
      <BaseCalendar v-model="interviewDate" /><template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="calendarModalOpen = false"
            >Cancelar</BaseButton
          >
          <BaseButton variant="primary" @click="confirmInterviewDate"
            >Guardar</BaseButton
          >
        </div>
      </template>
    </BaseModal>
  </div>
</template>
