import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { buildLiquidGlassDisplacementMap } from '@larose-ui/react';
import { LiquidGlass } from '@larose-ui/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassSurfaceArgTypes,
  liquidGlassSurfaceDefaults,
  prepareSurfaceProps,
} from './glass/liquidGlassStoryControls';

type LensLabArgs = typeof liquidGlassSurfaceDefaults;

const meta: Meta<LensLabArgs> = {
  title: 'Glass/Lens Lab',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Interactive lab for the shared liquid glass optics — tune geometry and every optical prop, with a live displacement map preview.',
      },
    },
  },
  argTypes: liquidGlassSurfaceArgTypes,
  args: liquidGlassSurfaceDefaults,
};

export default meta;
type Story = StoryObj<LensLabArgs>;

function LensLab(args: LensLabArgs) {
  const { label, ...raw } = args;
  const glassProps = prepareSurfaceProps(raw);
  const { width, height, borderRadius, bezelWidth, refractionStrength, ...optics } = glassProps;

  const [mapUrl, setMapUrl] = useState('');

  const previewMap = useMemo(() => {
    if (mapUrl) return mapUrl;
    return buildLiquidGlassDisplacementMap({
      width: width as number,
      height: height as number,
      borderRadius: borderRadius as number,
      bezelWidth: (bezelWidth as number) ?? 20,
      refractionStrength: (refractionStrength as number) ?? 1,
    });
  }, [mapUrl, width, height, borderRadius, bezelWidth, refractionStrength]);

  return (
    <GlassScrollTestScene contentPaddingBottom={80}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 24px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            justifyContent: 'center',
            pointerEvents: 'auto',
            maxWidth: 720,
          }}
        >
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#B9B3D6' }}>
              Live refraction
            </p>
            <LiquidGlass
              {...optics}
              width={width}
              height={height}
              borderRadius={borderRadius}
              bezelWidth={bezelWidth}
              refractionStrength={refractionStrength}
              onDisplacementMapChange={setMapUrl}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#fff' }}>{label}</span>
            </LiquidGlass>
          </div>

        </div>
      </div>
    </GlassScrollTestScene>
  );
}

export const Playground: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'liquidGlass' } },
  render: (args) => <LensLab {...args} />,
};
