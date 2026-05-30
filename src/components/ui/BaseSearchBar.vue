<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue?: string; placeholder?: string }>(), { modelValue: '', placeholder: 'Buscar...' })
const emit = defineEmits<{ (event: 'search', value: string): void; (event: 'update:modelValue', value: string): void }>()
const value = ref(props.modelValue)
let timeoutId: number | undefined

watch(() => props.modelValue, (nextValue) => { value.value = nextValue ?? '' })
watch(value, (nextValue) => { emit('update:modelValue', nextValue); window.clearTimeout(timeoutId); timeoutId = window.setTimeout(() => emit('search', nextValue), 300) })
function clearSearch() { value.value = ''; emit('search', '') }
onBeforeUnmount(() => window.clearTimeout(timeoutId))
</script>

<template>
  <div class="relative">
    <div class="pointer-events-none absolute inset-y-0 left-3 flex h-12 items-center">
      <MagnifyingGlassIcon class="block h-4 w-4 text-gray-400" />
    </div>

    <input
      v-model="value"
      type="search"
      :placeholder="placeholder"
      aria-label="Buscar"
      class="panel-input h-12 pl-10 pr-11"
    />

    <button
      v-if="value"
      type="button"
      class="absolute inset-y-0 right-3 flex h-12 items-center rounded-full px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
      aria-label="Limpiar búsqueda"
      @click="clearSearch"
    >
      X
    </button>
  </div>
</template>