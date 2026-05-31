<script setup lang="ts">
import { computed } from "vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import type { Guardian } from "@/types/guardian";

const props = defineProps<{
  guardian: Guardian;
}>();

const emit = defineEmits<{
  (event: "edit", guardian: Guardian): void;
  (event: "delete", guardianId: number): void;
}>();

const guardianName = computed(() =>
  `${props.guardian.firstName} ${props.guardian.lastName}`.trim(),
);

function formatDate(dateValue?: Date) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CO");
}
</script>

<template>
  <BaseCard>
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-lg font-semibold text-primary">
              {{ guardianName }}
            </h3>
            <span class="text-sm text-accent">{{ guardian.kinship }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseBadge v-if="guardian.isMainGuardian" variant="active"
              >Acudiente principal</BaseBadge
            >
            <BaseBadge v-if="guardian.isPaymentResponsible" variant="pending"
              >Responsable de pago</BaseBadge
            >
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full p-2 text-accent transition hover:bg-accent/10"
            aria-label="Editar acudiente"
            @click="emit('edit', guardian)"
          >
            <PencilSquareIcon class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Eliminar acudiente"
            @click="emit('delete', guardian.id)"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Tipo y N.° documento
          </p>
          <p class="text-sm text-gray-900">
            {{ guardian.documentType }} · {{ guardian.documentNumber }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Fecha de nacimiento
          </p>
          <p class="text-sm text-gray-900">
            {{ formatDate(guardian.birthdate) }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">Teléfono</p>
          <p class="text-sm text-gray-900">{{ guardian.phone }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Correo electrónico
          </p>
          <p class="text-sm text-gray-900">{{ guardian.email }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">Ocupación</p>
          <p class="text-sm text-gray-900">{{ guardian.occupation }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Lugar de trabajo
          </p>
          <p class="text-sm text-gray-900">{{ guardian.workplace }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">Dirección</p>
          <p class="text-sm text-gray-900">{{ guardian.homeAddress }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Ciudad, Departamento
          </p>
          <p class="text-sm text-gray-900">
            {{ guardian.city }}, {{ guardian.department }}
          </p>
        </div>
        <div v-if="guardian.placeOfBirth" class="md:col-span-2">
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Lugar de nacimiento
          </p>
          <p class="text-sm text-gray-900">{{ guardian.placeOfBirth }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
