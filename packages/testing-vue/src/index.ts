export {
  defaultTestMatrix,
  resolveMatrixOptions,
} from '@larose-ui/testing-core';
export type {
  TestMatrixScenario,
  TestMatrixCase,
  TestMatrixOptions,
} from '@larose-ui/testing-core';

/** @deprecated Prefer mounting with app LaRoseProvider + matrix options from testing-core. */
export { resolveMatrixOptions as resolveVueMatrixOptions } from '@larose-ui/testing-core';
