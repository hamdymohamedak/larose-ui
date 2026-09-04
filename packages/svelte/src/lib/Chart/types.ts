export type ChartMark = 'bar' | 'line' | 'point';

export type PointShape = 'circle' | 'diamond' | 'square';

export interface ChartDataPoint {
  x: string | number;
  y: number;
  accessibilityLabel?: string;
}

export interface ChartSeries {
  id: string;
  label: string;
  data: ChartDataPoint[];
  color?: string;
  pointShape?: PointShape;
}

export interface ChartAxisConfig {
  label?: string;
  /** Fixed lower bound. Omit with `max` for dynamic range. */
  min?: number;
  /** Fixed upper bound. Omit with `min` for dynamic range. */
  max?: number;
  /** Hide axis line and ticks. */
  hidden?: boolean;
  /** Number of tick marks (approximate). */
  tickCount?: number;
  formatValue?: (value: number) => string;
  formatCategory?: (value: string | number) => string;
}

export interface ChartLegendItem {
  id: string;
  label: string;
  color: string;
  shape?: PointShape;
}
