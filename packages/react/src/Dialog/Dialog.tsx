import type { CSSProperties, ReactNode } from 'react';
import { resolveDialogConfirmVisibility } from '@larose-ui/component-logic/overlay';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import styles from '@larose-ui/styles/components/Dialog/Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** When false, hide the confirm button. Default true (matches Vue/Svelte). */
  showConfirm?: boolean;
  loading?: boolean;
  variant?: 'default' | 'destructive';
  className?: string;
  style?: CSSProperties;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  showConfirm,
  loading,
  variant = 'default',
  className,
  style,
}: DialogProps) {
  const confirmVisible = resolveDialogConfirmVisibility({
    showConfirm,
    hasConfirmHandler: typeof onConfirm === 'function',
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      className={className}
      style={style}
    >
      {children && <div className={styles.body}>{children}</div>}
      <div className={styles.actions}>
        <Button buttonRole="cancel" variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        {confirmVisible && (
          <Button
            variant={variant === 'destructive' ? 'ghost' : 'primary'}
            buttonRole={variant === 'destructive' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        )}
      </div>
    </Modal>
  );
}
