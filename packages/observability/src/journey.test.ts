import { describe, expect, it, beforeEach } from 'vitest';
import { resetJourneyStepIds, runtimeEventToJourneyStep, uiEventToJourneyStep } from './journey';

describe('journey', () => {
  beforeEach(() => {
    resetJourneyStepIds();
  });

  it('maps UI events to journey steps', () => {
    const step = uiEventToJourneyStep(
      { type: 'form.opened', component: 'employee-create', timestamp: 1000 },
      { tenant: 'acme', session: 'authenticated' },
    );

    expect(step.kind).toBe('ui.form');
    expect(step.component).toBe('employee-create');
    expect(step.context?.tenant).toBe('acme');
  });

  it('maps runtime network transitions', () => {
    const step = runtimeEventToJourneyStep(
      {
        type: 'network.transition',
        timestamp: 2000,
        metadata: { from: 'fast', to: 'failed' },
      },
      { network: 'failed' },
    );

    expect(step?.kind).toBe('runtime.network');
    expect(step?.label).toContain('failed');
  });
});
