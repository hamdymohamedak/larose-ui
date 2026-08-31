import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { ShareIcon } from './icons';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

export interface ShareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/** Toolbar share control — Apple HIG placement next to document actions. */
export const ShareButton = forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ label = 'Share', className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={[styles.toolbarButton, className].filter(Boolean).join(' ')}
      aria-label={label}
      {...props}
    >
      <ShareIcon />
    </button>
  ),
);

ShareButton.displayName = 'ShareButton';
