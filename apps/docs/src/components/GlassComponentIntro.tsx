import type { ReactNode } from 'react';
import { Typography } from '@larose-ui/react';
import { GLASS_COMPONENT_COPY } from '@/previews/glass/glassComponentCopy';

export function GlassComponentIntro({ componentName }: { componentName: string }) {
  const copy = GLASS_COMPONENT_COPY[componentName];
  if (!copy) return null;

  return (
    <section className="docs-glass-intro" aria-labelledby="glass-intro-heading">
      <p className="docs-glass-intro__tagline">{copy.tagline}</p>

      <div className="docs-glass-intro__grid">
        <GlassIntroCard title="Why liquid glass?" body={copy.why} />
        <GlassIntroCard title="The effect" body={copy.effect} />
        <GlassIntroCard title="When to use" body={copy.when} />
      </div>

      <p id="glass-intro-heading" className="docs-glass-intro__tip">
        <strong>Tip:</strong> Use the props controls beside the preview to tune optics and behavior —
        same aurora scene as Storybook. Scroll inside the preview in Chromium to see displacement
        refraction when colorful content passes under the glass bezel.
      </p>
    </section>
  );
}

function GlassIntroCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="docs-glass-intro__card">
      <h3 className="docs-glass-intro__card-title">{title}</h3>
      <p className="docs-glass-intro__card-body">{body}</p>
    </div>
  );
}

export function GlassPreviewHint(): ReactNode {
  return (
    <Typography muted className="docs-glass-preview-label">
      Live preview — scroll inside the scene to see refraction
    </Typography>
  );
}
