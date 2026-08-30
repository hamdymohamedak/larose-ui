import type { Preview, StoryContext } from '@storybook/react';
import { memo, type ComponentType } from 'react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
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
  const standalone = context.parameters.laRose?.standalone === true;
  const useRuntime = context.parameters.laRose?.runtime === true;
  const fullscreen = context.parameters.layout === 'fullscreen';

  const storyContent = (
    <StoryFrame fullscreen={fullscreen}>
      <Story />
    </StoryFrame>
  );

  if (standalone) {
    return storyContent;
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
      {storyContent}
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
    theme: 'light',
    density: 'comfortable',
    locale: 'en',
    environment: 'development',
  },
  decorators: [(Story, context) => <LaRoseDecorator Story={Story} context={context} />],
  globalTypes: {
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
