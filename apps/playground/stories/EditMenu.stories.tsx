import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  EditMenu,
  EditMenuSelection,
  Typography,
  type EditMenuContext,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Edit Menus',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const CompactSelectedText: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'editMenu' } },
  args: { open: true, variant: 'compact', context: { hasSelection: true, canPaste: true, isEditable: true } },
  name: 'Compact (touch and hold)',
  render: function CompactDemo() {
    const [lastAction, setLastAction] = useState('Touch and hold selected text');

    const context: EditMenuContext = {
      hasSelection: true,
      canPaste: true,
      isEditable: true,
      contentType: 'text',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <EditMenu
          context={context}
          variant="compact"
          onAction={(id) => setLastAction(id)}
        >
          <EditMenuSelection selected>
            The edit menu appears as a compact horizontal bar when revealed with Multi-Touch gestures.
          </EditMenuSelection>
        </EditMenu>
      </div>
    );
  },
};

export const ContextPointer: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'editMenu' } },
  args: { open: true, variant: 'context', context: { hasSelection: true, canPaste: true, isEditable: true } },
  name: 'Context menu (pointer)',
  render: function ContextDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click selected text');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <EditMenu
          context={{
            hasSelection: true,
            canPaste: false,
            isEditable: true,
            contentType: 'text',
          }}
          variant="context"
          onAction={(id) => setLastAction(id)}
        >
          <EditMenuSelection selected>
            On iPadOS with a keyboard or pointing device, the edit menu opens directly as a vertical context menu.
          </EditMenuSelection>
        </EditMenu>
      </div>
    );
  },
};

export const AddressSelection: Story = {
  name: 'Address (contextual actions)',
  render: function AddressDemo() {
    const [lastAction, setLastAction] = useState('Select the address');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <EditMenu
          context={{
            hasSelection: true,
            canPaste: false,
            isEditable: false,
            allowsCopy: true,
            contentType: 'address',
          }}
          customActions={[
            { id: 'directions', label: 'Get Directions', group: 'intelligence' },
          ]}
          variant="compact"
          onAction={(id) => setLastAction(id)}
        >
          <EditMenuSelection selected>
            1 Apple Park Way, Cupertino, CA
          </EditMenuSelection>
        </EditMenu>
      </div>
    );
  },
};

export const NoSelection: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'editMenu' } },
  args: { open: true, variant: 'compact', context: { hasSelection: false, canPaste: true, isEditable: true } },
  name: 'No selection',
  render: function NoSelectionDemo() {
    const [lastAction, setLastAction] = useState('Touch and hold without a selection');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <EditMenu
          context={{
            hasSelection: false,
            canPaste: true,
            isEditable: true,
          }}
          variant="compact"
          open
          onOpenChange={() => undefined}
          onAction={(id) => setLastAction(id)}
        >
          <EditMenuSelection>
            Tap Select to choose content, or Paste when the pasteboard has content.
          </EditMenuSelection>
        </EditMenu>
      </div>
    );
  },
};

export const CustomFormatCommands: Story = {
  name: 'Custom format commands',
  render: function FormatDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click formatted text');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <EditMenu
          context={{
            hasSelection: true,
            canPaste: true,
            isEditable: true,
            contentType: 'text',
          }}
          customActions={[
            { id: 'bold', label: 'Bold', group: 'format' },
            { id: 'italic', label: 'Italic', group: 'format' },
          ]}
          variant="context"
          open
          onOpenChange={() => undefined}
          onAction={(id) => setLastAction(id)}
        >
          <EditMenuSelection selected>Quarterly revenue increased 12% year over year.</EditMenuSelection>
        </EditMenu>
      </div>
    );
  },
};

export const CopyStaticText: Story = {
  name: 'Copy static text',
  render: function StaticCopyDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click the caption');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <figure style={{ margin: 0 }}>
          <div
            style={{
              height: '8rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
            }}
          />
          <EditMenu
            context={{
              hasSelection: false,
              canPaste: false,
              isEditable: false,
              allowsCopy: true,
              contentType: 'text',
            }}
            variant="context"
            includeStandardActions
            onAction={(id) => setLastAction(id)}
          >
            <figcaption style={{ marginTop: '0.5rem' }}>
              <EditMenuSelection>Sunset over the Pacific — August 2026</EditMenuSelection>
            </figcaption>
          </EditMenu>
        </figure>
      </div>
    );
  },
};
