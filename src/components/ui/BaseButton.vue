<script setup lang="ts">
import { computed, type Component } from "vue";

type ButtonVariant = "primary" | "accent" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: Component;
    block?: boolean;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
  }>(),
  {
    variant: "primary",
    size: "md",
    loading: false,
    block: false,
    type: "button",
  },
);
const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};
const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary/90",
  accent: "bg-accent text-white hover:bg-accent/90",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "border border-primary text-primary hover:bg-primary/10",
};
const classes = computed(() => [
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 motion-safe:duration-150",
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.block ? "w-full" : "w-auto",
]);
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :aria-label="ariaLabel"
    :disabled="loading"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <component :is="icon" v-if="icon" class="h-4 w-4" aria-hidden="true" />
    <slot />
  </button>
</template>
