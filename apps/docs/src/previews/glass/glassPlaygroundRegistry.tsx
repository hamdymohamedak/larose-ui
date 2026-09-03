import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import {
  LiquidGlass,
  LiquidGlassButton,
  LiquidGlassCheckbox,
  LiquidGlassProgress,
  LiquidGlassRange,
  LiquidGlassSwitch,
  LiquidGlassTabBar,
  LiquidGlassTopBar,
} from '@larose-ui/react';
import {
  TAB_PRESETS,
  TOP_BAR_NAV_ITEMS,
  TopBarTrailingIcon,
  type TabBarTabPreset,
} from '@/previews/glass/glassPlaygroundItems';
import { LiquidGlassPreviewScene } from '@/previews/glass/LiquidGlassPreviewScene';
import {
  getGlassPlaygroundConfig,
  type GlassPlaygroundControl,
} from '@/previews/glass/glassPlaygroundControls';

const STRIP_KEYS = new Set(['label', 'tabPreset', 'showTrailing', 'showScrollContent']);

function prepareGlassProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props };
  for (const key of ['onChange', 'onClick', 'onDisplacementMapChange']) {
    delete next[key];
  }
  for (const key of ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'] as const) {
    if (next[key] === 0) delete next[key];
  }
  return next;
}

function ControlledSwitch(props: Record<string, unknown>) {
  const defaultChecked = Boolean(props.defaultChecked);
  const [checked, setChecked] = useState(defaultChecked);
  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);
  const { defaultChecked: _, ...rest } = props;
  return (
    <LiquidGlassSwitch
      {...(rest as object)}
      checked={checked}
      onChange={setChecked}
      aria-label="Toggle"
    />
  );
}

function ControlledRange(props: Record<string, unknown>) {
  const defaultValue = Number(props.defaultValue ?? 50);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const { defaultValue: _, ...rest } = props;
  return (
    <div style={{ width: 'min(100%, 340px)' }}>
      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 10 }}>
        Value — {value}
      </div>
      <LiquidGlassRange
        {...(rest as object)}
        value={value}
        onChange={setValue}
        aria-label="Volume"
      />
    </div>
  );
}

function ControlledCheckbox(props: Record<string, unknown>) {
  const defaultChecked = Boolean(props.defaultChecked);
  const [checked, setChecked] = useState(defaultChecked);
  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);
  const { defaultChecked: _, ...rest } = props;
  return (
    <LiquidGlassCheckbox {...(rest as object)} checked={checked} onChange={setChecked} />
  );
}

function renderGlassComponent(componentName: string, rawProps: Record<string, unknown>): ReactNode {
  const props = prepareGlassProps(rawProps);

  switch (componentName) {
    case 'LiquidGlass': {
      const label = String(props.label ?? 'Liquid glass');
      const { label: _, ...glassProps } = props;
      return (
        <LiquidGlass
          {...(glassProps as object)}
          style={{ display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <div>
            <div style={{ color: '#fff', fontWeight: 650, fontSize: 17, marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>
              Backdrop refracts through the bezel
            </div>
          </div>
        </LiquidGlass>
      );
    }
    case 'LiquidGlassButton': {
      const { children, ...buttonProps } = props;
      return (
        <LiquidGlassButton {...(buttonProps as unknown as ComponentProps<typeof LiquidGlassButton>)}>
          {String(children ?? 'Continue')}
        </LiquidGlassButton>
      );
    }
    case 'LiquidGlassSwitch':
      return <ControlledSwitch {...props} />;
    case 'LiquidGlassProgress':
      return (
        <div style={{ width: 'min(100%, 340px)' }}>
          {!props.indeterminate ? (
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 10 }}>
              Progress — {String(props.value ?? 0)}%
            </div>
          ) : null}
          <LiquidGlassProgress {...(props as object)} aria-label="Progress" />
        </div>
      );
    case 'LiquidGlassRange':
      return <ControlledRange {...props} />;
    case 'LiquidGlassCheckbox':
      return <ControlledCheckbox {...props} />;
    case 'LiquidGlassTabBar': {
      const preset = (props.tabPreset as TabBarTabPreset) ?? 'full';
      const { tabPreset: _, ...tabProps } = props;
      return (
        <LiquidGlassTabBar
          {...(tabProps as object)}
          position="absolute"
          bottom={18}
          items={TAB_PRESETS[preset]}
          style={{ pointerEvents: 'auto', width: 'min(100%, 420px)' }}
        />
      );
    }
    case 'LiquidGlassTopBar': {
      const showTrailing = Boolean(props.showTrailing);
      const { showTrailing: _, ...topProps } = props;
      return (
        <LiquidGlassTopBar
          {...(topProps as object)}
          position="absolute"
          top={16}
          insetX={16}
          items={TOP_BAR_NAV_ITEMS}
          trailing={showTrailing ? <TopBarTrailingIcon /> : undefined}
          style={{ pointerEvents: 'auto' }}
        />
      );
    }
    default:
      return null;
  }
}

export function renderGlassPlayground(
  componentName: string,
  values: Record<string, unknown>,
): ReactNode {
  const config = getGlassPlaygroundConfig(componentName);
  if (!config) return null;

  return (
    <LiquidGlassPreviewScene
      layout={config.layout}
      showScrollContent={config.showScrollContent ?? true}
    >
      {renderGlassComponent(componentName, values)}
    </LiquidGlassPreviewScene>
  );
}

export function initialGlassPlaygroundState(
  controls: Record<string, GlassPlaygroundControl>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(controls).map(([key, control]) => [key, control.default ?? '']),
  );
}

export function generateGlassComponentCode(
  componentName: string,
  values: Record<string, unknown>,
): string {
  const importLine = `import { ${componentName} } from '@larose-ui/react';`;
  const entries = Object.entries(values).filter(([key, value]) => {
    if (STRIP_KEYS.has(key) || value === '' || value === false) return false;
    const config = getGlassPlaygroundConfig(componentName)?.controls[key];
    if (config && value === config.default) return false;
    return true;
  });

  const propLines = entries.map(([key, value]) => {
    if (typeof value === 'string') return `  ${key}="${value}"`;
    if (typeof value === 'boolean') return `  ${key}`;
    return `  ${key}={${JSON.stringify(value)}}`;
  });

  const child = typeof values.children === 'string' ? values.children : 'Continue';
  const needsChildren = componentName === 'LiquidGlassButton';
  const selfClosing = !needsChildren;

  const body = selfClosing
    ? `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ' '}/>`
    : `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ''}>${child}</${componentName}>`;

  return `${importLine}\n\n${body}`;
}
