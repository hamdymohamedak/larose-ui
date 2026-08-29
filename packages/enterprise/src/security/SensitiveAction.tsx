import { useCallback, useState } from 'react';
import { Dialog, Button } from '@larose/react';
import { useEnvironment } from '@larose/runtime';
import { useOptionalObservability } from '@larose/observability';

export interface SensitiveActionProps {
  label: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  requireProductionConfirm?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function SensitiveAction({
  label,
  description = 'This action may have irreversible consequences.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  requireProductionConfirm = true,
  onConfirm,
}: SensitiveActionProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const environment = useEnvironment();
  const observability = useOptionalObservability();
  const isProduction = environment === 'production';

  const handleConfirm = useCallback(async () => {
    setBusy(true);
    try {
      observability?.track({
        type: 'interaction',
        component: 'SensitiveAction',
        metadata: { label, environment },
      });
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }, [environment, label, observability, onConfirm]);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        description={
          isProduction && requireProductionConfirm
            ? `${description} You are in production.`
            : description
        }
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={() => void handleConfirm()}
        loading={busy}
        variant="destructive"
      />
    </>
  );
}
