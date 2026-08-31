import type { ReactNode } from 'react';
import type { StoryContext } from '@storybook/react';
import { CrossFrameworkHost, ReactOnlyFrameworkNotice } from './FrameworkHost';
import { getCrossFrameworkDefinition } from './registry';
import type { CrossFrameworkRenderArgs, StorybookFramework } from './types';

export function renderCrossFrameworkStory(context: StoryContext) {
  const registryId = context.parameters.laRose?.crossFramework as string | undefined;
  const definition = getCrossFrameworkDefinition(registryId);

  if (!definition) {
    return null;
  }

  const framework = (context.globals.framework as StorybookFramework) ?? 'react';
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

export function renderReactOnlyFrameworkGuard(context: StoryContext, children: ReactNode) {
  const framework = (context.globals.framework as StorybookFramework) ?? 'react';
  const isParity = Boolean(context.parameters.laRose?.crossFramework);

  if (isParity || framework === 'react') {
    return children;
  }

  return (
    <>
      <ReactOnlyFrameworkNotice framework={framework} />
      {children}
    </>
  );
}
