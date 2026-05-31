<script setup lang="ts">
import { computed } from 'vue'

type TableColumn = { key: string; label: string; sortable?: boolean }
const props = withDefaults(defineProps<{ columns: TableColumn[]; rows: Array<Record<string, any>>; loading?: boolean; emptyMessage?: string; page?: number; perPage?: number; total?: number; actionsLabel?: string; rowClass?: string | ((row: Record<string, any>) => string); rowIdPrefix?: string }>(), { loading: false, emptyMessage: 'No hay datos disponibles.', page: 1, perPage: 10, total: 0, actionsLabel: 'Acciones', rowIdPrefix: 'row' })
const emit = defineEmits<{
    (event: 'update:page', value: number): void
    (event: 'row-click', row: Record<string, any>): void
}>()
const totalPages = computed(() => Math.max(1, Math.ceil((props.total || props.rows.length) / (props.perPage || 1))))
function goToPage(nextPage: number) { if (nextPage < 1 || nextPage > totalPages.value) return; emit('update:page', nextPage) }
function formatValue(value: unknown): string { if (value === null || value === undefined || value === '') return '—'; if (value instanceof Date) return value.toLocaleDateString('es-CO'); if (typeof value === 'object') return JSON.stringify(value); return String(value) }
function resolveRowClass(row: Record<string, any>): string {
    if (!props.rowClass) return ''
    return typeof props.rowClass === 'function' ? props.rowClass(row) : props.rowClass
}

function resolveRowId(row: Record<string, any>, rowIndex: number): string {
    return `${props.rowIdPrefix}-${String(row.id ?? rowIndex)}`
}
</script>

<template>
    <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100" role="table">
                <thead class="bg-primary text-white">
                    <tr>
                        <th v-for="column in columns" :key="column.key" scope="col"
                            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{{ column.label }}
                        </th>
                        <th v-if="$slots.actions" scope="col"
                            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{{ actionsLabel }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-if="loading">
                        <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-gray-500">Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="!rows.length">
                        <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-gray-500">{{
                            emptyMessage }}</td>
                    </tr>
                    <tr v-for="(row, rowIndex) in rows" :key="String(row.id ?? rowIndex)"
                        :id="resolveRowId(row, rowIndex)"
                        class="odd:bg-white even:bg-gray-50 hover:bg-primary/5 cursor-pointer transition"
                        :class="resolveRowClass(row)"
                        role="button"
                        tabindex="0"
                        @click="$emit('row-click', row)"
                        @keydown.enter.prevent="$emit('row-click', row)"
                        @keydown.space.prevent="$emit('row-click', row)">
                        <td v-for="column in columns" :key="column.key" class="px-4 py-4 text-sm text-gray-700">
                            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">{{
                                formatValue(row[column.key]) }}</slot>
                        </td>
                        <td v-if="$slots.actions" class="px-4 py-4 text-sm text-gray-700">
                            <slot name="actions" :row="row" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
            <p>Página {{ page }} de {{ totalPages }}</p>
            <div class="flex items-center gap-2">
                <button type="button"
                    class="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="page <= 1" @click="goToPage(page - 1)">Anterior</button>
                <button type="button"
                    class="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="page >= totalPages" @click="goToPage(page + 1)">Siguiente</button>
            </div>
        </div>
    </div>
</template>