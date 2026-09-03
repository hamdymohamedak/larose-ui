import { useEffect, type CSSProperties, type ReactNode } from 'react';

const KEYFRAME_ID = 'docs-glass-scene-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes docs-glass-aurora-drift {
      0%   { background-position: 0% 0%, 0% 0%, 0% 0%; }
      100% { background-position: 6% -4%, -5% 5%, 3% -3%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .docs-glass-scene__aurora { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

const SCROLL_CARDS = [
  { title: 'Photos & gradients', body: 'Glass picks up color from whatever is behind the bezel.', accent: 'rgba(139,107,255,0.38)' },
  { title: 'Scroll to see refraction', body: 'Move this content — the bar bends the aurora as it passes under the glass.', accent: 'rgba(63,224,208,0.32)' },
  { title: 'Displacement map', body: 'Precomputed squircle bezel drives SVG feDisplacementMap on Chromium.', accent: 'rgba(255,95,162,0.30)' },
] as const;

function ScrollCards() {
  const cardBase: CSSProperties = {
    borderRadius: 18,
    padding: '16px 18px',
    border: '1px solid rgba(255,255,255,0.12)',
    minHeight: 88,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  };

  return (
    <div className="docs-glass-scene__cards">
      {SCROLL_CARDS.map((card) => (
        <div
          key={card.title}
          style={{
            ...cardBase,
            background: `linear-gradient(155deg, ${card.accent}, rgba(255,255,255,0.02))`,
          }}
        >
          <strong style={{ color: '#F3F1FA', fontSize: 14, marginBottom: 4 }}>{card.title}</strong>
          <span style={{ color: '#B9B3D6', fontSize: 13, lineHeight: 1.45 }}>{card.body}</span>
        </div>
      ))}
    </div>
  );
}

export type LiquidGlassPreviewLayout = 'center' | 'bottom-bar' | 'top-bar';

export interface LiquidGlassPreviewSceneProps {
  children: ReactNode;
  layout?: LiquidGlassPreviewLayout;
  /** Show scrollable cards behind the component (helps demonstrate refraction). */
  showScrollContent?: boolean;
  hint?: string;
}

/**
 * Immersive dark-aurora scene for docs — sized for the Storybook-style canvas,
 * not full viewport. Scroll inside the scene to see glass bend the backdrop.
 */
export function LiquidGlassPreviewScene({
  children,
  layout = 'center',
  showScrollContent = true,
  hint = 'Scroll inside the preview — content behind the glass should refract (best in Chromium).',
}: LiquidGlassPreviewSceneProps) {
  useEffect(ensureKeyframes, []);

  return (
    <div className="docs-glass-scene" data-layout={layout}>
      <div className="docs-glass-scene__aurora" aria-hidden />

      <div className="docs-glass-scene__grid" aria-hidden />

      <div className="docs-glass-scene__scroll">
        <div className="docs-glass-scene__inner">
          {showScrollContent ? (
            <>
              <p className="docs-glass-scene__intro">
                Liquid glass refracts the scene behind the bezel — not just blur. Compare the
                colored bands as they pass under the component.
              </p>
              <ScrollCards />
              <div className="docs-glass-scene__spacer" aria-hidden />
            </>
          ) : null}
        </div>
      </div>

      <div className="docs-glass-scene__stage">{children}</div>

      {hint ? <p className="docs-glass-scene__hint">{hint}</p> : null}
    </div>
  );
}
