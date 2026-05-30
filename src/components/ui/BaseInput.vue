<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label: string;
    type?: string;
    error?: string;
    required?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    readonly?: boolean;
    disabled?: boolean;
  }>(),
  {
    type: "text",
    error: "",
    required: false,
    placeholder: " ",
    readonly: false,
    disabled: false,
  },
);
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();
const inputValue = computed({
  get: () => props.modelValue ?? "",
  set: (value: string | number | null) =>
    emit("update:modelValue", String(value ?? "")),
});
const inputId = computed(() => props.label.toLowerCase().replace(/\s+/g, "-"));
</script>

<template>
  <div class="space-y-1.5">
    <div class="relative">
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :aria-label="ariaLabel || label"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        class="peer panel-input pt-5"
        :class="
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
        "
      />
      <label
        :for="inputId"
        class="pointer-events-none absolute left-4 top-3 text-xs font-medium text-gray-500 transition-all duration-200 peer-focus:opacity-0 peer-focus:translate-y-[-4px] peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:translate-y-[-4px]"
        >{{ label }}<span v-if="required" class="text-red-500">*</span></label
      >
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
