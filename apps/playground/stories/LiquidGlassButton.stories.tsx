import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import {
  LiquidGlass,
  LiquidGlassButton,
  LiquidGlassTabBar,
  LiquidGlassTopBar,
} from '@larose-ui/glass/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassButtonArgTypes,
  liquidGlassButtonDefaults,
} from './glass/liquidGlassStoryControls';
import {
  TAB_PRESETS,
  TOP_BAR_NAV_ITEMS,
  TopBarTrailingIcon,
  centerScene,
} from './glass/liquidGlassStoryItems';

type ButtonArgs = ComponentProps<typeof LiquidGlassButton>;

const meta: Meta<ButtonArgs> = {
  title: 'Glass/LiquidGlass/Button',
  component: LiquidGlassButton,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component: 'Pill button with full liquid glass optics. Tune every prop from Controls.',
      },
    },
  },
  argTypes: liquidGlassButtonArgTypes,
  args: liquidGlassButtonDefaults,
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(<LiquidGlassButton {...args} />)}
    </GlassScrollTestScene>
  ),
};

export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          pointerEvents: 'none',
        }}
      >
        <LiquidGlassButton style={{ pointerEvents: 'auto' }}>Primary</LiquidGlassButton>
        <LiquidGlassButton
          style={{ pointerEvents: 'auto' }}
          displacementScale={22}
          tint="rgba(255,255,255,0.06)"
        >
          Subtle
        </LiquidGlassButton>
        <LiquidGlassButton style={{ pointerEvents: 'auto' }} disabled>
          Disabled
        </LiquidGlassButton>
      </div>
    </GlassScrollTestScene>
  ),
};

export const Gallery: StoryObj = {
  name: 'Gallery / All components',
  parameters: { controls: { disable: true } },
  render: () => {
    const [nav, setNav] = useState('discover');
    const [tab, setTab] = useState('home');

    return (
      <GlassScrollTestScene>
        <LiquidGlassTopBar
          title="laRose"
          items={TOP_BAR_NAV_ITEMS}
          activeKey={nav}
          onChange={setNav}
          trailing={<TopBarTrailingIcon />}
        />

        <div style={{ marginTop: 72, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <LiquidGlass
            width="100%"
            height={140}
            borderRadius={22}
            style={{ display: 'flex', alignItems: 'flex-end', padding: 20 }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: '#F3F1FA' }}>
                Glass card
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#B9B3D6' }}>
                Scroll — the aurora refracts through every surface.
              </p>
            </div>
          </LiquidGlass>

          <div style={{ display: 'flex', gap: 12 }}>
            <LiquidGlassButton>Get started</LiquidGlassButton>
            <LiquidGlassButton displacementScale={20} tint="rgba(255,255,255,0.07)">
              Learn more
            </LiquidGlassButton>
          </div>
        </div>

        <LiquidGlassTabBar items={TAB_PRESETS.threeTabs} activeKey={tab} onChange={setTab} />
      </GlassScrollTestScene>
    );
  },
};
