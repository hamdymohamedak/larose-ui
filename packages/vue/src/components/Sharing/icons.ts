import { h } from 'vue';

const base = (children: ReturnType<typeof h>[], size = '1.125rem') =>
  h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true' }, children);

export const ShareIcon = () => base([h('path', { d: 'M12 3v10.2M12 3l3.5 3.5M12 3 8.5 6.5M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]);
export const PeopleIcon = () => base([h('circle', { cx: '9', cy: '8', r: '3.25', stroke: 'currentColor', 'stroke-width': '1.75' }), h('path', { d: 'M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' })]);
export const MessageIcon = () => base([h('path', { d: 'M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-11.5A1.5 1.5 0 0 1 6.5 6.5Z', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linejoin': 'round' })]);
export const VideoIcon = () => base([h('rect', { x: '4', y: '7', width: '11', height: '10', rx: '2', stroke: 'currentColor', 'stroke-width': '1.75' }), h('path', { d: 'm15 11 5-3v10l-5-3v-4Z', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linejoin': 'round' })]);
export const LinkIcon = () => base([h('path', { d: 'M10 14a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 1 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' })]);
export const CopyIcon = () => base([h('rect', { x: '8', y: '8', width: '11', height: '11', rx: '2', stroke: 'currentColor', 'stroke-width': '1.75' }), h('path', { d: 'M6 16V6a2 2 0 0 1 2-2h10', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' })]);
export const ChevronRightIcon = () => base([h('path', { d: 'M9 6l6 6-6 6', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })], '0.875rem');

export const PrintIcon = () => base([
  h('path', { d: 'M7 8V4h10v4M7 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  h('rect', { x: '7', y: '14', width: '10', height: '6', rx: '1', stroke: 'currentColor', 'stroke-width': '1.75' }),
]);
export const MarkupIcon = () => base([
  h('circle', { cx: '12', cy: '12', r: '7.25', stroke: 'currentColor', 'stroke-width': '1.75' }),
  h('path', { d: 'M9 12h6M12 9v6', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round' }),
]);
export const FilesIcon = () => base([
  h('path', { d: 'M8 6.5h8l2 2V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6.5 18V8A1.5 1.5 0 0 1 8 6.5Z', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linejoin': 'round' }),
  h('path', { d: 'M8 6.5V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5v1', stroke: 'currentColor', 'stroke-width': '1.75' }),
]);
export const AirPlayIcon = () => base([
  h('path', { d: 'M7 16h10M12 12l4 4H8l4-4ZM12 4a8 8 0 0 1 8 8', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);
export const MailIcon = () => base([
  h('rect', { x: '3.5', y: '6', width: '17', height: '12', rx: '2', stroke: 'currentColor', 'stroke-width': '1.75' }),
  h('path', { d: 'm4.5 7.5 7.5 5.5 7.5-5.5', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);
export const PhotosIcon = () => base([
  h('rect', { x: '3.5', y: '5.5', width: '17', height: '13', rx: '2', stroke: 'currentColor', 'stroke-width': '1.75' }),
  h('circle', { cx: '9', cy: '10', r: '1.75', stroke: 'currentColor', 'stroke-width': '1.5' }),
  h('path', { d: 'm7 16 3-3 2 2 3-3.5 3.5 4.5', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);
