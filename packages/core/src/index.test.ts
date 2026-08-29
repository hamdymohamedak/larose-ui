import { describe, expect, it } from 'vitest';
import {
  classifyHttpError,
  createAsyncStateMachine,
  resolveUIState,
  warnDeprecation,
  resetDeprecationWarnings,
} from './index';

describe('classifyHttpError', () => {
  it('classifies 403 as non-retryable', () => {
    const error = classifyHttpError(403);
    expect(error.message).toContain('permission');
    expect(error.retryable).toBe(false);
  });

  it('classifies 429 as retryable', () => {
    const error = classifyHttpError(429);
    expect(error.retryable).toBe(true);
  });
});

describe('createAsyncStateMachine', () => {
  it('transitions idle → loading → success', () => {
    const machine = createAsyncStateMachine<string>();
    expect(machine.state).toBe('idle');

    machine.send({ type: 'START' });
    expect(machine.state).toBe('loading');

    machine.send({ type: 'SUCCESS', data: 'done' });
    expect(machine.state).toBe('success');
    expect(machine.data).toBe('done');
  });

  it('transitions to error and retry', () => {
    const machine = createAsyncStateMachine();
    machine.send({ type: 'START' });
    machine.send({ type: 'ERROR', error: 'fail' });
    expect(machine.state).toBe('error');

    machine.send({ type: 'RETRY' });
    expect(machine.state).toBe('retrying');
    expect(machine.retryCount).toBe(1);
  });
});

describe('resolveUIState', () => {
  it('prioritizes explicit state', () => {
    expect(resolveUIState({ state: 'empty', loading: true })).toBe('empty');
  });

  it('derives loading from prop', () => {
    expect(resolveUIState({ loading: true })).toBe('loading');
  });
});

describe('warnDeprecation', () => {
  it('warns once per id in non-production', () => {
    resetDeprecationWarnings();
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecation('test-id', 'deprecated API', 'new API');
    warnDeprecation('test-id', 'deprecated API', 'new API');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
