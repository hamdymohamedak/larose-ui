/**
 * Shared laRose component styles.
 *
 * Import order for applications:
 * ```ts
 * import '@larose-ui/tokens/styles.css';
 * import '@larose-ui/styles/styles.css';
 * ```
 *
 * Framework bindings (React, Vue, Svelte) consume the same scoped class names
 * produced by the CSS module pipeline in this package.
 */
export const STYLES_CSS = '@larose-ui/styles/styles.css' as const;
export const TOKENS_CSS = '@larose-ui/tokens/styles.css' as const;
