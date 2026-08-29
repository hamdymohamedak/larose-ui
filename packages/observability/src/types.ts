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
