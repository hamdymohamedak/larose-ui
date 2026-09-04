<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { monthMatrix, parseISODate, toISODate, weekdayLabels } from '../../Picker/utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    value?: string;
    locale?: string;
    minDate?: string;
    maxDate?: string;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  { locale: 'en' },
);

const emit = defineEmits<{
  'update:modelValue': [string];
  change: [string];
}>();

const current = computed(() => props.modelValue ?? props.value);
const parsed = computed(() => parseISODate(current.value));
const visibleYear = ref(parsed.value.year);
const visibleMonth = ref(parsed.value.month);

watch(parsed, (next) => {
  visibleYear.value = next.year;
  visibleMonth.value = next.month;
});

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(
    new Date(visibleYear.value, visibleMonth.value, 1),
  ),
);
const weeks = computed(() => monthMatrix(visibleYear.value, visibleMonth.value));
const weekdays = computed(() => weekdayLabels(props.locale));

function shiftMonth(delta: number) {
  const next = new Date(visibleYear.value, visibleMonth.value + delta, 1);
  visibleYear.value = next.getFullYear();
  visibleMonth.value = next.getMonth();
}

function isDisabled(day: number) {
  const iso = toISODate(visibleYear.value, visibleMonth.value, day);
  if (props.minDate && iso < props.minDate) return true;
  if (props.maxDate && iso > props.maxDate) return true;
  return false;
}

function select(day: number) {
  const iso = toISODate(visibleYear.value, visibleMonth.value, day);
  emit('update:modelValue', iso);
  emit('change', iso);
}
</script>

<template>
  <div :class="cn(styles.calendar, props.class)" :style="props.style">
    <div :class="styles.calendarHeader">
      <button
        type="button"
        :class="styles.calendarNav"
        aria-label="Previous month"
        @click="shiftMonth(-1)"
      >
        ‹
      </button>
      <span :class="styles.calendarTitle">{{ monthLabel }}</span>
      <button
        type="button"
        :class="styles.calendarNav"
        aria-label="Next month"
        @click="shiftMonth(1)"
      >
        ›
      </button>
    </div>
    <div :class="styles.weekdays" aria-hidden="true">
      <span v-for="label in weekdays" :key="label" :class="styles.weekday">{{ label }}</span>
    </div>
    <div v-for="(week, weekIndex) in weeks" :key="weekIndex" :class="styles.week">
      <template v-for="(day, dayIndex) in week" :key="`${weekIndex}-${dayIndex}`">
        <span v-if="day === null" :class="styles.dayButton" data-outside="true" />
        <button
          v-else
          type="button"
          :class="styles.dayButton"
          :data-selected="
            day === parsed.day && visibleMonth === parsed.month && visibleYear === parsed.year
              ? 'true'
              : undefined
          "
          :disabled="isDisabled(day)"
          @click="select(day)"
        >
          {{ day }}
        </button>
      </template>
    </div>
  </div>
</template>
