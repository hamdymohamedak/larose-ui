import { getContext, setContext } from 'svelte';
import {
  detectPlatform,
  matchKeyboardEvent,
  shouldHandleShortcut,
  type Accelerator,
  type AcceleratorHandler,
  type AcceleratorPlatform,
  type AcceleratorRegistry,
  type AcceleratorScope,
} from '@larose-ui/core';
import {
  createInitialMenuKeyboardState,
  handleMenuKeyboard,
  resetMenuKeyboardState,
  resolveAcceleratorPlatform,
} from '@larose-ui/primitives';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuBarMenuConfig } from '../MenuBar/types';
import { resolveDynamicMenuEntries } from '../MenuBar/utils';
import { collectGlobalMenuAccelerators } from './collectGlobalMenuAccelerators';

export interface AcceleratorRegistrationOptions {
  id?: string;
  scope?: AcceleratorScope;
  priority?: number;
  allowInEditable?: boolean;
  enabled?: boolean;
}

export interface AcceleratorContextValue {
  registry: AcceleratorRegistry;
  platform: AcceleratorPlatform;
  registerMenuHandler: (id: string, handler: (event: KeyboardEvent) => boolean) => () => void;
  setActiveMenuId: (id: string | null) => void;
}

export const acceleratorKey = Symbol('larose-accelerator');

let registrationCounter = 0;

function nextRegistrationId(prefix: string): string {
  registrationCounter += 1;
  return `${prefix}-${registrationCounter}`;
}

export function setAcceleratorContext(value: AcceleratorContextValue): void {
  setContext(acceleratorKey, value);
}

export function getAcceleratorContext(): AcceleratorContextValue | null {
  return getContext<AcceleratorContextValue | undefined>(acceleratorKey) ?? null;
}

export function registerAccelerator(
  accelerator: Accelerator,
  handler: () => void,
  options: AcceleratorRegistrationOptions = {},
): () => void {
  const context = getAcceleratorContext();
  const enabled = options.enabled ?? true;
  if (!enabled) return () => {};

  const id = options.id ?? nextRegistrationId('accelerator');
  const invoke = () => handler();

  if (context) {
    const entry: AcceleratorHandler = {
      id,
      accelerator,
      handler: invoke,
      scope: options.scope ?? 'global',
      priority: options.priority ?? 0,
      allowInEditable: options.allowInEditable,
      enabled: () => enabled,
    };
    return context.registry.register(entry);
  }

  const platform = detectPlatform();
  const onKeyDown = (event: KeyboardEvent) => {
    if (!matchKeyboardEvent(event, accelerator, { platform })) return;
    if (!shouldHandleShortcut({ allowInEditable: options.allowInEditable, target: event.target })) {
      return;
    }
    event.preventDefault();
    invoke();
  };
  window.addEventListener('keydown', onKeyDown, true);
  return () => window.removeEventListener('keydown', onKeyDown, true);
}

export function registerMenuAccelerator(
  menuId: string,
  handler: (event: KeyboardEvent) => boolean,
  isOpen: boolean,
): () => void {
  const context = getAcceleratorContext();
  if (!context || !isOpen) return () => {};
  context.setActiveMenuId(menuId);
  const unregister = context.registerMenuHandler(menuId, handler);
  return () => {
    unregister();
    context.setActiveMenuId(null);
  };
}

export interface CombinedMenuKeyboardOptions {
  entries: MenuEntry[];
  activeSubmenuId: string | null;
  optionKey?: boolean;
  platform?: ReturnType<typeof resolveAcceleratorPlatform>;
  onSelect: (item: MenuItemConfig) => void;
  onClose: () => void;
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
  mnemonicActive?: boolean;
}

export function createCombinedMenuKeyboard(options: CombinedMenuKeyboardOptions) {
  let keyboardState = createInitialMenuKeyboardState();
  let typeAheadHighlightId: string | null = null;

  const resetTypeAhead = () => {
    keyboardState = resetMenuKeyboardState(keyboardState);
    typeAheadHighlightId = null;
  };

  const handler = (event: KeyboardEvent): boolean => {
    const result = handleMenuKeyboard(event, keyboardState, {
      entries: options.entries,
      activeSubmenuId: options.activeSubmenuId,
      optionKey: options.optionKey,
      platform: options.platform ?? resolveAcceleratorPlatform(),
      enableTypeAhead: options.enableTypeAhead ?? true,
      enableMnemonics: options.enableMnemonics ?? true,
      mnemonicActive: options.mnemonicActive ?? false,
    });
    keyboardState = result.state;
    typeAheadHighlightId = result.state.typeAheadHighlightId;

    if (result.action.type === 'close') {
      options.onClose();
      return false;
    }
    if (result.preventDefault) event.preventDefault();
    if (result.stopPropagation) event.stopPropagation();
    if (result.action.type === 'select') {
      result.action.item.onSelect?.();
      options.onSelect(result.action.item);
      return true;
    }
    return result.preventDefault;
  };

  return {
    handler,
    getTypeAheadHighlightId: () => typeAheadHighlightId,
    resetTypeAhead,
  };
}

export interface MenuBarAcceleratorsOptions {
  menus: MenuBarMenuConfig[];
  optionKey?: boolean;
  enableGlobalShortcuts?: boolean;
  onMenuAction?: (menuId: string, entry: MenuItemConfig) => void;
}

export function registerMenuBarAccelerators(options: MenuBarAcceleratorsOptions): () => void {
  const context = getAcceleratorContext();
  if (!context || options.enableGlobalShortcuts === false) return () => {};

  const unregisters: Array<() => void> = [];
  const optionKey = options.optionKey ?? false;

  for (const menu of options.menus) {
    const prepared = resolveDynamicMenuEntries(prepareMenuEntries(menu.entries), { optionKey });
    const bindings = collectGlobalMenuAccelerators(prepared, { optionKey });
    for (const binding of bindings) {
      const { item, accelerator } = binding;
      unregisters.push(
        context.registry.register({
          id: `menubar-${menu.id}-${item.id}`,
          accelerator,
          scope: 'component',
          priority: 0,
          enabled: () => !item.disabled && typeof item.onSelect === 'function',
          handler: () => {
            if (item.disabled) return;
            options.onMenuAction?.(menu.id, item);
          },
        }),
      );
    }
  }

  return () => {
    for (const unregister of unregisters) unregister();
  };
}

export function handleMenuKeyboardShortcuts(
  event: KeyboardEvent,
  options: {
    entries: MenuEntry[];
    activeSubmenuId: string | null;
    optionKey?: boolean;
    onSelect: (item: MenuItemConfig) => void;
    onClose: () => void;
  },
): boolean {
  const result = handleMenuKeyboard(event, createInitialMenuKeyboardState(), {
    entries: options.entries,
    activeSubmenuId: options.activeSubmenuId,
    optionKey: options.optionKey,
    platform: resolveAcceleratorPlatform(),
    enableTypeAhead: false,
    enableMnemonics: false,
  });
  if (result.action.type === 'close') {
    options.onClose();
    return false;
  }
  if (result.preventDefault) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (result.action.type === 'select') {
    result.action.item.onSelect?.();
    options.onSelect(result.action.item);
    return true;
  }
  return result.preventDefault;
}
