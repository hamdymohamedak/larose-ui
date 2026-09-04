import {
  addComponent,
  addImports,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';
import './types';
import {
  createLaRoseThemeScriptContent,
  LAROSE_THEME_SCRIPT_ID,
} from './themeScript';
import type { ModuleOptions } from './types';

export type { ModuleOptions, LaRosePublicRuntimeConfig } from './types';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@larose-ui/nuxt',
    configKey: 'laRose',
    compatibility: {
      nuxt: '>=3.10.0',
    },
  },
  defaults: {
    css: true,
    themeScript: true,
    appearance: 'system',
    storageKey: 'larose-theme',
    theme: 'light',
    density: 'comfortable',
    runtime: true,
    transpile: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (options.transpile) {
      nuxt.options.build.transpile.push('@larose-ui/vue', '@larose-ui/runtime-vue');
    }

    if (options.css) {
      nuxt.options.css.push(
        '@larose-ui/tokens/styles.css',
        '@larose-ui/styles/styles.css',
      );
    }

    nuxt.options.runtimeConfig.public.laRose = {
      theme: options.theme ?? 'light',
      density: options.density ?? 'comfortable',
      tenantId: options.tenantId,
      appearance: options.appearance ?? 'system',
      enableToasts: options.enableToasts !== false,
      locale: options.locale,
      environment: options.environment,
      runtime: options.runtime ?? true,
    };

    if (options.themeScript) {
      const innerHTML = createLaRoseThemeScriptContent({
        appearance: options.appearance,
        storageKey: options.storageKey,
      });

      nuxt.options.app.head.script ??= [];
      nuxt.options.app.head.script.push({
        id: LAROSE_THEME_SCRIPT_ID,
        innerHTML,
        tagPriority: 100,
      });
    }

    addComponent({
      name: 'LaRoseApp',
      filePath: resolver.resolve('./runtime/components/LaRoseApp'),
      global: true,
    });

    addImports([
      { name: 'LaRoseProvider', from: '@larose-ui/runtime-vue' },
      { name: 'RuntimeProvider', from: '@larose-ui/runtime-vue' },
      { name: 'useRuntimeContext', from: '@larose-ui/runtime-vue' },
      { name: 'useComponentDefaults', from: '@larose-ui/vue' },
      { name: 'useThemeCustomization', from: '@larose-ui/vue' },
      { name: 'useToast', from: '@larose-ui/runtime-vue/toast' },
    ]);
  },
});
