import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { STANDARD_ACCELERATORS } from '@larose-ui/core';
import { useAccelerator } from '../accelerator';
import styles from '@larose-ui/styles/components/CommandPalette/CommandPalette.module.css';

export interface CommandPaletteItem {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
  placeholder?: string;
  emptyMessage?: string;
  'aria-label'?: string;
}

function matchesQuery(item: CommandPaletteItem, query: string): boolean {
  if (!query) return true;
  const haystack = [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = 'Search commands…',
  emptyMessage = 'No commands found',
  'aria-label': ariaLabel = 'Command palette',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => items.filter((item) => matchesQuery(item, query.trim())),
    [items, query],
  );

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setActiveIndex(0);
  }, [onOpenChange]);

  const selectItem = useCallback(
    (item: CommandPaletteItem) => {
      item.onSelect();
      close();
    },
    [close],
  );

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(Math.max(filtered.length - 1, 0));
    }
  }, [activeIndex, filtered.length]);

  const filteredRef = useRef(filtered);
  const activeIndexRef = useRef(activeIndex);
  filteredRef.current = filtered;
  activeIndexRef.current = activeIndex;

  const handleNavigationKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const items = filteredRef.current;
      const current = activeIndexRef.current;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(items.length, 1));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1),
        );
        return;
      }

      if (event.key === 'Enter' && items[current]) {
        event.preventDefault();
        selectItem(items[current]!);
      }
    },
    [close, selectItem],
  );

  useEffect(() => {
    if (!open) return;
    const active = document.getElementById(
      filtered[activeIndex] ? `larose-command-${filtered[activeIndex]!.id}` : '',
    );
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, filtered, open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (event.target instanceof Element && event.target.closest('[role="dialog"]')) return;
      event.preventDefault();
      close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, open]);

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const group = item.group ?? 'Commands';
    acc[group] = acc[group] ?? [];
    acc[group]!.push(item);
    return acc;
  }, {});

  let itemIndex = -1;

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        role="dialog"
        aria-label={ariaLabel}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="search"
          className={styles.search}
          placeholder={placeholder}
          value={query}
          role="combobox"
          aria-controls="larose-command-list"
          aria-expanded={filtered.length > 0}
          aria-activedescendant={
            filtered[activeIndex] ? `larose-command-${filtered[activeIndex]!.id}` : undefined
          }
          aria-autocomplete="list"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleNavigationKeyDown}
        />
        <ul
          id="larose-command-list"
          className={styles.list}
          role="listbox"
          aria-label={ariaLabel}
        >
          {filtered.length === 0 ? (
            <li className={styles.empty} role="presentation">
              {emptyMessage}
            </li>
          ) : (
            Object.entries(grouped).map(([group, groupItems]) => (
              <li key={group} role="presentation">
                <div className={styles.groupLabel}>{group}</div>
                <ul role="group" aria-label={group}>
                  {groupItems.map((item) => {
                    itemIndex += 1;
                    const isActive = itemIndex === activeIndex;
                    return (
                      <li key={item.id} role="presentation">
                        <button
                          id={`larose-command-${item.id}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={styles.item}
                          data-state={isActive ? 'active' : 'inactive'}
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                          onClick={() => selectItem(item)}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export function useCommandPaletteShortcut(onOpen: () => void, enabled = true) {
  useAccelerator(STANDARD_ACCELERATORS.commandPalette, onOpen, {
    allowInEditable: true,
    enabled,
    id: 'larose-command-palette',
  });
}
