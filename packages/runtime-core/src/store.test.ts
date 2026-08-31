import { describe, expect, it } from 'vitest';
import { createRuntimeStore } from './store';

describe('RuntimeStore', () => {
  it('updates context and notifies subscribers', () => {
    const store = createRuntimeStore({ initialContext: { environment: 'development' } });
    const seen: string[] = [];
    store.subscribe((ctx) => seen.push(ctx.environment));

    store.setContext({ environment: 'staging' });

    expect(store.getContext().environment).toBe('staging');
    expect(seen).toContain('staging');
  });

  it('emits session transitions', () => {
    const store = createRuntimeStore();
    const events: string[] = [];
    store.eventBus.subscribe((event) => {
      if (event.type === 'session.transition') events.push(String(event.metadata?.to));
    });

    store.setSession('authenticated');

    expect(store.getContext().session).toBe('authenticated');
    expect(events).toEqual(['authenticated']);
  });

  it('skips duplicate session updates', () => {
    const store = createRuntimeStore({ initialContext: { session: 'authenticated' } });
    let count = 0;
    store.eventBus.subscribe((event) => {
      if (event.type === 'session.transition') count += 1;
    });

    store.setSession('authenticated');

    expect(count).toBe(0);
  });

  it('emits runtime.mounted on mount()', () => {
    const store = createRuntimeStore();
    let mounted = false;
    store.eventBus.subscribe((event) => {
      if (event.type === 'runtime.mounted') mounted = true;
    });

    store.mount();
    expect(mounted).toBe(true);
  });
});
