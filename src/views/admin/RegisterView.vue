<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import logoSemillas from '@/assets/logo_semillas.svg'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ name: '', email: '', password: '', confirmation: '' })
const errorMessage = ref('')
const submitting = ref(false)

async function handleSubmit() {
    errorMessage.value = ''
    if (form.password !== form.confirmation) {
        errorMessage.value = 'Las contraseñas no coinciden.'
        return
    }

    submitting.value = true
    try {
        await authStore.register({ name: form.name, email: form.email, password: form.password })
        await router.replace({ path: '/login', query: { registered: 'true' } })
    } catch (error: any) {
        errorMessage.value = error?.response?.data?.detail
            ?? error?.message
            ?? 'No fue posible crear la cuenta.'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-base px-4 py-10">
        <form class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg md:p-10" @submit.prevent="handleSubmit">
            <div class="mb-8 text-center">
                <img :src="logoSemillas" alt="Semillas" class="mx-auto h-20 w-auto" />
                <h1 class="mt-3 text-2xl font-semibold text-primary">Crear cuenta</h1>
                <p class="mt-2 text-sm text-gray-600">Registra tus datos para acceder al portal.</p>
            </div>

            <div class="space-y-4">
                <BaseInput v-model="form.name" label="Nombre completo" type="text" required />
                <BaseInput v-model="form.email" label="Correo electrónico" type="email" required />
                <BaseInput v-model="form.password" label="Contraseña" type="password" required />
                <BaseInput v-model="form.confirmation" label="Confirmar contraseña" type="password" required />
            </div>

            <p class="mt-2 text-xs text-gray-500">Usa una contraseña de al menos 12 caracteres.</p>
            <p v-if="errorMessage" class="mt-4 text-sm text-red-500" role="alert">{{ errorMessage }}</p>

            <BaseButton type="submit" variant="primary" size="lg" block class="mt-6" :disabled="submitting">
                {{ submitting ? 'Creando cuenta…' : 'Crear cuenta' }}
            </BaseButton>

            <p class="mt-5 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <RouterLink to="/login" class="font-semibold text-primary hover:underline">Iniciar sesión</RouterLink>
            </p>
        </form>
    </div>
</template>
