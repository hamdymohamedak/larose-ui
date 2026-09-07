/**
 * Shared laRose stylesheets (design tokens + component CSS).
 *
 * One import is enough for apps:
 * ```ts
 * import '@larose-ui/styles/styles.css';
 * ```
 *
 * React apps can use the same bundle via:
 * ```ts
 * import '@larose-ui/react/styles.css';
 * ```
 *
 * `@larose-ui/tokens/styles.css` remains available for advanced / tokens-only
 * setups; the styles package already embeds tokens at build time.
 */
export const STYLES_CSS = '@larose-ui/styles/styles.css' as const;

/**
 * @deprecated Prefer {@link STYLES_CSS} — tokens are bundled into styles.css.
 * Kept for advanced tokens-only imports and backward compatibility.
 */
export const TOKENS_CSS = '@larose-ui/tokens/styles.css' as const;
