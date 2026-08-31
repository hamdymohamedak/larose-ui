import type { ThemeMode } from '@larose-ui/core';
import {
  alertDialogTokensToCSSVariables,
  getAlertDialogTokens,
  type AlertDialogTokens,
} from './alert-dialog-tokens';
import {
  buttonTokensToCSSVariables,
  getButtonTokens,
  type ButtonTokens,
} from './button-tokens';
import {
  cardTokensToCSSVariables,
  getCardTokens,
  type CardTokens,
} from './card-tokens';
import {
  dataEntryTokensToCSSVariables,
  getDataEntryTokens,
  type DataEntryTokens,
} from './data-entry-tokens';
import {
  drawerTokensToCSSVariables,
  getDrawerTokens,
  type DrawerTokens,
} from './drawer-tokens';
import {
  getModalTokens,
  modalTokensToCSSVariables,
  type ModalTokens,
} from './modal-tokens';
import {
  getPickerTokens,
  pickerTokensToCSSVariables,
  type PickerTokens,
} from './picker-tokens';
import {
  getPopoverTokens,
  popoverTokensToCSSVariables,
  type PopoverTokens,
} from './popover-tokens';

export interface ComponentTokenRegistryEntry<TTokens> {
  get: (mode: ThemeMode) => TTokens;
  toCSS: (tokens: TTokens) => Record<string, string>;
}

export type ComponentTokenMap = {
  Button: ButtonTokens;
  Input: DataEntryTokens;
  Card: CardTokens;
  Modal: ModalTokens;
  Drawer: DrawerTokens;
  Popover: PopoverTokens;
  Dialog: AlertDialogTokens;
  Picker: PickerTokens;
};

export type CustomizableComponentName = keyof ComponentTokenMap;

export const COMPONENT_TOKEN_REGISTRY: {
  [K in CustomizableComponentName]: ComponentTokenRegistryEntry<ComponentTokenMap[K]>;
} = {
  Button: {
    get: getButtonTokens,
    toCSS: buttonTokensToCSSVariables,
  },
  Input: {
    get: getDataEntryTokens,
    toCSS: dataEntryTokensToCSSVariables,
  },
  Card: {
    get: getCardTokens,
    toCSS: cardTokensToCSSVariables,
  },
  Modal: {
    get: getModalTokens,
    toCSS: modalTokensToCSSVariables,
  },
  Drawer: {
    get: getDrawerTokens,
    toCSS: drawerTokensToCSSVariables,
  },
  Popover: {
    get: getPopoverTokens,
    toCSS: popoverTokensToCSSVariables,
  },
  Dialog: {
    get: getAlertDialogTokens,
    toCSS: alertDialogTokensToCSSVariables,
  },
  Picker: {
    get: getPickerTokens,
    toCSS: pickerTokensToCSSVariables,
  },
};

export type ComponentTokenOverrides = {
  [K in CustomizableComponentName]?: Partial<ComponentTokenMap[K]>;
};

export function resolveComponentTokenCSSVariables(
  mode: ThemeMode,
  overrides?: ComponentTokenOverrides,
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, entry] of Object.entries(COMPONENT_TOKEN_REGISTRY)) {
    const componentName = name as CustomizableComponentName;
    const base = entry.get(mode);
    const merged = {
      ...base,
      ...(overrides?.[componentName] ?? {}),
    };
    Object.assign(vars, entry.toCSS(merged as never));
  }

  return vars;
}
