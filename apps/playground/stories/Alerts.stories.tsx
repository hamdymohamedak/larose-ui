import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Alert',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal alerts interrupt the current task with critical, actionable information. For non-modal contextual messages, see **Foundation/Notice**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DeleteConfirmation: Story = {
  name: 'Destructive (compact)',
  render: () => (
    <AlertDialog
      open
      onOpenChange={() => undefined}
      presentation="compact"
      title="Delete this note?"
      message="This note will be moved to Recently Deleted for 30 days."
      showCautionIcon
      actions={[
        { id: 'delete', label: 'Delete', role: 'destructive' },
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
      ]}
    />
  ),
};

export const ThreeButtonStack: Story = {
  name: 'Three actions (compact)',
  render: () => (
    <AlertDialog
      open
      onOpenChange={() => undefined}
      presentation="compact"
      title="Save changes to this document?"
      message="Your changes will be lost if you don’t save them."
      actions={[
        { id: 'save', label: 'Save', role: 'default' },
        { id: 'discard', label: 'Discard Changes', role: 'destructive' },
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
      ]}
    />
  ),
};

export const DeliberateEmptyTrash: Story = {
  name: 'Deliberate destructive (desktop)',
  render: () => (
    <AlertDialog
      open
      onOpenChange={() => undefined}
      presentation="desktop"
      title="Empty Trash?"
      message="You cannot undo this action."
      actions={[
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
        {
          id: 'empty',
          label: 'Empty Trash',
          role: 'destructive',
          deliberate: true,
        },
      ]}
      defaultActionId="empty"
    />
  ),
};

export const InformationalDone: Story = {
  name: 'Informational (tablet)',
  render: () => (
    <AlertDialog
      open
      onOpenChange={() => undefined}
      presentation="tablet"
      title="Software Update Available"
      message="A system update is available to download."
      actions={[{ id: 'done', label: 'Done', role: 'default' }]}
    />
  ),
};

export const PasswordPrompt: Story = {
  name: 'Secure field (desktop)',
  render: () => (
    <AlertDialog
      open
      onOpenChange={() => undefined}
      presentation="desktop"
      title="Enter your password to continue"
      textField={{
        label: 'Password',
        secure: true,
        placeholder: 'Password',
      }}
      suppression={{
        label: 'Do not ask again for 24 hours',
      }}
      helpUrl="https://example.com/help"
      actions={[
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
        { id: 'continue', label: 'Continue', role: 'default' },
      ]}
    />
  ),
};
