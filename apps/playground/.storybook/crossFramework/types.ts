import type { ArgTypes } from '@storybook/react';
import type { ReactNode } from 'react';
import type { Density, ThemeMode } from '@larose-ui/core';
import type { StorybookFramework } from './frameworkSupport';

export type { StorybookFramework } from './frameworkSupport';

export interface CrossFrameworkProviderContext {
  theme: ThemeMode;
  density: Density;
}

export interface CrossFrameworkRenderArgs {
  /** Text passed as default slot / children when the component uses one. */
  label?: string;
  [key: string]: unknown;
}

export interface CrossFrameworkComponentDefinition {
  /** Registry key — must match `parameters.laRose.crossFramework`. */
  id: string;
  displayName: string;
  frameworks: StorybookFramework[];
  /** Vue / Svelte export name in parity packages. */
  componentName: string;
  /** Map unified story args to component props (+ optional slot label). */
  mapArgs: (args: CrossFrameworkRenderArgs) => {
    props: Record<string, unknown>;
    slotText?: string;
  };
  argTypes?: ArgTypes;
  /** React-only render (receives mapped props). */
  renderReact: (
    props: Record<string, unknown>,
    slotText: string | undefined,
    ctx: CrossFrameworkProviderContext,
  ) => ReactNode;
}
