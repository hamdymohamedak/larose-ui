/**
 * CSS entry points for laRose UI in meta-framework apps.
 * Import these in your root layout (App Router) or `_app` (Pages Router).
 *
 * Tokens are already bundled into `@larose-ui/styles/styles.css`.
 */
export const LAROSE_CSS_IMPORTS = ['@larose-ui/styles/styles.css'] as const;

/** React apps — `@larose-ui/react/styles.css` copies the styles (+ tokens) bundle. */
export const LAROSE_CSS_IMPORTS_REACT = ['@larose-ui/react/styles.css'] as const;

export type LaRoseCssImportPath =
  | (typeof LAROSE_CSS_IMPORTS)[number]
  | (typeof LAROSE_CSS_IMPORTS_REACT)[number];
