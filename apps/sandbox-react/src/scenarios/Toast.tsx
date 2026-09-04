import { LaRoseProvider } from '@larose-ui/runtime-react';
import { ToastProvider, useToast } from '@larose-ui/react';

function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="sbx-stage-pad sbx-stack">
      <p className="sbx-muted">Triggers a success toast via the runtime toast provider.</p>
      <button
        type="button"
        data-sbx="show-toast"
        onClick={() =>
          toast({
            title: 'Saved',
            message: 'Toast parity check.',
            variant: 'success',
          })
        }
      >
        Show toast
      </button>
    </div>
  );
}

export function ToastScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox" enableToasts={false}>
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>
    </LaRoseProvider>
  );
}
