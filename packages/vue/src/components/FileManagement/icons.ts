import { h } from 'vue';

export function PlusIcon() {
  return h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' }, [
    h('path', { d: 'M8 3v10M3 8h10', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' }),
  ]);
}

export function DocumentIcon() {
  return h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' }, [
    h('path', { d: 'M6 3.5A1.5 1.5 0 0 1 7.5 2h3.8l3.2 3.2V16.5A1.5 1.5 0 0 1 13 18H7.5A1.5 1.5 0 0 1 6 16.5V3.5Z', fill: 'currentColor', opacity: '0.85' }),
    h('path', { d: 'M11 2v3.5H14.5', stroke: 'currentColor', 'stroke-width': '1.2' }),
  ]);
}

export function PreviewIcon() {
  return h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' }, [
    h('path', { d: 'M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z', stroke: 'currentColor', 'stroke-width': '1.5' }),
    h('circle', { cx: '10', cy: '10', r: '2.25', stroke: 'currentColor', 'stroke-width': '1.5' }),
  ]);
}
