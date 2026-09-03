import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { LiquidGlassTabBar } from '@larose-ui/react';
import type { LiquidGlassTabBarProps } from '@larose-ui/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassTabBarArgTypes,
  liquidGlassTabBarDefaults,
  type TabBarTabPreset,
} from './glass/liquidGlassStoryControls';
import { TAB_PRESETS } from './glass/liquidGlassStoryItems';

type TabBarStoryArgs = LiquidGlassTabBarProps & { tabPreset: TabBarTabPreset };

function ControlledTabBar({
  tabPreset,
  defaultActiveKey,
  onChange: _storybookOnChange,
  ...props
}: TabBarStoryArgs) {
  const items = TAB_PRESETS[tabPreset];
  const [active, setActive] = useState(
    () => defaultActiveKey ?? items[0]?.key ?? 'home',
  );

  useEffect(() => {
    const keys = TAB_PRESETS[tabPreset].map((item) => item.key);
    if (defaultActiveKey && keys.includes(defaultActiveKey)) {
      setActive(defaultActiveKey);
    } else {
      setActive((prev) => (keys.includes(prev) ? prev : keys[0] ?? 'home'));
    }
  }, [tabPreset, defaultActiveKey]);

  return (
    <LiquidGlassTabBar
      {...props}
      items={items}
      activeKey={active}
      onChange={setActive}
    />
  );
}

const meta: Meta<TabBarStoryArgs> = {
  title: 'Glass/LiquidGlass TabBar',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  component: ControlledTabBar,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'iOS-style liquid glass tab bar. Use the Controls panel to tune every prop — layout, indicator, colors, and optics.',
      },
    },
  },
  argTypes: liquidGlassTabBarArgTypes,
  args: liquidGlassTabBarDefaults,
};

export default meta;
type Story = StoryObj<TabBarStoryArgs>;

export const Playground: Story = {
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const IconsOnly: Story = {
  args: { tabPreset: 'iconsOnly', height: 60, maxWidth: 340 },
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const WithBadges: Story = {
  args: { tabPreset: 'badges', defaultActiveKey: 'notifs' },
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const StrongRefraction: Story = {
  args: {
    displacementScale: 60,
    bezelWidth: 32,
    refractionStrength: 1.4,
    specularTopOpacity: 0.95,
    blur: 22,
  },
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const Subtle: Story = {
  args: {
    displacementScale: 18,
    bezelWidth: 12,
    refractionStrength: 0.6,
    specularTopOpacity: 0.45,
    specularEdgeOpacity: 0.25,
    innerTopHighlight: 0.18,
    innerBottomShadow: 0.1,
    shadowIntensity: 0.6,
    tint: 'rgba(255,255,255,0.07)',
    tintFallback: 'rgba(255,255,255,0.10)',
  },
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const NoIndicator: Story = {
  args: { showIndicator: false, inactiveColor: 'rgba(255,255,255,0.45)' },
  render: (args) => (
    <GlassScrollTestScene>
      <ControlledTabBar {...args} />
    </GlassScrollTestScene>
  ),
};
