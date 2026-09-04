import type { CSSProperties, ElementType, ReactNode } from 'react';
import type { LabelImportance } from './types';
import styles from '@larose-ui/styles/components/Label/Label.module.css';

export interface LabelProps {
  /** System label color indicating relative importance. */
  importance?: LabelImportance;
  /** Allow selecting/copying useful static text. */
  selectable?: boolean;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  mono?: boolean;
}

/**
 * Static, non-editable text with system label colors.
 * @see https://developer.apple.com/design/human-interface-guidelines/labels
 */
export function Label({
  importance = 'primary',
  selectable = false,
  children,
  as: Component = 'span',
  className,
  style,
  mono = false,
}: LabelProps) {
  return (
    <Component
      className={[styles.root, styles[importance], className].filter(Boolean).join(' ')}
      style={style}
      data-importance={importance}
      data-selectable={selectable ? 'true' : undefined}
      data-mono={mono ? 'true' : undefined}
    >
      {children}
    </Component>
  );
}
