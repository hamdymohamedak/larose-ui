import { inject, ref, watchEffect, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import {
  createAcceleratorRegistry,
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
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { resolveDynamicMenuEntries } from '../MenuBar/utils';
import type { MenuBarMenuConfig } from '../MenuBar/types';
import { collectGlobalMenuAccelerators } from '../accelerator/collectGlobalMenuAccelerators';

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
  activeMenuId: { current: string | null };
  menuHandlers: Map<string, (event: KeyboardEvent) => boolean>;
}

export const acceleratorKey: InjectionKey<AcceleratorContextValue> = Symbol('larose-accelerator');

let registrationCounter = 0;

function nextRegistrationId(prefix: string): string {
  registrationCounter += 1;
  return `${prefix}-${registrationCounter}`;
}

export function createAcceleratorContextValue(
  platform?: AcceleratorPlatform,
): AcceleratorContextValue {
  const registry = createAcceleratorRegistry();
  const resolvedPlatform = platform ?? detectPlatform();
  const activeMenuId = { current: null as string | null };
  const menuHandlers = new Map<string, (event: KeyboardEvent) => boolean>();

  return {
    registry,
    platform: resolvedPlatform,
    activeMenuId,
    menuHandlers,
    setActiveMenuId(id) {
      activeMenuId.current = id;
    },
    registerMenuHandler(id, handler) {
      menuHandlers.set(id, handler);
      return () => {
        menuHandlers.delete(id);
      };
    },
  };
}

export function useAcceleratorContext(): AcceleratorContextValue | null {
  return inject(acceleratorKey, null);
}

export function useAccelerator(
  accelerator: Accelerator,
  handler: () => void,
  options: AcceleratorRegistrationOptions = {},
): void {
  const context = useAcceleratorContext();
  const handlerRef = ref(handler);
  handlerRef.value = handler;
  const enabled = options.enabled ?? true;
  const id = options.id ?? nextRegistrationId('accelerator');

  watchEffect((onCleanup) => {
    if (!enabled) return;
    const invoke = () => handlerRef.value();

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
      const unregister = context.registry.register(entry);
      onCleanup(() => unregister());
      return;
    }

    const platform = detectPlatform();
    const onKeyDown = (event: KeyboardEvent) => {
      if (!matchKeyboardEvent(event, accelerator, { platform })) return;
      if (
        !shouldHandleShortcut({
          allowInEditable: options.allowInEditable,
          target: event.target,
        })
      ) {
        return;
      }
      event.preventDefault();
      invoke();
    };
    window.addEventListener('keydown', onKeyDown, true);
    onCleanup(() => window.removeEventListener('keydown', onKeyDown, true));
  });
}

export function useMenuAcceleratorRegistration(
  menuId: string,
  handler: (event: KeyboardEvent) => boolean,
  isOpen: Ref<boolean> | boolean,
): void {
  const context = useAcceleratorContext();
  const handlerRef = ref(handler);
  handlerRef.value = handler;

  watchEffect((onCleanup) => {
    const open = typeof isOpen === 'boolean' ? isOpen : isOpen.value;
    if (!context || !open) return;
    context.setActiveMenuId(menuId);
    const unregister = context.registerMenuHandler(menuId, (event) => handlerRef.value(event));
    onCleanup(() => {
      unregister();
      context.setActiveMenuId(null);
    });
  });
}

export function useMenuKeyboardShortcuts(options: {
  entries: MenuEntry[];
  activeSubmenuId: string | null;
  optionKey?: boolean;
  platform?: ReturnType<typeof resolveAcceleratorPlatform>;
  onSelect: (item: MenuItemConfig) => void;
  onClose: () => void;
}) {
  return (event: KeyboardEvent): boolean => {
    const result = handleMenuKeyboard(event, createInitialMenuKeyboardState(), {
      entries: options.entries as never,
      activeSubmenuId: options.activeSubmenuId,
      optionKey: options.optionKey,
      platform: options.platform ?? resolveAcceleratorPlatform(),
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
      options.onSelect(result.action.item as MenuItemConfig);
      return true;
    }
    return result.preventDefault;
  };
}

export function useCombinedMenuKeyboard(options: {
  entries: MenuEntry[];
  activeSubmenuId: Ref<string | null> | string | null;
  optionKey?: boolean;
  platform?: ReturnType<typeof resolveAcceleratorPlatform>;
  onSelect: (item: MenuItemConfig) => void;
  onClose: () => void;
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
  mnemonicActive?: boolean;
}) {
  const typeAheadHighlightId = ref<string | null>(null);
  let keyboardState = createInitialMenuKeyboardState();

  const resetTypeAhead = () => {
    keyboardState = resetMenuKeyboardState(keyboardState);
    typeAheadHighlightId.value = null;
  };

  const handler = (event: KeyboardEvent): boolean => {
    const activeSubmenuId =
      typeof options.activeSubmenuId === 'object' && options.activeSubmenuId !== null && 'value' in options.activeSubmenuId
        ? options.activeSubmenuId.value
        : (options.activeSubmenuId as string | null);

    const result = handleMenuKeyboard(event, keyboardState, {
      entries: options.entries as never,
      activeSubmenuId,
      optionKey: options.optionKey,
      platform: options.platform ?? resolveAcceleratorPlatform(),
      enableTypeAhead: options.enableTypeAhead ?? true,
      enableMnemonics: options.enableMnemonics ?? true,
      mnemonicActive: options.mnemonicActive ?? false,
    });
    keyboardState = result.state;
    typeAheadHighlightId.value = result.state.typeAheadHighlightId;

    if (result.action.type === 'close') {
      options.onClose();
      return false;
    }
    if (result.preventDefault) event.preventDefault();
    if (result.stopPropagation) event.stopPropagation();
    if (result.action.type === 'select') {
      result.action.item.onSelect?.();
      options.onSelect(result.action.item as MenuItemConfig);
      return true;
    }
    return result.preventDefault;
  };

  return { handler, typeAheadHighlightId, resetTypeAhead };
}

export function useMenuBarAccelerators(options: {
  menus: MenuBarMenuConfig[] | Ref<MenuBarMenuConfig[]> | ComputedRef<MenuBarMenuConfig[]>;
  optionKey?: boolean | Ref<boolean>;
  enableGlobalShortcuts?: boolean;
  onMenuAction?: (menuId: string, entry: MenuItemConfig) => void;
}): void {
  const context = useAcceleratorContext();
  const onMenuActionRef = ref(options.onMenuAction);
  onMenuActionRef.value = options.onMenuAction;

  watchEffect((onCleanup) => {
    if (!context || options.enableGlobalShortcuts === false) return;
    const optionKey =
      typeof options.optionKey === 'object' && options.optionKey && 'value' in options.optionKey
        ? options.optionKey.value
        : Boolean(options.optionKey);
    const menus =
      typeof options.menus === 'object' && options.menus && 'value' in options.menus
        ? options.menus.value
        : options.menus;

    const unregisters: Array<() => void> = [];
    for (const menu of menus) {
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
              onMenuActionRef.value?.(menu.id, item);
            },
          }),
        );
      }
    }
    onCleanup(() => {
      for (const unregister of unregisters) unregister();
    });
  });
}
