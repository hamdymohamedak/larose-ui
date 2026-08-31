import type { Slots, VNode } from 'vue';

function nodeHasText(node: VNode): boolean {
  if (typeof node.children === 'string') {
    return node.children.trim().length > 0;
  }
  if (Array.isArray(node.children)) {
    return node.children.some((child) =>
      typeof child === 'string' ? child.trim().length > 0 : Boolean(child),
    );
  }
  return Boolean(node.children);
}

export function hasDefaultSlotText(slots: Slots): boolean {
  const content = slots.default?.();
  if (!content?.length) return false;
  return content.some(nodeHasText);
}
