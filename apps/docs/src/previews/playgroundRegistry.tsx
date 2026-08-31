import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Progress,
  Select,
  Switch,
  Typography,
} from '@larose-ui/react';
import type { ComponentType, ReactNode } from 'react';

export const PLAYGROUND_COMPONENTS: Record<string, ComponentType<any>> = {
  Button,
  Input,
  Badge,
  Checkbox,
  Switch,
  Progress,
  Alert,
  Card,
  Select,
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

  return <Component {...props} />;
}
