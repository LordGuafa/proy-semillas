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
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import type { Matricula, MatriculaStatus } from "@/types/inscripcion";
import {
  matriculaStatusLabel,
  matriculaStatusVariant,
} from "@/types/inscripcion";

const store = useMatriculasStore();
const estStore = useEstudiantesStore();
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
  { key: "telefono", label: "Teléfono" },
  { key: "direccion", label: "Dirección" },
  { key: "submittedAt", label: "Fecha envío" },
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
  if (!matricula.idEstudiante) return "Sin estudiante";
  const s = estStore.estudiantes.find(
    (e) => e.id === matricula.idEstudiante,
  );
  if (!s) return "Cargando...";
  return `${s.firstname ?? ""} ${s.lastname ?? ""}`.trim() || "Sin nombre";
}

function getGuardianName(matricula: Matricula): string {
  if (!matricula.idAcudiente || !matricula.idEstudiante) return "—";
  const guardians = estStore.guardians[matricula.idEstudiante];
  if (!guardians) return "—";
  const g = guardians.find((g) => g.id === matricula.idAcudiente);
  if (!g) return "—";
  return `${g.firstName ?? g.primerNombre ?? ""} ${g.lastName ?? g.primerApellido ?? ""}`.trim() || "—";
}

function getGuardianPhone(matricula: Matricula): string {
  const form = matricula.informacionForm;
  if (!form) return "—";
  const phone = form.acudiente_telefono_fijo ?? form.responsable_telefono_fijo ?? form.telefonoAcudiente;
  return phone ? String(phone) : "—";
}

function getStudentAddress(matricula: Matricula): string {
  const form = matricula.informacionForm;
  if (!form) return "—";
  const address = form.barrio ?? form.direccion ?? form.direccionResidencia;
  return address ? String(address) : "—";
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
  if (String(matricula.status) === "RECHAZADA") return "text-gray-400";
  return "";
}

async function loadGuardiansForTable() {
  const ids = [...new Set(store.inscripciones.map((i) => i.idEstudiante).filter(Boolean))];
  await Promise.all(ids.map((id) => estStore.fetchGuardians(id)));
}

async function fetchMatriculas(
  params?: Partial<{
    search: string;
    estado: MatriculaStatus | "";
    fechaDesde: string;
    fechaHasta: string;
  }>,
) {
  await store.fetchInscriptions(params as Parameters<typeof store.fetchInscriptions>[0]);
  if (estStore.estudiantes.length === 0) {
    await estStore.fetchEstudiantes();
  }
  await loadGuardiansForTable();
}

async function openDetail(matriculaId: number) {
  const matricula = store.inscripciones.find(m => m.id === matriculaId);
  if (matricula) {
    store.selected = matricula;
    if (estStore.estudiantes.length === 0) {
      await estStore.fetchEstudiantes();
    }
    detailOpen.value = true;
  }
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
    "telefono",
    "direccion",
    "fecha_envio",
    "estado",
  ];
  const lines = rows.map((matricula) =>
    [
      matricula.id,
      getStudentFullName(matricula),
      getGuardianName(matricula),
      getGuardianPhone(matricula),
      getStudentAddress(matricula),
      matricula.fechaInscripcion,
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
    // {
    //   label: "Marcar en revisión",
    //   action: () => void store.updateStatus(matricula.id, "EN_REVISION"),
    //   disabled: matricula.estado !== "PENDIENTE",
    // },
    {
      label: "Agendar entrevista",
      action: () => void openDetail(matricula.id),
      disabled: !(
        matricula.estado === "PENDIENTE" || matricula.status === "EN_REVISION"
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
        matricula.estado === "APROBADA" || matricula.status === "RECHAZADA",
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

      <template #cell-telefono="{ row }">
        <p class="text-sm text-gray-600">
          {{ getGuardianPhone(row as Matricula) }}
        </p>
      </template>

      <template #cell-direccion="{ row }">
        <p class="text-sm text-gray-600">
          {{ getStudentAddress(row as Matricula) }}
        </p>
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
