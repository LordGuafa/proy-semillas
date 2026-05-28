<template>
    <h1>Registro de Matrícula</h1>
    ¡Gracias por preferirnos! <br>
    A continuación encontrarás los datos necesarios para la formalización de la matricula. Por favor, diligenciar todos
    los datos y verificar su veracidad.
    <br>
    <label for="inDate">Fecha de ingreso</label>
    <input type="date" name="inDate" id="inDate" v-model="inDate">
    <label for="outDate">Fecha de retiro</label>
    <input type="date" name="outDate" id="outDate" v-model="outDate">


    <div>
        <h2>Datos del estudiante</h2>
        <label for="childName">Nombres</label>
        <input type="text" name="childName" id="childName" v-model="childName">
        <br>

        <label for="childLastName">Apellidos</label>
        <input type="text" name="childLastName" id="childLastName" v-model="childLastName">
        <br>

        <label for="birthDate">Fecha de nacimiento</label>
        <input type="date" name="birthDate" id="birthDate" v-model="birthDate">
        <br>

        <label for="address">Dirección</label>
        <input type="text" name="address" id="address" v-model="address">
        <br>

        <label for="neighborhood">Barrio</label>
        <input type="text" name="neighborhood" id="neighborhood" v-model="neighborhood">
        <br>

        <label for="stratum">Estrato</label>
        <input type="text" name="stratum" id="stratum" v-model="stratum">
        <br>



        <label for="childAge">Edad actual</label>
        <input type="text" name="childAge" id="childAge" v-model="childAge">
        <br>

        <label for="photo">Foto tamaño carnet</label>
        <input type="file" name="photo" id="photo" accept="image/*" @change="handlePhotoChange">
        <br>

        <h3>Servicios complementarios contratados:</h3>
        <br>

        <label>
            <input type="checkbox" v-model="transport">
            Trasnporte de ruta
        </label>
        <label>
            <input type="checkbox" v-model="lunch">
            Almuerzo
        </label>

        <h3>Información relevante</h3>
        
        <p>
            Escribe aquí información importante sobre el niño o niña que debamos tener en cuenta, por ejemplo:
            alergias, condiciones médicas, tratamientos, necesidades especiales o cualquier otra observación relevante.
        </p>
        <label for="observations">Observaciones:</label>
        <textarea name="observations" id="observations" v-model="observations" rows="4" style="width:100%;"></textarea>

    </div>
    <div>
        <h2>Datos de los padres</h2>
        <h3>Datos del padre</h3>
        <label for="fatherName">Nombre del padre</label>
        <input type="text" name="fatherName" id="fatherName" v-model="fatherName">
        <br>

        <label for="fatherBirthDate">Fecha de nacimiento</label>
        <input type="date" name="fatherBirthDate" id="fatherBirthDate" v-model="fatherBirthDate">
        <br>
        <label for="fatherBirthPlace">Lugar de nacimiento</label>
        <input type="text" name="fatherBirthPlace" id="fatherBirthPlace" v-model="fatherBirthPlace">
        <br>

        <label for="fatherId">Documento de identidad</label>
        <input type="text" name="fatherId" id="fatherId" v-model="fatherId">
        <br>

        <label for="fatherCompany">Nombre de la empresa de trabajo</label>
        <input type="text" name="fatherCompany" id="fatherCompany" v-model="fatherCompany">
        <br>

        <label for="fatherOccupation">Ocupación</label>
        <input type="text" name="fatherOccupation" id="fatherOccupation" v-model="fatherOccupation">
        <br>

        <label for="fatherCell">Celular</label>
        <input type="tel" name="fatherCell" id="fatherCell" v-model="fatherCell">
        <br>

        <label for="fatherEmail">Correo electrónico</label>
        <input type="email" name="fatherEmail" id="fatherEmail" v-model="fatherEmail">
        <br>

        <h3>Datos de la madre</h3>
        <label for="motherName">Nombre de la madre</label>
        <input type="text" name="motherName" id="motherName" v-model="motherName">
        <br>

        <label for="motherBirthDate">Fecha de nacimiento</label>
        <input type="date" name="motherBirthDate" id="motherBirthDate" v-model="motherBirthDate">
        <br>
        <label for="motherBirthPlace">Lugar de nacimiento</label>
        <input type="text" name="motherBirthPlace" id="motherBirthPlace" v-model="motherBirthPlace">
        <br>

        <label for="motherId">Documento de identidad</label>
        <input type="text" name="motherId" id="motherId" v-model="motherId">
        <br>

        <label for="motherCompany">Nombre de la empresa de trabajo</label>
        <input type="text" name="motherCompany" id="motherCompany" v-model="motherCompany">
        <br>

        <label for="motherOccupation">Ocupación</label>
        <input type="text" name="motherOccupation" id="motherOccupation" v-model="motherOccupation">
        <br>

        <label for="motherEmail">Correo electrónico</label>
        <input type="email" name="motherEmail" id="motherEmail" v-model="motherEmail">
        <br>

        <label for="motherCell">Celular</label>
        <input type="tel" name="motherCell" id="motherCell" v-model="motherCell">
        <br>
    </div>
    <div>
        <h2>Datos del acudiente</h2>

        Ten en cuenta que el acudiente debe ser diferente a los padres.
        <br>
        <label for="guardianName">Nombre del acudiente</label>
        <input type="text" name="guardianName" id="guardianName" v-model="guardianName">
        <br>

        <label for="guardianKinship">Parentesco</label>
        <input type="text" name="guardianKinship" id="guardianKinship" v-model="guardianKinship">
        <br>

        <label for="guardianCell">Celular</label>
        <input type="tel" name="guardianCell" id="guardianCell" v-model="guardianCell">
        <br>

        <label for="guardianPhone">Teléfono fijo</label>
        <input type="tel" name="guardianPhone" id="guardianPhone" v-model="guardianPhone">
        <br>

        <label for="guardianEmail">Correo Electrónico</label>
        <input type="tel" name="guardianEmail" id="guardianEmail" v-model="guardianEmail">
        <br>
    </div>

    <div>
        <h2>Datos del acudiente</h2>

        Ten en cuenta que el acudiente debe ser diferente a los padres.
        <br>
        <label for="guardianName">Nombre del acudiente</label>
        <input type="text" name="guardianName" id="guardianName" v-model="guardianName">
        <br>

        <label for="guardianKinship">Parentesco</label>
        <input type="text" name="guardianKinship" id="guardianKinship" v-model="guardianKinship">
        <br>

        <label for="guardianCell">Celular</label>
        <input type="tel" name="guardianCell" id="guardianCell" v-model="guardianCell">
        <br>

        <label for="guardianPhone">Teléfono fijo</label>
        <input type="tel" name="guardianPhone" id="guardianPhone" v-model="guardianPhone">
        <br>

        <label for="guardianEmail">Correo Electrónico</label>
        <input type="tel" name="guardianEmail" id="guardianEmail" v-model="guardianEmail">
        <br>
    </div>

    <div>
        <h2>Responsable de pagos</h2>
        <br>
        <label for="payerName">Nombre responsable de pagos</label>
        <input type="text" name="payerName" id="payerName" v-model="payerName">
        <br>

        <label for="payerCell">Celular</label>
        <input type="tel" name="payerCell" id="payerCell" v-model="payerCell">
        <br>

        <label for="payerPhone">Teléfono fijo</label>
        <input type="tel" name="payerPhone" id="payerPhone" v-model="payerPhone">
        <br>

        <label for="payerEmail">Correo Electrónico</label>
        <input type="email" name="payerEmail" id="payerEmail" v-model="payerEmail">
        <br>
    </div>

    <h2>Firmas</h2>

    <div style="margin-top:12px; padding:16px; border:1px solid #ddd; border-radius:8px;">
        <h3>Firma de la madre</h3>
        <label style="display:block; margin-bottom:8px;">
            <input type="radio" name="motherSignatureMode" value="digital" v-model="motherSignatureMode">
            Firma digital en pantalla
        </label>
        <label style="display:block; margin-bottom:12px;">
            <input type="radio" name="motherSignatureMode" value="upload" v-model="motherSignatureMode">
            Subir firma digital desde el dispositivo
        </label>

        <div v-show="motherSignatureMode === 'digital'" style="margin-bottom:16px;">
            <canvas ref="motherSignatureCanvas" class="signature-pad"
                style="border:1px solid #ccc; width:100%; height:200px; touch-action:none; pointer-events:auto; user-select:none; -ms-touch-action:none;"></canvas>
            <div style="margin-top:8px;">
                <button type="button" @click="clearMotherSignature">Limpiar</button>
                <button type="button" @click="saveMotherSignature">Guardar firma</button>
            </div>
        </div>

        <div v-show="motherSignatureMode === 'upload'">
            <input type="file" accept="image/*" @change="handleMotherSignatureUpload">
            <p v-if="motherSignatureFileName" style="margin-top:8px;">
                Archivo seleccionado: {{ motherSignatureFileName }}
            </p>
        </div>
    </div>

    <div style="margin-top:12px; padding:16px; border:1px solid #ddd; border-radius:8px;">
        <h3>Firma del padre</h3>
        <label style="display:block; margin-bottom:8px;">
            <input type="radio" name="fatherSignatureMode" value="digital" v-model="fatherSignatureMode">
            Firma digital en pantalla
        </label>
        <label style="display:block; margin-bottom:12px;">
            <input type="radio" name="fatherSignatureMode" value="upload" v-model="fatherSignatureMode">
            Subir firma digital desde el dispositivo
        </label>

        <div v-show="fatherSignatureMode === 'digital'" style="margin-bottom:16px;">
            <canvas ref="fatherSignatureCanvas" class="signature-pad"
                style="border:1px solid #ccc; width:100%; height:200px; touch-action:none; pointer-events:auto; user-select:none; -ms-touch-action:none;"></canvas>
            <div style="margin-top:8px;">
                <button type="button" @click="clearFatherSignature">Limpiar</button>
                <button type="button" @click="saveFatherSignature">Guardar firma</button>
            </div>
        </div>

        <div v-show="fatherSignatureMode === 'upload'">
            <input type="file" accept="image/*" @change="handleFatherSignatureUpload">
            <p v-if="fatherSignatureFileName" style="margin-top:8px;">
                Archivo seleccionado: {{ fatherSignatureFileName }}
            </p>
        </div>
    </div>
    <label>
        <input type="checkbox" v-model="acceptedPrivacyPolicy">
        Al firmar, certifico que conozco y acepto el manual de convivencia de la institución. <br>
        Así mismo, autorizo de manera libre, previa, expresa e informada el tratamiento de los datos personales
        suministrados, conforme a la política de protección de datos de la institución, para fines académicos,
        administrativos y de contacto.

    </label>
    <button :disabled="!acceptedPrivacyPolicy">
        Enviar formulario
    </button>

</template>
<script setup lang="ts">
import { ref, type Ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const inDate: Ref<string> = ref('')
const outDate: Ref<string> = ref('')
const childName: Ref<string> = ref('')
const childLastName: Ref<string> = ref('')
const birthDate: Ref<string> = ref('')
const address: Ref<string> = ref('')
const neighborhood: Ref<string> = ref('')
const stratum: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')
const cellNumber: Ref<string> = ref('')
const childAge: Ref<string> = ref('')
const photo: Ref<File | null> = ref(null)
const transport: Ref<boolean> = ref(false)
const lunch: Ref<boolean> = ref(false)
const motherName: Ref<string> = ref('')
const fatherName: Ref<string> = ref('')
const fatherBirthDate: Ref<string> = ref('')
const fatherBirthPlace: Ref<string> = ref('')
const fatherId: Ref<string> = ref('')
const fatherCompany: Ref<string> = ref('')
const fatherOccupation: Ref<string> = ref('')
const fatherCell: Ref<string> = ref('')
const fatherEmail: Ref<string> = ref('')
const motherBirthDate: Ref<string> = ref('')
const motherBirthPlace: Ref<string> = ref('')

// Datos del acudiente
const guardianName: Ref<string> = ref('')
const guardianBirthDate: Ref<string> = ref('')
const guardianBirthPlace: Ref<string> = ref('')
const guardianId: Ref<string> = ref('')
const guardianCompany: Ref<string> = ref('')
const guardianOccupation: Ref<string> = ref('')
const guardianEmail: Ref<string> = ref('')
const guardianCell: Ref<string> = ref('')
const guardianPhone: Ref<string> = ref('')
const guardianRelation: Ref<string> = ref('')
const guardianKinship: Ref<string> = ref('')
// Responsable de pagos (payer)
const payerName: Ref<string> = ref('')
const payerCell: Ref<string> = ref('')
const payerPhone: Ref<string> = ref('')
const payerEmail: Ref<string> = ref('')
const motherId: Ref<string> = ref('')
const motherCompany: Ref<string> = ref('')
const motherOccupation: Ref<string> = ref('')
const motherEmail: Ref<string> = ref('')
const motherCell: Ref<string> = ref('')
const observations: Ref<string> = ref('')

const acceptedPrivacyPolicy: Ref<boolean> = ref(false)
const handlePhotoChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    photo.value = input.files?.[0] ?? null
}

// Firmas (implementación nativa para firmar y guardar sin dependencia externa)
type SignatureMode = 'digital' | 'upload'

const createSignatureSection = (initialMode: SignatureMode = 'digital') => {
    const mode: Ref<SignatureMode> = ref(initialMode)
    const canvas = ref<HTMLCanvasElement | null>(null)
    const dataUrl: Ref<string> = ref('')
    const file: Ref<File | null> = ref(null)
    const fileName: Ref<string> = ref('')
    let ctx: CanvasRenderingContext2D | null = null
    let drawing = false

    const resizeCanvas = () => {
        const element = canvas.value
        if (!element) return
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        const rect = element.getBoundingClientRect()
        element.width = Math.round(rect.width * ratio)
        element.height = Math.round(rect.height * ratio)
        const context = element.getContext('2d')
        if (!context) return
        context.scale(ratio, ratio)
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.lineWidth = 2
        context.strokeStyle = '#000'
        ctx = context
    }

    const pointerDown = (e: PointerEvent) => {
        if (!ctx || !canvas.value) return
        drawing = true
        canvas.value.setPointerCapture(e.pointerId)
        ctx.beginPath()
        const rect = canvas.value.getBoundingClientRect()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const pointerMove = (e: PointerEvent) => {
        if (!drawing || !ctx || !canvas.value) return
        const rect = canvas.value.getBoundingClientRect()
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const pointerUp = (e: PointerEvent) => {
        if (!canvas.value) return
        drawing = false
        try { canvas.value.releasePointerCapture(e.pointerId) } catch { }
    }

    const handleUpload = (event: Event) => {
        const input = event.target as HTMLInputElement
        file.value = input.files?.[0] ?? null
        fileName.value = file.value?.name ?? ''
    }

    const clear = () => {
        if (!canvas.value || !ctx) return
        const rect = canvas.value.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        dataUrl.value = ''
    }

    const save = () => {
        if (!canvas.value) return
        dataUrl.value = canvas.value.toDataURL('image/png')
        console.log('Firma digital guardada', dataUrl.value)
    }

    const mount = async () => {
        await nextTick()
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        const element = canvas.value
        if (element) {
            element.addEventListener('pointerdown', pointerDown)
            element.addEventListener('pointermove', pointerMove)
            element.addEventListener('pointerup', pointerUp)
            element.addEventListener('pointercancel', pointerUp)
        }
    }

    const unmount = () => {
        window.removeEventListener('resize', resizeCanvas)
        const element = canvas.value
        if (element) {
            element.removeEventListener('pointerdown', pointerDown)
            element.removeEventListener('pointermove', pointerMove)
            element.removeEventListener('pointerup', pointerUp)
            element.removeEventListener('pointercancel', pointerUp)
        }
    }

    return {
        mode,
        canvas,
        dataUrl,
        file,
        fileName,
        handleUpload,
        clear,
        save,
        mount,
        unmount,
    }
}

const motherSignature = createSignatureSection('digital')
const motherSignatureMode = motherSignature.mode
const motherSignatureCanvas = motherSignature.canvas
const motherSignatureDataUrl = motherSignature.dataUrl
const motherSignatureFile = motherSignature.file
const motherSignatureFileName = motherSignature.fileName
const handleMotherSignatureUpload = motherSignature.handleUpload
const clearMotherSignature = motherSignature.clear
const saveMotherSignature = motherSignature.save

const fatherSignature = createSignatureSection('digital')
const fatherSignatureMode = fatherSignature.mode
const fatherSignatureCanvas = fatherSignature.canvas
const fatherSignatureDataUrl = fatherSignature.dataUrl
const fatherSignatureFile = fatherSignature.file
const fatherSignatureFileName = fatherSignature.fileName
const handleFatherSignatureUpload = fatherSignature.handleUpload
const clearFatherSignature = fatherSignature.clear
const saveFatherSignature = fatherSignature.save

onMounted(async () => {
    await Promise.all([
        motherSignature.mount(),
        fatherSignature.mount(),
    ])
})

onBeforeUnmount(() => {
    motherSignature.unmount()
    fatherSignature.unmount()
})

</script>
<style lang="">

</style>