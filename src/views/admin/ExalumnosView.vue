<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { CheckCircleIcon, EyeIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSearchBar from '@/components/ui/BaseSearchBar.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import EstudianteModal from '@/components/estudiantes/EstudianteModal.vue'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import type Student from '@/types/student'
import { studentStatusLabel, studentStatusVariant } from '@/types/student'

const estudiantesStore = useEstudiantesStore()
const searchTerm = ref('')
const reasonFilter = ref('all')
const page = ref(1)
const pageSize = 8
const viewerOpen = ref(false)
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

const reasonOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Retirado', value: 'RETIRADO' },
  { label: 'Egresado', value: 'EGRESADO' },
]

const filteredStudents = computed(() =>
  estudiantesStore.exalumnos.filter((student) => {
    const normalizedQuery = searchTerm.value.trim().toLowerCase()
    const matchesQuery =
      !normalizedQuery ||
      `${student.firstname} ${student.lastname}`.toLowerCase().includes(normalizedQuery)
    const matchesReason = reasonFilter.value === 'all' || student.status === reasonFilter.value
    return matchesQuery && matchesReason
  }),
)

const visibleStudents = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredStudents.value.slice(start, start + pageSize)
})

function statusVariant(status: Student['status']) {
  return studentStatusVariant[status]
}

function statusLabel(status: Student['status']) {
  return studentStatusLabel[status]
}

watch([searchTerm, reasonFilter], () => {
  page.value = 1
})

function getInitials(student: Student) {
  return `${student.firstname?.[0] ?? ''}${student.lastname?.[0] ?? ''}`.toUpperCase() || 'ES'
}

function openViewer(student: Student) {
  selectedStudent.value = student
  viewerOpen.value = true
}

onMounted(() => {
  estudiantesStore.fetchEstudiantes()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1>Exalumnos</h1>
        <p class="mt-1 text-sm text-gray-500">Consulta el historial de estudiantes retirados o egresados.</p>
      </div>
    </div>

    <BaseCard>
      <div class="grid gap-4 lg:grid-cols-[1fr_220px]">
        <BaseSearchBar v-model="searchTerm" placeholder="Buscar exalumno" />
        <BaseSelect v-model="reasonFilter" label="Motivo de salida" :options="reasonOptions" />
      </div>
    </BaseCard>

    <BaseTable
      v-model:page="page"
      :columns="columns"
      :rows="visibleStudents"
      :loading="estudiantesStore.loading"
      :per-page="pageSize"
      :total="filteredStudents.length"
      empty-message="No hay exalumnos para mostrar."
      actions-label="Acciones"
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
        <CheckCircleIcon v-if="row.hasLunch" class="h-5 w-5 text-primary" />
        <XCircleIcon v-else class="h-5 w-5 text-gray-300" />
      </template>

      <template #cell-transport="{ row }">
        <CheckCircleIcon v-if="row.hasTransport" class="h-5 w-5 text-primary" />
        <XCircleIcon v-else class="h-5 w-5 text-gray-300" />
      </template>

      <template #cell-status="{ row }">
          <BaseBadge :variant="statusVariant((row as Student).status)">{{ statusLabel((row as Student).status) }}</BaseBadge>
      </template>

      <template #actions="{ row }">
        <button
          type="button"
          class="rounded-full p-2 text-accent transition hover:bg-accent/10"
          aria-label="Ver detalle"
          @click="openViewer(row as Student)"
        >
          <EyeIcon class="h-5 w-5" />
        </button>
      </template>
    </BaseTable>

    <EstudianteModal
      :open="viewerOpen"
      :student="selectedStudent"
      readonly
      @close="viewerOpen = false"
    />
  </div>
</template>
