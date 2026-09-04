import type { UndoAction } from '@larose-ui/data-core';

export interface UndoToastProps {
  actions: UndoAction[];
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function UndoToast({ actions, onUndo, onDismiss }: UndoToastProps) {
  if (actions.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--lr-space-6)',
        right: 'var(--lr-space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--lr-space-2)',
        zIndex: 1100,
      }}
    >
      {actions.map((action) => (
        <div
          key={action.id}
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--lr-space-3)',
            padding: 'var(--lr-space-3) var(--lr-space-4)',
            background: 'var(--lr-color-surface-elevated)',
            border: '1px solid var(--lr-color-border)',
            borderRadius: 'var(--lr-radius-md)',
            boxShadow: 'var(--lr-shadow-md)',
          }}
        >
          <span style={{ fontSize: 'var(--lr-font-size-sm)' }}>{action.label}</span>
          <button type="button" onClick={() => onUndo(action.id)} style={{ fontWeight: 600 }}>
            Undo
          </button>
          <button type="button" onClick={() => onDismiss(action.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
