export interface PickerOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PickerColumn {
  id: string;
  /** Accessible name for the column (e.g. "Month"). */
  label?: string;
  options: PickerOption[];
  flex?: number;
}

export type PickerStyle = 'wheels' | 'compact';

export type DateTimePickerStyle = 'compact' | 'wheels' | 'inline' | 'automatic';

export type DateTimePickerMode = 'date' | 'time' | 'datetime' | 'countdown';

export interface DateTimeValue {
  /** ISO date string `YYYY-MM-DD`. */
  date?: string;
  /** 24-hour time string `HH:mm`. */
  time?: string;
  /** Countdown duration in minutes (0–1439). */
  countdownMinutes?: number;
}

export type PickerValue = Record<string, string>;
