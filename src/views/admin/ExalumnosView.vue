<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSearchBar from '@/components/ui/BaseSearchBar.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useEstudiantesStore } from '@/stores/estudiantesStore'

const estudiantesStore = useEstudiantesStore()
const searchTerm = ref('')
const graduationYear = ref('all')
const columns = [{ key: 'photo', label: 'Foto' }, { key: 'fullName', label: 'Nombre completo' }, { key: 'age', label: 'Edad' }, { key: 'group', label: 'Grupo' }, { key: 'graduationYear', label: 'Año de egreso' }, { key: 'status', label: 'Estado' }]
const graduatedStudents = computed(() => estudiantesStore.estudiantes.filter((student) => student.status === 'graduated'))
const yearOptions = computed(() => Array.from(new Set(graduatedStudents.value.map((student) => student.graduationYear).filter((value): value is number => Boolean(value)))).sort((a, b) => b - a))
const visibleStudents = computed(() => graduatedStudents.value.filter((student) => student.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) && (graduationYear.value === 'all' || String(student.graduationYear) === graduationYear.value)))
function downloadCSV() { const header = ['Nombre', 'Edad', 'Grupo', 'Año de egreso', 'Estado']; const rows = visibleStudents.value.map((student) => [student.fullName, student.age, student.group, student.graduationYear ?? '', student.status]); const csvContent = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'exalumnos.csv'; link.click(); URL.revokeObjectURL(url) }
onMounted(() => { estudiantesStore.fetchEstudiantes() })
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1>Exalumnos</h1>
                <p class="mt-1 text-sm text-gray-500">Listado de estudiantes egresados.</p>
            </div>
            <BaseButton variant="accent" @click="downloadCSV">Exportar CSV</BaseButton>
        </div>
        <BaseCard>
            <div class="grid gap-4 lg:grid-cols-[1fr_220px]">
                <BaseSearchBar v-model="searchTerm" placeholder="Buscar exalumno" @search="searchTerm = $event" /><label
                    class="space-y-2 text-sm font-medium text-gray-700"><span>Año de egreso</span><select
                        v-model="graduationYear" class="panel-input">
                        <option value="all">Todos</option>
                        <option v-for="year in yearOptions" :key="year" :value="String(year)">{{ year }}</option>
                    </select></label>
            </div>
        </BaseCard>
        <BaseTable :columns="columns" :rows="visibleStudents" :loading="estudiantesStore.loading"
            empty-message="No hay exalumnos para mostrar."><template #cell-photo="{ row }"><img
                    :src="String(row.photoUrl || 'https://placehold.co/80x80?text=EG')" :alt="String(row.fullName)"
                    class="h-10 w-10 rounded-full object-cover" /></template><template #cell-status="{ row }">
                <BaseBadge :status="row.status" />
            </template></BaseTable>
    </div>
</template>