import type { ComponentProps } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Progress,
  Radio,
  Select,
  Spinner,
  Switch,
  Textarea,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from './types';

export const crossFrameworkRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  badge: {
    id: 'badge',
    displayName: 'Badge',
    componentName: 'Badge',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Draft', variant, ...rest }) => ({
      props: { variant, ...rest },
      slotText: label,
    }),
    argTypes: {
      label: { control: 'text' },
      variant: {
        control: 'select',
        options: ['default', 'info', 'success', 'warning', 'error'],
      },
    },
    renderReact: (props, slotText) => (
      <Badge variant={props.variant as never}>{slotText ?? 'Draft'}</Badge>
    ),
  },

  button: {
    id: 'button',
    displayName: 'Button',
    componentName: 'Button',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Save', variant, size, buttonRole, loading, disabled, ...rest }) => ({
      props: { variant, size, buttonRole, loading, disabled, ...rest },
      slotText: label,
    }),
    argTypes: {
      label: { control: 'text' },
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      },
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
      buttonRole: {
        control: 'select',
        options: ['normal', 'primary', 'cancel', 'destructive'],
      },
      loading: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props, slotText) => (
      <Button {...(props as unknown as ComponentProps<typeof Button>)}>{slotText ?? 'Save'}</Button>
    ),
  },

  label: {
    id: 'label',
    displayName: 'Label',
    componentName: 'Label',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Email', importance, htmlFor, ...rest }) => ({
      props: { importance, htmlFor, ...rest },
      slotText: label,
    }),
    argTypes: {
      label: { control: 'text' },
      importance: { control: 'select', options: ['primary', 'secondary'] },
      htmlFor: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Label {...(props as unknown as ComponentProps<typeof Label>)}>{slotText ?? 'Email'}</Label>
    ),
  },

  spinner: {
    id: 'spinner',
    displayName: 'Spinner',
    componentName: 'Spinner',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ size, ...rest }) => ({ props: { size, ...rest } }),
    argTypes: {
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
    renderReact: (props) => <Spinner {...(props as unknown as ComponentProps<typeof Spinner>)} />,
  },

  input: {
    id: 'input',
    displayName: 'Input',
    componentName: 'Input',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Email', value = '', placeholder, disabled, error, hint, ...rest }) => ({
      props: { label, value, placeholder, disabled, error, hint, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      placeholder: { control: 'text' },
      disabled: { control: 'boolean' },
      error: { control: 'text' },
      hint: { control: 'text' },
    },
    renderReact: (props) => <Input {...(props as unknown as ComponentProps<typeof Input>)} />,
  },

  textarea: {
    id: 'textarea',
    displayName: 'Textarea',
    componentName: 'Textarea',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Notes', value = '', rows, disabled, ...rest }) => ({
      props: { label, value, rows, disabled, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      rows: { control: 'number' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Textarea {...(props as unknown as ComponentProps<typeof Textarea>)} />,
  },

  checkbox: {
    id: 'checkbox',
    displayName: 'Checkbox',
    componentName: 'Checkbox',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Accept terms', checked, disabled, ...rest }) => ({
      props: { label, checked, disabled, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Checkbox {...(props as unknown as ComponentProps<typeof Checkbox>)} />,
  },

  radio: {
    id: 'radio',
    displayName: 'Radio',
    componentName: 'Radio',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({
      label = 'Option A',
      name = 'demo',
      value = 'a',
      checked,
      disabled,
      ...rest
    }) => ({
      props: { label, name, value, checked, disabled, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      name: { control: 'text' },
      value: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Radio {...(props as unknown as ComponentProps<typeof Radio>)} />,
  },

  switch: {
    id: 'switch',
    displayName: 'Switch',
    componentName: 'Switch',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Notifications', checked, disabled, ...rest }) => ({
      props: { label, checked, disabled, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Switch {...(props as unknown as ComponentProps<typeof Switch>)} />,
  },

  select: {
    id: 'select',
    displayName: 'Select',
    componentName: 'Select',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({
      label = 'Country',
      value = 'us',
      disabled,
      options = [
        { value: 'us', label: 'United States' },
        { value: 'de', label: 'Germany' },
        { value: 'eg', label: 'Egypt' },
      ],
      ...rest
    }) => ({
      props: { label, value, disabled, options, ...rest },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Select {...(props as unknown as ComponentProps<typeof Select>)} />,
  },

  progress: {
    id: 'progress',
    displayName: 'Progress',
    componentName: 'Progress',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ value = 40, max = 100, variant, label, ...rest }) => ({
      props: { value, max, variant, label, ...rest },
    }),
    argTypes: {
      value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
      max: { control: 'number' },
      variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
      label: { control: 'text' },
    },
    renderReact: (props) => <Progress {...(props as unknown as ComponentProps<typeof Progress>)} />,
  },

  alert: {
    id: 'alert',
    displayName: 'Alert',
    componentName: 'Alert',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Something went wrong', variant, title, ...rest }) => ({
      props: { variant, title, ...rest },
      slotText: label,
    }),
    argTypes: {
      label: { control: 'text' },
      title: { control: 'text' },
      variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    },
    renderReact: (props, slotText) => (
      <Alert {...(props as unknown as ComponentProps<typeof Alert>)}>{slotText ?? 'Alert'}</Alert>
    ),
  },

  card: {
    id: 'card',
    displayName: 'Card',
    componentName: 'Card',
    frameworks: ['react', 'vue', 'svelte'],
    mapArgs: ({ label = 'Card body content', title, ...rest }) => ({
      props: { title, ...rest },
      slotText: label,
    }),
    argTypes: {
      label: { control: 'text' },
      title: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Card {...(props as unknown as ComponentProps<typeof Card>)}>{slotText ?? 'Card body'}</Card>
    ),
  },
};

export function getCrossFrameworkDefinition(
  id: string | undefined,
): CrossFrameworkComponentDefinition | undefined {
  if (!id) return undefined;
  return crossFrameworkRegistry[id];
}
