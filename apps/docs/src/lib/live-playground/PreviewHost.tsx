import { createElement, type ComponentType, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  createApp,
  h,
  type App as VueApp,
  type Component as VueComponent,
} from 'vue';
import { mount, unmount, type Component as SvelteComponent } from 'svelte';
import { LaRoseProvider as VueLaRoseProvider } from '@larose-ui/vue';
import type { CompileResult, LiveFramework, MountHandle } from './types';

function injectCss(css: string | undefined, host: HTMLElement): () => void {
  if (!css?.trim()) return () => undefined;
  const style = document.createElement('style');
  style.setAttribute('data-larose-live-css', 'true');
  style.textContent = css;
  host.appendChild(style);
  return () => {
    style.remove();
  };
}

function mountReact(target: HTMLElement, component: unknown): MountHandle {
  const root: Root = createRoot(target);
  root.render(createElement(component as ComponentType));
  return {
    dispose: () => {
      root.unmount();
      target.innerHTML = '';
    },
  };
}

function mountVue(target: HTMLElement, component: unknown, css?: string): MountHandle {
  const removeCss = injectCss(css, target);
  const Demo = component as VueComponent;
  const app: VueApp = createApp({
    setup() {
      return () =>
        h(VueLaRoseProvider as VueComponent, null, {
          default: () => h(Demo),
        });
    },
  });
  app.mount(target);
  return {
    dispose: () => {
      app.unmount();
      removeCss();
      target.innerHTML = '';
    },
  };
}

function mountSvelteFw(target: HTMLElement, component: unknown, css?: string): MountHandle {
  const removeCss = injectCss(css, target);
  const Demo = component as SvelteComponent;
  const instance = mount(Demo, { target });
  return {
    dispose: () => {
      unmount(instance);
      removeCss();
      target.innerHTML = '';
    },
  };
}

export function mountCompileResult(
  target: HTMLElement,
  result: Extract<CompileResult, { ok: true }>,
): MountHandle {
  if (result.framework === 'react') return mountReact(target, result.component);
  if (result.framework === 'vue') return mountVue(target, result.component, result.css);
  return mountSvelteFw(target, result.component, result.css);
}

interface PreviewHostProps {
  framework: LiveFramework;
  result: CompileResult | null;
}

/**
 * Mounts a compiled live demo into a detached DOM host (works for React nested roots, Vue, Svelte).
 */
export function PreviewHost({ framework, result }: PreviewHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let handle: MountHandle | undefined;
    if (result?.ok) {
      try {
        handle = mountCompileResult(host, result);
      } catch (error) {
        host.textContent = error instanceof Error ? error.message : String(error);
      }
    }

    return () => {
      handle?.dispose();
      host.innerHTML = '';
    };
  }, [framework, result]);

  return <div className="docs-live-preview-host" ref={hostRef} data-framework={framework} />;
}
