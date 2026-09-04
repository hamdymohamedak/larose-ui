/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.js' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const SANDBOX_PORTS: {
    react: number;
    vue: number;
    svelte: number;
  };
  export const SANDBOX_GLASS_OPTICS: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CONTROLS: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CARD: Record<string, string | number | boolean>;
  export const SANDBOX_GLASS_CHROME: Record<string, string | number | boolean>;
}

declare module '*.mjs' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const SANDBOX_PORTS: {
    react: number;
    vue: number;
    svelte: number;
  };
}
