import type { CompileResult } from './types';
import { runEsmAsCjs } from './moduleRunner';
import { getPlaygroundRegistry } from './scopes';

export function compileReact(source: string): CompileResult {
  try {
    const registry = getPlaygroundRegistry();
    const exports = runEsmAsCjs(source, registry, {
      jsx: true,
      typescript: true,
      filename: 'App.tsx',
    });

    const component =
      exports.default ??
      exports.App ??
      Object.values(exports).find((value) => typeof value === 'function');

    if (!component) {
      return {
        ok: false,
        framework: 'react',
        error: 'React demo must export a default component (or named App).',
      };
    }

    return { ok: true, framework: 'react', component };
  } catch (error) {
    return {
      ok: false,
      framework: 'react',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
