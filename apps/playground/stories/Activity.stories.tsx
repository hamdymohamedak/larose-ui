import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Activity } from '@larose-ui/react';

const meta: Meta<typeof Activity> = {
  title: 'Foundation/Activity',
  component: Activity,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    layout: 'centered',
    laRose: {
      crossFramework: 'activity',
    },
    docs: {
      description: {
        component:
          'Live activity shell that starts compact (icon / title / description) and expands with animation to reveal centered children. Click, keyboard, or `expandAfter` to grow. Use Toast for transient noise.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['collapsed', 'expanded', 'persistent'],
    },
    status: {
      control: 'select',
      options: ['idle', 'progress', 'success', 'error', 'interactive'],
    },
    priority: {
      control: 'select',
      options: ['critical', 'interactive', 'long-running', 'important', 'transient'],
    },
    expandDuration: {
      control: { type: 'number', min: 200, max: 3000, step: 50 },
      description: 'Expand/collapse morph duration in ms (or pass a CSS time string in code).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Activity>;

const uploadIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
    <path d="M12 19V5" strokeLinecap="round" />
    <path d="M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Default: Story = {
  name: 'Collapsed summary',
  args: {
    title: 'Uploading',
    description: 'Project.zip',
    status: 'progress',
    progress: 68,
    icon: uploadIcon,
  },
};

export const ExpandOnClick: Story = {
  name: 'Expand on click',
  args: {
    title: 'Uploading',
    description: 'Project.zip',
    status: 'progress',
    progress: 80,
    icon: uploadIcon,
    expandDuration: 780,
    expandedSize: { minHeight: '9rem' },
    actions: [
      { label: 'Cancel', onClick: () => undefined },
      { label: 'Details', onClick: () => undefined, variant: 'primary' },
    ],
    children: (
      <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.4 }}>
        2.4 MB of 3.0 MB · about 12 seconds left
      </div>
    ),
  },
};

export const HiddenUntilExpand: Story = {
  name: 'Hidden content until expand',
  args: {
    hideCollapsedContent: true,
    title: 'Uploading',
    description: 'Project.zip',
    status: 'progress',
    progress: 80,
    icon: uploadIcon,
    expandedSize: { width: 360, minHeight: '9rem', height: '9rem' },
    actions: [
      { label: 'Cancel', onClick: () => undefined },
      { label: 'Details', onClick: () => undefined, variant: 'primary' },
    ],
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <strong style={{ fontSize: 22, letterSpacing: '-0.03em' }}>80%</strong>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Project.zip · 2.4 MB / 3.0 MB</span>
      </div>
    ),
  },
};

export const CustomExpandedSize: Story = {
  name: 'Custom expanded size',
  args: {
    title: 'Syncing',
    description: 'Library photos',
    status: 'progress',
    progress: 55,
    icon: '↻',
    hideCollapsedContent: true,
    expandAfter: 900,
    expandedSize: { width: '28rem', minHeight: '12rem', height: '12rem' },
    actions: [{ label: 'Pause', onClick: () => undefined, variant: 'primary' }],
    children: (
      <div style={{ fontSize: 13, opacity: 0.8, maxWidth: 280 }}>
        Keeping your photo library in sync across devices…
      </div>
    ),
  },
};

export const ExpandAfterDelay: Story = {
  name: 'Expand after delay',
  args: {
    title: 'Uploading',
    description: 'Project.zip',
    status: 'progress',
    progress: 42,
    icon: uploadIcon,
    expandAfter: 1600,
    actions: [
      { label: 'Cancel', onClick: () => undefined, variant: 'ghost' },
      { label: 'Pause', onClick: () => undefined, variant: 'primary' },
    ],
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <strong style={{ fontSize: 13 }}>Almost there</strong>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Uploading to iCloud Drive</span>
      </div>
    ),
  },
};

export const ParentWithBody: Story = {
  name: 'Parent + centered body',
  render: function ParentBodyRender() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Activity
        expanded={expanded}
        onExpandedChange={setExpanded}
        status="progress"
        progress={80}
        icon={uploadIcon}
        title={expanded ? 'Uploading 80%' : 'Uploading'}
        description="Project.zip"
        actions={[
          { label: 'Cancel', onClick: () => undefined },
          { label: 'Details', onClick: () => undefined, variant: 'primary' },
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>80%</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>2.4 MB / 3.0 MB</div>
        </div>
      </Activity>
    );
  },
};

export const Controlled: Story = {
  name: 'Controlled expand',
  render: function ControlledRender() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Activity
        expanded={expanded}
        onExpandedChange={setExpanded}
        status="progress"
        priority="interactive"
        progress={42}
        icon="✦"
        title={expanded ? 'AI generation' : 'Generating… 42%'}
        description={expanded ? 'Drafting release notes from the latest commits.' : 'release notes'}
        style={{ ['--lr-activity-accent' as string]: '#bf5af2' }}
        actions={
          expanded
            ? [{ label: 'Stop', onClick: () => undefined, variant: 'danger' }]
            : undefined
        }
      >
        <p style={{ margin: 0, fontSize: 12, opacity: 0.75, maxWidth: 220 }}>
          Reading commits, summarizing changes, and drafting release notes…
        </p>
      </Activity>
    );
  },
};

export const Persistent: Story = {
  name: 'Persistent (locked open)',
  render: () => (
    <Activity
      mode="persistent"
      status="interactive"
      priority="important"
      expandable={false}
      style={{
        ['--lr-activity-bg' as string]: '#111827',
        ['--lr-activity-radius-expanded' as string]: '22px',
      }}
    >
      <Activity.Leading>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#32d74b',
            boxShadow: '0 0 0 4px rgb(50 215 75 / 0.2)',
          }}
        />
      </Activity.Leading>
      <Activity.Content>
        <Activity.Meta>
          <span className="title" style={{ fontWeight: 600, fontSize: 13 }}>
            Live connection
          </span>
          <span style={{ fontSize: 11.5, opacity: 0.65 }}>us-east-1 · 18ms</span>
        </Activity.Meta>
      </Activity.Content>
      <Activity.Trailing>
        <button type="button" style={actionStyle}>
          Details
        </button>
      </Activity.Trailing>
    </Activity>
  ),
};

export const SuccessAndError: Story = {
  name: 'Success / error',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <Activity status="success" icon="✓" title="Published" description="docs site" />
      <Activity
        defaultExpanded
        status="error"
        priority="critical"
        icon="!"
        title="Payment failed"
        description="Card was declined."
        actions={[{ label: 'Retry', onClick: () => undefined, variant: 'primary' }]}
      >
        <span style={{ fontSize: 12, opacity: 0.7 }}>Try another card or contact your bank.</span>
      </Activity>
    </div>
  ),
};

const actionStyle: CSSProperties = {
  border: 'none',
  borderRadius: 999,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  background: 'rgb(255 255 255 / 0.12)',
  color: '#f5f5f7',
};
