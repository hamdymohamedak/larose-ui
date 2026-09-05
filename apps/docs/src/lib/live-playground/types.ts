export type LiveFramework = 'react' | 'vue' | 'svelte';

export interface CompileSuccess {
  ok: true;
  framework: LiveFramework;
  /** React component type, Vue component options, or Svelte component. */
  component: unknown;
  css?: string;
}

export interface CompileFailure {
  ok: false;
  framework: LiveFramework;
  error: string;
}

export type CompileResult = CompileSuccess | CompileFailure;

export interface MountHandle {
  dispose: () => void;
}
