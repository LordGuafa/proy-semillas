<script setup lang="ts">
import { computed } from 'vue'
import type { EstadoAprobacion, EstadoEstudiante } from '@/types/enums'

const props = defineProps<{
    status?: EstadoEstudiante | EstadoAprobacion | 'warning' | 'info' | string
    variant?: EstadoEstudiante | EstadoAprobacion | 'warning' | 'info' | string
}>()
const badgeClasses = computed(() => {
    const variant = props.variant || props.status || 'inactive'
    switch (variant) {
        case 'pending': return 'bg-yellow-100 text-yellow-700'
        case 'warning': return 'bg-yellow-100 text-yellow-700'
        case 'info': return 'bg-blue-100 text-blue-700'
        case 'active': return 'bg-green-100 text-primary'
        case 'inactive': return 'bg-gray-100 text-gray-600'
        case 'graduated': return 'bg-blue-100 text-blue-700'
        default: return 'bg-gray-100 text-gray-600'
    }
})
</script>

<template>
    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
        :class="badgeClasses">
        <slot>{{ variant || status }}</slot>
    </span>
</template>