import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Glass,
  GlassButton,
  GlassCard,
  GlassSlider,
  GlassSwitch,
  GlassToggleGroup,
  GlassPopover,
  GlassTooltip,
} from '@larose-ui/glass/react';
import { DraggableGlassProbe, GlassStoryScene } from './glass/GlassStoryScene';

const meta: Meta = {
  title: 'Glass',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Drag any demo over the fixed grid backdrop (Storybook only) to verify transparency and refraction.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Lens: Story = {
  render: () => (
    <GlassStoryScene>
      <Glass
        lens={{
          width: 200,
          height: 72,
          borderRadius: 36,
          depth: 12,
          curvature: 45,
          scale: 1,
          chroma: 0.15,
          edgeHighlight: 0.3,
          glow: 0.12,
        }}
      >
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            fontWeight: 700,
            fontSize: '1rem',
            color: '#1c1c1e',
            letterSpacing: '-0.02em',
          }}
        >
          Refracted content
        </span>
      </Glass>
    </GlassStoryScene>
  ),
};

export const SwitchStory: Story = {
  name: 'Switch',
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <GlassStoryScene>
        <GlassSwitch checked={on} onCheckedChange={setOn} aria-label="Notifications" />
      </GlassStoryScene>
    );
  },
};

export const SliderStory: Story = {
  name: 'Slider',
  render: () => {
    const [value, setValue] = useState(42);
    return (
      <GlassStoryScene>
        <div style={{ width: 260, position: 'relative' }}>
          <GlassSlider value={value} onValueChange={setValue} aria-label="Volume" />
        </div>
      </GlassStoryScene>
    );
  },
};

export const ToggleGroupStory: Story = {
  name: 'Toggle Group',
  render: () => {
    const [value, setValue] = useState('reserves');
    return (
      <GlassStoryScene>
        <GlassToggleGroup
          value={value}
          onValueChange={setValue}
          options={[
            { value: 'hubs', label: 'Hubs' },
            { value: 'spokes', label: 'Spokes' },
            { value: 'reserves', label: 'Reserves' },
            { value: 'assets', label: 'Assets' },
          ]}
        />
      </GlassStoryScene>
    );
  },
};

export const Button: Story = {
  render: () => (
    <GlassStoryScene>
      <GlassButton>Continue</GlassButton>
    </GlassStoryScene>
  ),
};

export const Card: Story = {
  render: () => (
    <GlassStoryScene>
      <GlassCard>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Glass Card</h3>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', opacity: 0.65 }}>
          Live content refraction through a displacement-mapped lens.
        </p>
      </GlassCard>
    </GlassStoryScene>
  ),
};

export const PopoverStory: Story = {
  name: 'Popover',
  render: () => (
    <GlassStoryScene>
      <GlassPopover
        trigger={<GlassButton>Open popover</GlassButton>}
        width={260}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
          Popover content refracts the grid behind it through a displacement-mapped lens.
        </p>
      </GlassPopover>
    </GlassStoryScene>
  ),
};

export const PopoverPortalStory: Story = {
  name: 'Popover (portal / overflow)',
  parameters: { layout: 'centered' },
  render: () => (
    <div
      style={{
        height: 180,
        overflow: 'hidden',
        borderRadius: '1rem',
        border: '2px dashed rgb(99 102 241 / 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '1rem',
        background: 'linear-gradient(135deg, #ddd6fe, #fce7f3)',
      }}
    >
      <GlassPopover trigger={<GlassButton>Opens above clip</GlassButton>} width={240}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Portaled to <code>document.body</code> — not clipped by overflow:hidden.
        </p>
      </GlassPopover>
    </div>
  ),
};

export const TooltipStory: Story = {
  name: 'Tooltip',
  render: () => (
    <GlassStoryScene>
      <GlassTooltip content="Liquid glass tooltip">
        <GlassButton>Hover me</GlassButton>
      </GlassTooltip>
    </GlassStoryScene>
  ),
};

export const DebugStory: Story = {
  name: 'Debug',
  render: () => (
    <GlassStoryScene>
      <Glass
        debug
        lens={{
          width: 200,
          height: 72,
          borderRadius: 36,
          depth: 12,
          curvature: 45,
        }}
      >
        <span style={{ position: 'relative', zIndex: 1, fontWeight: 600 }}>
          Debug panel enabled
        </span>
      </Glass>
    </GlassStoryScene>
  ),
};

export const AllComponents: Story = {
  name: 'All Components',
  render: () => {
    const [switchOn, setSwitchOn] = useState(true);
    const [sliderValue, setSliderValue] = useState(60);
    const [toggleValue, setToggleValue] = useState('spokes');
    return (
      <GlassStoryScene draggable={false}>
        <DraggableGlassProbe defaultOffset={{ x: -140, y: -80 }}>
          <GlassToggleGroup
            value={toggleValue}
            onValueChange={setToggleValue}
            options={[
              { value: 'hubs', label: 'Hubs' },
              { value: 'spokes', label: 'Spokes' },
              { value: 'reserves', label: 'Reserves' },
            ]}
          />
        </DraggableGlassProbe>
        <DraggableGlassProbe defaultOffset={{ x: 120, y: -40 }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <GlassSwitch checked={switchOn} onCheckedChange={setSwitchOn} aria-label="Enable" />
            <div style={{ width: 200 }}>
              <GlassSlider value={sliderValue} onValueChange={setSliderValue} aria-label="Level" />
            </div>
          </div>
        </DraggableGlassProbe>
        <DraggableGlassProbe defaultOffset={{ x: 0, y: 100 }}>
          <GlassButton>Continue</GlassButton>
        </DraggableGlassProbe>
      </GlassStoryScene>
    );
  },
};
