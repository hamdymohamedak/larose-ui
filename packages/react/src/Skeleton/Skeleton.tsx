import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  lines?: number;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'text',
  lines = 1,
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={styles.group} aria-hidden="true">
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
      className={styles.skeleton}
      data-variant={variant}
      style={{ width, height: variant === 'circular' ? width : height }}
      aria-hidden="true"
    />
  );
}
