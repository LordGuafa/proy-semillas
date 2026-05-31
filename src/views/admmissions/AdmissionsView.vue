<template>
    <div class="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 py-6 space-y-8">
        <section class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4 text-center">
            <div class="flex flex-col items-center gap-3">
                <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
                <h1 class="title-sub text-3xl md:text-5xl">¿Deseas visitarnos para informarte más sobre nuestra escuela taller?</h1>
                <h2 class="font-comfortaa text-xl md:text-2xl font-medium text-primary">¡Agenda una reunión informativa con nosotros!</h2>
            </div>

            <p class="font-comfortaa text-justify text-gray-800 max-w-4xl mx-auto">
                En esta reunión, se abordarán varios aspectos de la Escuela: talleres, la granja, salidas, costos, alimentación,
                entre otras. Es preciso que cuenten con disponibilidad de 1 hora aproximadamente.
                <br><br>
                Depúes de la visita, podrás contarnos si deseas continuar con el proceso de matrícula. Será un gusto que seas parte de Escuela Taller Semillas.
                <br><br>
                Nota: Es importante que las niñas y niños también asistan para conocer el espacio. Deben venir con un/a acompañante
                que pueda asistirles. Sabemos que por el carácter informativo de la reunión, las niñas y niños pueden querer apartarse
                de ella, ya sea porque les llamó la atención un espacio, quisieron ir al baño o se quedaron interactuando con otras
                niñas y niños.
                <br><br>
                Dirección: Calle 22C #28-10.
            </p>
        </section>

        <section class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <form action="" @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput v-model="motherName" label="Nombre de la madre" required labelPosition="above" />

                <BaseInput v-model="fatherName" label="Nombre del padre" labelPosition="above" />

                <BaseInput v-model="email" label="Correo electrónico" type="email" labelPosition="above" />

                <BaseInput v-model="phoneNumber" label="Número de celular" type="tel" labelPosition="above" />

                <BaseInput v-model="childName" label="Nombre del niño o la niña" labelPosition="above" />

                <BaseInput v-model="childAge" label="Edad" labelPosition="above" />

                <BaseInput v-model="heardAboutUs" label="¿Cómo te enteraste de nosotros?" labelPosition="above" />

                <div class="space-y-2 md:col-span-2">
                    <label for="interviewDate" class="block text-sm font-medium text-gray-700">Selecciona la fecha y hora en la que asistirás</label>
                    <select id="interviewDate" name="interviewDate" v-model="interviewDate" class="panel-input rounded-xl w-full">
                        <option disabled value="">Selecciona una opción</option>
                        <option value="2026-05-25 08:00">25 Mayo - 8:00 AM</option>
                        <option value="2026-05-25 10:00">25 Mayo - 10:00 AM</option>
                    </select>
                </div>

                <div class="md:col-span-2 pt-2">
                    <BaseButton type="submit">Agendar Visita</BaseButton>
                </div>
            </form>
        </section>
    </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import logoSemillas from '@/assets/logo_semillas.svg'

const motherName: Ref<string> = ref('')
const fatherName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')
const childName: Ref<string> = ref('')
const childAge: Ref<string> = ref('')
const heardAboutUs: Ref<string> = ref('')
const interviewDate = ref("")

const onSubmit = () => {
    // Aquí puedes llamar a la API o manejar el envío del formulario
    console.log('Agendado', { motherName: motherName.value, fatherName: fatherName.value, email: email.value, phoneNumber: phoneNumber.value, childName: childName.value, interviewDate: interviewDate.value })
}

</script>
<style lang="">

</style>