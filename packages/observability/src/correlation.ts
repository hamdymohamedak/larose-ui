import type {
  CorrelatedFormFunnelMetrics,
  FormFunnelMetrics,
  JourneyContextSnapshot,
  JourneyStep,
  RageClickAnalysis,
  RootCauseHint,
  UIEvent,
} from './types';

const DEFAULT_LOOKBACK_MS = 30_000;

export function analyzeRageClick(
  rageEvent: UIEvent,
  recentEvents: UIEvent[],
  recentJourney: JourneyStep[],
  lookbackMs = DEFAULT_LOOKBACK_MS,
): RageClickAnalysis {
  const component = rageEvent.component;
  const timestamp = rageEvent.timestamp;
  const windowStart = timestamp - lookbackMs;
  const clickCount =
    typeof rageEvent.metadata?.clickCount === 'number'
      ? rageEvent.metadata.clickCount
      : 3;

  const causes: RootCauseHint[] = [];

  for (const event of recentEvents) {
    if (event.timestamp < windowStart || event.timestamp > timestamp) continue;
    if (event.component !== component && !isGlobalSignal(event)) continue;

    const hint = eventToRootCause(event);
    if (hint) causes.push(hint);
  }

  for (const step of recentJourney) {
    if (step.timestamp < windowStart || step.timestamp > timestamp) continue;
    if (step.component && step.component !== component && step.kind !== 'runtime.network') {
      continue;
    }
    const hint = journeyStepToRootCause(step);
    if (hint) causes.push(hint);
  }

  const deduped = dedupeCauses(causes).sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return rank[a.confidence] - rank[b.confidence] || b.timestamp - a.timestamp;
  });

  return {
    component,
    timestamp,
    clickCount,
    likelyCauses: deduped.slice(0, 5),
  };
}

function isGlobalSignal(event: UIEvent): boolean {
  return event.type === 'permission.denied';
}

function eventToRootCause(event: UIEvent): RootCauseHint | null {
  switch (event.type) {
    case 'error':
      return {
        type: 'error',
        label: String(event.metadata?.message ?? 'Component error'),
        timestamp: event.timestamp,
        confidence: 'high',
      };
    case 'dead_button':
      return {
        type: 'dead_button',
        label: String(event.metadata?.reason ?? 'Dead button'),
        timestamp: event.timestamp,
        confidence: 'high',
      };
    case 'permission.denied':
      return {
        type: 'permission.denied',
        label: String(event.metadata?.permission ?? 'Permission denied'),
        timestamp: event.timestamp,
        confidence: 'medium',
      };
    case 'performance': {
      const threshold = event.metadata?.threshold;
      if (threshold === 'slow' || threshold === 'critical') {
        return {
          type: 'slow_render',
          label: `Slow render (${String(event.metadata?.renderTimeMs)}ms)`,
          timestamp: event.timestamp,
          confidence: threshold === 'critical' ? 'high' : 'medium',
        };
      }
      return null;
    }
    default:
      return null;
  }
}

function journeyStepToRootCause(step: JourneyStep): RootCauseHint | null {
  if (step.kind === 'runtime.network') {
    const to = step.metadata?.to;
    if (to === 'failed' || to === 'offline' || to === 'slow') {
      return {
        type: 'network',
        label: `Network degraded (${String(to)})`,
        timestamp: step.timestamp,
        confidence: to === 'failed' ? 'high' : 'medium',
      };
    }
  }

  if (step.kind === 'runtime.api') {
    const status = step.metadata?.status;
    if (typeof status === 'number' && status >= 400) {
      return {
        type: 'api_failure',
        label: `API ${status} ${String(step.metadata?.url ?? '')}`,
        timestamp: step.timestamp,
        confidence: status >= 500 ? 'high' : 'medium',
      };
    }
  }

  if (step.kind === 'runtime.error' || step.kind === 'ui.error') {
    return {
      type: 'error',
      label: step.label,
      timestamp: step.timestamp,
      confidence: 'high',
    };
  }

  return null;
}

function dedupeCauses(causes: RootCauseHint[]): RootCauseHint[] {
  const seen = new Set<string>();
  return causes.filter((cause) => {
    const key = `${cause.type}:${cause.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function correlateFormFunnel(
  formName: string,
  metrics: FormFunnelMetrics,
  events: UIEvent[],
  journey: JourneyStep[],
): CorrelatedFormFunnelMetrics {
  const formEvents = events.filter((event) => event.component === formName);
  const lastOpen = [...formEvents].reverse().find((event) => event.type === 'form.opened');
  const openJourney = lastOpen
    ? journey.find(
        (step) =>
          step.kind === 'ui.form' &&
          step.component === formName &&
          step.timestamp === lastOpen.timestamp,
      )
    : undefined;

  const dropOffSignals: string[] = [];

  if (metrics.abandonments > 0) {
    const hadValidation = formEvents.some((event) => event.type === 'form.validation_failed');
    const hadError = formEvents.some((event) => event.type === 'form.error');
    const hadNetwork = journey.some(
      (step) =>
        step.kind === 'runtime.network' &&
        step.timestamp >= (lastOpen?.timestamp ?? 0) &&
        (step.metadata?.to === 'failed' || step.metadata?.to === 'offline'),
    );

    if (hadValidation) dropOffSignals.push('validation_failures');
    if (hadError) dropOffSignals.push('form_errors');
    if (hadNetwork) dropOffSignals.push('network_degradation');
    if (dropOffSignals.length === 0) dropOffSignals.push('unknown_abandon');
  }

  return {
    ...metrics,
    lastOpenContext: openJourney?.context ??
      (lastOpen?.metadata?.context as JourneyContextSnapshot | undefined),
    dropOffSignals,
  };
}
