import { compileReact } from './compileReact';
import { compileSvelte } from './compileSvelte';
import { compileVue } from './compileVue';
import type { CompileResult, LiveFramework } from './types';

export function compileLiveSource(framework: LiveFramework, source: string): CompileResult {
  if (framework === 'react') return compileReact(source);
  if (framework === 'vue') return compileVue(source);
  return compileSvelte(source);
}

export type { CompileResult, LiveFramework };
