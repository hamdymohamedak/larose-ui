import { useMemo } from 'react';
import { Typography } from '@larose-ui/react';
import { StorySection } from '@/components/StoryCanvas';
import type { DocsExampleEntry } from '@/data/examples.generated';
import { isGlassDocComponent } from '@/lib/glassComponents';
import { getComponentPreview } from '@/previews';
import { renderPlaygroundComponent } from '@/previews/playgroundRegistry';
import { playgroundControls } from '@/data/playground.generated';
import { getUsageCode } from '@/lib/frameworks';

interface ComponentExamplesProps {
  componentName: string;
  examples: DocsExampleEntry[];
}

function renderExamplePreview(componentName: string, example: DocsExampleEntry) {
  if (!example.composite && playgroundControls[componentName]) {
    const preview = renderPlaygroundComponent(componentName, example.props);
    if (preview) return preview;
  }

  return getComponentPreview(componentName);
}

export function ComponentExamples({ componentName, examples }: ComponentExamplesProps) {
  const items = useMemo(() => {
    if (examples.length > 0) return examples;
    return [
      {
        id: 'default',
        title: 'Default',
        kind: 'basic',
        props: {},
        code: getUsageCode(componentName, 'react'),
      },
    ] satisfies DocsExampleEntry[];
  }, [componentName, examples]);

  if (items.length === 0) return null;

  const isGlass = isGlassDocComponent(componentName);

  return (
    <section id="stories" className="docs-sb-stories">
      <div className="docs-sb-stories__header">
        <h2>Stories</h2>
        <Typography muted className="docs-sb-stories__lede">
          {isGlass
            ? 'Interactive aurora scene — scroll inside each preview so content passes under the glass and you can see displacement refraction (Chromium).'
            : 'Every variant from Storybook — preview, then show code to copy into your app.'}
        </Typography>
      </div>

      <div className="docs-sb-stories__list">
        {items.map((example) => (
          <StorySection
            key={example.id}
            title={example.title}
            preview={renderExamplePreview(componentName, example)}
            code={example.code}
            variant={isGlass ? 'glass' : 'default'}
          />
        ))}
      </div>
    </section>
  );
}
