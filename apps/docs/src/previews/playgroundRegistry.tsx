import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Progress,
  Radio,
  Select,
  Spinner,
  Switch,
  Textarea,
  Typography,
} from '@larose-ui/react';
import type { ComponentType, ReactNode } from 'react';

export const PLAYGROUND_COMPONENTS: Record<string, ComponentType<any>> = {
  Button,
  Input,
  Badge,
  Checkbox,
  Radio,
  Switch,
  Progress,
  Alert,
  Card,
  Select,
  Textarea,
  Spinner,
  Typography,
};

export function renderPlaygroundComponent(
  componentName: string,
  props: Record<string, unknown>,
): ReactNode {
  const Component = PLAYGROUND_COMPONENTS[componentName];
  if (!Component) return null;

  if (componentName === 'Select') {
    return (
      <Select
        label={String(props.label ?? 'Department')}
        placeholder={String(props.placeholder ?? 'Choose department')}
        disabled={Boolean(props.disabled)}
        options={[
          { value: 'engineering', label: 'Engineering' },
          { value: 'design', label: 'Design' },
          { value: 'sales', label: 'Sales' },
        ]}
      />
    );
  }

  if (componentName === 'Switch') {
    return (
      <Switch
        key={String(props.checked)}
        label={String(props.label ?? 'Notifications')}
        defaultChecked={Boolean(props.checked)}
      />
    );
  }

  if (componentName === 'Checkbox') {
    return (
      <Checkbox
        label={String(props.label ?? 'Accept terms')}
        defaultChecked={Boolean(props.checked)}
        disabled={Boolean(props.disabled)}
      />
    );
  }

  if (componentName === 'Radio') {
    return (
      <Radio
        name="docs-radio"
        label={String(props.label ?? 'Option')}
        value="option"
        defaultChecked={Boolean(props.checked)}
        disabled={Boolean(props.disabled)}
      />
    );
  }

  if (componentName === 'Textarea') {
    return (
      <Textarea
        label={String(props.label ?? 'Description')}
        placeholder={String(props.placeholder ?? 'Enter details...')}
        disabled={Boolean(props.disabled)}
      />
    );
  }

  return <Component {...props} />;
}
