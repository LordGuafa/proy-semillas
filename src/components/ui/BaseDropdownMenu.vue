<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/24/outline";

type DropdownItem = {
  label: string;
  action: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
};

const props = withDefaults(
  defineProps<{
    items: DropdownItem[];
    placement?: "up" | "down";
  }>(),
  {
    placement: "up",
  },
);

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function toggleMenu() {
  open.value = !open.value;
}

function closeMenu() {
  open.value = false;
}

function handleAction(item: DropdownItem) {
  if (item.disabled) return;
  item.action();
  closeMenu();
}

function handleOutsideClick(event: MouseEvent) {
  if (!open.value) return;
  const target = event.target as Node | null;
  if (target && rootRef.value?.contains(target)) return;
  closeMenu();
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});
</script>

<template>
  <div ref="rootRef" class="relative inline-flex">
    <button
      type="button"
      class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
      @click.stop="toggleMenu"
    >
      <slot name="trigger">
        <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
      </slot>
    </button>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 z-50 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
        :class="placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'"
        @click.stop
      >
        <button
          v-for="item in items"
          :key="item.label"
          type="button"
          class="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            item.variant === 'danger'
              ? 'text-red-500 hover:bg-red-50'
              : 'text-gray-700'
          "
          :disabled="item.disabled"
          @click="handleAction(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
