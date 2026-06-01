<template>
    <div class="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 md:px-8 lg:px-12">
        <section class="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm md:p-8">
            <div class="flex flex-col items-center gap-3">
                <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
                <h1 class="title-sub text-3xl md:text-5xl">¿Deseas visitarnos para informarte más sobre nuestra escuela taller?</h1>
                <h2 class="font-comfortaa text-xl font-medium text-primary md:text-2xl">¡Agenda una reunión informativa con nosotros!</h2>
            </div>

            <p class="mx-auto max-w-4xl text-justify font-comfortaa text-gray-800">
                En esta reunión, se abordarán varios aspectos de la Escuela: talleres, la granja, salidas, costos, alimentación,
                entre otras. Es preciso que cuenten con disponibilidad de 1 hora aproximadamente.
                <br><br>
                Después de la visita, podrás contarnos si deseas continuar con el proceso de matrícula. Será un gusto que seas parte de Escuela Taller Semillas.
                <br><br>
                Nota: Es importante que las niñas y niños también asistan para conocer el espacio. Deben venir con un/a acompañante
                que pueda asistirles. Sabemos que por el carácter informativo de la reunión, las niñas y niños pueden querer apartarse
                de ella, ya sea porque les llamó la atención un espacio, quisieron ir al baño o se quedaron interactuando con otras
                niñas y niños.
                <br><br>
                Dirección: Calle 22C #28-10.
            </p>
        </section>

        <section class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div v-if="admissionsStore.error" class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ admissionsStore.error }}
            </div>

            <form action="" @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput v-model="motherName" label="Nombre de la madre" required labelPosition="above" />

                <BaseInput v-model="fatherName" label="Nombre del padre" required labelPosition="above" />

                <BaseInput v-model="email" label="Correo electrónico" type="email" required labelPosition="above" />

                <BaseInput v-model="phoneNumber" label="Número de celular" type="tel" required labelPosition="above" />

                <BaseInput v-model="childName" label="Nombre del niño o la niña" required labelPosition="above" />

                <BaseInput v-model="childAge" label="Edad" type="number" required labelPosition="above" />

                <BaseInput v-model="heardAboutUs" label="¿Cómo te enteraste de nosotros?" required labelPosition="above" />

                <section v-if="dynamicFields.length" class="md:col-span-2 space-y-4 rounded-2xl border border-gray-100 p-4">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <template v-for="campo in dynamicFields" :key="campo.id">
                            <BaseInput
                                v-if="campo.type === 'text' || campo.type === 'number' || campo.type === 'date'"
                                :model-value="dynamicFieldValues[campo.id] ?? ''"
                                @update:modelValue="setDynamicFieldValue(campo.id, $event)"
                                :label="campo.label || campo.id"
                                :type="campo.type"
                                :required="campo.required"
                                :placeholder="campo.placeholder || ''"
                                labelPosition="above"
                            />

                            <BaseSelect
                                v-else-if="campo.type === 'select'"
                                :model-value="dynamicFieldValues[campo.id] ?? ''"
                                @update:modelValue="setDynamicFieldValue(campo.id, $event)"
                                :label="campo.label || campo.id"
                                :options="campoOptions(campo)"
                                :required="campo.required"
                                :placeholder="campo.placeholder || 'Selecciona una opción'"
                            />

                            <BaseSelect
                                v-else-if="campo.type === 'boolean'"
                                :model-value="dynamicFieldValues[campo.id] ?? ''"
                                @update:modelValue="setDynamicFieldValue(campo.id, $event)"
                                :label="campo.label || campo.id"
                                :options="[
                                    { label: 'Sí', value: 'true' },
                                    { label: 'No', value: 'false' },
                                ]"
                                :required="campo.required"
                                placeholder="Selecciona una opción"
                            />

                            <div v-else class="space-y-2 md:col-span-2">
                                <label :for="campo.id" class="block text-sm font-medium text-gray-700">
                                    {{ campo.label || campo.id }}<span v-if="campo.required" class="text-red-500">*</span>
                                </label>
                                <p class="text-xs text-gray-500">Campo: {{ campo.id }}</p>
                                <textarea
                                    :id="campo.id"
                                    :value="dynamicFieldValues[campo.id] ?? ''"
                                    @input="setDynamicFieldValue(campo.id, ($event.target as HTMLTextAreaElement).value)"
                                    :required="campo.required"
                                    :placeholder="campo.placeholder || ''"
                                    class="panel-input min-h-[120px] rounded-xl"
                                />
                            </div>
                        </template>
                    </div>
                </section>

                <div class="space-y-2 md:col-span-2">
                    <label for="interviewTimeSlot" class="block text-sm font-medium text-gray-700">
                        Selecciona la fecha de la entrevista
                    </label>
                    <select
                        id="interviewTimeSlot"
                        v-model="selectedTimeSlotId"
                        class="panel-input rounded-xl w-full"
                        :disabled="admissionsStore.loading"
                        required
                    >
                        <option value="" disabled>
                            {{ admissionsStore.loading ? 'Cargando franjas...' : 'Selecciona una opción' }}
                        </option>
                        <option
                            v-for="slot in admissionsStore.availableTimeSlots"
                            :key="slot.id"
                            :value="String(slot.id)"
                        >
                            {{ formatSlotLabel(slot) }}
                        </option>
                    </select>
                    <p v-if="!admissionsStore.availableTimeSlots.length" class="text-xs text-amber-700">
                        No hay franjas cargadas todavía.
                    </p>
                </div>

                <div class="pt-2 md:col-span-2">
                    <BaseButton type="submit" :disabled="admissionsStore.loading || !selectedTimeSlotId">
                        {{ admissionsStore.loading ? 'Agendando...' : 'Agendar Visita' }}
                    </BaseButton>
                </div>

                <p v-if="successMessage" class="md:col-span-2 text-sm font-comfortaa text-green-700">
                    {{ successMessage }}
                </p>
                <p v-if="errorMessage" class="md:col-span-2 text-sm font-comfortaa text-red-700">
                    {{ errorMessage }}
                </p>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, type Ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import logoSemillas from '@/assets/logo_semillas.svg'
import { useAdmissionsStore } from '@/stores/admissionsStore'
import type { Campo } from '@/types/formulario'

const motherName: Ref<string> = ref('')
const fatherName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')
const childName: Ref<string> = ref('')
const childAge: Ref<string> = ref('')
const heardAboutUs: Ref<string> = ref('')
const selectedTimeSlotId = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const dynamicFieldValues = reactive<Record<string, string>>({})
const admissionsStore = useAdmissionsStore()
const hiddenFieldIds = new Set(['fotoAspirante', 'fechaPreferidaEntrevista'])
const slotFormatter = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
})

const dynamicFields = computed(() =>
    (admissionsStore.schema?.campos ?? [])
    .filter((campo) => campo.visible !== false && !hiddenFieldIds.has(campo.id))
        .sort((left, right) => left.order - right.order),
)

const availableTimeSlotOptions = computed(() =>
    admissionsStore.availableTimeSlots.map((slot) => ({
        label: formatSlotLabel(slot),
        value: String(slot.id),
    })),
)

function formatSlotLabel(slot: { franja: string }) {
    const date = new Date(slot.franja)
    if (Number.isNaN(date.getTime())) {
        return slot.franja
    }

    const weekday = new Intl.DateTimeFormat('es-CO', { weekday: 'short' })
      .format(date)
      .replace('.', '')
      .toLowerCase()
    const day = new Intl.DateTimeFormat('es-CO', { day: '2-digit' }).format(date)
    const month = new Intl.DateTimeFormat('es-CO', { month: 'short' })
      .format(date)
      .replace('.', '')
      .toLowerCase()
    const year = new Intl.DateTimeFormat('es-CO', { year: 'numeric' }).format(date)
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const normalizedHours = String(hours % 12 || 12).padStart(2, '0')
    const period = hours < 12 ? 'a. m.' : 'p. m.'

    return `${weekday}, ${day} ${month} ${year}, ${normalizedHours}:${minutes} ${period}`
}

function ensureDynamicFieldValues(fields: Campo[]) {
    fields.forEach((campo) => {
        if (!(campo.id in dynamicFieldValues)) {
            dynamicFieldValues[campo.id] = ''
        }
    })
}

function campoOptions(campo: Campo) {
    return (campo.options ?? []).map((option) => ({ label: option, value: option }))
}

function setDynamicFieldValue(fieldId: string, value: string) {
    dynamicFieldValues[fieldId] = value
}

function normalizeDynamicValue(campo: Campo, rawValue: string): unknown {
    if (!rawValue) return undefined
    if (campo.type === 'number') {
        const parsed = Number(rawValue)
        return Number.isFinite(parsed) ? parsed : undefined
    }
    if (campo.type === 'boolean') {
        return rawValue === 'true'
    }
    return rawValue
}

function resetForm() {
    motherName.value = ''
    fatherName.value = ''
    email.value = ''
    phoneNumber.value = ''
    childName.value = ''
    childAge.value = ''
    heardAboutUs.value = ''
    selectedTimeSlotId.value = ''
    Object.keys(dynamicFieldValues).forEach((key) => {
        dynamicFieldValues[key] = ''
    })
}

watch(
    dynamicFields,
    (fields) => {
        ensureDynamicFieldValues(fields)
    },
    { immediate: true },
)

onMounted(async () => {
    try {
        await admissionsStore.fetchInterviewContext()
    } catch (error) {
        console.error('Error al cargar el esquema de entrevista:', error)
    }
})

const onSubmit = async () => {
    successMessage.value = ''
    errorMessage.value = ''

    if (!admissionsStore.schema) {
        errorMessage.value = 'No se pudo cargar el esquema de entrevista. Intenta nuevamente.'
        return
    }

    if (!selectedTimeSlotId.value) {
        errorMessage.value = 'Debes seleccionar una franja disponible.'
        return
    }

    const informacionAspirante = dynamicFields.value.reduce<Record<string, unknown>>(
        (accumulator, campo) => {
            const normalizedValue = normalizeDynamicValue(campo, dynamicFieldValues[campo.id] ?? '')
            if (normalizedValue !== undefined) {
                accumulator[campo.id] = normalizedValue
            }
            return accumulator
        },
        {},
    )

    try {
        await admissionsStore.submitInterview({
            nom_madre: motherName.value || undefined,
            nom_padre: fatherName.value || undefined,
            correo: email.value,
            celular: phoneNumber.value || undefined,
            nom_estudiante: childName.value || undefined,
            edad_estudiante: childAge.value ? Number(childAge.value) : undefined,
            como_conocimiento: heardAboutUs.value || undefined,
            id_franja_entrevista: Number(selectedTimeSlotId.value),
            schema_version: admissionsStore.schema.version,
            informacion_aspirante: informacionAspirante,
        })

        successMessage.value = 'Tu visita fue agendada correctamente.'
        resetForm()
    } catch (error) {
        errorMessage.value = 'No fue posible agendar la visita. Intenta nuevamente.'
        console.error('Error al agendar visita:', error)
    }
}
</script>

<style lang="">
</style>