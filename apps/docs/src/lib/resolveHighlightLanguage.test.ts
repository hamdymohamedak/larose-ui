import { describe, expect, it } from 'vitest';
import { resolveHighlightLanguage } from '@/components/CodeBlock';

describe('resolveHighlightLanguage', () => {
  it('maps vue and svelte SFCs to markup for coloring', () => {
    expect(resolveHighlightLanguage('vue')).toBe('markup');
    expect(resolveHighlightLanguage('svelte')).toBe('markup');
    expect(resolveHighlightLanguage('astro')).toBe('markup');
  });

  it('keeps react languages intact', () => {
    expect(resolveHighlightLanguage('tsx')).toBe('tsx');
    expect(resolveHighlightLanguage('typescript')).toBe('typescript');
    expect(resolveHighlightLanguage('ts')).toBe('typescript');
  });

  it('aliases common extensions', () => {
    expect(resolveHighlightLanguage('sh')).toBe('bash');
    expect(resolveHighlightLanguage('yml')).toBe('yaml');
    expect(resolveHighlightLanguage('py')).toBe('python');
    expect(resolveHighlightLanguage('md')).toBe('markdown');
  });

  it('falls back for unknown languages using content', () => {
    const lang = resolveHighlightLanguage('weirdlang', '<script lang="ts">const x = 1</script>');
    expect(['markup', 'jsx', 'tsx', 'javascript', 'typescript']).toContain(lang);
  });
});
