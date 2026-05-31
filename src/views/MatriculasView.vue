<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseDropdownMenu from "@/components/ui/BaseDropdownMenu.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSearchBar from "@/components/ui/BaseSearchBar.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import MatriculaDetailModal from "@/components/matriculas/MatriculaDetailModal.vue";
import { useMatriculasStore } from "@/stores/matriculasStore";
import type { Matricula, MatriculaStatus } from "@/types/inscripcion";
import {
  matriculaStatusLabel,
  matriculaStatusVariant,
} from "@/types/inscripcion";

const store = useMatriculasStore();
const detailOpen = ref(false);
const searchModel = computed({
  get: () => store.filters.search,
  set: (value: string) => {
    void fetchMatriculas({ search: value });
  },
});
const statusModel = computed({
  get: () => store.filters.estado,
  set: (value: string) => {
    void fetchMatriculas({ estado: value as MatriculaStatus | "" });
  },
});
const dateFromModel = computed({
  get: () => store.filters.fechaDesde,
  set: (value: string) => {
    void fetchMatriculas({ fechaDesde: value });
  },
});
const dateToModel = computed({
  get: () => store.filters.fechaHasta,
  set: (value: string) => {
    void fetchMatriculas({ fechaHasta: value });
  },
});
const pageModel = computed({
  get: () => store.pagination.page,
  set: (value: number) => {
    store.pagination.page = value;
    void fetchMatriculas();
  },
});

const columns = [
  { key: "id", label: "#" },
  { key: "aspirante", label: "Aspirante" },
  { key: "acudiente", label: "Acudiente" },
  { key: "submittedAt", label: "Fecha envío" },
  { key: "interviewDate", label: "Entrevista" },
  { key: "assignedTo", label: "Asignado a" },
  { key: "status", label: "Estado" },
];

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "En revisión", value: "EN_REVISION" },
  { label: "Entrevista", value: "ENTREVISTA" },
  { label: "Aprobada", value: "APROBADA" },
  { label: "Rechazada", value: "RECHAZADA" },
];

const cards = computed(() => [
  {
    label: "Total de solicitudes",
    value: store.pagination.total,
    status: "" as MatriculaStatus | "",
  },
  {
    label: "Pendientes",
    value: store.pendientesCount,
    status: "PENDIENTE" as MatriculaStatus,
  },
  {
    label: "En revisión",
    value: store.enRevisionCount,
    status: "EN_REVISION" as MatriculaStatus,
  },
  {
    label: "Aprobadas este mes",
    value: approvedThisMonth.value,
    status: "APROBADA" as MatriculaStatus,
  },
]);

const approvedThisMonth = computed(() => {
  const currentMonth = new Date();
  return store.matriculasFiltradas.filter((matricula) => {
    if (matricula.estado !== "APROBADA") return false;
    const submittedAt = new Date(matricula.fechaInscripcion);
    return (
      submittedAt.getMonth() === currentMonth.getMonth() &&
      submittedAt.getFullYear() === currentMonth.getFullYear()
    );
  }).length;
});

const subtitle = computed(() =>
  store.pendientesCount > 0
    ? `${store.pendientesCount} solicitudes pendientes de revisión`
    : "Todo al día",
);

function getStudentFullName(matricula: Matricula): string {
  const studentData = matricula.studentData ?? {};
  const firstName = String(
    studentData.firstname ?? studentData.firstName ?? studentData.name ?? "",
  );
  const lastName = String(studentData.lastname ?? studentData.lastName ?? "");
  const composed = `${firstName} ${lastName}`.trim();
  if (composed) return composed;
  const fallback = Object.values(studentData).find(
    (value) => typeof value === "string" && value.trim(),
  );
  return typeof fallback === "string" ? fallback : "Sin nombre";
}

function getGuardianName(matricula: Matricula): string {
  const guardianData = matricula.guardianData ?? {};
  const firstName = String(
    guardianData.firstname ??
      guardianData.firstName ??
      guardianData.name ??
      guardianData.nombre ??
      "",
  );
  const lastName = String(
    guardianData.lastname ??
      guardianData.lastName ??
      guardianData.apellidos ??
      "",
  );
  const composed = `${firstName} ${lastName}`.trim();
  if (composed) return composed;
  const fallback = Object.values(guardianData).find(
    (value) => typeof value === "string" && value.trim(),
  );
  return typeof fallback === "string" ? fallback : "—";
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("es-CO");
}

function initials(matricula: Matricula): string {
  const name = getStudentFullName(matricula);
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "M";
}

function rowClass(row: Record<string, any>): string {
  const matricula = row as Matricula;
  if (matricula.estado === "PENDIENTE")
    return "border-l-4 border-l-accent bg-accent/5";
  if (String(matricula.estado) === "RECHAZADA") return "text-gray-400";
  return "";
}

async function fetchMatriculas(
  params?: Partial<{
    search: string;
    estado: MatriculaStatus | "";
    fechaDesde: string;
    fechaHasta: string;
  }>,
) {
  await store.fetchInscripciones(params as Parameters<typeof store.fetchInscripciones>[0]);
}

async function openDetail(matriculaId: number) {
  await store.fetchInscripcionById(matriculaId);
  detailOpen.value = true;
}

function activateCardFilter(status: MatriculaStatus | "") {
  void fetchMatriculas({ estado: status });
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function exportCsv() {
  const rows = store.matriculasFiltradas;
  const header = [
    "id",
    "aspirante",
    "acudiente",
    "fecha_envio",
    "entrevista",
    "asignado_a",
    "estado",
  ];
  const lines = rows.map((matricula) =>
    [
      matricula.id,
      getStudentFullName(matricula),
      getGuardianName(matricula),
      matricula.fechaInscripcion,
      matricula.interviewDate ?? "",
      matricula.assignedTo ?? "",
      matricula.estado,
    ]
      .map(csvEscape)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "matriculas-filtradas.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openSearchableDetail(row: Record<string, any>) {
  void openDetail(Number((row as Matricula).id));
}

function rowActions(row: Record<string, any>) {
  const matricula = row as Matricula;
  return [
    {
      label: "Marcar en revisión",
      action: () => void store.updateStatus(matricula.id, "EN_REVISION"),
      disabled: matricula.status !== "PENDIENTE",
    },
    {
      label: "Agendar entrevista",
      action: () => void openDetail(matricula.id),
      disabled: !(
        matricula.status === "PENDIENTE" || matricula.status === "EN_REVISION"
      ),
    },
    {
      label: "Aprobar y crear estudiante",
      action: () => void openDetail(matricula.id),
      disabled: !(
        matricula.status === "ENTREVISTA" || matricula.status === "EN_REVISION"
      ),
    },
    {
      label: "Rechazar",
      action: () => void openDetail(matricula.id),
      disabled:
        matricula.status === "APROBADA" || matricula.status === "RECHAZADA",
      variant: "danger" as const,
    },
  ];
}

onMounted(() => {
  void fetchMatriculas();
});
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-primary">Matrículas</h1>
      <p class="text-sm text-accent">{{ subtitle }}</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <BaseCard
        v-for="card in cards"
        :key="card.label"
        class="h-auto cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
        @click="activateCardFilter(card.status)"
      >
        <div class="space-y-1">
          <p
            class="text-3xl font-bold text-primary"
            :class="
              card.label === 'Pendientes' && card.value > 0 ? 'text-accent' : ''
            "
          >
            {{ card.value }}
          </p>
          <p class="text-sm text-gray-500">{{ card.label }}</p>
        </div>
      </BaseCard>
    </div>

    <BaseCard>
      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
      >
        <div class="w-full xl:max-w-xl">
          <BaseSearchBar
            v-model="searchModel"
            placeholder="Buscar por nombre del aspirante"
          />
        </div>

        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:gap-4">
          <BaseSelect
            v-model="statusModel"
            label="Estado"
            :options="statusOptions"
          />
          <div class="flex items-end gap-3">
            <BaseInput v-model="dateFromModel" label="Desde" type="date" />
            <span class="pb-3 text-gray-400">—</span>
            <BaseInput v-model="dateToModel" label="Hasta" type="date" />
          </div>
          <BaseButton
            variant="ghost"
            :icon="ArrowDownTrayIcon"
            @click="exportCsv"
          >
            Exportar CSV
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseTable
      v-model:page="pageModel"
      :columns="columns"
      :rows="store.matriculasFiltradas"
      :loading="store.loading"
      :per-page="store.pagination.perPage"
      :total="store.pagination.total"
      empty-message="No hay matrículas para mostrar."
      actions-label="Acciones"
      :row-class="rowClass"
      @row-click="openSearchableDetail"
    >
      <template #cell-id="{ row }">
        <span class="w-16 text-sm text-gray-400">#{{ row.id }}</span>
      </template>

      <template #cell-aspirante="{ row }">
        <div class="flex items-center gap-3">
          <div
            v-if="row.photoURL"
            class="h-9 w-9 overflow-hidden rounded-full bg-primary/10"
          >
            <img
              :src="String(row.photoURL)"
              :alt="getStudentFullName(row as Matricula)"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          >
            {{ initials(row as Matricula) }}
          </div>
          <div>
            <p class="font-medium text-gray-900">
              {{ getStudentFullName(row as Matricula) }}
            </p>
          </div>
        </div>
      </template>

      <template #cell-acudiente="{ row }">
        <p class="text-sm text-gray-600">
          {{ getGuardianName(row as Matricula) }}
        </p>
      </template>

      <template #cell-submittedAt="{ row }">
        <p class="text-sm text-gray-500">
          {{ formatDate((row as Matricula).fechaInscripcion) }}
        </p>
      </template>

      <template #cell-interviewDate="{ row }">
        <p class="text-sm text-gray-500">
          {{ formatDate((row as Matricula).interviewDate) }}
        </p>
      </template>

      <template #cell-assignedTo="{ row }">
        <p v-if="(row as Matricula).assignedTo" class="text-sm text-gray-700">
          {{ (row as Matricula).assignedTo }}
        </p>
        <p v-else class="text-sm italic text-gray-400">Sin asignar</p>
      </template>

      <template #cell-status="{ row }">
        <BaseBadge :variant="matriculaStatusVariant[(row as Matricula).estado ?? 'PENDIENTE']">
          {{ matriculaStatusLabel[(row as Matricula).estado ?? 'PENDIENTE'] }}
        </BaseBadge>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full p-2 text-primary transition hover:bg-primary/10"
            aria-label="Ver detalle"
            @click.stop="openSearchableDetail(row as Matricula)"
          >
            <EyeIcon class="h-5 w-5" />
          </button>
          <BaseDropdownMenu :items="rowActions(row)">
            <template #trigger>
              <span class="sr-only">Más acciones</span>
              <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
            </template>
          </BaseDropdownMenu>
        </div>
      </template>
    </BaseTable>

    <MatriculaDetailModal
      :open="detailOpen"
      :matricula="store.selected"
      @close="
        detailOpen = false;
        store.selected = null;
      "
    />
  </div>
</template>
