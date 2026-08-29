import { useEffect } from 'react';
import { createApiRuntimeEvent, useObservability } from '@larose/observability';
import { useRuntime } from '../runtime/useRuntime';
import { useRuntimeStore } from '../runtime/RuntimeContextProvider';

/**
 * Correlates runtime event bus + API lifecycle signals with the UX observability collector.
 * Mount inside LaRoseProvider after RuntimeBridge.
 */
export function RuntimeObservabilityBridge() {
  const { eventBus } = useRuntimeStore();
  const runtime = useRuntime();
  const { collector } = useObservability();

  useEffect(() => {
    collector.setRuntimeContext({
      network: runtime.network.condition,
      session: runtime.session,
      tenant: runtime.tenant?.id,
    });
  }, [collector, runtime.network.condition, runtime.session, runtime.tenant?.id]);

  useEffect(() => {
    return eventBus.subscribe((event) => {
      collector.ingestRuntimeEvent(event, {
        network: runtime.network.condition,
        session: runtime.session,
        tenant: runtime.tenant?.id,
      });
    });
  }, [
    collector,
    eventBus,
    runtime.network.condition,
    runtime.session,
    runtime.tenant?.id,
  ]);

  useEffect(() => {
    const onApiRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ url?: string; method?: string }>).detail ?? {};
      collector.ingestRuntimeEvent(
        createApiRuntimeEvent('request', detail),
        {
          network: runtime.network.condition,
          session: runtime.session,
          tenant: runtime.tenant?.id,
        },
      );
    };

    const onApiResponse = (event: Event) => {
      const detail =
        (event as CustomEvent<{ url?: string; method?: string; status?: number; ok?: boolean }>)
          .detail ?? {};
      collector.ingestRuntimeEvent(
        createApiRuntimeEvent('response', detail),
        {
          network: runtime.network.condition,
          session: runtime.session,
          tenant: runtime.tenant?.id,
        },
      );
    };

    window.addEventListener('larose:api-request', onApiRequest);
    window.addEventListener('larose:api-response', onApiResponse);
    return () => {
      window.removeEventListener('larose:api-request', onApiRequest);
      window.removeEventListener('larose:api-response', onApiResponse);
    };
  }, [collector, runtime.network.condition, runtime.session, runtime.tenant?.id]);

  return null;
}
