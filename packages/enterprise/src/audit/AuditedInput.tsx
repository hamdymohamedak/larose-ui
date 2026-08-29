import { useState, type ChangeEvent } from 'react';
import { Input, type InputProps } from '@larose-ui/react';
import { useOptionalObservability } from '@larose-ui/observability';
import { useOptionalAudit } from './AuditProvider';
import { AuditHistory } from './AuditHistory';
import styles from './AuditedInput.module.css';

export interface AuditedInputProps extends Omit<InputProps, 'onChange'> {
  field: string;
  resourceId?: string;
  showHistory?: boolean;
  onChange?: (value: string) => void;
}

export function AuditedInput({
  field,
  resourceId,
  showHistory = true,
  value,
  defaultValue,
  onChange,
  ...props
}: AuditedInputProps) {
  const audit = useOptionalAudit();
  const observability = useOptionalObservability();
  const [internal, setInternal] = useState(String(defaultValue ?? ''));
  const [historyOpen, setHistoryOpen] = useState(false);
  const current = value !== undefined ? String(value) : internal;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const previous = current;

    if (audit && previous !== next) {
      audit.recordChange({ field, before: previous, after: next, resourceId });
    }

    observability?.track({
      type: 'interaction',
      component: 'AuditedInput',
      metadata: { field, resourceId, action: 'change' },
    });

    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={styles.wrapper} data-lr-audited-field={field}>
      <Input {...props} value={current} onChange={handleChange} />
      {showHistory && audit && (
        <>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() => setHistoryOpen((v) => !v)}
          >
            View History
          </button>
          {historyOpen && (
            <AuditHistory field={field} resourceId={resourceId} onClose={() => setHistoryOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}
