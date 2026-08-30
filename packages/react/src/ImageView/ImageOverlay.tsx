import type { ReactNode } from 'react';
import { ImageView, type ImageViewProps } from './ImageView';
import styles from './ImageView.module.css';

export interface ImageOverlayProps extends Omit<ImageViewProps, 'children'> {
  overlay: ReactNode;
}

/**
 * Image with legible text overlay — scrim improves contrast per Apple HIG.
 * @see https://developer.apple.com/design/human-interface-guidelines/image-views
 */
export function ImageOverlay({ overlay, alt, ...imageProps }: ImageOverlayProps) {
  return (
    <figure className={styles.overlay}>
      <ImageView {...imageProps} alt={alt} className={styles.overlayImage} fit="cover" />
      <div className={styles.overlayScrim} aria-hidden="true" />
      <figcaption className={styles.overlayContent}>{overlay}</figcaption>
    </figure>
  );
}
