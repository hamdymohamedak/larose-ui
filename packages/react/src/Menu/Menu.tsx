import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type CSSProperties,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import { mergeStyles } from '../shared/styleProps';
import {
  resolveMenuShortcut,
  useAcceleratorContext,
  useCombinedMenuKeyboard,
  useMenuAcceleratorRegistration,
  MnemonicLabel,
} from '../accelerator';
import type { MenuEntry, MenuItemConfig, MenuLayout, MenuPosition } from './types';
import {
  isMenuItem,
  isMenuSubmenu,
  prepareMenuEntries,
  resolveMenuPanelPosition,
  splitCompactAndList,
} from './utils';
import styles from '@larose-ui/styles/components/Menu/Menu.module.css';

export interface MenuProps {
  children?: ReactElement;
  entries: MenuEntry[];
  layout?: MenuLayout;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEntrySelect?: (entry: MenuItemConfig) => boolean | void;
  dimBackground?: boolean;
  /** When true, keyboard shortcuts activate menu items while open. Defaults to true. */
  enableShortcuts?: boolean;
  /** Passed from MenuBar for Option-key alternate accelerators. */
  optionKey?: boolean;
  /** Enable type-ahead letter matching while open. Defaults to true. */
  enableTypeAhead?: boolean;
  /** Enable Alt+key mnemonics while open. Defaults to true. */
  enableMnemonics?: boolean;
  /** When true, underline mnemonic access keys in labels. */
  mnemonicVisible?: boolean;
  className?: string;
  style?: CSSProperties;
}

function MenuItemRow({
  item,
  onSelect,
  optionKey,
  mnemonicVisible,
  typeAheadHighlightId,
}: {
  item: MenuItemConfig;
  onSelect: (entry: MenuItemConfig) => void;
  optionKey?: boolean;
  mnemonicVisible?: boolean;
  typeAheadHighlightId?: string | null;
}) {
  const resolved = resolveMenuShortcut(item, { optionKey });
  const isHighlighted = typeAheadHighlightId === item.id;

  return (
    <button
      type="button"
      className={styles.item}
      role="menuitem"
      data-destructive={item.destructive ? 'true' : undefined}
      data-typeahead-match={isHighlighted ? 'true' : undefined}
      disabled={item.disabled}
      aria-checked={item.selected ? true : undefined}
      aria-keyshortcuts={resolved.ariaKeyshortcuts}
      onClick={() => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelect(item);
      }}
    >
      <span className={styles.checkmark} aria-hidden="true">
        {item.selected ? '✓' : ''}
      </span>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <MnemonicLabel
        label={item.label}
        mnemonic={item.mnemonic}
        showAccessKey={mnemonicVisible}
        className={styles.label}
      />
      {resolved.display && (
        <span className={styles.shortcut} dir="ltr">
          {resolved.display}
        </span>
      )}
    </button>
  );
}

function MenuPanel({
  menuId,
  entries,
  layout,
  title,
  onSelect,
  onClose,
  enableShortcuts,
  optionKey,
  enableTypeAhead = true,
  enableMnemonics = true,
  mnemonicVisible = false,
  isOpen,
}: {
  menuId: string;
  entries: MenuEntry[];
  layout: MenuLayout;
  title?: string;
  onSelect: (entry: MenuItemConfig) => void;
  onClose: () => void;
  enableShortcuts: boolean;
  optionKey?: boolean;
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
  mnemonicVisible?: boolean;
  isOpen: boolean;
}) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuSides, setSubmenuSides] = useState<Record<string, 'end' | 'start'>>({});
  const submenuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { compact, list } = useMemo(() => splitCompactAndList(entries, layout), [entries, layout]);

  const resolveSubmenuSide = useCallback((submenuId: string) => {
    const trigger = submenuTriggerRefs.current[submenuId];
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const submenuWidth = 240;
    const gap = 8;
    const fitsEnd = rect.right + submenuWidth + gap <= window.innerWidth;
    const fitsStart = rect.left - submenuWidth - gap >= 0;
    const side: 'end' | 'start' = fitsEnd || !fitsStart ? 'end' : 'start';

    setSubmenuSides((current) =>
      current[submenuId] === side ? current : { ...current, [submenuId]: side },
    );
  }, []);

  const openSubmenu = useCallback(
    (submenuId: string) => {
      setActiveSubmenu(submenuId);
      requestAnimationFrame(() => resolveSubmenuSide(submenuId));
    },
    [resolveSubmenuSide],
  );

  const { handler: handleKeyboard, typeAheadHighlightId, resetTypeAhead } =
    useCombinedMenuKeyboard({
      entries,
      activeSubmenuId: activeSubmenu,
      optionKey,
      onSelect,
      onClose,
      enableTypeAhead: enableShortcuts && enableTypeAhead,
      enableMnemonics: enableShortcuts && enableMnemonics,
      mnemonicActive: mnemonicVisible,
    });

  const acceleratorContext = useAcceleratorContext();
  useMenuAcceleratorRegistration(menuId, handleKeyboard, isOpen && enableShortcuts);

  useEffect(() => {
    if (!isOpen) resetTypeAhead();
  }, [isOpen, resetTypeAhead]);

  // Fallback local listener when no AcceleratorProvider wraps the tree
  useEffect(() => {
    if (!isOpen || !enableShortcuts || acceleratorContext) return;

    const onKeyDown = (event: KeyboardEvent) => {
      handleKeyboard(event);
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [acceleratorContext, enableShortcuts, handleKeyboard, isOpen]);

  useEffect(() => {
    if (!enableShortcuts || acceleratorContext) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
    return undefined;
  }, [acceleratorContext, enableShortcuts, onClose]);

  return (
    <>
      {title && <p className={styles.menuTitle}>{title}</p>}
      {compact.length > 0 && (
        <div className={styles.compactRow} role="group" aria-label="Primary actions">
          {compact.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.compactTile}
              data-layout={layout}
              disabled={item.disabled}
              aria-label={layout === 'small' ? item.label : undefined}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect?.();
                onSelect(item);
              }}
            >
              {item.icon && <span className={styles.compactIcon}>{item.icon}</span>}
              {layout === 'medium' && <span className={styles.compactLabel}>{item.label}</span>}
            </button>
          ))}
        </div>
      )}
      <ul className={styles.list}>
        {list.map((entry, index) => {
          if (entry.type === 'separator') {
            return <li key={entry.id ?? `sep-${index}`} className={styles.separator} role="separator" />;
          }

          if (isMenuSubmenu(entry)) {
            const submenuResolved = resolveMenuShortcut(entry, { optionKey });
            return (
              <li
                key={entry.id}
                className={styles.submenuWrap}
                data-active={activeSubmenu === entry.id ? 'true' : undefined}
              >
                <button
                  ref={(node) => {
                    submenuTriggerRefs.current[entry.id] = node;
                  }}
                  type="button"
                  className={styles.submenuTrigger}
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === entry.id}
                  disabled={entry.disabled}
                  onMouseEnter={() => openSubmenu(entry.id)}
                  onFocus={() => openSubmenu(entry.id)}
                >
                  <span className={styles.checkmark} aria-hidden="true" />
                  {entry.icon && <span className={styles.icon}>{entry.icon}</span>}
                  <MnemonicLabel
                    label={entry.label}
                    showAccessKey={mnemonicVisible}
                    className={styles.label}
                  />
                  {submenuResolved.display && (
                    <span className={styles.shortcut} dir="ltr">
                      {submenuResolved.display}
                    </span>
                  )}
                  <span className={styles.submenuChevron} aria-hidden="true">
                    ›
                  </span>
                </button>
                {activeSubmenu === entry.id && (
                  <ul
                    className={styles.submenu}
                    role="menu"
                    aria-label={entry.label}
                    data-side={submenuSides[entry.id] === 'start' ? 'start' : 'end'}
                  >
                    {entry.items.map((item) => (
                      <li key={item.id}>
                        <MenuItemRow
                          item={item}
                          onSelect={onSelect}
                          optionKey={optionKey}
                          mnemonicVisible={mnemonicVisible}
                          typeAheadHighlightId={typeAheadHighlightId}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          if (isMenuItem(entry)) {
            return (
              <li key={entry.id}>
                <MenuItemRow
                  item={entry}
                  onSelect={onSelect}
                  optionKey={optionKey}
                  mnemonicVisible={mnemonicVisible}
                  typeAheadHighlightId={typeAheadHighlightId}
                />
              </li>
            );
          }

          return null;
        })}
      </ul>
    </>
  );
}

/**
 * General-purpose menu with small, medium, and large iOS/iPadOS layouts.
 * @see https://developer.apple.com/design/human-interface-guidelines/menus
 */
export function Menu({
  children,
  entries,
  layout = 'large',
  title,
  open,
  onOpenChange,
  onEntrySelect,
  dimBackground = true,
  enableShortcuts = true,
  optionKey,
  enableTypeAhead = true,
  enableMnemonics = true,
  mnemonicVisible = false,
  className,
  style,
}: MenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0, placement: 'below' });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const preparedEntries = useMemo(() => prepareMenuEntries(entries), [entries]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const estimateMenuHeight = useCallback(() => {
    return Math.min(420, 48 + preparedEntries.length * 36 + (layout !== 'large' ? 64 : 0));
  }, [layout, preparedEntries.length]);

  const estimateMenuWidth = useCallback(() => {
    return layout === 'large' ? 240 : 280;
  }, [layout]);

  const centerMenuOnViewport = useCallback(() => {
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    setPosition({
      x: Math.max(16, (window.innerWidth - menuWidth) / 2),
      y: Math.max(16, (window.innerHeight - menuHeight) / 2),
      placement: 'below',
    });
  }, [estimateMenuHeight, estimateMenuWidth]);

  const openFromTrigger = useCallback(() => {
    const rect =
      triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    const resolved = resolveMenuPanelPosition(rect, menuWidth, menuHeight);
    setPosition(resolved);
    setOpen(true);
  }, [estimateMenuHeight, estimateMenuWidth, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      const shouldClose = onEntrySelect?.(entry) !== false;
      if (shouldClose) close();
    },
    [close, onEntrySelect],
  );

  useEffect(() => {
    if (!isOpen) return;

    if (!children) {
      centerMenuOnViewport();
      return;
    }

    if (open === undefined) return;

    const rect = triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    setPosition(resolveMenuPanelPosition(rect, menuWidth, menuHeight));
  }, [
    centerMenuOnViewport,
    children,
    estimateMenuHeight,
    estimateMenuWidth,
    isOpen,
    open,
  ]);

  const bindTrigger = (child: ReactElement<Record<string, unknown>>) =>
    cloneElement(child, {
      onClick: (event: React.MouseEvent<Element>) => {
        (child.props.onClick as ((event: React.MouseEvent<Element>) => void) | undefined)?.(event);
        openFromTrigger();
      },
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined,
    });

  const menuPortal = (
    <ContextualMenuPortal
      open={isOpen}
      onClose={close}
      placement={position.placement === 'above' ? 'top' : 'bottom'}
      showBackdrop={dimBackground}
      backdropClassName={styles.menuBackdrop}
      surfaceId={menuId}
      surfaceClassName={styles.menu}
      surfaceRole="menu"
      aria-label="Menu"
      surfaceStyle={mergeStyles({ left: position.x, top: position.y }, style)}
      onSurfaceClick={(event) => event.stopPropagation()}
    >
      <MenuPanel
        menuId={menuId}
        entries={preparedEntries}
        layout={layout}
        title={title}
        onSelect={handleSelect}
        onClose={close}
        enableShortcuts={enableShortcuts}
        optionKey={optionKey}
        enableTypeAhead={enableTypeAhead}
        enableMnemonics={enableMnemonics}
        mnemonicVisible={mnemonicVisible}
        isOpen={isOpen}
      />
    </ContextualMenuPortal>
  );

  if (!children) {
    return menuPortal;
  }

  if (!isValidElement(children)) {
    throw new Error('Menu expects a single React element child when used with a trigger.');
  }

  return (
    <>
      <span ref={triggerRef} className={[styles.triggerWrap, className].filter(Boolean).join(' ')} style={style}>
        {bindTrigger(children as ReactElement<Record<string, unknown>>)}
      </span>
      {menuPortal}
    </>
  );
}

export type { MenuEntry, MenuItemConfig, MenuLayout, MenuSubmenuConfig } from './types';
export { prepareMenuEntries, splitCompactAndList, MAX_SUBMENU_ITEMS } from './utils';
