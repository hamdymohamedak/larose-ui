import type { GlassRenderer, GlassRendererContext } from '../types';
import { resolveLens } from '../lens/defaults';
import { filterRegionMarkupAttrs } from '../lens/filter-region';
import { renderLensBoundsOutline } from '../debug/glass-debug';
import { glassRuntimeLog } from '../debug/runtime-log';

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
  const base = lens.depth * (lens.curvature / 100) * scaleMul * 10;
  return Math.min(base, 36);
}

function filterPadding(lens: ReturnType<typeof resolveLens>): number {
  return Math.ceil(displacementScale(lens) * 0.5 + 12);
}

function displacementMapPrimitives(
  mapHref: string,
  region: ReturnType<typeof filterRegionMarkupAttrs>,
): string {
  return `
      <feFlood flood-color="rgb(128,128,128)" flood-opacity="1" result="neutralMap"/>
      <feImage href="${mapHref}" xlink:href="${mapHref}"
        x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"
        preserveAspectRatio="none" result="rawMap"/>
      <feComposite in="rawMap" in2="neutralMap" operator="over" result="displacementMap"/>`;
}

function buildContentFilterMarkup(
  filterId: string,
  context: GlassRendererContext,
): string {
  const lens = resolveLens(context.lens);
  const scale = displacementScale(lens);
  const mapHref = context.displacementMap.dataUrl;
  if (!mapHref) return '';

  const region = filterRegionMarkupAttrs(lens, filterPadding(lens));

  return `
    <filter id="${filterId}"
      filterUnits="${region.filterUnits}"
      primitiveUnits="${region.primitiveUnits}"
      x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"
      color-interpolation-filters="sRGB">
      ${displacementMapPrimitives(mapHref, region)}
      <feDisplacementMap in="SourceGraphic" in2="displacementMap"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="refracted"/>
      <feMerge><feMergeNode in="refracted"/></feMerge>
    </filter>
  `;
}

/**
 * Backdrop filter — SourceGraphic is the backdrop when used via backdrop-filter (liquid-glass).
 */
function buildBackdropFilterMarkup(
  filterId: string,
  context: GlassRendererContext,
): string {
  const lens = resolveLens(context.lens);
  const scale = displacementScale(lens);
  const mapHref = context.displacementMap.dataUrl;
  if (!mapHref) return '';

  const region = filterRegionMarkupAttrs(lens, filterPadding(lens));

  return `
    <filter id="${filterId}"
      filterUnits="${region.filterUnits}"
      primitiveUnits="${region.primitiveUnits}"
      x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"
      color-interpolation-filters="sRGB">
      ${displacementMapPrimitives(mapHref, region)}
      <feDisplacementMap in="SourceGraphic" in2="displacementMap"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="refracted"/>
      <feMerge><feMergeNode in="refracted"/></feMerge>
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
      background: 'transparent',
    });
    return;
  }

  Object.assign(element.style, {
    border: base.border,
    boxShadow: base.boxShadow,
    background: 'transparent',
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

    if (!markup) {
      // #region agent log
      glassRuntimeLog(
        'svg-glass-renderer.ts:update',
        'empty filter markup',
        {
          mode: this.mode,
          dataUrlLen: context.displacementMap.dataUrl?.length ?? 0,
          mapVersion: context.version,
        },
        'B',
      );
      // #endregion
      return;
    }

    const filter = parseSvgFilter(markup);
    if (!filter) {
      // #region agent log
      glassRuntimeLog(
        'svg-glass-renderer.ts:update',
        'filter parse failed',
        { mode: this.mode, filterId: this.filterId },
        'B',
      );
      // #endregion
      return;
    }

    defs.appendChild(filter);
    this.filterElement = filter;

    if (!(context.root instanceof HTMLElement)) return;
    this.targetElement = context.root;

    this.applyFilterToElement(context.root, resolved, context.position);
    applyLensSurfaceStyles(context.root, resolved, this.mode);

    // #region agent log
    const root = context.root;
    const scale = displacementScale(resolved);
    requestAnimationFrame(() => {
      const cs = getComputedStyle(root);
      const parent = root.parentElement;
      const parentIsolation = parent ? getComputedStyle(parent).isolation : 'none';
      glassRuntimeLog(
        'svg-glass-renderer.ts:applied',
        'filter styles applied',
        {
          mode: this.mode,
          filterId: this.filterId,
          displacementScale: scale,
          backdropFilter: cs.backdropFilter,
          filter: cs.filter,
          zIndex: cs.zIndex,
          overflow: cs.overflow,
          parentIsolation,
        },
        'C',
        'SourceGraphic-fix',
      );
    });
    // #endregion

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
      const blurPx = resolved.blur > 0 ? resolved.blur : 6;
      const frost = `blur(${blurPx}px) saturate(1.15)`;
      Object.assign(el.style, {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${resolved.width}px`,
        height: `${resolved.height}px`,
        borderRadius: `${resolved.borderRadius}px`,
        zIndex: '0',
        pointerEvents: 'none',
        overflow: 'hidden',
        willChange: 'left, top, width',
      });
      el.style.backdropFilter = `${frost} ${filterUrl}`;
      el.style.setProperty('-webkit-backdrop-filter', `${frost} ${filterUrl}`);
      el.style.filter = '';
      el.style.removeProperty('WebkitFilter');
    } else {
      Object.assign(el.style, {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${resolved.width}px`,
        height: `${resolved.height}px`,
        borderRadius: `${resolved.borderRadius}px`,
        overflow: 'hidden',
        zIndex: '0',
        pointerEvents: 'none',
        filter: filterUrl,
        WebkitFilter: filterUrl,
      });
      el.style.backdropFilter = '';
      el.style.removeProperty('-webkit-backdrop-filter');
    }
  }

  /** Move lens without regenerating displacement map. */
  setPosition(position: GlassRendererContext['position']): void {
    if (!this.targetElement) return;
    this.targetElement.style.left = `${position.x}px`;
    this.targetElement.style.top = `${position.y}px`;
  }

  /**
   * Resize/move lens element without regenerating the displacement map.
   * The existing map stretches via objectBoundingBox filter units.
   */
  setBounds(bounds: LensBounds): void {
    if (!this.targetElement) return;
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
