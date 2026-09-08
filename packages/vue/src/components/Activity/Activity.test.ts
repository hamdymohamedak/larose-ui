import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Activity from './Activity.vue';

describe('Activity', () => {
  it('renders stub root', () => {
    const wrapper = mount(Activity, { slots: { default: 'hello' } });
    expect(wrapper.text()).toContain('hello');
  });
});
