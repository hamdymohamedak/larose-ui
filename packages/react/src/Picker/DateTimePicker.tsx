import { useCallback, useId, useMemo, type CSSProperties } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { FieldShell } from '../DataEntry/FieldShell';
import { fieldIdFromLabel } from '../DataEntry/utils';
import { Popover } from '../Popover/Popover';
import { resolvePickerChrome } from './chrome';
import { CalendarGrid } from './CalendarGrid';
import type { DateTimePickerMode, DateTimePickerStyle, DateTimeValue, PickerColumn, PickerValue } from './types';
import { WheelPicker } from './WheelPicker';
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
} from './utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';

export interface DateTimePickerProps {
  value?: DateTimeValue;
  onChange?: (value: DateTimeValue) => void;
  mode?: DateTimePickerMode;
  /** Compact / wheels / inline / automatic. Use with object `style` when you need both. */
  appearance?: DateTimePickerStyle;
  /** Appearance string or inline CSS. */
  style?: DateTimePickerStyle | CSSProperties;
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
  className?: string;
}

function buildDateColumns(
  value: DateTimeValue,
  locale: string,
  yearRange: { start: number; end: number },
): { columns: PickerColumn[]; wheelValue: PickerValue } {
  const { year, month } = parseISODate(value.date);
  const day = parseISODate(value.date).day;
  return {
    columns: [
      { id: 'month', label: 'Month', options: buildMonthOptions(locale), flex: 1.35 },
      { id: 'day', label: 'Day', options: buildDayOptions(year, month), flex: 0.75 },
      { id: 'year', label: 'Year', options: buildYearOptions(yearRange.start, yearRange.end), flex: 0.9 },
    ],
    wheelValue: {
      month: String(month),
      day: String(day),
      year: String(year),
    },
  };
}

function buildTimeColumns(
  value: DateTimeValue,
  minuteInterval: number,
  use12Hour: boolean,
): { columns: PickerColumn[]; wheelValue: PickerValue } {
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

function buildCountdownColumns(
  value: DateTimeValue,
  minuteInterval: number,
): { columns: PickerColumn[]; wheelValue: PickerValue } {
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

/**
 * Date and time picker with compact, inline, and wheel styles.
 * @see https://developer.apple.com/design/human-interface-guidelines/pickers
 */
export function DateTimePicker({
  value = {},
  onChange,
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
  className,
}: DateTimePickerProps) {
  const { appearance: pickerAppearance, css } = resolvePickerChrome(
    appearance,
    style,
    'automatic',
  );
  const fieldId = useId();
  const inputId = label ? fieldIdFromLabel(label) : fieldId;
  const uiState = resolveUIState({ state, loading, error, disabled });
  const errorMessage = typeof error === 'string' ? error : null;
  const isDisabled = disabled || uiState === 'disabled' || uiState === 'loading';

  const resolvedStyle =
    pickerAppearance === 'automatic'
      ? resolveAutomaticPickerStyle(mode)
      : pickerAppearance;

  const displayLabel = formatDateTimeLabel(value, mode, locale);

  const handleDateWheelChange = useCallback(
    (wheelValue: Record<string, string>) => {
      const year = Number(wheelValue.year);
      const month = Number(wheelValue.month);
      const maxDay = new Date(year, month + 1, 0).getDate();
      const day = Math.min(Number(wheelValue.day), maxDay);
      onChange?.({ ...value, date: toISODate(year, month, day) });
    },
    [onChange, value],
  );

  const handleTimeWheelChange = useCallback(
    (wheelValue: Record<string, string>) => {
      const hour24 = use12Hour
        ? from12Hour(Number(wheelValue.hour), wheelValue.period as 'AM' | 'PM')
        : Number(wheelValue.hour);
      const minute = Number(wheelValue.minute);
      onChange?.({ ...value, time: toTime24(hour24, minute) });
    },
    [onChange, use12Hour, value],
  );

  const handleCountdownChange = useCallback(
    (wheelValue: Record<string, string>) => {
      const hours = Number(wheelValue.hours);
      const minutes = Number(wheelValue.minutes);
      onChange?.({ ...value, countdownMinutes: Math.min(1439, hours * 60 + minutes) });
    },
    [onChange, value],
  );

  const dateWheels = useMemo(() => {
    const { columns, wheelValue } = buildDateColumns(value, locale, yearRange);
    return (
      <WheelPicker
        columns={columns}
        value={wheelValue}
        onChange={handleDateWheelChange}
        disabled={isDisabled}
        inline={resolvedStyle === 'inline'}
        compact={resolvedStyle === 'compact'}
        aria-label="Date"
      />
    );
  }, [handleDateWheelChange, isDisabled, locale, resolvedStyle, value, yearRange]);

  const timeWheels = useMemo(() => {
    const { columns, wheelValue } = buildTimeColumns(value, minuteInterval, use12Hour);
    return (
      <WheelPicker
        columns={columns}
        value={wheelValue}
        onChange={handleTimeWheelChange}
        disabled={isDisabled}
        inline={resolvedStyle === 'inline'}
        compact={resolvedStyle === 'compact'}
        aria-label="Time"
      />
    );
  }, [handleTimeWheelChange, isDisabled, minuteInterval, resolvedStyle, use12Hour, value]);

  const countdownWheels = useMemo(() => {
    const { columns, wheelValue } = buildCountdownColumns(value, minuteInterval);
    return (
      <div className={styles.datetimePanel}>
        <WheelPicker
          columns={columns}
          value={wheelValue}
          onChange={handleCountdownChange}
          disabled={isDisabled}
          inline={resolvedStyle === 'inline'}
          compact={resolvedStyle === 'compact'}
          aria-label="Countdown timer"
        />
        <p className={styles.countdownHint}>Up to 23 hours and 59 minutes.</p>
      </div>
    );
  }, [handleCountdownChange, isDisabled, minuteInterval, resolvedStyle, value]);

  const panelContent = (() => {
    if (mode === 'countdown') return countdownWheels;
    if (mode === 'time') return timeWheels;
    if (mode === 'date') {
      if (resolvedStyle === 'inline' || resolvedStyle === 'compact') {
        return (
          <CalendarGrid
            value={value.date}
            onChange={(date) => onChange?.({ ...value, date })}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
          />
        );
      }
      return dateWheels;
    }
    return (
      <div className={styles.datetimePanel}>
        <CalendarGrid
          value={value.date}
          onChange={(date) => onChange?.({ ...value, date })}
          locale={locale}
          minDate={minDate}
          maxDate={maxDate}
        />
        {timeWheels}
      </div>
    );
  })();

  if (resolvedStyle === 'wheels') {
    const content =
      mode === 'countdown'
        ? countdownWheels
        : mode === 'time'
          ? timeWheels
          : mode === 'datetime'
            ? (
                <div className={styles.datetimePanel}>
                  {dateWheels}
                  {timeWheels}
                </div>
              )
            : dateWheels;
    return (
      <FieldShell label={label} hint={hint} error={errorMessage} htmlFor={inputId} uiState={uiState} className={className} style={css}>
        <div className={styles.picker}>{content}</div>
      </FieldShell>
    );
  }

  if (resolvedStyle === 'inline') {
    return (
      <FieldShell label={label} hint={hint} error={errorMessage} htmlFor={inputId} uiState={uiState} className={className} style={css}>
        <div className={styles.inlineLayout}>{panelContent}</div>
      </FieldShell>
    );
  }

  const compactPanelClass =
    mode === 'time'
      ? styles.popoverPanelWheels
      : mode === 'countdown'
        ? styles.popoverPanelCountdown
        : styles.popoverPanelCalendar;

  return (
    <FieldShell label={label} hint={hint} error={errorMessage} htmlFor={inputId} uiState={uiState} className={className} style={css}>
      <div className={styles.compactField}>
        <Popover
          side="bottom"
          aria-label={label ?? 'Date and time picker'}
          panelClassName={styles.compactPopover}
          trigger={
            <button
              id={inputId}
              type="button"
              className={styles.compactTrigger}
              disabled={isDisabled}
              aria-haspopup="dialog"
            >
              <span className={styles.compactValue}>{displayLabel}</span>
              <span className={styles.compactChevron} aria-hidden="true">
                ▾
              </span>
            </button>
          }
          content={<div className={compactPanelClass}>{panelContent}</div>}
        />
      </div>
    </FieldShell>
  );
}
