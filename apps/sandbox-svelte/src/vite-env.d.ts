/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.js' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const SANDBOX_PORTS: {
    react: number;
    vue: number;
    svelte: number;
  };
}

declare module '*.mjs' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const SANDBOX_PORTS: {
    react: number;
    vue: number;
    svelte: number;
  };
}
