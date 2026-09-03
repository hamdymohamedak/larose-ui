export function portal(node: HTMLElement, target: string | HTMLElement = 'body') {
  const dest = typeof target === 'string' ? document.querySelector(target) : target;
  dest?.appendChild(node);
  return {
    destroy() {
      node.remove();
    },
  };
}
