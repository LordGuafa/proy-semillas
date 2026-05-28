<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => { router.replace('/login') })
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-base">
    <p class="text-sm text-gray-500">Redirigiendo...</p>
  </main>
</template>
<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Home</h1>
  </main>
</template>
