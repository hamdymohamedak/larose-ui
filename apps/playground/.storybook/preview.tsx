import type { Preview } from '@storybook/react';
import '@larose/tokens/styles.css';
import { LaRoseProvider } from '@larose/runtime';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
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

      return (
        <LaRoseProvider
          theme={theme}
          density={density}
          locale={locale}
          environment={environment}
        >
          <div style={{ padding: '2rem', minWidth: 320 }}>
            <Story />
          </div>
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
