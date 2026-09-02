import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { Glass } from './Glass';
import { LENS_PRESETS } from '../lens/presets';
import type { GlassLens } from '../types';

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  lens?: Partial<GlassLens>;
  refract?: ReactNode;
}

const defaultLens = LENS_PRESETS.button(140, 48, 24);

export function GlassButton({
  children,
  lens,
  refract,
  className,
  style,
  disabled,
  onClick,
  ...props
}: GlassButtonProps) {
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const resolvedLens = { ...defaultLens, ...lens };

  const buttonInner = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        color: 'var(--lr-color-label, #1c1c1e)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        font: 'inherit',
        fontSize: '0.9375rem',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        padding: '0 1.25rem',
      }}
      {...props}
    >
      {children}
    </button>
  );

  if (reducedMotion || disabled) {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          width: resolvedLens.width,
          height: resolvedLens.height,
          borderRadius: resolvedLens.borderRadius,
          background: 'rgb(255 255 255 / 0.28)',
          border: '1px solid rgb(255 255 255 / 0.45)',
          overflow: 'hidden',
          ...(style as CSSProperties),
        }}
      >
        {buttonInner}
      </div>
    );
  }

  return (
    <Glass lens={resolvedLens} refract={refract} className={className} style={style as CSSProperties}>
      {buttonInner}
    </Glass>
  );
}
