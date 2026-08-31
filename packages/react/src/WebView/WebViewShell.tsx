import type { ReactNode } from 'react';
import { WebView, type WebViewProps } from './WebView';
import { WebViewNavigation, type WebViewNavigationProps } from './WebViewNavigation';
import styles from '@larose-ui/styles/components/WebView/WebView.module.css';

export interface WebViewShellProps extends WebViewProps {
  navigation?: WebViewNavigationProps;
  footer?: ReactNode;
}

/**
 * Web view with optional back/forward navigation for multi-page in-app browsing.
 * @see https://developer.apple.com/design/human-interface-guidelines/web-views
 */
export function WebViewShell({ navigation, footer, className, ...webViewProps }: WebViewShellProps) {
  return (
    <div className={[styles.shell, className].filter(Boolean).join(' ')}>
      {navigation && <WebViewNavigation {...navigation} />}
      <WebView {...webViewProps} embedded />
      {footer}
    </div>
  );
}
