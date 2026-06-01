<script setup lang="ts">
import { computed } from "vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { nombreCompleto } from "@/types/persona";
import type { Guardian } from "@/types/guardian";

const props = defineProps<{
  guardian: Guardian;
}>();

const emit = defineEmits<{
  (event: "edit", guardian: Guardian): void;
  (event: "delete", guardianId: number): void;
}>();

const guardianName = computed(() =>
  nombreCompleto({
    primerNombre: props.guardian.primerNombre ?? props.guardian.firstName ?? "",
    segundoNombre: props.guardian.segundoNombre,
    primerApellido: props.guardian.primerApellido ?? props.guardian.lastName ?? "",
    segundoApellido: props.guardian.segundoApellido,
  }),
);

const guardianDocument = computed(() =>
  `${props.guardian.documentType ?? props.guardian.tipoDocumento ?? ""} · ${
    props.guardian.documentNumber ?? props.guardian.documentoIdentidad ?? "—"
  }`,
);

const guardianWorkplace = computed(
  () => props.guardian.workplace ?? props.guardian.nombreEmpresaTrabajo ?? "—",
);

const guardianAddress = computed(
  () => props.guardian.homeAddress ?? props.guardian.direccionCasa ?? "—",
);

const guardianCityDepartment = computed(() => {
  const city = props.guardian.city ?? props.guardian.ciudadCasa ?? "";
  const department = props.guardian.department ?? props.guardian.departamentoCasa ?? "";
  const value = [city, department].filter(Boolean).join(", ");
  return value || "—";
});

const guardianOccupation = computed(
  () => props.guardian.occupation ?? props.guardian.ocupacion ?? "—",
);

const guardianPhone = computed(
  () => props.guardian.phone ?? props.guardian.telefono ?? "—",
);

const guardianEmail = computed(
  () => props.guardian.email ?? props.guardian.correoElectronico ?? "—",
);

const guardianKinship = computed(
  () => props.guardian.kinship ?? props.guardian.parentesco ?? "—",
);

const guardianIsMain = computed(
  () => props.guardian.isMainGuardian ?? props.guardian.esPrincipal ?? false,
);

const guardianIsPaymentResponsible = computed(
  () =>
    props.guardian.isPaymentResponsible ??
    props.guardian.esResponsablePago ??
    false,
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
        <div class="space-y-2">
          <div class="space-y-0.5">
            <h3 class="text-lg font-semibold text-primary">
              {{ guardianName || "Sin nombre" }}
            </h3>
            <p class="text-sm text-accent">{{ guardianKinship }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseBadge v-if="guardianIsMain" variant="active"
              >Acudiente principal</BaseBadge
            >
            <BaseBadge v-if="guardianIsPaymentResponsible" variant="pending"
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
            {{ guardianDocument }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Teléfono
          </p>
          <p class="text-sm text-gray-900">
            {{ guardianPhone }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Correo electrónico
          </p>
          <p class="text-sm text-gray-900">{{ guardianEmail }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">Ocupación</p>
          <p class="text-sm text-gray-900">{{ guardianOccupation }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Lugar de trabajo
          </p>
          <p class="text-sm text-gray-900">{{ guardianWorkplace }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Dirección de casa
          </p>
          <p class="text-sm text-gray-900">{{ guardianAddress }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Ciudad, Departamento
          </p>
          <p class="text-sm text-gray-900">{{ guardianCityDepartment }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            Fecha de nacimiento
          </p>
          <p class="text-sm text-gray-900">{{ formatDate(guardian.birthdate) }}</p>
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
