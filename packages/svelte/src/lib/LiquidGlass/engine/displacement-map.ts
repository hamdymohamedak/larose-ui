/** Convex-squircle height function as described in the Liquid Glass article. */
export function squircleHeightFn(t: number): number {
  return Math.pow(1 - Math.pow(1 - t, 4), 0.25);
}

/**
 * Signed-distance field for a rounded rectangle.
 * Returns positive distance *inside* the shape toward its border.
 */
export function roundedRectSDF(
  px: number,
  py: number,
  hw: number,
  hh: number,
  r: number,
): number {
  const ax = Math.abs(px);
  const ay = Math.abs(py);
  const qx = ax - (hw - r);
  const qy = ay - (hh - r);
  const outside =
    Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) +
    Math.min(Math.max(qx, qy), 0) -
    r;
  return -outside;
}

export interface BuildDisplacementMapOptions {
  width: number;
  height: number;
  borderRadius: number;
  bezelWidth: number;
  refractionStrength?: number;
}

/**
 * Generates an R/G displacement map encoded as a data URL.
 *
 * Each pixel encodes a 2-D displacement vector:
 *   R channel → X shift (128 = neutral)
 *   G channel → Y shift (128 = neutral)
 */
export function buildLiquidGlassDisplacementMap({
  width: w,
  height: h,
  borderRadius,
  bezelWidth: bezel,
  refractionStrength: strength = 1,
}: BuildDisplacementMapOptions): string {
  if (typeof document === 'undefined' || w <= 0 || h <= 0) return '';

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const radius = Math.min(borderRadius, w / 2, h / 2);
  const imageData = ctx.createImageData(w, h);
  const hw = w / 2;
  const hh = h / 2;
  const eps = 1;
  const delta = 0.001;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x - hw + 0.5;
      const py = y - hh + 0.5;
      const d = roundedRectSDF(px, py, hw, hh, radius);
      let dx = 0;
      let dy = 0;

      if (d >= 0 && d < bezel) {
        const t = d / bezel;
        const y1 = squircleHeightFn(Math.max(0, t - delta));
        const y2 = squircleHeightFn(Math.min(1, t + delta));
        const derivative = (y2 - y1) / (2 * delta);

        const gx =
          roundedRectSDF(px + eps, py, hw, hh, radius) -
          roundedRectSDF(px - eps, py, hw, hh, radius);
        const gy =
          roundedRectSDF(px, py + eps, hw, hh, radius) -
          roundedRectSDF(px, py - eps, hw, hh, radius);
        const glen = Math.sqrt(gx * gx + gy * gy) || 1;
        const nx = gx / glen;
        const ny = gy / glen;

        const mag = Math.min(1, Math.abs(derivative) * 0.55) * (1 - t * 0.25);
        dx = nx * mag * strength;
        dy = ny * mag * strength;
      }

      const idx = (y * w + x) * 4;
      imageData.data[idx] = Math.max(0, Math.min(255, Math.round(128 - dx)));
      imageData.data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 - dy)));
      imageData.data[idx + 2] = 128;
      imageData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
