import { DOCS_FRAMEWORKS, type DocsFramework } from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';

interface FrameworkSelectorProps {
  /** Limit tabs to frameworks supported by the current page (e.g. one component). */
  supported?: DocsFramework[];
  compact?: boolean;
}

export function FrameworkSelector({ supported, compact = false }: FrameworkSelectorProps) {
  const { framework, setFramework } = useDocsFramework();

  const options = supported
    ? DOCS_FRAMEWORKS.filter((entry) => supported.includes(entry.id))
    : DOCS_FRAMEWORKS;

  return (
    <div
      className={`docs-framework-pills${compact ? ' docs-framework-pills--compact' : ''}`}
      role="tablist"
      aria-label="Code framework"
    >
      {options.map((entry) => (
        <button
          key={entry.id}
          type="button"
          role="tab"
          aria-selected={framework === entry.id}
          className={`docs-framework-pill${framework === entry.id ? ' docs-framework-pill--active' : ''}`}
          onClick={() => setFramework(entry.id)}
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}
