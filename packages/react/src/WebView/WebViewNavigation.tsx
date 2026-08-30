import styles from './WebView.module.css';

export interface WebViewNavigationProps {
  canGoBack?: boolean;
  canGoForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  title?: string;
  backLabel?: string;
  forwardLabel?: string;
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function WebViewNavigation({
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  title,
  backLabel = 'Back',
  forwardLabel = 'Forward',
}: WebViewNavigationProps) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Web view navigation">
      <button
        type="button"
        className={styles.navButton}
        aria-label={backLabel}
        disabled={!canGoBack}
        onClick={onBack}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className={styles.navButton}
        aria-label={forwardLabel}
        disabled={!canGoForward}
        onClick={onForward}
      >
        <ChevronRight />
      </button>
      {title && <span className={styles.toolbarTitle}>{title}</span>}
    </div>
  );
}
