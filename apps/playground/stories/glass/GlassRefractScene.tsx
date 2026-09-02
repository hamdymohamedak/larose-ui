/**
 * Storybook-only refract layer — fixed attachment keeps the grid aligned with the scene
 * when the glass probe is dragged (WebKit content-mode path).
 */
import type { CSSProperties } from 'react';

const SCENE_BACKGROUND =
  'radial-gradient(circle at 18% 28%, rgb(252 231 243 / 0.95), transparent 38%), radial-gradient(circle at 78% 22%, rgb(224 231 255 / 0.9), transparent 36%), radial-gradient(circle at 52% 78%, rgb(254 243 199 / 0.85), transparent 34%), linear-gradient(145deg, #ddd6fe 0%, #bfdbfe 45%, #fce7f3 100%)';

const LAYER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: SCENE_BACKGROUND,
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
};

export function GlassRefractScene() {
  return (
    <div aria-hidden style={LAYER_STYLE}>
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="glass-refract-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgb(80 50 160)"
              strokeWidth="0.85"
              strokeDasharray="3 4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#glass-refract-grid)" />
      </svg>
    </div>
  );
}
