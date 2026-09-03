import { describe, expect, it } from 'vitest';
import * as runtimeVue from './index';

describe('@larose-ui/runtime-vue', () => {
  it('exports providers and AdaptiveTable', () => {
    expect(runtimeVue.AdaptiveTable).toBeTruthy();
    expect(runtimeVue.ResponsiveProvider).toBeTruthy();
    expect(runtimeVue.EnvironmentProvider).toBeTruthy();
    expect(runtimeVue.RuntimeProvider).toBeTruthy();
    expect(typeof runtimeVue.createRuntimeStore).toBe('function');
  });
});
