import { transform } from 'sucrase';

export type ModuleExports = Record<string, unknown>;

export type ModuleRegistry = Map<string, ModuleExports>;

/**
 * Convert ESM (and optional TSX) into CommonJS-style code that uses `require` / `exports`.
 */
export function transformToCjs(
  code: string,
  options: { jsx?: boolean; typescript?: boolean } = {},
): string {
  const transforms: Array<'typescript' | 'jsx' | 'imports'> = ['imports'];
  if (options.typescript !== false) transforms.unshift('typescript');
  if (options.jsx) transforms.push('jsx');

  return transform(code, {
    transforms,
    production: true,
    jsxRuntime: 'automatic',
  }).code;
}

/**
 * Evaluate CommonJS-transformed source against a module registry.
 */
export function evaluateCjs(
  code: string,
  registry: ModuleRegistry,
  filename = 'live-demo.js',
): ModuleExports {
  const module = { exports: {} as ModuleExports };
  const requireFn = (id: string): ModuleExports => {
    const resolved = registry.get(id) ?? registry.get(normalizeSpecifier(id));
    if (!resolved) {
      throw new Error(`Cannot find module "${id}" in live playground (from ${filename})`);
    }
    return resolved;
  };

  // eslint-disable-next-line no-new-func -- intentional live-eval sandbox for docs demos
  const runner = new Function(
    'exports',
    'require',
    'module',
    '__filename',
    `${code}\n//# sourceURL=${filename}`,
  );

  runner(module.exports, requireFn, module, filename);
  return module.exports;
}

function normalizeSpecifier(id: string): string {
  if (id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx')) {
    return id.replace(/\.(jsx?|tsx?)$/, '');
  }
  return id;
}

export function runEsmAsCjs(
  source: string,
  registry: ModuleRegistry,
  options: { jsx?: boolean; typescript?: boolean; filename?: string } = {},
): ModuleExports {
  const cjs = transformToCjs(source, options);
  return evaluateCjs(cjs, registry, options.filename ?? 'live-demo.js');
}
