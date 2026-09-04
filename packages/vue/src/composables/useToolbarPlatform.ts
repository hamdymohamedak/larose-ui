import { inject, type InjectionKey, type Ref } from 'vue';
import type { ToolbarPlatform } from '../Toolbar/types';

export const toolbarPlatformKey: InjectionKey<Ref<ToolbarPlatform>> = Symbol('larose-toolbar-platform');

export function useToolbarPlatform(): ToolbarPlatform {
  return inject(toolbarPlatformKey)?.value ?? 'macos';
}
