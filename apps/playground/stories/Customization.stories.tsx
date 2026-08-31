import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  Input,
  LaRoseProvider,
  Modal,
  Typography,
  createTheme,
} from '@larose-ui/react';
import { useState } from 'react';

const customTheme = createTheme({
  base: 'refined',
  colors: {
    primary: '#6C5CE7',
    secondary: '#00CEC9',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  motion: {
    preset: 'snappy',
    duration: { normal: '180ms' },
  },
});

const meta: Meta = {
  title: 'Design System/Customization',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

function Showcase() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 720 }}>
      <Typography role="title">Custom theme showcase</Typography>
      <Typography role="body">
        Same components, same behavior — a substantially different visual language via theme
        tokens, component tokens, and defaults.
      </Typography>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button>Secondary by default</Button>
        <Button variant="primary">Primary override</Button>
      </div>

      <Input label="Workspace name" placeholder="Acme Corp" />

      <Card>
        <Card.Header>
          <Card.Title>Custom card</Card.Title>
          <Card.Description>Square corners, no shadow, Inter typography.</Card.Description>
        </Card.Header>
        <Card.Content>
          Component tokens and defaults are resolved through LaRoseProvider.
        </Card.Content>
      </Card>

      <Button variant="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Custom modal" motion={{ duration: 180 }}>
        Modal motion and visual tokens are customizable without changing behavior.
      </Modal>
    </div>
  );
}

export const DefaultRefined: Story = {
  name: 'Default (Apple-inspired)',
  render: () => (
    <LaRoseProvider>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
        <Typography role="title">Refined default</Typography>
        <Button>Primary action</Button>
        <Card title="Default card" description="Zero configuration required.">
          The current laRose visual experience.
        </Card>
      </div>
    </LaRoseProvider>
  ),
};

export const SmallOverrides: Story = {
  name: '10% customization',
  render: () => (
    <LaRoseProvider
      themeConfig={{
        colors: { primary: '#6C5CE7' },
        radius: { md: '10px' },
      }}
    >
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
        <Typography role="title">Mostly laRose</Typography>
        <Button>Custom primary color</Button>
        <Card title="Same components" description="Only a few tokens changed." />
      </div>
    </LaRoseProvider>
  ),
};

export const FullCustomTheme: Story = {
  name: '90% customization',
  render: () => (
    <LaRoseProvider
      themeConfig={customTheme}
      components={{
        Button: {
          defaultProps: {
            variant: 'secondary',
            size: 'md',
          },
          tokens: {
            radius: '4px',
          },
        },
        Card: {
          tokens: {
            radius: '8px',
            shadow: 'none',
          },
        },
        Modal: {
          tokens: {
            radius: '12px',
          },
        },
        Input: {
          defaultProps: {
            inputSize: 'md',
          },
        },
      }}
    >
      <Showcase />
    </LaRoseProvider>
  ),
};
