<script setup lang="ts">
import { computed, useId } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { fieldIdFromLabel } from '../../data-entry/utils';
import type {
  DateTimePickerMode,
  DateTimePickerStyle,
  DateTimeValue,
  PickerColumn,
  PickerValue,
} from '../../Picker/types';
import { resolvePickerChrome } from '../../Picker/chrome';
import {
  buildAmPmOptions,
  buildCountdownHourOptions,
  buildDayOptions,
  buildHourOptions12,
  buildHourOptions24,
  buildMinuteOptions,
  buildMonthOptions,
  buildYearOptions,
  formatDateTimeLabel,
  from12Hour,
  parseISODate,
  parseTime24,
  resolveAutomaticPickerStyle,
  snapMinuteToInterval,
  to12Hour,
  toISODate,
  toTime24,
} from '../../Picker/utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
import { cn } from '../../utils/cn';
import FieldShell from '../FieldShell/FieldShell.vue';
import Popover from '../Popover/Popover.vue';
import CalendarGrid from './CalendarGrid.vue';
import WheelPicker from './WheelPicker.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: DateTimeValue;
    value?: DateTimeValue;
    mode?: DateTimePickerMode;
    appearance?: DateTimePickerStyle;
    style?: DateTimePickerStyle | Record<string, string | number>;
    label?: string;
    hint?: string;
    error?: string | null;
    state?: UIState;
    loading?: boolean;
    disabled?: boolean;
    inputSize?: Size;
    locale?: string;
    minuteInterval?: number;
    use12Hour?: boolean;
    minDate?: string;
    maxDate?: string;
    yearRange?: { start: number; end: number };
    class?: string;
  }>(),
  {
    modelValue: () => ({}),
    mode: 'date',
    error: null,
    loading: false,
    disabled: false,
    locale: 'en',
    minuteInterval: 1,
    yearRange: () => ({
      start: new Date().getFullYear() - 5,
      end: new Date().getFullYear() + 5,
    }),
  },
);

const emit = defineEmits<{
  'update:modelValue': [DateTimeValue];
  change: [DateTimeValue];
}>();

const current = computed(() => props.modelValue ?? props.value ?? {});
const use12 = computed(() => props.use12Hour ?? props.locale.startsWith('en'));
const chrome = computed(() =>
  resolvePickerChrome(
    props.appearance,
    props.style as DateTimePickerStyle | Record<string, string | number> | undefined,
    'automatic',
  ),
);
const resolvedStyle = computed(() =>
  chrome.value.appearance === 'automatic'
    ? resolveAutomaticPickerStyle(props.mode)
    : chrome.value.appearance,
);
const fieldId = useId();
const inputId = computed(() => (props.label ? fieldIdFromLabel(props.label) : fieldId));
const uiState = computed(() =>
  resolveUIState({
    state: props.state,
    loading: props.loading,
    error: props.error,
    disabled: props.disabled,
  }),
);
const isDisabled = computed(
  () => props.disabled || uiState.value === 'disabled' || uiState.value === 'loading',
);
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : null));
const displayLabel = computed(() =>
  formatDateTimeLabel(current.value, props.mode, props.locale),
);

function update(partial: DateTimeValue) {
  const next = { ...current.value, ...partial };
  emit('update:modelValue', next);
  emit('change', next);
}

const dateColumns = computed(() => {
  const { year, month, day } = parseISODate(current.value.date);
  return {
    columns: [
      { id: 'month', label: 'Month', options: buildMonthOptions(props.locale), flex: 1.35 },
      { id: 'day', label: 'Day', options: buildDayOptions(year, month), flex: 0.75 },
      {
        id: 'year',
        label: 'Year',
        options: buildYearOptions(props.yearRange.start, props.yearRange.end),
        flex: 0.9,
      },
    ] as PickerColumn[],
    wheelValue: {
      month: String(month),
      day: String(day),
      year: String(year),
    } as PickerValue,
  };
});

const timeColumns = computed(() => {
  const { hour24, minute } = parseTime24(current.value.time);
  const snapped = snapMinuteToInterval(minute, props.minuteInterval);
  if (use12.value) {
    const { hour12, period } = to12Hour(hour24);
    return {
      columns: [
        { id: 'hour', label: 'Hour', options: buildHourOptions12() },
        { id: 'minute', label: 'Minute', options: buildMinuteOptions(props.minuteInterval) },
        { id: 'period', label: 'AM/PM', options: buildAmPmOptions() },
      ] as PickerColumn[],
      wheelValue: {
        hour: String(hour12),
        minute: String(snapped).padStart(2, '0'),
        period,
      } as PickerValue,
    };
  }
  return {
    columns: [
      { id: 'hour', label: 'Hour', options: buildHourOptions24() },
      { id: 'minute', label: 'Minute', options: buildMinuteOptions(props.minuteInterval) },
    ] as PickerColumn[],
    wheelValue: {
      hour: String(hour24).padStart(2, '0'),
      minute: String(snapped).padStart(2, '0'),
    } as PickerValue,
  };
});

const countdownColumns = computed(() => {
  const total = current.value.countdownMinutes ?? 0;
  const hours = Math.min(23, Math.floor(total / 60));
  const minutes = snapMinuteToInterval(total % 60, props.minuteInterval);
  return {
    columns: [
      { id: 'hours', label: 'Hours', options: buildCountdownHourOptions() },
      { id: 'minutes', label: 'Minutes', options: buildMinuteOptions(props.minuteInterval) },
    ] as PickerColumn[],
    wheelValue: {
      hours: String(hours),
      minutes: String(minutes).padStart(2, '0'),
    } as PickerValue,
  };
});

function onDateWheel(v: PickerValue) {
  const year = Number(v.year);
  const month = Number(v.month);
  const maxDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(Number(v.day), maxDay);
  update({ date: toISODate(year, month, day) });
}

function onTimeWheel(v: PickerValue) {
  const hour24 = use12.value
    ? from12Hour(Number(v.hour), v.period as 'AM' | 'PM')
    : Number(v.hour);
  update({ time: toTime24(hour24, Number(v.minute)) });
}

function onCountdownWheel(v: PickerValue) {
  update({
    countdownMinutes: Math.min(1439, Number(v.hours) * 60 + Number(v.minutes)),
  });
}

const compactPanelClass = computed(() => {
  if (props.mode === 'time') return styles.popoverPanelWheels;
  if (props.mode === 'countdown') return styles.popoverPanelCountdown;
  return styles.popoverPanelCalendar;
});
</script>

<template>
  <FieldShell
    :label="label"
    :hint="hint"
    :error="errorMessage"
    :html-for="inputId"
    :ui-state="uiState"
    :class="props.class"
    :style="chrome.css"
  >
    <!-- Wheels appearance -->
    <div v-if="resolvedStyle === 'wheels'" :class="styles.picker">
      <template v-if="mode === 'countdown'">
        <div :class="styles.datetimePanel">
          <WheelPicker
            :columns="countdownColumns.columns"
            :model-value="countdownColumns.wheelValue"
            :disabled="isDisabled"
            aria-label="Countdown timer"
            @change="onCountdownWheel"
          />
          <p :class="styles.countdownHint">Up to 23 hours and 59 minutes.</p>
        </div>
      </template>
      <WheelPicker
        v-else-if="mode === 'time'"
        :columns="timeColumns.columns"
        :model-value="timeColumns.wheelValue"
        :disabled="isDisabled"
        aria-label="Time"
        @change="onTimeWheel"
      />
      <div v-else-if="mode === 'datetime'" :class="styles.datetimePanel">
        <WheelPicker
          :columns="dateColumns.columns"
          :model-value="dateColumns.wheelValue"
          :disabled="isDisabled"
          aria-label="Date"
          @change="onDateWheel"
        />
        <WheelPicker
          :columns="timeColumns.columns"
          :model-value="timeColumns.wheelValue"
          :disabled="isDisabled"
          aria-label="Time"
          @change="onTimeWheel"
        />
      </div>
      <WheelPicker
        v-else
        :columns="dateColumns.columns"
        :model-value="dateColumns.wheelValue"
        :disabled="isDisabled"
        aria-label="Date"
        @change="onDateWheel"
      />
    </div>

    <!-- Inline appearance -->
    <div v-else-if="resolvedStyle === 'inline'" :class="styles.inlineLayout">
      <template v-if="mode === 'countdown'">
        <div :class="styles.datetimePanel">
          <WheelPicker
            :columns="countdownColumns.columns"
            :model-value="countdownColumns.wheelValue"
            :disabled="isDisabled"
            inline
            aria-label="Countdown timer"
            @change="onCountdownWheel"
          />
          <p :class="styles.countdownHint">Up to 23 hours and 59 minutes.</p>
        </div>
      </template>
      <WheelPicker
        v-else-if="mode === 'time'"
        :columns="timeColumns.columns"
        :model-value="timeColumns.wheelValue"
        :disabled="isDisabled"
        inline
        aria-label="Time"
        @change="onTimeWheel"
      />
      <template v-else-if="mode === 'date'">
        <CalendarGrid
          :model-value="current.date"
          :locale="locale"
          :min-date="minDate"
          :max-date="maxDate"
          @change="update({ date: $event })"
        />
      </template>
      <div v-else :class="styles.datetimePanel">
        <CalendarGrid
          :model-value="current.date"
          :locale="locale"
          :min-date="minDate"
          :max-date="maxDate"
          @change="update({ date: $event })"
        />
        <WheelPicker
          :columns="timeColumns.columns"
          :model-value="timeColumns.wheelValue"
          :disabled="isDisabled"
          inline
          aria-label="Time"
          @change="onTimeWheel"
        />
      </div>
    </div>

    <!-- Compact appearance -->
    <div v-else :class="styles.compactField">
      <Popover
        side="bottom"
        :aria-label="label ?? 'Date and time picker'"
        :panel-class="styles.compactPopover"
      >
        <template #trigger>
          <button
            :id="inputId"
            type="button"
            :class="styles.compactTrigger"
            :disabled="isDisabled"
            aria-haspopup="dialog"
          >
            <span :class="styles.compactValue">{{ displayLabel }}</span>
            <span :class="styles.compactChevron" aria-hidden="true">▾</span>
          </button>
        </template>
        <template #content>
          <div :class="cn(compactPanelClass)">
            <template v-if="mode === 'countdown'">
              <div :class="styles.datetimePanel">
                <WheelPicker
                  :columns="countdownColumns.columns"
                  :model-value="countdownColumns.wheelValue"
                  :disabled="isDisabled"
                  compact
                  aria-label="Countdown timer"
                  @change="onCountdownWheel"
                />
                <p :class="styles.countdownHint">Up to 23 hours and 59 minutes.</p>
              </div>
            </template>
            <WheelPicker
              v-else-if="mode === 'time'"
              :columns="timeColumns.columns"
              :model-value="timeColumns.wheelValue"
              :disabled="isDisabled"
              compact
              aria-label="Time"
              @change="onTimeWheel"
            />
            <template v-else-if="mode === 'date'">
              <CalendarGrid
                :model-value="current.date"
                :locale="locale"
                :min-date="minDate"
                :max-date="maxDate"
                @change="update({ date: $event })"
              />
            </template>
            <div v-else :class="styles.datetimePanel">
              <CalendarGrid
                :model-value="current.date"
                :locale="locale"
                :min-date="minDate"
                :max-date="maxDate"
                @change="update({ date: $event })"
              />
              <WheelPicker
                :columns="timeColumns.columns"
                :model-value="timeColumns.wheelValue"
                :disabled="isDisabled"
                compact
                aria-label="Time"
                @change="onTimeWheel"
              />
            </div>
          </div>
        </template>
      </Popover>
    </div>
  </FieldShell>
</template>
