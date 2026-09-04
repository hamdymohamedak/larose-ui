import { GENERATED_STORY_TITLE_CROSS_FRAMEWORK } from './titleRegistry.generated';

/**
 * Map Storybook `title` → cross-framework registry id when a story
 * hasn't set `parameters.laRose.crossFramework` explicitly.
 *
 * Only single-primary-component titles belong here. Multi-component
 * story files must set `parameters.laRose.crossFramework` per story.
 *
 * Auto-discovered titles live in `titleRegistry.generated.ts`.
 */
export const STORY_TITLE_CROSS_FRAMEWORK: Record<string, string> = {
  ...GENERATED_STORY_TITLE_CROSS_FRAMEWORK,
  'Foundation/Badge': 'badge',
  'Foundation/Button': 'button',
  'Foundation/Card': 'card',
  'Foundation/Checkbox': 'checkbox',
  'Foundation/Input': 'input',
  'Foundation/Notice': 'alert',
  'Foundation/Progress': 'progress',
  'Foundation/Radio': 'radio',
  'Foundation/Select': 'select',
  'Foundation/Spinner': 'spinner',
  'Foundation/Switch': 'switch',
  'Foundation/Textarea': 'textarea',
  'Foundation/Skeleton': 'skeleton',
  'Foundation/EmptyState': 'emptyState',
  'Foundation/Modal': 'modal',
  'Foundation/Dialog': 'dialog',
  'Foundation/Drawer': 'drawer',
  'Foundation/Chart': 'chart',
  'Foundation/Tooltip': 'tooltip',
  'Foundation/Alert': 'alertDialog',
  'Foundation/CommandPalette': 'commandPalette',
  'Glass/LiquidGlass/Button': 'liquidGlassButton',
  'Glass/LiquidGlass/Surface': 'liquidGlass',
  'Glass/LiquidGlass/Controls': 'liquidGlassSwitch',
  'Glass/LiquidGlass TabBar': 'liquidGlassTabBar',
  'Glass/LiquidGlass/TopBar': 'liquidGlassTopBar',
  'Glass/Lens Lab': 'liquidGlass',
};

export function crossFrameworkIdFromTitle(title: string | undefined): string | undefined {
  if (!title) return undefined;
  return STORY_TITLE_CROSS_FRAMEWORK[title];
}
