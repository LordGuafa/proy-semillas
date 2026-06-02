<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import type { Guardian } from "@/types/guardian";
import { useEstudiantesStore } from "@/stores/estudiantesStore";

const props = defineProps<{
  open: boolean;
  studentId: number;
  guardian?: Guardian | null;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "saved"): void;
}>();

const estudiantesStore = useEstudiantesStore();
const submitAttempted = reactive({ value: false });
const form = reactive({
  firstName: "",
  secondName: "",
  lastName: "",
  secondLastName: "",
  documentType: "",
  documentNumber: "",
  kinship: "",
  phone: "",
  email: "",
  birthdate: "",
  placeOfBirth: "",
  occupation: "",
  workplace: "",
  homeAddress: "",
  city: "",
  department: "",
  isMainGuardian: false,
  isPaymentResponsible: false,
});

const documentTypeOptions = ["CC", "CE", "Pasaporte", "TI", "NIT"];
const requiredFields = [
  "firstName",
  "lastName",
  "documentType",
  "documentNumber",
  "kinship",
] as const;

const errors = reactive<Record<string, string>>({});
const title = computed(() =>
  props.guardian ? "Editar acudiente" : "Nuevo acudiente",
);

const canSave = computed(() => {
  // quick non-mutating validation for UI enable/disable
  return requiredFields.every((field) => String(form[field] ?? "").trim());
});

function resetErrors() {
  Object.keys(errors).forEach((key) => {
    delete errors[key];
  });
}

function syncForm() {
  const guardian = props.guardian;
  form.firstName = guardian?.firstName ?? "";
  form.secondName = guardian?.segundoNombre ?? "";
  form.lastName = guardian?.lastName ?? "";
  form.secondLastName = guardian?.segundoApellido ?? "";
  form.documentType = guardian?.documentType ?? "";
  form.documentNumber = guardian?.documentNumber ?? "";
  form.kinship = guardian?.kinship ?? "";
  form.phone = guardian?.phone ?? "";
  form.email = guardian?.email ?? "";
  form.birthdate = guardian?.birthdate
    ? new Date(guardian.birthdate).toISOString().slice(0, 10)
    : "";
  form.placeOfBirth = guardian?.placeOfBirth ?? "";
  form.occupation = guardian?.occupation ?? "";
  form.workplace = guardian?.workplace ?? "";
  form.homeAddress = guardian?.homeAddress ?? "";
  form.city = guardian?.city ?? "";
  form.department = guardian?.department ?? "";
  form.isMainGuardian = guardian?.isMainGuardian ?? false;
  form.isPaymentResponsible = guardian?.isPaymentResponsible ?? false;
  submitAttempted.value = false;
  resetErrors();
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) syncForm();
  },
  { immediate: true },
);

watch(
  () => props.guardian,
  () => {
    if (props.open) syncForm();
  },
);

function setFieldError(field: string, message: string) {
  errors[field] = message;
}

function validate() {
  resetErrors();
  let valid = true;
  requiredFields.forEach((field) => {
    const value = String(form[field] ?? "").trim();
    if (!value) {
      setFieldError(field, "Este campo es obligatorio.");
      valid = false;
    }
  });
  return valid;
}

function updateMainGuardian(value: boolean) {
  form.isMainGuardian = value;
}

async function saveGuardian() {
  submitAttempted.value = true;
  if (!Number.isFinite(props.studentId) || props.studentId <= 0) {
    setFieldError(
      "studentId",
      "No hay un estudiante valido para asociar el acudiente.",
    );
    return;
  }
  if (!validate()) return;

  const payload = {
    firstName: form.firstName.trim(),
    secondName: form.secondName.trim() || undefined,       // ✅ era: segundoNombre
    lastName: form.lastName.trim(),
    secondLastName: form.secondLastName.trim() || undefined, // ✅ era: segundoApellido
    documentType: form.documentType,
    documentNumber: form.documentNumber.trim(),
    kinship: form.kinship.trim(),
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
    birthdate: form.birthdate || undefined,                 // ✅ era: new Date(`${form.birthdate}T00:00:00`)
    placeOfBirth: form.placeOfBirth.trim() || undefined,
    occupation: form.occupation.trim() || undefined,
    workplace: form.workplace.trim() || undefined,
    homeAddress: form.homeAddress.trim() || undefined,
    city: form.city.trim() || undefined,
    department: form.department.trim() || undefined,
    isMainGuardian: form.isMainGuardian,
    isPaymentResponsible: form.isPaymentResponsible,
  } as unknown as Guardian;

  if (import.meta.env.DEV) {
    console.log("[GuardianFormModal] payload →", payload);  // ✅ movido antes de los emits
  }

  if (props.guardian) {
    await estudiantesStore.updateGuardian(
      props.studentId,
      props.guardian.id,
      payload,
    );
  } else {
    await estudiantesStore.createGuardian(props.studentId, payload);
  }

  emit("saved");
  emit("close");
}

</script>

<template>
  <BaseModal
    :open="open"
    size="md"
    :title="title"
    z-index-class="z-[70]"
    @close="emit('close')"
  >
    <div class="space-y-5">
      <p v-if="errors.studentId" class="text-sm text-red-600">
        {{ errors.studentId }}
      </p>
      <div class="grid gap-4 md:grid-cols-2">
        <BaseInput
          v-model="form.firstName"
          label="Nombre"
          :error="submitAttempted.value ? errors.firstName : ''"
          :readonly="readonly"
          required
        />
        <BaseInput
          v-model="form.secondName"
          label="Segundo nombre"
          :error="submitAttempted.value ? errors.secondName : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.lastName"
          label="Apellido"
          :error="submitAttempted.value ? errors.lastName : ''"
          :readonly="readonly"
          required
        />
        <BaseInput
          v-model="form.secondLastName"
          label="Segundo apellido"
          :error="submitAttempted.value ? errors.secondLastName : ''"
          :readonly="readonly"
        />
        <BaseSelect
          v-model="form.documentType"
          label="Tipo documento"
          :options="documentTypeOptions"
          :error="submitAttempted.value ? errors.documentType : ''"
          :disabled="readonly"
          required
        />
        <BaseInput
          v-model="form.documentNumber"
          label="N.° documento"
          :error="submitAttempted.value ? errors.documentNumber : ''"
          :readonly="readonly"
          required
        />
        <BaseInput
          v-model="form.kinship"
          label="Parentesco"
          :error="submitAttempted.value ? errors.kinship : ''"
          :readonly="readonly"
          required
        />
        <BaseInput
          v-model="form.phone"
          label="Teléfono"
          :error="submitAttempted.value ? errors.phone : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.email"
          label="Correo"
          type="email"
          :error="submitAttempted.value ? errors.email : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.birthdate"
          label="Fecha nacimiento"
          type="date"
          :error="submitAttempted.value ? errors.birthdate : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.placeOfBirth"
          label="Lugar nacimiento"
          class="md:col-span-2"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.occupation"
          label="Ocupación"
          :error="submitAttempted.value ? errors.occupation : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.workplace"
          label="Lugar de trabajo"
          :error="submitAttempted.value ? errors.workplace : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.homeAddress"
          label="Dirección"
          class="md:col-span-2"
          :error="submitAttempted.value ? errors.homeAddress : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.city"
          label="Ciudad"
          :error="submitAttempted.value ? errors.city : ''"
          :readonly="readonly"
        />
        <BaseInput
          v-model="form.department"
          label="Departamento"
          :error="submitAttempted.value ? errors.department : ''"
          :readonly="readonly"
        />
      </div>

      <div
        class="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2"
      >
        <label
          class="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
        >
          <span>Es acudiente principal</span>
          <button
            type="button"
            class="relative h-6 w-11 rounded-full transition"
            :class="form.isMainGuardian ? 'bg-primary' : 'bg-gray-300'"
            :disabled="readonly"
            @click="updateMainGuardian(!form.isMainGuardian)"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
              :class="form.isMainGuardian ? 'left-5' : 'left-0.5'"
            />
          </button>
        </label>
        <label
          class="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
        >
          <span>Responsable de pago</span>
          <button
            type="button"
            class="relative h-6 w-11 rounded-full transition"
            :class="form.isPaymentResponsible ? 'bg-primary' : 'bg-gray-300'"
            :disabled="readonly"
            @click="form.isPaymentResponsible = !form.isPaymentResponsible"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
              :class="form.isPaymentResponsible ? 'left-5' : 'left-0.5'"
            />
          </button>
        </label>
      </div>

      <p class="text-xs text-gray-400">
        Solo puede haber un acudiente principal. Al activar este campo se
        desactivará el anterior.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">Cancelar</BaseButton>
        <BaseButton
          v-if="!readonly"
          variant="primary"
          :disabled="!canSave"
          @click="saveGuardian"
          >Guardar</BaseButton
        >
      </div>
    </template>
  </BaseModal>
</template>
