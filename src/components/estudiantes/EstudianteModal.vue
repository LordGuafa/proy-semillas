<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { PlusIcon } from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import { tipoDocumentoLabel, type TipoDocumento } from "@/types/enums";
import type { Guardian } from "@/types/guardian";
import type { Student } from "@/types/student";
import { studentStatusLabel, studentStatusVariant } from "@/types/student";
import GuardianCard from "./GuardianCard.vue";
import GuardianFormModal from "./GuardianFormModal.vue";

const props = defineProps<{
  open: boolean;
  student: Student | null;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "saved"): void;
}>();

const estudiantesStore = useEstudiantesStore();
const activeTab = ref<"student" | "guardians">("student");
const guardianModalOpen = ref(false);
const editingGuardian = ref<Guardian | null>(null);
const previewUrl = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const objectUrl = ref("");

const form = reactive({
  documentType: "CC" as TipoDocumento,
  documentNumber: "",
  firstname: "",
  secondname: "",
  lastname: "",
  secondlastname: "",
  birthdate: "",
  homeAddress: "",
  strata: "",
  hasLunch: false,
  hasTransport: false,
  status: "ASPIRANTE" as string,
  photoURL: "",
});

const documentTypeOptions = Object.entries(tipoDocumentoLabel).map(([value, label]) => ({
  label,
  value,
}));

const statusOptions = [
  { label: "Aspirante", value: "ASPIRANTE" },
  { label: "Activo", value: "ACTIVO" },
  { label: "Retirado", value: "RETIRADO" },
  { label: "Egresado", value: "EGRESADO" },
];

const guardianList = computed(() => {
  if (!props.student) return [];
  return estudiantesStore.guardians[props.student.id] ?? [];
});

const currentStudent = computed(() => props.student ?? null);
const guardianCount = computed(() => guardianList.value.length);
const isReadOnly = computed(() => Boolean(props.readonly));
const managedStudentId = computed(() => Number(props.student?.id ?? 0));
const guardianTabLabel = computed(() => `Acudientes (${guardianCount.value})`);

const studentAvatarInitials = computed(() => {
  const s = currentStudent.value;
  return `${s?.primerNombre?.[0] ?? s?.firstname?.[0] ?? ""}${s?.primerApellido?.[0] ?? s?.lastname?.[0] ?? ""}`.toUpperCase() || "ES";
});

const currentStatus = computed(() => currentStudent.value?.status ?? form.status ?? "ASPIRANTE");

const modalTitle = computed(() => {
  if (!props.student) return "Nuevo estudiante";
  return props.readonly ? "Detalle del estudiante" : "Editar estudiante";
});

const statusLabel = computed(() => studentStatusLabel[currentStatus.value ?? "ASPIRANTE"] ?? "Aspirante");

const showExalumnosWarning = computed(() => form.status === "RETIRADO" || form.status === "EGRESADO");

// Solo los campos requeridos en modo detalle
const readOnlyFields = computed(() => {
  const s = currentStudent.value;
  if (!s) return [];
  return [
    { label: "Primer nombre", value: s.primerNombre || s.firstname || "—" },
    { label: "Segundo nombre", value: s.segundoNombre || "—" },
    { label: "Primer apellido", value: s.primerApellido || s.lastname || "—" },
    { label: "Segundo apellido", value: s.segundoApellido || "—" },
    { label: "Tipo de documento", value: tipoDocumentoLabel[s.tipoDocumento ?? "CC"] ?? s.tipoDocumento ?? "—" },
    { label: "Documento de identidad", value: s.documentoIdentidad || "—" },
    { label: "Fecha de nacimiento", value: s.fechaNacimiento ? new Date(s.fechaNacimiento).toLocaleDateString("es-CO") : "—" },
    { label: "Dirección de residencia", value: s.direccionResidencia || s.homeAddress || "—" },
    { label: "Estrato", value: s.estrato ? String(s.estrato) : (s.strata || "—") },
    { label: "Almuerzo", value: (s.tieneAlmuerzo ?? s.hasLunch) ? "Sí" : "No" },
    { label: "Transporte de ruta", value: (s.tieneTranporteRuta ?? s.hasTransport) ? "Sí" : "No" },
    { label: "Estado", value: studentStatusLabel[s.status ?? "ASPIRANTE"] ?? "Aspirante" },
  ];
});

function resetObjectUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = "";
  }
}

function syncStudentForm() {
  const s = props.student;
  form.documentType = s?.tipoDocumento ?? "CC";
  form.documentNumber = s?.documentoIdentidad ?? "";
  form.firstname = s?.primerNombre ?? s?.firstname ?? "";
  form.secondname = s?.segundoNombre ?? "";
  form.lastname = s?.primerApellido ?? s?.lastname ?? "";
  form.secondlastname = s?.segundoApellido ?? "";
  form.birthdate = s?.fechaNacimiento ?? "";
  form.homeAddress = s?.direccionResidencia ?? s?.homeAddress ?? "";
  form.strata = s?.estrato ? String(s.estrato) : (s?.strata ?? "");
  form.hasLunch = s?.tieneAlmuerzo ?? s?.hasLunch ?? false;
  form.hasTransport = s?.tieneTranporteRuta ?? s?.hasTransport ?? false;
  form.status = s?.status ?? "ASPIRANTE";
  form.photoURL = s?.fotoUrl ?? s?.photoURL ?? "";
  previewUrl.value = s?.fotoUrl ?? s?.photoURL ?? "";
  resetObjectUrl();
  activeTab.value = "student";
}

function formatDetailValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

watch(() => props.open, (isOpen) => { if (isOpen) syncStudentForm(); }, { immediate: true });
watch(() => props.student, () => { if (props.open) syncStudentForm(); });
onBeforeUnmount(() => { resetObjectUrl(); });

async function ensureGuardiansLoaded() {
  if (!props.student) return;
  if (!estudiantesStore.guardians[props.student.id]) {
    await estudiantesStore.fetchGuardians(props.student.id);
  }
}

watch(activeTab, async (tab) => {
  if (tab === "guardians") await ensureGuardiansLoaded();
});

function openFilePicker() { fileInputRef.value?.click(); }

function handlePhotoChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  resetObjectUrl();
  objectUrl.value = URL.createObjectURL(file);
  previewUrl.value = objectUrl.value;
  form.photoURL = objectUrl.value;
}

async function saveStudent() {
  if (props.readonly) return;
  const payload = {
    tipoDocumento: form.documentType,
    documentoIdentidad: form.documentNumber.trim(),
    firstname: form.firstname.trim(),
    segundoNombre: form.secondname.trim() || undefined,
    lastname: form.lastname.trim(),
    segundoApellido: form.secondlastname.trim() || undefined,
    fechaNacimiento: form.birthdate || undefined,
    homeAddress: form.homeAddress.trim(),
    strata: form.strata.trim() || undefined,
    hasLunch: form.hasLunch,
    hasTransport: form.hasTransport,
    status: form.status,
    photoURL: previewUrl.value,
  } as unknown as Student;

  if (props.student) {
    await estudiantesStore.updateEstudiante(props.student.id, payload);
  } else {
    await estudiantesStore.createEstudiante(payload);
  }
  emit("saved");
}

function openCreateGuardian() {
  if (managedStudentId.value <= 0) return;
  editingGuardian.value = null;
  guardianModalOpen.value = true;
}

function openEditGuardian(guardian: Guardian) {
  editingGuardian.value = guardian;
  guardianModalOpen.value = true;
}

async function deleteGuardian(guardianId: number) {
  if (!props.student) return;
  await estudiantesStore.deleteGuardian(props.student.id, guardianId);
}
</script>

<template>
  <BaseModal :open="open" size="lg" :title="modalTitle" @close="emit('close')">
    <div class="space-y-6">

      <!-- Tabs (solo en modo edición) -->
      <div v-if="!isReadOnly" class="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-4">
        <div role="tablist" aria-label="Secciones del modal">
          <button type="button" role="tab" :aria-selected="activeTab === 'student'"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeTab === 'student' ? 'bg-primary text-white' : 'border border-primary text-primary hover:bg-primary/10'"
            @click="activeTab = 'student'">Datos del estudiante</button>
          <button v-if="student" type="button" role="tab" :aria-selected="activeTab === 'guardians'"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeTab === 'guardians' ? 'bg-primary text-white' : 'border border-primary text-primary hover:bg-primary/10'"
            @click="activeTab = 'guardians'">{{ guardianTabLabel }}</button>
        </div>
      </div>

      <!-- ── Tab: Datos del estudiante ── -->
      <section v-if="activeTab === 'student'" class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <!-- Panel lateral -->
        <div class="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div class="flex flex-col items-center gap-3 text-center">

            <!-- Avatar modo detalle -->
            <template v-if="isReadOnly">
              <div v-if="previewUrl" class="h-20 w-20 overflow-hidden rounded-full bg-primary/20">
                <img :src="previewUrl" :alt="`${student?.primerNombre ?? ''} ${student?.primerApellido ?? ''}`.trim()"
                  class="h-full w-full object-cover" />
              </div>
              <div v-else
                class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-xl font-semibold text-primary">
                {{ studentAvatarInitials }}
              </div>
            </template>

            <!-- Avatar modo edición -->
            <template v-else>
              <div class="group relative h-20 w-20 overflow-hidden rounded-full bg-primary/20 text-primary shadow-sm">
                <img v-if="previewUrl" :src="previewUrl" alt="Foto del estudiante" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-xl font-semibold">
                  {{ `${form.firstname?.[0] ?? ""}${form.lastname?.[0] ?? ""}`.toUpperCase() || "ES" }}
                </div>
                <button type="button"
                  class="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100"
                  @click="openFilePicker">
                  Cambiar foto
                </button>
              </div>
              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handlePhotoChange" />
            </template>

            <!-- Nombre e ID -->
            <div>
              <h3 class="text-base font-semibold text-primary">
                {{ isReadOnly
                  ? `${student?.primerNombre ?? ''} ${student?.segundoNombre ?? ''} ${student?.primerApellido ?? ''}
                ${student?.segundoApellido ?? ''}`.replace(/\s+/g, ' ').trim() || 'Sin nombre'
                  : `${form.firstname} ${form.secondname} ${form.lastname} ${form.secondlastname}`.replace(/\s+/g, '').trim() || 'Sinnombre'
                }}
              </h3>
              <p class="text-xs text-gray-500">ID #{{ student?.id ?? '—' }}</p>
            </div>
            <BaseBadge :variant="studentStatusVariant[currentStatus] ?? 'pending'">{{ statusLabel }}</BaseBadge>
          </div>

          <hr class="border-gray-200" />

          <!-- Resumen rápido -->
          <div class="space-y-2 text-sm text-gray-600">
            <p><span class="font-medium text-gray-700">Documento:</span> {{ student?.documentoIdentidad ||
              form.documentNumber ||
              '—' }}</p>
            <p><span class="font-medium text-gray-700">Tipo:</span> {{ tipoDocumentoLabel[(student?.tipoDocumento ??
              form.documentType ?? 'CC')] ?? '—' }}</p>
            <p><span class="font-medium text-gray-700">Nacimiento:</span> {{ (student?.fechaNacimiento ||
              form.birthdate) ? new
                Date(student?.fechaNacimiento ?? form.birthdate).toLocaleDateString('es-CO') : '—' }}</p>
            <p><span class="font-medium text-gray-700">Estrato:</span> {{ student?.estrato ?? (form.strata || '—') }}
            </p>
          </div>

          <!-- Selector de estado (solo edición) -->
          <template v-if="!isReadOnly">
            <BaseSelect v-model="form.status" label="Estado" :options="statusOptions" label-position="above" />
            <p v-if="showExalumnosWarning" class="text-sm text-accent">
              Este estudiante será movido al panel de Exalumnos al guardar.
            </p>
          </template>
        </div>

        <!-- Panel derecho: detalle -->
        <div v-if="isReadOnly" class="space-y-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-accent">Información del estudiante</p>
            <p class="mt-1 text-sm text-gray-500">Datos principales del estudiante.</p>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <div v-for="field in readOnlyFields" :key="field.label"
              class="rounded-xl border border-gray-100 bg-white px-4 py-3">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">{{ field.label }}</p>
              <p class="mt-1 text-sm text-gray-700">{{ formatDetailValue(field.value) }}</p>
            </div>
          </div>
        </div>

        <!-- Panel derecho: edición -->
        <div v-else class="space-y-6">
          <section class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-accent">Datos personales</p>
              <p class="mt-1 text-sm text-gray-500">Edita la información personal principal.</p>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <BaseSelect v-model="form.documentType" label="Tipo de documento" :options="documentTypeOptions"
                label-position="above" />
              <BaseInput v-model="form.documentNumber" label="Documento de identidad" label-position="above" />
              <BaseInput v-model="form.firstname" label="Primer nombre" label-position="above" />
              <BaseInput v-model="form.secondname" label="Segundo nombre" label-position="above" />
              <BaseInput v-model="form.lastname" label="Primer apellido" label-position="above" />
              <BaseInput v-model="form.secondlastname" label="Segundo apellido" label-position="above" />
              <BaseInput v-model="form.birthdate" label="Fecha de nacimiento" type="date" label-position="above" />
              <BaseInput v-model="form.homeAddress" label="Dirección de residencia" class="md:col-span-2"
                label-position="above" />
              <BaseInput v-model="form.strata" label="Estrato" label-position="above" />
            </div>
          </section>

          <section class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-wide text-accent">Servicios</p>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="space-y-2 rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
                <span class="block text-xs font-semibold uppercase tracking-wide text-gray-400">Almuerzo</span>
                <div class="flex items-center justify-between gap-3">
                  <span>Incluye almuerzo</span>
                  <button type="button" role="switch" :aria-checked="form.hasLunch" aria-label="Incluye almuerzo"
                    class="relative h-7 w-12 rounded-full transition"
                    :class="form.hasLunch ? 'bg-primary' : 'bg-gray-300'" @click="form.hasLunch = !form.hasLunch">
                    <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                      :class="form.hasLunch ? 'left-6' : 'left-1'" />
                  </button>
                </div>
              </label>

              <label class="space-y-2 rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
                <span class="block text-xs font-semibold uppercase tracking-wide text-gray-400">Transporte</span>
                <div class="flex items-center justify-between gap-3">
                  <span>Incluye transporte</span>
                  <button type="button" role="switch" :aria-checked="form.hasTransport" aria-label="Incluye transporte"
                    class="relative h-7 w-12 rounded-full transition"
                    :class="form.hasTransport ? 'bg-primary' : 'bg-gray-300'"
                    @click="form.hasTransport = !form.hasTransport">
                    <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                      :class="form.hasTransport ? 'left-6' : 'left-1'" />
                  </button>
                </div>
              </label>
            </div>
          </section>
        </div>
      </section>

      <!-- ── Tab: Acudientes ── -->
      <section v-else-if="!isReadOnly && student" class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-gray-500">Gestiona los acudientes asociados a este estudiante.</p>
          <BaseButton variant="accent" :icon="PlusIcon" :disabled="managedStudentId <= 0" @click="openCreateGuardian">
            Añadir acudiente
          </BaseButton>
        </div>

        <div v-if="estudiantesStore.loadingGuardians" class="grid gap-4 md:grid-cols-2">
          <div class="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
          <div class="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
        </div>

        <div v-else class="space-y-4">
          <p v-if="!guardianList.length"
            class="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
            Aún no hay acudientes asociados.
          </p>
          <GuardianCard v-for="guardian in guardianList" :key="guardian.id" :guardian="guardian"
            @edit="openEditGuardian" @delete="deleteGuardian" />
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">Cerrar</BaseButton>
        <BaseButton v-if="!readonly && activeTab === 'student'" variant="primary" @click="saveStudent">
          Guardar
        </BaseButton>
      </div>
    </template>
  </BaseModal>

  <GuardianFormModal :open="guardianModalOpen" :student-id="managedStudentId" :guardian="editingGuardian"
    :readonly="isReadOnly" @close="guardianModalOpen = false" @saved="ensureGuardiansLoaded" />
</template>