<template>
    <div>
        <h1>¿Deseas visitarnos para informarte más sobre nuestra escuela taller?</h1>
        <h2>¡Agenda una reunión informativa con nosotros!</h2><br>

        En esta reunión, se abordarán varios aspectos de la Escuela; talleres, la granja, salidas, costos, alimentación,
        entre otras. Es preciso que cuenten con disponibilidad de 1 hora aproximadamente.
        <br>Nota: Es importante que las niñas y niños, también asistan para conocer el espacio, para ello, deben venir
        con un/a acompañante que pueda asistirles. Sabemos que por el carácter informativo de la reunión, las niñas y
        niños pueden querer apartarse de ella, ya sea porque les llamó la atención un espacio, quisieron ir al baño, o
        se quedaron interactuando con otras niñas y niños.

        Dirección: Calle 22C #28-10.

    </div>
    <div>
        <form action="">
            <label for="motherName">Nombre de la madre</label>
            <input type="text" name="motherName" id="motherName" v-model="motherName">
            <br>

            <label for="fathername">Nombre del padre</label>
            <input type="text" name="fatherName" id="fatherName" v-model="fatherName">
            <br>

            <label for="email">Correo electrónico</label>
            <input type="email" name="email" id="email" v-model="email">
            <br>

            <label for="phoneNumber">Número de celular</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" v-model="phoneNumber">
            <br>

            <label for="childName">Nombre del niño o la niña</label>
            <input type="text" name="childName" id="childName" v-model="childName">
            <br>

            <label for="childAge">Edad</label>
            <input type="text" name="childAge" id="childAge" v-model="childAge">
            <br>

            <label for="heardAboutUs">¿Cómo te enteraste de nosotros?</label>
            <input type="text" name="heardAboutUs" id="heardAboutUs" v-model="heardAboutUs">
            <br>

            <label for="interviewDate">
                Selecciona la fecha y hora en la que asistirás
            </label>
            <select id="interviewDate" name="interviewDate" v-model="interviewDate">
                <option disabled value="">
                    Selecciona una opción
                </option>

                <option value="2026-05-25 08:00">
                    25 Mayo - 8:00 AM
                </option>

                <option value="2026-05-25 10:00">
                    25 Mayo - 10:00 AM
                </option>
            </select>

            <br>

            <button>Agendar Visita</button>

        </form>

    </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'

const motherName: Ref<string> = ref('')
const fatherName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')
const childName: Ref<string> = ref('')
const childAge: Ref<string> = ref('')
const heardAboutUs: Ref<string> = ref('')
const interviewDate = ref("")

</script>
<style lang="">

</style>