<script setup lang="ts">
import { computed } from "vue";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  label: string;
  value: unknown;
  type: string;
}>();

function formatDate(value: unknown): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("es-CO");
}

const displayValue = computed(() => {
  if (props.type === "boolean") return props.value === true;
  if (props.type === "date") return formatDate(props.value);
  if (props.value === null || props.value === undefined || props.value === "")
    return "—";
  return String(props.value);
});
</script>

<template>
  <div class="space-y-1">
    <p class="text-xs uppercase tracking-wide text-gray-500">{{ label }}</p>
    <div
      v-if="type === 'boolean'"
      class="flex items-center gap-2 text-sm font-medium text-gray-900"
    >
      <CheckCircleIcon
        v-if="displayValue"
        class="h-5 w-5 text-primary"
        aria-hidden="true"
      />
      <XCircleIcon v-else class="h-5 w-5 text-gray-300" aria-hidden="true" />
      <span>{{ displayValue ? "Sí" : "No" }}</span>
    </div>
    <p v-else class="text-sm font-medium text-gray-900">
      {{ displayValue }}
    </p>
  </div>
</template>
