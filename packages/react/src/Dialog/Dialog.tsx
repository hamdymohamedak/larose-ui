import type { ReactNode } from 'react';
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
  loading?: boolean;
  variant?: 'default' | 'destructive';
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
  loading,
  variant = 'default',
}: DialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      {children && <div className={styles.body}>{children}</div>}
      <div className={styles.actions}>
        <Button buttonRole="cancel" variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        {onConfirm && (
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
