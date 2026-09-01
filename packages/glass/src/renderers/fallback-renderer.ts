import type { GlassRenderer, GlassRendererContext } from '../types';

/** Graceful fallback — no refraction, preserves layout and interaction. */
export class FallbackGlassRenderer implements GlassRenderer {
  readonly kind = 'fallback' as const;
  private root: HTMLElement | HTMLCanvasElement | HTMLVideoElement | null = null;
  private overlay: HTMLDivElement | null = null;

  mount(): void {
    // Overlay provides subtle glass material without displacement
  }

  update(context: GlassRendererContext): void {
    this.root = context.root;
    if (!(context.root instanceof HTMLElement)) return;

    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.setAttribute('data-larose-glass-fallback', 'true');
      this.overlay.setAttribute('aria-hidden', 'true');
      Object.assign(this.overlay.style, {
        position: 'absolute',
        pointerEvents: 'none',
        borderRadius: `${context.lens.borderRadius}px`,
        background: 'var(--lr-surface-glass-bg, rgb(255 255 255 / 0.25))',
        border: '1px solid var(--lr-surface-glass-border, rgb(255 255 255 / 0.35))',
        boxShadow: 'var(--lr-surface-glass-shadow, 0 4px 24px rgb(0 0 0 / 0.08))',
        transition: context.reducedMotion ? 'none' : 'transform 0.2s ease',
      });
      context.root.appendChild(this.overlay);
    }

    Object.assign(this.overlay.style, {
      left: `${context.position.x}px`,
      top: `${context.position.y}px`,
      width: `${context.lens.width}px`,
      height: `${context.lens.height}px`,
      borderRadius: `${context.lens.borderRadius}px`,
    });
  }

  setPosition(position: GlassRendererContext['position']): void {
    if (!this.overlay) return;
    this.overlay.style.transform = `translate(${position.x}px, ${position.y}px)`;
    this.overlay.style.left = '0';
    this.overlay.style.top = '0';
  }

  setBounds(bounds: { x: number; y: number; width: number; height: number }): void {
    if (!this.overlay) return;
    this.overlay.style.left = `${bounds.x}px`;
    this.overlay.style.top = `${bounds.y}px`;
    this.overlay.style.width = `${bounds.width}px`;
    this.overlay.style.height = `${bounds.height}px`;
    this.overlay.style.transform = '';
  }

  resize(): void {
    // No-op — position updates handled via setPosition/update
  }

  destroy(): void {
    this.overlay?.remove();
    this.overlay = null;
    this.root = null;
  }
}
