import { compile } from 'svelte/compiler';
import type { CompileResult } from './types';
import { runEsmAsCjs } from './moduleRunner';
import { getPlaygroundRegistry } from './scopes';

export function compileSvelte(source: string): CompileResult {
  try {
    const compiled = compile(source, {
      filename: 'App.svelte',
      css: 'injected',
      discloseVersion: false,
    });

    const registry = getPlaygroundRegistry();
    const exports = runEsmAsCjs(compiled.js.code, registry, {
      typescript: false,
      filename: 'App.svelte.js',
    });

    const component = exports.default;
    if (!component) {
      return {
        ok: false,
        framework: 'svelte',
        error: 'Svelte demo must compile to a default export.',
      };
    }

    return {
      ok: true,
      framework: 'svelte',
      component,
      css: compiled.css?.code,
    };
  } catch (error) {
    return {
      ok: false,
      framework: 'svelte',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
