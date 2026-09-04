import { describe, expect, it } from 'vitest';
import {
  frameworkAvailabilityTags,
  readToolbarFramework,
  resolveStoryFrameworks,
  storyIndexSupportsFramework,
  storySupportsFramework,
} from './frameworkSupport';

describe('resolveStoryFrameworks', () => {
  it('defaults to React-only when a story has no parity metadata', () => {
    expect(resolveStoryFrameworks({})).toEqual(['react']);
  });

  it('uses the cross-framework registry list', () => {
    expect(
      resolveStoryFrameworks({
        registryFrameworks: ['react', 'vue', 'svelte'],
      }),
    ).toEqual(['react', 'vue', 'svelte']);
  });

  it('lets a story override the registry', () => {
    expect(
      resolveStoryFrameworks({
        explicit: ['react'],
        registryFrameworks: ['react', 'vue', 'svelte'],
      }),
    ).toEqual(['react']);
  });
});

describe('storySupportsFramework', () => {
  it('does not treat Vue or Svelte as available for React-only surfaces', () => {
    expect(storySupportsFramework('svelte', ['react'])).toBe(false);
    expect(storySupportsFramework('vue', ['react'])).toBe(false);
    expect(storySupportsFramework('react', ['react'])).toBe(true);
  });
});

describe('storyIndexSupportsFramework', () => {
  it('treats untagged stories as React-only', () => {
    expect(storyIndexSupportsFramework(undefined, 'react')).toBe(true);
    expect(storyIndexSupportsFramework([], 'svelte')).toBe(false);
  });

  it('requires an explicit fw-* tag for Vue and Svelte', () => {
    expect(storyIndexSupportsFramework(['fw-react'], 'vue')).toBe(false);
    expect(storyIndexSupportsFramework(['fw-react', 'fw-vue', 'fw-svelte'], 'svelte')).toBe(
      true,
    );
  });
});

describe('frameworkAvailabilityTags', () => {
  it('emits sidebar tags that match the selected toolbar framework', () => {
    expect(frameworkAvailabilityTags(['react', 'vue', 'svelte'])).toEqual([
      'fw-react',
      'fw-vue',
      'fw-svelte',
    ]);
  });
});

describe('readToolbarFramework', () => {
  it('falls back to React for unknown toolbar values', () => {
    expect(readToolbarFramework({ framework: 'svelte' })).toBe('svelte');
    expect(readToolbarFramework({ framework: 'unknown' })).toBe('react');
  });
});
