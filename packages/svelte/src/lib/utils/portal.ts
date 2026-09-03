import { getLaRosePortalTarget } from '@larose-ui/core';

/**
 * Svelte action: move `node` under the active laRose portal root (or body).
 * Keeps overlays inside the themed provider tree when possible.
 */
export function portal(node: HTMLElement, target?: string | HTMLElement) {
  function resolveDest(next?: string | HTMLElement): Element | null {
    if (next == null) return getLaRosePortalTarget();
    if (typeof next === 'string') return document.querySelector(next);
    return next;
  }

  let dest = resolveDest(target);
  dest?.appendChild(node);

  return {
    update(nextTarget?: string | HTMLElement) {
      const next = resolveDest(nextTarget);
      if (!next || next === node.parentElement) return;
      next.appendChild(node);
      dest = next;
    },
    destroy() {
      node.remove();
    },
  };
}
