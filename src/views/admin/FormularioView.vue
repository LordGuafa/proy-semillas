<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { VueDraggableNext } from 'vue-draggable-next'
import CampoEditorItem from '@/components/formulario/CampoEditorItem.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useFormularioStore } from '@/stores/formularioStore'
import type { Campo, FormularioTipo } from '@/types/formulario'

const formularioStore = useFormularioStore()
const discardModalOpen = ref(false)
const pendingTipo = ref<FormularioTipo | null>(null)
const toastMessage = ref('')
const toastVisible = ref(false)

const typeLabels: Record<FormularioTipo, string> = {
  inscripcion: 'Formulario de Inscripción',
  entrevista: 'Formulario de Entrevista',
  matricula: 'Formulario de Matrícula',
}

const typeDescriptions: Record<FormularioTipo, string> = {
  inscripcion: 'Campos base para registrar una solicitud de inscripción.',
  entrevista: 'Campos que verá el acudiente al solicitar una cita de entrevista.',
  matricula: 'Campos que completará el acudiente durante el proceso de matrícula.',
}

const fixedFieldIds: Record<FormularioTipo, Set<string>> = {
  inscripcion: new Set([]),
  entrevista: new Set([
    'nom_madre',
    'nom_padre',
    'correo',
    'celular',
    'nom_estudiante',
    'edad_estudiante',
    'como_conocimiento',
    'fechaPreferidaEntrevista',
  ]),
  matricula: new Set(['fotoEstudiante', 'documentoIdentidad']),
}

const activeCampos = computed<Campo[]>({
  get: () => formularioStore.camposActivos,
  set: (value) => formularioStore.reorderCampos(formularioStore.tipoActivo, value),
})

function showToast(message: string) {
  toastMessage.value = message
  toastVisible.value = true
  window.clearTimeout(showToastTimeout)
  showToastTimeout = window.setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

let showToastTimeout = window.setTimeout(() => undefined, 0)

function openTab(tipo: FormularioTipo) {
  if (tipo === formularioStore.tipoActivo) return
  if (formularioStore.dirty) {
    pendingTipo.value = tipo
    discardModalOpen.value = true
    return
  }
  formularioStore.setTipoActivo(tipo)
}

async function confirmTabChange() {
  if (!pendingTipo.value) return
  const currentTipo = formularioStore.tipoActivo
  await formularioStore.fetchFormulario(currentTipo)
  formularioStore.setTipoActivo(pendingTipo.value)
  discardModalOpen.value = false
  pendingTipo.value = null
}

function cancelTabChange() {
  discardModalOpen.value = false
  pendingTipo.value = null
}

function addCampo() {
  formularioStore.addCampo(formularioStore.tipoActivo)
}

async function saveCampos() {
  await formularioStore.saveFormulario(formularioStore.tipoActivo)
  showToast('Cambios guardados correctamente.')
}

function updateCampo(campo: Campo) {
  formularioStore.updateCampo(formularioStore.tipoActivo, campo.id, campo)
}

function removeCampo(campoId: string) {
  formularioStore.removeCampo(formularioStore.tipoActivo, campoId)
}

onMounted(async () => {
  await formularioStore.fetchFormulario('entrevista')
  await formularioStore.fetchFormulario('matricula')
})
</script>

<template>
  <div class="space-y-6">
    <header class="space-y-4">
      <div>
        <h1>Formularios de Inscripción</h1>
        <p class="mt-1 text-sm text-gray-500">Configura los formularios que usarán los acudientes en cada etapa del proceso.</p>
      </div>

      <div class="flex flex-wrap gap-3" role="tablist" aria-label="Tipo de formulario">
        <button
          type="button"
          role="tab"
          :aria-selected="formularioStore.tipoActivo === 'entrevista'"
          class="relative rounded-full px-4 py-2 text-sm font-medium transition"
          :class="formularioStore.tipoActivo === 'entrevista' ? 'bg-primary text-white' : 'border border-primary text-primary hover:bg-primary/10'"
          @click="openTab('entrevista')"
        >
          <span>Formulario de Entrevista</span>
          <span v-if="formularioStore.tipoActivo === 'entrevista' && formularioStore.dirty" class="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="formularioStore.tipoActivo === 'matricula'"
          class="relative rounded-full px-4 py-2 text-sm font-medium transition"
          :class="formularioStore.tipoActivo === 'matricula' ? 'bg-primary text-white' : 'border border-primary text-primary hover:bg-primary/10'"
          @click="openTab('matricula')"
        >
          <span>Formulario de Matrícula</span>
          <span v-if="formularioStore.tipoActivo === 'matricula' && formularioStore.dirty" class="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>
      </div>

      <p class="text-sm text-gray-500">{{ typeDescriptions[formularioStore.tipoActivo] }}</p>
    </header>

    <section class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <VueDraggableNext
        v-model="activeCampos"
        item-key="id"
        handle=".campo-handle"
        :animation="180"
        class="grid gap-4 md:grid-cols-2"
      >
        <CampoEditorItem
          v-for="campo in activeCampos"
          :key="campo.id"
          :campo="campo"
          :tipo="formularioStore.tipoActivo"
          :fijo="fixedFieldIds[formularioStore.tipoActivo].has(campo.id)"
          @update:campo="updateCampo"
          @delete="removeCampo(campo.id)"
        />
      </VueDraggableNext>

      <div class="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <BaseButton variant="ghost" :icon="PlusIcon" @click="addCampo">Añadir campo</BaseButton>
        <BaseButton :loading="formularioStore.loading" :disabled="!formularioStore.dirty" variant="primary" @click="saveCampos">Guardar cambios</BaseButton>
      </div>
    </section>

    <BaseModal :open="discardModalOpen" size="sm" title="Confirmar cambio de formulario" @close="cancelTabChange">
      <p class="text-sm text-gray-600">¿Descartar cambios en {{ typeLabels[formularioStore.tipoActivo] }}?</p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="cancelTabChange">Cancelar</BaseButton>
          <BaseButton variant="primary" @click="confirmTabChange">Descartar y cambiar</BaseButton>
        </div>
      </template>
    </BaseModal>

    <transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div v-if="toastVisible" class="fixed bottom-6 right-6 z-[80] rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>
