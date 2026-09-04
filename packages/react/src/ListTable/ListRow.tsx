import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import type { ListAccessory } from './types';
import { truncateMiddle } from './utils';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  accessory?: ListAccessory;
  selected?: boolean;
  disabled?: boolean;
  truncate?: 'end' | 'middle';
  onPress?: () => void;
  onInfo?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
}

function Accessory({ type }: { type: ListAccessory }) {
  if (type === 'disclosure') return <span aria-hidden="true">›</span>;
  if (type === 'checkmark') return <span aria-hidden="true">✓</span>;
  return null;
}

export function ListRow({
  title,
  subtitle,
  leading,
  accessory = 'none',
  selected = false,
  disabled = false,
  truncate = 'end',
  onPress,
  onInfo,
  className,
  style,
}: ListRowProps) {
  const displayTitle = truncate === 'middle' ? truncateMiddle(title) : title;

  return (
    <li>
      <button
        type="button"
        className={[styles.row, className].filter(Boolean).join(' ')}
        style={style}
        data-selected={selected ? 'true' : undefined}
        disabled={disabled}
        onClick={onPress}
      >
        {leading && <span className={styles.rowLeading}>{leading}</span>}
        <span className={styles.rowText}>
          <span className={styles.rowTitle} data-truncate={truncate}>
            {displayTitle}
          </span>
          {subtitle && <span className={styles.rowSubtitle}>{subtitle}</span>}
        </span>
        {accessory === 'info' ? (
          <button
            type="button"
            className={styles.infoButton}
            aria-label={`More information about ${title}`}
            onClick={(event) => {
              event.stopPropagation();
              onInfo?.(event);
            }}
          >
            i
          </button>
        ) : (
          accessory !== 'none' && (
            <span className={styles.rowAccessory}>
              <Accessory type={accessory} />
            </span>
          )
        )}
      </button>
    </li>
  );
}
