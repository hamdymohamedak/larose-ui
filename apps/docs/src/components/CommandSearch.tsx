import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchDocs(query), [query]);

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
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
      if (event.key === 'Enter' && results[activeIndex]) {
        event.preventDefault();
        navigate(results[activeIndex].path);
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, navigate, onClose, open, results]);

  if (!open) return null;

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
          onChange={(event) => setQuery(event.target.value)}
        />
        <Typography muted className="docs-command-hint">
          ↑↓ navigate · Enter open · Esc close · ⌘K / Ctrl K
        </Typography>

        <ul className="docs-command-results" role="listbox">
          {results.length === 0 ? (
            <li className="docs-command-empty">No results for “{query}”.</li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  role="option"
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
