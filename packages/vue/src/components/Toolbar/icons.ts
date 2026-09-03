import { h, type VNode } from 'vue';

const svg = (children: VNode[], size = '1.125rem') =>
  h('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true' }, children);

export function BackChevronIcon() {
  return svg([
    h('path', {
      d: 'M14.5 6 9 11.5l5.5 5.5',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  ]);
}

export function CloseIcon() {
  return svg([
    h('path', {
      d: 'm7 7 10 10M17 7 7 17',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
    }),
  ]);
}

export function ComposeIcon() {
  return svg([
    h('path', {
      d: 'M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.75',
      'stroke-linejoin': 'round',
    }),
    h('path', { d: 'M13.5 6.5 17.5 10.5', stroke: 'currentColor', 'stroke-width': '1.75' }),
  ]);
}

export function ShareIcon() {
  return svg([
    h('path', {
      d: 'M12 4v10M12 4l-3.5 3.5M12 4l3.5 3.5M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.75',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  ]);
}

export function SidebarIcon() {
  return svg([
    h('path', {
      d: 'M5 6h14M5 12h14M5 18h10',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.75',
      'stroke-linecap': 'round',
    }),
  ]);
}

export function DocumentMenuIcon() {
  return svg([
    h('path', {
      d: 'M8 6h8M8 12h8M8 18h5',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.75',
      'stroke-linecap': 'round',
    }),
  ]);
}

export function SearchIcon() {
  return svg(
    [
      h('circle', { cx: '11', cy: '11', r: '6.5', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75' }),
      h('path', { d: 'M16 16l4 4', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' }),
    ],
    '0.875rem',
  );
}

export function OverflowIcon() {
  return svg([
    h('circle', { cx: '6', cy: '12', r: '1.5', fill: 'currentColor' }),
    h('circle', { cx: '12', cy: '12', r: '1.5', fill: 'currentColor' }),
    h('circle', { cx: '18', cy: '12', r: '1.5', fill: 'currentColor' }),
  ]);
}
