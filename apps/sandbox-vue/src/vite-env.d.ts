/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module '*.js' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const SANDBOX_GLASS_OPTICS: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CONTROLS: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CARD: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CHROME: Record<string, string | number | boolean>;
}

declare module '*.mjs' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
}
