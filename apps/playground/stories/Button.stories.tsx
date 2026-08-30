import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  ButtonGroup,
  HelpButton,
  SquareButton,
  Typography,
} from '@larose-ui/react';

function ShareGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true">
      <path
        d="M12 3v10.2M12 3l3.5 3.5M12 3 8.5 6.5M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    buttonRole: {
      control: 'select',
      options: ['normal', 'primary', 'cancel', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'select',
      options: ['capsule', 'circle', 'roundedRect'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Add to Cart', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary', buttonRole: 'cancel' },
};

export const Loading: Story = {
  args: {
    children: 'Checkout',
    loadingLabel: 'Checking out…',
    loading: true,
  },
};

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
};

export const DestructiveFilled: Story = {
  args: { children: 'Delete Employee', variant: 'destructive' },
};

export const DestructivePlain: Story = {
  args: {
    children: 'Delete Account',
    variant: 'ghost',
    buttonRole: 'destructive',
  },
};

export const OpensAnotherView: Story = {
  name: 'Opens another view (…)',
  args: {
    children: 'Edit',
    variant: 'secondary',
    opensAnotherView: true,
    tooltip: 'Opens AutoFill settings',
  },
};

export const IconOnly: Story = {
  render: () => (
    <Button
      shape="circle"
      variant="secondary"
      iconOnly
      aria-label="Share"
      tooltip="Share"
      leftIcon={<ShareGlyph />}
    />
  ),
};

export const StyleNotSize: Story = {
  name: 'Style, not size',
  render: () => (
    <ButtonGroup aria-label="Save options">
      <Button variant="primary" buttonRole="primary">
        Save
      </Button>
      <Button variant="secondary">Save As…</Button>
      <Button variant="secondary" buttonRole="cancel">
        Cancel
      </Button>
    </ButtonGroup>
  ),
};

/** Apple HIG alert pattern: nondestructive primary, plain destructive, cancel. */
export const AlertActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: 280,
        padding: '1rem',
        borderRadius: 'var(--lr-radius-lg)',
        background: 'var(--lr-color-surface)',
        boxShadow: 'var(--lr-shadow-md)',
        position: 'relative',
      }}
    >
      <HelpButton
        helpTopic="Learn about deleting items"
        style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}
        onClick={() => undefined}
      />
      <p style={{ margin: 0, fontWeight: 600 }}>Delete this item?</p>
      <p style={{ margin: 0, color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
        This action cannot be undone.
      </p>
      <ButtonGroup orientation="vertical" aria-label="Alert actions">
        <Button variant="primary" buttonRole="primary">
          Keep Item
        </Button>
        <Button variant="ghost" buttonRole="destructive">
          Delete
        </Button>
        <Button variant="secondary" buttonRole="cancel">
          Cancel
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const VisionOSStack: Story = {
  name: 'visionOS vertical stack',
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Scene actions">
      <Button shape="roundedRect" variant="primary">
        Place Object
      </Button>
      <Button shape="roundedRect" variant="secondary">
        Reset Scene
      </Button>
      <Button shape="roundedRect" variant="ghost" buttonRole="cancel">
        Cancel
      </Button>
    </ButtonGroup>
  ),
};

export const WatchFullWidth: Story = {
  name: 'watchOS full width',
  render: () => (
    <div style={{ maxWidth: '12rem' }}>
      <ButtonGroup orientation="vertical" fullWidth aria-label="Workout actions">
        <Button fullWidth variant="primary">
          Start
        </Button>
        <Button fullWidth variant="secondary">
          Settings
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const SquareButtons: Story = {
  name: 'Square buttons (in-view)',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <SquareButton icon="+" aria-label="Add row" tooltip="Add row" onClick={() => undefined} />
      <SquareButton icon="−" aria-label="Remove row" tooltip="Remove row" onClick={() => undefined} />
      <Typography role="footnote" muted>
        Use square buttons inside a view, not in the window frame.
      </Typography>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Plain</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Regular (44pt)</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
