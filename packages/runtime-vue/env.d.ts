/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
