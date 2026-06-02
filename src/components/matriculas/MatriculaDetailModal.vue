<script setup lang="ts">
import { computed, watch } from "vue";
import { useEstudiantesStore } from "@/stores/estudiantesStore";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps<{
  open: boolean;
  matricula: any; // Tipo Inscripcion
}>();

const emit = defineEmits(["close"]);
const estStore = useEstudiantesStore();

// --- LÓGICA DE DATOS ---

const estudiante = computed(() => {
  if (!props.matricula?.idEstudiante) return null;
  return estStore.estudiantes.find((s) => s.id === props.matricula.idEstudiante);
});

const nombreEstudiante = computed(() => {
  if (!estudiante.value) return "Cargando datos...";
  // AJUSTADO: Usa firstname y lastname
  return `${estudiante.value.firstname ?? ""} ${estudiante.value.lastname ?? ""}`.trim() || "Sin nombre";
});

const acudientes = computed(() => {
  const id = props.matricula?.idEstudiante;
  return id ? (estStore.guardians[id] || []) : [];
});

const acudienteResponsable = computed(() => {
  const idAcudiente = props.matricula?.idAcudiente;
  return acudientes.value.find((g) => g.id === idAcudiente);
});

const guardianesCargados = computed(() => {
  const id = props.matricula?.idEstudiante;
  return id != null && estStore.guardians[id] !== undefined;
});

const observaciones = computed(() => {
  return props.matricula?.informacionForm?.observaciones_relevantes || "Sin observaciones registradas";
});

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.matricula?.idEstudiante) {
      await estStore.fetchGuardians(props.matricula.idEstudiante);
    }
  },
  { immediate: true }
);
</script>

<template>
  <BaseModal :open="open" title="Detalle de Matrícula" @close="emit('close')">
    <div class="space-y-6 p-2">

      <!-- Sección Estudiante -->
      <section class="rounded-xl border bg-gray-50 p-4 transition hover:bg-gray-100/50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Estudiante</span>
        </div>
        <p class="text-xl font-bold text-primary">{{ nombreEstudiante }}</p>
        <p class="text-sm text-gray-500">ID Sistema: {{ matricula?.idEstudiante }}</p>
      </section>

      <!-- Sección Acudiente Vinculado -->
      <section class="rounded-xl border bg-gray-50 p-4 transition hover:bg-gray-100/50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Acudiente Responsable</span>
        </div>

        <div v-if="acudienteResponsable" class="space-y-2">
          <p class="text-lg font-semibold text-gray-800">
            <!-- AJUSTADO: Usa firstName y lastName -->
            {{ acudienteResponsable.firstName ?? "" }} {{ acudienteResponsable.lastName ?? "" }}
          </p>
          <div class="grid grid-cols-1 gap-1 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-500">Teléfono:</span>
              <span>{{ acudienteResponsable.telefono || "No registrado" }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-500">Correo:</span>
              <span>{{ acudienteResponsable.correoElectronico || "No registrado" }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-500">Parentesco:</span>
              <span class="font-medium">{{ acudienteResponsable.parentesco || "—" }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="guardianesCargados" class="flex items-center gap-2 text-sm italic text-gray-400">
          Sin acudiente registrado
        </div>
        <div v-else class="flex items-center gap-2 text-sm italic text-gray-400">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          Cargando datos del acudiente...
        </div>
      </section>

      <!-- Sección Observaciones -->
      <section class="rounded-xl border bg-gray-50 p-4 transition hover:bg-gray-100/50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Observaciones</span>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {{ observaciones }}
        </p>
      </section>

    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">
          Cerrar detalle
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
