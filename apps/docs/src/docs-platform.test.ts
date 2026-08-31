import { describe, expect, it } from 'vitest';
import { docsComponentApi } from '@/data/api.generated';
import { docsExamples } from '@/data/examples.generated';
import { docsSearchIndex } from '@/data/searchIndex.generated';
import { playgroundControls } from '@/data/playground.generated';
import { searchDocs } from '@/components/CommandSearch';

describe('generated API metadata', () => {
  it('extracts Button props with types and descriptions', () => {
    const button = docsComponentApi.Button!;
    expect(button.props.some((prop) => prop.name === 'variant')).toBe(true);
    expect(button.props.some((prop) => prop.name === 'loading')).toBe(true);
    expect(button.accessibility.length).toBeGreaterThan(0);
  });

  it('includes story-driven Button examples', () => {
    expect(docsExamples.Button?.length).toBeGreaterThan(3);
  });
});

describe('search index', () => {
  it('finds motion-related entries for duration queries', () => {
    const results = searchDocs('motion');
    expect(results.some((entry) => entry.type === 'guide' || entry.type === 'token')).toBe(true);
  });

  it('finds component prop entries', () => {
    const results = searchDocs('Button.variant');
    expect(results.some((entry) => entry.type === 'prop')).toBe(true);
  });

  it('indexes all components', () => {
    const componentEntries = docsSearchIndex.filter((entry) => entry.type === 'component');
    expect(componentEntries.length).toBeGreaterThan(80);
  });
});

describe('playground controls', () => {
  it('defines safe Button controls with defaults', () => {
    const buttonControls = playgroundControls.Button!;
    expect(buttonControls.variant!.default).toBe('primary');
    expect(buttonControls.size!.options).toContain('lg');
  });
});

function generateComponentCode(componentName: string, values: Record<string, unknown>) {
  const entries = Object.entries(values).filter(([, value]) => value !== '' && value !== false);
  const propLines = entries.map(([key, value]) => {
    if (typeof value === 'string') return `  ${key}="${value}"`;
    if (typeof value === 'boolean') return `  ${key}`;
    return `  ${key}={${JSON.stringify(value)}}`;
  });
  const child = typeof values.children === 'string' ? values.children : 'Example';
  return `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ''}>${child}</${componentName}>`;
}

describe('generated code helper', () => {
  it('matches playground state for Button', () => {
    const code = generateComponentCode('Button', {
      children: 'Save changes',
      variant: 'secondary',
      size: 'lg',
      disabled: false,
    });
    expect(code).toContain('variant="secondary"');
    expect(code).toContain('size="lg"');
    expect(code).toContain('Save changes');
  });
});
