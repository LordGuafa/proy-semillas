<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ modelValue: string | number | null; label: string; type?: string; error?: string; required?: boolean; placeholder?: string; ariaLabel?: string; labelPosition?: 'inside' | 'above' }>(), { type: 'text', error: '', required: false, placeholder: ' ', labelPosition: 'above' })
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const inputValue = computed({ get: () => props.modelValue ?? '', set: (value: string | number | null) => emit('update:modelValue', String(value ?? '')) })
const inputId = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'))
</script>

<template>
    <div class="space-y-1.5">
        <div v-if="labelPosition === 'above'">
            <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-1 font-comfortaa">{{ label }}<span v-if="required" class="text-red-500">*</span></label>
            <input :id="inputId" v-model="inputValue" :type="type" :placeholder="placeholder"
                :aria-label="ariaLabel || label" :required="required" class="panel-input font-comfortaa"
                :class="error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''" />
        </div>
        <div v-else class="relative">
            <input :id="inputId" v-model="inputValue" :type="type" :placeholder="placeholder"
                :aria-label="ariaLabel || label" :required="required" class="peer panel-input pt-5 font-comfortaa"
                :class="error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''" />
            <label :for="inputId"
                class="pointer-events-none absolute left-4 top-3 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary font-comfortaa">{{
                label }}<span v-if="required" class="text-red-500">*</span></label>
        </div>
        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    </div>
</template>