import type { ReactNode } from 'react';
import { Typography } from '@larose-ui/react';
import { PreviewFrame } from '@/components/PreviewFrame';
import { findComponent } from '@/data/catalog.generated';
import { INTERACTIVE_PREVIEWS } from '@/previews/interactivePreviews';
import { GLASS_STATIC_PREVIEWS } from '@/previews/glass/glassPreviews';
import { isGlassDocComponent } from '@/lib/glassComponents';
import { STATIC_PREVIEWS } from '@/previews/staticPreviews';

export function getComponentPreview(componentName: string): ReactNode {
  if (isGlassDocComponent(componentName) && GLASS_STATIC_PREVIEWS[componentName]) {
    return GLASS_STATIC_PREVIEWS[componentName]();
  }

  const interactive = INTERACTIVE_PREVIEWS[componentName];
  if (interactive) return interactive();

  const staticPreview = STATIC_PREVIEWS[componentName];
  if (staticPreview) return staticPreview();

  return (
    <PreviewFrame title="Preview">
      <Typography muted>See Storybook for advanced states and platform variants.</Typography>
    </PreviewFrame>
  );
}

export function getComponentPreviewBySlug(slug: string): ReactNode {
  const component = findComponent(slug);
  if (!component) {
    return (
      <PreviewFrame title="Preview">
        <Typography muted>Component not found.</Typography>
      </PreviewFrame>
    );
  }
  return getComponentPreview(component.name);
}

export function hasComponentPreview(_slug: string): boolean {
  return true;
}
