<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{ modelValue: Date | null; disabledDates?: Date[] }>(),
  { disabledDates: () => [] },
);
const emit = defineEmits<{
  (event: "update:modelValue", value: Date | null): void;
}>();
const currentMonth = ref(
  props.modelValue ? new Date(props.modelValue) : new Date(),
);
watch(
  () => props.modelValue,
  (nextValue) => {
    if (nextValue) currentMonth.value = new Date(nextValue);
  },
);
const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const normalize = (date: Date) => date.toISOString().split("T")[0];
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
const isDisabled = (date: Date) =>
  isWeekend(date) ||
  props.disabledDates.some(
    (disabledDate) => normalize(disabledDate) === normalize(date),
  );
const monthDays = computed(() => {
  const monthStart = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    1,
  );
  const monthEnd = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    0,
  );
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells: Array<Date | null> = [];
  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - firstWeekday + 1;
    cells.push(
      dayNumber < 1 || dayNumber > daysInMonth
        ? null
        : new Date(
            currentMonth.value.getFullYear(),
            currentMonth.value.getMonth(),
            dayNumber,
          ),
    );
  }
  return cells;
});
const selectedDay = computed(() =>
  props.modelValue ? normalize(props.modelValue) : "",
);
const today = normalize(new Date());
function selectDate(date: Date) {
  if (!isDisabled(date)) emit("update:modelValue", date);
}
function previousMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1,
  );
}
function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1,
  );
}
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <button
        type="button"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50"
        @click="previousMonth"
      >
        Mes anterior
      </button>
      <h3 class="text-base font-semibold text-primary">
        {{
          currentMonth.toLocaleDateString("es-CO", {
            month: "long",
            year: "numeric",
          })
        }}
      </h3>
      <button
        type="button"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50"
        @click="nextMonth"
      >
        Mes siguiente
      </button>
    </div>
    <div
      class="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
    >
      <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
    </div>
      <div class="mt-3 grid grid-cols-7 gap-2">
        <div v-for="(day, index) in monthDays" :key="index" class="aspect-square">
          <button
            v-if="day"
            type="button"
            class="flex h-full w-full items-center justify-center rounded-full text-sm transition"
            :class="[
              normalize(day) === selectedDay
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary/10',
              normalize(day) === today ? 'ring-2 ring-primary ring-offset-2' : '',
              isDisabled(day)
                ? 'cursor-not-allowed opacity-40 hover:bg-white'
                : '',
            ]"
            :disabled="isDisabled(day)"
            :aria-disabled="isDisabled(day) ? 'true' : 'false'"
            :aria-label="`día ${day.getDate()} de ${currentMonth.toLocaleDateString('es-CO', { month: 'long' })}`"
            @click="selectDate(day)"
          >
            {{ day.getDate() }}
          </button>
          <div v-else aria-hidden="true" class="h-full w-full" />
        </div>
      </div>
  </div>
</template>
