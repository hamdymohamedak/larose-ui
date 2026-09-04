import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {
  createEventCollector,
  type EventCollector,
} from '@larose-ui/observability-core';
import type {
  FormFunnelMetrics,
  ObservabilityAdapter,
  ObservabilityConfig,
  UIEvent,
  UIEventType,
  CorrelatedFormFunnelMetrics,
  JourneyStep,
  RageClickAnalysis,
} from '@larose-ui/observability-core';

export interface ObservabilityContextValue {
  collector: EventCollector;
  track: (event: Omit<UIEvent, 'timestamp'> & { timestamp?: number }) => UIEvent;
  getFormFunnelMetrics: (formName: string) => FormFunnelMetrics;
  getCorrelatedFormFunnel: (formName: string) => CorrelatedFormFunnelMetrics;
  getJourney: (limit?: number) => JourneyStep[];
  getRageClickAnalyses: () => RageClickAnalysis[];
  trackPageView: (pageName: string) => JourneyStep;
  exportMetrics: () => { counters: Record<string, number>; forms: Record<string, FormFunnelMetrics> };
  exportPrometheus: () => string;
}

const ObservabilityContext = createContext<ObservabilityContextValue | null>(null);

export function useObservability(): ObservabilityContextValue {
  const ctx = useContext(ObservabilityContext);
  if (!ctx) {
    throw new Error('useObservability must be used within ObservabilityProvider');
  }
  return ctx;
}

export function useOptionalObservability(): ObservabilityContextValue | null {
  return useContext(ObservabilityContext);
}

export function useTrackEvent() {
  const { track } = useObservability();
  return track;
}

export interface ObservabilityProviderProps extends ObservabilityConfig {
  children: ReactNode;
  collector?: EventCollector;
}

export function ObservabilityProvider({
  children,
  adapter,
  tenantId,
  userId,
  sessionId,
  debug,
  collector: externalCollector,
}: ObservabilityProviderProps) {
  const collectorRef = useRef<EventCollector>(
    externalCollector ??
      createEventCollector({
        adapter,
        tenantId,
        userId,
        sessionId,
        debug,
      }),
  );
  const scopeRef = useRef(`${tenantId ?? ''}:${userId ?? ''}:${sessionId ?? ''}`);

  useEffect(() => {
    if (adapter) collectorRef.current.setAdapter(adapter);
  }, [adapter]);

  useEffect(() => {
    const scope = `${tenantId ?? ''}:${userId ?? ''}:${sessionId ?? ''}`;
    if (scopeRef.current !== scope) {
      collectorRef.current.reset();
      scopeRef.current = scope;
    }
  }, [tenantId, userId, sessionId]);

  const value = useMemo<ObservabilityContextValue>(
    () => ({
      collector: collectorRef.current,
      track: (event) => collectorRef.current.track(event),
      getFormFunnelMetrics: (formName) =>
        collectorRef.current.getFormFunnelMetrics(formName),
      getCorrelatedFormFunnel: (formName) =>
        collectorRef.current.getCorrelatedFormFunnel(formName),
      getJourney: (limit) => collectorRef.current.getJourney(limit),
      getRageClickAnalyses: () => collectorRef.current.getRageClickAnalyses(),
      trackPageView: (pageName) => collectorRef.current.trackPageView(pageName),
      exportMetrics: () => collectorRef.current.exportMetrics(),
      exportPrometheus: () => collectorRef.current.exportPrometheus(),
    }),
    [],
  );

  return (
    <ObservabilityContext.Provider value={value}>{children}</ObservabilityContext.Provider>
  );
}

export interface ObservedErrorBoundaryProps {
  name: string;
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface BoundaryState {
  error: Error | null;
}

export class ObservedErrorBoundary extends Component<
  ObservedErrorBoundaryProps & { track?: ObservabilityContextValue['track'] },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static contextType = ObservabilityContext;

  declare context: ObservabilityContextValue | null;

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    const track = this.props.track ?? this.context?.track;
    track?.({
      type: 'error',
      component: this.props.name,
      metadata: {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      },
    });
  }

  render() {
    if (this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }
      return (
        this.props.fallback ?? (
          <div role="alert" data-lr-error-boundary={this.props.name}>
            Something went wrong in {this.props.name}.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function ObservedErrorBoundaryWithContext(props: ObservedErrorBoundaryProps) {
  const { track } = useObservability();
  return <ObservedErrorBoundary {...props} track={track} />;
}

export interface ObservedComponentProps {
  name: string;
  children: ReactNode;
  metadata?: Record<string, unknown>;
}

export function ObservedComponent({ name, children, metadata }: ObservedComponentProps) {
  const { track } = useObservability();
  const startRef = useRef(performance.now());
  const warnedRef = useRef(false);

  useEffect(() => {
    const renderTimeMs = performance.now() - startRef.current;
    const threshold =
      renderTimeMs >= 50 ? 'critical' : renderTimeMs >= 16 ? 'slow' : 'ok';

    track({
      type: 'performance',
      component: name,
      metadata: { renderTimeMs, threshold, ...metadata },
    });

    if (threshold !== 'ok' && !warnedRef.current) {
      warnedRef.current = true;
      console.warn(
        `[laRose] Slow component: ${name} rendered in ${renderTimeMs.toFixed(1)}ms (${threshold})`,
      );
    }
  });

  return <div data-lr-observed={name}>{children}</div>;
}

export interface ObservedFormProps {
  name: string;
  children: ReactNode;
  onAbandon?: () => void;
}

export function ObservedForm({ name, children, onAbandon }: ObservedFormProps) {
  const { track, collector } = useObservability();
  const openedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    return collector.subscribe((event) => {
      if (
        event.component === name &&
        (event.type === 'form.submitted' || event.type === 'form.success')
      ) {
        completedRef.current = true;
      }
    });
  }, [collector, name]);

  useEffect(() => {
    if (!openedRef.current) {
      openedRef.current = true;
      track({ type: 'form.opened', component: name });
    }

    return () => {
      if (!completedRef.current) {
        track({ type: 'form.abandoned', component: name });
        onAbandon?.();
      }
    };
  }, [name, track, onAbandon]);

  const handleFocus = useCallback(
    (e: React.FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, select, textarea')) {
        track({
          type: 'form.field_focused',
          component: name,
          metadata: { field: target.getAttribute('name') ?? undefined },
        });
      }
    },
    [name, track],
  );

  return (
    <div data-lr-observed-form={name} onFocusCapture={handleFocus}>
      {children}
    </div>
  );
}

export function markFormSubmitted(name: string, track: ObservabilityContextValue['track']) {
  track({ type: 'form.submitted', component: name });
}

export function trackFormSuccess(name: string, track: ObservabilityContextValue['track']) {
  track({ type: 'form.success', component: name });
}

export function trackFormError(
  name: string,
  track: ObservabilityContextValue['track'],
  error?: string,
) {
  track({ type: 'form.error', component: name, metadata: { error } });
}

export function trackFormValidationFailed(
  name: string,
  track: ObservabilityContextValue['track'],
  fields: string[],
) {
  track({
    type: 'form.validation_failed',
    component: name,
    metadata: { fields },
  });
}

export function useInteractionObserver(component: string) {
  const { track } = useObservability();
  const clicksRef = useRef<number[]>([]);

  const onClick = useCallback(
    (e: React.MouseEvent, metadata?: Record<string, unknown>) => {
      const now = Date.now();
      clicksRef.current = clicksRef.current.filter((t) => now - t < 1000);
      clicksRef.current.push(now);

      track({
        type: 'interaction',
        component,
        metadata: { target: (e.target as HTMLElement).tagName, ...metadata },
      });

      if (clicksRef.current.length >= 3) {
        track({
          type: 'rage_click',
          component,
          metadata: { clickCount: clicksRef.current.length },
        });
        clicksRef.current = [];
      }
    },
    [component, track],
  );

  const trackDeadButton = useCallback(
    (reason: string) => {
      track({ type: 'dead_button', component, metadata: { reason } });
    },
    [component, track],
  );

  const trackRetry = useCallback(
    (metadata?: Record<string, unknown>) => {
      track({ type: 'retry', component, metadata });
    },
    [component, track],
  );

  const trackRetrySuccess = useCallback(() => {
    track({ type: 'retry.success', component });
  }, [component, track]);

  return { onClick, trackDeadButton, trackRetry, trackRetrySuccess };
}

/** Record a page view in the user journey trajectory. */
export function useJourneyPage(pageName: string): void {
  const observability = useContext(ObservabilityContext);
  useEffect(() => {
    observability?.trackPageView(pageName);
  }, [pageName, observability]);
}

export type { UIEvent, UIEventType, ObservabilityAdapter, FormFunnelMetrics };
