import { describe, expect, it } from 'vitest';
import { getWheelItemVisual } from './useWheelPhysics';
import {
  buildDayOptions,
  buildMinuteOptions,
  formatDateTimeLabel,
  from12Hour,
  monthMatrix,
  parseISODate,
  snapMinuteToInterval,
  to12Hour,
  toISODate,
  toTime24,
} from './utils';

describe('Picker utils', () => {
  it('dims and tilts wheel rows away from center', () => {
    const center = getWheelItemVisual(0);
    const edge = getWheelItemVisual(2);
    expect(center.opacity).toBeGreaterThan(edge.opacity);
    expect(center.scale).toBeGreaterThan(edge.scale);
    expect(center.rotateX).toBe(0);
    expect(edge.rotateX).not.toBe(0);
  });

  it('builds minute options with interval', () => {
    expect(buildMinuteOptions(15).map((option) => option.value)).toEqual([
      '00',
      '15',
      '30',
      '45',
    ]);
  });

  it('snaps minutes to valid interval', () => {
    expect(snapMinuteToInterval(7, 15)).toBe(0);
    expect(snapMinuteToInterval(8, 15)).toBe(15);
  });

  it('converts between 12h and 24h', () => {
    expect(to12Hour(0)).toEqual({ hour12: 12, period: 'AM' });
    expect(to12Hour(13)).toEqual({ hour12: 1, period: 'PM' });
    expect(from12Hour(12, 'AM')).toBe(0);
    expect(from12Hour(1, 'PM')).toBe(13);
  });

  it('formats ISO dates', () => {
    expect(toISODate(2026, 7, 9)).toBe('2026-08-09');
    expect(parseISODate('2026-08-09')).toEqual({ year: 2026, month: 7, day: 9 });
  });

  it('adjusts day options for month length', () => {
    expect(buildDayOptions(2024, 1)).toHaveLength(29);
    expect(buildDayOptions(2024, 2)).toHaveLength(31);
  });

  it('builds calendar weeks', () => {
    const weeks = monthMatrix(2026, 7);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
  });

  it('formats display labels', () => {
    expect(
      formatDateTimeLabel({ date: '2026-08-09', time: '14:30' }, 'datetime', 'en-US'),
    ).toContain('2026');
    expect(formatDateTimeLabel({ countdownMinutes: 90 }, 'countdown')).toBe('1 hr 30 min');
    expect(toTime24(14, 5)).toBe('14:05');
  });
});
