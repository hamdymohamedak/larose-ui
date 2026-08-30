import { useCallback, useId, useState, type ReactNode } from 'react';
import styles from './Disclosure.module.css';

function TriangleIcon() {
  return (
    <svg className={styles.triangleIcon} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <path d="M3 1.5 8 5 3 8.5V1.5Z" />
    </svg>
  );
}

export interface DisclosureTriangleProps {
  /** Describes what is disclosed, e.g. "Advanced options". */
  label: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
}

/**
 * Leading-edge disclosure triangle — right when collapsed, down when expanded.
 * @see https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
 */
export function DisclosureTriangle({
  label,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  disabled = false,
}: DisclosureTriangleProps) {
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
    <div className={styles.group}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.triangleButton}
          data-expanded={isExpanded ? 'true' : 'false'}
          aria-expanded={isExpanded}
          aria-controls={children ? panelId : undefined}
          aria-label={`${label}, ${isExpanded ? 'expanded' : 'collapsed'}`}
          disabled={disabled}
          onClick={toggle}
        >
          <TriangleIcon />
        </button>
        <span className={styles.triangleLabel}>{label}</span>
      </div>
      {children && isExpanded && (
        <div id={panelId} className={styles.panel} role="region" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}
