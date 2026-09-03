/**
 * Storybook-only: a scrollable aurora scene that gives glass components a
 * rich, colorful backdrop to refract.  Not part of @larose-ui/react.
 */
import { useEffect, type CSSProperties, type ReactNode } from 'react';

// ─── Aurora keyframes (injected once via a <style> tag) ───────────────────────

const KEYFRAME_ID = 'glass-scroll-scene-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes glass-aurora-drift {
      0%   { background-position: 0% 0%, 0% 0%, 0% 0%; }
      100% { background-position: 6% -4%, -5% 5%, 3% -3%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .glass-aurora-layer { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Scene backdrop ───────────────────────────────────────────────────────────

function AuroraBackdrop() {
  useEffect(ensureKeyframes, []);

  return (
    <div
      aria-hidden
      className="glass-aurora-layer"
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(60% 45% at 15% 10%, #8B6BFF 0%, transparent 65%),
          radial-gradient(55% 40% at 85% 15%, #3FE0D0 0%, transparent 60%),
          radial-gradient(65% 55% at 50% 100%, #FF5FA2 0%, transparent 65%),
          #100B22
        `,
        filter: 'saturate(1.15)',
        animation: 'glass-aurora-drift 26s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }}
    />
  );
}

// ─── Scrollable content cards ─────────────────────────────────────────────────

const CARD_DATA = [
  {
    title: 'Convex squircle bezel',
    body: 'Soft flat-to-curve transition — no harsh interior edge. The squircle Apple favors.',
    accent: 'rgba(139,107,255,0.35)',
    accentEnd: 'rgba(139,107,255,0.05)',
    tall: true,
  },
  {
    title: '127 samples per radius',
    body: 'Displacement vectors are pre-computed and rotated around the bar.',
    accent: 'rgba(63,224,208,0.30)',
    accentEnd: 'rgba(63,224,208,0.04)',
    tall: false,
  },
  {
    title: 'R/G channel encoding',
    body: 'X and Y displacement stored in Red and Green channels, neutral at 128.',
    accent: 'rgba(255,95,162,0.32)',
    accentEnd: 'rgba(255,95,162,0.04)',
    tall: false,
  },
  {
    title: 'Scroll behind the bar',
    body: 'Watch the aurora bend through the glass bezel as you scroll this content.',
    accent: 'rgba(255,255,255,0.06)',
    accentEnd: 'rgba(255,255,255,0.02)',
    tall: false,
  },
  {
    title: 'Snell – Descartes law',
    body: 'n₁ sin θ₁ = n₂ sin θ₂ — the refraction angle depends on the surface normal.',
    accent: 'rgba(139,107,255,0.22)',
    accentEnd: 'rgba(63,224,208,0.06)',
    tall: false,
  },
  {
    title: 'Chromium-only refraction',
    body: 'SVG filters as backdrop-filter only work in Chromium. All other engines fall back to frosted blur.',
    accent: 'rgba(255,95,162,0.20)',
    accentEnd: 'rgba(255,95,162,0.03)',
    tall: false,
  },
] as const;

function ContentCards() {
  const cardBase: CSSProperties = {
    borderRadius: 22,
    padding: '20px 20px 18px',
    border: '1px solid rgba(255,255,255,0.10)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {CARD_DATA.map((card, i) => (
        <div
          key={i}
          style={{
            ...cardBase,
            minHeight: card.tall ? 200 : 96,
            background: `linear-gradient(155deg, ${card.accent}, ${card.accentEnd})`,
          }}
        >
          <h3
            style={{
              margin: '0 0 4px',
              fontSize: 16,
              fontWeight: 600,
              color: '#F3F1FA',
              letterSpacing: '-0.01em',
            }}
          >
            {card.title}
          </h3>
          <span style={{ fontSize: 13, color: '#B9B3D6', lineHeight: 1.5 }}>
            {card.body}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export interface GlassScrollTestSceneProps {
  children?: ReactNode;
  /** Override the default bottom spacing so content is not hidden by the bar. */
  contentPaddingBottom?: number;
}

/**
 * Full-viewport, scrollable dark-aurora scene.
 *
 * Designed to give glass components a rich backdrop to refract.
 * Children are rendered inside the scrollable content area.
 */
export function GlassScrollTestScene({
  children,
  contentPaddingBottom = 140,
}: GlassScrollTestSceneProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#100B22',
        color: '#F3F1FA',
        fontFamily:
          '-apple-system, "SF Pro Text", ui-rounded, "Segoe UI", system-ui, sans-serif',
      }}
    >
      <AuroraBackdrop />

      {/* Scrollable content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            padding: `56px 22px ${contentPaddingBottom}px`,
          }}
        >
          <header style={{ marginBottom: 34 }}>
            <h1
              style={{
                fontSize: 30,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                margin: '0 0 10px',
                fontWeight: 650,
              }}
            >
              Liquid Glass
            </h1>
            <p
              style={{
                margin: 0,
                color: '#B9B3D6',
                fontSize: 15,
                lineHeight: 1.55,
                maxWidth: '34ch',
              }}
            >
              A convex-squircle bezel, a precomputed displacement field, and an
              SVG filter doing the actual refraction of everything behind it.
            </p>
          </header>

          <ContentCards />

          {children && (
            <div style={{ marginTop: 24 }}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
