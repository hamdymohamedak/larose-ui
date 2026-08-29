export type RuntimeEventType =
  | 'runtime.mounted'
  | 'runtime.updated'
  | 'runtime.tenant.changed'
  | 'session.transition'
  | 'network.transition'
  | 'permission.checked'
  | 'feature.evaluated'
  | 'offline.transition'
  | 'environment.changed'
  | 'api.request'
  | 'api.response'
  | 'error'
  | 'component.mounted'
  | 'component.rendered'
  | 'user.interaction';

export interface RuntimeEvent<T extends Record<string, unknown> = Record<string, unknown>> {
  type: RuntimeEventType;
  timestamp: number;
  component?: string;
  metadata?: T;
}

export interface RuntimeEventBus {
  emit(event: Omit<RuntimeEvent, 'timestamp'> & { timestamp?: number }): RuntimeEvent;
  subscribe(listener: (event: RuntimeEvent) => void): () => void;
  getTimeline(limit?: number): RuntimeEvent[];
  clear(): void;
}

export interface RuntimeEventBusOptions {
  maxEvents?: number;
}

export function createRuntimeEventBus(
  options: RuntimeEventBusOptions = {},
): RuntimeEventBus {
  const maxEvents = options.maxEvents ?? 500;
  const timeline: RuntimeEvent[] = [];
  const listeners = new Set<(event: RuntimeEvent) => void>();

  return {
    emit(event) {
      const full: RuntimeEvent = {
        ...event,
        timestamp: event.timestamp ?? Date.now(),
      };
      timeline.push(full);
      if (timeline.length > maxEvents) {
        timeline.shift();
      }
      listeners.forEach((listener) => listener(full));
      return full;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getTimeline(limit) {
      if (limit === undefined) return [...timeline];
      return timeline.slice(-limit);
    },

    clear() {
      timeline.length = 0;
    },
  };
}
