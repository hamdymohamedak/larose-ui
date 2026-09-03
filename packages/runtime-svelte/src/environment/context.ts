import { getContext, setContext } from 'svelte';
import type { Environment } from '@larose-ui/core';

export const ENVIRONMENT_CONTEXT = 'larose-environment';

export function setEnvironmentContext(environment: Environment): void {
  setContext(ENVIRONMENT_CONTEXT, environment);
}

export function getEnvironment(): Environment {
  try {
    return getContext<Environment | undefined>(ENVIRONMENT_CONTEXT) ?? 'development';
  } catch {
    return 'development';
  }
}
