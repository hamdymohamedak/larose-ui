import { matchTypeAheadPrefix } from '@larose-ui/core';
import type { MenuItemConfig } from './types';
import { collectTypeAheadItems } from './collectTypeAheadItems';

export interface TypeAheadState {
  buffer: string;
  matchIndex: number;
  lastKey: string;
  lastKeyTime: number;
}

export const TYPE_AHEAD_RESET_MS = 700;

export function createInitialTypeAheadState(): TypeAheadState {
  return { buffer: '', matchIndex: 0, lastKey: '', lastKeyTime: 0 };
}

export interface TypeAheadStepResult {
  state: TypeAheadState;
  matches: MenuItemConfig[];
  highlightedId: string | null;
}

/**
 * Advance type-ahead state for a printable character key.
 * Repeated same key within the reset window cycles matches.
 */
export function stepTypeAhead(
  state: TypeAheadState,
  key: string,
  items: MenuItemConfig[],
  now = Date.now(),
): TypeAheadStepResult {
  const char = key.length === 1 ? key.toLowerCase() : '';
  if (!char || !/[\p{L}\p{N}]/u.test(char)) {
    return { state, matches: [], highlightedId: null };
  }

  const sameKeyRepeat =
    char === state.lastKey && now - state.lastKeyTime <= TYPE_AHEAD_RESET_MS;

  let buffer = state.buffer;
  let matchIndex = state.matchIndex;

  if (sameKeyRepeat && state.buffer.endsWith(char)) {
    matchIndex += 1;
  } else if (now - state.lastKeyTime > TYPE_AHEAD_RESET_MS) {
    buffer = char;
    matchIndex = 0;
  } else {
    buffer = `${buffer}${char}`;
    matchIndex = 0;
  }

  const matches = items.filter((item) => matchTypeAheadPrefix(item.label, buffer));
  if (matches.length === 0) {
    return {
      state: createInitialTypeAheadState(),
      matches: [],
      highlightedId: null,
    };
  }

  const normalizedIndex = matchIndex % matches.length;
  const nextState: TypeAheadState = {
    buffer,
    matchIndex: normalizedIndex,
    lastKey: char,
    lastKeyTime: now,
  };

  return {
    state: nextState,
    matches,
    highlightedId: matches[normalizedIndex]?.id ?? null,
  };
}

export function findTypeAheadMatches(
  entries: Parameters<typeof collectTypeAheadItems>[0],
  activeSubmenuId: string | null,
  buffer: string,
): MenuItemConfig[] {
  const items = collectTypeAheadItems(entries, activeSubmenuId);
  if (!buffer) return [];
  return items.filter((item) => matchTypeAheadPrefix(item.label, buffer));
}
