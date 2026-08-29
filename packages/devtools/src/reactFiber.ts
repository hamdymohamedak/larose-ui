/** Minimal React internal fiber shape — dev-only introspection. */
export interface FiberNode {
  type?: unknown;
  memoizedProps?: Record<string, unknown>;
  return?: FiberNode | null;
}

export interface ReactComponentInfo {
  displayName: string;
  props: Record<string, string>;
}

const PROP_SKIP = new Set(['children', 'ref', 'key', 'dangerouslySetInnerHTML']);
const MAX_PROP_LEN = 80;

export function getFiberKey(node: Element): string | undefined {
  return Object.keys(node).find(
    (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'),
  );
}

export function getFiberFromDOM(node: Element): FiberNode | null {
  const key = getFiberKey(node);
  if (!key) return null;
  return (node as unknown as Record<string, FiberNode>)[key] ?? null;
}

export function getComponentName(type: unknown): string | null {
  if (!type || typeof type === 'string') return null;

  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || null;
  }

  if (typeof type === 'object') {
    const obj = type as {
      displayName?: string;
      render?: { displayName?: string; name?: string };
    };
    if (obj.render) {
      return obj.render.displayName || obj.render.name || null;
    }
    if (obj.displayName) return obj.displayName;
  }

  return null;
}

export function findNearestComponentFiber(fiber: FiberNode | null): FiberNode | null {
  let current = fiber;
  while (current) {
    const name = getComponentName(current.type);
    if (name) return current;
    current = current.return ?? null;
  }
  return null;
}

export function sanitizeFiberProps(props: Record<string, unknown> | undefined): Record<string, string> {
  if (!props) return {};

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (PROP_SKIP.has(key) || key.startsWith('__')) continue;
    out[key] = formatPropValue(value);
  }
  return out;
}

function formatPropValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return truncate(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return '[Function]';
  try {
    return truncate(JSON.stringify(value));
  } catch {
    return '[Object]';
  }
}

function truncate(value: string): string {
  if (value.length <= MAX_PROP_LEN) return value;
  return `${value.slice(0, MAX_PROP_LEN - 3)}...`;
}

export function resolveReactComponentInfo(domNode: Element): ReactComponentInfo | null {
  const hostFiber = getFiberFromDOM(domNode);
  if (!hostFiber) return null;

  const componentFiber = findNearestComponentFiber(hostFiber);
  if (!componentFiber) return null;

  const displayName = getComponentName(componentFiber.type);
  if (!displayName) return null;

  return {
    displayName,
    props: sanitizeFiberProps(componentFiber.memoizedProps),
  };
}
