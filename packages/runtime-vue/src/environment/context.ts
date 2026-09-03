import { inject, provide, type InjectionKey, type Ref, ref } from 'vue';
import type { Environment } from '@larose-ui/core';

export const ENVIRONMENT_KEY: InjectionKey<Ref<Environment>> = Symbol('larose-environment');

export function provideEnvironment(environment: Environment = 'development'): Ref<Environment> {
  const value = ref(environment);
  provide(ENVIRONMENT_KEY, value);
  return value;
}

export function useEnvironment(): Environment {
  return (inject(ENVIRONMENT_KEY, null) ?? ref<Environment>('development')).value;
}
