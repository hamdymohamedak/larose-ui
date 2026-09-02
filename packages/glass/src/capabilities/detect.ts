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

/** Chromium desktop Blink — backdrop-filter: url(#svg) refracts live page content. */
function isBlinkEngine(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const hasUAData =
    (navigator as Navigator & { userAgentData?: unknown }).userAgentData != null;
  if (hasUAData) {
    return (
      /\b(?:Chrome|Chromium|Edg)\//.test(ua) &&
      !/\b(?:CriOS|EdgiOS|FxiOS|OPiOS)\b/.test(ua) &&
      !/iPhone|iPad|iPod/.test(ua)
    );
  }
  return (
    /\b(?:Chrome|Chromium|Edg)\//.test(ua) &&
    !/\b(?:CriOS|EdgiOS|FxiOS|OPiOS)\b/.test(ua) &&
    !/iPhone|iPad|iPod/.test(ua) &&
    !/Firefox/i.test(ua)
  );
}

export type RefractionMode = 'backdrop' | 'content' | 'css';
export type GlassRefractionSurface = 'overlay' | 'shell';

/**
 * Blink: backdrop-filter url() bends live DOM behind the lens.
 * WebKit shell: filter url() on a neutral frosted layer (no rainbow).
 * Overlays on WebKit: CSS frost only.
 */
export function selectRefractionMode(surface: GlassRefractionSurface = 'overlay'): RefractionMode {
  if (!hasDocument()) return 'css';
  if (!supportsSVGGlass()) return 'css';
  if (isBlinkEngine() && hasBackdropFilterSupport()) return 'backdrop';
  if (surface === 'shell') return 'content';
  return 'css';
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
 * True when SVG displacement can refract painted backdrop content.
 * Chromium supports backdrop-filter: url(#svg-filter) on live DOM (see liquid-glass BROWSERS.md).
 */
export function supportsBackdropSvgDisplacement(): boolean {
  if (backdropSvgDisplacementSupport !== null) return backdropSvgDisplacementSupport;
  if (!hasDocument()) {
    backdropSvgDisplacementSupport = false;
    return false;
  }

  backdropSvgDisplacementSupport = selectRefractionMode() === 'backdrop';
  return backdropSvgDisplacementSupport;
}

/** True when SVG displacement can run via filter: url() (Safari, Firefox, Chromium). */
export function supportsContentSvgDisplacement(): boolean {
  return supportsSVGGlass();
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
