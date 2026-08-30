import type { ThemeMode } from '@larose-ui/core';

export interface ChartTokens {
  grid: string;
  axis: string;
  tick: string;
  label: string;
  crosshair: string;
  plotBg: string;
  barRadius: string;
  markStroke: string;
  series1: string;
  series2: string;
  series3: string;
  series4: string;
  series5: string;
  series6: string;
  labelFontSize: string;
  titleFontSize: string;
}

/**
 * Apple HIG-inspired chart tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/charts
 */
export function getChartTokens(mode: ThemeMode): ChartTokens {
  if (mode === 'dark') {
    return {
      grid: 'rgb(255 255 255 / 0.08)',
      axis: 'rgb(255 255 255 / 0.18)',
      tick: 'rgb(255 255 255 / 0.35)',
      label: '#98989d',
      crosshair: 'rgb(255 255 255 / 0.45)',
      plotBg: 'transparent',
      barRadius: '4px',
      markStroke: 'rgb(28 28 30 / 0.85)',
      series1: '#0a84ff',
      series2: '#30d158',
      series3: '#ff9f0a',
      series4: '#ff375f',
      series5: '#bf5af2',
      series6: '#64d2ff',
      labelFontSize: '0.6875rem',
      titleFontSize: '0.8125rem',
    };
  }

  return {
    grid: 'rgb(0 0 0 / 0.06)',
    axis: 'rgb(0 0 0 / 0.12)',
    tick: 'rgb(0 0 0 / 0.22)',
    label: '#6e6e73',
    crosshair: 'rgb(0 0 0 / 0.25)',
    plotBg: 'transparent',
    barRadius: '4px',
    markStroke: '#ffffff',
    series1: '#0071e3',
    series2: '#34c759',
    series3: '#ff9500',
    series4: '#ff2d55',
    series5: '#af52de',
    series6: '#5ac8fa',
    labelFontSize: '0.6875rem',
    titleFontSize: '0.8125rem',
  };
}

export function chartTokensToCSSVariables(tokens: ChartTokens): Record<string, string> {
  return {
    '--lr-chart-grid': tokens.grid,
    '--lr-chart-axis': tokens.axis,
    '--lr-chart-tick': tokens.tick,
    '--lr-chart-label': tokens.label,
    '--lr-chart-crosshair': tokens.crosshair,
    '--lr-chart-plot-bg': tokens.plotBg,
    '--lr-chart-bar-radius': tokens.barRadius,
    '--lr-chart-mark-stroke': tokens.markStroke,
    '--lr-chart-series-1': tokens.series1,
    '--lr-chart-series-2': tokens.series2,
    '--lr-chart-series-3': tokens.series3,
    '--lr-chart-series-4': tokens.series4,
    '--lr-chart-series-5': tokens.series5,
    '--lr-chart-series-6': tokens.series6,
    '--lr-chart-label-font-size': tokens.labelFontSize,
    '--lr-chart-title-font-size': tokens.titleFontSize,
  };
}

export const CHART_SERIES_COLORS = [
  'var(--lr-chart-series-1)',
  'var(--lr-chart-series-2)',
  'var(--lr-chart-series-3)',
  'var(--lr-chart-series-4)',
  'var(--lr-chart-series-5)',
  'var(--lr-chart-series-6)',
] as const;
