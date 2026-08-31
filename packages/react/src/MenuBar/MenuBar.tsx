import { useCallback, useEffect, useMemo, useState } from 'react';
import { detectPlatform } from '@larose-ui/core';
import { Menu } from '../Menu/Menu';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuItemConfig } from '../Menu/types';
import {
  collectMenuBarMnemonicBindings,
  MnemonicLabel,
  useMenuBarAccelerators,
} from '../accelerator';
import { MenuBarExtra } from './MenuBarExtra';
import type { MenuBarMenuConfig, MenuBarProps } from './types';
import {
  buildStandardMenuBar,
  createAppleMenuStub,
  resolveDynamicMenuEntries,
} from './utils';
import styles from './MenuBar.module.css';

function MenuBarMenuItem({
  menu,
  isOpen,
  onOpenChange,
  optionKey,
  mnemonicVisible,
  enableTypeAhead,
  enableMnemonics,
  onAction,
}: {
  menu: MenuBarMenuConfig;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  optionKey: boolean;
  mnemonicVisible: boolean;
  enableTypeAhead: boolean;
  enableMnemonics: boolean;
  onAction?: (entry: MenuItemConfig) => void;
}) {
  const prepared = useMemo(
    () => resolveDynamicMenuEntries(prepareMenuEntries(menu.entries), { optionKey }),
    [menu.entries, optionKey],
  );

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      onAction?.(entry);
    },
    [onAction],
  );

  return (
    <Menu
      entries={prepared}
      open={isOpen}
      onOpenChange={onOpenChange}
      dimBackground={false}
      layout="large"
      onEntrySelect={handleSelect}
      optionKey={optionKey}
      enableTypeAhead={enableTypeAhead}
      enableMnemonics={enableMnemonics}
      mnemonicVisible={mnemonicVisible}
    >
      <button
        type="button"
        className={styles.menuTitle}
        data-emphasized={menu.emphasized ? 'true' : undefined}
        data-menu-id={menu.id}
        aria-label={menu.ariaLabel}
      >
        {menu.trigger ?? (
          <MnemonicLabel
            label={menu.title}
            mnemonic={menu.mnemonic}
            showAccessKey={mnemonicVisible}
          />
        )}
      </button>
    </Menu>
  );
}

/**
 * macOS and iPadOS menu bar with standard menu ordering and dynamic Option-key items.
 * @see https://developer.apple.com/design/human-interface-guidelines/the-menu-bar
 */
export function MenuBar({
  appName,
  menus: menusProp,
  standardOptions,
  appSpecificMenus = [],
  extras = [],
  platform = 'macos',
  revealed,
  onRevealChange,
  showAppleMenu = platform === 'macos',
  className,
  onMenuAction,
  enableGlobalShortcuts = true,
  enableTypeAhead = true,
  enableMnemonics,
}: MenuBarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [optionKey, setOptionKey] = useState(false);
  const [altKeyHeld, setAltKeyHeld] = useState(false);
  const [internalRevealed, setInternalRevealed] = useState(platform !== 'ipados');

  const runtimePlatform = detectPlatform();
  const mnemonicsEnabled = enableMnemonics ?? runtimePlatform !== 'macos';
  const mnemonicVisible = mnemonicsEnabled && altKeyHeld && runtimePlatform !== 'macos';

  const isRevealed = revealed ?? internalRevealed;
  const setRevealed = onRevealChange ?? setInternalRevealed;

  const menus = useMemo(() => {
    if (menusProp) return menusProp;
    return buildStandardMenuBar({
      appName,
      platform,
      appSpecificMenus,
      ...standardOptions,
    });
  }, [appName, appSpecificMenus, menusProp, platform, standardOptions]);

  const allMenus = useMemo(() => {
    const list = [...menus];
    if (showAppleMenu && platform === 'macos') {
      list.unshift({
        id: 'apple',
        title: 'Apple',
        ariaLabel: 'Apple menu',
        entries: createAppleMenuStub(),
      });
    }
    return list;
  }, [menus, platform, showAppleMenu]);

  const appleMenu = useMemo(
    (): MenuBarMenuConfig => ({
      id: 'apple',
      title: 'Apple',
      ariaLabel: 'Apple menu',
      trigger: (
        <span className={styles.appleMark} aria-hidden="true">
          {'\uF8FF'}
        </span>
      ),
      entries: createAppleMenuStub(),
    }),
    [],
  );

  const menuBarMnemonics = useMemo(
    () => collectMenuBarMnemonicBindings(allMenus),
    [allMenus],
  );

  useMenuBarAccelerators({
    menus: allMenus.filter((menu) => menu.id !== 'apple'),
    optionKey,
    enableGlobalShortcuts,
    onMenuAction: (menuId, entry) => {
      entry.onSelect?.();
      onMenuAction?.(menuId, entry.id);
    },
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        setAltKeyHeld(true);
        if (platform === 'macos') setOptionKey(true);
      }

      if (mnemonicsEnabled && runtimePlatform !== 'macos' && event.altKey && !openMenuId) {
        const key = event.key.length === 1 ? event.key.toLowerCase() : '';
        if (!key) return;
        const binding = menuBarMnemonics.find((entry) => entry.mnemonicKey === key);
        if (binding) {
          event.preventDefault();
          setOpenMenuId(binding.menuId);
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        setAltKeyHeld(false);
        if (platform === 'macos') setOptionKey(false);
      }
    };
    const onBlur = () => {
      setAltKeyHeld(false);
      if (platform === 'macos') setOptionKey(false);
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [menuBarMnemonics, mnemonicsEnabled, openMenuId, platform, runtimePlatform]);

  const handleMenuOpenChange = useCallback((menuId: string, open: boolean) => {
    setOpenMenuId(open ? menuId : null);
  }, []);

  const handleMenuAction = useCallback(
    (menuId: string, entry: MenuItemConfig) => {
      entry.onSelect?.();
      onMenuAction?.(menuId, entry.id);
    },
    [onMenuAction],
  );

  const revealFromEdge = useCallback(() => {
    if (platform === 'ipados') setRevealed(true);
  }, [platform, setRevealed]);

  const hideWhenPointerLeaves = useCallback(() => {
    if (platform === 'ipados' && revealed === undefined) {
      setInternalRevealed(false);
    }
  }, [platform, revealed]);

  return (
    <>
      {platform === 'ipados' && (
        <div
          className={styles.revealZone}
          role="presentation"
          onPointerEnter={revealFromEdge}
          aria-hidden="true"
        />
      )}
      <header
        role="menubar"
        aria-label={`${appName} menu bar`}
        className={[styles.menuBar, className].filter(Boolean).join(' ')}
        data-platform={platform}
        data-hidden={platform === 'ipados' ? (!isRevealed).toString() : undefined}
        onPointerEnter={revealFromEdge}
        onPointerLeave={hideWhenPointerLeaves}
      >
        <div className={styles.leading}>
          {showAppleMenu && platform === 'macos' && (
            <MenuBarMenuItem
              menu={appleMenu}
              isOpen={openMenuId === 'apple'}
              onOpenChange={(open) => handleMenuOpenChange('apple', open)}
              optionKey={optionKey}
              mnemonicVisible={mnemonicVisible}
              enableTypeAhead={enableTypeAhead}
              enableMnemonics={mnemonicsEnabled}
            />
          )}
          {menus.map((menu) => (
            <MenuBarMenuItem
              key={menu.id}
              menu={menu}
              isOpen={openMenuId === menu.id}
              onOpenChange={(open) => handleMenuOpenChange(menu.id, open)}
              optionKey={optionKey}
              mnemonicVisible={mnemonicVisible}
              enableTypeAhead={enableTypeAhead}
              enableMnemonics={mnemonicsEnabled}
              onAction={(entry) => handleMenuAction(menu.id, entry)}
            />
          ))}
        </div>
        {extras.length > 0 && (
          <div className={styles.trailing} role="group" aria-label="Menu bar extras">
            {extras.map((extra) => (
              <MenuBarExtra
                key={extra.id}
                {...extra}
                isOpen={openMenuId === extra.id}
                onOpenChange={(open) => handleMenuOpenChange(extra.id, open)}
                optionKey={optionKey}
                mnemonicVisible={mnemonicVisible}
                enableTypeAhead={enableTypeAhead}
                enableMnemonics={mnemonicsEnabled}
                onAction={(entry) => handleMenuAction(extra.id, entry)}
              />
            ))}
          </div>
        )}
      </header>
    </>
  );
}

export type { MenuBarProps, MenuBarMenuConfig, MenuBarExtraConfig } from './types';
