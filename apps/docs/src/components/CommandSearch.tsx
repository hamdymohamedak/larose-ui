import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Typography } from '@larose-ui/react';
import { docsSearchIndex, type DocsSearchEntry } from '@/data/searchIndex.generated';

function scoreEntry(entry: DocsSearchEntry, query: string): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 0;
  const title = entry.title.toLowerCase();
  const keywords = entry.keywords.toLowerCase();
  if (title === normalized) return 100;
  if (title.startsWith(normalized)) return 80;
  if (title.includes(normalized)) return 60;
  if (keywords.includes(normalized)) return 40;
  return 0;
}

export function searchDocs(query: string, limit = 20): DocsSearchEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return docsSearchIndex
    .map((entry) => ({ entry, score: scoreEntry(entry, normalized) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchDocs(query), [query]);

  const resultsRef = useRef(results);
  const activeIndexRef = useRef(activeIndex);
  resultsRef.current = results;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-command-index="${activeIndex}"]`,
    );
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, results.length]);

  const handleNavigationKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      const items = resultsRef.current;
      const current = activeIndexRef.current;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(items.length - 1, 0)));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      }

      if (event.key === 'Enter' && items[current]) {
        event.preventDefault();
        navigate(items[current]!.path);
        onClose();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [navigate, onClose],
  );

  if (!open) return null;

  const activeEntry = results[activeIndex];

  return (
    <div className="docs-command-overlay" role="presentation" onClick={onClose}>
      <div
        className="docs-command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(event) => event.stopPropagation()}
      >
        <Input
          ref={inputRef}
          label="Search documentation"
          placeholder="Search components, props, guides, tokens…"
          value={query}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="docs-command-list"
          aria-activedescendant={activeEntry ? `docs-command-${activeEntry.id}` : undefined}
          aria-autocomplete="list"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleNavigationKeyDown}
        />
        <Typography muted className="docs-command-hint">
          ↑↓ navigate · Enter open · Esc close · ⌘K / Ctrl K
        </Typography>

        <ul
          ref={listRef}
          id="docs-command-list"
          className="docs-command-results"
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <li className="docs-command-empty">No results for “{query}”.</li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.id} role="presentation">
                <button
                  id={`docs-command-${entry.id}`}
                  type="button"
                  role="option"
                  data-command-index={index}
                  aria-selected={index === activeIndex}
                  className={`docs-command-result${index === activeIndex ? ' docs-command-result--active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    navigate(entry.path);
                    onClose();
                  }}
                >
                  <span className="docs-command-result-title">{entry.title}</span>
                  <span className="docs-command-result-meta">{entry.type}</span>
                  <span className="docs-command-result-excerpt">{entry.excerpt}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isK = event.key.toLowerCase() === 'k';
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && isK) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return { open, setOpen, close: () => setOpen(false) };
}
