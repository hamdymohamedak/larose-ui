import type { Accelerator, AcceleratorConflict, AcceleratorScope, RegisteredAccelerator } from './types';
import { matchKeyboardEvent, detectPlatform } from './match';
import { acceleratorToId, normalizeAccelerator } from './normalize';
import { shouldHandleShortcut } from './input';

export interface AcceleratorHandler {
  id: string;
  handler: () => void;
  accelerator: Accelerator;
  scope: AcceleratorScope;
  priority: number;
  allowInEditable?: boolean;
  enabled?: () => boolean;
}

export interface HandleAcceleratorEventOptions {
  platform?: ReturnType<typeof detectPlatform>;
  /** Scopes to consider, in descending priority order. */
  scopes?: AcceleratorScope[];
  target?: EventTarget | null;
}

const SCOPE_PRIORITY: Record<AcceleratorScope, number> = {
  menu: 300,
  component: 200,
  global: 100,
};

/**
 * In-memory accelerator registry with conflict detection and scoped dispatch.
 */
export class AcceleratorRegistry {
  private entries = new Map<string, AcceleratorHandler>();
  private warnedConflicts = new Set<string>();

  register(entry: AcceleratorHandler): () => void {
    this.entries.set(entry.id, entry);
    this.checkConflict(entry);
    return () => this.unregister(entry.id);
  }

  unregister(id: string): void {
    this.entries.delete(id);
  }

  clear(): void {
    this.entries.clear();
    this.warnedConflicts.clear();
  }

  getConflicts(): AcceleratorConflict[] {
    const byKey = new Map<string, string[]>();

    for (const entry of this.entries.values()) {
      if (entry.enabled && !entry.enabled()) continue;
      const key = acceleratorToId(entry.accelerator);
      const ids = byKey.get(key) ?? [];
      ids.push(entry.id);
      byKey.set(key, ids);
    }

    const conflicts: AcceleratorConflict[] = [];
    for (const [key, ids] of byKey) {
      if (ids.length <= 1) continue;
      const [firstId] = ids;
      const first = this.entries.get(firstId!);
      if (first) {
        conflicts.push({ accelerator: first.accelerator, ids });
      } else {
        conflicts.push({ accelerator: { key: key }, ids });
      }
    }
    return conflicts;
  }

  /**
   * Handle a keyboard event against registered accelerators.
   * Returns true when a handler consumed the event.
   */
  handleEvent(event: KeyboardEvent, options: HandleAcceleratorEventOptions = {}): boolean {
    const platform = options.platform ?? detectPlatform();
    const scopes = options.scopes ?? ['menu', 'component', 'global'];

    const candidates = [...this.entries.values()]
      .filter((entry) => scopes.includes(entry.scope))
      .filter((entry) => !entry.enabled || entry.enabled())
      .filter((entry) =>
        shouldHandleShortcut({
          allowInEditable: entry.allowInEditable,
          target: options.target ?? event.target,
        }),
      )
      .filter((entry) => matchKeyboardEvent(event, entry.accelerator, { platform }))
      .sort((a, b) => {
        const scopeDiff = SCOPE_PRIORITY[b.scope] - SCOPE_PRIORITY[a.scope];
        if (scopeDiff !== 0) return scopeDiff;
        return b.priority - a.priority;
      });

    const winner = candidates[0];
    if (!winner) return false;

    event.preventDefault();
    winner.handler();
    return true;
  }

  private checkConflict(entry: AcceleratorHandler): void {
    const key = acceleratorToId(entry.accelerator);
    if (this.warnedConflicts.has(key)) return;

    const duplicates = [...this.entries.values()].filter(
      (other) =>
        other.id !== entry.id &&
        acceleratorToId(other.accelerator) === key &&
        other.scope === entry.scope,
    );

    if (duplicates.length === 0) return;

    this.warnedConflicts.add(key);
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      const ids = [entry.id, ...duplicates.map((d) => d.id)];
      console.warn(
        `[laRose] Accelerator conflict for "${key}" in scope "${entry.scope}": ${ids.join(', ')}`,
      );
    }
  }
}

/** Create a standalone registry instance. */
export function createAcceleratorRegistry(): AcceleratorRegistry {
  return new AcceleratorRegistry();
}

/** Compare two accelerators for equality. */
export function acceleratorsEqual(a: Accelerator, b: Accelerator): boolean {
  return acceleratorToId(a) === acceleratorToId(b);
}
