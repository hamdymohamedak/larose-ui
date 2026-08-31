import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { CHART_SERIES_COLORS } from '@larose-ui/tokens';
import type {
  ChartAxisConfig,
  ChartDataPoint,
  ChartLegendItem,
  ChartMark,
  ChartSeries,
  PointShape,
} from './types';
import {
  DEFAULT_PADDING,
  buildLinePath,
  collectXValues,
  collectYValues,
  defaultAccessibilityLabel,
  formatDefaultNumber,
  nearestPointIndex,
  niceTicks,
  resolveYDomain,
  xBandIndex,
  yToPixel,
} from './utils';
import styles from '@larose-ui/styles/components/Chart/Chart.module.css';

export interface ChartProps {
  /** Chart mark type — bar, line, or point. */
  mark?: ChartMark;
  /** Single-series shorthand. */
  data?: ChartDataPoint[];
  /** One or more data series. */
  series?: ChartSeries[];
  title?: string;
  subtitle?: string;
  annotation?: string;
  /** High-level summary for assistive technologies (Apple Audio Graphs pattern). */
  accessibilitySummary?: string;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  /** Combine line marks with point marks. Default true for line charts. */
  showPoints?: boolean;
  /** Stack bar marks when multiple series are present. */
  stacked?: boolean;
  /** Gap between stacked bar segments (Apple HIG visual separation). */
  stackGap?: number;
  /** Plot height in CSS pixels. */
  height?: number;
  /** Enable plot-area scrubbing with crosshair. */
  interactive?: boolean;
  /** Y axis on trailing edge (right in LTR) for layout alignment. */
  yAxisTrailing?: boolean;
  showLegend?: boolean;
  className?: string;
  onPointFocus?: (point: ChartDataPoint, seriesId: string, index: number) => void;
}

function seriesColor(index: number, override?: string): string {
  return override ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] ?? 'var(--lr-chart-series-1)';
}

function resolveSeries(
  data: ChartDataPoint[] | undefined,
  series: ChartSeries[] | undefined,
): ChartSeries[] {
  if (series && series.length > 0) return series;
  if (data && data.length > 0) {
    return [{ id: 'default', label: 'Value', data }];
  }
  return [];
}

function renderPointShape(
  shape: PointShape,
  cx: number,
  cy: number,
  r: number,
  color: string,
  key: string,
) {
  if (shape === 'diamond') {
    return (
      <polygon
        key={key}
        className={styles.point}
        points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
        fill={color}
      />
    );
  }
  if (shape === 'square') {
    return (
      <rect
        key={key}
        className={styles.point}
        x={cx - r}
        y={cy - r}
        width={r * 2}
        height={r * 2}
        rx={1}
        fill={color}
      />
    );
  }
  return <circle key={key} className={styles.point} cx={cx} cy={cy} r={r} fill={color} />;
}

export function Chart({
  mark = 'bar',
  data,
  series: seriesProp,
  title,
  subtitle,
  annotation,
  accessibilitySummary,
  xAxis,
  yAxis,
  showPoints = mark === 'line',
  stacked = false,
  stackGap = 2,
  height = 220,
  interactive = false,
  yAxisTrailing = false,
  showLegend,
  className,
  onPointFocus,
}: ChartProps) {
  const chartId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [liveMessage, setLiveMessage] = useState('');

  const width = 640;
  const padding = DEFAULT_PADDING;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const resolvedSeries = useMemo(
    () => resolveSeries(data, seriesProp),
    [data, seriesProp],
  );

  const categories = useMemo(() => collectXValues(resolvedSeries), [resolvedSeries]);
  const yValues = useMemo(() => collectYValues(resolvedSeries), [resolvedSeries]);

  const yFormat = yAxis?.formatValue ?? formatDefaultNumber;
  const xFormat = xAxis?.formatCategory ?? ((v: string | number) => String(v));

  const yDomain = useMemo(
    () => resolveYDomain(yValues, yAxis?.min, yAxis?.max, mark),
    [yValues, yAxis?.min, yAxis?.max, mark],
  );

  const yTicks = useMemo(
    () => niceTicks(yDomain.min, yDomain.max, yAxis?.tickCount ?? 5),
    [yDomain, yAxis?.tickCount],
  );

  const legendItems: ChartLegendItem[] = useMemo(
    () =>
      resolvedSeries.map((s, i) => ({
        id: s.id,
        label: s.label,
        color: seriesColor(i, s.color),
        shape: s.pointShape ?? 'circle',
      })),
    [resolvedSeries],
  );

  const shouldShowLegend =
    showLegend ?? (resolvedSeries.length > 1 || mark === 'point');

  const accessibilityLabels = useMemo(() => {
    const labels: string[] = [];
    for (const s of resolvedSeries) {
      for (const point of s.data) {
        labels.push(
          point.accessibilityLabel ??
            defaultAccessibilityLabel(s.label, point, yFormat),
        );
      }
    }
    return labels;
  }, [resolvedSeries, yFormat]);

  const updateFocus = useCallback(
    (index: number) => {
      if (index < 0 || index >= categories.length) return;
      setFocusIndex(index);
      const xLabel = xFormat(categories[index]!);
      const parts = resolvedSeries.map((s) => {
        const point = s.data.find((d) => String(d.x) === String(categories[index]));
        return point ? `${s.label}: ${yFormat(point.y)}` : null;
      }).filter(Boolean);
      setLiveMessage(`${xLabel}. ${parts.join('. ')}`);
      const primary = resolvedSeries[0];
      const point = primary?.data.find((d) => String(d.x) === String(categories[index]));
      if (point && primary) {
        onPointFocus?.(point, primary.id, index);
      }
    },
    [categories, onPointFocus, resolvedSeries, xFormat, yFormat],
  );

  const handlePointer = useCallback(
    (event: PointerEvent<SVGRectElement>) => {
      if (!interactive || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const index = nearestPointIndex(event.clientX, rect, categories, width, padding);
      updateFocus(index);
    },
    [categories, interactive, padding, updateFocus, width],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<SVGSVGElement>) => {
      if (!interactive) return;
      const current = focusIndex ?? 0;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        updateFocus(Math.min(categories.length - 1, current + 1));
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        updateFocus(Math.max(0, current - 1));
      }
    },
    [categories.length, focusIndex, interactive, updateFocus],
  );

  const barStep = categories.length > 0 ? plotWidth / categories.length : plotWidth;
  const barWidth = Math.max(4, barStep * 0.62);

  const renderBars = () => {
    if (stacked && resolvedSeries.length > 1) {
      return categories.flatMap((cat, catIndex) => {
        const cx = xBandIndex(cat, categories, width, padding);
        let runningTotal = 0;
        return resolvedSeries.map((s, seriesIndex) => {
          const point = s.data.find((d) => String(d.x) === String(cat));
          const value = point?.y ?? 0;
          if (value <= 0) return null;
          const color = seriesColor(seriesIndex, s.color);
          const yTop = yToPixel(runningTotal + value, yDomain.min, yDomain.max, height, padding);
          const yBottom = yToPixel(runningTotal, yDomain.min, yDomain.max, height, padding);
          const segmentHeight = Math.max(0, yBottom - yTop - (seriesIndex > 0 ? stackGap : 0));
          const y = yTop + (seriesIndex > 0 ? stackGap : 0);
          runningTotal += value;
          return (
            <rect
              key={`${s.id}-${catIndex}`}
              className={`${styles.bar} ${styles.barSegment}`}
              x={cx - barWidth / 2}
              y={y}
              width={barWidth}
              height={segmentHeight}
              rx={4}
              fill={color}
              opacity={focusIndex === null || focusIndex === catIndex ? 1 : 0.45}
            />
          );
        });
      });
    }

    return resolvedSeries.flatMap((s, seriesIndex) => {
      const offset =
        resolvedSeries.length > 1
          ? (seriesIndex - (resolvedSeries.length - 1) / 2) * (barWidth / resolvedSeries.length)
          : 0;
      const sliceWidth =
        resolvedSeries.length > 1 ? barWidth / resolvedSeries.length - 2 : barWidth;
      const color = seriesColor(seriesIndex, s.color);

      return s.data.map((point) => {
        const catIndex = categories.findIndex((c) => String(c) === String(point.x));
        const cx = xBandIndex(point.x, categories, width, padding) + offset;
        const yBase = yToPixel(0, yDomain.min, yDomain.max, height, padding);
        const yTop = yToPixel(point.y, yDomain.min, yDomain.max, height, padding);
        const barHeight = Math.max(0, yBase - yTop);
        return (
          <rect
            key={`${s.id}-${String(point.x)}`}
            className={styles.bar}
            x={cx - sliceWidth / 2}
            y={yTop}
            width={sliceWidth}
            height={barHeight}
            rx={4}
            fill={color}
            opacity={focusIndex === null || focusIndex === catIndex ? 1 : 0.45}
          />
        );
      });
    });
  };

  const renderLineSeries = () =>
    resolvedSeries.map((s, seriesIndex) => {
      const color = seriesColor(seriesIndex, s.color);
      const points = s.data.map((point) => ({
        x: xBandIndex(point.x, categories, width, padding),
        y: yToPixel(point.y, yDomain.min, yDomain.max, height, padding),
      }));
      const shape = s.pointShape ?? 'circle';

      return (
        <g key={s.id}>
          <path className={styles.line} d={buildLinePath(points)} stroke={color} />
          {showPoints &&
            points.map((p, i) =>
              renderPointShape(shape, p.x, p.y, 4.5, color, `${s.id}-pt-${i}`),
            )}
        </g>
      );
    });

  const renderPointSeries = () =>
    resolvedSeries.flatMap((s, seriesIndex) => {
      const color = seriesColor(seriesIndex, s.color);
      const shape = s.pointShape ?? (seriesIndex === 0 ? 'circle' : 'diamond');
      return s.data.map((point, i) => {
        const cx = xBandIndex(point.x, categories, width, padding);
        const cy = yToPixel(point.y, yDomain.min, yDomain.max, height, padding);
        return renderPointShape(shape, cx, cy, 5, color, `${s.id}-${i}`);
      });
    });

  const focusX =
    focusIndex !== null && categories[focusIndex] !== undefined
      ? xBandIndex(categories[focusIndex]!, categories, width, padding)
      : null;

  const yAxisX = yAxisTrailing ? width - padding.right : padding.left;
  const yLabelX = yAxisTrailing ? width - padding.right + 8 : padding.left - 8;
  const yTextAnchor = yAxisTrailing ? 'start' : 'end';

  return (
    <figure
      className={[styles.chart, className].filter(Boolean).join(' ')}
      aria-labelledby={title ? `${chartId}-title` : undefined}
      aria-describedby={
        accessibilitySummary || subtitle ? `${chartId}-summary` : undefined
      }
    >
      {(title || subtitle || annotation) && (
        <header className={styles.header}>
          {title && (
            <h3 id={`${chartId}-title`} className={styles.title}>
              {title}
            </h3>
          )}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {annotation && <p className={styles.annotation}>{annotation}</p>}
        </header>
      )}

      <div className={styles.plotWrapper}>
        <svg
          ref={svgRef}
          className={styles.plot}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-hidden={accessibilityLabels.length > 0 ? true : undefined}
          aria-label={accessibilityLabels.length === 0 ? accessibilitySummary ?? title : undefined}
          data-interactive={interactive ? 'true' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={handleKeyDown}
        >
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="var(--lr-chart-plot-bg)"
            onPointerDown={handlePointer}
            onPointerMove={handlePointer}
          />

          {!yAxis?.hidden &&
            yTicks.map((tick) => {
              const y = yToPixel(tick, yDomain.min, yDomain.max, height, padding);
              return (
                <g key={tick}>
                  <line
                    className={styles.gridLine}
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={y}
                    y2={y}
                  />
                  <text
                    className={styles.axisLabel}
                    x={yLabelX}
                    y={y + 4}
                    textAnchor={yTextAnchor}
                  >
                    {yFormat(tick)}
                  </text>
                </g>
              );
            })}

          <line
            className={styles.axisLine}
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
          />
          <line
            className={styles.axisLine}
            x1={yAxisX}
            x2={yAxisX}
            y1={padding.top}
            y2={height - padding.bottom}
          />

          {categories.map((cat) => {
            const x = xBandIndex(cat, categories, width, padding);
            return (
              <g key={String(cat)}>
                <line
                  className={styles.tick}
                  x1={x}
                  x2={x}
                  y1={height - padding.bottom}
                  y2={height - padding.bottom + 4}
                />
                <text
                  className={styles.axisLabel}
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                >
                  {xFormat(cat)}
                </text>
              </g>
            );
          })}

          {mark === 'bar' && renderBars()}
          {mark === 'line' && renderLineSeries()}
          {mark === 'point' && renderPointSeries()}

          {interactive && focusX !== null && (
            <>
              <line
                className={styles.crosshair}
                x1={focusX}
                x2={focusX}
                y1={padding.top}
                y2={height - padding.bottom}
              />
              <circle
                className={styles.focusRing}
                cx={focusX}
                cy={padding.top + plotHeight / 2}
                r={8}
              />
            </>
          )}
        </svg>

        {interactive && focusIndex !== null && focusX !== null && (
          <div
            className={styles.tooltip}
            style={{ left: `${(focusX / width) * 100}%`, top: '0.5rem' }}
            aria-hidden="true"
          >
            {liveMessage}
          </div>
        )}
      </div>

      {shouldShowLegend && (
        <ul className={styles.legend} aria-hidden="true">
          {legendItems.map((item) => (
            <li key={item.id} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                data-shape={item.shape}
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <figcaption id={`${chartId}-summary`} className={styles.srOnly}>
        {accessibilitySummary ?? subtitle ?? title}
      </figcaption>

      <ul className={styles.srOnly} aria-label="Chart data values">
        {accessibilityLabels.map((label, i) => (
          <li key={i}>{label}</li>
        ))}
      </ul>

      <div className={styles.liveRegion} aria-live="polite" aria-atomic="true">
        {interactive ? liveMessage : ''}
      </div>
    </figure>
  );
}

export type {
  ChartAxisConfig,
  ChartDataPoint,
  ChartLegendItem,
  ChartMark,
  ChartSeries,
  PointShape,
} from './types';
