<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import logoSemillas from '@/assets/logo_semillas.svg'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = reactive({ nombreUsuario: '', password: '' })
const errorMessage = ref('')
const redirectPath = computed(() => String(route.query.redirect || '/admin/estudiantes'))

onMounted(() => {
    authStore.fetchCurrentUser()
    if (authStore.isAuthenticated) {
        router.replace('/admin/estudiantes')
    }
})

async function handleSubmit() {
    errorMessage.value = ''
    try {
        await authStore.login(form)
        await router.replace(redirectPath.value)
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'No fue posible iniciar sesión.'
    }
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-base px-4 py-10">
        <form class="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg" @submit.prevent="handleSubmit">
            <div class="mb-8 text-center">
                <img :src="logoSemillas" alt="Semillas" class="mx-auto h-20 w-auto" />
                <p class="mt-2 text-sm text-accent">Panel Administrativo</p>
            </div>

            <div class="space-y-4">
                <BaseInput v-model="form.nombreUsuario" label="Usuario" type="text" required />
                <BaseInput v-model="form.password" label="Contraseña" type="password" required />
            </div>

            <p v-if="errorMessage" class="mt-4 text-sm text-red-500">{{ errorMessage }}</p>

            <BaseButton type="submit" variant="primary" size="lg" block class="mt-6">Iniciar sesión</BaseButton>
        </form>
    </div>
</template>
