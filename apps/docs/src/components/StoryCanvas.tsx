import { type ReactNode, useState } from 'react';
import { Button } from '@larose-ui/react';
import { Code2, Eye } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import {
  PreviewToolbar,
  PreviewViewportFrame,
  type PreviewAppearance,
  type PreviewDirection,
  type PreviewViewport,
} from '@/components/PreviewToolbar';

export interface StoryCanvasProps {
  children: ReactNode;
  /** Story name shown in the canvas chrome */
  storyName?: string;
  showToolbar?: boolean;
  padded?: boolean;
  centered?: boolean;
}

export function StoryCanvas({
  children,
  storyName,
  showToolbar = true,
  padded = true,
  centered = false,
}: StoryCanvasProps) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [direction, setDirection] = useState<PreviewDirection>('ltr');
  const [appearance, setAppearance] = useState<PreviewAppearance>('light');

  return (
    <div className="docs-sb-canvas">
      <div className="docs-sb-canvas__chrome">
        <div className="docs-sb-canvas__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {storyName ? <span className="docs-sb-canvas__story">{storyName}</span> : null}
      </div>

      {showToolbar ? (
        <div className="docs-sb-canvas__toolbar">
          <PreviewToolbar
            viewport={viewport}
            direction={direction}
            appearance={appearance}
            onViewportChange={setViewport}
            onDirectionChange={setDirection}
            onAppearanceChange={setAppearance}
          />
        </div>
      ) : null}

      <div
        className={`docs-sb-canvas__viewport${padded ? ' docs-sb-canvas__viewport--padded' : ''}${centered ? ' docs-sb-canvas__viewport--centered' : ''}`}
      >
        {showToolbar ? (
          <PreviewViewportFrame viewport={viewport} direction={direction} appearance={appearance}>
            {children}
          </PreviewViewportFrame>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface StoryCodePanelProps {
  code: string;
  language?: string;
  defaultOpen?: boolean;
}

export function StoryCodePanel({ code, language = 'tsx', defaultOpen = true }: StoryCodePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="docs-sb-code">
      <div className="docs-sb-code__tabs">
        <button
          type="button"
          className={`docs-sb-code__tab${!open ? ' docs-sb-code__tab--active' : ''}`}
          onClick={() => setOpen(false)}
        >
          <Eye size={14} />
          Preview
        </button>
        <button
          type="button"
          className={`docs-sb-code__tab${open ? ' docs-sb-code__tab--active' : ''}`}
          onClick={() => setOpen(true)}
        >
          <Code2 size={14} />
          Code
        </button>
      </div>
      {open ? <CodeBlock code={code} language={language} /> : (
        <p className="docs-sb-code__hint">Switch to Code to copy the usage snippet.</p>
      )}
    </div>
  );
}

interface StorySectionProps {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
  language?: string;
  defaultCodeOpen?: boolean;
}

export function StorySection({
  title,
  description,
  preview,
  code,
  language = 'tsx',
  defaultCodeOpen = false,
}: StorySectionProps) {
  const [showCode, setShowCode] = useState(defaultCodeOpen);

  return (
    <article className="docs-sb-story">
      <header className="docs-sb-story__header">
        <h3 className="docs-sb-story__title">{title}</h3>
        {description ? <p className="docs-sb-story__desc">{description}</p> : null}
      </header>

      <StoryCanvas storyName={title} showToolbar={false} padded centered>
        {preview}
      </StoryCanvas>

      <div className="docs-sb-story__footer">
        <Button variant="ghost" size="sm" onClick={() => setShowCode((current) => !current)}>
          {showCode ? 'Hide code' : 'Show code'}
        </Button>
      </div>

      {showCode ? <StoryCodePanel code={code} language={language} defaultOpen /> : null}
    </article>
  );
}
