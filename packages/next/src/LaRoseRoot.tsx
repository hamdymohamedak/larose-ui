'use client';

import { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';

export type LaRoseRootProps = LaRoseProviderProps;

/**
 * Client boundary for Next.js / TanStack Start apps using the full laRose runtime stack.
 * Mount once in your root layout providers file.
 */
export function LaRoseRoot(props: LaRoseRootProps) {
  return <LaRoseProvider {...props} />;
}

export { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';
