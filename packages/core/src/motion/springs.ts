import type { SpringConfig, SpringPresetName, SpringState } from './types';

/** Apple-inspired spring presets — tuned for UI hierarchy. */
export const SPRING_PRESETS: Record<SpringPresetName, SpringConfig> = {
  /** Small UI feedback — buttons, toggles. */
  responsive: { stiffness: 380, damping: 32, mass: 1 },
  /** Snappy menus, dropdowns. */
  snappy: { stiffness: 320, damping: 28, mass: 1 },
  /** Modal / dialog entrance. */
  smooth: { stiffness: 220, damping: 26, mass: 1 },
  /** Drawer, sheet movement. */
  gentle: { stiffness: 180, damping: 24, mass: 1 },
  /** Playful emphasis — use sparingly. */
  bouncy: { stiffness: 260, damping: 18, mass: 1 },
};

export function getSpringPreset(name: SpringPresetName): SpringConfig {
  return { ...SPRING_PRESETS[name] };
}

/**
 * Advance a spring simulation by one timestep (seconds).
 * Uses implicit Euler integration — stable for UI frame rates.
 */
export function stepSpring(
  state: SpringState,
  target: number,
  config: SpringConfig,
  deltaTime: number,
): SpringState {
  const mass = config.mass ?? 1;
  const stiffness = config.stiffness;
  const damping = config.damping;

  const displacement = state.value - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const velocity = state.velocity + acceleration * deltaTime;
  const value = state.value + velocity * deltaTime;

  return { value, velocity };
}

/** Returns true when the spring has settled near the target. */
export function isSpringSettled(
  state: SpringState,
  target: number,
  precision = 0.001,
  velocityPrecision = 0.01,
): boolean {
  return (
    Math.abs(state.value - target) < precision &&
    Math.abs(state.velocity) < velocityPrecision
  );
}

/**
 * Animate a spring to completion over discrete steps.
 * Useful for tests and non-RAF environments.
 */
export function animateSpringToTarget(
  from: number,
  target: number,
  config: SpringConfig,
  options: { velocity?: number; maxSteps?: number; deltaTime?: number } = {},
): SpringState {
  const maxSteps = options.maxSteps ?? 600;
  const deltaTime = options.deltaTime ?? 1 / 60;
  let state: SpringState = { value: from, velocity: options.velocity ?? 0 };

  for (let i = 0; i < maxSteps; i++) {
    state = stepSpring(state, target, config, deltaTime);
    if (isSpringSettled(state, target)) break;
  }

  return state;
}

/** Approximate spring response time in seconds (for duration hints). */
export function springResponseTime(config: SpringConfig): number {
  const mass = config.mass ?? 1;
  const omega = Math.sqrt(config.stiffness / mass);
  const zeta = config.damping / (2 * Math.sqrt(config.stiffness * mass));
  if (zeta < 1) {
    return (2 * Math.PI) / (omega * Math.sqrt(1 - zeta * zeta));
  }
  return 4 / (zeta * omega);
}
