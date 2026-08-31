import type {
  CorrelatedFormFunnelMetrics,
  FormFunnelMetrics,
  JourneyContextSnapshot,
  JourneyStep,
  ObservabilityAdapter,
  ObservabilityConfig,
  RageClickAnalysis,
  UIEvent,
  UIEventType,
} from './types';
import { analyzeRageClick, correlateFormFunnel } from './correlation';
import { runtimeEventToJourneyStep, trackPageViewStep, uiEventToJourneyStep } from './journey';
import { sanitizeMetadata, sanitizeUIEvent } from './sanitize';
import type { RuntimeEvent } from '@larose-ui/core';

type EventListener = (event: UIEvent) => void;

interface FormSession {
  openedAt: number;
  fieldFocuses: number;
}

export class EventCollector {
  private events: UIEvent[] = [];
  private journey: JourneyStep[] = [];
  private rageAnalyses: RageClickAnalysis[] = [];
  private listeners = new Set<EventListener>();
  private formSessions = new Map<string, FormSession>();
  private completionTimes = new Map<string, number[]>();
  private counters = new Map<string, number>();
  private runtimeContext: JourneyContextSnapshot = {};

  constructor(
    private config: ObservabilityConfig = {},
    private adapter: ObservabilityAdapter = { track: () => undefined },
  ) {}

  setAdapter(adapter: ObservabilityAdapter): void {
    this.adapter = adapter;
  }

  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  track(partial: Omit<UIEvent, 'timestamp'> & { timestamp?: number }): UIEvent {
    const event: UIEvent = sanitizeUIEvent({
      ...partial,
      timestamp: partial.timestamp ?? Date.now(),
      tenant: partial.tenant ?? this.config.tenantId,
      user: partial.user ?? this.config.userId,
      sessionId: partial.sessionId ?? this.config.sessionId,
      metadata: sanitizeMetadata(partial.metadata),
    });

    const context = this.getContextSnapshot();
    if (event.type.startsWith('form.') && event.metadata) {
      event.metadata = { ...event.metadata, context };
    }

    this.events.push(event);
    this.appendJourney(uiEventToJourneyStep(event, context));
    this.incrementCounter(event.type);
    this.updateFormMetrics(event);

    if (event.type === 'rage_click') {
      const analysis = analyzeRageClick(event, this.events, this.journey);
      this.rageAnalyses.push(analysis);
      event.metadata = { ...event.metadata, rootCause: analysis.likelyCauses };
    }

    this.adapter.track(event);
    this.listeners.forEach((l) => l(event));

    if (this.config.debug) {
      console.debug('[laRose observability]', event.type, event.component, event.metadata);
    }

    return event;
  }

  ingestRuntimeEvent(event: RuntimeEvent, context?: JourneyContextSnapshot): void {
    if (context) {
      this.runtimeContext = { ...this.runtimeContext, ...context };
    }
    const step = runtimeEventToJourneyStep(event, this.getContextSnapshot());
    if (step) this.appendJourney(step);
  }

  trackPageView(pageName: string): JourneyStep {
    const step = trackPageViewStep(pageName, this.getContextSnapshot());
    this.appendJourney(step);
    return step;
  }

  setRuntimeContext(context: JourneyContextSnapshot): void {
    this.runtimeContext = { ...this.runtimeContext, ...context };
  }

  getJourney(limit?: number): JourneyStep[] {
    if (limit === undefined) return [...this.journey];
    return this.journey.slice(-limit);
  }

  getRageClickAnalyses(): RageClickAnalysis[] {
    return [...this.rageAnalyses];
  }

  getCorrelatedFormFunnel(formName: string): CorrelatedFormFunnelMetrics {
    const metrics = this.getFormFunnelMetrics(formName);
    return correlateFormFunnel(formName, metrics, this.events, this.journey);
  }

  getEvents(filter?: { component?: string; type?: UIEventType }): UIEvent[] {
    return this.events.filter((e) => {
      if (filter?.component && e.component !== filter.component) return false;
      if (filter?.type && e.type !== filter.type) return false;
      return true;
    });
  }

  getCounter(type: UIEventType | string): number {
    return this.counters.get(type) ?? 0;
  }

  getFormFunnelMetrics(formName: string): FormFunnelMetrics {
    const prefix = `form:${formName}:`;
    const opens = this.counters.get(`${prefix}form.opened`) ?? 0;
    const submissions = this.counters.get(`${prefix}form.submitted`) ?? 0;
    const successes = this.counters.get(`${prefix}form.success`) ?? 0;
    const errors = this.counters.get(`${prefix}form.error`) ?? 0;
    const abandonments = this.counters.get(`${prefix}form.abandoned`) ?? 0;
    const validationFailures =
      this.counters.get(`${prefix}form.validation_failed`) ?? 0;

    const times = this.completionTimes.get(formName) ?? [];
    const avgCompletionTimeMs =
      times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null;

    return {
      form: formName,
      opens,
      submissions,
      successes,
      errors,
      abandonments,
      validationFailures,
      openRate: opens,
      completionRate: opens > 0 ? successes / opens : 0,
      errorRate: submissions > 0 ? errors / submissions : 0,
      abandonmentRate: opens > 0 ? abandonments / opens : 0,
      avgCompletionTimeMs,
    };
  }

  exportMetrics(): { counters: Record<string, number>; forms: Record<string, FormFunnelMetrics> } {
    const counters: Record<string, number> = {};
    for (const [key, value] of this.counters.entries()) {
      counters[key] = value;
    }

    const formNames = new Set<string>();
    for (const key of this.counters.keys()) {
      const match = key.match(/^form:([^:]+):/);
      if (match?.[1]) formNames.add(match[1]);
    }

    const forms: Record<string, FormFunnelMetrics> = {};
    for (const name of formNames) {
      forms[name] = this.getFormFunnelMetrics(name);
    }

    return { counters, forms };
  }

  exportPrometheus(prefix = 'larose'): string {
    const lines: string[] = [];
    for (const [key, value] of this.counters.entries()) {
      const metric = key.replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${prefix}_${metric} ${value}`);
    }
    return lines.join('\n');
  }

  reset(): void {
    this.events = [];
    this.journey = [];
    this.rageAnalyses = [];
    this.counters.clear();
    this.formSessions.clear();
    this.completionTimes.clear();
    this.runtimeContext = {};
  }

  private getContextSnapshot(): JourneyContextSnapshot {
    return {
      tenant: this.runtimeContext.tenant ?? this.config.tenantId,
      session: this.runtimeContext.session ?? this.config.sessionId,
      network: this.runtimeContext.network,
    };
  }

  private appendJourney(step: JourneyStep): void {
    const max = this.config.maxJourneySteps ?? 200;
    this.journey.push(step);
    if (this.journey.length > max) {
      this.journey.shift();
    }
  }

  private incrementCounter(type: UIEventType): void {
    this.counters.set(type, (this.counters.get(type) ?? 0) + 1);
  }

  private updateFormMetrics(event: UIEvent): void {
    const formKey = `form:${event.component}:`;
    this.counters.set(
      `${formKey}${event.type}`,
      (this.counters.get(`${formKey}${event.type}`) ?? 0) + 1,
    );

    if (event.type === 'form.opened') {
      this.formSessions.set(event.component, {
        openedAt: event.timestamp,
        fieldFocuses: 0,
      });
    }

    if (event.type === 'form.success') {
      const session = this.formSessions.get(event.component);
      if (session) {
        const duration = event.timestamp - session.openedAt;
        const times = this.completionTimes.get(event.component) ?? [];
        times.push(duration);
        this.completionTimes.set(event.component, times);
      }
    }
  }
}

let globalCollector: EventCollector | null = null;

export function createEventCollector(config?: ObservabilityConfig): EventCollector {
  const collector = new EventCollector(config, config?.adapter);
  return collector;
}

export function getGlobalCollector(): EventCollector {
  if (!globalCollector) {
    globalCollector = createEventCollector();
  }
  return globalCollector;
}

export function setGlobalCollector(collector: EventCollector): void {
  globalCollector = collector;
}
