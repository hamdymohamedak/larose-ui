import type { ObservabilityAdapter, UIEvent } from './types';

export function createNoopAdapter(): ObservabilityAdapter {
  return { track: () => undefined };
}

export function createConsoleAdapter(prefix = '[laRose]'): ObservabilityAdapter {
  return {
    track(event: UIEvent) {
      const style =
        event.type.includes('error') || event.type === 'rage_click'
          ? 'color: #dc2626'
          : event.type === 'performance'
            ? 'color: #2563eb'
            : 'color: #64748b';

      console.log(`%c${prefix} ${event.type}`, style, {
        component: event.component,
        metadata: event.metadata,
        timestamp: new Date(event.timestamp).toISOString(),
      });
    },
  };
}

export function createWebhookAdapter(
  url: string,
  options?: { batchSize?: number; flushIntervalMs?: number },
): ObservabilityAdapter {
  const batch: UIEvent[] = [];
  const batchSize = options?.batchSize ?? 10;

  const flush = async () => {
    if (batch.length === 0) return;
    const payload = batch.splice(0, batch.length);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: payload }),
    });
  };

  if (options?.flushIntervalMs) {
    setInterval(() => void flush(), options.flushIntervalMs);
  }

  return {
    track(event: UIEvent) {
      batch.push(event);
      if (batch.length >= batchSize) void flush();
    },
    flush,
  };
}

export function createCompositeAdapter(...adapters: ObservabilityAdapter[]): ObservabilityAdapter {
  return {
    track(event) {
      adapters.forEach((a) => a.track(event));
    },
    async flush() {
      await Promise.all(adapters.map((a) => a.flush?.()));
    },
  };
}

interface SentryLike {
  captureMessage(message: string, level?: string): void;
  captureException(error: Error): void;
  setTag(key: string, value: string): void;
}

export interface SentryAdapterOptions {
  /** Use a loaded Sentry SDK instance instead of `globalThis.Sentry`. */
  sentry?: SentryLike;
  environment?: string;
  tenant?: string;
}

export function createSentryAdapter(options: SentryAdapterOptions = {}): ObservabilityAdapter {
  const resolveSentry = (): SentryLike | undefined =>
    options.sentry ??
    (globalThis as typeof globalThis & { Sentry?: SentryLike }).Sentry;

  return {
    track(event) {
      const sentry = resolveSentry();
      if (!sentry) return;

      if (options.environment) sentry.setTag('environment', options.environment);
      if (options.tenant ?? event.tenant) {
        sentry.setTag('tenant', options.tenant ?? event.tenant ?? 'unknown');
      }
      sentry.setTag('component', event.component);
      sentry.setTag('event_type', event.type);

      if (event.type === 'error') {
        const message =
          typeof event.metadata?.message === 'string'
            ? event.metadata.message
            : `UI error in ${event.component}`;
        sentry.captureMessage(message, 'error');
        return;
      }

      if (event.type === 'rage_click' || event.type === 'dead_button') {
        sentry.captureMessage(`${event.type} on ${event.component}`, 'warning');
        return;
      }

      if (event.type === 'performance') {
        const threshold = event.metadata?.threshold;
        if (threshold === 'slow' || threshold === 'critical') {
          sentry.captureMessage(
            `Slow render: ${event.component} (${String(event.metadata?.renderTime ?? '?')}ms)`,
            'warning',
          );
        }
      }
    },
  };
}
