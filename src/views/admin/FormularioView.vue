<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Bars3Icon, PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { useFormularioStore, type FormField } from "@/stores/formularioStore";

const formularioStore = useFormularioStore();
const editableFields = ref<FormField[]>([]);
const draggingIndex = ref<number | null>(null);
const specialFields = ref([
  { id: "photo", label: "Foto", visible: true },
  { id: "interviewCalendar", label: "Calendario de entrevista", visible: true },
]);
function cloneFields() {
  editableFields.value = formularioStore.campos.map((field) => ({ ...field }));
}
function addField() {
  editableFields.value.push({
    id: `campo-${Date.now()}`,
    label: "Nuevo campo",
    type: "text",
    required: false,
    visible: true,
    order: editableFields.value.length + 1,
  });
}
function removeField(index: number) {
  editableFields.value.splice(index, 1);
  reorderFields();
}
function reorderFields() {
  editableFields.value = editableFields.value.map((field, index) => ({
    ...field,
    order: index + 1,
  }));
}
function startDrag(index: number) {
  draggingIndex.value = index;
}
function dropField(index: number) {
  if (draggingIndex.value === null || draggingIndex.value === index) return;
  const movedField = editableFields.value.splice(draggingIndex.value, 1)[0];
  if (!movedField) return;
  editableFields.value.splice(index, 0, movedField);
  reorderFields();
  draggingIndex.value = null;
}
async function saveChanges() {
  reorderFields();
  await formularioStore.saveCampos(editableFields.value);
}
onMounted(async () => {
  await formularioStore.fetchCampos();
  cloneFields();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1>Formulario</h1>
        <p class="mt-1 text-sm text-gray-500">
          Configura los campos visibles del formulario público.
        </p>
      </div>
      <BaseButton :icon="PlusIcon" variant="primary" @click="addField"
        >Añadir campo</BaseButton
      >
    </div>
    <div class="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <BaseCard title="Campos configurables">
        <div class="space-y-4">
          <article
            v-for="(field, index) in editableFields"
            :key="field.id"
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            draggable="true"
            @dragstart="startDrag(index)"
            @dragover.prevent
            @drop.prevent="dropField(index)"
          >
            <div class="flex items-start gap-3">
              <button
                type="button"
                class="mt-1 cursor-grab text-gray-400"
                aria-label="Reordenar campo"
              >
                <Bars3Icon class="h-5 w-5" />
              </button>
              <div class="flex-1 space-y-4">
                <input
                  v-model="field.label"
                  class="panel-input"
                  aria-label="Etiqueta del campo"
                />
                <div class="grid gap-3 md:grid-cols-3">
                  <label class="space-y-2 text-sm font-medium text-gray-700"
                    ><span>Tipo</span
                    ><select v-model="field.type" class="panel-input">
                      <option value="text">Text</option>
                      <option value="select">Select</option>
                      <option value="date">Date</option>
                      <option value="number">Number</option>
                    </select></label
                  ><label
                    class="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700"
                    ><input
                      v-model="field.required"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />Requerido</label
                  ><label
                    class="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700"
                    ><input
                      v-model="field.visible"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />Visible</label
                  >
                </div>
              </div>
              <button
                type="button"
                class="rounded-full p-2 text-red-500 transition hover:bg-red-50"
                aria-label="Eliminar campo"
                @click="removeField(index)"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </article>
        </div>
      </BaseCard>
      <BaseCard title="Opciones especiales">
        <div class="space-y-4">
          <label
            v-for="field in specialFields"
            :key="field.id"
            class="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700"
            ><span>{{ field.label }}</span
            ><input
              v-model="field.visible"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          /></label>
        </div>
      </BaseCard>
    </div>
    <div class="flex justify-end">
      <BaseButton variant="primary" @click="saveChanges"
        >Guardar cambios</BaseButton
      >
    </div>
  </div>
</template>
