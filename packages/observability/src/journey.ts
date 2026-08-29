import type { RuntimeEvent } from '@larose/core';
import type { JourneyContextSnapshot, JourneyStep, JourneyStepKind, UIEvent } from './types';

let stepCounter = 0;

export function nextJourneyStepId(): string {
  stepCounter += 1;
  return `journey-${stepCounter}`;
}

export function resetJourneyStepIds(): void {
  stepCounter = 0;
}

const FORM_EVENTS = new Set([
  'form.opened',
  'form.field_focused',
  'form.validation_failed',
  'form.submitted',
  'form.abandoned',
  'form.success',
  'form.error',
]);

export function uiEventToJourneyStep(
  event: UIEvent,
  context?: JourneyContextSnapshot,
): JourneyStep {
  const journeyKind = event.metadata?.journeyKind;
  let kind: JourneyStepKind = 'ui.interaction';

  if (journeyKind === 'page.view') {
    kind = 'page.view';
  } else if (event.type === 'rage_click') {
    kind = 'ui.rage_click';
  } else if (event.type === 'error') {
    kind = 'ui.error';
  } else if (event.type === 'performance') {
    kind = 'ui.performance';
  } else if (FORM_EVENTS.has(event.type)) {
    kind = 'ui.form';
  } else if (event.type === 'interaction') {
    kind = 'ui.interaction';
  }

  return {
    id: nextJourneyStepId(),
    kind,
    timestamp: event.timestamp,
    component: event.component,
    label: formatUiLabel(event),
    metadata: event.metadata,
    context,
  };
}

export function runtimeEventToJourneyStep(
  event: RuntimeEvent,
  context?: JourneyContextSnapshot,
): JourneyStep | null {
  const kind = mapRuntimeKind(event.type);
  if (!kind) return null;

  return {
    id: nextJourneyStepId(),
    kind,
    timestamp: event.timestamp,
    component: event.component,
    label: formatRuntimeLabel(event),
    metadata: event.metadata,
    context,
  };
}

function mapRuntimeKind(type: RuntimeEvent['type']): JourneyStepKind | null {
  switch (type) {
    case 'network.transition':
      return 'runtime.network';
    case 'session.transition':
      return 'runtime.session';
    case 'api.request':
    case 'api.response':
      return 'runtime.api';
    case 'error':
      return 'runtime.error';
    default:
      return null;
  }
}

function formatUiLabel(event: UIEvent): string {
  if (event.metadata?.journeyKind === 'page.view') {
    return `Page: ${event.component}`;
  }
  if (event.type === 'rage_click') {
    const count = event.metadata?.clickCount;
    return `Rage click on ${event.component}${count ? ` (${count}x)` : ''}`;
  }
  if (event.type === 'performance') {
    const ms = event.metadata?.renderTimeMs;
    return `Render ${event.component}${typeof ms === 'number' ? ` (${ms.toFixed(1)}ms)` : ''}`;
  }
  if (event.type === 'error') {
    return `Error in ${event.component}`;
  }
  if (FORM_EVENTS.has(event.type)) {
    return `${event.type} · ${event.component}`;
  }
  return `${event.type} · ${event.component}`;
}

function formatRuntimeLabel(event: RuntimeEvent): string {
  switch (event.type) {
    case 'network.transition': {
      const from = event.metadata?.from;
      const to = event.metadata?.to;
      return `Network ${String(from)} → ${String(to)}`;
    }
    case 'session.transition':
      return `Session → ${String(event.metadata?.to ?? event.metadata?.state ?? 'unknown')}`;
    case 'api.request':
      return `API ${String(event.metadata?.method ?? 'GET')} ${String(event.metadata?.url ?? '')}`;
    case 'api.response': {
      const status = event.metadata?.status;
      return `API ${status ? `${status} ` : ''}${String(event.metadata?.url ?? '')}`;
    }
    case 'error':
      return `Runtime error${event.component ? ` · ${event.component}` : ''}`;
    default:
      return event.type;
  }
}

export function trackPageViewStep(
  pageName: string,
  context?: JourneyContextSnapshot,
): JourneyStep {
  return {
    id: nextJourneyStepId(),
    kind: 'page.view',
    timestamp: Date.now(),
    component: pageName,
    label: `Page: ${pageName}`,
    context,
  };
}
