import { useMemo, useState, type CSSProperties } from 'react';
import { monthMatrix, parseISODate, toISODate, weekdayLabels } from './utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';

export interface CalendarGridProps {
  value?: string;
  onChange: (isoDate: string) => void;
  locale?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  style?: CSSProperties;
}

export function CalendarGrid({
  value,
  onChange,
  locale = 'en',
  minDate,
  maxDate,
  className,
  style,
}: CalendarGridProps) {
  const parsed = parseISODate(value);
  const [visibleYear, setVisibleYear] = useState(parsed.year);
  const [visibleMonth, setVisibleMonth] = useState(parsed.month);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(visibleYear, visibleMonth, 1),
    );
  }, [locale, visibleMonth, visibleYear]);

  const weeks = useMemo(() => monthMatrix(visibleYear, visibleMonth), [visibleMonth, visibleYear]);
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const selected = parseISODate(value);

  const shiftMonth = (delta: number) => {
    const next = new Date(visibleYear, visibleMonth + delta, 1);
    setVisibleYear(next.getFullYear());
    setVisibleMonth(next.getMonth());
  };

  const isDisabled = (day: number) => {
    const iso = toISODate(visibleYear, visibleMonth, day);
    if (minDate && iso < minDate) return true;
    if (maxDate && iso > maxDate) return true;
    return false;
  };

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.calendarNav}
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.calendarTitle}>{monthLabel}</span>
        <button
          type="button"
          className={styles.calendarNav}
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className={styles.weekdays} aria-hidden="true">
        {weekdays.map((label) => (
          <span key={label} className={styles.weekday}>
            {label}
          </span>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className={styles.week}>
          {week.map((day, dayIndex) =>
            day === null ? (
              <span key={`empty-${weekIndex}-${dayIndex}`} className={styles.dayButton} data-outside="true" />
            ) : (
              <button
                key={day}
                type="button"
                className={styles.dayButton}
                data-selected={
                  day === selected.day &&
                  visibleMonth === selected.month &&
                  visibleYear === selected.year
                    ? 'true'
                    : undefined
                }
                disabled={isDisabled(day)}
                onClick={() => onChange(toISODate(visibleYear, visibleMonth, day))}
              >
                {day}
              </button>
            ),
          )}
        </div>
      ))}
    </div>
  );
}
