<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    status?: 'pending' | 'active' | 'inactive' | 'graduated' | string
    variant?: 'pending' | 'active' | 'inactive' | 'graduated' | string
}>()
const badgeClasses = computed(() => {
    const variant = props.variant || props.status || 'inactive'
    switch (variant) {
        case 'pending': return 'bg-yellow-100 text-yellow-700'
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