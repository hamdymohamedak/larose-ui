import { useSplitView } from './SplitView';
import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';

export interface SplitViewToolbarProps {
  /** Optional actions rendered before pane restore buttons. */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Toolbar with buttons to reveal hidden split view panes. */
export function SplitViewToolbar({ actions, className, style }: SplitViewToolbarProps) {
  const { hiddenPanes, showPane } = useSplitView();

  if (!actions && hiddenPanes.length === 0) return null;

  return (
    <div
      className={[styles.toolbar, className].filter(Boolean).join(' ')}
      style={style}
      role="toolbar"
      aria-label="Split view toolbar"
    >
      {actions}
      {hiddenPanes.map((pane) => (
        <button
          key={pane.id}
          type="button"
          className={styles.toolbarButton}
          onClick={() => showPane(pane.id)}
        >
          Show {pane.label}
        </button>
      ))}
    </div>
  );
}
