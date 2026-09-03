import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  OrnamentButton,
  OrnamentWindow,
  Typography,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Ornaments',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const NowPlaying: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'ornament' } },
  args: { label: 'Now Playing' },
  name: 'Now Playing (bottom)',
  render: function NowPlayingDemo() {
    const [playing, setPlaying] = useState(true);

    return (
      <div style={{ maxWidth: '28rem' }}>
        <OrnamentWindow
          aria-label="Music window"
          ornament={
            <>
              <OrnamentButton aria-label="Previous">⏮</OrnamentButton>
              <OrnamentButton
                active={playing}
                aria-label={playing ? 'Pause' : 'Play'}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? '⏸' : '▶︎'}
              </OrnamentButton>
              <OrnamentButton aria-label="Next">⏭</OrnamentButton>
              <Typography role="footnote" muted>
                Lateral — Tycho
              </Typography>
            </>
          }
        >
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Typography role="title">Album Art</Typography>
            <Typography role="body" muted>
              Window content scrolls independently; the ornament stays fixed to the bottom edge.
            </Typography>
          </div>
        </OrnamentWindow>
      </div>
    );
  },
};

export const ImmersiveHidden: Story = {
  name: 'Hidden during immersive content',
  render: function ImmersiveDemo() {
    return (
      <div style={{ maxWidth: '28rem' }}>
        <OrnamentWindow
          visibility="automatic"
          immersive
          ornament={<OrnamentButton>Playback</OrnamentButton>}
        >
          <div
            style={{
              height: '14rem',
              display: 'grid',
              placeItems: 'center',
              background: '#111',
              color: 'white',
            }}
          >
            Full-screen video
          </div>
        </OrnamentWindow>
      </div>
    );
  },
};

export const TopToolbar: Story = {
  name: 'Top toolbar ornament',
  render: function TopToolbarDemo() {
    return (
      <div style={{ maxWidth: '28rem' }}>
        <OrnamentWindow
          edge="top"
          ornaments={[
            {
              id: 'tools',
              edge: 'top',
              content: (
                <>
                  <OrnamentButton active>Select</OrnamentButton>
                  <OrnamentButton>Pencil</OrnamentButton>
                  <OrnamentButton>Text</OrnamentButton>
                </>
              ),
            },
          ]}
        >
          <div style={{ padding: '3rem 1.5rem 1.5rem', minHeight: '10rem' }}>
            Design canvas
          </div>
        </OrnamentWindow>
      </div>
    );
  },
};
