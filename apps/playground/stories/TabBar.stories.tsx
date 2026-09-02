import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from '@larose-ui/react';

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M4 8h6l2 2h8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" aria-hidden="true">
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zm0 0 2-3h12l2 3" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

const meta: Meta<typeof TabBar> = {
  title: 'Foundation/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof TabBar>;

export const IOS: Story = {
  name: 'Tab bar (iOS)',
  argTypes: {
    liquidGlass: {
      control: 'boolean',
      description: 'Floating liquid glass with displacement-mapped selection lens.',
    },
  },
  args: {
    liquidGlass: true,
    platform: 'ios',
  },
  render: function TabBarDemo({ liquidGlass = true, platform = 'ios' }) {
    const [tab, setTab] = useState('sent');
    return (
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 20% 20%, rgb(252 231 243 / 0.9), transparent 42%), radial-gradient(circle at 80% 10%, rgb(224 231 255 / 0.85), transparent 38%), linear-gradient(160deg, #fdf2f8 0%, #eef2ff 45%, #f8fafc 100%)',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '14rem',
            height: '14rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgb(244 114 182 / 0.55), rgb(244 114 182 / 0))',
            filter: 'blur(2px)',
            top: '42%',
            left: '38%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '11rem',
            height: '11rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgb(129 140 248 / 0.5), rgb(129 140 248 / 0))',
            filter: 'blur(2px)',
            top: '48%',
            left: '58%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '9rem',
            height: '9rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgb(251 191 36 / 0.35), rgb(251 191 36 / 0))',
            filter: 'blur(1px)',
            top: '54%',
            left: '46%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '0.8125rem',
            color: liquidGlass ? '#6366f1' : '#8e8e93',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {liquidGlass
            ? '● Liquid Glass ON — drag tabs; lens uses displacement refraction'
            : '○ Liquid Glass OFF — standard tab bar'}
        </p>
        <TabBar
          value={tab}
          onValueChange={setTab}
          platform={platform}
          liquidGlass={liquidGlass}
          searchTab={{ style: 'button' }}
        >
          <TabBarList>
            <TabBarItem value="inbox" label="Inbox" icon={<InboxIcon />} badge={3} />
            <TabBarItem value="sent" label="Sent" icon={<FolderIcon />} />
            <TabBarItem value="drafts" label="Drafts" icon={<FolderIcon />} disabled />
          </TabBarList>
          <TabBarPanel value="inbox">Inbox content</TabBarPanel>
          <TabBarPanel value="sent">Sent content</TabBarPanel>
          <TabBarPanel value="drafts">Drafts (disabled tab stays visible)</TabBarPanel>
          <TabBarPanel value="__search__">Search landing page</TabBarPanel>
        </TabBar>
      </div>
    );
  },
};
