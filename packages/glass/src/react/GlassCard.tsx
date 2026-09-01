import type { CSSProperties, ReactNode } from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { Glass } from './Glass';
import { LENS_PRESETS } from '../lens/presets';
import type { GlassLens } from '../types';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  lens?: Partial<GlassLens>;
  refract?: ReactNode;
}

const defaultLens = LENS_PRESETS.card(320, 180, 20);

export function GlassCard({ children, className, style, lens, refract }: GlassCardProps) {
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const resolvedLens = { ...defaultLens, ...lens };

  if (reducedMotion) {
    return (
      <div
        className={className}
        style={{
          padding: '1.25rem',
          borderRadius: resolvedLens.borderRadius,
          background: 'rgb(255 255 255 / 0.28)',
          border: '1px solid rgb(255 255 255 / 0.45)',
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Glass lens={resolvedLens} refract={refract} className={className} style={style}>
      <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </Glass>
  );
}
