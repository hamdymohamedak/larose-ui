import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  Typography,
} from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/runtime-react';

function RefinedShell({ children }: { children: ReactNode }) {
  return (
    <LaRoseProvider themePreset="refined" appearance="light" locale="en">
      <div style={{ display: 'flex', minHeight: 420, width: '100%', maxWidth: 960 }}>
        <Sidebar>
          <SidebarHeader>laRose</SidebarHeader>
          <SidebarNav>
            <SidebarItem active>Overview</SidebarItem>
            <SidebarItem>Employees</SidebarItem>
            <SidebarItem>Settings</SidebarItem>
          </SidebarNav>
        </Sidebar>
        <div style={{ flex: 1, padding: 'var(--lr-space-6)' }}>{children}</div>
      </div>
    </LaRoseProvider>
  );
}

const meta: Meta = {
  tags: ['fw-react'],
  title: 'Design System/Refined Theme',
  parameters: { layout: 'fullscreen', laRose: { standalone: true } },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <RefinedShell>
      <Typography role="largeTitle">Refined Design Language</Typography>
      <Typography role="subheadline">
        Apple-inspired preset — calm, precise, cross-platform. Not a macOS clone.
      </Typography>
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        <Badge variant="info">Surfaces</Badge>
        <Badge variant="success">Typography</Badge>
        <Badge>Motion</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card title="Elevated" description="Default card surface">
          <Button variant="primary">Primary</Button>
        </Card>
        <Card title="Solid" description="Base panel">
          <Button variant="secondary">Secondary</Button>
        </Card>
        <Card title="Floating" description="Raised layer">
          <Button variant="outline">Outline</Button>
        </Card>
      </div>
    </RefinedShell>
  ),
};

export const TypographyScale: Story = {
  render: () => (
    <LaRoseProvider themePreset="refined">
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Typography role="display">Display</Typography>
        <Typography role="largeTitle">Large Title</Typography>
        <Typography role="title">Title</Typography>
        <Typography role="headline">Headline</Typography>
        <Typography role="body">Body — primary reading text for interfaces.</Typography>
        <Typography role="callout">Callout — slightly smaller supporting text.</Typography>
        <Typography role="subheadline">Subheadline — muted secondary information.</Typography>
        <Typography role="footnote">Footnote — tertiary detail.</Typography>
        <Typography role="caption">Caption — labels and metadata.</Typography>
      </div>
    </LaRoseProvider>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <LaRoseProvider themePreset="refined">
      <div
        style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          background: 'var(--lr-color-background)',
        }}
      >
        {(['solid', 'secondary', 'elevated', 'floating', 'glass'] as const).map((surface) => (
          <div
            key={surface}
            data-lr-surface={surface}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--lr-radius-lg)',
              minHeight: 80,
              fontSize: 'var(--lr-font-size-sm)',
            }}
          >
            {surface}
          </div>
        ))}
      </div>
    </LaRoseProvider>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem' }}>
      <LaRoseProvider theme="light">
        <Card title="Default preset" padding="md">
          <Input label="Email" placeholder="you@company.com" />
          <div style={{ marginTop: '0.75rem' }}>
            <Button variant="primary">Save</Button>
          </div>
        </Card>
      </LaRoseProvider>
      <LaRoseProvider themePreset="refined">
        <Card title="Refined preset" padding="md">
          <Input label="Email" placeholder="you@company.com" />
          <div style={{ marginTop: '0.75rem' }}>
            <Button variant="primary">Save</Button>
          </div>
        </Card>
      </LaRoseProvider>
    </div>
  ),
};

export const RTLArabic: Story = {
  render: () => (
    <LaRoseProvider themePreset="refined" locale="ar">
      <div style={{ padding: '2rem', maxWidth: 480 }}>
        <Typography role="largeTitle">لوحة التحكم</Typography>
        <Typography role="body">واجهة عربية مع اتجاه RTL و preset Refined.</Typography>
        <Alert variant="info" title="معلومة">
          يدعم النظام العربية والاتجاه من اليمين لليسار.
        </Alert>
      </div>
    </LaRoseProvider>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <LaRoseProvider themePreset="refined" appearance="dark">
      <div style={{ padding: '2rem', minHeight: 280, background: 'var(--lr-color-background)' }}>
        <Typography role="largeTitle">Dark appearance</Typography>
        <Typography role="subheadline">Designed dark surfaces — not inverted light.</Typography>
        <Card title="Activity">
          <Typography role="body">3 new employees this week.</Typography>
        </Card>
      </div>
    </LaRoseProvider>
  ),
};
