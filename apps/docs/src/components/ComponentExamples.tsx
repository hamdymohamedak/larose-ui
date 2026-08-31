import { useMemo, useState } from 'react';
import { Button, Typography } from '@larose-ui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { PreviewFrame } from '@/components/PreviewFrame';
import type { DocsExampleEntry } from '@/data/examples.generated';
import { renderPlaygroundComponent } from '@/previews/playgroundRegistry';
import { playgroundControls } from '@/data/playground.generated';

interface ComponentExamplesProps {
  componentName: string;
  examples: DocsExampleEntry[];
}

export function ComponentExamples({ componentName, examples }: ComponentExamplesProps) {
  const [activeId, setActiveId] = useState(examples[0]?.id ?? 'basic');
  const active = examples.find((example) => example.id === activeId) ?? examples[0];

  const fallbackExamples = useMemo(() => {
    if (examples.length > 0) return examples;
    return [
      {
        id: 'basic',
        title: 'Basic',
        kind: 'basic',
        props: playgroundControls[componentName]
          ? Object.fromEntries(
              Object.entries(playgroundControls[componentName]).map(([key, control]) => [
                key,
                control.default ?? '',
              ]),
            )
          : {},
        code: `<${componentName}>Example</${componentName}>`,
      },
    ] satisfies DocsExampleEntry[];
  }, [componentName, examples]);

  const items = fallbackExamples;
  const current = active ?? items[0];

  if (!current) {
    return null;
  }

  return (
    <section id="examples" className="docs-examples">
      <h2>Examples</h2>
      <div className="docs-examples-tabs" role="tablist" aria-label={`${componentName} examples`}>
        {items.map((example) => (
          <Button
            key={example.id}
            role="tab"
            aria-selected={current.id === example.id}
            size="sm"
            variant={current.id === example.id ? 'primary' : 'outline'}
            onClick={() => setActiveId(example.id)}
          >
            {example.title}
          </Button>
        ))}
      </div>

      {current ? (
        <>
          {!current.composite && playgroundControls[componentName] ? (
            <PreviewFrame title={current.title}>
              {renderPlaygroundComponent(componentName, current.props)}
            </PreviewFrame>
          ) : (
            <Typography muted className="docs-card-copy">
              Composite example — see generated code and Storybook for full layout.
            </Typography>
          )}

          <div className="docs-code-toolbar">
            <Typography as="h3" role="title">
              Code
            </Typography>
            <CopyButton value={current.code} />
          </div>
          <CodeBlock code={current.code} language="tsx" title={current.title} />
        </>
      ) : null}
    </section>
  );
}
