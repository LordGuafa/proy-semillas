<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { PlusIcon } from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import type Guardian from "@/types/guardian";
import type Student from "@/types/student";
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
  firstname: "",
  lastname: "",
  homeAddress: "",
  city: "",
  department: "",
  strata: "",
  hasLunch: false,
  hasTransport: false,
  status: "ASPIRANTE" as Student["status"],
  photoURL: "",
});

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

const guardianCount = computed(() => guardianList.value.length);
const isReadOnly = computed(() => Boolean(props.readonly));
const guardianTabLabel = computed(() => `Acudientes (${guardianCount.value})`);
const modalTitle = computed(() => {
  if (!props.student) return "Nuevo estudiante";
  return props.readonly ? "Detalle del estudiante" : "Editar estudiante";
});
const statusLabel = computed(() => studentStatusLabel[form.status]);

function resetObjectUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = "";
  }
}

function syncStudentForm() {
  const student = props.student;
  form.firstname = student?.firstname ?? "";
  form.lastname = student?.lastname ?? "";
  form.homeAddress = student?.homeAddress ?? "";
  form.city = student?.city ?? "";
  form.department = student?.department ?? "";
  form.strata = student?.strata ?? "";
  form.hasLunch = student?.hasLunch ?? false;
  form.hasTransport = student?.hasTransport ?? false;
  form.status = student?.status ?? "ASPIRANTE";
  form.photoURL = student?.photoURL ?? "";
  previewUrl.value = student?.photoURL ?? "";
  resetObjectUrl();
  activeTab.value = "student";
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) syncStudentForm();
  },
  { immediate: true },
);

watch(
  () => props.student,
  () => {
    if (props.open) syncStudentForm();
  },
);

onBeforeUnmount(() => {
  resetObjectUrl();
});

async function ensureGuardiansLoaded() {
  if (!props.student) return;
  if (!estudiantesStore.guardians[props.student.id]) {
    await estudiantesStore.fetchGuardians(props.student.id);
  }
}

watch(activeTab, async (tab) => {
  if (tab === "guardians") {
    await ensureGuardiansLoaded();
  }
});

function openFilePicker() {
  fileInputRef.value?.click();
}

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
    firstname: form.firstname.trim(),
    lastname: form.lastname.trim(),
    homeAddress: form.homeAddress.trim(),
    city: form.city.trim() || undefined,
    department: form.department.trim() || undefined,
    strata: form.strata.trim() || undefined,
    hasLunch: form.hasLunch,
    hasTransport: form.hasTransport,
    status: form.status,
    photoURL: previewUrl.value,
  };

  if (props.student) {
    await estudiantesStore.updateEstudiante(props.student.id, payload);
  } else {
    await estudiantesStore.createEstudiante(payload);
  }
  emit("saved");
}

function openCreateGuardian() {
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
      <div
        class="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-4"
      >
        <div role="tablist" aria-label="Secciones del modal">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'student'"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="
              activeTab === 'student'
                ? 'bg-primary text-white'
                : 'border border-primary text-primary hover:bg-primary/10'
            "
            @click="activeTab = 'student'"
          >
            Datos del estudiante
          </button>
          <button
            v-if="student"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'guardians'"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="
              activeTab === 'guardians'
                ? 'bg-primary text-white'
                : 'border border-primary text-primary hover:bg-primary/10'
            "
            @click="activeTab = 'guardians'"
          >
            {{ guardianTabLabel }}
          </button>
        </div>
      </div>

      <section
        v-if="activeTab === 'student'"
        class="grid gap-6 lg:grid-cols-[1fr_2fr]"
      >
        <div
          class="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
        >
          <div
            class="group relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-primary/20 text-primary shadow-sm"
          >
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Foto del estudiante"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center text-xl font-semibold"
            >
              {{
                `${form.firstname?.[0] ?? ""}${form.lastname?.[0] ?? ""}`.toUpperCase() ||
                "ES"
              }}
            </div>
            <button
              v-if="!isReadOnly"
              type="button"
              class="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100"
              @click="openFilePicker"
            >
              Cambiar foto
            </button>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handlePhotoChange"
          />
          <div class="flex justify-center">
            <BaseBadge :variant="studentStatusVariant[form.status]">{{
              statusLabel
            }}</BaseBadge>
          </div>
          <BaseSelect
            v-model="form.status"
            label="Estado"
            :options="statusOptions"
            :disabled="isReadOnly"
          />
          <p
            v-if="form.status === 'RETIRADO' || form.status === 'EGRESADO'"
            class="text-sm text-accent"
          >
            Este estudiante será movido al panel de Exalumnos al guardar.
          </p>
        </div>

        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <BaseInput
              v-model="form.firstname"
              label="Nombre"
              :readonly="isReadOnly"
            />
            <BaseInput
              v-model="form.lastname"
              label="Apellido"
              :readonly="isReadOnly"
            />
            <BaseInput
              v-model="form.homeAddress"
              label="Dirección"
              class="md:col-span-2"
              :readonly="isReadOnly"
            />
            <BaseInput
              v-model="form.city"
              label="Ciudad"
              placeholder="Ciudad de residencia"
              :readonly="isReadOnly"
            />
            <BaseInput
              v-model="form.department"
              label="Departamento"
              placeholder="Departamento de residencia"
              :readonly="isReadOnly"
            />
            <BaseInput
              v-model="form.strata"
              label="Estrato"
              placeholder="Estrato socioeconómico"
              :readonly="isReadOnly"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-2 text-sm font-medium text-gray-700">
              <span>Incluye almuerzo</span>
              <button
                type="button"
                role="switch"
                :aria-checked="form.hasLunch"
                aria-label="Incluye almuerzo"
                class="relative h-7 w-12 rounded-full transition"
                :class="form.hasLunch ? 'bg-primary' : 'bg-gray-300'"
                :disabled="isReadOnly"
                @click="form.hasLunch = !form.hasLunch"
              >
                <span
                  class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                  :class="form.hasLunch ? 'left-6' : 'left-1'"
                />
              </button>
            </label>
            <label class="space-y-2 text-sm font-medium text-gray-700">
              <span>Incluye transporte</span>
              <button
                type="button"
                role="switch"
                :aria-checked="form.hasTransport"
                aria-label="Incluye transporte"
                class="relative h-7 w-12 rounded-full transition"
                :class="form.hasTransport ? 'bg-primary' : 'bg-gray-300'"
                :disabled="isReadOnly"
                @click="form.hasTransport = !form.hasTransport"
              >
                <span
                  class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                  :class="form.hasTransport ? 'left-6' : 'left-1'"
                />
              </button>
            </label>
          </div>
        </div>
      </section>

      <section v-else-if="student" class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-gray-500">
            Gestiona los acudientes asociados a este estudiante.
          </p>
          <BaseButton
            v-if="!isReadOnly"
            variant="accent"
            :icon="PlusIcon"
            @click="openCreateGuardian"
            >Añadir acudiente</BaseButton
          >
        </div>

        <div
          v-if="estudiantesStore.loadingGuardians"
          class="grid gap-4 md:grid-cols-2"
        >
          <div
            class="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
          />
          <div
            class="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
          />
        </div>

        <div v-else class="space-y-4">
          <p
            v-if="!guardianList.length"
            class="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500"
          >
            Aún no hay acudientes asociados.
          </p>
          <GuardianCard
            v-for="guardian in guardianList"
            :key="guardian.id"
            :guardian="guardian"
            @edit="openEditGuardian"
            @delete="deleteGuardian"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">Cerrar</BaseButton>
        <BaseButton
          v-if="!readonly && activeTab === 'student'"
          variant="primary"
          @click="saveStudent"
          >Guardar</BaseButton
        >
      </div>
    </template>
  </BaseModal>

  <GuardianFormModal
    :open="guardianModalOpen"
    :student-id="student?.id ?? 0"
    :guardian="editingGuardian"
    :readonly="isReadOnly"
    @close="guardianModalOpen = false"
    @saved="ensureGuardiansLoaded"
  />
</template>
