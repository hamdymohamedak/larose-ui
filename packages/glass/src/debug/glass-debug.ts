import type { GlassRendererContext } from '../types';

let debugEnabled = false;

export function setGlassDebugEnabled(enabled: boolean): void {
  debugEnabled = enabled;
}

export function isGlassDebugEnabled(): boolean {
  return debugEnabled;
}

function ensureDebugRoot(): HTMLElement {
  let root = document.getElementById('larose-glass-debug-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'larose-glass-debug-root';
    Object.assign(root.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      zIndex: '99999',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      pointerEvents: 'none',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '11px',
    });
    document.body.appendChild(root);
  }
  return root;
}

export function renderGlassDebugPanel(
  instanceId: string,
  context: GlassRendererContext,
  rendererKind: string,
  mapGenMs?: number,
): void {
  if (!debugEnabled || typeof document === 'undefined') return;

  const root = ensureDebugRoot();
  let panel = document.getElementById(`larose-glass-debug-${instanceId}`);
  if (!panel) {
    panel = document.createElement('div');
    panel.id = `larose-glass-debug-${instanceId}`;
    Object.assign(panel.style, {
      background: 'rgb(0 0 0 / 0.75)',
      color: '#a5f3fc',
      padding: '8px 10px',
      borderRadius: '6px',
      lineHeight: '1.5',
      maxWidth: '220px',
    });
    root.appendChild(panel);
  }

  const region = context.filterRegion;
  panel.textContent = [
    `renderer: ${rendererKind}`,
    `map v${context.version}${mapGenMs != null ? ` (${mapGenMs.toFixed(1)}ms)` : ''}`,
    `lens: ${context.lens.width}×${context.lens.height}`,
    `region: ${region.width}×${region.height}`,
    `scale: depth=${context.lens.depth}`,
  ].join('\n');
}

export function removeGlassDebugPanel(instanceId: string): void {
  document.getElementById(`larose-glass-debug-${instanceId}`)?.remove();
  const root = document.getElementById('larose-glass-debug-root');
  if (root && root.childElementCount === 0) root.remove();
}

export function renderLensBoundsOutline(el: HTMLElement, enabled: boolean): void {
  if (!enabled) {
    el.style.outline = '';
    return;
  }
  el.style.outline = '1px dashed rgb(236 72 153 / 0.8)';
  el.style.outlineOffset = '2px';
}
