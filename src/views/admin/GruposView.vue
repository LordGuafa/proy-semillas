<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PencilSquareIcon, PlusIcon } from '@heroicons/vue/24/outline'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

type GroupRecord = { id: string; name: string; description: string; teacher: string; minAge: number; maxAge: number; capacity: number; studentsCount: number; status: 'active' | 'inactive' }
const storageKey = 'semillas-groups'
const groups = ref<GroupRecord[]>([{ id: 'grp-1', name: 'Arcoíris', description: 'Grupo de transición', teacher: 'Paula Jiménez', minAge: 4, maxAge: 5, capacity: 18, studentsCount: 14, status: 'active' }, { id: 'grp-2', name: 'Bosque', description: 'Grupo explorador', teacher: 'Luis Ramírez', minAge: 5, maxAge: 6, capacity: 20, studentsCount: 18, status: 'active' }, { id: 'grp-3', name: 'Semilla', description: 'Primer ciclo', teacher: 'Carolina Torres', minAge: 3, maxAge: 4, capacity: 16, studentsCount: 10, status: 'inactive' }])
const editorOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref<GroupRecord>({ id: '', name: '', description: '', teacher: '', minAge: 3, maxAge: 4, capacity: 20, studentsCount: 0, status: 'active' })
function persistGroups() { window.localStorage.setItem(storageKey, JSON.stringify(groups.value)) }
function loadGroups() { const savedGroups = window.localStorage.getItem(storageKey); if (savedGroups) groups.value = JSON.parse(savedGroups) as GroupRecord[] }
function openCreateModal() { editingId.value = null; form.value = { id: '', name: '', description: '', teacher: '', minAge: 3, maxAge: 4, capacity: 20, studentsCount: 0, status: 'active' }; editorOpen.value = true }
function openEditModal(group: GroupRecord) { editingId.value = group.id; form.value = { ...group }; editorOpen.value = true }
function saveGroup() { const payload = { ...form.value, id: editingId.value ?? `grp-${Date.now()}` }; groups.value = editingId.value ? groups.value.map((group) => (group.id === editingId.value ? payload : group)) : [payload, ...groups.value]; persistGroups(); editorOpen.value = false }
onMounted(() => { loadGroups() })
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1>Grupos</h1>
                <p class="mt-1 text-sm text-gray-500">Administra los grupos y su capacidad.</p>
            </div>
            <BaseButton :icon="PlusIcon" variant="primary" @click="openCreateModal">Nuevo Grupo</BaseButton>
        </div>
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <BaseCard v-for="group in groups" :key="group.id" :title="group.name" :subtitle="group.teacher">
                <div class="space-y-3 text-sm text-gray-600">
                    <p>{{ group.description }}</p>
                    <p><strong>Edades:</strong> {{ group.minAge }} a {{ group.maxAge }} años</p>
                    <p><strong>Estudiantes:</strong> {{ group.studentsCount }} / {{ group.capacity }}</p>
                    <BaseBadge :status="group.status === 'active' ? 'active' : 'inactive'" />
                </div><button type="button"
                    class="absolute right-4 top-4 rounded-full p-2 text-accent transition hover:bg-accent/10"
                    aria-label="Editar grupo" @click="openEditModal(group)">
                    <PencilSquareIcon class="h-5 w-5" />
                </button>
            </BaseCard>
        </div>
        <BaseModal :open="editorOpen" size="md" :title="editingId ? 'Editar grupo' : 'Nuevo grupo'"
            @close="editorOpen = false">
            <div class="grid gap-4 md:grid-cols-2">
                <BaseInput v-model="form.name" label="Nombre" required />
                <BaseInput v-model="form.teacher" label="Docente" required />
                <BaseInput v-model="form.minAge" label="Edad mínima" type="number" />
                <BaseInput v-model="form.maxAge" label="Edad máxima" type="number" />
                <BaseInput v-model="form.capacity" label="Capacidad máxima" type="number" /><label
                    class="space-y-2 text-sm font-medium text-gray-700"><span>Estado</span><select v-model="form.status"
                        class="panel-input">
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select></label><label
                    class="space-y-2 text-sm font-medium text-gray-700 md:col-span-2"><span>Descripción</span><textarea
                        v-model="form.description" rows="4" class="panel-input resize-none" /></label>
            </div><template #footer>
                <div class="flex justify-end gap-3">
                    <BaseButton variant="ghost" @click="editorOpen = false">Cancelar</BaseButton>
                    <BaseButton variant="primary" @click="saveGroup">Guardar</BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>