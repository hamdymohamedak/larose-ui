import type { ImageFrameSequence } from './types';

export function framesShareDimensions(frames: string[]): boolean {
  return frames.length > 0;
}

export function resolveObjectFit(fit: string): string {
  return fit;
}

export function nextFrameIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

export function sequenceInterval(sequence?: ImageFrameSequence): number {
  return sequence?.intervalMs ?? 120;
}
