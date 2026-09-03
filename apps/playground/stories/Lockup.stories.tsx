import type { Meta, StoryObj } from '@storybook/react';
import { Children, cloneElement, isValidElement, useState, type ReactElement } from 'react';
import {
  CaptionButton,
  LockupCard,
  LockupRow,
  Monogram,
  Poster,
  Typography,
  type LockupProps,
} from '@larose-ui/react';

const cast = [
  { name: 'Sara Ali', role: 'Director' },
  { name: 'Omar Hassan', role: 'Lead' },
  { name: 'Lina Koch', role: 'Producer' },
  { name: 'Alex Kim', role: 'Editor' },
];

const posters = [
  {
    title: 'Northern Lights',
    subtitle: 'Documentary · 2024',
    imageUrl: 'https://picsum.photos/seed/northern/400/600',
  },
  {
    title: 'City Lines',
    subtitle: 'Drama · 2023',
    imageUrl: 'https://picsum.photos/seed/citylines/400/600',
  },
  {
    title: 'Open Water',
    subtitle: 'Adventure · 2025',
    imageUrl: 'https://picsum.photos/seed/openwater/400/600',
  },
  {
    title: 'Quiet Room',
    subtitle: 'Thriller · 2022',
    imageUrl: 'https://picsum.photos/seed/quietroom/400/600',
  },
];

const meta: Meta = {
  title: 'Foundation/Lockups',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

function FocusableRow({
  children,
  itemWidth,
  axis = 'horizontal',
  defaultFocusedIndex = 1,
}: {
  children: ReactElement<LockupProps> | ReactElement<LockupProps>[];
  itemWidth?: string;
  axis?: 'horizontal' | 'vertical' | 'grid';
  defaultFocusedIndex?: number;
}) {
  const [focusedIndex, setFocusedIndex] = useState(defaultFocusedIndex);

  return (
    <LockupRow itemWidth={itemWidth} axis={axis}>
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<LockupProps>, {
              focused: index === focusedIndex,
              onFocus: () => setFocusedIndex(index),
            })
          : child,
      )}
    </LockupRow>
  );
}

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <section>
        <div style={{ marginBottom: '0.75rem' }}>
          <Typography role="headline">Cards</Typography>
        </div>
        <div style={{ marginBottom: '1rem', maxWidth: '36rem' }}>
          <Typography role="body" muted>
            Cards combine header, footer, and content to present ratings and reviews for media items.
          </Typography>
        </div>
        <FocusableRow itemWidth="14rem">
          <LockupCard
            title="Critics"
            rating={4.5}
            review="A thoughtful exploration of place and memory with standout performances."
          />
          <LockupCard
            title="Audience"
            rating={4.2}
            review="Beautiful cinematography and a score that stays with you."
          />
          <LockupCard
            title="Editors"
            rating={4.8}
            review="Pacing is confident; every scene earns its place in the narrative."
          />
        </FocusableRow>
      </section>

      <section>
        <div style={{ marginBottom: '0.75rem' }}>
          <Typography role="headline">Caption buttons</Typography>
        </div>
        <div style={{ marginBottom: '1rem', maxWidth: '36rem' }}>
          <Typography role="body" muted>
            Caption buttons tilt with focus direction — horizontally in a row, vertically in a column.
          </Typography>
        </div>
        <FocusableRow itemWidth="8rem">
          <CaptionButton title="Watch Now" subtitle="Resume S1 E3" />
          <CaptionButton title="Trailers" subtitle="3 available" />
          <CaptionButton title="Extras" subtitle="Behind the scenes" />
          <CaptionButton title="Add" subtitle="To Up Next" />
        </FocusableRow>
      </section>

      <section>
        <div style={{ marginBottom: '0.75rem' }}>
          <Typography role="headline">Monograms</Typography>
        </div>
        <div style={{ marginBottom: '1rem', maxWidth: '36rem' }}>
          <Typography role="body" muted>
            Circular cast portraits with name and role; initials appear when no image is available.
          </Typography>
        </div>
        <FocusableRow itemWidth="6.5rem">
          {cast.map((person) => (
            <Monogram key={person.name} name={person.name} role={person.role} />
          ))}
        </FocusableRow>
      </section>

      <section>
        <div style={{ marginBottom: '0.75rem' }}>
          <Typography role="headline">Posters</Typography>
        </div>
        <div style={{ marginBottom: '1rem', maxWidth: '36rem' }}>
          <Typography role="body" muted>
            Poster titles and subtitles appear when the lockup receives focus.
          </Typography>
        </div>
        <FocusableRow itemWidth="9rem">
          {posters.map((item) => (
            <Poster
              key={item.title}
              imageUrl={item.imageUrl}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </FocusableRow>
      </section>
    </div>
  ),
};

export const CaptionButtonGrid: Story = {
  name: 'Caption Button Grid',
  render: function CaptionGridDemo() {
    const [focusedIndex, setFocusedIndex] = useState(2);
    const labels = ['Movies', 'Shows', 'Sports', 'Kids', 'Library', 'Search'];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 8rem)',
          gap: 'var(--lr-lockup-gap)',
          justifyContent: 'center',
          padding: '2rem 0',
        }}
      >
        {labels.map((label, index) => (
          <CaptionButton
            key={label}
            title={label}
            subtitle="Browse"
            axis="grid"
            focused={index === focusedIndex}
            onFocus={() => setFocusedIndex(index)}
          />
        ))}
      </div>
    );
  },
};

export const VerticalMonograms: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'monogram' } },
  args: {
    name: "Sara Ali",
  },

  name: 'Vertical Monograms',
  render: function VerticalMonogramsDemo() {
    const [focusedIndex, setFocusedIndex] = useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lr-lockup-gap)', width: '8rem' }}>
        {cast.slice(0, 3).map((person, index) => (
          <Monogram
            key={person.name}
            name={person.name}
            role={person.role}
            axis="vertical"
            focused={index === focusedIndex}
            onFocus={() => setFocusedIndex(index)}
          />
        ))}
      </div>
    );
  },
};
