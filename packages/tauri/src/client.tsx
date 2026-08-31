'use client';

import { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';
import { bootstrapLaRoseTauri, type BootstrapLaRoseTauriOptions } from './index';

export type LaRoseTauriRootProps = LaRoseProviderProps & {
  tauri?: BootstrapLaRoseTauriOptions;
};

/**
 * Client root for Tauri webviews using the full laRose runtime stack.
 */
export function LaRoseTauriRoot({ tauri, ...providerProps }: LaRoseTauriRootProps) {
  bootstrapLaRoseTauri(tauri);
  return <LaRoseProvider {...providerProps} />;
}

export { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';
