import type { ApiError, AsyncState } from '@larose-ui/core';

export interface MutationState<TData, TVariables> {
  status: AsyncState;
  data: TData | null;
  error: ApiError | null;
  variables: TVariables | null;
}

export type MutationAction<TData, TVariables> =
  | { type: 'SUBMIT'; variables: TVariables }
  | { type: 'SUCCESS'; data: TData }
  | { type: 'ERROR'; error: ApiError }
  | { type: 'RESET' };

export function mutationReducer<TData, TVariables>(
  state: MutationState<TData, TVariables>,
  action: MutationAction<TData, TVariables>,
): MutationState<TData, TVariables> {
  switch (action.type) {
    case 'SUBMIT':
      return { ...state, status: 'submitting', error: null, variables: action.variables };
    case 'SUCCESS':
      return { status: 'success', data: action.data, error: null, variables: state.variables };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return { status: 'idle', data: null, error: null, variables: null };
    default:
      return state;
  }
}

export function createInitialMutationState<TData, TVariables>(): MutationState<TData, TVariables> {
  return { status: 'idle', data: null, error: null, variables: null };
}
