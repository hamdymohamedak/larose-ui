export type UIEventType =
  | 'form.opened'
  | 'form.field_focused'
  | 'form.validation_failed'
  | 'form.submitted'
  | 'form.abandoned'
  | 'form.success'
  | 'form.error'
  | 'interaction'
  | 'error'
  | 'performance'
  | 'rage_click'
  | 'dead_button'
  | 'permission.denied'
  | 'feature.exposed'
  | 'retry'
  | 'retry.success'
  | 'retry.abandoned';

export interface UIEvent {
  type: UIEventType;
  component: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  tenant?: string;
  user?: string;
  sessionId?: string;
}

export type PerformanceThreshold = 'ok' | 'slow' | 'critical';

export interface PerformanceEvent extends UIEvent {
  type: 'performance';
  metadata: {
    renderTimeMs: number;
    threshold: PerformanceThreshold;
    [key: string]: unknown;
  };
}

export interface FormFunnelMetrics {
  form: string;
  opens: number;
  submissions: number;
  successes: number;
  errors: number;
  abandonments: number;
  validationFailures: number;
  openRate: number;
  completionRate: number;
  errorRate: number;
  abandonmentRate: number;
  avgCompletionTimeMs: number | null;
}

export interface ObservabilityAdapter {
  track: (event: UIEvent) => void;
  flush?: () => void | Promise<void>;
}

export interface ObservabilityConfig {
  adapter?: ObservabilityAdapter;
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  debug?: boolean;
  slowRenderThresholdMs?: number;
  criticalRenderThresholdMs?: number;
  rageClickThreshold?: number;
  rageClickWindowMs?: number;
  /** Max journey steps retained in memory */
  maxJourneySteps?: number;
}

export type JourneyStepKind =
  | 'page.view'
  | 'ui.interaction'
  | 'ui.form'
  | 'ui.error'
  | 'ui.performance'
  | 'ui.rage_click'
  | 'runtime.network'
  | 'runtime.session'
  | 'runtime.api'
  | 'runtime.error';

export interface JourneyContextSnapshot {
  network?: string;
  session?: string;
  tenant?: string;
}

export interface JourneyStep {
  id: string;
  kind: JourneyStepKind;
  timestamp: number;
  component?: string;
  label: string;
  metadata?: Record<string, unknown>;
  context?: JourneyContextSnapshot;
}

export type RootCauseType =
  | 'error'
  | 'network'
  | 'dead_button'
  | 'permission.denied'
  | 'slow_render'
  | 'api_failure';

export interface RootCauseHint {
  type: RootCauseType;
  label: string;
  timestamp: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface RageClickAnalysis {
  component: string;
  timestamp: number;
  clickCount: number;
  likelyCauses: RootCauseHint[];
}

export interface CorrelatedFormFunnelMetrics extends FormFunnelMetrics {
  /** Runtime context when the most recent form session opened */
  lastOpenContext?: JourneyContextSnapshot;
  /** Derived drop-off signals from correlated UX events */
  dropOffSignals: string[];
}

export function classifyRenderTime(
  ms: number,
  slow = 16,
  critical = 50,
): PerformanceThreshold {
  if (ms >= critical) return 'critical';
  if (ms >= slow) return 'slow';
  return 'ok';
}
