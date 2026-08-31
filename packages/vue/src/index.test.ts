import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from './components/Badge/Badge.vue';
import Button from './components/Button/Button.vue';
import LaRoseProvider from './provider/LaRoseProvider.vue';

describe('Badge', () => {
  it('renders slot content', () => {
    const wrapper = mount(Badge, {
      slots: { default: 'New' },
    });
    expect(wrapper.text()).toBe('New');
    expect(wrapper.attributes('data-variant')).toBe('default');
  });
});

describe('Button', () => {
  it('renders primary button', () => {
    const wrapper = mount(Button, {
      global: { components: { LaRoseProvider } },
      props: { variant: 'primary' },
      slots: { default: 'Save' },
    });
    expect(wrapper.text()).toContain('Save');
    expect(wrapper.attributes('data-variant')).toBe('primary');
  });

  it('sets loading state', () => {
    const wrapper = mount(Button, {
      props: { loading: true, loadingLabel: 'Saving…' },
      slots: { default: 'Save' },
    });
    expect(wrapper.attributes('data-state')).toBe('loading');
    expect(wrapper.attributes('aria-busy')).toBe('true');
  });
});

describe('LaRoseProvider', () => {
  it('applies provider root marker', () => {
    const wrapper = mount(LaRoseProvider, {
      slots: { default: '<span>child</span>' },
    });
    expect(wrapper.find('[data-lr-provider]').exists()).toBe(true);
  });
});
