import { onMounted, ref, watch } from 'vue';
import { useObservability, useOptionalObservability } from './context';

export function useInteractionObserver(component: string) {
  const { track } = useObservability();
  const clicks = ref<number[]>([]);

  function onClick(e: MouseEvent, metadata?: Record<string, unknown>) {
    const now = Date.now();
    clicks.value = clicks.value.filter((t) => now - t < 1000);
    clicks.value.push(now);

    track({
      type: 'interaction',
      component,
      metadata: { target: (e.target as HTMLElement).tagName, ...metadata },
    });

    if (clicks.value.length >= 3) {
      track({
        type: 'rage_click',
        component,
        metadata: { clickCount: clicks.value.length },
      });
      clicks.value = [];
    }
  }

  function trackDeadButton(reason: string) {
    track({ type: 'dead_button', component, metadata: { reason } });
  }

  function trackRetry(metadata?: Record<string, unknown>) {
    track({ type: 'retry', component, metadata });
  }

  function trackRetrySuccess() {
    track({ type: 'retry.success', component });
  }

  return { onClick, trackDeadButton, trackRetry, trackRetrySuccess };
}

/** Record a page view in the user journey trajectory. */
export function useJourneyPage(pageName: string): void {
  const observability = useOptionalObservability();

  const track = () => {
    observability?.trackPageView(pageName);
  };

  onMounted(track);
  watch(() => pageName, track);
}
