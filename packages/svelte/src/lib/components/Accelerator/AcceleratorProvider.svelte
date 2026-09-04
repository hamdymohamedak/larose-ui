<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    createAcceleratorRegistry,
    detectPlatform,
    type AcceleratorPlatform,
    type AcceleratorRegistry,
  } from '@larose-ui/core';
  import { setAcceleratorContext, type AcceleratorContextValue } from '../../accelerator/context';

  let { platform, children }: { platform?: AcceleratorPlatform; children?: Snippet } = $props();

  const registry: AcceleratorRegistry = createAcceleratorRegistry();
  const resolvedPlatform = platform ?? detectPlatform();
  let activeMenuId: string | null = null;
  const menuHandlers = new Map<string, (event: KeyboardEvent) => boolean>();

  const value: AcceleratorContextValue = {
    registry,
    platform: resolvedPlatform,
    registerMenuHandler(id, handler) {
      menuHandlers.set(id, handler);
      return () => {
        menuHandlers.delete(id);
      };
    },
    setActiveMenuId(id) {
      activeMenuId = id;
    },
  };

  setAcceleratorContext(value);

  $effect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeMenuId) {
        const menuHandler = menuHandlers.get(activeMenuId);
        if (menuHandler?.(event)) return;
      }
      registry.handleEvent(event, {
        platform: resolvedPlatform,
        scopes: ['component', 'global'],
        target: event.target,
      });
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  });
</script>

{@render children?.()}
