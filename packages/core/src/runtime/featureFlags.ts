import type { Environment } from '../index';
import type { FeatureFlagResult } from './types';

export interface FeatureFlagEvaluationContext {
  userId?: string;
  tenantId?: string;
  organizationId?: string;
  environment?: Environment;
  attributes?: Record<string, unknown>;
}

export interface FeatureFlagEvaluator {
  evaluate(name: string, context: FeatureFlagEvaluationContext): FeatureFlagResult;
}

export type StaticFeatureFlagValue = boolean | 'loading';

export interface PercentageRolloutConfig {
  enabled: boolean;
  percentage?: number;
  loading?: boolean;
}

function hashToPercent(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

export function createStaticFeatureFlagEvaluator(
  flags: Record<string, StaticFeatureFlagValue>,
  loading = false,
): FeatureFlagEvaluator {
  return {
    evaluate(name) {
      const value = flags[name];
      if (value === 'loading' || loading) {
        return { enabled: false, loading: true };
      }
      if (value === true) {
        return { enabled: true, loading: false };
      }
      return {
        enabled: false,
        loading: false,
        reason: value === false ? 'disabled' : 'unknown flag',
      };
    },
  };
}

export function createPercentageRolloutEvaluator(
  config: Record<string, PercentageRolloutConfig>,
): FeatureFlagEvaluator {
  return {
    evaluate(name, context) {
      const entry = config[name];
      if (!entry) {
        return { enabled: false, loading: false, reason: 'unknown flag' };
      }
      if (entry.loading) {
        return { enabled: false, loading: true };
      }
      if (!entry.enabled) {
        return { enabled: false, loading: false, reason: 'disabled' };
      }
      const percentage = entry.percentage ?? 100;
      if (percentage >= 100) {
        return { enabled: true, loading: false };
      }
      if (percentage <= 0) {
        return { enabled: false, loading: false, reason: 'rollout 0%' };
      }
      const bucketKey = `${context.userId ?? 'anonymous'}:${context.tenantId ?? 'default'}:${name}`;
      const bucket = hashToPercent(bucketKey);
      const enabled = bucket < percentage;
      return {
        enabled,
        loading: false,
        reason: enabled ? undefined : `rollout ${percentage}%`,
        variant: enabled ? 'treatment' : 'control',
      };
    },
  };
}

export function createCompositeFeatureFlagEvaluator(
  evaluators: FeatureFlagEvaluator[],
): FeatureFlagEvaluator {
  return {
    evaluate(name, context) {
      for (const evaluator of evaluators) {
        const result = evaluator.evaluate(name, context);
        if (result.loading || result.enabled || result.reason !== 'unknown flag') {
          return result;
        }
      }
      return { enabled: false, loading: false, reason: 'unknown flag' };
    },
  };
}
