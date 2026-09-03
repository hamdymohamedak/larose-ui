import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import {
  createEventCollector,
  createNoopAdapter,
} from '@larose-ui/observability-core';
import ObservabilityProvider from './ObservabilityProvider.vue';
import ObservedForm from './ObservedForm.vue';
import ObservedComponent from './ObservedComponent.vue';
import { useObservability } from './context';

describe('observability-vue', () => {
  it('tracks form opened on mount', async () => {
    const collector = createEventCollector();
    mount({
      setup() {
        return () =>
          h(
            ObservabilityProvider,
            { collector },
            {
              default: () =>
                h(ObservedForm, { name: 'test-form' }, {
                  default: () => h('input', { name: 'email' }),
                }),
            },
          );
      },
    });

    await nextTick();
    expect(collector.getFormFunnelMetrics('test-form').opens).toBe(1);
  });

  it('tracks field focus', async () => {
    const collector = createEventCollector();
    const wrapper = mount({
      setup() {
        return () =>
          h(
            ObservabilityProvider,
            { collector },
            {
              default: () =>
                h(ObservedForm, { name: 'test-form' }, {
                  default: () =>
                    h('input', { name: 'email', 'aria-label': 'Email' }),
                }),
            },
          );
      },
    });

    await wrapper.find('input').trigger('focusin');
    expect(collector.getEvents({ type: 'form.field_focused' })).toHaveLength(1);
  });

  it('tracks performance on ObservedComponent mount', async () => {
    const collector = createEventCollector();
    mount({
      setup() {
        return () =>
          h(
            ObservabilityProvider,
            { collector },
            {
              default: () =>
                h(ObservedComponent, { name: 'SlowTable' }, {
                  default: () => h('div', 'Content'),
                }),
            },
          );
      },
    });

    await nextTick();
    expect(collector.getEvents({ type: 'performance' })).toHaveLength(1);
  });

  it('exposes useObservability inside provider', () => {
    const collector = createEventCollector();
    let tracked = false;
    const Child = defineComponent({
      setup() {
        const { track } = useObservability();
        track({ type: 'interaction', component: 'child' });
        tracked = true;
        return () => null;
      },
    });

    mount({
      setup() {
        return () =>
          h(ObservabilityProvider, { collector }, { default: () => h(Child) });
      },
    });

    expect(tracked).toBe(true);
    expect(collector.getEvents({ type: 'interaction' })).toHaveLength(1);
  });

  it('resets collector when tenant scope changes', async () => {
    const collector = createEventCollector({ tenantId: 'tenant-a', userId: 'user-a' });
    collector.track({ type: 'interaction', component: 'btn' });
    expect(collector.getEvents()).toHaveLength(1);

    const wrapper = mount(ObservabilityProvider, {
      props: { collector, tenantId: 'tenant-a', userId: 'user-a' },
      slots: { default: () => h('span', 'app') },
    });

    await wrapper.setProps({ tenantId: 'tenant-b', userId: 'user-a' });
    expect(collector.getEvents()).toHaveLength(0);
  });

  it('uses adapter when tracking', () => {
    const adapter = createNoopAdapter();
    const track = vi.spyOn(adapter, 'track');
    const collector = createEventCollector({ adapter });

    mount(ObservabilityProvider, {
      props: { collector },
      slots: { default: () => h('span') },
    });

    collector.track({ type: 'interaction', component: 'btn' });
    expect(track).toHaveBeenCalled();
  });
});
