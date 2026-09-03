<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import FieldShell from '../FieldShell/FieldShell.svelte';
  import Popover from '../Popover/Popover.svelte';
  import { fieldIdFromLabel } from '../../DataEntry/utils';
  import type {
    DateTimePickerMode,
    DateTimePickerStyle,
    DateTimeValue,
    PickerColumn,
    PickerValue,
  } from '../../Picker/types';
  import { resolvePickerChrome } from '../../Picker/chrome';
  import CalendarGrid from './CalendarGrid.svelte';
  import WheelPicker from './WheelPicker.svelte';
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

  interface Props {
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
  }

  let {
    value = $bindable<DateTimeValue>({}),
    mode = 'date',
    appearance,
    style,
    label,
    hint,
    error = null,
    state,
    loading = false,
    disabled = false,
    locale = 'en',
    minuteInterval = 1,
    use12Hour = locale.startsWith('en'),
    minDate,
    maxDate,
    yearRange = { start: new Date().getFullYear() - 5, end: new Date().getFullYear() + 5 },
    class: className,
  }: Props = $props();

  const chrome = $derived(resolvePickerChrome(appearance, style, 'automatic'));
  const fieldId = $props.id();
  const inputId = $derived(label ? fieldIdFromLabel(label) : fieldId);
  const uiState = $derived(resolveUIState({ state, loading, error, disabled }));
  const errorMessage = $derived(typeof error === 'string' ? error : null);
  const isDisabled = $derived(disabled || uiState === 'disabled' || uiState === 'loading');
  const resolvedStyle = $derived(
    chrome.appearance === 'automatic' ? resolveAutomaticPickerStyle(mode) : chrome.appearance,
  );
  const displayLabel = $derived(formatDateTimeLabel(value, mode, locale));
  const cssStyle = $derived(
    chrome.css
      ? Object.entries(chrome.css)
          .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`)
          .join(';')
      : undefined,
  );

  function dateColumns(): { columns: PickerColumn[]; wheelValue: PickerValue } {
    const { year, month, day } = parseISODate(value.date);
    return {
      columns: [
        { id: 'month', label: 'Month', options: buildMonthOptions(locale), flex: 1.35 },
        { id: 'day', label: 'Day', options: buildDayOptions(year, month), flex: 0.75 },
        {
          id: 'year',
          label: 'Year',
          options: buildYearOptions(yearRange.start, yearRange.end),
          flex: 0.9,
        },
      ],
      wheelValue: { month: String(month), day: String(day), year: String(year) },
    };
  }

  function timeColumns(): { columns: PickerColumn[]; wheelValue: PickerValue } {
    const { hour24, minute } = parseTime24(value.time);
    const snappedMinute = snapMinuteToInterval(minute, minuteInterval);
    if (use12Hour) {
      const { hour12, period } = to12Hour(hour24);
      return {
        columns: [
          { id: 'hour', label: 'Hour', options: buildHourOptions12() },
          { id: 'minute', label: 'Minute', options: buildMinuteOptions(minuteInterval) },
          { id: 'period', label: 'AM/PM', options: buildAmPmOptions() },
        ],
        wheelValue: {
          hour: String(hour12),
          minute: String(snappedMinute).padStart(2, '0'),
          period,
        },
      };
    }
    return {
      columns: [
        { id: 'hour', label: 'Hour', options: buildHourOptions24() },
        { id: 'minute', label: 'Minute', options: buildMinuteOptions(minuteInterval) },
      ],
      wheelValue: {
        hour: String(hour24).padStart(2, '0'),
        minute: String(snappedMinute).padStart(2, '0'),
      },
    };
  }

  function countdownColumns(): { columns: PickerColumn[]; wheelValue: PickerValue } {
    const total = value.countdownMinutes ?? 0;
    const hours = Math.min(23, Math.floor(total / 60));
    const minutes = snapMinuteToInterval(total % 60, minuteInterval);
    return {
      columns: [
        { id: 'hours', label: 'Hours', options: buildCountdownHourOptions() },
        { id: 'minutes', label: 'Minutes', options: buildMinuteOptions(minuteInterval) },
      ],
      wheelValue: {
        hours: String(hours),
        minutes: String(minutes).padStart(2, '0'),
      },
    };
  }

  function onDateWheel(wheelValue: PickerValue) {
    const year = Number(wheelValue.year);
    const month = Number(wheelValue.month);
    const maxDay = new Date(year, month + 1, 0).getDate();
    const day = Math.min(Number(wheelValue.day), maxDay);
    value = { ...value, date: toISODate(year, month, day) };
  }

  function onTimeWheel(wheelValue: PickerValue) {
    const hour24 = use12Hour
      ? from12Hour(Number(wheelValue.hour), wheelValue.period as 'AM' | 'PM')
      : Number(wheelValue.hour);
    value = { ...value, time: toTime24(hour24, Number(wheelValue.minute)) };
  }

  function onCountdownWheel(wheelValue: PickerValue) {
    value = {
      ...value,
      countdownMinutes: Math.min(1439, Number(wheelValue.hours) * 60 + Number(wheelValue.minutes)),
    };
  }

  const compactPanelClass = $derived(
    mode === 'time'
      ? styles.popoverPanelWheels
      : mode === 'countdown'
        ? styles.popoverPanelCountdown
        : styles.popoverPanelCalendar,
  );
</script>

{#snippet dateWheels(inline = false, compact = false)}
  {@const built = dateColumns()}
  <WheelPicker
    columns={built.columns}
    value={built.wheelValue}
    onChange={onDateWheel}
    disabled={isDisabled}
    {inline}
    {compact}
    aria-label="Date"
  />
{/snippet}

{#snippet timeWheels(inline = false, compact = false)}
  {@const built = timeColumns()}
  <WheelPicker
    columns={built.columns}
    value={built.wheelValue}
    onChange={onTimeWheel}
    disabled={isDisabled}
    {inline}
    {compact}
    aria-label="Time"
  />
{/snippet}

{#snippet countdownWheels(inline = false, compact = false)}
  {@const built = countdownColumns()}
  <div class={styles.datetimePanel}>
    <WheelPicker
      columns={built.columns}
      value={built.wheelValue}
      onChange={onCountdownWheel}
      disabled={isDisabled}
      {inline}
      {compact}
      aria-label="Countdown timer"
    />
    <p class={styles.countdownHint}>Up to 23 hours and 59 minutes.</p>
  </div>
{/snippet}

{#snippet panel()}
  {#if mode === 'countdown'}
    {@render countdownWheels(resolvedStyle === 'inline', resolvedStyle === 'compact')}
  {:else if mode === 'time'}
    {@render timeWheels(resolvedStyle === 'inline', resolvedStyle === 'compact')}
  {:else if mode === 'date'}
    {#if resolvedStyle === 'inline' || resolvedStyle === 'compact'}
      <CalendarGrid
        value={value.date}
        onChange={(date) => {
          value = { ...value, date };
        }}
        {locale}
        {minDate}
        {maxDate}
      />
    {:else}
      {@render dateWheels()}
    {/if}
  {:else}
    <div class={styles.datetimePanel}>
      <CalendarGrid
        value={value.date}
        onChange={(date) => {
          value = { ...value, date };
        }}
        {locale}
        {minDate}
        {maxDate}
      />
      {@render timeWheels(resolvedStyle === 'inline', resolvedStyle === 'compact')}
    </div>
  {/if}
{/snippet}

{#if resolvedStyle === 'wheels'}
  <FieldShell {label} {hint} error={errorMessage} htmlFor={inputId} {uiState} class={className} style={cssStyle}>
    <div class={styles.picker}>
      {#if mode === 'countdown'}
        {@render countdownWheels(false, false)}
      {:else if mode === 'time'}
        {@render timeWheels()}
      {:else if mode === 'datetime'}
        <div class={styles.datetimePanel}>
          {@render dateWheels()}
          {@render timeWheels()}
        </div>
      {:else}
        {@render dateWheels()}
      {/if}
    </div>
  </FieldShell>
{:else if resolvedStyle === 'inline'}
  <FieldShell {label} {hint} error={errorMessage} htmlFor={inputId} {uiState} class={className} style={cssStyle}>
    <div class={styles.inlineLayout}>{@render panel()}</div>
  </FieldShell>
{:else}
  <FieldShell {label} {hint} error={errorMessage} htmlFor={inputId} {uiState} class={className} style={cssStyle}>
    <div class={styles.compactField}>
      <Popover side="bottom" aria-label={label ?? 'Date and time picker'} panelClass={styles.compactPopover}>
        {#snippet trigger()}
          <button
            id={inputId}
            type="button"
            class={styles.compactTrigger}
            disabled={isDisabled}
            aria-haspopup="dialog"
          >
            <span class={styles.compactValue}>{displayLabel}</span>
            <span class={styles.compactChevron} aria-hidden="true">▾</span>
          </button>
        {/snippet}
        {#snippet content()}
          <div class={cn(compactPanelClass)}>{@render panel()}</div>
        {/snippet}
      </Popover>
    </div>
  </FieldShell>
{/if}
