import { mount, unmount } from 'svelte';
import type { Component } from 'svelte';
import SvelteStoryShell from '../../cross-framework/SvelteStoryShell.svelte';
import type { CrossFrameworkProviderContext } from './types';

export function mountSvelteStory(
  target: HTMLElement,
  options: {
    componentName: string;
    componentProps: Record<string, unknown>;
    slotText?: string;
    provider: CrossFrameworkProviderContext;
  },
): () => void {
  const instance = mount(SvelteStoryShell as Component, {
    target,
    props: {
      componentName: options.componentName,
      componentProps: options.componentProps,
      slotText: options.slotText,
      theme: options.provider.theme,
      density: options.provider.density,
    },
  });

  return () => {
    unmount(instance);
    target.innerHTML = '';
  };
}
