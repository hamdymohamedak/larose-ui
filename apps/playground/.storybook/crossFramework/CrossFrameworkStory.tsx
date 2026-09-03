import type { StoryContext } from '@storybook/react';
import { CrossFrameworkHost } from './FrameworkHost';
import {
  readToolbarFramework,
  resolveStoryFrameworks,
  storySupportsFramework,
} from './frameworkSupport';
import { getCrossFrameworkDefinition } from './registry';
import type { CrossFrameworkRenderArgs, StorybookFramework } from './types';
import { UnsupportedFrameworkPanel } from './UnsupportedFramework';

export function storyFrameworksFromContext(context: StoryContext): StorybookFramework[] {
  const laRose = (context.parameters.laRose ?? {}) as {
    frameworks?: StorybookFramework[];
    crossFramework?: string;
  };

  return resolveStoryFrameworks({
    explicit: laRose.frameworks,
    registryFrameworks: getCrossFrameworkDefinition(laRose.crossFramework)?.frameworks,
  });
}

export function renderCrossFrameworkStory(context: StoryContext) {
  const registryId = context.parameters.laRose?.crossFramework as string | undefined;
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
