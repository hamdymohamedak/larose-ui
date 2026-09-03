import type { Meta, StoryObj } from '@storybook/react';
import { LiquidGlass } from '@larose-ui/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassSurfaceArgTypes,
  liquidGlassSurfaceDefaults,
  prepareSurfaceProps,
} from './glass/liquidGlassStoryControls';
import { centerScene } from './glass/liquidGlassStoryItems';

type SurfaceArgs = typeof liquidGlassSurfaceDefaults;

const meta: Meta<SurfaceArgs> = {
  title: 'Glass/LiquidGlass/Surface',
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Base liquid glass surface — use this to build custom components. Every geometry and optics prop is controllable.',
      },
    },
  },
  argTypes: liquidGlassSurfaceArgTypes,
  args: liquidGlassSurfaceDefaults,
};

export default meta;
type Story = StoryObj<SurfaceArgs>;

export const Playground: Story = {
  render: ({ label, ...args }) => {
    const glassProps = prepareSurfaceProps(args);
    return (
      <GlassScrollTestScene contentPaddingBottom={80}>
        {centerScene(
          <LiquidGlass
            {...glassProps}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ color: '#fff', fontWeight: 600 }}>{label}</span>
          </LiquidGlass>,
        )}
      </GlassScrollTestScene>
    );
  },
};

export const Pill: Story = {
  args: {
    width: 200,
    height: 56,
    borderRadius: 999,
    displacementScale: 26,
    bezelWidth: 14,
    label: 'Pill surface',
  },
  render: ({ label, ...args }) => {
    const glassProps = prepareSurfaceProps(args);
    return (
      <GlassScrollTestScene contentPaddingBottom={80}>
        {centerScene(
          <LiquidGlass
            {...glassProps}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ color: '#fff', fontWeight: 600 }}>{label}</span>
          </LiquidGlass>,
        )}
      </GlassScrollTestScene>
    );
  },
};

export const Card: Story = {
  args: {
    width: 320,
    height: 180,
    borderRadius: 22,
    label: 'Glass card',
    shadowIntensity: 1.1,
  },
  render: ({ label, ...args }) => {
    const glassProps = prepareSurfaceProps(args);
    return (
      <GlassScrollTestScene contentPaddingBottom={80}>
        {centerScene(
          <LiquidGlass
            {...glassProps}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: 20,
            }}
          >
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{label}</span>
          </LiquidGlass>,
        )}
      </GlassScrollTestScene>
    );
  },
};
