import type { Preview, StoryContext } from '@storybook/react';
import { memo, type ComponentType } from 'react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import '@larose-ui/react/styles.css';
import {
  renderCrossFrameworkStory,
  renderReactOnlyFrameworkGuard,
} from './crossFramework/CrossFrameworkStory';
import { StorybookProvider, type StorybookLocale } from './StorybookProvider';

const StoryFrame = memo(function StoryFrame({
  children,
  fullscreen,
}: {
  children: React.ReactNode;
  fullscreen?: boolean;
}) {
  return (
    <div
      style={{
        padding: fullscreen ? 0 : '2rem',
        minWidth: 320,
        width: fullscreen ? '100%' : undefined,
      }}
    >
      {children}
    </div>
  );
});

function LaRoseDecorator({
  Story,
  context,
}: {
  Story: ComponentType;
  context: StoryContext;
}) {
  const crossFrameworkId = context.parameters.laRose?.crossFramework as string | undefined;
  const standalone = context.parameters.laRose?.standalone === true;
  const useRuntime = context.parameters.laRose?.runtime === true;
  const fullscreen = context.parameters.layout === 'fullscreen';

  if (crossFrameworkId) {
    const crossFrameworkStory = renderCrossFrameworkStory(context);
    if (crossFrameworkStory) {
      return <StoryFrame fullscreen={fullscreen}>{crossFrameworkStory}</StoryFrame>;
    }
  }

  const storyContent = (
    <StoryFrame fullscreen={fullscreen}>
      <Story />
    </StoryFrame>
  );

  const wrappedStory = renderReactOnlyFrameworkGuard(context, storyContent);

  if (standalone) {
    return wrappedStory;
  }

  const theme = context.globals.theme as 'light' | 'dark' | undefined;
  const density =
    (context.globals.density as 'compact' | 'comfortable' | 'spacious') ?? 'comfortable';
  const locale = (context.globals.locale as StorybookLocale) ?? 'en';
  const environment =
    (context.globals.environment as 'development' | 'staging' | 'demo' | 'readonly') ??
    'development';

  const providerOverrides = (context.parameters.laRose?.provider ?? {}) as Record<string, unknown>;

  return (
    <StorybookProvider
      runtime={useRuntime}
      theme={theme}
      density={density}
      locale={locale}
      environment={environment}
      providerOverrides={providerOverrides}
    >
      {wrappedStory}
    </StorybookProvider>
  );
}

const preview: Preview = {
  parameters: {
    controls: { expanded: false },
    docs: { autodocs: 'tag' },
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
  initialGlobals: {
    framework: 'react',
    theme: 'light',
    density: 'comfortable',
    locale: 'en',
    environment: 'development',
  },
  decorators: [(Story, context) => <LaRoseDecorator Story={Story} context={context} />],
  globalTypes: {
    framework: {
      description: 'Component implementation framework (Parity stories)',
      toolbar: {
        title: 'Framework',
        icon: 'batchaccept',
        items: [
          { value: 'react', title: 'React' },
          { value: 'vue', title: 'Vue 3' },
          { value: 'svelte', title: 'Svelte 5' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Theme mode',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'UI density',
      toolbar: {
        title: 'Density',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'spacious', title: 'Spacious' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Language',
      toolbar: {
        title: 'Locale',
        items: [
          { value: 'en', title: 'English' },
          { value: 'ar', title: 'Arabic (RTL)' },
          { value: 'de', title: 'German' },
        ],
        dynamicTitle: true,
      },
    },
    environment: {
      description: 'Runtime environment',
      toolbar: {
        title: 'Environment',
        items: [
          { value: 'development', title: 'Development' },
          { value: 'staging', title: 'Staging' },
          { value: 'demo', title: 'Demo' },
          { value: 'readonly', title: 'Read Only' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
