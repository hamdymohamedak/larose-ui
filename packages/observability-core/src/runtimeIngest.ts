import type { RuntimeEvent } from '@larose-ui/core';
import type { EventCollector } from './collector';
import type { JourneyContextSnapshot } from './types';

export function ingestRuntimeEvent(
  collector: EventCollector,
  event: RuntimeEvent,
  context?: JourneyContextSnapshot,
): void {
  collector.ingestRuntimeEvent(event, context);
}

export function createApiRuntimeEvent(
  phase: 'request' | 'response',
  detail: { url?: string; method?: string; status?: number; ok?: boolean },
): RuntimeEvent {
  if (phase === 'request') {
    return {
      type: 'api.request',
      timestamp: Date.now(),
      metadata: {
        url: detail.url,
        method: detail.method ?? 'GET',
      },
    };
  }

  return {
    type: 'api.response',
    timestamp: Date.now(),
    metadata: {
      url: detail.url,
      method: detail.method ?? 'GET',
      status: detail.status,
      ok: detail.ok,
    },
  };
}
