import { useState } from 'react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { useAccelerator } from '@larose-ui/react';

function AcceleratorDemo() {
  const [last, setLast] = useState('none');

  useAccelerator(
    { key: 'j', mod: true, shift: true },
    () => setLast('mod+shift+j'),
    { id: 'sandbox-accelerator-j', allowInEditable: true },
  );

  return (
    <div className="sbx-stage-pad sbx-stack">
      <p className="sbx-muted">
        Press <kbd>⌘⇧J</kbd> / <kbd>Ctrl+Shift+J</kbd> to fire the sandbox accelerator.
      </p>
      <p data-sbx="accelerator-status">Last accelerator: {last}</p>
    </div>
  );
}

export function AcceleratorsScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
      <AcceleratorDemo />
    </LaRoseProvider>
  );
}
