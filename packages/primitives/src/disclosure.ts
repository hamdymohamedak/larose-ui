export interface DisclosureOpenOptions {
  open?: boolean;
  defaultOpen?: boolean;
  internalOpen: boolean;
}

/** Resolve controlled vs uncontrolled disclosure open state. */
export function resolveDisclosureOpen({
  open,
  defaultOpen = false,
  internalOpen,
}: DisclosureOpenOptions): boolean {
  if (open !== undefined) return open;
  return internalOpen || defaultOpen;
}

export function nextDisclosureOpen(
  currentlyOpen: boolean,
  next?: boolean,
): boolean {
  return next !== undefined ? next : !currentlyOpen;
}
