import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { Glass, getCachedDisplacementMap } from '@larose-ui/glass';
import type { LiquidGlassProps } from '@larose-ui/glass';
import { GlassStoryScene } from './glass/GlassStoryScene';

const defaultLens: Required<
  Pick<
    LiquidGlassProps,
    | 'width'
    | 'height'
    | 'borderRadius'
    | 'scale'
    | 'depth'
    | 'curvature'
    | 'splay'
    | 'chroma'
    | 'blur'
    | 'glow'
    | 'edgeHighlight'
    | 'specularAngle'
  >
> = {
  width: 200,
  height: 72,
  borderRadius: 36,
  scale: 1,
  depth: 10,
  curvature: 40,
  splay: 1,
  chroma: 0.08,
  blur: 0,
  glow: 0.1,
  edgeHighlight: 0.55,
  specularAngle: 45,
};

const meta: Meta<typeof LensLab> = {
  title: 'Glass/Lens Lab',
  component: LensLab,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    width: { control: { type: 'range', min: 40, max: 400, step: 1 } },
    height: { control: { type: 'range', min: 24, max: 200, step: 1 } },
    borderRadius: { control: { type: 'range', min: 0, max: 120, step: 1 } },
    scale: { control: { type: 'range', min: 0.05, max: 2, step: 0.01 } },
    depth: { control: { type: 'range', min: 1, max: 24, step: 1 } },
    curvature: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    splay: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
    chroma: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    blur: { control: { type: 'range', min: 0, max: 8, step: 0.1 } },
    glow: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    edgeHighlight: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    specularAngle: { control: { type: 'range', min: 0, max: 360, step: 1 } },
  },
  args: defaultLens,
};

export default meta;
type Story = StoryObj<typeof defaultLens>;

function LensLab(props: typeof defaultLens) {
  const lens = useMemo(() => ({ ...props }), [props]);
  const map = useMemo(() => getCachedDisplacementMap(lens), [lens]);

  return (
    <GlassStoryScene showHint={false}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4338ca' }}>
            Refracted result
          </p>
          <Glass lens={lens}>
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 600, fontSize: '0.875rem' }}>
              Liquid glass
            </span>
          </Glass>
        </div>
        <div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4338ca' }}>
            Displacement map
          </p>
          <div
            style={{
              width: lens.width,
              height: lens.height,
              borderRadius: lens.borderRadius,
              overflow: 'hidden',
              border: '1px solid rgb(0 0 0 / 0.15)',
              background: '#2a2a2e',
            }}
          >
            <img
              src={map.dataUrl}
              alt="Displacement map preview"
              width={lens.width}
              height={lens.height}
              style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </GlassStoryScene>
  );
}

export const Playground: Story = {
  render: (args) => <LensLab {...args} />,
};
