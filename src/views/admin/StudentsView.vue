<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { PencilSquareIcon, PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSearchBar from '@/components/ui/BaseSearchBar.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import EstudianteModal from '@/components/estudiantes/EstudianteModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import type Student from '@/types/student'
import { studentStatusLabel, studentStatusVariant } from '@/types/student'

const estudiantesStore = useEstudiantesStore()
const searchTerm = ref('')
const statusFilter = ref('all')
const cityFilter = ref('all')
const page = ref(1)
const pageSize = 8
const editorOpen = ref(false)
const deleteModalOpen = ref(false)
const selectedStudent = ref<Student | null>(null)

const columns = [
    { key: 'photo', label: 'Avatar' },
    { key: 'fullName', label: 'Nombre completo' },
    { key: 'city', label: 'Ciudad' },
    { key: 'strata', label: 'Estrato' },
    { key: 'lunch', label: 'Almuerzo' },
    { key: 'transport', label: 'Transporte' },
    { key: 'status', label: 'Estado' },
]

const filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Aspirante', value: 'ASPIRANTE' },
    { label: 'Activo', value: 'ACTIVO' },
]

const filteredStudents = computed(() =>
    estudiantesStore.estudiantesFiltrados(searchTerm.value, {
        status: statusFilter.value as Student['status'] | 'all',
        city: cityFilter.value,
    }),
)

const visibleStudents = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredStudents.value.slice(start, start + pageSize)
})

const cityOptions = computed(() => [
    { label: 'Todas', value: 'all' },
    ...Array.from(
        new Set(
            estudiantesStore.estudiantes
                .filter((student) => student.status === 'ASPIRANTE' || student.status === 'ACTIVO')
                .map((student) => student.city)
                .filter((city): city is string => Boolean(city)),
        ),
    )
        .sort((a, b) => a.localeCompare(b, 'es'))
        .map((city) => ({ label: city, value: city })),
])

const selectedStudentName = computed(() =>
    selectedStudent.value ? `${selectedStudent.value.firstname} ${selectedStudent.value.lastname}`.trim() : '',
)

function statusVariant(status: Student['status']) {
    return studentStatusVariant[status]
}

function statusLabel(status: Student['status']) {
    return studentStatusLabel[status]
}

watch([searchTerm, statusFilter, cityFilter], () => {
    page.value = 1
})

function getInitials(student: Student) {
    return `${student.firstname?.[0] ?? ''}${student.lastname?.[0] ?? ''}`.toUpperCase() || 'ES'
}

function openCreateModal() {
    selectedStudent.value = null
    editorOpen.value = true
}

function openEditModal(student: Student) {
    selectedStudent.value = student
    editorOpen.value = true
}

function askDelete(student: Student) {
    selectedStudent.value = student
    deleteModalOpen.value = true
}

async function removeStudent() {
    if (!selectedStudent.value) return
    await estudiantesStore.deleteEstudiante(selectedStudent.value.id)
    deleteModalOpen.value = false
    selectedStudent.value = null
}

onMounted(() => {
    estudiantesStore.fetchEstudiantes()
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1>Estudiantes</h1>
                <p class="mt-1 text-sm text-gray-500">Gestiona los estudiantes activos y aspirantes del jardín.</p>
            </div>
            <BaseButton variant="primary" :icon="PlusIcon" @click="openCreateModal">Añadir estudiante</BaseButton>
        </div>

        <BaseCard>
            <div class="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
                <BaseSearchBar v-model="searchTerm" placeholder="Buscar por nombre" />
                <BaseSelect v-model="statusFilter" label="Estado" :options="filterOptions" />
                <BaseSelect v-model="cityFilter" label="Ciudad" :options="cityOptions" />
            </div>
        </BaseCard>

        <BaseTable
            v-model:page="page"
            :columns="columns"
            :rows="visibleStudents"
            :loading="estudiantesStore.loading"
            :per-page="pageSize"
            :total="filteredStudents.length"
            empty-message="No hay estudiantes para mostrar."
            actions-label="Acciones"
            @row-click="(row) => openEditModal(row as Student)"
        >
            <template #cell-photo="{ row }">
                <div class="flex items-center justify-center">
                    <div v-if="row.photoURL" class="h-10 w-10 overflow-hidden rounded-full bg-primary/20">
                        <img :src="String(row.photoURL)" :alt="`${row.firstname} ${row.lastname}`" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                        {{ getInitials(row as Student) }}
                    </div>
                </div>
            </template>

            <template #cell-fullName="{ row }">
                <span class="font-medium text-gray-900">{{ `${row.firstname} ${row.lastname}`.trim() }}</span>
            </template>

            <template #cell-city="{ row }">
                <span class="text-sm text-gray-600">{{ row.city || '—' }}</span>
            </template>

            <template #cell-strata="{ row }">
                <span class="text-sm text-gray-600">{{ row.strata || '—' }}</span>
            </template>

            <template #cell-lunch="{ row }">
                <CheckCircleIcon v-if="row.hasLunch" class="h-5 w-5 text-primary" aria-label="Incluye almuerzo" />
                <XCircleIcon v-else class="h-5 w-5 text-gray-300" aria-label="No incluye almuerzo" />
            </template>

            <template #cell-transport="{ row }">
                <CheckCircleIcon v-if="row.hasTransport" class="h-5 w-5 text-primary" aria-label="Incluye transporte" />
                <XCircleIcon v-else class="h-5 w-5 text-gray-300" aria-label="No incluye transporte" />
            </template>

            <template #cell-status="{ row }">
                <BaseBadge :variant="statusVariant((row as Student).status)">{{ statusLabel((row as Student).status) }}</BaseBadge>
            </template>

            <template #actions="{ row }">
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="rounded-full p-2 text-accent transition hover:bg-accent/10"
                        aria-label="Editar estudiante"
                        @click="openEditModal(row as Student)"
                    >
                        <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        class="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar estudiante"
                        @click="askDelete(row as Student)"
                    >
                        <TrashIcon class="h-5 w-5" />
                    </button>
                </div>
            </template>
        </BaseTable>

        <EstudianteModal
            :open="editorOpen"
            :student="selectedStudent"
            @close="editorOpen = false"
            @saved="editorOpen = false"
        />

        <BaseModal :open="deleteModalOpen" size="sm" title="Confirmar eliminación" @close="deleteModalOpen = false">
            <p class="text-sm text-gray-600">¿Seguro que deseas eliminar a {{ selectedStudentName }}?</p>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <BaseButton variant="ghost" @click="deleteModalOpen = false">Cancelar</BaseButton>
                    <BaseButton variant="danger" @click="removeStudent">Eliminar</BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>
