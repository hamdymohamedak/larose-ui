/**
 * CSS entry points for laRose UI in meta-framework apps.
 * Import these in your root layout (App Router) or `_app` (Pages Router).
 */
export const LAROSE_CSS_IMPORTS = [
  '@larose-ui/tokens/styles.css',
  '@larose-ui/styles/styles.css',
] as const;

/** Backward-compatible bundle — includes component CSS via `@larose-ui/react`. */
export const LAROSE_CSS_IMPORTS_REACT = [
  '@larose-ui/tokens/styles.css',
  '@larose-ui/react/styles.css',
] as const;

export type LaRoseCssImportPath =
  | (typeof LAROSE_CSS_IMPORTS)[number]
  | (typeof LAROSE_CSS_IMPORTS_REACT)[number];
