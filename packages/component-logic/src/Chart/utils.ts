import type { ChartDataPoint, ChartSeries } from './types';

export interface PlotPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_PADDING: PlotPadding = {
  top: 12,
  right: 12,
  bottom: 28,
  left: 44,
};

export function collectYValues(series: ChartSeries[]): number[] {
  return series.flatMap((s) => s.data.map((d) => d.y));
}

export function collectXValues(series: ChartSeries[]): Array<string | number> {
  const seen = new Set<string>();
  const values: Array<string | number> = [];
  for (const s of series) {
    for (const d of s.data) {
      const key = String(d.x);
      if (!seen.has(key)) {
        seen.add(key);
        values.push(d.x);
      }
    }
  }
  return values;
}

/** Pick familiar tick intervals (0, 5, 10, …) per Apple HIG axis guidance. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    return [min];
  }

  const range = max - min;
  const roughStep = range / Math.max(count - 1, 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const residual = roughStep / magnitude;

  let niceStep = magnitude;
  if (residual <= 1) niceStep = magnitude;
  else if (residual <= 2) niceStep = 2 * magnitude;
  else if (residual <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];

  for (let v = niceMin; v <= niceMax + niceStep * 0.001; v += niceStep) {
    ticks.push(Number(v.toFixed(10)));
  }

  return ticks;
}

export function resolveYDomain(
  values: number[],
  min?: number,
  max?: number,
  mark: 'bar' | 'line' | 'point' = 'bar',
): { min: number; max: number } {
  if (min !== undefined && max !== undefined) {
    return { min, max };
  }

  const dataMin = values.length ? Math.min(...values) : 0;
  const dataMax = values.length ? Math.max(...values) : 1;
  const lower =
    min ??
    (mark === 'bar' ? Math.min(0, dataMin) : dataMin - (dataMax - dataMin) * 0.08);
  const upper = max ?? (dataMax + (dataMax - lower) * 0.06 || 1);

  return { min: lower, max: upper <= lower ? lower + 1 : upper };
}

export function yToPixel(y: number, min: number, max: number, height: number, padding: PlotPadding): number {
  const plotHeight = height - padding.top - padding.bottom;
  const ratio = max === min ? 0.5 : (y - min) / (max - min);
  return padding.top + plotHeight * (1 - ratio);
}

export function xBandIndex(
  x: string | number,
  categories: Array<string | number>,
  width: number,
  padding: PlotPadding,
): number {
  const index = categories.findIndex((c) => String(c) === String(x));
  const plotWidth = width - padding.left - padding.right;
  const step = categories.length > 0 ? plotWidth / categories.length : plotWidth;
  return padding.left + step * index + step / 2;
}

export function formatDefaultNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 10_000) return `${Math.round(value / 1000)}K`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

export function defaultAccessibilityLabel(
  seriesLabel: string,
  point: ChartDataPoint,
  formatValue: (v: number) => string,
): string {
  return `${seriesLabel}, ${String(point.x)}, ${formatValue(point.y)}`;
}

export function buildLinePath(
  points: Array<{ x: number; y: number }>,
): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export function nearestPointIndex(
  clientX: number,
  svgRect: DOMRect,
  categories: Array<string | number>,
  width: number,
  padding: PlotPadding,
): number {
  const x = ((clientX - svgRect.left) / svgRect.width) * width;
  const plotWidth = width - padding.left - padding.right;
  const step = categories.length > 0 ? plotWidth / categories.length : plotWidth;
  const relative = x - padding.left;
  const index = Math.floor(relative / step);
  return Math.max(0, Math.min(categories.length - 1, index));
}
