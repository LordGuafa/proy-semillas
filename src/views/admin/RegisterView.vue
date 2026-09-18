<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const form = reactive({ name: '', email: '', password: '', confirmation: '' })
const errorMessage = ref('')
const successMessage = ref('')
const submitting = ref(false)

async function handleSubmit() {
    errorMessage.value = ''
    successMessage.value = ''
    if (form.password !== form.confirmation) {
        errorMessage.value = 'Las contraseñas no coinciden.'
        return
    }

    submitting.value = true
    try {
        await authStore.register({ name: form.name, email: form.email, password: form.password })
        form.name = ''
        form.email = ''
        form.password = ''
        form.confirmation = ''
        successMessage.value = 'La cuenta fue creada correctamente.'
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
    <div class="mx-auto w-full max-w-2xl">
        <form class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8" @submit.prevent="handleSubmit">
            <div class="mb-8">
                <h2 class="text-2xl font-semibold text-primary">Crear cuenta</h2>
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
            <p v-if="successMessage" class="mt-4 text-sm text-green-700" role="status">{{ successMessage }}</p>

            <BaseButton type="submit" variant="primary" size="lg" block class="mt-6" :disabled="submitting">
                {{ submitting ? 'Creando cuenta…' : 'Crear cuenta' }}
            </BaseButton>

        </form>
    </div>
</template>
