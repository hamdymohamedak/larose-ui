import { onMounted, shallowRef, type Ref } from 'vue';
import { getLaRosePortalTarget, LAROSE_PORTAL_SELECTOR } from '@larose-ui/core';

/**
 * Reactive Teleport target for Vue overlays.
 * Prefer the provider portal root; fall back to body after mount.
 */
export function useLaRosePortalTarget(): Ref<string | HTMLElement> {
  const target = shallowRef<string | HTMLElement>(LAROSE_PORTAL_SELECTOR);

  onMounted(() => {
    target.value = getLaRosePortalTarget();
  });

  return target;
}
