import type { ButtonHTMLAttributes, ImgHTMLAttributes } from 'react';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';

export interface ImageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  alt: string;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
}

/**
 * Clickable image — use instead of adding button behavior to a plain image view.
 * @see https://developer.apple.com/design/human-interface-guidelines/image-views
 */
export function ImageButton({ src, alt, imageProps, className, ...props }: ImageButtonProps) {
  return (
    <button type="button" className={[styles.imageButton, className].filter(Boolean).join(' ')} {...props}>
      <img src={src} alt={alt} className={styles.imageButtonImage} {...imageProps} />
    </button>
  );
}
