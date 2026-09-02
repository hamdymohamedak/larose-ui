import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LIQUID_GLASS_DEFAULTS } from '@larose-ui/glass';
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/TabBar',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const LiquidGlassTuning: Story = {
  name: 'Liquid Glass (optical props)',
  argTypes: {
    depth: { control: { type: 'range', min: 1, max: 24, step: 1 } },
    curvature: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    scale: { control: { type: 'range', min: 0.05, max: 2, step: 0.01 } },
    splay: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
    chroma: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    blur: { control: { type: 'range', min: 0, max: 8, step: 0.1 } },
    glow: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    edgeHighlight: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    specularAngle: { control: { type: 'range', min: 0, max: 360, step: 1 } },
  },
  args: { ...LIQUID_GLASS_DEFAULTS },
  render: function LiquidGlassDemo(args) {
    const [tab, setTab] = useState('sent');
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 30% 40%, rgb(252 231 243), transparent 45%), radial-gradient(circle at 70% 60%, rgb(191 219 254), transparent 40%), linear-gradient(160deg, #eef2ff, #fdf2f8)',
        }}
      >
        <TabBar
          value={tab}
          onValueChange={setTab}
          platform="ios"
          liquidGlass={args}
        >
          <TabBarList>
            <TabBarItem value="inbox" label="Inbox" />
            <TabBarItem value="sent" label="Sent" />
            <TabBarItem value="drafts" label="Drafts" />
          </TabBarList>
          <TabBarPanel value="inbox">Inbox</TabBarPanel>
          <TabBarPanel value="sent">Sent</TabBarPanel>
          <TabBarPanel value="drafts">Drafts</TabBarPanel>
        </TabBar>
      </div>
    );
  },
};
