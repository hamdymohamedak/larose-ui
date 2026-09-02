# Chart

Category: Data

## Props
- `accessibilitySummary` (string) — High-level summary for assistive technologies (Apple Audio Graphs pattern).
- `annotation` (string)
- `data` (ChartDataPoint[]) — Single-series shorthand.
- `height` (number) — Plot height in CSS pixels.
- `interactive` (boolean) — Enable plot-area scrubbing with crosshair.
- `mark` (ChartMark) — Chart mark type — bar, line, or point.
- `onPointFocus` ((point: ChartDataPoint, seriesId: string, index: number) => void)
- `series` (ChartSeries[]) — One or more data series.
- `showLegend` (boolean)
- `showPoints` (boolean) — Combine line marks with point marks. Default true for line charts.
- `stacked` (boolean) — Stack bar marks when multiple series are present.
- `stackGap` (number) — Gap between stacked bar segments (Apple HIG visual separation).
- `subtitle` (string)
- `xAxis` (ChartAxisConfig)
- `yAxis` (ChartAxisConfig)
- `yAxisTrailing` (boolean) — Y axis on trailing edge (right in LTR) for layout alignment.

Metadata: /components/chart.json
