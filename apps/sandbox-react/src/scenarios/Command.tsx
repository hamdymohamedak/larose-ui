import { LaRoseProvider } from '@larose-ui/runtime-react';
import { ToastProvider, useToast, CommandPalette, useCommandPaletteShortcut } from '@larose-ui/react';
import { useState } from 'react';

function PaletteDemo() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  useCommandPaletteShortcut(() => setOpen(true));

  return (
    <div className="sbx-stage-pad sbx-stack">
      <p className="sbx-muted">
        Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>, or open with the button.
      </p>
      <button type="button" data-sbx="open-command" onClick={() => setOpen(true)}>
        Open command palette
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        aria-label="Sandbox command palette"
        items={[
          {
            id: 'toast',
            label: 'Show toast',
            group: 'Actions',
            onSelect: () =>
              toast({ title: 'Sandbox', message: 'Command selected.', variant: 'success' }),
          },
          {
            id: 'docs',
            label: 'Parity note',
            group: 'Actions',
            onSelect: () =>
              toast({
                title: 'Docs',
                message: 'Storybook catalogs; sandboxes + Playwright prove parity.',
                variant: 'info',
              }),
          },
        ]}
      />
    </div>
  );
}

export function CommandScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox" enableToasts={false}>
      <ToastProvider>
        <PaletteDemo />
      </ToastProvider>
    </LaRoseProvider>
  );
}
