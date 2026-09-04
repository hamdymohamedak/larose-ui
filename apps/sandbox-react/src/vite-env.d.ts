/// <reference types="vite/client" />

declare module '*.js' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
}

declare module '*.mjs' {
  export const SCENARIOS: Array<{ id: string; title: string; description: string }>;
  export const repoRoot: string;
  export function laroseSandboxAliases(): Array<{ find: string; replacement: string }>;
  export function laroseCssModules(): { generateScopedName: (name: string, filename: string) => string };
}
