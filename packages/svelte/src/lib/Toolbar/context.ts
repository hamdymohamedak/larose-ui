import { getContext, setContext } from 'svelte';
import type { ToolbarPlatform } from './types';

export const toolbarPlatformKey = Symbol('larose-toolbar-platform');

export function setToolbarPlatform(platform: () => ToolbarPlatform): void {
  setContext(toolbarPlatformKey, platform);
}

export function getToolbarPlatform(): ToolbarPlatform {
  const value = getContext<() => ToolbarPlatform>(toolbarPlatformKey);
  return value ? value() : 'macos';
}
