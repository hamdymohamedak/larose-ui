import type { ReactNode } from 'react';
import { formatBoxTitle } from './utils';
import type { BoxTitlePosition, BoxVariant } from './types';
import styles from './Layout.module.css';

export interface BoxProps {
  title?: string;
  /** macOS settings panes append a colon to the title. */
  settingsStyle?: boolean;
  titlePosition?: BoxTitlePosition;
  variant?: BoxVariant;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Groups related content with secondary/tertiary background — keep compact vs its container.
 * @see https://developer.apple.com/design/human-interface-guidelines/boxes
 */
export function Box({
  title,
  settingsStyle = false,
  titlePosition = 'inside',
  variant = 'secondary',
  padding = 'md',
  children,
  className,
  'aria-label': ariaLabel,
}: BoxProps) {
  const formattedTitle = title ? formatBoxTitle(title, settingsStyle) : undefined;

  return (
    <section className={[styles.boxWrapper, className].filter(Boolean).join(' ')} aria-label={ariaLabel ?? formattedTitle}>
      {formattedTitle && titlePosition === 'above' && (
        <h3 className={styles.titleAbove}>{formattedTitle}</h3>
      )}
      <div className={styles.box} data-variant={variant} data-padding={padding}>
        {formattedTitle && titlePosition === 'inside' && (
          <h3 className={styles.titleInside}>{formattedTitle}</h3>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
