import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu } from '../Menu/Menu';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuItemConfig } from '../Menu/types';
import type { MenuBarExtraConfig } from './types';
import { resolveDynamicMenuEntries } from './utils';
import styles from './MenuBar.module.css';

export interface MenuBarExtraProps extends MenuBarExtraConfig {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  optionKey: boolean;
  onAction?: (entry: MenuItemConfig) => void;
}

/**
 * Trailing menu bar extra — exposes app functionality via an icon and menu (not a popover).
 * @see https://developer.apple.com/design/human-interface-guidelines/the-menu-bar#Menu-bar-extras
 */
export function MenuBarExtra({
  id,
  label,
  icon,
  entries,
  isOpen,
  onOpenChange,
  optionKey,
  onAction,
}: MenuBarExtraProps) {
  const prepared = useMemo(
    () => resolveDynamicMenuEntries(prepareMenuEntries(entries), { optionKey }),
    [entries, optionKey],
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
    >
      <button
        type="button"
        className={styles.extraButton}
        aria-label={label}
        data-extra-id={id}
      >
        {icon}
      </button>
    </Menu>
  );
}
