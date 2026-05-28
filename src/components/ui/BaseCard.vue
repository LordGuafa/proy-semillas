<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
    <section class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <header v-if="title || subtitle" class="mb-4 space-y-1">
            <h2 v-if="title">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-accent">{{ subtitle }}</p>
        </header>
        <slot />
    </section>
</template>