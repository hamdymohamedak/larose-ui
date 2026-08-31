import { useEffect, useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
import type { ImageBackground, ImageFit, ImageFrameSequence } from './types';
import { nextFrameIndex, sequenceInterval } from './utils';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';

export interface ImageViewProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  alt: string;
  fit?: ImageFit;
  objectPosition?: string;
  background?: ImageBackground;
  /** Animated image sequence — frames should share dimensions when possible. */
  sequence?: ImageFrameSequence;
  frameClassName?: string;
  frameStyle?: CSSProperties;
}

const fitMap: Record<ImageFit, CSSProperties['objectFit']> = {
  fill: 'fill',
  contain: 'contain',
  cover: 'cover',
  'scale-down': 'scale-down',
  none: 'none',
};

/**
 * Non-interactive image display with Apple HIG fit modes.
 * @see https://developer.apple.com/design/human-interface-guidelines/image-views
 */
export function ImageView({
  src,
  alt,
  fit = 'contain',
  objectPosition = 'center',
  background = 'opaque',
  sequence,
  className,
  frameClassName,
  frameStyle,
  style,
  ...props
}: ImageViewProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const activeSrc = sequence?.frames.length
    ? sequence.frames[frameIndex]
    : src;

  useEffect(() => {
    if (!sequence?.frames.length) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => nextFrameIndex(current, sequence.frames.length));
    }, sequenceInterval(sequence));
    return () => window.clearInterval(timer);
  }, [sequence]);

  if (!activeSrc) return null;

  return (
    <div
      className={[styles.frame, frameClassName].filter(Boolean).join(' ')}
      data-background={background}
      style={frameStyle}
    >
      <img
        src={activeSrc}
        alt={alt}
        className={[styles.image, className].filter(Boolean).join(' ')}
        style={{
          objectFit: fitMap[fit],
          objectPosition,
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
