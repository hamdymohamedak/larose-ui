import { describe, expect, it } from 'vitest';
import {
  createInitialQueryState,
  isQueryEmpty,
  queryReducer,
} from './query';
import { createInitialMutationState, mutationReducer } from './mutation';

describe('queryReducer', () => {
  it('transitions through load → success', () => {
    let state = createInitialQueryState<string[]>();
    state = queryReducer(state, { type: 'LOAD' });
    expect(state.status).toBe('loading');
    state = queryReducer(state, { type: 'SUCCESS', data: ['a'] });
    expect(state).toEqual({
      status: 'success',
      data: ['a'],
      error: null,
      retryCount: 0,
    });
  });

  it('detects empty results', () => {
    expect(isQueryEmpty('success', [])).toBe(true);
    expect(isQueryEmpty('success', ['x'])).toBe(false);
    expect(isQueryEmpty('loading', [])).toBe(false);
  });
});

describe('mutationReducer', () => {
  it('resets after success', () => {
    let state = createInitialMutationState<string, { id: string }>();
    state = mutationReducer(state, { type: 'SUBMIT', variables: { id: '1' } });
    state = mutationReducer(state, { type: 'SUCCESS', data: 'ok' });
    expect(state.status).toBe('success');
    state = mutationReducer(state, { type: 'RESET' });
    expect(state.status).toBe('idle');
  });
});
