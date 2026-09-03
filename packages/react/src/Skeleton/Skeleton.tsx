import type { CSSProperties } from 'react';
import { mergeStyles } from '../shared/styleProps';
import styles from '@larose-ui/styles/components/Skeleton/Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  lines?: number;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'text',
  lines = 1,
  className,
  style,
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={[styles.group, className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={styles.skeleton}
            data-variant="text"
            style={{
              width: i === lines - 1 ? '70%' : width,
              height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      data-variant={variant}
      style={mergeStyles(
        { width, height: variant === 'circular' ? width : height },
        style,
      )}
      aria-hidden="true"
    />
  );
}
