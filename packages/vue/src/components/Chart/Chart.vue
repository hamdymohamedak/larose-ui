<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
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

const props = withDefaults(
  defineProps<{
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
    style?: CSSProperties;
  }>(),
  {
    mark: 'bar',
    height: 220,
    stacked: false,
  },
);

const width = 640;
const padding = DEFAULT_PADDING;
const plotWidth = computed(() => width - padding.left - padding.right);
const plotHeight = computed(() => props.height - padding.top - padding.bottom);

const resolvedSeries = computed<ChartSeries[]>(() => {
  if (props.series?.length) return props.series;
  if (props.data?.length) return [{ id: 'default', label: 'Value', data: props.data }];
  return [];
});

const categories = computed(() => collectXValues(resolvedSeries.value));
const yValues = computed(() => collectYValues(resolvedSeries.value));
const yDomain = computed(() =>
  resolveYDomain(yValues.value, undefined, undefined, props.mark),
);
const yTicks = computed(() => niceTicks(yDomain.value.min, yDomain.value.max, 5));

const effectiveShowPoints = computed(
  () => props.showPoints ?? props.mark === 'line',
);

function seriesColor(index: number, override?: string): string {
  return (
    override ??
    CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] ??
    'var(--lr-chart-series-1)'
  );
}

const legendItems = computed<ChartLegendItem[]>(() =>
  resolvedSeries.value.map((s, i) => ({
    id: s.id,
    label: s.label,
    color: seriesColor(i, s.color),
    shape: s.pointShape ?? 'circle',
  })),
);

const shouldShowLegend = computed(
  () =>
    props.showLegend ??
    (resolvedSeries.value.length > 1 || props.mark === 'point'),
);

const barStep = computed(() =>
  categories.value.length > 0
    ? plotWidth.value / categories.value.length
    : plotWidth.value,
);
const barWidth = computed(() => Math.max(4, barStep.value * 0.62));

interface BarRect {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stacked?: boolean;
}

const barRects = computed<BarRect[]>(() => {
  if (props.mark !== 'bar') return [];
  const result: BarRect[] = [];
  const cats = categories.value;
  const domain = yDomain.value;
  const bw = barWidth.value;
  const series = resolvedSeries.value;

  if (props.stacked && series.length > 1) {
    for (let catIndex = 0; catIndex < cats.length; catIndex++) {
      const cat = cats[catIndex]!;
      const cx = xBandIndex(cat, cats, width, padding);
      let runningTotal = 0;
      series.forEach((s, seriesIndex) => {
        const point = s.data.find((d) => String(d.x) === String(cat));
        const value = point?.y ?? 0;
        if (value <= 0) return;
        const color = seriesColor(seriesIndex, s.color);
        const yTop = yToPixel(runningTotal + value, domain.min, domain.max, props.height, padding);
        const yBottom = yToPixel(runningTotal, domain.min, domain.max, props.height, padding);
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

  series.forEach((s, seriesIndex) => {
    const offset =
      series.length > 1
        ? (seriesIndex - (series.length - 1) / 2) * (bw / series.length)
        : 0;
    const sliceWidth = series.length > 1 ? bw / series.length - 2 : bw;
    const color = seriesColor(seriesIndex, s.color);
    s.data.forEach((point) => {
      const cx = xBandIndex(point.x, cats, width, padding) + offset;
      const yBase = yToPixel(0, domain.min, domain.max, props.height, padding);
      const yTop = yToPixel(point.y, domain.min, domain.max, props.height, padding);
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

const lineSeries = computed<LineSeriesDraw[]>(() => {
  if (props.mark !== 'line') return [];
  const cats = categories.value;
  const domain = yDomain.value;
  return resolvedSeries.value.map((s, seriesIndex) => {
    const color = seriesColor(seriesIndex, s.color);
    const points = s.data.map((point) => ({
      x: xBandIndex(point.x, cats, width, padding),
      y: yToPixel(point.y, domain.min, domain.max, props.height, padding),
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

const pointMarks = computed<PointDraw[]>(() => {
  if (props.mark !== 'point') return [];
  const cats = categories.value;
  const domain = yDomain.value;
  return resolvedSeries.value.flatMap((s, seriesIndex) => {
    const color = seriesColor(seriesIndex, s.color);
    const shape = s.pointShape ?? (seriesIndex === 0 ? 'circle' : 'diamond');
    return s.data.map((point, i) => ({
      key: `${s.id}-${i}`,
      cx: xBandIndex(point.x, cats, width, padding),
      cy: yToPixel(point.y, domain.min, domain.max, props.height, padding),
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

<template>
  <figure :class="cn(styles.chart, props.class)" :style="props.style">
    <header v-if="title || subtitle || annotation" :class="styles.header">
      <h3 v-if="title" :class="styles.title">{{ title }}</h3>
      <p v-if="subtitle" :class="styles.subtitle">{{ subtitle }}</p>
      <p v-if="annotation" :class="styles.annotation">{{ annotation }}</p>
    </header>

    <div :class="styles.plotWrapper">
      <svg
        :class="styles.plot"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="title ?? 'Chart'"
      >
        <rect
          :x="padding.left"
          :y="padding.top"
          :width="plotWidth"
          :height="plotHeight"
          fill="var(--lr-chart-plot-bg)"
        />

        <g v-for="tick in yTicks" :key="tick">
          <line
            :class="styles.gridLine"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="yToPixel(tick, yDomain.min, yDomain.max, height, padding)"
            :y2="yToPixel(tick, yDomain.min, yDomain.max, height, padding)"
          />
          <text
            :class="styles.axisLabel"
            :x="padding.left - 8"
            :y="yToPixel(tick, yDomain.min, yDomain.max, height, padding) + 4"
            text-anchor="end"
          >
            {{ formatDefaultNumber(tick) }}
          </text>
        </g>

        <line
          :class="styles.axisLine"
          :x1="padding.left"
          :x2="width - padding.right"
          :y1="height - padding.bottom"
          :y2="height - padding.bottom"
        />
        <line
          :class="styles.axisLine"
          :x1="padding.left"
          :x2="padding.left"
          :y1="padding.top"
          :y2="height - padding.bottom"
        />

        <g v-for="cat in categories" :key="String(cat)">
          <line
            :class="styles.tick"
            :x1="xBandIndex(cat, categories, width, padding)"
            :x2="xBandIndex(cat, categories, width, padding)"
            :y1="height - padding.bottom"
            :y2="height - padding.bottom + 4"
          />
          <text
            :class="styles.axisLabel"
            :x="xBandIndex(cat, categories, width, padding)"
            :y="height - padding.bottom + 16"
            text-anchor="middle"
          >
            {{ String(cat) }}
          </text>
        </g>

        <template v-if="mark === 'bar'">
          <rect
            v-for="bar in barRects"
            :key="bar.key"
            :class="cn(styles.bar, bar.stacked ? styles.barSegment : undefined)"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="4"
            :fill="bar.fill"
          />
        </template>

        <template v-else-if="mark === 'line'">
          <g v-for="line in lineSeries" :key="line.id">
            <path :class="styles.line" :d="line.path" :stroke="line.color" />
            <template v-if="effectiveShowPoints">
              <template v-for="(p, i) in line.points" :key="`${line.id}-pt-${i}`">
                <polygon
                  v-if="line.shape === 'diamond'"
                  :class="styles.point"
                  :points="diamondPoints(p.x, p.y, 4.5)"
                  :fill="line.color"
                />
                <rect
                  v-else-if="line.shape === 'square'"
                  :class="styles.point"
                  :x="p.x - 4.5"
                  :y="p.y - 4.5"
                  width="9"
                  height="9"
                  rx="1"
                  :fill="line.color"
                />
                <circle
                  v-else
                  :class="styles.point"
                  :cx="p.x"
                  :cy="p.y"
                  r="4.5"
                  :fill="line.color"
                />
              </template>
            </template>
          </g>
        </template>

        <template v-else-if="mark === 'point'">
          <template v-for="pt in pointMarks" :key="pt.key">
            <polygon
              v-if="pt.shape === 'diamond'"
              :class="styles.point"
              :points="diamondPoints(pt.cx, pt.cy, pt.r)"
              :fill="pt.color"
            />
            <rect
              v-else-if="pt.shape === 'square'"
              :class="styles.point"
              :x="pt.cx - pt.r"
              :y="pt.cy - pt.r"
              :width="pt.r * 2"
              :height="pt.r * 2"
              rx="1"
              :fill="pt.color"
            />
            <circle
              v-else
              :class="styles.point"
              :cx="pt.cx"
              :cy="pt.cy"
              :r="pt.r"
              :fill="pt.color"
            />
          </template>
        </template>
      </svg>
    </div>

    <ul v-if="shouldShowLegend" :class="styles.legend" aria-hidden="true">
      <li v-for="item in legendItems" :key="item.id" :class="styles.legendItem">
        <span
          :class="styles.legendSwatch"
          :data-shape="item.shape"
          :style="{ backgroundColor: item.color }"
        />
        {{ item.label }}
      </li>
    </ul>
  </figure>
</template>
