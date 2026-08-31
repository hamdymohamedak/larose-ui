import { createApp, type App } from 'vue';
import VueStoryShell from '../../cross-framework/VueStoryShell.vue';
import type { CrossFrameworkProviderContext } from './types';

export function mountVueStory(
  target: HTMLElement,
  options: {
    componentName: string;
    componentProps: Record<string, unknown>;
    slotText?: string;
    provider: CrossFrameworkProviderContext;
  },
): () => void {
  let app: App | undefined;

  app = createApp(VueStoryShell, {
    componentName: options.componentName,
    componentProps: options.componentProps,
    slotText: options.slotText,
    theme: options.provider.theme,
    density: options.provider.density,
  });

  app.mount(target);

  return () => {
    app?.unmount();
    app = undefined;
    target.innerHTML = '';
  };
}
