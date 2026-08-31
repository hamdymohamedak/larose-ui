import { useMemo, type IframeHTMLAttributes } from 'react';
import { buildSandboxAttribute } from './utils';
import styles from '@larose-ui/styles/components/WebView/WebView.module.css';

export interface WebViewProps extends Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src' | 'srcDoc'> {
  /** Remote URL to load — use for brief in-app website access, not a full browser replacement. */
  src?: string;
  /** Embedded HTML content, e.g. rich email bodies. */
  html?: string;
  title: string;
  height?: string | number;
  /** When true, omits outer frame styling (used inside {@link WebViewShell}). */
  embedded?: boolean;
  /** Restrict iframe capabilities; enabled by default for untrusted content. */
  sandboxed?: boolean;
  allowScripts?: boolean;
  allowForms?: boolean;
}

/**
 * Displays rich web content inside your app — not a standalone browser.
 * @see https://developer.apple.com/design/human-interface-guidelines/web-views
 */
export function WebView({
  src,
  html,
  title,
  height,
  embedded = false,
  sandboxed = true,
  allowScripts = false,
  allowForms = false,
  className,
  style,
  ...props
}: WebViewProps) {
  const srcDoc = html;
  const sandbox = useMemo(
    () =>
      sandboxed
        ? buildSandboxAttribute({ allowScripts, allowForms, allowSameOrigin: Boolean(html) })
        : undefined,
    [allowForms, allowScripts, html, sandboxed],
  );

  if (!src && !html) return null;

  return (
    <iframe
      title={title}
      src={html ? undefined : src}
      srcDoc={srcDoc}
      className={[styles.frame, !embedded && styles.frameOnly, className].filter(Boolean).join(' ')}
      sandbox={sandboxed ? (sandbox ?? '') : undefined}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}
