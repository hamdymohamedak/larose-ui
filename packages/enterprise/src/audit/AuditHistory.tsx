import { useAudit } from './AuditProvider';
import styles from './AuditHistory.module.css';

export interface AuditHistoryProps {
  field: string;
  resourceId?: string;
  onClose?: () => void;
}

export function AuditHistory({ field, resourceId, onClose }: AuditHistoryProps) {
  const { getHistory } = useAudit();
  const history = getHistory(field, resourceId);

  return (
    <aside className={styles.panel} aria-label={`Audit history for ${field}`}>
      <header className={styles.header}>
        <strong>{field} history</strong>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close history">
            ×
          </button>
        )}
      </header>
      {history.length === 0 ? (
        <p className={styles.empty}>No changes recorded.</p>
      ) : (
        <ul className={styles.list}>
          {history.map((entry) => (
            <li key={entry.id}>
              <div className={styles.change}>
                {entry.before || '(empty)'} → {entry.after || '(empty)'}
              </div>
              <div className={styles.meta}>
                Changed by {entry.actor} · {new Date(entry.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
