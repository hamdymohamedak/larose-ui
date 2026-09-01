import type { DisplacementMapData, DisplacementMapOptions, GlassLens } from '../types';
import { computeMapDimensions } from '../lens/filter-region';
import { resolveLens } from '../lens/defaults';
import {
  computeLensDisplacement,
  encodeDisplacementChannel,
} from './lens-profile';

function writePixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b = 128,
  a = 255,
): void {
  const index = (y * width + x) * 4;
  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = a;
}

function computePixel(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
  lens: Required<GlassLens>,
): { r: number; g: number } {
  const scaleX = lens.width / mapWidth;
  const scaleY = lens.height / mapHeight;
  const localX = (x + 0.5) * scaleX;
  const localY = (y + 0.5) * scaleY;

  const { dx, dy, inside } = computeLensDisplacement(
    localX,
    localY,
    lens.width,
    lens.height,
    lens.borderRadius,
    lens.depth,
    lens.curvature,
    lens.splay,
    lens.scale,
  );

  if (!inside) {
    return { r: 128, g: 128 };
  }

  return {
    r: encodeDisplacementChannel(dx),
    g: encodeDisplacementChannel(dy),
  };
}

function mirrorChannel(value: number): number {
  return 256 - value;
}

/**
 * Mirror one quadrant into the full displacement map.
 * Negates displacement components when mirroring (horizontal → flip R, vertical → flip G).
 */
function fillWithQuadrantSymmetry(
  data: Uint8ClampedArray,
  mapWidth: number,
  mapHeight: number,
  lens: Required<GlassLens>,
): void {
  const midX = Math.ceil(mapWidth / 2);
  const midY = Math.ceil(mapHeight / 2);

  for (let y = 0; y < midY; y++) {
    for (let x = 0; x < midX; x++) {
      const { r, g } = computePixel(x, y, mapWidth, mapHeight, lens);

      writePixel(data, mapWidth, x, y, r, g);
      writePixel(data, mapWidth, mapWidth - 1 - x, y, mirrorChannel(r), g);
      writePixel(data, mapWidth, x, mapHeight - 1 - y, r, mirrorChannel(g));
      writePixel(data, mapWidth, mapWidth - 1 - x, mapHeight - 1 - y, mirrorChannel(r), mirrorChannel(g));
    }
  }
}

/** Unoptimized full-map generation for benchmarking and verification. */
export function generateDisplacementMapFull(
  lens: GlassLens,
  options: DisplacementMapOptions = {},
): DisplacementMapData {
  const resolved = resolveLens(lens);
  const pixelRatio = options.pixelRatio ?? 1;
  const { width, height } = computeMapDimensions(resolved, pixelRatio);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { r, g } = computePixel(x, y, width, height, resolved);
      writePixel(data, width, x, y, r, g);
    }
  }

  return toDisplacementMapData(width, height, data);
}

/**
 * Generate a displacement map for a glass lens.
 * R → horizontal displacement, G → vertical displacement.
 * Neutral value = 128 (no displacement).
 */
export function generateDisplacementMap(
  lens: GlassLens,
  options: DisplacementMapOptions = {},
): DisplacementMapData {
  const resolved = resolveLens(lens);
  const pixelRatio = options.pixelRatio ?? 1;
  const optimize = options.optimize ?? true;
  const { width, height } = computeMapDimensions(resolved, pixelRatio);
  const data = new Uint8ClampedArray(width * height * 4);

  // Fill neutral first
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;
    data[i + 1] = 128;
    data[i + 2] = 128;
    data[i + 3] = 255;
  }

  if (optimize) {
    fillWithQuadrantSymmetry(data, width, height, resolved);
  } else {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const { r, g } = computePixel(x, y, width, height, resolved);
        writePixel(data, width, x, y, r, g);
      }
    }
  }

  return toDisplacementMapData(width, height, data);
}

/** 1×1 neutral displacement PNG when canvas export is unavailable (SSR / jsdom). */
const NEUTRAL_MAP_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function toDisplacementMapData(
  width: number,
  height: number,
  data: Uint8ClampedArray,
): DisplacementMapData {
  const canvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : null;

  let dataUrl = NEUTRAL_MAP_DATA_URL;
  if (canvas) {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(data);
      ctx.putImageData(imageData, 0, 0);
      dataUrl = canvas.toDataURL('image/png');
    }
  }

  return { width, height, data, dataUrl };
}

/** Compare optimized vs full map for benchmark / correctness checks. */
export function displacementMapsEqual(a: DisplacementMapData, b: DisplacementMapData): boolean {
  if (a.width !== b.width || a.height !== b.height) return false;
  if (a.data.length !== b.data.length) return false;
  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) return false;
  }
  return true;
}
