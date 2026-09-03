import { useMemo, useState } from 'react';
import { Button, Checkbox, Typography } from '@larose-ui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { StoryCanvas } from '@/components/StoryCanvas';
import {
  generateGlassComponentCode,
  initialGlassPlaygroundState,
  renderGlassPlayground,
} from '@/previews/glass/glassPlaygroundRegistry';
import type { GlassPlaygroundControl } from '@/previews/glass/glassPlaygroundControls';

interface GlassPropsPlaygroundProps {
  componentName: string;
  controls: Record<string, GlassPlaygroundControl>;
}

function groupControls(controls: Record<string, GlassPlaygroundControl>) {
  const groups = new Map<string, Array<[string, GlassPlaygroundControl]>>();
  for (const entry of Object.entries(controls)) {
    const category = entry[1].category ?? 'Props';
    const list = groups.get(category) ?? [];
    list.push(entry);
    groups.set(category, list);
  }
  return [...groups.entries()];
}

export function GlassPropsPlayground({ componentName, controls }: GlassPropsPlaygroundProps) {
  const defaults = useMemo(() => initialGlassPlaygroundState(controls), [controls]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const code = useMemo(
    () => generateGlassComponentCode(componentName, values),
    [componentName, values],
  );
  const grouped = useMemo(() => groupControls(controls), [controls]);

  return (
    <section id="playground" className="docs-playground docs-sb-playground docs-glass-playground">
      <div className="docs-playground-grid docs-glass-playground__grid">
        <StoryCanvas storyName="Interactive preview" showToolbar={false} variant="glass">
          {renderGlassPlayground(componentName, values)}
        </StoryCanvas>

        <div className="docs-playground-controls docs-glass-playground__controls">
          <div className="docs-playground-controls-header">
            <Typography as="h3" role="title">
              Props controls
            </Typography>
            <Button variant="ghost" size="sm" onClick={() => setValues(defaults)}>
              Reset
            </Button>
          </div>

          {grouped.map(([category, fields]) => (
            <fieldset key={category} className="docs-glass-playground__category">
              <legend>{category}</legend>
              {fields.map(([key, control]) => (
                <GlassControlField
                  key={key}
                  name={key}
                  control={control}
                  value={values[key]}
                  onChange={(next) => setValues((current) => ({ ...current, [key]: next }))}
                />
              ))}
            </fieldset>
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

function GlassControlField({
  name,
  control,
  value,
  onChange,
}: {
  name: string;
  control: GlassPlaygroundControl;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const label = control.label ?? name;

  if (control.control === 'boolean') {
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
      <label className="docs-glass-playground__field">
        <span className="docs-glass-playground__label">{label}</span>
        <select
          className="docs-glass-playground__select"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          {(control.options ?? []).map((option) => (
            <option key={option} value={option}>
              {control.optionLabels?.[option] ?? option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (control.control === 'range' || control.control === 'number') {
    const numeric = Number(value);
    return (
      <label className="docs-glass-playground__field">
        <span className="docs-glass-playground__label">
          {label}
          <span className="docs-glass-playground__value">{numeric}</span>
        </span>
        <input
          className="docs-glass-playground__range"
          type="range"
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          value={numeric}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }

  if (control.control === 'color') {
    return (
      <label className="docs-glass-playground__field">
        <span className="docs-glass-playground__label">{label}</span>
        <input
          className="docs-glass-playground__color"
          type="color"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  return (
    <label className="docs-glass-playground__field">
      <span className="docs-glass-playground__label">{label}</span>
      <input
        className="docs-glass-playground__text"
        type="text"
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
