import { useMemo, type CSSProperties } from 'react';
import type { ComponentMotionOverride } from '@larose-ui/themes';
import { useMotion, useSkipMotion } from '../Motion/MotionContext';
import { useThemeCustomization } from './ThemeCustomizationContext';

type MotionComponentName = 'Modal' | 'Drawer' | 'Popover' | 'Collapse' | 'Toast';

export interface ResolvedComponentMotion {
  motionEnabled: boolean;
  style?: CSSProperties;
}

function formatDuration(duration: number | string): string {
  return typeof duration === 'number' ? `${duration}ms` : duration;
}

/**
 * Resolve component-level motion overrides on top of global motion settings.
 */
export function useComponentMotion(
  component: MotionComponentName,
  motionProp?: ComponentMotionOverride,
): ResolvedComponentMotion {
  const skipMotion = useSkipMotion();
  const { motionEnabled } = useMotion();
  const { components } = useThemeCustomization();

  return useMemo(() => {
    const configured = components[component]?.motion;
    const duration = motionProp?.duration ?? configured?.duration;

    const style = duration
      ? ({
          '--lr-motion-duration-enter': formatDuration(duration),
          '--lr-motion-duration-exit': formatDuration(duration),
        } as CSSProperties)
      : undefined;

    return {
      motionEnabled: motionEnabled && !skipMotion,
      style,
    };
  }, [component, components, motionEnabled, motionProp, skipMotion]);
}
