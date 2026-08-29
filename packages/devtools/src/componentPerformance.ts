import type { UIEvent } from '@larose-ui/observability';

export interface ComponentPerformanceSummary {
  renderCount: number;
  lastRenderMs: number | null;
  avgRenderMs: number | null;
  threshold: string | null;
}

export function getComponentPerformance(events: UIEvent[]): ComponentPerformanceSummary {
  const perfEvents = events.filter((event) => event.type === 'performance');
  if (perfEvents.length === 0) {
    return {
      renderCount: 0,
      lastRenderMs: null,
      avgRenderMs: null,
      threshold: null,
    };
  }

  const renderTimes = perfEvents
    .map((event) => event.metadata?.renderTimeMs)
    .filter((value): value is number => typeof value === 'number');

  const last = perfEvents.at(-1);
  if (!last) {
    return {
      renderCount: 0,
      lastRenderMs: null,
      avgRenderMs: null,
      threshold: null,
    };
  }

  const lastRenderMs =
    typeof last.metadata?.renderTimeMs === 'number' ? last.metadata.renderTimeMs : null;
  const threshold =
    typeof last.metadata?.threshold === 'string' ? last.metadata.threshold : null;

  const avgRenderMs =
    renderTimes.length > 0
      ? renderTimes.reduce((sum, ms) => sum + ms, 0) / renderTimes.length
      : null;

  return {
    renderCount: perfEvents.length,
    lastRenderMs,
    avgRenderMs,
    threshold,
  };
}
