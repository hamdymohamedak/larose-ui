import { useState, type ReactNode } from 'react';
import {
  AlertDialog,
  Button,
  CommandPalette,
  Dialog,
  Drawer,
  Input,
  Modal,
  useToast,
  ToastProvider,
} from '@larose-ui/react';
import { PreviewFrame } from '@/components/PreviewFrame';

export function ModalPreview() {
  const [open, setOpen] = useState(false);

  return (
    <PreviewFrame title="Modal">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit employee"
        description="Update profile details for this team member."
      >
        <Input label="Full name" defaultValue="Ahmed Mohamed" />
        <Input label="Email" defaultValue="ahmed@company.com" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </div>
      </Modal>
    </PreviewFrame>
  );
}

export function DrawerPreview() {
  const [open, setOpen] = useState(false);

  return (
    <PreviewFrame title="Drawer">
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Employee details"
        description="Review and edit profile information."
        side="right"
      >
        <Input label="Full name" defaultValue="Ahmed Mohamed" />
        <Button onClick={() => setOpen(false)}>Save changes</Button>
      </Drawer>
    </PreviewFrame>
  );
}

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <PreviewFrame title="Dialog">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete employee?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => setOpen(false)}
      />
    </PreviewFrame>
  );
}

export function AlertDialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <PreviewFrame title="Alert dialog">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Show alert
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Discard changes?"
        message="You have unsaved changes that will be lost."
        actions={[
          { id: 'keep', label: 'Keep editing', role: 'cancel', onSelect: () => setOpen(false) },
          { id: 'discard', label: 'Discard', role: 'destructive', onSelect: () => setOpen(false) },
        ]}
      />
    </PreviewFrame>
  );
}

export function CommandPalettePreview() {
  const [open, setOpen] = useState(false);

  return (
    <PreviewFrame title="Command palette">
      <Button onClick={() => setOpen(true)}>Open commands</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'new', label: 'New employee', onSelect: () => setOpen(false) },
          { id: 'export', label: 'Export CSV', onSelect: () => setOpen(false) },
        ]}
      />
    </PreviewFrame>
  );
}

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({ title: 'Saved', message: 'Employee profile updated.', variant: 'success' })
      }
    >
      Show toast
    </Button>
  );
}

export function ToastProviderPreview() {
  return (
    <PreviewFrame title="Toast">
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>
    </PreviewFrame>
  );
}

export const INTERACTIVE_PREVIEWS: Record<string, () => ReactNode> = {
  Modal: () => <ModalPreview />,
  Drawer: () => <DrawerPreview />,
  Dialog: () => <DialogPreview />,
  AlertDialog: () => <AlertDialogPreview />,
  CommandPalette: () => <CommandPalettePreview />,
  ToastProvider: () => <ToastProviderPreview />,
};
