import { useCallback, useMemo } from 'react';
import { Menu } from '../Menu/Menu';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuItemConfig } from '../Menu/types';
import { resolveDynamicMenuEntries } from './utils';
import type { MenuBarExtraConfig } from './types';
import styles from './MenuBar.module.css';

export interface MenuBarExtraProps extends MenuBarExtraConfig {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  optionKey: boolean;
  mnemonicVisible?: boolean;
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
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
  mnemonicVisible = false,
  enableTypeAhead = true,
  enableMnemonics = true,
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
      optionKey={optionKey}
      enableTypeAhead={enableTypeAhead}
      enableMnemonics={enableMnemonics}
      mnemonicVisible={mnemonicVisible}
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
