import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  ImageButton,
  ImageOverlay,
  ImageView,
  ImageWell,
  Typography,
} from '@larose-ui/react';

const sampleImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0071e3"/><stop offset="1" stop-color="#af52de"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="90" r="48" fill="rgb(255 255 255 / 0.35)"/></svg>`,
  );

const meta: Meta = {
  title: 'Foundation/Image Views',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const FitModes: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'imageView' } },
  args: {
    fit: "contain",
    alt: "Sample contain",
  },

  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {(['contain', 'cover', 'fill'] as const).map((fit) => (
        <Card key={fit} title={fit} padding="sm">
          <div style={{ height: '8rem' }}>
            <ImageView src={sampleImage} alt={`Sample ${fit}`} fit={fit} />
          </div>
        </Card>
      ))}
    </div>
  ),
};

export const TextOverlay: Story = {
  render: () => (
    <ImageOverlay
      src={sampleImage}
      alt="Product hero"
      overlay={<Typography role="title" as="span">Golden hour in Cairo</Typography>}
    />
  ),
};

export const AnimatedSequence: Story = {
  render: () => (
    <Card title="Consistent frame dimensions" padding="md">
      <div style={{ height: '10rem' }}>
        <ImageView
          alt="Loading animation"
          fit="contain"
          sequence={{
            frames: [sampleImage, sampleImage],
            intervalMs: 900,
          }}
        />
      </div>
    </Card>
  ),
};

export const ImageWellStory: Story = {
  name: 'Image Well',
  render: () => (
    <Card title="Editable image well" padding="md">
      <ImageWell label="Avatar" placeholder="Drop, paste, or click — press Delete to clear" />
    </Card>
  ),
};

export const ImageButtonStory: Story = {
  name: 'Image Button',
  render: () => (
    <ImageButton
      src={sampleImage}
      alt="Open gallery"
      style={{ width: '8rem' }}
      onClick={() => undefined}
    />
  ),
};
