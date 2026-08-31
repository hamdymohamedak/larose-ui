import { useMemo, useState } from 'react';
import { Button, Checkbox, Input, Select, Switch, Typography } from '@larose-ui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import {
  PreviewToolbar,
  PreviewViewportFrame,
  type PreviewAppearance,
  type PreviewDirection,
  type PreviewViewport,
} from '@/components/PreviewToolbar';
import type { PlaygroundControl } from '@/data/playground.generated';
import { renderPlaygroundComponent } from '@/previews/playgroundRegistry';
import { PreviewFrame } from '@/components/PreviewFrame';

interface PropsPlaygroundProps {
  componentName: string;
  controls: Record<string, PlaygroundControl>;
}

function initialState(controls: Record<string, PlaygroundControl>) {
  return Object.fromEntries(
    Object.entries(controls).map(([key, control]) => [key, control.default ?? '']),
  );
}

function generateComponentCode(componentName: string, values: Record<string, unknown>) {
  const voidElements = new Set(['Spinner', 'Skeleton', 'Progress']);
  const entries = Object.entries(values).filter(([key, value]) => {
    if (value === '' || value === false) return false;
    const control = key;
    if (control === 'children' && value === 'Example') return false;
    return true;
  });

  const propLines = entries.map(([key, value]) => {
    if (typeof value === 'string') return `  ${key}="${value}"`;
    if (typeof value === 'boolean') return `  ${key}`;
    return `  ${key}={${JSON.stringify(value)}}`;
  });

  const child = typeof values.children === 'string' ? values.children : 'Example';
  if (voidElements.has(componentName)) {
    return `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ' '}/>`;
  }

  return `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ''}>${child}</${componentName}>`;
}

export function PropsPlayground({ componentName, controls }: PropsPlaygroundProps) {
  const defaults = useMemo(() => initialState(controls), [controls]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [direction, setDirection] = useState<PreviewDirection>('ltr');
  const [appearance, setAppearance] = useState<PreviewAppearance>('light');

  const code = useMemo(() => generateComponentCode(componentName, values), [componentName, values]);

  return (
    <section id="playground" className="docs-playground">
      <h2>Interactive playground</h2>
      <PreviewToolbar
        viewport={viewport}
        direction={direction}
        appearance={appearance}
        onViewportChange={setViewport}
        onDirectionChange={setDirection}
        onAppearanceChange={setAppearance}
      />

      <div className="docs-playground-grid">
        <PreviewFrame title="Live preview">
          <PreviewViewportFrame viewport={viewport} direction={direction} appearance={appearance}>
            {renderPlaygroundComponent(componentName, values)}
          </PreviewViewportFrame>
        </PreviewFrame>

        <div className="docs-playground-controls">
          <div className="docs-playground-controls-header">
            <Typography as="h3" role="title">
              Props controls
            </Typography>
            <Button variant="ghost" size="sm" onClick={() => setValues(defaults)}>
              Reset
            </Button>
          </div>

          {Object.entries(controls).map(([key, control]) => (
            <ControlField
              key={key}
              componentName={componentName}
              name={key}
              control={control}
              value={values[key]}
              onChange={(next) => setValues((current) => ({ ...current, [key]: next }))}
            />
          ))}
        </div>
      </div>

      <div className="docs-playground-code">
        <div className="docs-code-toolbar">
          <Typography as="h3" role="title">
            Generated code
          </Typography>
          <CopyButton value={code} />
        </div>
        <CodeBlock code={code} language="tsx" />
      </div>
    </section>
  );
}

function ControlField({
  componentName,
  name,
  control,
  value,
  onChange,
}: {
  componentName: string;
  name: string;
  control: PlaygroundControl;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const label = control.label ?? name;

  if (control.control === 'boolean') {
    if (componentName === 'Switch' && name === 'checked') {
      return (
        <Switch
          label={label}
          checked={Boolean(value)}
          onCheckedChange={(next) => onChange(next)}
        />
      );
    }
    return (
      <Checkbox
        label={label}
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  }

  if (control.control === 'select') {
    return (
      <Select
        label={label}
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        options={(control.options ?? []).map((option) => ({ value: option, label: option }))}
      />
    );
  }

  if (control.control === 'number') {
    return (
      <Input
        label={label}
        type="number"
        value={String(value)}
        min={control.min}
        max={control.max}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    );
  }

  return (
    <Input
      label={label}
      value={String(value ?? '')}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
