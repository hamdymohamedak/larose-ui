import type { StoryContext } from '@storybook/react';
import { CrossFrameworkHost } from './FrameworkHost';
import {
  FRAMEWORK_TAG_PREFIX,
  isStorybookFramework,
  readToolbarFramework,
  resolveStoryFrameworks,
  storySupportsFramework,
} from './frameworkSupport';
import { getCrossFrameworkDefinition } from './registry';
import { crossFrameworkIdFromTitle } from './titleRegistry';
import type { CrossFrameworkRenderArgs, StorybookFramework } from './types';
import { UnsupportedFrameworkPanel } from './UnsupportedFramework';

export function resolveCrossFrameworkId(context: StoryContext): string | undefined {
  const explicit = context.parameters.laRose?.crossFramework as string | undefined;
  if (explicit) return explicit;
  return crossFrameworkIdFromTitle(context.title);
}

export function storyFrameworksFromContext(context: StoryContext): StorybookFramework[] {
  const laRose = (context.parameters.laRose ?? {}) as {
    frameworks?: StorybookFramework[];
    crossFramework?: string;
  };

  // Explicit override wins (used for React-only demos inside mixed files).
  if (laRose.frameworks && laRose.frameworks.length > 0) {
    return laRose.frameworks;
  }

  const fromTags = [
    ...new Set(
      (context.tags ?? [])
        .filter((tag) => tag.startsWith(FRAMEWORK_TAG_PREFIX))
        .map((tag) => tag.slice(FRAMEWORK_TAG_PREFIX.length))
        .filter(isStorybookFramework),
    ),
  ];
  if (fromTags.length > 0) {
    return fromTags;
  }

  const registryId = laRose.crossFramework ?? crossFrameworkIdFromTitle(context.title);

  return resolveStoryFrameworks({
    explicit: laRose.frameworks,
    registryFrameworks: getCrossFrameworkDefinition(registryId)?.frameworks,
  });
}

export function renderCrossFrameworkStory(context: StoryContext) {
  const registryId = resolveCrossFrameworkId(context);
  const definition = getCrossFrameworkDefinition(registryId);

  if (!definition) {
    return null;
  }

  const framework = readToolbarFramework(context.globals);
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
  const density =
    (context.globals.density as 'compact' | 'comfortable' | 'spacious') ?? 'comfortable';

  return (
    <CrossFrameworkHost
      definition={definition}
      args={context.args as CrossFrameworkRenderArgs}
      framework={framework}
      provider={{ theme, density }}
    />
  );
}

export function renderFrameworkAvailabilityGuard(context: StoryContext) {
  const framework = readToolbarFramework(context.globals);
  const supported = storyFrameworksFromContext(context);

  if (storySupportsFramework(framework, supported)) {
    return null;
  }

  const displayName =
    (context.parameters.laRose?.displayName as string | undefined) ?? context.title;

  return (
    <UnsupportedFrameworkPanel
      requested={framework}
      supported={supported}
      displayName={displayName}
    />
  );
}
