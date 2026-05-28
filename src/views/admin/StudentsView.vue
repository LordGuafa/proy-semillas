<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { PencilSquareIcon, TrashIcon, FunnelIcon, PlusIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSearchBar from '@/components/ui/BaseSearchBar.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useEstudiantesStore, type StudentRecord } from '@/stores/estudiantesStore'
import { useFormularioStore } from '@/stores/formularioStore'

const estudiantesStore = useEstudiantesStore()
const formularioStore = useFormularioStore()
const searchTerm = ref('')
const groupBy = ref<'group' | 'age' | 'status'>('group')
const filterPanelOpen = ref(false)
const deleteModalOpen = ref(false)
const editorOpen = ref(false)
const selectedStudentId = ref<string | null>(null)
const avatarPreview = ref('')
const confirmDeleteId = ref<string | null>(null)
const form = reactive<Record<string, any>>({})

const columns = [
    { key: 'photo', label: 'Foto' },
    { key: 'fullName', label: 'Nombre completo' },
    { key: 'age', label: 'Edad' },
    { key: 'group', label: 'Grupo asignado' },
    { key: 'entryDate', label: 'Fecha de ingreso' },
    { key: 'status', label: 'Estado' },
]

const filteredStudents = computed(() => estudiantesStore.estudiantesFiltrados(searchTerm.value, groupBy.value))
const paginatedStudents = computed(() => {
    const start = (estudiantesStore.pagination.page - 1) * estudiantesStore.pagination.perPage
    return filteredStudents.value.slice(start, start + estudiantesStore.pagination.perPage)
})

function resetForm() {
    Object.keys(form).forEach((key) => {
        form[key] = ''
    })
    avatarPreview.value = ''
}

function openCreateModal() {
    selectedStudentId.value = null
    resetForm()
    editorOpen.value = true
}

function openEditModal(student: StudentRecord) {
    selectedStudentId.value = student.id
    avatarPreview.value = student.photoUrl
    formularioStore.campos.forEach((field) => {
        form[field.id] = student.fieldValues[field.id] ?? ''
    })
    form.fullName = student.fullName
    form.age = student.age
    form.group = student.group
    form.entryDate = student.entryDate
    form.status = student.status
    form.observations = student.observations
    editorOpen.value = true
}

async function saveStudent() {
    const payload = {
        fullName: String(form.fullName ?? ''),
        age: Number(form.age ?? 0),
        group: String(form.group ?? ''),
        entryDate: String(form.entryDate ?? ''),
        status: (form.status as StudentRecord['status']) || 'pending',
        photoUrl: avatarPreview.value,
        observations: String(form.observations ?? ''),
        graduationYear: form.status === 'graduated' ? new Date().getFullYear() : null,
        fieldValues: formularioStore.campos.reduce<Record<string, string | number | boolean | null>>((accumulator, field) => {
            accumulator[field.id] = form[field.id] ?? ''
            return accumulator
        }, {}),
    }

    if (selectedStudentId.value) {
        await estudiantesStore.updateEstudiante(selectedStudentId.value, payload)
    } else {
        await estudiantesStore.createEstudiante(payload)
    }

    editorOpen.value = false
}

async function removeStudent() {
    if (confirmDeleteId.value) {
        await estudiantesStore.deleteEstudiante(confirmDeleteId.value)
    }
    deleteModalOpen.value = false
    confirmDeleteId.value = null
}

function askDelete(studentId: string) {
    confirmDeleteId.value = studentId
    deleteModalOpen.value = true
}

function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        avatarPreview.value = String(reader.result ?? '')
    }
    reader.readAsDataURL(file)
}

onMounted(() => {
    estudiantesStore.fetchEstudiantes()
    formularioStore.fetchCampos()
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1>Estudiantes</h1>
                <p class="mt-1 text-sm text-gray-500">Gestiona el registro académico del jardín.</p>
            </div>
            <BaseButton variant="primary" :icon="PlusIcon" @click="openCreateModal">Añadir estudiante</BaseButton>
        </div>

        <BaseCard>
            <div class="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
                <BaseSearchBar v-model="searchTerm" placeholder="Buscar por nombre" @search="searchTerm = $event" />
                <label class="space-y-2 text-sm font-medium text-gray-700">
                    <span>Agrupar por</span>
                    <select v-model="groupBy" class="panel-input">
                        <option value="group">Grupo</option>
                        <option value="age">Edad</option>
                        <option value="status">Estado</option>
                    </select>
                </label>
                <BaseButton variant="ghost" :icon="FunnelIcon" @click="filterPanelOpen = !filterPanelOpen">Filtros
                </BaseButton>
            </div>

            <div v-if="filterPanelOpen" class="mt-4 rounded-xl bg-primary/5 p-4 text-sm text-gray-600">
                Los filtros avanzados pueden ampliarse aquí con criterios por fecha, grupo o estado.
            </div>
        </BaseCard>

        <BaseTable v-model:page="estudiantesStore.pagination.page" :columns="columns" :rows="paginatedStudents"
            :loading="estudiantesStore.loading" :per-page="estudiantesStore.pagination.perPage"
            :total="estudiantesStore.pagination.total" empty-message="No hay estudiantes para mostrar."
            @update:page="estudiantesStore.pagination.page = $event">
            <template #cell-photo="{ row }">
                <img :src="String(row.photoUrl || 'https://placehold.co/80x80?text=ST')" :alt="String(row.fullName)"
                    class="h-10 w-10 rounded-full object-cover" />
            </template>

            <template #cell-status="{ row }">
                <BaseBadge :status="row.status" />
            </template>

            <template #actions="{ row }">
                <div class="flex items-center gap-2">
                    <button type="button" class="rounded-full p-2 text-accent transition hover:bg-accent/10"
                        aria-label="Editar estudiante" @click="openEditModal(row as StudentRecord)">
                        <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button type="button" class="rounded-full p-2 text-red-500 transition hover:bg-red-50"
                        aria-label="Eliminar estudiante" @click="askDelete(String(row.id))">
                        <TrashIcon class="h-5 w-5" />
                    </button>
                </div>
            </template>
        </BaseTable>

        <BaseModal :open="editorOpen" size="lg" :title="selectedStudentId ? 'Editar estudiante' : 'Nuevo estudiante'"
            @close="editorOpen = false">
            <div class="grid gap-6 lg:grid-cols-[260px_1fr]">
                <section class="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div class="flex items-center justify-center">
                        <img :src="avatarPreview || 'https://placehold.co/240x240?text=Foto'" alt="Foto del estudiante"
                            class="h-40 w-40 rounded-2xl object-cover shadow-sm" />
                    </div>
                    <input id="student-photo" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                    <label for="student-photo">
                        <BaseButton variant="ghost" block :icon="PhotoIcon" aria-label="Cargar foto">Cargar foto
                        </BaseButton>
                    </label>
                </section>

                <section class="space-y-5">
                    <div class="grid gap-4 md:grid-cols-2">
                        <BaseInput v-model="form.fullName" label="Nombre completo" required />
                        <BaseInput v-model="form.age" label="Edad" type="number" required />
                        <BaseInput v-model="form.group" label="Grupo asignado" required />
                        <BaseInput v-model="form.entryDate" label="Fecha de ingreso" type="date" required />
                        <label class="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
                            <span>Estado</span>
                            <select v-model="form.status" class="panel-input">
                                <option value="pending">pending</option>
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                                <option value="graduated">graduated</option>
                            </select>
                        </label>
                    </div>

                    <div class="rounded-2xl border border-gray-100 p-4">
                        <h3 class="mb-4">Campos dinámicos</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            <template v-for="field in formularioStore.campos" :key="field.id">
                                <label v-if="field.visible" class="space-y-2 text-sm font-medium text-gray-700">
                                    <span>{{ field.label }}</span>
                                    <input v-if="field.type === 'text'" v-model="form[field.id]" class="panel-input"
                                        :required="field.required" />
                                    <input v-else-if="field.type === 'number'" v-model="form[field.id]" type="number"
                                        class="panel-input" :required="field.required" />
                                    <input v-else-if="field.type === 'date'" v-model="form[field.id]" type="date"
                                        class="panel-input" :required="field.required" />
                                    <select v-else v-model="form[field.id]" class="panel-input"
                                        :required="field.required">
                                        <option value="">Selecciona...</option>
                                        <option value="Opción 1">Opción 1</option>
                                        <option value="Opción 2">Opción 2</option>
                                        <option value="Opción 3">Opción 3</option>
                                    </select>
                                </label>
                            </template>
                        </div>
                    </div>

                    <label class="space-y-2 text-sm font-medium text-gray-700">
                        <span>Observaciones</span>
                        <textarea v-model="form.observations" rows="4" class="panel-input resize-none"
                            placeholder="Escribe observaciones relevantes" />
                    </label>
                </section>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <BaseButton variant="ghost" @click="editorOpen = false">Cancelar</BaseButton>
                    <BaseButton variant="primary" @click="saveStudent">Guardar</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal :open="deleteModalOpen" size="sm" title="Confirmar eliminación" @close="deleteModalOpen = false">
            <p class="text-sm text-gray-600">Esta acción eliminará el registro seleccionado.</p>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <BaseButton variant="ghost" @click="deleteModalOpen = false">Cancelar</BaseButton>
                    <BaseButton variant="danger" @click="removeStudent">Eliminar</BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>
