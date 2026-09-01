import type { GlassRenderer, GlassRendererContext } from '../types';
import { resolveLens } from '../lens/defaults';
import { filterRegionMarkupAttrs } from '../lens/filter-region';
import { renderLensBoundsOutline } from '../debug/glass-debug';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFS_ID = 'larose-glass-defs';

export type SVGGlassMode = 'content' | 'backdrop';

let sharedDefs: SVGSVGElement | null = null;

function getOrCreateDefs(): SVGSVGElement {
  if (sharedDefs && document.body.contains(sharedDefs)) {
    return sharedDefs;
  }
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('id', DEFS_ID);
  svg.setAttribute('aria-hidden', 'true');
  Object.assign(svg.style, {
    position: 'absolute',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
  });
  document.body.appendChild(svg);
  sharedDefs = svg;
  return svg;
}

const XLINK_NS = 'http://www.w3.org/1999/xlink';

function parseSvgFilter(markup: string): SVGFilterElement | null {
  const doc = new DOMParser().parseFromString(
    `<svg xmlns="${SVG_NS}" xmlns:xlink="${XLINK_NS}">${markup}</svg>`,
    'image/svg+xml',
  );
  if (doc.querySelector('parsererror')) return null;
  return doc.documentElement.firstElementChild as SVGFilterElement | null;
}

/** Displacement scale in pixels — maps optical props to SVG feDisplacementMap scale. */
export function displacementScale(lens: ReturnType<typeof resolveLens>): number {
  const scaleMul = Math.max(0.05, lens.scale);
  const base = lens.depth * (lens.curvature / 100) * scaleMul * 14;
  return Math.min(base, 52);
}

function buildContentFilterMarkup(
  filterId: string,
  context: GlassRendererContext,
): string {
  const lens = resolveLens(context.lens);
  const scale = displacementScale(lens);
  const mapHref = context.displacementMap.dataUrl;
  if (!mapHref) return '';

  const region = filterRegionMarkupAttrs(lens);
  const blur = lens.blur > 0 ? lens.blur : 0;
  const blurPass = blur > 0
    ? `<feGaussianBlur in="refracted" stdDeviation="${blur}" result="blurred"/>`
    : '';
  const mergeIn = blur > 0 ? 'blurred' : 'refracted';

  return `
    <filter id="${filterId}"
      filterUnits="${region.filterUnits}"
      primitiveUnits="${region.primitiveUnits}"
      x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"
      color-interpolation-filters="sRGB">
      <feImage href="${mapHref}" xlink:href="${mapHref}"
        x="0" y="0" width="${lens.width}" height="${lens.height}"
        preserveAspectRatio="none" result="displacementMap"/>
      <feDisplacementMap in="SourceGraphic" in2="displacementMap"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="refracted"/>
      ${blurPass}
      <feMerge><feMergeNode in="${mergeIn}"/></feMerge>
    </filter>
  `;
}

/**
 * Backdrop filter — refracts live painted content behind the lens element.
 * Works in Safari; Chrome may fall back to CSS glass material in the hook layer.
 */
function buildBackdropFilterMarkup(
  filterId: string,
  context: GlassRendererContext,
): string {
  const lens = resolveLens(context.lens);
  const scale = displacementScale(lens);
  const mapHref = context.displacementMap.dataUrl;
  if (!mapHref) return '';

  const region = filterRegionMarkupAttrs(lens);
  const chroma = lens.chroma;
  const chromaPass = chroma > 0
    ? `<feDisplacementMap in="refracted" in2="displacementMap"
         scale="${(scale * chroma * 0.35).toFixed(2)}"
         xChannelSelector="B" yChannelSelector="G" result="chroma"/>
       <feBlend in="refracted" in2="chroma" mode="screen" result="final"/>`
    : '';

  const blur = lens.blur > 0 ? lens.blur : 0;
  const mergeIn = blur > 0 ? 'blurred' : chroma > 0 ? 'final' : 'refracted';
  const blurPass = blur > 0
    ? `<feGaussianBlur in="${chroma > 0 ? 'final' : 'refracted'}" stdDeviation="${blur}" result="blurred"/>`
    : '';

  return `
    <filter id="${filterId}"
      filterUnits="${region.filterUnits}"
      primitiveUnits="${region.primitiveUnits}"
      x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"
      color-interpolation-filters="sRGB">
      <feImage href="${mapHref}" xlink:href="${mapHref}"
        x="0" y="0" width="${lens.width}" height="${lens.height}"
        preserveAspectRatio="none" result="displacementMap"/>
      <feDisplacementMap in="BackgroundImage" in2="displacementMap"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="refracted"/>
      ${chromaPass}
      ${blurPass}
      <feMerge><feMergeNode in="${mergeIn}"/></feMerge>
    </filter>
  `;
}

export function applyLensSurfaceStyles(
  element: HTMLElement,
  lens: ReturnType<typeof resolveLens>,
  mode: SVGGlassMode,
): void {
  const h = lens.edgeHighlight;
  const glow = lens.glow;
  const angle = lens.specularAngle;

  const base = {
    border: `1px solid rgb(255 255 255 / ${0.35 + h * 0.3})`,
    boxShadow: [
      `inset 0 1.5px 0 rgb(255 255 255 / ${0.5 + h})`,
      `inset 0 -0.5px 0 rgb(0 0 0 / 0.04)`,
      glow > 0 ? `0 6px 24px rgb(100 60 200 / ${glow * 0.3})` : null,
    ]
      .filter(Boolean)
      .join(', '),
  };

  if (mode === 'backdrop') {
    Object.assign(element.style, base, {
      background: `linear-gradient(
        ${angle}deg,
        rgb(255 255 255 / ${0.1 + h * 0.22}) 0%,
        rgb(255 255 255 / ${0.03 + h * 0.04}) 42%,
        rgb(255 255 255 / 0.01) 100%
      )`,
    });
    return;
  }

  Object.assign(element.style, base, {
    background: `linear-gradient(
      ${angle}deg,
      rgb(255 255 255 / 0.2) 0%,
      rgb(255 255 255 / 0.05) 60%,
      transparent 100%
    )`,
  });
}

export interface LensBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SVGGlassRenderer implements GlassRenderer {
  readonly kind = 'svg' as const;
  private filterId = '';
  private filterElement: SVGFilterElement | null = null;
  private targetElement: HTMLElement | null = null;
  private instanceId: string;
  readonly mode: SVGGlassMode;
  private lastContext: GlassRendererContext | null = null;

  constructor(instanceId: string, mode: SVGGlassMode = 'content') {
    this.instanceId = instanceId;
    this.mode = mode;
  }

  mount(): void {
    getOrCreateDefs();
  }

  update(context: GlassRendererContext): void {
    this.lastContext = context;
    this.filterId = `larose-glass-${this.instanceId}-v${context.version}`;
    const defs = getOrCreateDefs();
    const resolved = resolveLens(context.lens);

    this.filterElement?.remove();

    const markup = this.mode === 'backdrop'
      ? buildBackdropFilterMarkup(this.filterId, context)
      : buildContentFilterMarkup(this.filterId, context);

    if (!markup) return;

    const filter = parseSvgFilter(markup);
    if (!filter) return;

    defs.appendChild(filter);
    this.filterElement = filter;

    if (!(context.root instanceof HTMLElement)) return;
    this.targetElement = context.root;

    this.applyFilterToElement(context.root, resolved, context.position);
    applyLensSurfaceStyles(context.root, resolved, this.mode);
    if (context.debug) {
      renderLensBoundsOutline(context.root, true);
    }
  }

  private applyFilterToElement(
    el: HTMLElement,
    resolved: ReturnType<typeof resolveLens>,
    position: { x: number; y: number },
  ): void {
    const filterUrl = `url(#${this.filterId})`;

    if (this.mode === 'backdrop') {
      Object.assign(el.style, {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${resolved.width}px`,
        height: `${resolved.height}px`,
        borderRadius: `${resolved.borderRadius}px`,
        zIndex: '2',
        pointerEvents: 'none',
        overflow: 'hidden',
        willChange: 'left, top, width',
      });
      // SVG displacement refraction (Safari) — avoid extra CSS blur that masks refraction
      el.style.backdropFilter = filterUrl;
      el.style.setProperty('-webkit-backdrop-filter', filterUrl);
      el.style.filter = '';
      el.style.removeProperty('WebkitFilter');
    } else {
      Object.assign(el.style, {
        position: 'relative',
        width: `${resolved.width}px`,
        height: `${resolved.height}px`,
        borderRadius: `${resolved.borderRadius}px`,
        overflow: 'hidden',
        filter: filterUrl,
        WebkitFilter: filterUrl,
      });
      el.style.backdropFilter = '';
      el.style.removeProperty('-webkit-backdrop-filter');
    }
  }

  /** Move lens without regenerating displacement map. */
  setPosition(position: GlassRendererContext['position']): void {
    if (!this.targetElement || this.mode !== 'backdrop') return;
    this.targetElement.style.left = `${position.x}px`;
    this.targetElement.style.top = `${position.y}px`;
  }

  /**
   * Resize/move lens element without regenerating the displacement map.
   * The existing map stretches via objectBoundingBox filter units.
   */
  setBounds(bounds: LensBounds): void {
    if (!this.targetElement || this.mode !== 'backdrop') return;
    const el = this.targetElement;
    el.style.left = `${bounds.x}px`;
    el.style.top = `${bounds.y}px`;
    el.style.width = `${bounds.width}px`;
    el.style.height = `${bounds.height}px`;
    if (this.lastContext) {
      const resolved = resolveLens({
        ...this.lastContext.lens,
        width: bounds.width,
        height: bounds.height,
      });
      el.style.borderRadius = `${resolved.borderRadius}px`;
    }
  }

  resize(): void {
    if (this.lastContext && this.targetElement) {
      this.update(this.lastContext);
    }
  }

  destroy(): void {
    if (this.targetElement) {
      this.targetElement.style.filter = '';
      this.targetElement.style.backdropFilter = '';
      this.targetElement.style.removeProperty('-webkit-backdrop-filter');
      this.targetElement.style.removeProperty('WebkitFilter');
      this.targetElement.style.background = '';
      this.targetElement.style.border = '';
      this.targetElement.style.boxShadow = '';
    }
    this.filterElement?.remove();
    this.filterElement = null;
    this.targetElement = null;
    this.lastContext = null;
    removeSharedDefsIfEmpty();
  }
}

export function removeSharedDefsIfEmpty(): void {
  if (sharedDefs && sharedDefs.childElementCount === 0) {
    sharedDefs.remove();
    sharedDefs = null;
  }
}
