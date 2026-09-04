import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import type { TypographyRole } from '@larose-ui/core';
import { mergeStyles } from '../shared/styleProps';
import styles from '@larose-ui/styles/components/TextView/TextView.module.css';

export interface TextViewProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'readOnly'> {
  /** When true, shows a keyboard-capable editor. */
  editable?: boolean;
  /** Allows selecting/copying useful text in read-only mode. */
  selectable?: boolean;
  maxHeight?: string;
  typographyRole?: TypographyRole;
  children?: ReactNode;
}

/**
 * Multiline styled text for long, editable, or specially formatted content.
 * @see https://developer.apple.com/design/human-interface-guidelines/text-views
 */
export const TextView = forwardRef<HTMLTextAreaElement, TextViewProps>(
  (
    {
      editable = false,
      selectable = true,
      maxHeight,
      typographyRole = 'body',
      className,
      children,
      value,
      defaultValue,
      disabled,
      inputMode,
      style,
      ...props
    },
    ref,
  ) => {
    const maxHeightStyle = maxHeight
      ? ({ '--lr-text-view-max-height': maxHeight } as CSSProperties)
      : undefined;
    const mergedStyle = mergeStyles(maxHeightStyle, style);

    if (editable) {
      return (
        <div
          className={[styles.view, styles.scrollable, className].filter(Boolean).join(' ')}
          data-lr-type={typographyRole}
          style={mergedStyle}
        >
          <textarea
            ref={ref}
            className={styles.editable}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            inputMode={inputMode}
            {...props}
          />
        </div>
      );
    }

    return (
      <div
        className={[styles.view, styles.display, styles.scrollable, className].filter(Boolean).join(' ')}
        data-lr-type={typographyRole}
        data-selectable={selectable ? 'true' : 'false'}
        style={mergedStyle}
        aria-readonly="true"
      >
        {children ?? value ?? defaultValue}
      </div>
    );
  },
);

TextView.displayName = 'TextView';
