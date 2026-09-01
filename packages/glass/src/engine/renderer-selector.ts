import type { GlassRendererKind, GlassSurface } from '../types';
import {
  supportsCanvasGlass,
  supportsSVGGlass,
  supportsVideoGlass,
  supportsWebGLGlass,
} from '../capabilities/detect';

export function selectRenderer(
  surface: GlassSurface,
  forced?: GlassRendererKind,
): GlassRendererKind {
  if (forced) return forced;

  switch (surface) {
    case 'canvas':
      return supportsCanvasGlass() ? 'webgl' : 'fallback';
    case 'video':
      return supportsVideoGlass() ? 'webgl' : 'fallback';
    case 'dom':
    default:
      return supportsSVGGlass() ? 'svg' : 'fallback';
  }
}
