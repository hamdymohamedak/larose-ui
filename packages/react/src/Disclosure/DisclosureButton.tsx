import { useCallback, useId, useState, type CSSProperties, type ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';

function ChevronIcon() {
  return (
    <svg className={styles.disclosureButtonIcon} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export interface DisclosureButtonProps {
  /** Visible label for the adjacent control region. */
  label?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Control placed beside the disclosure button, e.g. Save As field. */
  children: ReactNode;
  /** Content revealed when expanded. Use only one disclosure button per view. */
  detail?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * Push disclosure button — down when collapsed, up when expanded (macOS Save sheet pattern).
 * @see https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
 */
export function DisclosureButton({
  label,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  detail,
  disabled = false,
  className,
  style,
  'aria-label': ariaLabel = 'Show more options',
}: DisclosureButtonProps) {
  const panelId = useId();
  const isControlled = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? expanded : internalExpanded;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  }, [disabled, isControlled, isExpanded, onExpandedChange]);

  return (
    <div className={[styles.group, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.buttonRow}>
        <div className={styles.buttonContent}>
          {label && <div className={styles.triangleLabel}>{label}</div>}
          {children}
        </div>
        {detail && (
          <button
            type="button"
            className={styles.disclosureButton}
            data-expanded={isExpanded ? 'true' : 'false'}
            aria-expanded={isExpanded}
            aria-controls={panelId}
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={toggle}
          >
            <ChevronIcon />
          </button>
        )}
      </div>
      {detail && isExpanded && (
        <div id={panelId} className={styles.buttonPanel} role="region" aria-label={ariaLabel}>
          {detail}
        </div>
      )}
    </div>
  );
}
