import {
  createDefaultRuntimeContext,
  createRuntimeEventBus,
  detectA11yPreferences,
  subscribeA11yPreferences,
  type LaRoseRuntimeContext,
  type RuntimeEventBus,
  type SessionState,
} from '@larose-ui/core';

export interface RuntimeStoreOptions {
  initialContext?: Partial<LaRoseRuntimeContext>;
  eventBus?: RuntimeEventBus;
}

export type RuntimeStoreListener = (context: LaRoseRuntimeContext) => void;

/**
 * Framework-agnostic runtime store — context snapshot + event bus.
 * Framework bindings subscribe to {@link subscribe} for reactive updates.
 */
export class RuntimeStore {
  private context: LaRoseRuntimeContext;
  readonly eventBus: RuntimeEventBus;
  private listeners = new Set<RuntimeStoreListener>();
  private a11yUnsubscribe: (() => void) | null = null;

  constructor(options: RuntimeStoreOptions = {}) {
    this.eventBus = options.eventBus ?? createRuntimeEventBus();
    this.context = createDefaultRuntimeContext({
      accessibility: detectA11yPreferences(),
      ...options.initialContext,
    });
  }

  getContext(): LaRoseRuntimeContext {
    return this.context;
  }

  subscribe(listener: RuntimeStoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setContext(patch: Partial<LaRoseRuntimeContext>): void {
    this.context = { ...this.context, ...patch };
    this.eventBus.emit({
      type: 'runtime.updated',
      metadata: { keys: Object.keys(patch) },
    });
    this.notify();
  }

  setSession(session: SessionState): void {
    if (this.context.session === session) return;
    const from = this.context.session;
    this.context = { ...this.context, session };
    this.eventBus.emit({
      type: 'session.transition',
      metadata: { from, to: session },
    });
    this.notify();
  }

  mount(): void {
    this.eventBus.emit({ type: 'runtime.mounted' });
  }

  /** Subscribe to system accessibility preference changes. */
  bindA11yPreferences(): () => void {
    this.a11yUnsubscribe?.();
    this.a11yUnsubscribe = subscribeA11yPreferences((accessibility) => {
      this.setContext({ accessibility });
    });
    return this.a11yUnsubscribe;
  }

  dispose(): void {
    this.a11yUnsubscribe?.();
    this.a11yUnsubscribe = null;
    this.listeners.clear();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.context);
    }
  }
}

export function createRuntimeStore(options?: RuntimeStoreOptions): RuntimeStore {
  return new RuntimeStore(options);
}
