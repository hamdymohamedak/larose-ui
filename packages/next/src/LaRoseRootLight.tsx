'use client';

import {
  LaRoseProvider as ReactLaRoseProvider,
  type LaRoseProviderProps as ReactLaRoseProviderProps,
} from '@larose-ui/react';

export type LaRoseRootLightProps = ReactLaRoseProviderProps;

/**
 * Lightweight client provider — theme, motion, and accelerators only.
 * Use when you do not need `@larose-ui/runtime-react` (i18n, permissions, network, offline).
 */
export function LaRoseRootLight(props: LaRoseRootLightProps) {
  return <ReactLaRoseProvider {...props} />;
}
