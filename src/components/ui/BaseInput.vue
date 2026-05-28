<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ modelValue: string | number | null; label: string; type?: string; error?: string; required?: boolean; placeholder?: string; ariaLabel?: string }>(), { type: 'text', error: '', required: false, placeholder: ' ' })
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const inputValue = computed({ get: () => props.modelValue ?? '', set: (value: string | number | null) => emit('update:modelValue', String(value ?? '')) })
const inputId = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'))
</script>

<template>
    <div class="space-y-1.5">
        <div class="relative">
            <input :id="inputId" v-model="inputValue" :type="type" :placeholder="placeholder"
                :aria-label="ariaLabel || label" :required="required" class="peer panel-input pt-5"
                :class="error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''" />
            <label :for="inputId"
                class="pointer-events-none absolute left-4 top-3 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary">{{
                label }}<span v-if="required" class="text-red-500">*</span></label>
        </div>
        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    </div>
</template>