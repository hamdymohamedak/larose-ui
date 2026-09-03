/**
 * Shared DOM helpers for overlay portals across React / Vue / Svelte.
 *
 * Overlays should mount under the nearest laRose provider when possible so
 * theme CSS variables and isolation stay consistent. Falls back to `body`.
 */

export const LAROSE_PROVIDER_ATTR = 'data-lr-provider';
export const LAROSE_PORTAL_ROOT_ATTR = 'data-lr-portal-root';

/** CSS selector for the preferred portal mount node. */
export const LAROSE_PORTAL_SELECTOR = `[${LAROSE_PORTAL_ROOT_ATTR}], [${LAROSE_PROVIDER_ATTR}]`;

/**
 * Resolve where teleported overlays should attach.
 * Prefer an explicit portal root, then the provider shell, then `document.body`.
 */
export function getLaRosePortalTarget(doc: Document = document): HTMLElement {
  const portalRoot = doc.querySelector<HTMLElement>(`[${LAROSE_PORTAL_ROOT_ATTR}]`);
  if (portalRoot) return portalRoot;
  const provider = doc.querySelector<HTMLElement>(`[${LAROSE_PROVIDER_ATTR}]`);
  if (provider) return provider;
  return doc.body;
}

/**
 * Merge theme/component defaults with incoming props, ignoring `undefined`
 * so missing Storybook/registry args never wipe real defaults.
 */
export function mergeDefinedProps<T extends Record<string, unknown>>(
  defaults: Partial<T>,
  props: Partial<T>,
): T {
  const merged = { ...defaults } as T;
  for (const [key, value] of Object.entries(props) as Array<[keyof T, T[keyof T]]>) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}
