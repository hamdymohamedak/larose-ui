import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { createPermissionStore, providePermissions, usePermission } from './context';

describe('permissions-vue', () => {
  it('checks permissions from the store', () => {
    const store = createPermissionStore({ permissions: ['employees.read'] });
    expect(store.check('employees.read').allowed).toBe(true);
    expect(store.check('employees.write').allowed).toBe(false);
  });

  it('usePermission reads provided store', async () => {
    let allowed = false;
    const Child = defineComponent({
      setup() {
        const result = usePermission('billing.view');
        allowed = result.value.allowed;
        return () => null;
      },
    });
    const Root = defineComponent({
      setup() {
        providePermissions(createPermissionStore({ permissions: ['billing.view'] }));
        return () => h(Child);
      },
    });
    const app = createApp(Root);
    const el = document.createElement('div');
    app.mount(el);
    expect(allowed).toBe(true);
    app.unmount();
  });
});
