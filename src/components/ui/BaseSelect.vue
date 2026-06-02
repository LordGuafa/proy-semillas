<script setup lang="ts">
import { computed } from "vue";

type Option = string | { label: string; value: string | number };

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label: string;
    options: Option[];
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    variant?: "default" | "chip";
    labelPosition?: "inside" | "above";
  }>(),
  {
    placeholder: "Selecciona una opción",
    error: "",
    required: false,
    disabled: false,
    readonly: false,
    variant: "default",
    labelPosition: "inside",
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const selectValue = computed({
  get: () => props.modelValue ?? "",
  set: (value: string | number | null) =>
    emit("update:modelValue", String(value ?? "")),
});

const selectId = computed(() => props.label.toLowerCase().replace(/\s+/g, "-"));

const optionEntries = computed(() =>
  props.options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  ),
);
</script>

<template>
  <div class="space-y-1.5">
    <div v-if="labelPosition === 'above'" class="space-y-1.5">
      <label :for="selectId" class="block text-sm font-medium text-gray-700 mb-1 font-comfortaa">
        {{ label }}<span v-if="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <select
          :id="selectId"
          v-model="selectValue"
          :aria-label="label"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          class="panel-input appearance-none pr-10"
          :class="variant === 'chip' ? 'rounded-full border-gray-200 bg-gray-100 text-sm font-medium text-gray-700 shadow-none' : ''"
        >
          <option v-if="placeholder && !required" value="">
            {{ placeholder }}
          </option>
          <option
            v-for="option in optionEntries"
            :key="String(option.value)"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ▾
        </span>
      </div>
    </div>
    <div v-else class="relative">
      <select
        :id="selectId"
        v-model="selectValue"
        :aria-label="label"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        class="peer panel-input appearance-none pr-10 pt-5"
        :class="
          variant === 'chip'
            ? 'rounded-full border-gray-200 bg-gray-100 text-sm font-medium text-gray-700 shadow-none'
            : ''
        "
      >
        <option v-if="placeholder && !required" value="">
          {{ placeholder }}
        </option>
        <option
          v-for="option in optionEntries"
          :key="String(option.value)"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <label
        :for="selectId"
        class="pointer-events-none absolute left-4 top-3 text-xs font-medium text-gray-500 transition-all duration-200 peer-focus:opacity-0 peer-focus:translate-y-[-4px] peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:translate-y-[-4px]"
      >
        {{ label }}<span v-if="required" class="text-red-500">*</span>
      </label>
      <span
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
      >
        ▾
      </span>
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
