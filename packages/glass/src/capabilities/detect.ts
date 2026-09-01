let backdropRefractionSupport: boolean | null = null;
let backdropSvgDisplacementSupport: boolean | null = null;

function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

function hasBackdropFilterSupport(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    (CSS.supports?.('backdrop-filter', 'blur(1px)') === true ||
      CSS.supports?.('-webkit-backdrop-filter', 'blur(1px)') === true)
  );
}

/** WebKit without Chromium — Safari supports backdrop-filter: url(#svg). */
function isSafariEngine(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /AppleWebKit/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|SamsungBrowser/i.test(ua);
}

/** Detect SVG feDisplacementMap support. */
export function supportsSVGGlass(): boolean {
  if (!hasDocument()) return false;
  const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
  return typeof displacement.setAttribute === 'function';
}

/**
 * Detect whether backdrop-filter is available (blur at minimum).
 * Used for CSS frosted-glass fallback on overlay lenses.
 */
export function supportsBackdropGlassRefraction(): boolean {
  if (backdropRefractionSupport !== null) return backdropRefractionSupport;
  if (!hasDocument()) {
    backdropRefractionSupport = false;
    return false;
  }

  backdropRefractionSupport = supportsSVGGlass() && hasBackdropFilterSupport();
  return backdropRefractionSupport;
}

/**
 * True when SVG displacement can refract painted backdrop content (Safari).
 * Chromium ignores or mishandles backdrop-filter: url(#svg-filter).
 */
export function supportsBackdropSvgDisplacement(): boolean {
  if (backdropSvgDisplacementSupport !== null) return backdropSvgDisplacementSupport;
  if (!hasDocument()) {
    backdropSvgDisplacementSupport = false;
    return false;
  }

  backdropSvgDisplacementSupport =
    isSafariEngine() && supportsSVGGlass() && hasBackdropFilterSupport();
  return backdropSvgDisplacementSupport;
}

/** Detect WebGL1 context availability. */
export function supportsWebGLGlass(): boolean {
  if (!hasDocument()) return false;
  const canvas = document.createElement('canvas');
  try {
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

export function supportsCanvasGlass(): boolean {
  return supportsWebGLGlass();
}

export function supportsVideoGlass(): boolean {
  if (!hasDocument()) return false;
  const video = document.createElement('video');
  return (
    typeof video.requestVideoFrameCallback === 'function' || supportsWebGLGlass()
  );
}

export function resetCapabilityCache(): void {
  backdropRefractionSupport = null;
  backdropSvgDisplacementSupport = null;
}
