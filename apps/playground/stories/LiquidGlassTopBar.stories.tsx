import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState, type ComponentProps } from 'react';
import { LiquidGlassTopBar } from '@larose-ui/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassTopBarArgTypes,
  liquidGlassTopBarDefaults,
} from './glass/liquidGlassStoryControls';
import { TOP_BAR_NAV_ITEMS, TopBarTrailingIcon } from './glass/liquidGlassStoryItems';

type TopBarStoryArgs = ComponentProps<typeof LiquidGlassTopBar> & {
  showTrailing?: boolean;
};

function ControlledTopBar({
  showTrailing = true,
  defaultActiveKey,
  title,
  variant,
  insetX,
  top,
  borderRadius,
  onChange: _storybookOnChange,
  ...props
}: TopBarStoryArgs) {
  const [active, setActive] = useState(defaultActiveKey ?? 'home');
  const resolvedVariant = variant ?? 'floating';

  useEffect(() => {
    if (defaultActiveKey) setActive(defaultActiveKey);
  }, [defaultActiveKey]);

  return (
    <LiquidGlassTopBar
      {...props}
      variant={resolvedVariant}
      title={title}
      insetX={insetX ?? (resolvedVariant === 'edge' ? 0 : liquidGlassTopBarDefaults.insetX)}
      top={top ?? (resolvedVariant === 'edge' ? 0 : liquidGlassTopBarDefaults.top)}
      borderRadius={borderRadius ?? (resolvedVariant === 'edge' ? 0 : liquidGlassTopBarDefaults.borderRadius)}
      items={TOP_BAR_NAV_ITEMS}
      activeKey={active}
      onChange={setActive}
      trailing={showTrailing ? <TopBarTrailingIcon /> : undefined}
    />
  );
}

const meta: Meta<TopBarStoryArgs> = {
  title: 'Glass/LiquidGlass/TopBar',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  component: ControlledTopBar,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Floating or edge-aligned top navigation bar. All layout, color, and optics props are exposed in Controls.',
      },
    },
  },
  argTypes: liquidGlassTopBarArgTypes,
  args: liquidGlassTopBarDefaults,
};

export default meta;
type Story = StoryObj<TopBarStoryArgs>;

export const Playground: Story = {
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={120}>
      <ControlledTopBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const Edge: Story = {
  args: {
    variant: 'edge',
    insetX: 0,
    top: 0,
    borderRadius: 0,
  },
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={120}>
      <ControlledTopBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const NoTrailing: Story = {
  args: { showTrailing: false },
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={120}>
      <ControlledTopBar {...args} />
    </GlassScrollTestScene>
  ),
};

export const StrongRefraction: Story = {
  args: {
    displacementScale: 50,
    bezelWidth: 28,
    specularTopOpacity: 0.95,
    refractionStrength: 1.2,
  },
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={120}>
      <ControlledTopBar {...args} />
    </GlassScrollTestScene>
  ),
};
