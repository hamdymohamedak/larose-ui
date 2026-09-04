import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import type { TokenFieldProps, TokenFieldToken } from './types';
import {
  DEFAULT_SUGGESTION_DELAY_MS,
  filterTokenSuggestions,
  mergeUniqueTokens,
  shouldCommitToken,
} from './utils';
import styles from '@larose-ui/styles/components/TokenField/TokenField.module.css';

/**
 * macOS token field — converts text into selectable, draggable tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/token-fields
 */
export function TokenField({
  tokens: tokensProp,
  defaultTokens = [],
  onTokensChange,
  suggestions = [],
  suggestionDelayMs = DEFAULT_SUGGESTION_DELAY_MS,
  placeholder = 'Add recipients',
  delimiters = [','],
  onContextMenuEntries,
  className,
  style,
  'aria-label': ariaLabel = 'Token field',
}: TokenFieldProps) {
  const [internalTokens, setInternalTokens] = useState<TokenFieldToken[]>(defaultTokens);
  const [draft, setDraft] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const delayRef = useRef<number | null>(null);
  const isControlled = tokensProp !== undefined;
  const tokens = isControlled ? tokensProp : internalTokens;

  const setTokens = useCallback(
    (next: TokenFieldToken[]) => {
      if (!isControlled) setInternalTokens(next);
      onTokensChange?.(next);
    },
    [isControlled, onTokensChange],
  );

  const filtered = useMemo(
    () => filterTokenSuggestions(draft, suggestions),
    [draft, suggestions],
  );

  useEffect(
    () => () => {
      if (delayRef.current) window.clearTimeout(delayRef.current);
    },
    [],
  );

  const commitDraft = useCallback(() => {
    const label = draft.trim();
    if (!label) return;
    setTokens(mergeUniqueTokens(tokens, [{ id: `token-${Date.now()}`, label }]));
    setDraft('');
    setShowSuggestions(false);
  }, [draft, setTokens, tokens]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (shouldCommitToken(event.key, delimiters)) {
      event.preventDefault();
      commitDraft();
    }
    if (event.key === 'Backspace' && !draft && tokens.length > 0) {
      setTokens(tokens.slice(0, -1));
    }
  };

  const addSuggestion = (token: TokenFieldToken) => {
    setTokens(mergeUniqueTokens(tokens, [token]));
    setDraft('');
    setShowSuggestions(false);
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} style={style} aria-label={ariaLabel}>
      {tokens.map((token) => {
        const body = (
          <span key={token.id} className={styles.token}>
            {token.icon}
            <span>{token.label}</span>
            <button
              type="button"
              className={styles.tokenRemove}
              aria-label={`Remove ${token.label}`}
              onClick={() => setTokens(tokens.filter((entry) => entry.id !== token.id))}
            >
              ×
            </button>
          </span>
        );

        if (onContextMenuEntries) {
          return (
            <ContextMenu key={token.id} entries={onContextMenuEntries(token)}>
              <button type="button" className={styles.token}>
                {token.icon}
                <span>{token.label}</span>
                <span
                  className={styles.tokenRemove}
                  aria-hidden="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    setTokens(tokens.filter((entry) => entry.id !== token.id));
                  }}
                >
                  ×
                </span>
              </button>
            </ContextMenu>
          );
        }

        return body;
      })}
      <input
        type="text"
        className={styles.input}
        value={draft}
        placeholder={tokens.length === 0 ? placeholder : undefined}
        aria-label="Token input"
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (delayRef.current) window.clearTimeout(delayRef.current);
          delayRef.current = window.setTimeout(() => setShowSuggestions(true), suggestionDelayMs);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className={styles.suggestions} role="listbox" aria-label="Token suggestions">
          {filtered.map((item) => (
            <li
              key={item.id}
              role="option"
              className={styles.suggestion}
              onMouseDown={() => addSuggestion(item)}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type { TokenFieldProps, TokenFieldToken } from './types';
export {
  DEFAULT_SUGGESTION_DELAY_MS,
  filterTokenSuggestions,
  mergeUniqueTokens,
  tokenizeInput,
} from './utils';
