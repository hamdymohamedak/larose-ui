import type { CSSProperties, ReactNode } from 'react';
import type { MenuEntry } from '../Menu/types';

export interface TokenFieldToken {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TokenFieldProps {
  tokens?: TokenFieldToken[];
  defaultTokens?: TokenFieldToken[];
  onTokensChange?: (tokens: TokenFieldToken[]) => void;
  suggestions?: TokenFieldToken[];
  suggestionDelayMs?: number;
  placeholder?: string;
  /** Keys that convert current text into a token (default: comma). */
  delimiters?: string[];
  onContextMenuEntries?: (token: TokenFieldToken) => MenuEntry[];
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}
