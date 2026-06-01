<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import {
  useAspirantesStore,
  type ApplicantRecord,
} from "@/stores/aspirantesStore";
import { useFormularioStore } from "@/stores/formularioStore";
import { interviewService } from "@/services/api";

const aspirantesStore = useAspirantesStore();
const formularioStore = useFormularioStore();
const selectedApplicant = ref<ApplicantRecord | null>(null);
const selectedInterviewData = ref<any | null>(null);
const rejectReason = ref("");
const readOnlyModalOpen = ref(false);
const rejectModalOpen = ref(false);
const columns = [
  { key: "fullName", label: "Nombre" },
  { key: "sentDate", label: "Fecha envío" },
  { key: "interviewDate", label: "Fecha entrevista" },
  { key: "status", label: "Estado" },
];
const applicantRows = computed(() =>
  aspirantesStore.aspirantes.filter((item) => item.status === "pending"),
);
const selectedApplicantFields = computed(() =>
  Object.entries(selectedApplicant.value?.fieldValues ?? {}),
);

const interviewFieldLabelMap = computed(() => {
  const labels = new Map<string, string>();
  const sources = [
    selectedInterviewData.value?.form_schema?.campos,
    formularioStore.camposActivos,
  ];

  for (const source of sources) {
    if (!Array.isArray(source)) continue;
    for (const field of source as Array<{ id?: string; label?: string }>) {
      const key = String(field.id ?? "").trim();
      const label = String(field.label ?? "").trim();
      if (key && label && !labels.has(key)) labels.set(key, label);
    }
  }

  return labels;
});

const technicalFieldKeys = new Set([
  "id",
  "schema_version",
  "created_at",
  "updated_at",
  "correo_form_aspirante",
  "correo",
  "id_franja_entrevista",
]);

const interviewDisplayFields = computed(() => {
  const interview = selectedInterviewData.value;
  if (!interview) return [];

  const mergedEntries = [
    ...(Object.entries(interview.form_aspirantes ?? {}) as Array<[string, unknown]>),
    ...(Object.entries(interview.informacion_aspirante ?? {}) as Array<[string, unknown]>),
  ];

  const uniqueFields = new Map<string, unknown>();
  for (const [key, value] of mergedEntries) {
    const normalizedKey = String(key).trim();
    if (!normalizedKey || technicalFieldKeys.has(normalizedKey)) continue;
    if (value === null || value === undefined || value === "") continue;
    if (!uniqueFields.has(normalizedKey)) uniqueFields.set(normalizedKey, value);
  }

  return Array.from(uniqueFields.entries());
});

function formatInterviewDate(value: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const weekday = new Intl.DateTimeFormat('es-CO', { weekday: 'short' })
    .format(date)
    .replace('.', '')
    .toLowerCase();
  const day = new Intl.DateTimeFormat('es-CO', { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('es-CO', { month: 'short' })
    .format(date)
    .replace('.', '')
    .toLowerCase();
  const year = new Intl.DateTimeFormat('es-CO', { year: 'numeric' }).format(date);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const normalizedHours = String(hours % 12 || 12).padStart(2, '0');
  const period = hours < 12 ? 'a. m.' : 'p. m.';

  return `${weekday}, ${day} ${month} ${year}, ${normalizedHours}:${minutes} ${period}`;
}

function formatFieldLabel(key: string) {
  const label = interviewFieldLabelMap.value.get(key);
  if (label) return label;

  const fallbackLabels: Record<string, string> = {
    nom_madre: "Nombre de la madre",
    nom_padre: "Nombre del padre",
    correo: "Correo electrónico",
    celular: "Número de celular",
    nom_estudiante: "Nombre del niño o la niña",
    edad_estudiante: "Edad del estudiante",
    como_conocimiento: "¿Cómo se enteró de nosotros?",
    fechaPreferidaEntrevista: "Fecha preferida de entrevista",
    correo_form_aspirante: "Correo del aspirante",
  };

  if (fallbackLabels[key]) return fallbackLabels[key];

  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}
async function openDetails(applicant: ApplicantRecord) {
  selectedApplicant.value = applicant;
  selectedInterviewData.value = null;
  try {
    const resp = await interviewService.getAll();
    const interviews = resp.data?.interviews ?? resp.data ?? [];
    const match = (interviews as any[]).find((it) => String(it.id) === String(applicant.id));
    if (match) selectedInterviewData.value = match;
  } catch (err) {
    // fallback: do nothing, we'll show stored fieldValues
    // eslint-disable-next-line no-console
    console.warn('[aspirantes] failed to fetch interview details', err);
  }
  readOnlyModalOpen.value = true;
}
function openReject(applicant: ApplicantRecord) {
  selectedApplicant.value = applicant;
  rejectReason.value = applicant.rejectionReason ?? "";
  rejectModalOpen.value = true;
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
onMounted(() => {
  formularioStore.fetchFormulario("entrevista");
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
      >
        <template #cell-sentDate="{ row }">
          {{ formatInterviewDate(row.sentDate) }}
        </template>
        <template #cell-interviewDate="{ row }">
          {{ formatInterviewDate(row.interviewDate) }}
        </template>
        ><template #cell-status="{ row }">
          <BaseBadge :status="row.status" /> </template
        ><template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              aria-label="Ver detalles"
              title="Ver detalles de la entrevista"
              @click="openDetails(row as ApplicantRecord)"
            >
              <EyeIcon class="h-5 w-5" /></button
            ><button
              type="button"
              class="rounded-full p-2 text-primary transition hover:bg-primary/10"
              aria-label="Aprobar aspirante"
              title="Aprobar aspirante"
              @click="approveApplicant(row as ApplicantRecord)"
            >
              <CheckCircleIcon class="h-5 w-5" /></button
            ><button
              type="button"
              class="rounded-full p-2 text-red-500 transition hover:bg-red-50"
              aria-label="Rechazar aspirante"
              title="Rechazar aspirante"
              @click="openReject(row as ApplicantRecord)"
            >
              <XCircleIcon class="h-5 w-5" />
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
        <p><strong>Fecha de envío:</strong> {{ formatInterviewDate(selectedApplicant.sentDate) }}</p>
        <p>
          <strong>Fecha de entrevista:</strong>
          {{ formatInterviewDate(selectedApplicant.interviewDate) }}
        </p>

        <div class="mt-2">
          <p class="mb-2 font-semibold text-primary">Información del formulario</p>
          <div class="space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
            <div
              v-for="[key, value] in interviewDisplayFields"
              :key="key"
              class="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
            >
              <span class="font-medium text-gray-700">{{ formatFieldLabel(key) }}</span>
              <span class="text-gray-600">{{ value ?? '—' }}</span>
            </div>
          </div>
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
  </div>
</template>
