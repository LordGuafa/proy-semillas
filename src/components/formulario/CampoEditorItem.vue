<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Bars3Icon, PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import type { Campo, FormularioTipo } from "@/types/formulario";

const props = defineProps<{
  campo: Campo;
  fijo: boolean;
  tipo: FormularioTipo;
}>();

const emit = defineEmits<{
  (event: "update:campo", value: Campo): void;
  (event: "delete"): void;
}>();

const labelEditing = ref(false);
const labelDraft = ref(props.campo.label);
const optionsModalOpen = ref(false);
const optionsDraft = ref<string[]>([]);

const typeOptions = [
  { label: "Texto", value: "text" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Selección", value: "select" },
  { label: "Sí/No", value: "boolean" },
  { label: "Área de texto", value: "textarea" },
];

const fixedBadge = computed(() =>
  props.fijo ? "Campo fijo" : "Campo editable",
);

watch(
  () => props.campo.label,
  (nextValue) => {
    labelDraft.value = nextValue;
  },
);

watch(
  () => props.campo.options,
  (nextValue) => {
    if (!optionsModalOpen.value) return;
    optionsDraft.value = [...(nextValue ?? [])];
  },
);

function emitChange(changes: Partial<Campo>) {
  emit("update:campo", { ...props.campo, ...changes });
}

function startLabelEdit() {
  if (props.fijo) return;
  labelEditing.value = true;
}

function saveLabel() {
  const nextLabel = labelDraft.value.trim();
  if (!nextLabel) {
    labelDraft.value = props.campo.label;
    labelEditing.value = false;
    return;
  }
  emitChange({ label: nextLabel });
  labelEditing.value = false;
}

function cancelLabelEdit() {
  labelDraft.value = props.campo.label;
  labelEditing.value = false;
}

function updateType(value: string) {
  const nextType = value as Campo["type"];
  emitChange({
    type: nextType,
    options: nextType === "select" ? (props.campo.options ?? []) : undefined,
  });
}

function openOptionsModal() {
  optionsDraft.value = [...(props.campo.options ?? [""])];
  optionsModalOpen.value = true;
}

function addOption() {
  optionsDraft.value.push("");
}

function removeOption(index: number) {
  optionsDraft.value.splice(index, 1);
  if (!optionsDraft.value.length) optionsDraft.value.push("");
}

function saveOptions() {
  const cleanedOptions = optionsDraft.value
    .map((option) => option.trim())
    .filter(Boolean);
  emitChange({ options: cleanedOptions });
  optionsModalOpen.value = false;
}

function toggleVisible() {
  emitChange({ visible: !props.campo.visible });
}
</script>

<template>
  <article
    class="rounded-2xl border p-4 shadow-sm transition"
    :class="
      fijo
        ? 'border-primary/10 bg-primary/5'
        : 'border-gray-100 bg-white hover:border-primary/20'
    "
  >
    <div class="flex items-start gap-3">
      <div
        v-if="!fijo"
        class="campo-handle mt-1 flex cursor-grab items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
        aria-label="Reordenar campo"
      >
        <Bars3Icon class="h-5 w-5" />
      </div>
      <div
        v-else
        class="mt-1 flex items-center justify-center rounded-full text-primary"
      >
        <Bars3Icon class="h-5 w-5 opacity-40" />
      </div>

      <div class="min-w-0 flex-1 space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-2">
            <button
              v-if="!labelEditing && !fijo"
              type="button"
              class="w-full rounded-lg text-left text-base font-semibold text-gray-900 transition hover:bg-gray-50"
              @click="startLabelEdit"
            >
              {{ campo.label }}
            </button>
            <div v-else-if="labelEditing" class="space-y-2">
              <input
                v-model="labelDraft"
                type="text"
                class="panel-input"
                placeholder="Etiqueta del campo"
                @blur="saveLabel"
                @keyup.enter="saveLabel"
                @keyup.escape="cancelLabelEdit"
              />
              <div class="flex gap-2">
                <BaseButton variant="ghost" size="sm" @click="cancelLabelEdit"
                  >Cancelar</BaseButton
                >
                <BaseButton variant="primary" size="sm" @click="saveLabel"
                  >Guardar</BaseButton
                >
              </div>
            </div>
            <div v-else class="space-y-2">
              <p class="text-base font-semibold text-gray-900">
                {{ campo.label }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <BaseBadge variant="inactive">{{
                fijo ? fixedBadge : "Campo editable"
              }}</BaseBadge>
              <BaseBadge v-if="campo.visible" variant="active"
                >Visible</BaseBadge
              >
              <BaseBadge v-else variant="inactive">Oculto</BaseBadge>
            </div>
          </div>

          <button
            v-if="!fijo"
            type="button"
            class="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Eliminar campo"
            @click="emit('delete')"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>

        <div
          v-if="!fijo"
          class="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"
        >
          <BaseSelect
            :model-value="campo.type"
            label="Tipo de campo"
            :options="typeOptions"
            variant="chip"
            @update:modelValue="updateType"
          />
          <button
            v-if="campo.type === 'select'"
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="openOptionsModal"
          >
            Opciones...
          </button>
          <label
            class="flex items-center justify-between gap-3 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
          >
            <span>Requerido</span>
            <button
              type="button"
              role="switch"
              :aria-checked="campo.required"
              aria-label="Campo requerido"
              class="relative h-6 w-11 rounded-full transition"
              :class="campo.required ? 'bg-primary' : 'bg-gray-300'"
              @click="emitChange({ required: !campo.required })"
            >
              <span
                class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                :class="campo.required ? 'left-5' : 'left-0.5'"
              />
            </button>
          </label>
        </div>

        <div
          v-else
          class="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3"
        >
          <div>
            <p class="text-sm font-medium text-primary">Campo fijo</p>
            <p class="text-xs text-gray-500">
              Solo puedes activar o desactivar su visibilidad.
            </p>
          </div>
          <label
            class="flex items-center gap-3 text-sm font-medium text-gray-700"
          >
            <span>Visible</span>
            <button
              type="button"
              role="switch"
              :aria-checked="campo.visible"
              aria-label="Visible"
              class="relative h-6 w-11 rounded-full transition"
              :class="campo.visible ? 'bg-primary' : 'bg-gray-300'"
              @click="toggleVisible"
            >
              <span
                class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                :class="campo.visible ? 'left-5' : 'left-0.5'"
              />
            </button>
          </label>
        </div>
      </div>
    </div>

    <BaseModal
      :open="optionsModalOpen"
      size="md"
      title="Opciones del campo"
      z-index-class="z-[70]"
      @close="optionsModalOpen = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Gestiona las opciones que verá el acudiente al diligenciar este campo.
        </p>
        <div class="space-y-3">
          <div
            v-for="(option, index) in optionsDraft"
            :key="`${campo.id}-option-${index}`"
            class="flex items-center gap-3"
          >
            <input
              v-model="optionsDraft[index]"
              type="text"
              class="panel-input flex-1"
              :placeholder="`Opción ${index + 1}`"
            />
            <button
              type="button"
              class="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Eliminar opción"
              @click="removeOption(index)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
        <BaseButton variant="ghost" :icon="PlusIcon" @click="addOption"
          >Añadir opción</BaseButton
        >
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="optionsModalOpen = false"
            >Cancelar</BaseButton
          >
          <BaseButton variant="primary" @click="saveOptions"
            >Guardar opciones</BaseButton
          >
        </div>
      </template>
    </BaseModal>
  </article>
</template>
