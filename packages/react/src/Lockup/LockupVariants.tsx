import { Children, type CSSProperties, type ReactNode } from 'react';
import { Lockup, type LockupProps } from './Lockup';
import type { LockupAxis } from './types';
import { formatRating, getInitials } from './utils';
import styles from './Lockup.module.css';

export interface LockupCardProps extends Omit<LockupProps, 'children'> {
  rating: number;
  review: string;
  title?: string;
}

/** Card lockup for ratings and reviews. */
export function LockupCard({ rating, review, title, header, ...props }: LockupCardProps) {
  return (
    <Lockup
      header={header ?? (title ? <span className={styles.headerTitle}>{title}</span> : undefined)}
      {...props}
    >
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <span className={styles.rating}>{formatRating(rating)}</span>
          <p className={styles.review}>{review}</p>
        </div>
      </div>
    </Lockup>
  );
}

export interface CaptionButtonProps extends Omit<LockupProps, 'children'> {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  label?: string;
}

/** Caption button with optional image or text surface. */
export function CaptionButton({ title, subtitle, imageUrl, label, footer, ...props }: CaptionButtonProps) {
  return (
    <Lockup
      footer={
        footer ?? (
          <>
            <div className={styles.headerTitle}>{title}</div>
            {subtitle && <div>{subtitle}</div>}
          </>
        )
      }
      aria-label={label ?? title}
      {...props}
    >
      <div className={styles.captionSurface}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.captionImage} />
        ) : (
          <span className={styles.captionText}>{title.slice(0, 1)}</span>
        )}
      </div>
    </Lockup>
  );
}

export interface MonogramProps extends Omit<LockupProps, 'children'> {
  name: string;
  imageUrl?: string;
  role?: string;
}

/** Circular cast/crew monogram with image or initials fallback. */
export function Monogram({ name, imageUrl, role, footer, ...props }: MonogramProps) {
  return (
    <Lockup
      footer={
        footer ?? (
          <>
            <div className={styles.headerTitle}>{name}</div>
            {role && <div>{role}</div>}
          </>
        )
      }
      aria-label={name}
      {...props}
    >
      <div className={styles.monogramCircle}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.monogramImage} />
        ) : (
          <span className={styles.monogramInitials}>{getInitials(name)}</span>
        )}
      </div>
    </Lockup>
  );
}

export interface PosterProps extends Omit<LockupProps, 'children'> {
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

/** Poster lockup — title/subtitle appear on focus. */
export function Poster({ imageUrl, title, subtitle, ...props }: PosterProps) {
  return (
    <Lockup aria-label={title ?? 'Poster'} {...props}>
      <div className={styles.posterFrame}>
        <img src={imageUrl} alt="" className={styles.posterImage} />
      </div>
      {(title || subtitle) && (
        <div className={styles.posterMeta}>
          {title && <div className={styles.posterTitle}>{title}</div>}
          {subtitle && <div className={styles.posterSubtitle}>{subtitle}</div>}
        </div>
      )}
    </Lockup>
  );
}

export interface LockupRowProps {
  children: ReactNode;
  itemWidth?: string;
  axis?: LockupAxis;
}

/** Row of equally sized lockups with adequate spacing. */
export function LockupRow({ children, itemWidth = '10rem', axis = 'horizontal' }: LockupRowProps) {
  return (
    <div
      className={styles.row}
      style={{ '--lr-lockup-item-width': itemWidth } as CSSProperties}
      data-axis={axis}
    >
      {Children.map(children, (child, index) => (
        <div key={index} className={styles.rowItem}>
          {child}
        </div>
      ))}
    </div>
  );
}
