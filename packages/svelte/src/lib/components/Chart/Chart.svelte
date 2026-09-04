<script lang="ts">
  import { CHART_SERIES_COLORS } from '@larose-ui/tokens';
  import styles from '@larose-ui/styles/components/Chart/Chart.module.css';
  import { cn } from '../../utils/cn';
  import type {
    ChartDataPoint,
    ChartLegendItem,
    ChartMark,
    ChartSeries,
    PointShape,
  } from '../../Chart/types';
  import {
    DEFAULT_PADDING,
    buildLinePath,
    collectXValues,
    collectYValues,
    formatDefaultNumber,
    niceTicks,
    resolveYDomain,
    xBandIndex,
    yToPixel,
  } from '../../Chart/utils';

  interface Props {
    mark?: ChartMark;
    data?: ChartDataPoint[];
    series?: ChartSeries[];
    title?: string;
    subtitle?: string;
    annotation?: string;
    height?: number;
    showPoints?: boolean;
    stacked?: boolean;
    showLegend?: boolean;
    class?: string;
    style?: string;
  }

  let {
    mark = 'bar',
    data,
    series,
    title,
    subtitle,
    annotation,
    height = 220,
    showPoints,
    stacked = false,
    showLegend,
    class: className,
    style,
  }: Props = $props();

  const width = 640;
  const padding = DEFAULT_PADDING;

  const resolvedSeries = $derived.by((): ChartSeries[] => {
    if (series?.length) return series;
    if (data?.length) return [{ id: 'default', label: 'Value', data }];
    return [];
  });

  const plotWidth = $derived(width - padding.left - padding.right);
  const plotHeight = $derived(height - padding.top - padding.bottom);
  const categories = $derived(collectXValues(resolvedSeries));
  const yValues = $derived(collectYValues(resolvedSeries));
  const yDomain = $derived(resolveYDomain(yValues, undefined, undefined, mark));
  const yTicks = $derived(niceTicks(yDomain.min, yDomain.max, 5));
  const effectiveShowPoints = $derived(showPoints ?? mark === 'line');

  function seriesColor(index: number, override?: string): string {
    return (
      override ??
      CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] ??
      'var(--lr-chart-series-1)'
    );
  }

  const legendItems = $derived.by((): ChartLegendItem[] =>
    resolvedSeries.map((s, i) => ({
      id: s.id,
      label: s.label,
      color: seriesColor(i, s.color),
      shape: s.pointShape ?? 'circle',
    })),
  );

  const shouldShowLegend = $derived(
    showLegend ?? (resolvedSeries.length > 1 || mark === 'point'),
  );

  const barStep = $derived(
    categories.length > 0 ? plotWidth / categories.length : plotWidth,
  );
  const barWidth = $derived(Math.max(4, barStep * 0.62));

  interface BarRect {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stacked?: boolean;
  }

  const barRects = $derived.by((): BarRect[] => {
    if (mark !== 'bar') return [];
    const result: BarRect[] = [];
    const cats = categories;
    const domain = yDomain;
    const bw = barWidth;
    const entries = resolvedSeries;

    if (stacked && entries.length > 1) {
      for (let catIndex = 0; catIndex < cats.length; catIndex++) {
        const cat = cats[catIndex]!;
        const cx = xBandIndex(cat, cats, width, padding);
        let runningTotal = 0;
        entries.forEach((s, seriesIndex) => {
          const point = s.data.find((d) => String(d.x) === String(cat));
          const value = point?.y ?? 0;
          if (value <= 0) return;
          const color = seriesColor(seriesIndex, s.color);
          const yTop = yToPixel(runningTotal + value, domain.min, domain.max, height, padding);
          const yBottom = yToPixel(runningTotal, domain.min, domain.max, height, padding);
          const segmentHeight = Math.max(0, yBottom - yTop - (seriesIndex > 0 ? 2 : 0));
          const y = yTop + (seriesIndex > 0 ? 2 : 0);
          runningTotal += value;
          result.push({
            key: `${s.id}-${catIndex}`,
            x: cx - bw / 2,
            y,
            width: bw,
            height: segmentHeight,
            fill: color,
            stacked: true,
          });
        });
      }
      return result;
    }

    entries.forEach((s, seriesIndex) => {
      const offset =
        entries.length > 1
          ? (seriesIndex - (entries.length - 1) / 2) * (bw / entries.length)
          : 0;
      const sliceWidth = entries.length > 1 ? bw / entries.length - 2 : bw;
      const color = seriesColor(seriesIndex, s.color);
      s.data.forEach((point) => {
        const cx = xBandIndex(point.x, cats, width, padding) + offset;
        const yBase = yToPixel(0, domain.min, domain.max, height, padding);
        const yTop = yToPixel(point.y, domain.min, domain.max, height, padding);
        result.push({
          key: `${s.id}-${String(point.x)}`,
          x: cx - sliceWidth / 2,
          y: yTop,
          width: sliceWidth,
          height: Math.max(0, yBase - yTop),
          fill: color,
        });
      });
    });
    return result;
  });

  interface LineSeriesDraw {
    id: string;
    color: string;
    path: string;
    points: Array<{ x: number; y: number }>;
    shape: PointShape;
  }

  const lineSeries = $derived.by((): LineSeriesDraw[] => {
    if (mark !== 'line') return [];
    const cats = categories;
    const domain = yDomain;
    return resolvedSeries.map((s, seriesIndex) => {
      const color = seriesColor(seriesIndex, s.color);
      const points = s.data.map((point) => ({
        x: xBandIndex(point.x, cats, width, padding),
        y: yToPixel(point.y, domain.min, domain.max, height, padding),
      }));
      return {
        id: s.id,
        color,
        path: buildLinePath(points),
        points,
        shape: s.pointShape ?? 'circle',
      };
    });
  });

  interface PointDraw {
    key: string;
    cx: number;
    cy: number;
    color: string;
    shape: PointShape;
    r: number;
  }

  const pointMarks = $derived.by((): PointDraw[] => {
    if (mark !== 'point') return [];
    const cats = categories;
    const domain = yDomain;
    return resolvedSeries.flatMap((s, seriesIndex) => {
      const color = seriesColor(seriesIndex, s.color);
      const shape = s.pointShape ?? (seriesIndex === 0 ? 'circle' : 'diamond');
      return s.data.map((point, i) => ({
        key: `${s.id}-${i}`,
        cx: xBandIndex(point.x, cats, width, padding),
        cy: yToPixel(point.y, domain.min, domain.max, height, padding),
        color,
        shape,
        r: 5,
      }));
    });
  });

  function diamondPoints(cx: number, cy: number, r: number): string {
    return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
  }
</script>

<figure class={cn(styles.chart, className)} {style}>
  {#if title || subtitle || annotation}
    <header class={styles.header}>
      {#if title}<h3 class={styles.title}>{title}</h3>{/if}
      {#if subtitle}<p class={styles.subtitle}>{subtitle}</p>{/if}
      {#if annotation}<p class={styles.annotation}>{annotation}</p>{/if}
    </header>
  {/if}

  <div class={styles.plotWrapper}>
    <svg class={styles.plot} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? 'Chart'}>
      <rect
        x={padding.left}
        y={padding.top}
        width={plotWidth}
        height={plotHeight}
        fill="var(--lr-chart-plot-bg)"
      />

      {#each yTicks as tick (tick)}
        <g>
          <line
            class={styles.gridLine}
            x1={padding.left}
            x2={width - padding.right}
            y1={yToPixel(tick, yDomain.min, yDomain.max, height, padding)}
            y2={yToPixel(tick, yDomain.min, yDomain.max, height, padding)}
          />
          <text
            class={styles.axisLabel}
            x={padding.left - 8}
            y={yToPixel(tick, yDomain.min, yDomain.max, height, padding) + 4}
            text-anchor="end"
          >
            {formatDefaultNumber(tick)}
          </text>
        </g>
      {/each}

      <line
        class={styles.axisLine}
        x1={padding.left}
        x2={width - padding.right}
        y1={height - padding.bottom}
        y2={height - padding.bottom}
      />
      <line
        class={styles.axisLine}
        x1={padding.left}
        x2={padding.left}
        y1={padding.top}
        y2={height - padding.bottom}
      />

      {#each categories as cat (String(cat))}
        <g>
          <line
            class={styles.tick}
            x1={xBandIndex(cat, categories, width, padding)}
            x2={xBandIndex(cat, categories, width, padding)}
            y1={height - padding.bottom}
            y2={height - padding.bottom + 4}
          />
          <text
            class={styles.axisLabel}
            x={xBandIndex(cat, categories, width, padding)}
            y={height - padding.bottom + 16}
            text-anchor="middle"
          >
            {String(cat)}
          </text>
        </g>
      {/each}

      {#if mark === 'bar'}
        {#each barRects as bar (bar.key)}
          <rect
            class={cn(styles.bar, bar.stacked ? styles.barSegment : undefined)}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            rx={4}
            fill={bar.fill}
          />
        {/each}
      {:else if mark === 'line'}
        {#each lineSeries as line (line.id)}
          <g>
            <path class={styles.line} d={line.path} stroke={line.color} />
            {#if effectiveShowPoints}
              {#each line.points as p, i (`${line.id}-pt-${i}`)}
                {#if line.shape === 'diamond'}
                  <polygon
                    class={styles.point}
                    points={diamondPoints(p.x, p.y, 4.5)}
                    fill={line.color}
                  />
                {:else if line.shape === 'square'}
                  <rect
                    class={styles.point}
                    x={p.x - 4.5}
                    y={p.y - 4.5}
                    width={9}
                    height={9}
                    rx={1}
                    fill={line.color}
                  />
                {:else}
                  <circle class={styles.point} cx={p.x} cy={p.y} r={4.5} fill={line.color} />
                {/if}
              {/each}
            {/if}
          </g>
        {/each}
      {:else if mark === 'point'}
        {#each pointMarks as pt (pt.key)}
          {#if pt.shape === 'diamond'}
            <polygon
              class={styles.point}
              points={diamondPoints(pt.cx, pt.cy, pt.r)}
              fill={pt.color}
            />
          {:else if pt.shape === 'square'}
            <rect
              class={styles.point}
              x={pt.cx - pt.r}
              y={pt.cy - pt.r}
              width={pt.r * 2}
              height={pt.r * 2}
              rx={1}
              fill={pt.color}
            />
          {:else}
            <circle class={styles.point} cx={pt.cx} cy={pt.cy} r={pt.r} fill={pt.color} />
          {/if}
        {/each}
      {/if}
    </svg>
  </div>

  {#if shouldShowLegend}
    <ul class={styles.legend} aria-hidden="true">
      {#each legendItems as item (item.id)}
        <li class={styles.legendItem}>
          <span
            class={styles.legendSwatch}
            data-shape={item.shape}
            style={`background-color:${item.color}`}
          ></span>
          {item.label}
        </li>
      {/each}
    </ul>
  {/if}
</figure>
