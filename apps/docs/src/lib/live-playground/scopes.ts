import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactJSXDevRuntime from 'react/jsx-dev-runtime';
import * as LaroseReact from '@larose-ui/react';
import * as Vue from 'vue';
import * as LaroseVue from '@larose-ui/vue';
import * as Svelte from 'svelte';
import * as SvelteAnimate from 'svelte/animate';
import * as SvelteEasing from 'svelte/easing';
import * as SvelteMotion from 'svelte/motion';
import * as SvelteStore from 'svelte/store';
import * as SvelteTransition from 'svelte/transition';
import * as SvelteLegacy from 'svelte/legacy';
import * as SvelteInternalClient from 'svelte/internal/client';
import * as SvelteInternalFlagsAsync from 'svelte/internal/flags/async';
import * as SvelteInternalFlagsLegacy from 'svelte/internal/flags/legacy';
import * as SvelteInternalDiscloseVersion from 'svelte/internal/disclose-version';
import * as LaroseSvelte from '@larose-ui/svelte';
import type { ModuleExports, ModuleRegistry } from './moduleRunner';

function asModule(mod: object): ModuleExports {
  const exports = mod as ModuleExports;
  if (exports.default === undefined && typeof (mod as { default?: unknown }).default === 'undefined') {
    // Ensure CJS interop: `const X = require('pkg')` and `require('pkg').default`
    return { ...exports, default: mod };
  }
  return { ...exports, default: (exports as { default?: unknown }).default ?? mod };
}

function register(registry: ModuleRegistry, id: string, mod: object) {
  registry.set(id, asModule(mod));
}

/** Shared module registry for live playground evaluation. */
export function createPlaygroundRegistry(): ModuleRegistry {
  const registry: ModuleRegistry = new Map();

  register(registry, 'react', React);
  register(registry, 'react-dom', ReactDOM);
  register(registry, 'react/jsx-runtime', ReactJSXRuntime);
  register(registry, 'react/jsx-dev-runtime', ReactJSXDevRuntime);
  register(registry, '@larose-ui/react', LaroseReact);

  register(registry, 'vue', Vue);
  register(registry, '@larose-ui/vue', LaroseVue);

  register(registry, 'svelte', Svelte);
  register(registry, 'svelte/animate', SvelteAnimate);
  register(registry, 'svelte/easing', SvelteEasing);
  register(registry, 'svelte/motion', SvelteMotion);
  register(registry, 'svelte/store', SvelteStore);
  register(registry, 'svelte/transition', SvelteTransition);
  register(registry, 'svelte/legacy', SvelteLegacy);
  register(registry, 'svelte/internal/client', SvelteInternalClient);
  register(registry, 'svelte/internal/flags/async', SvelteInternalFlagsAsync);
  register(registry, 'svelte/internal/flags/legacy', SvelteInternalFlagsLegacy);
  register(registry, 'svelte/internal/disclose-version', SvelteInternalDiscloseVersion);
  register(registry, '@larose-ui/svelte', LaroseSvelte);

  return registry;
}

let cached: ModuleRegistry | null = null;

export function getPlaygroundRegistry(): ModuleRegistry {
  if (!cached) cached = createPlaygroundRegistry();
  return cached;
}

export { LaroseReact, LaroseVue, LaroseSvelte, React, Vue, Svelte };
