import { describe, expect, it } from 'vitest';
import { compileReact } from './compileReact';
import { compileVue } from './compileVue';
import { compileSvelte } from './compileSvelte';
import { transformToCjs } from './moduleRunner';
import { playgroundSeeds } from '@/data/playgroundSeeds.generated';
import { docsComponents } from '@/data/catalog.generated';
import { docsComponentApi } from '@/data/api.generated';

describe('live playground module runner', () => {
  it('transforms TSX imports to require()', () => {
    const code = transformToCjs(
      `import { Button } from '@larose-ui/react';\nexport default function App(){ return <Button>Hi</Button>; }`,
      { jsx: true, typescript: true },
    );
    expect(code).toContain("require('@larose-ui/react')");
    expect(code).toContain('jsx-runtime');
  });
});

describe('compileReact', () => {
  it('compiles Button seed', () => {
    const seed = playgroundSeeds.Button?.react;
    expect(seed).toBeTruthy();
    const result = compileReact(seed!);
    expect(result.ok).toBe(true);
    if (result.ok) expect(typeof result.component).toBe('function');
  });

  it('compiles LiquidGlass seed', () => {
    const seed = playgroundSeeds.LiquidGlass?.react;
    expect(seed).toBeTruthy();
    const result = compileReact(seed!);
    expect(result.ok).toBe(true);
  });
});

describe('compileVue', () => {
  it('compiles Button SFC seed', () => {
    const seed = playgroundSeeds.Button?.vue;
    expect(seed).toBeTruthy();
    const result = compileVue(seed!);
    expect(result.ok).toBe(true);
  });
});

describe('compileSvelte', () => {
  it('compiles Button seed', () => {
    const seed = playgroundSeeds.Button?.svelte;
    expect(seed).toBeTruthy();
    const result = compileSvelte(seed!);
    expect(result.ok).toBe(true);
  });
});

describe('seed coverage', () => {
  it('provides a react seed for every catalog component', () => {
    const missing = docsComponents.filter((c) => !playgroundSeeds[c.name]?.react?.trim());
    expect(missing.map((c) => c.name)).toEqual([]);
  });

  it('provides vue/svelte seeds when frameworks include them', () => {
    const missing: string[] = [];
    for (const c of docsComponents) {
      const seed = playgroundSeeds[c.name];
      if (!seed) {
        missing.push(`${c.name}:no-seed`);
        continue;
      }
      if (c.frameworks.includes('vue') && !seed.vue?.trim()) missing.push(`${c.name}:vue`);
      if (c.frameworks.includes('svelte') && !seed.svelte?.trim()) missing.push(`${c.name}:svelte`);
    }
    expect(missing).toEqual([]);
  });
});

describe('api coverage', () => {
  it('documents props with example values when contract props exist', () => {
    const gaps: string[] = [];
    for (const c of docsComponents) {
      const api = docsComponentApi[c.name];
      if (!api) {
        gaps.push(`${c.name}:missing-api`);
        continue;
      }
      for (const prop of api.props) {
        if (prop.inherited) continue;
        if (!prop.example) gaps.push(`${c.name}.${prop.name}:no-example`);
      }
    }
    expect(gaps.slice(0, 20)).toEqual([]);
    expect(gaps).toEqual([]);
  });

  it('includes LiquidGlass optics props', () => {
    const api = docsComponentApi.LiquidGlass;
    expect(api).toBeTruthy();
    const names = new Set(api!.props.map((p) => p.name));
    expect(names.has('blur')).toBe(true);
    expect(names.has('saturation')).toBe(true);
    expect(names.has('borderRadius')).toBe(true);
  });
});
