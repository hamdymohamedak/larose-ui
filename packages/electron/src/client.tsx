'use client';

import { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';
import { bootstrapLaRoseElectron, type BootstrapLaRoseElectronOptions } from './index';

export type LaRoseElectronRootProps = LaRoseProviderProps & {
  electron?: BootstrapLaRoseElectronOptions;
};

/**
 * Client root for Electron renderers using the full laRose runtime stack.
 * Registers the Electron host before mounting providers.
 */
export function LaRoseElectronRoot({ electron, ...providerProps }: LaRoseElectronRootProps) {
  bootstrapLaRoseElectron(electron);
  return <LaRoseProvider {...providerProps} />;
}

export { LaRoseProvider, type LaRoseProviderProps } from '@larose-ui/runtime';
