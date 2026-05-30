<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCalendar from "@/components/ui/BaseCalendar.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import FormFieldReadonly from "@/components/matriculas/FormFieldReadonly.vue";
import { useMatriculasStore } from "@/stores/matriculasStore";
import type Matricula from "@/types/matricula";
import {
  matriculaStatusLabel,
  matriculaStatusVariant,
  type MatriculaStatus,
} from "@/types/matricula";

const props = defineProps<{
  open: boolean;
  matricula: Matricula | null;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const store = useMatriculasStore();
const selectedStatus = ref<MatriculaStatus>("PENDIENTE");
const interviewDate = ref<Date | null>(null);
const rejectReason = ref("");
const confirmApproveOpen = ref(false);
const successStudentId = ref<number | null>(null);
const working = ref(false);

function getInitials(studentName: string): string {
  const parts = studentName.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "M";
}

function fullNameFromStudentData(): string {
  const studentData = props.matricula?.studentData ?? {};
  const firstName = String(
    studentData.firstname ?? studentData.firstName ?? studentData.name ?? "",
  );
  const lastName = String(studentData.lastname ?? studentData.lastName ?? "");
  const composed = `${firstName} ${lastName}`.trim();
  if (composed) return composed;
  const fallback = Object.values(studentData).find(
    (value) => typeof value === "string" && value.trim(),
  );
  return typeof fallback === "string" ? fallback : "Sin nombre";
}

const studentName = computed(() => fullNameFromStudentData());
const avatarInitials = computed(() => getInitials(studentName.value));
const isApproved = computed(() => props.matricula?.status === "APROBADA");
const isRejected = computed(() => props.matricula?.status === "RECHAZADA");
const canApprove = computed(() =>
  ["EN_REVISION", "ENTREVISTA"].includes(props.matricula?.status ?? ""),
);
const canReject = computed(() => !isApproved.value && !isRejected.value);
const showRejectEditor = computed(() => selectedStatus.value === "RECHAZADA");
const showInterviewEditor = computed(
  () => selectedStatus.value === "ENTREVISTA",
);
const fullWidthField = (field: { id: string; label: string; type: string }) => {
  const label = field.label.toLowerCase();
  const id = field.id.toLowerCase();
  return (
    field.type === "textarea" ||
    label.includes("dirección") ||
    label.includes("observacion") ||
    label.includes("observación") ||
    id.includes("dirección") ||
    id.includes("observacion") ||
    id.includes("observación")
  );
};

const formFields = computed(() => {
  const fields = props.matricula?.formSnapshot?.campos ?? [];
  return fields.filter(
    (field) =>
      !String(field.id).toLowerCase().includes("photo") &&
      !String(field.label).toLowerCase().includes("foto"),
  );
});

const guardianFields = computed(() => {
  const guardianData = props.matricula?.guardianData ?? {};
  return Object.entries(guardianData)
    .filter(
      ([, value]) =>
        value !== null && value !== undefined && String(value).trim() !== "",
    )
    .map(([key, value]) => ({
      id: key,
      label: key,
      type:
        typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
            ? "number"
            : "text",
      value,
    }));
});

function syncLocalState() {
  const matricula = props.matricula;
  selectedStatus.value = matricula?.status ?? "PENDIENTE";
  interviewDate.value = matricula?.interviewDate
    ? new Date(matricula.interviewDate)
    : null;
  rejectReason.value = "";
  successStudentId.value = null;
  confirmApproveOpen.value = false;
}

watch(
  () => props.matricula?.id,
  () => {
    syncLocalState();
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) syncLocalState();
  },
);

async function updateSelectedStatus(status: MatriculaStatus, motivo?: string) {
  if (!props.matricula) return;
  working.value = true;
  try {
    await store.updateStatus(props.matricula.id, status, motivo);
    selectedStatus.value = status;
    if (props.matricula.status !== status) {
      // la matrícula del store ya quedó sincronizada
    }
  } finally {
    working.value = false;
  }
}

async function handleStatusChange() {
  if (!props.matricula) return;
  const nextStatus = selectedStatus.value;
  if (nextStatus === "RECHAZADA" || nextStatus === "ENTREVISTA") return;
  await updateSelectedStatus(nextStatus);
}

async function confirmInterview() {
  if (!props.matricula || !interviewDate.value) return;
  working.value = true;
  try {
    await store.assignInterview(
      props.matricula.id,
      interviewDate.value.toISOString(),
    );
    selectedStatus.value = "ENTREVISTA";
  } finally {
    working.value = false;
  }
}

async function confirmRejection() {
  if (!props.matricula) return;
  const motivo = rejectReason.value.trim();
  if (!motivo) return;
  working.value = true;
  try {
    await store.rejectMatricula(props.matricula.id, motivo);
    selectedStatus.value = "RECHAZADA";
  } finally {
    working.value = false;
  }
}

async function confirmApproval() {
  if (!props.matricula) return;
  working.value = true;
  try {
    const result = await store.approveAndCreateStudent(props.matricula.id);
    if (result.studentId) {
      successStudentId.value = result.studentId;
      selectedStatus.value = "APROBADA";
    }
    confirmApproveOpen.value = false;
  } finally {
    working.value = false;
  }
}

function openRejectMode() {
  selectedStatus.value = "RECHAZADA";
}
</script>

<template>
  <BaseModal
    :open="open"
    size="lg"
    title="Detalle de matrícula"
    zIndexClass="z-[60]"
    @close="emit('close')"
  >
    <div v-if="matricula" class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside
        class="space-y-5 rounded-2xl border border-gray-100 bg-gray-50 p-5"
      >
        <div class="flex flex-col items-center gap-3 text-center">
          <div
            v-if="matricula.photoURL"
            class="h-20 w-20 overflow-hidden rounded-full bg-primary/10"
          >
            <img
              :src="matricula.photoURL"
              :alt="studentName"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary"
          >
            {{ avatarInitials }}
          </div>
          <div>
            <h3 class="text-base font-semibold text-primary">
              {{ studentName }}
            </h3>
            <p class="text-xs text-gray-500">Solicitud #{{ matricula.id }}</p>
          </div>
          <BaseBadge
            :variant="
              matriculaStatusVariant[selectedStatus] ||
              matriculaStatusVariant[matricula.status]
            "
          >
            {{
              matriculaStatusLabel[selectedStatus] ||
              matriculaStatusLabel[matricula.status]
            }}
          </BaseBadge>
        </div>

        <hr class="border-gray-200" />

        <section class="space-y-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-accent"
            >
              Gestión
            </p>
            <div class="mt-3 space-y-3">
              <BaseSelect
                v-model="selectedStatus"
                label="Estado"
                :options="[
                  { label: 'Pendiente', value: 'PENDIENTE' },
                  { label: 'En revisión', value: 'EN_REVISION' },
                  { label: 'Entrevista agendada', value: 'ENTREVISTA' },
                  { label: 'Aprobada', value: 'APROBADA' },
                  { label: 'Rechazada', value: 'RECHAZADA' },
                ]"
                @update:modelValue="handleStatusChange"
              />

              <div
                v-if="showInterviewEditor"
                class="space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-3"
              >
                <p class="text-xs font-semibold text-blue-700">
                  Agendar entrevista
                </p>
                <BaseCalendar v-model="interviewDate" />
                <BaseButton
                  variant="primary"
                  block
                  :loading="working"
                  @click="confirmInterview"
                >
                  Confirmar entrevista
                </BaseButton>
              </div>

              <div
                v-if="showRejectEditor"
                class="space-y-3 rounded-xl border border-red-100 bg-red-50 p-3"
              >
                <p class="text-xs font-semibold text-red-600">
                  Motivo del rechazo
                </p>
                <textarea
                  v-model="rejectReason"
                  rows="4"
                  class="panel-input min-h-28 pt-4"
                  placeholder="Escribe el motivo del rechazo"
                />
                <BaseButton
                  variant="danger"
                  block
                  :loading="working"
                  :disabled="!rejectReason.trim()"
                  @click="confirmRejection"
                >
                  Confirmar rechazo
                </BaseButton>
              </div>

              <BaseButton
                v-if="canApprove"
                variant="primary"
                block
                :loading="working"
                @click="confirmApproveOpen = true"
              >
                Aprobar y crear estudiante
              </BaseButton>

              <BaseButton
                v-if="canReject && !showRejectEditor"
                variant="ghost"
                class="border-red-200 text-red-600 hover:bg-red-50"
                block
                @click="openRejectMode"
              >
                Rechazar
              </BaseButton>
            </div>
          </div>
        </section>

        <hr class="border-gray-200" />

        <div class="space-y-2 text-xs text-gray-400">
          <p>
            Enviado el:
            {{ new Date(matricula.submittedAt).toLocaleDateString("es-CO") }}
          </p>
          <p>Asignado a: {{ matricula.assignedTo || "Sin asignar" }}</p>
        </div>

        <div
          v-if="successStudentId"
          class="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-800"
        >
          <p class="font-semibold">Estudiante creado correctamente</p>
          <RouterLink
            :to="`/admin/estudiantes?highlight=${successStudentId}`"
            class="mt-1 inline-flex font-medium text-primary underline underline-offset-2"
          >
            Ver estudiante →
          </RouterLink>
        </div>
      </aside>

      <section class="space-y-6">
        <div>
          <p
            class="mb-4 text-sm font-semibold uppercase tracking-wide text-accent"
          >
            Datos del formulario
          </p>
          <div v-if="formFields.length" class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="field in formFields"
              :key="field.id"
              :class="fullWidthField(field) ? 'sm:col-span-2' : ''"
            >
              <FormFieldReadonly
                :label="field.label"
                :value="field.value"
                :type="field.type"
              />
            </div>
          </div>
          <p v-else class="text-sm italic text-gray-400">
            No hay datos disponibles
          </p>
        </div>

        <hr class="border-gray-200" />

        <div v-if="guardianFields.length">
          <p
            class="mb-4 text-sm font-semibold uppercase tracking-wide text-accent"
          >
            Datos del acudiente
          </p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="field in guardianFields" :key="field.id">
              <FormFieldReadonly
                :label="field.label"
                :value="field.value"
                :type="field.type"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">Cerrar</BaseButton>
      </div>
    </template>
  </BaseModal>

  <BaseModal
    :open="confirmApproveOpen"
    size="sm"
    title="Confirmar aprobación"
    zIndexClass="z-[70]"
    @close="confirmApproveOpen = false"
  >
    <p class="text-sm text-gray-600">
      Se creará un nuevo estudiante con los datos de esta matrícula. Esta acción
      no se puede deshacer.
    </p>
    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="confirmApproveOpen = false"
          >Cancelar</BaseButton
        >
        <BaseButton
          variant="primary"
          :loading="working"
          @click="confirmApproval"
          >Confirmar</BaseButton
        >
      </div>
    </template>
  </BaseModal>
</template>
