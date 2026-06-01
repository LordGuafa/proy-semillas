<template>
    <div class="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 py-6 space-y-8">
        <section class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <div class="flex flex-col items-center gap-3 text-center">
                <img src="@/assets/logo_semillas.svg" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-20" />
                <h1 class="title text-3xl md:text-5xl">Registro de Matrícula</h1>
            </div>
            <p class="font-comfortaa text-base text-gray-800 mb-4 max-w-4xl mx-auto text-center">
                ¡Gracias por preferirnos! A continuación encontrarás los datos necesarios para la formalización de la matrícula. Por favor diligenciar todos los datos y verificar su veracidad.
            </p>
        </section>

        <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <h2 class="title-sub text-3xl md:text-3xl">Datos del estudiante</h2>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BaseInput v-model="childName" label="Nombres" labelPosition="above" />
                    <BaseInput v-model="childLastName" label="Apellidos" labelPosition="above" />
                    <BaseInput v-model="birthDate" label="Fecha de nacimiento" type="date" labelPosition="above" />
                    <BaseInput v-model="address" label="Dirección" labelPosition="above" />
                    <BaseInput v-model="neighborhood" label="Barrio" labelPosition="above" />
                    <BaseInput v-model="stratum" label="Estrato" labelPosition="above" />
                    <BaseInput v-model="childAge" label="Edad actual" labelPosition="above" />
                </div>

                <div>
                    <label for="photo" class="block text-sm font-medium text-gray-700">Foto tamaño carnet</label>
                    <label class="inline-flex items-center gap-3 mt-1">
                        <input ref="photoInput" type="file" name="photo" id="photo" accept="image/*" class="hidden" @change="handlePhotoChange">
                        <BaseButton type="button" variant="ghost" size="sm" @click="triggerPhotoUpload">Subir imagen</BaseButton>
                        <span class="text-sm text-gray-600">{{ photo ? photo.name : '' }}</span>
                    </label>
                </div>

                <div class="space-y-3">
                    <h3 class="title-sub text-2xl md:text-3xl">Servicios complementarios contratados:</h3>
                    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                        <label class="inline-flex items-center gap-2 text-gray-800 font-comfortaa">
                            <input class="h-4 w-4 text-accent border-gray-300 rounded" type="checkbox" v-model="transport">
                            <span>Transporte de ruta</span>
                        </label>
                        <label class="inline-flex items-center gap-2 text-gray-800 font-comfortaa">
                            <input class="h-4 w-4 text-accent border-gray-300 rounded" type="checkbox" v-model="lunch">
                            <span>Almuerzo</span>
                        </label>
                    </div>
                </div>

                <div class="space-y-3">
                    <h3 class="title-sub text-2xl md:text-3xl">Información relevante</h3>
                    <p class="font-comfortaa text-base text-gray-800">
                        Escribe aquí información importante sobre el niño o niña que debamos tener en cuenta, por ejemplo:
                        alergias, condiciones médicas, tratamientos, necesidades especiales o cualquier otra observación relevante.
                    </p>
                    <label for="observations" class="block text-sm font-medium text-gray-700">Observaciones:</label>
                    <textarea name="observations" id="observations" v-model="observations" rows="4" class="panel-input h-28 resize-none"></textarea>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
                <h2 class="title-sub text-3xl md:text-3xl">Datos de los padres</h2>

                <div class="space-y-4">
                    <h3 class="text-xl font-medium text-primary">Datos del padre</h3>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <BaseInput v-model="fatherName" label="Nombre del padre" labelPosition="above" />
                        <BaseInput v-model="fatherBirthDate" label="Fecha de nacimiento" type="date" labelPosition="above" />
                        <BaseInput v-model="fatherBirthPlace" label="Lugar de nacimiento" labelPosition="above" />
                        <BaseInput v-model="fatherId" label="Documento de identidad" labelPosition="above" />
                        <BaseInput v-model="fatherCompany" label="Nombre de la empresa de trabajo" labelPosition="above" />
                        <BaseInput v-model="fatherOccupation" label="Ocupación" labelPosition="above" />
                        <BaseInput v-model="fatherCell" label="Celular" type="tel" labelPosition="above" />
                        <BaseInput v-model="fatherEmail" label="Correo electrónico" type="email" labelPosition="above" />
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="text-xl font-medium text-primary">Datos de la madre</h3>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <BaseInput v-model="motherName" label="Nombre de la madre" labelPosition="above" />
                        <BaseInput v-model="motherBirthDate" label="Fecha de nacimiento" type="date" labelPosition="above" />
                        <BaseInput v-model="motherBirthPlace" label="Lugar de nacimiento" labelPosition="above" />
                        <BaseInput v-model="motherId" label="Documento de identidad" labelPosition="above" />
                        <BaseInput v-model="motherCompany" label="Nombre de la empresa de trabajo" labelPosition="above" />
                        <BaseInput v-model="motherOccupation" label="Ocupación" labelPosition="above" />
                        <BaseInput v-model="motherEmail" label="Correo electrónico" type="email" labelPosition="above" />
                        <BaseInput v-model="motherCell" label="Celular" type="tel" labelPosition="above" />
                    </div>
                </div>
            </div>
        </section>

        <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <h2 class="title-sub text-3xl md:text-3xl">Datos del acudiente</h2>

                <p class="font-comfortaa text-base text-gray-800">Ten en cuenta que el acudiente debe ser diferente a los padres.</p>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BaseInput v-model="guardianName" label="Nombre del acudiente" labelPosition="above" />
                    <BaseInput v-model="guardianId" label="Cédula" labelPosition="above" />
                    <BaseInput v-model="guardianKinship" label="Parentesco" labelPosition="above" />
                    <BaseInput v-model="guardianCell" label="Celular" type="tel" labelPosition="above" />
                    <BaseInput v-model="guardianPhone" label="Teléfono fijo" type="tel" labelPosition="above" />
                    <BaseInput v-model="guardianEmail" label="Correo Electrónico" type="email" labelPosition="above" />
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <h2 class="title-sub text-3xl md:text-3xl">Responsable de pagos</h2>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BaseInput v-model="payerName" label="Nombre responsable de pagos" labelPosition="above" />
                    <BaseInput v-model="payerId" label="Cédula" labelPosition="above" />
                    <BaseInput v-model="payerCell" label="Celular" type="tel" labelPosition="above" />
                    <BaseInput v-model="payerPhone" label="Teléfono fijo" type="tel" labelPosition="above" />
                    <BaseInput v-model="payerEmail" label="Correo Electrónico" type="email" labelPosition="above" />
                </div>
            </div>
        </section>

        <section class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
            <h2 class="title-sub text-3xl md:text-3xl">Firmas</h2>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                    <h3 class="text-xl font-medium text-primary">Firma de la madre</h3>
                    <label class="block space-y-2 text-sm text-gray-700">
                        <span class="inline-flex items-center gap-2 font-comfortaa">
                            <input type="radio" name="motherSignatureMode" value="digital" v-model="motherSignatureMode">
                            Firma digital en pantalla
                        </span>
                    </label>
                    <label class="block space-y-2 text-sm text-gray-700">
                        <span class="inline-flex items-center gap-2 font-comfortaa">
                            <input type="radio" name="motherSignatureMode" value="upload" v-model="motherSignatureMode">
                            Subir firma digital desde el dispositivo
                        </span>
                    </label>

                    <div v-show="motherSignatureMode === 'digital'" class="space-y-3">
                        <canvas ref="motherSignatureCanvas" class="signature-pad block h-52 w-full rounded-xl border border-gray-300 bg-white touch-none"></canvas>
                        <div class="flex flex-wrap gap-3">
                            <button type="button" class="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10" @click="clearMotherSignature">Limpiar</button>
                            <button type="button" class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90" @click="saveMotherSignature">Guardar firma</button>
                        </div>
                    </div>

                    <div v-show="motherSignatureMode === 'upload'">
                        <label class="inline-flex flex-wrap items-center gap-3">
                            <input ref="motherSignatureInput" type="file" accept="image/*" class="hidden" @change="handleMotherSignatureUpload">
                            <BaseButton type="button" variant="ghost" size="sm" @click="triggerMotherSignatureUpload">Subir imagen</BaseButton>
                            <span class="text-sm text-gray-600" v-if="motherSignatureFileName">Archivo seleccionado: {{ motherSignatureFileName }}</span>
                        </label>
                    </div>
                </div>

                <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                    <h3 class="text-xl font-medium text-primary">Firma del padre</h3>
                    <label class="block space-y-2 text-sm text-gray-700">
                        <span class="inline-flex items-center gap-2 font-comfortaa">
                            <input type="radio" name="fatherSignatureMode" value="digital" v-model="fatherSignatureMode">
                            Firma digital en pantalla
                        </span>
                    </label>
                    <label class="block space-y-2 text-sm text-gray-700">
                        <span class="inline-flex items-center gap-2 font-comfortaa">
                            <input type="radio" name="fatherSignatureMode" value="upload" v-model="fatherSignatureMode">
                            Subir firma digital desde el dispositivo
                        </span>
                    </label>

                    <div v-show="fatherSignatureMode === 'digital'" class="space-y-3">
                        <canvas ref="fatherSignatureCanvas" class="signature-pad block h-52 w-full rounded-xl border border-gray-300 bg-white touch-none"></canvas>
                        <div class="flex flex-wrap gap-3">
                            <button type="button" class="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10" @click="clearFatherSignature">Limpiar</button>
                            <button type="button" class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90" @click="saveFatherSignature">Guardar firma</button>
                        </div>
                    </div>

                    <div v-show="fatherSignatureMode === 'upload'">
                        <label class="inline-flex flex-wrap items-center gap-3">
                            <input ref="fatherSignatureInput" type="file" accept="image/*" class="hidden" @change="handleFatherSignatureUpload">
                            <BaseButton type="button" variant="ghost" size="sm" @click="triggerFatherSignatureUpload">Subir imagen</BaseButton>
                            <span class="text-sm text-gray-600" v-if="fatherSignatureFileName">Archivo seleccionado: {{ fatherSignatureFileName }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                <label class="inline-flex items-start gap-3">
                    <input class="mt-1 h-4 w-4 rounded border-gray-300" type="checkbox" v-model="acceptedPrivacyPolicy">
                    <span class="text-sm text-gray-800 font-comfortaa">
                        Al firmar, certifico que conozco y acepto el manual de convivencia de la institución. <br>
                        Así mismo, autorizo de manera libre, previa, expresa e informada el tratamiento de los datos personales
                        suministrados, conforme a la política de protección de datos de la institución, para fines académicos,
                        administrativos y de contacto.
                    </span>
                </label>

                <BaseButton type="button" :disabled="!acceptedPrivacyPolicy || enrollmentStore.loading" variant="primary" @click="handleSubmit">Enviar formulario</BaseButton>
            </div>
        </section>
    </div>

</template>
<script setup lang="ts">
import { ref, type Ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useEnrollmentStore } from '@/stores/enrollmentStore'


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
const payerId: Ref<string> = ref('')
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

// Refs for hidden file inputs so buttons can trigger them
const photoInput = ref<HTMLInputElement | null>(null)
const motherSignatureInput = ref<HTMLInputElement | null>(null)
const fatherSignatureInput = ref<HTMLInputElement | null>(null)

const triggerPhotoUpload = () => { photoInput.value?.click() }
const triggerMotherSignatureUpload = () => { motherSignatureInput.value?.click() }
const triggerFatherSignatureUpload = () => { fatherSignatureInput.value?.click() }

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
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.lineWidth = 3
        context.strokeStyle = '#000'
        ctx = context

        context.clearRect(0, 0, rect.width, rect.height)
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

const enrollmentStore = useEnrollmentStore()

async function handleSubmit() {
    if (!acceptedPrivacyPolicy.value) return
    const payload = {
        estudiante: {
            nombres: childName.value,
            apellidos: childLastName.value,
            fecha_nacimiento: birthDate.value,
            tipo_documento: '',
            documento_identidad: '',
            direccion_residencia: address.value,
            barrio: neighborhood.value,
            estrato: Number(stratum.value) || 0,
            foto_url: '',
            tiene_transporte_ruta: transport.value,
            tiene_almuerzo: lunch.value,
            observaciones_relevantes: observations.value,
        },
        padre: {
            nombre_completo: fatherName.value,
            tipo_documento: '',
            documento_identidad: fatherId.value,
            fecha_nacimiento: fatherBirthDate.value,
            lugar_nacimiento: fatherBirthPlace.value,
            celular: fatherCell.value,
            correo_electronico: fatherEmail.value,
            nombre_empresa_trabajo: fatherCompany.value,
            ocupacion: fatherOccupation.value,
        },
        madre: {
            nombre_completo: motherName.value,
            tipo_documento: '',
            documento_identidad: motherId.value,
            fecha_nacimiento: motherBirthDate.value,
            lugar_nacimiento: motherBirthPlace.value,
            celular: motherCell.value,
            correo_electronico: motherEmail.value,
            nombre_empresa_trabajo: motherCompany.value,
            ocupacion: motherOccupation.value,
        },
        acudiente_adicional: {
            nombre_acudiente: guardianName.value,
            tipo_documento: '',
            documento_identidad: guardianId.value,
            parentesco: guardianKinship.value,
            celular: guardianCell.value,
            correo_electronico: guardianEmail.value,
            telefono_fijo: guardianPhone.value,
        },
        responsable_pago: {
            nombre_completo: payerName.value,
            tipo_documento: '',
            documento_identidad: payerId.value,
            celular: payerCell.value,
            telefono_fijo: payerPhone.value,
            correo_electronico: payerEmail.value,
        },
    }

    try {
        await enrollmentStore.submitEnrollment(payload)
        // simple success UX: clear form and inform user
        clearForm()
        acceptedPrivacyPolicy.value = false
        // eslint-disable-next-line no-alert
        alert('Inscripción enviada correctamente')
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Inscripción fallida', err)
        // eslint-disable-next-line no-alert
        alert('Error al enviar la inscripción')
    }
}

function clearForm() {
    childName.value = ''
    childLastName.value = ''
    birthDate.value = ''
    address.value = ''
    neighborhood.value = ''
    stratum.value = ''
    photo.value = null
    transport.value = false
    lunch.value = false
    observations.value = ''

    fatherName.value = ''
    fatherBirthDate.value = ''
    fatherBirthPlace.value = ''
    fatherId.value = ''
    fatherCompany.value = ''
    fatherOccupation.value = ''
    fatherCell.value = ''
    fatherEmail.value = ''

    motherName.value = ''
    motherBirthDate.value = ''
    motherBirthPlace.value = ''
    motherId.value = ''
    motherCompany.value = ''
    motherOccupation.value = ''
    motherEmail.value = ''
    motherCell.value = ''

    guardianName.value = ''
    guardianBirthDate.value = ''
    guardianBirthPlace.value = ''
    guardianId.value = ''
    guardianCompany.value = ''
    guardianOccupation.value = ''
    guardianEmail.value = ''
    guardianCell.value = ''
    guardianPhone.value = ''
    guardianRelation.value = ''
    guardianKinship.value = ''

    payerName.value = ''
    payerCell.value = ''
    payerPhone.value = ''
    payerEmail.value = ''
    motherSignatureFileName.value = ''
    fatherSignatureFileName.value = ''
}

</script>
<style lang="">

</style>