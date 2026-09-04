import type { ArgTypes } from '@storybook/react';
import type { ComponentType, ReactNode } from 'react';
import type {
  CrossFrameworkComponentDefinition,
  CrossFrameworkRenderArgs,
  StorybookFramework,
} from './types';

const ALL: StorybookFramework[] = ['react', 'vue', 'svelte'];
const noop = () => undefined;

export function slotFromArgs(args: CrossFrameworkRenderArgs, fallback: string): string {
  if (typeof args.label === 'string' && args.label) return args.label;
  if (typeof args.children === 'string' && args.children) return args.children;
  return fallback;
}

/** Drop React nodes / functions that break Vue & Svelte mounts. */
export function serializableProps(args: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value == null) {
      out[key] = value;
      continue;
    }
    const t = typeof value;
    if (t === 'function' || t === 'symbol') continue;
    if (t === 'object') {
      if ((value as { $$typeof?: unknown }).$$typeof != null) continue;
    }
    out[key] = value;
  }
  return out;
}

function withNoops(
  props: Record<string, unknown>,
  handlers: string[] | undefined,
): Record<string, unknown> {
  if (!handlers?.length) return props;
  const next = { ...props };
  for (const key of handlers) {
    if (next[key] === undefined) next[key] = noop;
  }
  return next;
}

export interface DefineSlotParityOptions {
  id: string;
  displayName: string;
  componentName?: string;
  frameworks?: StorybookFramework[];
  defaultSlot: string;
  /** Prop keys forwarded from story args (plus serializable rest). */
  propKeys?: string[];
  /** Defaults applied when story args omit the key. */
  defaultProps?: Record<string, unknown>;
  mapExtraProps?: (args: CrossFrameworkRenderArgs) => Record<string, unknown>;
  /** Inject noop handlers in React renders (e.g. onClose). */
  withNoopHandlers?: string[];
  argTypes?: ArgTypes;
  Component: ComponentType<any>;
}

/**
 * Compact definition for simple components that take a text slot + a few props.
 */
export function defineSlotParity({
  id,
  displayName,
  componentName = displayName,
  frameworks = ALL,
  defaultSlot,
  propKeys = [],
  defaultProps = {},
  mapExtraProps,
  withNoopHandlers,
  argTypes,
  Component,
}: DefineSlotParityOptions): CrossFrameworkComponentDefinition {
  return {
    id,
    displayName,
    componentName,
    frameworks: [...frameworks],
    mapArgs: (args) => {
      const props: Record<string, unknown> = { ...defaultProps };
      for (const key of propKeys) {
        if (args[key] !== undefined) props[key] = args[key];
      }
      const rest = { ...args };
      delete rest.label;
      delete rest.children;
      for (const key of propKeys) delete rest[key];
      return {
        props: {
          ...props,
          ...serializableProps(rest),
          ...mapExtraProps?.(args),
        },
        slotText: slotFromArgs(args, defaultSlot),
      };
    },
    argTypes: {
      label: { control: 'text' },
      ...argTypes,
    },
    renderReact: (props, slotText) => (
      <Component {...withNoops(props, withNoopHandlers)}>{slotText ?? defaultSlot}</Component>
    ),
  };
}

export interface DefinePropsParityOptions {
  id: string;
  displayName: string;
  componentName?: string;
  frameworks?: StorybookFramework[];
  /** Prop keys forwarded from story args (plus serializable rest). */
  propKeys?: string[];
  defaultProps?: Record<string, unknown>;
  /**
   * Extra prop aliases derived from args (e.g. Vue `modelValue` from `value`).
   */
  mapExtraProps?: (args: CrossFrameworkRenderArgs) => Record<string, unknown>;
  /** Inject noop handlers in React renders (e.g. onPageChange). */
  withNoopHandlers?: string[];
  /** Optional wrapper around the React render (e.g. fixed-size image frame). */
  wrapReact?: (node: ReactNode) => ReactNode;
  argTypes?: ArgTypes;
  Component: ComponentType<any>;
}

/**
 * Compact definition for prop-only components (no children slot).
 * Covers Spinner, Input, Checkbox, Switch, Progress, Skeleton, etc.
 */
export function definePropsParity({
  id,
  displayName,
  componentName = displayName,
  frameworks = ALL,
  propKeys = [],
  defaultProps = {},
  mapExtraProps,
  withNoopHandlers,
  wrapReact,
  argTypes,
  Component,
}: DefinePropsParityOptions): CrossFrameworkComponentDefinition {
  return {
    id,
    displayName,
    componentName,
    frameworks: [...frameworks],
    mapArgs: (args) => {
      const props: Record<string, unknown> = { ...defaultProps };
      for (const key of propKeys) {
        if (args[key] !== undefined) props[key] = args[key];
      }
      const rest = { ...args };
      for (const key of propKeys) delete rest[key];
      return {
        props: {
          ...props,
          ...serializableProps(rest),
          ...mapExtraProps?.(args),
        },
      };
    },
    argTypes,
    renderReact: (props) => {
      const node = <Component {...withNoops(props, withNoopHandlers)} />;
      return wrapReact ? wrapReact(node) : node;
    },
  };
}

export { ALL as ALL_FRAMEWORKS };

export interface DefineCustomParityOptions {
  id: string;
  displayName: string;
  componentName?: string;
  frameworks?: StorybookFramework[];
  argTypes?: ArgTypes;
  mapArgs: CrossFrameworkComponentDefinition['mapArgs'];
  renderReact: CrossFrameworkComponentDefinition['renderReact'];
}

/**
 * Structured custom definition — use when mapArgs/renderReact need domain logic
 * but you still want consistent id / frameworks / componentName defaults.
 */
export function defineCustomParity({
  id,
  displayName,
  componentName = displayName,
  frameworks = ALL,
  argTypes,
  mapArgs,
  renderReact,
}: DefineCustomParityOptions): CrossFrameworkComponentDefinition {
  return {
    id,
    displayName,
    componentName,
    frameworks: [...frameworks],
    argTypes,
    mapArgs,
    renderReact,
  };
}
