/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module '*.mjs' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
}
