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


    <div>
        <h3>Firma de la madre</h3>
        <canvas ref="motherCanvas" class="signature-pad"
            style="border:1px solid #ccc; width:100%; height:200px; touch-action: none; pointer-events:auto; user-select:none; -ms-touch-action: none;"></canvas>
        <div style="margin-top:8px;">
            <button type="button" @click="clearMother">Limpiar</button>
            <button type="button" @click="saveMother">Guardar firma</button>
        </div>
        
    </div>
    <div style="margin-top:18px;">
        <h3>Firma del padre</h3>
        <canvas ref="fatherCanvas" class="signature-pad"
            style="border:1px solid #ccc; width:100%; height:200px; touch-action: none; pointer-events:auto; user-select:none; -ms-touch-action: none;"></canvas>
        <div style="margin-top:8px;">
            <button type="button" @click="clearFather">Limpiar</button>
            <button type="button" @click="saveFather">Guardar firma</button>
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

const acceptedPrivacyPolicy: Ref<boolean> = ref(false)
const handlePhotoChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    photo.value = input.files?.[0] ?? null
}

// firmas (implementación nativa para mostrar y guardar firma sin dependencia externa)
const motherCanvas = ref<HTMLCanvasElement | null>(null)
const motherSignature: Ref<string> = ref('')
let motherCtx: CanvasRenderingContext2D | null = null
let drawing = false

// Father signature
const fatherCanvas = ref<HTMLCanvasElement | null>(null)
const fatherSignature: Ref<string> = ref('')
let fatherCtx: CanvasRenderingContext2D | null = null
let fatherDrawing = false

const resizeFatherCanvas = () => {
    const c = fatherCanvas.value
    if (!c) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const rect = c.getBoundingClientRect()
    c.width = Math.round(rect.width * ratio)
    c.height = Math.round(rect.height * ratio)
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'
    fatherCtx = ctx
}

const pointerDownFather = (e: PointerEvent) => {
    if (!fatherCtx || !fatherCanvas.value) return
    fatherDrawing = true
    fatherCanvas.value.setPointerCapture(e.pointerId)
    fatherCtx.beginPath()
    const rect = fatherCanvas.value.getBoundingClientRect()
    fatherCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
}

const pointerMoveFather = (e: PointerEvent) => {
    if (!fatherDrawing || !fatherCtx || !fatherCanvas.value) return
    const rect = fatherCanvas.value.getBoundingClientRect()
    fatherCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    fatherCtx.stroke()
}

const pointerUpFather = (e: PointerEvent) => {
    if (!fatherCanvas.value) return
    fatherDrawing = false
    try { fatherCanvas.value.releasePointerCapture(e.pointerId) } catch { }
}

const resizeMotherCanvas = () => {
    const c = motherCanvas.value
    if (!c) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const rect = c.getBoundingClientRect()
    c.width = Math.round(rect.width * ratio)
    c.height = Math.round(rect.height * ratio)
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'
    motherCtx = ctx
}

const pointerDown = (e: PointerEvent) => {
    if (!motherCtx || !motherCanvas.value) return
    drawing = true
    motherCanvas.value.setPointerCapture(e.pointerId)
    motherCtx.beginPath()
    const rect = motherCanvas.value.getBoundingClientRect()
    motherCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
}

const pointerMove = (e: PointerEvent) => {
    if (!drawing || !motherCtx || !motherCanvas.value) return
    const rect = motherCanvas.value.getBoundingClientRect()
    motherCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    motherCtx.stroke()
}

const pointerUp = (e: PointerEvent) => {
    if (!motherCanvas.value) return
    drawing = false
    try { motherCanvas.value.releasePointerCapture(e.pointerId) } catch { }
}

onMounted(async () => {
    await nextTick()
    resizeMotherCanvas()
    window.addEventListener('resize', resizeMotherCanvas)
    const mc = motherCanvas.value
    if (mc) {
        mc.addEventListener('pointerdown', pointerDown)
        mc.addEventListener('pointermove', pointerMove)
        mc.addEventListener('pointerup', pointerUp)
        mc.addEventListener('pointercancel', pointerUp)
    }
    // father canvas setup
    resizeFatherCanvas()
    window.addEventListener('resize', resizeFatherCanvas)
    const fc = fatherCanvas.value
    if (fc) {
        fc.addEventListener('pointerdown', pointerDownFather)
        fc.addEventListener('pointermove', pointerMoveFather)
        fc.addEventListener('pointerup', pointerUpFather)
        fc.addEventListener('pointercancel', pointerUpFather)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeMotherCanvas)
    window.removeEventListener('resize', resizeFatherCanvas)
    const mc = motherCanvas.value
    if (mc) {
        mc.removeEventListener('pointerdown', pointerDown)
        mc.removeEventListener('pointermove', pointerMove)
        mc.removeEventListener('pointerup', pointerUp)
        mc.removeEventListener('pointercancel', pointerUp)
    }
    const fc = fatherCanvas.value
    if (fc) {
        fc.removeEventListener('pointerdown', pointerDownFather)
        fc.removeEventListener('pointermove', pointerMoveFather)
        fc.removeEventListener('pointerup', pointerUpFather)
        fc.removeEventListener('pointercancel', pointerUpFather)
    }
})

const clearMother = () => {
    if (!motherCanvas.value || !motherCtx) return
    const rect = motherCanvas.value.getBoundingClientRect()
    motherCtx.clearRect(0, 0, rect.width, rect.height)
    motherSignature.value = ''
}

const saveMother = () => {
    if (!motherCanvas.value) return
    motherSignature.value = motherCanvas.value.toDataURL('image/png')
    console.log('Firma madre guardada', motherSignature.value)
}

const clearFather = () => {
    if (!fatherCanvas.value || !fatherCtx) return
    const rect = fatherCanvas.value.getBoundingClientRect()
    fatherCtx.clearRect(0, 0, rect.width, rect.height)
    fatherSignature.value = ''
}

const saveFather = () => {
    if (!fatherCanvas.value) return
    fatherSignature.value = fatherCanvas.value.toDataURL('image/png')
    console.log('Firma padre guardada', fatherSignature.value)
}

</script>
<style lang="">

</style>