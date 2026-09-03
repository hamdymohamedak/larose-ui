import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import type {
  SearchFieldProps,
  SearchScopeBarProps,
  SearchTokenChipProps,
} from './types';
import {
  DEFAULT_SEARCH_PLACEHOLDER,
  filterSuggestions,
  resolveSearchFieldPlacement,
} from './utils';
import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" width="0.875rem" height="0.875rem" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function DictationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="0.875rem" height="0.875rem" aria-hidden="true">
      <path
        d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0M12 17v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchScopeBar({ options, value, onChange, className, style }: SearchScopeBarProps) {
  return (
    <div
      className={[styles.scopeBar, className].filter(Boolean).join(' ')}
      style={style}
      role="tablist"
      aria-label="Search scope"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          className={styles.scopeOption}
          data-selected={option.id === value ? 'true' : undefined}
          aria-selected={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SearchTokenChip({ token, onRemove, onSelect }: SearchTokenChipProps) {
  return (
    <button type="button" className={styles.token} onClick={onSelect}>
      {token.icon}
      <span>{token.label}</span>
      {onRemove && (
        <span
          className={styles.tokenRemove}
          aria-hidden="true"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}

/**
 * Search field with scope bar, tokens, and suggestions.
 * @see https://developer.apple.com/design/human-interface-guidelines/search-fields
 */
export function SearchField({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
  platform = 'macos',
  placement,
  immediate = true,
  suggestions = [],
  recentSearches = [],
  scope,
  tokens = [],
  onTokenRemove,
  onTokenSelect,
  showDictation = platform === 'macos' || platform === 'ipados',
  autoFocus = false,
  className,
  style,
  'aria-label': ariaLabel = 'Search',
}: SearchFieldProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isControlled = value !== undefined;
  const query = isControlled ? value : internal;

  const resolvedPlacement = resolveSearchFieldPlacement(platform, placement);

  const combinedSuggestions = useMemo(() => {
    const pool = query.trim() ? suggestions : [...recentSearches, ...suggestions];
    return filterSuggestions(query, [...new Set(pool)]);
  }, [query, recentSearches, suggestions]);

  const setQuery = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      if (immediate) onSearch?.(next);
    },
    [immediate, isControlled, onChange, onSearch],
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch?.(query);
      setShowSuggestions(false);
    }
    if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={[styles.searchField, className].filter(Boolean).join(' ')} style={style} data-platform={platform}>
      {scope && (
        <SearchScopeBar options={scope.options} value={scope.value} onChange={scope.onChange} />
      )}
      {tokens.length > 0 && (
        <div className={styles.tokens} role="list" aria-label="Search filters">
          {tokens.map((token) => (
            <SearchTokenChip
              key={token.id}
              token={token}
              onSelect={() => onTokenSelect?.(token.id)}
              onRemove={onTokenRemove ? () => onTokenRemove(token.id) : undefined}
            />
          ))}
        </div>
      )}
      <div className={styles.fieldRow} data-placement={resolvedPlacement}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          value={query}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-controls={combinedSuggestions.length > 0 ? listId : undefined}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => setQuery('')}
          >
            ×
          </button>
        )}
        {showDictation && (
          <button type="button" className={styles.dictation} aria-label="Dictation" disabled>
            <DictationIcon />
          </button>
        )}
      </div>
      {showSuggestions && combinedSuggestions.length > 0 && (
        <ul id={listId} className={styles.suggestions} role="listbox" aria-label="Search suggestions">
          {combinedSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              role="option"
              className={styles.suggestion}
              onMouseDown={() => {
                setQuery(suggestion);
                onSearch?.(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type {
  SearchFieldProps,
  SearchScopeBarProps,
  SearchTokenChipProps,
  SearchToken,
  SearchScopeOption,
  SearchFieldPlacement,
  SearchFieldPlatform,
} from './types';

export {
  DEFAULT_SEARCH_PLACEHOLDER,
  filterSuggestions,
  resolveSearchFieldPlacement,
  warnIfSearchPlacementMismatch,
} from './utils';
