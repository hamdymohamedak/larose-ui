import type { Density, ThemeMode } from '@larose-ui/core';
import { buttonTokensToCSSVariables, getButtonTokens } from './button-tokens';
import { chartTokensToCSSVariables, getChartTokens } from './chart-tokens';
import { dragDropTokensToCSSVariables, getDragDropTokens } from './drag-drop-tokens';
import { dataEntryTokensToCSSVariables, getDataEntryTokens } from './data-entry-tokens';
import { fileManagementTokensToCSSVariables, getFileManagementTokens } from './file-management-tokens';
import { imageViewTokensToCSSVariables, getImageViewTokens } from './image-view-tokens';
import { textViewTokensToCSSVariables, getTextViewTokens } from './text-view-tokens';
import { boxTokensToCSSVariables, getBoxTokens } from './box-tokens';
import { collectionTokensToCSSVariables, getCollectionTokens } from './collection-tokens';
import { columnViewTokensToCSSVariables, getColumnViewTokens } from './column-view-tokens';
import { splitViewTokensToCSSVariables, getSplitViewTokens } from './split-view-tokens';
import { tabViewTokensToCSSVariables, getTabViewTokens } from './tab-view-tokens';
import { disclosureTokensToCSSVariables, getDisclosureTokens } from './disclosure-tokens';
import { labelTokensToCSSVariables, getLabelTokens } from './label-tokens';
import { listTableTokensToCSSVariables, getListTableTokens } from './list-table-tokens';
import { lockupTokensToCSSVariables, getLockupTokens } from './lockup-tokens';
import { pickerTokensToCSSVariables, getPickerTokens } from './picker-tokens';
import { activityViewTokensToCSSVariables, getActivityViewTokens } from './activity-view-tokens';
import { contextMenuTokensToCSSVariables, getContextMenuTokens } from './context-menu-tokens';
import { dockMenuTokensToCSSVariables, getDockMenuTokens } from './dock-menu-tokens';
import { editMenuTokensToCSSVariables, getEditMenuTokens } from './edit-menu-tokens';
import { quickActionsTokensToCSSVariables, getQuickActionsTokens } from './quick-actions-tokens';
import { menuTokensToCSSVariables, getMenuTokens } from './menu-tokens';
import { ornamentTokensToCSSVariables, getOrnamentTokens } from './ornament-tokens';
import { popUpButtonTokensToCSSVariables, getPopUpButtonTokens } from './popup-button-tokens';
import { pullDownButtonTokensToCSSVariables, getPullDownButtonTokens } from './pull-down-button-tokens';
import { menuBarTokensToCSSVariables, getMenuBarTokens } from './menu-bar-tokens';
import { toolbarTokensToCSSVariables, getToolbarTokens } from './toolbar-tokens';
import { pathControlTokensToCSSVariables, getPathControlTokens } from './path-control-tokens';
import { searchFieldTokensToCSSVariables, getSearchFieldTokens } from './search-field-tokens';
import { sidebarTokensToCSSVariables, getSidebarTokens } from './sidebar-tokens';
import { tabBarTokensToCSSVariables, getTabBarTokens } from './tab-bar-tokens';
import { tokenFieldTokensToCSSVariables, getTokenFieldTokens } from './token-field-tokens';
import { alertDialogTokensToCSSVariables, getAlertDialogTokens } from './alert-dialog-tokens';
import { motionTokensToCSSVariables, getMotionTokens } from './motion-tokens';
import { glassTokensToCSSVariables, getGlassTokens } from './glass-tokens';
import { sharingTokensToCSSVariables, getSharingTokens } from './sharing-tokens';
import { cardTokensToCSSVariables, getCardTokens } from './card-tokens';
import { modalTokensToCSSVariables, getModalTokens } from './modal-tokens';
import { drawerTokensToCSSVariables, getDrawerTokens } from './drawer-tokens';
import { popoverTokensToCSSVariables, getPopoverTokens } from './popover-tokens';
import {
  resolveComponentTokenCSSVariables,
  type ComponentTokenOverrides,
} from './component-registry';
import { getRefinedTokenOverrides } from './refined';
import type {
  ColorTokens,
  SurfaceTokens,
  TokenOverrides,
  TokenSet,
  TypographyRoleName,
  TypographyRoles,
} from './token-types';

export type { ColorTokens, SurfaceTokens, TokenOverrides, TokenSet, TypographyRoles };
export { getRefinedTokenOverrides } from './refined';
export {
  COMPONENT_TOKEN_REGISTRY,
  resolveComponentTokenCSSVariables,
  type ComponentTokenOverrides,
  type ComponentTokenMap,
  type CustomizableComponentName,
} from './component-registry';
export { getCardTokens, cardTokensToCSSVariables } from './card-tokens';
export type { CardTokens } from './card-tokens';
export { getModalTokens, modalTokensToCSSVariables } from './modal-tokens';
export type { ModalTokens } from './modal-tokens';
export { getDrawerTokens, drawerTokensToCSSVariables } from './drawer-tokens';
export type { DrawerTokens } from './drawer-tokens';
export { getPopoverTokens, popoverTokensToCSSVariables } from './popover-tokens';
export type { PopoverTokens } from './popover-tokens';
export { getButtonTokens, buttonTokensToCSSVariables } from './button-tokens';
export type { ButtonTokens } from './button-tokens';
export {
  getChartTokens,
  chartTokensToCSSVariables,
  CHART_SERIES_COLORS,
} from './chart-tokens';
export type { ChartTokens } from './chart-tokens';
export { getSharingTokens, sharingTokensToCSSVariables } from './sharing-tokens';
export type { SharingTokens } from './sharing-tokens';
export {
  getDragDropTokens,
  dragDropTokensToCSSVariables,
  DRAG_START_THRESHOLD_PX,
} from './drag-drop-tokens';
export type { DragDropTokens } from './drag-drop-tokens';
export {
  getDataEntryTokens,
  dataEntryTokensToCSSVariables,
} from './data-entry-tokens';
export type { DataEntryTokens } from './data-entry-tokens';
export {
  getFileManagementTokens,
  fileManagementTokensToCSSVariables,
} from './file-management-tokens';
export type { FileManagementTokens } from './file-management-tokens';
export { getImageViewTokens, imageViewTokensToCSSVariables } from './image-view-tokens';
export type { ImageViewTokens } from './image-view-tokens';
export { getTextViewTokens, textViewTokensToCSSVariables } from './text-view-tokens';
export type { TextViewTokens } from './text-view-tokens';
export { getBoxTokens, boxTokensToCSSVariables } from './box-tokens';
export type { BoxTokens } from './box-tokens';
export { getCollectionTokens, collectionTokensToCSSVariables } from './collection-tokens';
export type { CollectionTokens } from './collection-tokens';
export { getColumnViewTokens, columnViewTokensToCSSVariables } from './column-view-tokens';
export type { ColumnViewTokens } from './column-view-tokens';
export { getSplitViewTokens, splitViewTokensToCSSVariables } from './split-view-tokens';
export type { SplitViewTokens } from './split-view-tokens';
export { getTabViewTokens, tabViewTokensToCSSVariables } from './tab-view-tokens';
export type { TabViewTokens } from './tab-view-tokens';
export { getDisclosureTokens, disclosureTokensToCSSVariables } from './disclosure-tokens';
export type { DisclosureTokens } from './disclosure-tokens';
export { getLabelTokens, labelTokensToCSSVariables } from './label-tokens';
export type { LabelTokens } from './label-tokens';
export { getListTableTokens, listTableTokensToCSSVariables } from './list-table-tokens';
export type { ListTableTokens } from './list-table-tokens';
export { getLockupTokens, lockupTokensToCSSVariables } from './lockup-tokens';
export type { LockupTokens } from './lockup-tokens';
export { getPickerTokens, pickerTokensToCSSVariables } from './picker-tokens';
export type { PickerTokens } from './picker-tokens';
export { getActivityViewTokens, activityViewTokensToCSSVariables } from './activity-view-tokens';
export type { ActivityViewTokens } from './activity-view-tokens';
export { getContextMenuTokens, contextMenuTokensToCSSVariables } from './context-menu-tokens';
export type { ContextMenuTokens } from './context-menu-tokens';
export { getDockMenuTokens, dockMenuTokensToCSSVariables } from './dock-menu-tokens';
export type { DockMenuTokens } from './dock-menu-tokens';
export { getEditMenuTokens, editMenuTokensToCSSVariables } from './edit-menu-tokens';
export type { EditMenuTokens } from './edit-menu-tokens';
export {
  getQuickActionsTokens,
  quickActionsTokensToCSSVariables,
  MAX_HOME_SCREEN_QUICK_ACTIONS,
} from './quick-actions-tokens';
export type { QuickActionsTokens } from './quick-actions-tokens';
export { getMenuTokens, menuTokensToCSSVariables } from './menu-tokens';
export type { MenuTokens } from './menu-tokens';
export { getOrnamentTokens, ornamentTokensToCSSVariables, MAX_ORNAMENTS } from './ornament-tokens';
export type { OrnamentTokens } from './ornament-tokens';
export { getPopUpButtonTokens, popUpButtonTokensToCSSVariables } from './popup-button-tokens';
export type { PopUpButtonTokens } from './popup-button-tokens';
export {
  getPullDownButtonTokens,
  pullDownButtonTokensToCSSVariables,
  MIN_PULLDOWN_ITEMS,
} from './pull-down-button-tokens';
export type { PullDownButtonTokens } from './pull-down-button-tokens';
export {
  getMenuBarTokens,
  menuBarTokensToCSSVariables,
  STANDARD_MENU_BAR_ORDER,
} from './menu-bar-tokens';
export type { MenuBarTokens, StandardMenuBarSlot } from './menu-bar-tokens';
export {
  getToolbarTokens,
  toolbarTokensToCSSVariables,
  MAX_TOOLBAR_TITLE_LENGTH,
  MAX_TOOLBAR_GROUPS,
} from './toolbar-tokens';
export type { ToolbarTokens } from './toolbar-tokens';
export { getPathControlTokens, pathControlTokensToCSSVariables } from './path-control-tokens';
export type { PathControlTokens } from './path-control-tokens';
export { getSearchFieldTokens, searchFieldTokensToCSSVariables } from './search-field-tokens';
export type { SearchFieldTokens } from './search-field-tokens';
export { getSidebarTokens, sidebarTokensToCSSVariables } from './sidebar-tokens';
export type { SidebarTokens, SidebarSize } from './sidebar-tokens';
export {
  getTabBarTokens,
  tabBarTokensToCSSVariables,
  MAX_TAB_BAR_ITEMS,
} from './tab-bar-tokens';
export type { TabBarTokens } from './tab-bar-tokens';
export {
  getTokenFieldTokens,
  tokenFieldTokensToCSSVariables,
  DEFAULT_TOKEN_DELIMITERS,
} from './token-field-tokens';
export type { TokenFieldTokens } from './token-field-tokens';
export {
  getAlertDialogTokens,
  alertDialogTokensToCSSVariables,
  MAX_ALERT_BUTTONS,
} from './alert-dialog-tokens';
export type { AlertDialogTokens } from './alert-dialog-tokens';
export { getMotionTokens, motionTokensToCSSVariables, MOTION_PRESET_EASING } from './motion-tokens';
export type { MotionTokens, MotionPresetName } from './motion-tokens';
export { getGlassTokens, glassTokensToCSSVariables } from './glass-tokens';
export type { GlassTokens } from './glass-tokens';

const semanticColors = {
  success: '#34c759',
  warning: '#ff9f0a',
  error: '#ff3b30',
  info: '#5ac8fa',
} as const;

const darkSemanticColors = {
  success: '#30d158',
  warning: '#ffd60a',
  error: '#ff453a',
  info: '#64d2ff',
} as const;

const baseTokens: Omit<TokenSet, 'colors' | 'surfaces' | 'typography'> = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  space: {
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
  },
  radius: {
    sm: '0.4375rem',
    md: '0.5625rem',
    lg: '0.6875rem',
    xl: '0.875rem',
    full: '9999px',
  },
  shadow: {
    none: 'none',
    subtle: '0 1px 2px rgb(0 0 0 / 0.04)',
    sm: '0 1px 2px rgb(0 0 0 / 0.04)',
    md: '0 4px 12px rgb(0 0 0 / 0.06)',
    lg: '0 12px 28px rgb(0 0 0 / 0.08)',
    raised: '0 4px 12px rgb(0 0 0 / 0.06)',
    floating: '0 12px 28px rgb(0 0 0 / 0.08)',
    overlay: '0 24px 48px rgb(0 0 0 / 0.12)',
  },
  duration: {
    instant: '50ms',
    fast: '120ms',
    normal: '220ms',
    slow: '320ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
  },
};

export function mergeTokenOverrides(base: TokenSet, overrides?: TokenOverrides): TokenSet {
  if (!overrides) return base;

  const typography = { ...base.typography };
  if (overrides.typography) {
    for (const [role, spec] of Object.entries(overrides.typography)) {
      if (spec) {
        typography[role as TypographyRoleName] = {
          ...typography[role as TypographyRoleName],
          ...spec,
        };
      }
    }
  }

  return {
    ...base,
    colors: { ...base.colors, ...overrides.colors },
    surfaces: { ...base.surfaces, ...overrides.surfaces },
    typography,
    fontFamily: { ...base.fontFamily, ...overrides.fontFamily },
    fontSize: { ...base.fontSize, ...overrides.fontSize },
    fontWeight: { ...base.fontWeight, ...overrides.fontWeight },
    lineHeight: { ...base.lineHeight, ...overrides.lineHeight },
    space: { ...base.space, ...overrides.space },
    radius: { ...base.radius, ...overrides.radius },
    shadow: { ...base.shadow, ...overrides.shadow },
    duration: { ...base.duration, ...overrides.duration },
    easing: { ...base.easing, ...overrides.easing },
  };
}

function defaultSurfaces(mode: ThemeMode, colors: ColorTokens): SurfaceTokens {
  if (mode === 'dark') {
    return {
      base: '#2c2c2e',
      secondary: '#1c1c1e',
      elevated: '#3a3a3c',
      floating: '#48484a',
      overlay: 'rgb(0 0 0 / 0.55)',
      glassBg: 'rgb(44 44 46 / 0.78)',
      glassBorder: 'rgb(255 255 255 / 0.1)',
      glassBlur: '24px',
      glassSaturation: '180%',
      glassShadow: '0 8px 32px rgb(0 0 0 / 0.35)',
    };
  }

  return {
    base: colors.surface,
    secondary: colors.background,
    elevated: colors.surfaceElevated,
    floating: colors.surfaceElevated,
    overlay: 'rgb(0 0 0 / 0.35)',
    glassBg: 'rgb(255 255 255 / 0.72)',
    glassBorder: 'rgb(0 0 0 / 0.06)',
    glassBlur: '20px',
    glassSaturation: '180%',
    glassShadow: '0 8px 32px rgb(0 0 0 / 0.12)',
  };
}

function createBaseTokenSet(mode: ThemeMode): TokenSet {
  const refined = getRefinedTokenOverrides(mode);
  const semantic = mode === 'dark' ? darkSemanticColors : semanticColors;

  const colors: ColorTokens = {
    primary: '#0071e3',
    primaryHover: '#0077ed',
    primaryActive: '#006edb',
    secondary: '#6e6e73',
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    background: '#f5f5f7',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    border: 'rgb(0 0 0 / 0.08)',
    text: '#1d1d1f',
    textMuted: '#5c5c60',
    textInverse: '#ffffff',
    onAccent: '#ffffff',
    ...(mode === 'dark'
      ? {
          primary: '#0a84ff',
          primaryHover: '#409cff',
          primaryActive: '#0077ed',
          secondary: '#98989d',
          background: '#1c1c1e',
          surface: '#2c2c2e',
          surfaceElevated: '#3a3a3c',
          border: 'rgb(255 255 255 / 0.12)',
          text: '#f5f5f7',
          textMuted: '#98989d',
          textInverse: '#1c1c1e',
          onAccent: '#ffffff',
        }
      : {}),
  };

  return mergeTokenOverrides(
    {
      ...baseTokens,
      colors,
      surfaces: defaultSurfaces(mode, colors),
      typography: refined.typography as TypographyRoles,
    },
    refined,
  );
}

export const densityMultipliers: Record<Density, number> = {
  compact: 0.85,
  comfortable: 1,
  spacious: 1.15,
};

export function getTokens(mode: ThemeMode = 'light'): TokenSet {
  return createBaseTokenSet(mode);
}

export interface TokensToCSSVariablesOptions {
  componentTokenOverrides?: ComponentTokenOverrides;
}

export function tokensToCSSVariables(
  tokens: TokenSet,
  density: Density = 'comfortable',
  mode: ThemeMode = 'light',
  options?: TokensToCSSVariablesOptions,
): Record<string, string> {
  const multiplier = densityMultipliers[density];
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars[`--lr-color-${cssKey}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.surfaces)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars[`--lr-surface-${cssKey}`] = value;
  }

  for (const [role, spec] of Object.entries(tokens.typography)) {
    vars[`--lr-type-${role}-size`] = spec.fontSize;
    vars[`--lr-type-${role}-weight`] = spec.fontWeight;
    vars[`--lr-type-${role}-line-height`] = spec.lineHeight;
    vars[`--lr-type-${role}-letter-spacing`] = spec.letterSpacing;
  }

  vars['--lr-font-family-sans'] = tokens.fontFamily.sans;
  vars['--lr-font-family-mono'] = tokens.fontFamily.mono;

  for (const [key, value] of Object.entries(tokens.fontSize)) {
    vars[`--lr-font-size-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.fontWeight)) {
    vars[`--lr-font-weight-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.lineHeight)) {
    vars[`--lr-line-height-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.space)) {
    const num = parseFloat(value);
    const unit = value.replace(String(num), '');
    vars[`--lr-space-${key}`] = `${num * multiplier}${unit}`;
  }

  for (const [key, value] of Object.entries(tokens.radius)) {
    vars[`--lr-radius-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.shadow)) {
    vars[`--lr-shadow-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.duration)) {
    vars[`--lr-duration-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.easing)) {
    vars[`--lr-easing-${key}`] = value;
  }

  Object.assign(vars, buttonTokensToCSSVariables(getButtonTokens(mode)));
  Object.assign(vars, chartTokensToCSSVariables(getChartTokens(mode)));
  Object.assign(vars, sharingTokensToCSSVariables(getSharingTokens(mode)));
  Object.assign(vars, dragDropTokensToCSSVariables(getDragDropTokens(mode)));
  Object.assign(vars, dataEntryTokensToCSSVariables(getDataEntryTokens(mode)));
  Object.assign(vars, fileManagementTokensToCSSVariables(getFileManagementTokens(mode)));
  Object.assign(vars, imageViewTokensToCSSVariables(getImageViewTokens(mode)));
  Object.assign(vars, textViewTokensToCSSVariables(getTextViewTokens(mode)));
  Object.assign(vars, boxTokensToCSSVariables(getBoxTokens(mode)));
  Object.assign(vars, collectionTokensToCSSVariables(getCollectionTokens(mode)));
  Object.assign(vars, columnViewTokensToCSSVariables(getColumnViewTokens(mode)));
  Object.assign(vars, splitViewTokensToCSSVariables(getSplitViewTokens(mode)));
  Object.assign(vars, tabViewTokensToCSSVariables(getTabViewTokens(mode)));
  Object.assign(vars, disclosureTokensToCSSVariables(getDisclosureTokens(mode)));
  Object.assign(vars, labelTokensToCSSVariables(getLabelTokens(mode)));
  Object.assign(vars, listTableTokensToCSSVariables(getListTableTokens(mode)));
  Object.assign(vars, lockupTokensToCSSVariables(getLockupTokens(mode)));
  Object.assign(vars, pickerTokensToCSSVariables(getPickerTokens(mode)));
  Object.assign(vars, activityViewTokensToCSSVariables(getActivityViewTokens(mode)));
  Object.assign(vars, contextMenuTokensToCSSVariables(getContextMenuTokens(mode)));
  Object.assign(vars, dockMenuTokensToCSSVariables(getDockMenuTokens(mode)));
  Object.assign(vars, editMenuTokensToCSSVariables(getEditMenuTokens(mode)));
  Object.assign(vars, quickActionsTokensToCSSVariables(getQuickActionsTokens(mode)));
  Object.assign(vars, menuTokensToCSSVariables(getMenuTokens(mode)));
  Object.assign(vars, ornamentTokensToCSSVariables(getOrnamentTokens(mode)));
  Object.assign(vars, popUpButtonTokensToCSSVariables(getPopUpButtonTokens(mode)));
  Object.assign(vars, pullDownButtonTokensToCSSVariables(getPullDownButtonTokens(mode)));
  Object.assign(vars, menuBarTokensToCSSVariables(getMenuBarTokens(mode)));
  Object.assign(vars, toolbarTokensToCSSVariables(getToolbarTokens(mode)));
  Object.assign(vars, pathControlTokensToCSSVariables(getPathControlTokens(mode)));
  Object.assign(vars, searchFieldTokensToCSSVariables(getSearchFieldTokens(mode)));
  Object.assign(vars, sidebarTokensToCSSVariables(getSidebarTokens(mode)));
  Object.assign(vars, tabBarTokensToCSSVariables(getTabBarTokens(mode)));
  Object.assign(vars, tokenFieldTokensToCSSVariables(getTokenFieldTokens(mode)));
  Object.assign(vars, alertDialogTokensToCSSVariables(getAlertDialogTokens(mode)));
  Object.assign(vars, motionTokensToCSSVariables(getMotionTokens(mode)));
  Object.assign(vars, glassTokensToCSSVariables(getGlassTokens(mode)));
  Object.assign(vars, cardTokensToCSSVariables(getCardTokens(mode)));
  Object.assign(vars, modalTokensToCSSVariables(getModalTokens(mode)));
  Object.assign(vars, drawerTokensToCSSVariables(getDrawerTokens(mode)));
  Object.assign(vars, popoverTokensToCSSVariables(getPopoverTokens(mode)));

  if (options?.componentTokenOverrides) {
    Object.assign(
      vars,
      resolveComponentTokenCSSVariables(mode, options.componentTokenOverrides),
    );
  }

  vars['--lr-density-multiplier'] = String(multiplier);

  return vars;
}

export interface ApplyThemeOptions {
  mode: ThemeMode;
  density?: Density;
  tokenOverrides?: TokenOverrides;
  brandColors?: Partial<ColorTokens>;
  componentTokenOverrides?: ComponentTokenOverrides;
  presetId?: string;
  /**
   * Mirror tokens onto `document.documentElement` so portaled overlays
   * (menus, dialogs, toasts) inherit the active theme. Defaults to true.
   */
  syncDocument?: boolean;
}

export function resolveThemeCSSVariables(options: ApplyThemeOptions): Record<string, string> {
  const density = options.density ?? 'comfortable';
  let tokens = getTokens(options.mode);

  if (options.tokenOverrides) {
    tokens = mergeTokenOverrides(tokens, options.tokenOverrides);
  }

  if (options.brandColors) {
    tokens = {
      ...tokens,
      colors: { ...tokens.colors, ...options.brandColors },
    };
  }

  return tokensToCSSVariables(tokens, density, options.mode, {
    componentTokenOverrides: options.componentTokenOverrides,
  });
}

function writeThemeToElement(element: HTMLElement, options: ApplyThemeOptions): void {
  const density = options.density ?? 'comfortable';
  const vars = resolveThemeCSSVariables(options);

  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }

  element.dataset.lrTheme = options.mode;
  element.dataset.lrDensity = density;
  element.style.colorScheme = options.mode;

  if (options.presetId) {
    element.dataset.lrThemePreset = options.presetId;
  }
}

export function applyResolvedTheme(element: HTMLElement, options: ApplyThemeOptions): void {
  writeThemeToElement(element, options);

  if (options.syncDocument === false || typeof document === 'undefined') return;

  const root = document.documentElement;
  if (element !== root) {
    writeThemeToElement(root, options);
  }
}

export function applyTokensToElement(
  element: HTMLElement,
  mode: ThemeMode = 'light',
  density: Density = 'comfortable',
  brandOverrides?: Partial<ColorTokens>,
): void {
  applyResolvedTheme(element, {
    mode,
    density,
    brandColors: brandOverrides,
  });
}

export function createTenantTheme(
  tenantId: string,
  brandColors: Partial<ColorTokens>,
): { tenantId: string; colors: Partial<ColorTokens> } {
  return { tenantId, colors: brandColors };
}
