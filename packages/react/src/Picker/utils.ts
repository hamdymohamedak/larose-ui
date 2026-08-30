import type { PickerColumn, PickerOption } from './types';

export const PICKER_ROW_HEIGHT_PX = 36;

export function buildMinuteOptions(interval = 1): PickerOption[] {
  const step = interval > 0 && 60 % interval === 0 ? interval : 1;
  const options: PickerOption[] = [];
  for (let minute = 0; minute < 60; minute += step) {
    options.push({
      value: String(minute).padStart(2, '0'),
      label: String(minute).padStart(2, '0'),
    });
  }
  return options;
}

export function buildHourOptions24(): PickerOption[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const value = String(hour).padStart(2, '0');
    return { value, label: value };
  });
}

export function buildHourOptions12(): PickerOption[] {
  return Array.from({ length: 12 }, (_, index) => {
    const hour = index === 0 ? 12 : index;
    const value = String(hour);
    return { value, label: value };
  });
}

export function buildAmPmOptions(): PickerOption[] {
  return [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];
}

export function buildMonthOptions(locale = 'en'): PickerOption[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
  return Array.from({ length: 12 }, (_, month) => {
    const date = new Date(2024, month, 1);
    const label = formatter.format(date);
    return { value: String(month), label };
  });
}

export function buildYearOptions(startYear: number, endYear: number): PickerOption[] {
  const options: PickerOption[] = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const value = String(year);
    options.push({ value, label: value });
  }
  return options;
}

export function buildDayOptions(year: number, month: number): PickerOption[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const value = String(day);
    return { value, label: value };
  });
}

export function buildCountdownHourOptions(): PickerOption[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    value: String(hour),
    label: String(hour),
  }));
}

export function parseISODate(value?: string): { year: number; month: number; day: number } {
  if (!value) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  const parts = value.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return {
    year: typeof year === 'number' && Number.isFinite(year) ? year : new Date().getFullYear(),
    month: typeof month === 'number' && Number.isFinite(month) ? month - 1 : 0,
    day: typeof day === 'number' && Number.isFinite(day) ? day : 1,
  };
}

export function toISODate(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseTime24(value?: string): { hour24: number; minute: number } {
  if (!value) {
    const now = new Date();
    return { hour24: now.getHours(), minute: now.getMinutes() };
  }
  const parts = value.split(':').map(Number);
  const hour = parts[0];
  const minute = parts[1];
  return {
    hour24: typeof hour === 'number' && Number.isFinite(hour) ? hour : 0,
    minute: typeof minute === 'number' && Number.isFinite(minute) ? minute : 0,
  };
}

export function toTime24(hour24: number, minute: number): string {
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function to12Hour(hour24: number): { hour12: number; period: 'AM' | 'PM' } {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

export function from12Hour(hour12: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

export function snapMinuteToInterval(minute: number, interval: number): number {
  const step = interval > 0 && 60 % interval === 0 ? interval : 1;
  return Math.min(59, Math.round(minute / step) * step);
}

export function resolveAutomaticPickerStyle(
  mode: 'date' | 'time' | 'datetime' | 'countdown',
): 'compact' | 'wheels' | 'inline' {
  if (mode === 'time' || mode === 'countdown') return 'wheels';
  return 'compact';
}

export function formatDateTimeLabel(
  value: { date?: string; time?: string; countdownMinutes?: number },
  mode: 'date' | 'time' | 'datetime' | 'countdown',
  locale = 'en',
): string {
  if (mode === 'countdown') {
    const total = value.countdownMinutes ?? 0;
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return `${hours} hr ${minutes} min`;
  }

  if (mode === 'time' && value.time) {
    const { hour24, minute } = parseTime24(value.time);
    const date = new Date();
    date.setHours(hour24, minute, 0, 0);
    return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(date);
  }

  if (mode === 'date' && value.date) {
    const { year, month, day } = parseISODate(value.date);
    const date = new Date(year, month, day);
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
  }

  if (mode === 'datetime') {
    const parts: string[] = [];
    if (value.date) {
      const { year, month, day } = parseISODate(value.date);
      parts.push(
        new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
          new Date(year, month, day),
        ),
      );
    }
    if (value.time) {
      const { hour24, minute } = parseTime24(value.time);
      const date = new Date();
      date.setHours(hour24, minute, 0, 0);
      parts.push(new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(date));
    }
    return parts.join(', ') || 'Select date and time';
  }

  return 'Select';
}

export function columnsFromValues(columns: PickerColumn[], value: Record<string, string>): PickerColumn[] {
  return columns.map((column) => {
    const selected = value[column.id];
    if (!selected || column.options.some((option) => option.value === selected)) {
      return column;
    }
    return {
      ...column,
      options: [...column.options, { value: selected, label: selected }],
    };
  });
}

export function weekdayLabels(locale = 'en'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const base = new Date(2024, 0, 7); // Sunday
  return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(base.getTime() + index * 86400000)));
}

export function monthMatrix(year: number, month: number): Array<Array<number | null>> {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<number | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
