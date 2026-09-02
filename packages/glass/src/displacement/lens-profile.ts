/**
 * Signed distance to a rounded rectangle centered at origin.
 * Negative inside, positive outside.
 */
export function roundedRectSdf(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
): number {
  const clampedRadius = Math.min(radius, halfWidth, halfHeight);
  const qx = Math.abs(x) - halfWidth + clampedRadius;
  const qy = Math.abs(y) - halfHeight + clampedRadius;
  const outer = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inner = Math.min(Math.max(qx, qy), 0);
  return outer + inner - clampedRadius;
}

/**
 * Compute displacement vector at a pixel inside the lens.
 * Returns normalized offsets in [-1, 1] range before channel encoding.
 */
export function computeLensDisplacement(
  localX: number,
  localY: number,
  width: number,
  height: number,
  borderRadius: number,
  depth: number,
  curvature: number,
  splay: number,
  scale: number,
): { dx: number; dy: number; inside: boolean } {
  const halfW = width / 2;
  const halfH = height / 2;
  const lx = localX - halfW;
  const ly = localY - halfH;

  const sdf = roundedRectSdf(lx, ly, halfW, halfH, borderRadius);
  if (sdf > 0) {
    return { dx: 0, dy: 0, inside: false };
  }

  const nx = halfW > 0 ? lx / halfW : 0;
  const ny = halfH > 0 ? ly / halfH : 0;

  // Elliptical radial distance — 0 at center, ~1 at edges
  const radial = Math.min(1, Math.hypot(nx, ny));

  // Convex lens profile — refraction increases toward edges
  const curvatureNorm = curvature / 100;
  const depthNorm = depth / 20;
  const edgeWeight = Math.pow(radial, Math.max(0.1, splay));
  const magnitude = depthNorm * curvatureNorm * edgeWeight * scale * 1.4;

  // Radial displacement — magnifying lens pushes content outward
  const len = Math.hypot(nx, ny) || 1;
  const dx = (nx / len) * magnitude * radial;
  const dy = (ny / len) * magnitude * radial;

  return { dx, dy, inside: true };
}

export function encodeDisplacementChannel(offset: number): number {
  return Math.round(Math.max(0, Math.min(255, 128 + offset * 127)));
}
