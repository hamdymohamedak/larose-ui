import type { Meta, StoryObj } from '@storybook/react';
import { crossFrameworkRegistry } from '../../.storybook/crossFramework/registry';

const meta: Meta = {
  title: 'Parity/Components',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compare the same component contract across React, Vue 3, and Svelte 5. Use the **Framework** toolbar control to switch implementations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function parityStory(
  registryId: keyof typeof crossFrameworkRegistry,
  args: Record<string, unknown>,
): Story {
  const definition = crossFrameworkRegistry[registryId];
  return {
    parameters: {
      laRose: { crossFramework: registryId },
    },
    argTypes: definition?.argTypes,
    args,
  };
}

export const Badge: Story = parityStory('badge', { label: 'Draft', variant: 'default' });

export const BadgeInfo: Story = parityStory('badge', { label: 'Beta', variant: 'info' });

export const Button: Story = parityStory('button', {
  label: 'Save changes',
  variant: 'primary',
});

export const ButtonLoading: Story = parityStory('button', {
  label: 'Saving…',
  variant: 'primary',
  loading: true,
});

export const Label: Story = parityStory('label', {
  label: 'Email address',
  importance: 'primary',
  htmlFor: 'email',
});

export const Spinner: Story = parityStory('spinner', { size: 'md' });

export const Input: Story = parityStory('input', {
  label: 'Email',
  placeholder: 'you@example.com',
  value: '',
});

export const InputWithError: Story = parityStory('input', {
  label: 'Email',
  value: 'not-an-email',
  error: 'Enter a valid email address',
});

export const Textarea: Story = parityStory('textarea', {
  label: 'Notes',
  value: 'Weekly sync at 3pm.',
  rows: 4,
});

export const Checkbox: Story = parityStory('checkbox', {
  label: 'Send me product updates',
  checked: true,
});

export const Radio: Story = parityStory('radio', {
  label: 'Standard shipping',
  name: 'shipping',
  value: 'standard',
  checked: true,
});

export const Switch: Story = parityStory('switch', {
  label: 'Enable notifications',
  checked: true,
});

export const Select: Story = parityStory('select', {
  label: 'Country',
  value: 'us',
});

export const Progress: Story = parityStory('progress', {
  value: 62,
  label: 'Uploading…',
});

export const Alert: Story = parityStory('alert', {
  title: 'Heads up',
  label: 'Your trial ends in 3 days.',
  variant: 'info',
});

export const Card: Story = parityStory('card', {
  title: 'Workspace',
  label: 'Invite teammates and manage billing from settings.',
});
