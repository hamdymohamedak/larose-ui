import type { Preview } from '@storybook/react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
import { LaRoseProvider } from '@larose-ui/runtime';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
  initialGlobals: {
    theme: 'light',
    density: 'comfortable',
    locale: 'en',
    environment: 'development',
  },
  decorators: [
    (Story, context) => {
      const standalone = context.parameters.laRose?.standalone === true;

      const storyContent = (
        <div
          style={{
            padding: context.parameters.layout === 'fullscreen' ? 0 : '2rem',
            minWidth: 320,
            width: context.parameters.layout === 'fullscreen' ? '100%' : undefined,
          }}
        >
          <Story />
        </div>
      );

      if (standalone) {
        return storyContent;
      }

      const theme = context.globals.theme as 'light' | 'dark' | undefined;
      const density =
        (context.globals.density as 'compact' | 'comfortable' | 'spacious') ??
        'comfortable';
      const locale = (context.globals.locale as 'en' | 'ar' | 'de') ?? 'en';
      const environment =
        (context.globals.environment as
          | 'development'
          | 'staging'
          | 'demo'
          | 'readonly') ?? 'development';

      const providerOverrides = (context.parameters.laRose?.provider ?? {}) as Record<
        string,
        unknown
      >;

      return (
        <LaRoseProvider
          theme={theme}
          appearance={theme ?? 'system'}
          density={density}
          locale={locale}
          environment={environment}
          {...providerOverrides}
        >
          {storyContent}
        </LaRoseProvider>
      );
    },
  ],
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
