import { useState } from 'react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Modal } from '@larose-ui/react';

function OverlayDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sbx-stage-pad sbx-stack">
      <p className="sbx-muted">Modal portal + focus trap. Escape or Close dismisses.</p>
      <button type="button" data-sbx="open-modal" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm action"
        description="Sandbox overlay scenario."
      >
        <p className="sbx-muted">Focus should stay inside the dialog while open.</p>
        <button type="button" data-sbx="close-modal" onClick={() => setOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}

export function OverlaysScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
      <OverlayDemo />
    </LaRoseProvider>
  );
}
