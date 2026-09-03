import { describe, expect, it } from 'vitest';
import * as runtimeSvelte from './index';

describe('@larose-ui/runtime-svelte', () => {
  it('exports providers and AdaptiveTable', () => {
    expect(runtimeSvelte.AdaptiveTable).toBeTruthy();
    expect(runtimeSvelte.ResponsiveProvider).toBeTruthy();
    expect(runtimeSvelte.EnvironmentProvider).toBeTruthy();
    expect(runtimeSvelte.RuntimeProvider).toBeTruthy();
    expect(typeof runtimeSvelte.createRuntimeStore).toBe('function');
  });
});
