import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react';
import type { OrnamentConfig, OrnamentContentAlignment, OrnamentEdge, OrnamentVisibility } from './types';
import { alignmentToFlex, resolveOrnamentVisibility, warnIfTooManyOrnaments } from './utils';
import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';

export interface OrnamentWindowProps {
  children: ReactNode;
  /** Single ornament content (shortcut for one bottom ornament). */
  ornament?: ReactNode;
  edge?: OrnamentEdge;
  alignment?: OrnamentContentAlignment;
  visibility?: OrnamentVisibility;
  /** When true, automatic visibility hides ornaments (e.g. full-screen media). */
  immersive?: boolean;
  ornaments?: OrnamentConfig[];
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export interface OrnamentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface OrnamentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/**
 * visionOS ornament — floating glass controls parallel to a window edge.
 * @see https://developer.apple.com/design/human-interface-guidelines/ornaments
 */
export function OrnamentWindow({
  children,
  ornament,
  edge = 'bottom',
  alignment = 'center',
  visibility = 'visible',
  immersive = false,
  ornaments,
  className,
  style,
  'aria-label': ariaLabel = 'Window',
}: OrnamentWindowProps) {
  const resolvedOrnaments = useMemo(() => {
    if (ornaments?.length) return ornaments;
    if (ornament) return [{ id: 'primary', content: ornament, edge, alignment }];
    return [];
  }, [alignment, edge, ornament, ornaments]);

  useEffect(() => {
    warnIfTooManyOrnaments(resolvedOrnaments);
  }, [resolvedOrnaments]);

  const showOrnaments = resolveOrnamentVisibility(visibility, immersive);
  const edges: OrnamentEdge[] = ['top', 'bottom', 'leading', 'trailing'];

  return (
    <section
      className={[styles.window, className].filter(Boolean).join(' ')}
      style={style}
      aria-label={ariaLabel}
      data-immersive={immersive ? 'true' : undefined}
    >
      <div className={styles.content} data-immersive={immersive ? 'true' : undefined}>
        {children}
      </div>
      {showOrnaments &&
        edges.map((ornamentEdge) => {
          const items = resolvedOrnaments.filter(
            (item) => (item.edge ?? 'bottom') === ornamentEdge,
          );
          if (items.length === 0) return null;

          return items.map((item) => (
            <div
              key={item.id}
              className={styles.ornamentLayer}
              data-edge={ornamentEdge}
              data-alignment={item.alignment ?? alignment}
              style={{ justifyContent: alignmentToFlex(item.alignment ?? alignment) }}
            >
              <div className={styles.ornament} role="toolbar" aria-label="Ornament">
                <div className={styles.ornamentInner}>{item.content}</div>
              </div>
            </div>
          ));
        })}
    </section>
  );
}

/** Glass ornament container for custom controls. */
export function Ornament({ children, className, style }: OrnamentProps) {
  return (
    <div
      className={[styles.ornament, className].filter(Boolean).join(' ')}
      style={style}
      role="toolbar"
    >
      <div className={styles.ornamentInner}>{children}</div>
    </div>
  );
}

/** Borderless button styled for ornament glass backgrounds. */
export function OrnamentButton({ active, className, children, ...rest }: OrnamentButtonProps) {
  return (
    <button
      type="button"
      className={[styles.borderlessButton, className].filter(Boolean).join(' ')}
      data-active={active ? 'true' : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

export type {
  OrnamentConfig,
  OrnamentEdge,
  OrnamentVisibility,
  OrnamentContentAlignment,
} from './types';
export {
  resolveOrnamentVisibility,
  clampOrnamentWidth,
  warnIfTooManyOrnaments,
  MAX_ORNAMENTS,
} from './utils';
