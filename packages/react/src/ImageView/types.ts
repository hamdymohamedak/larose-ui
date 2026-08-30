export type ImageFit = 'fill' | 'contain' | 'cover' | 'scale-down' | 'none';

export type ImageBackground = 'transparent' | 'opaque';

export interface ImageFrameSequence {
  /** URLs for each frame — use consistent dimensions for best performance. */
  frames: string[];
  /** Interval between frames in milliseconds. */
  intervalMs?: number;
}
