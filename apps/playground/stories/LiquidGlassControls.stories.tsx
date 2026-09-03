import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState, type ComponentProps } from 'react';
import {
  LiquidGlassCheckbox,
  LiquidGlassProgress,
  LiquidGlassRange,
  LiquidGlassSwitch,
} from '@larose-ui/react';
import { GlassScrollTestScene } from './glass/GlassScrollTestScene';
import {
  liquidGlassCheckboxArgTypes,
  liquidGlassCheckboxDefaults,
  liquidGlassProgressArgTypes,
  liquidGlassProgressDefaults,
  liquidGlassRangeArgTypes,
  liquidGlassRangeDefaults,
  liquidGlassSwitchArgTypes,
  liquidGlassSwitchDefaults,
} from './glass/liquidGlassStoryControls';
import { centerScene } from './glass/liquidGlassStoryItems';

type SwitchArgs = ComponentProps<typeof LiquidGlassSwitch>;
type ProgressArgs = ComponentProps<typeof LiquidGlassProgress>;
type RangeArgs = ComponentProps<typeof LiquidGlassRange> & { defaultValue: number };
type CheckboxArgs = ComponentProps<typeof LiquidGlassCheckbox>;

const panelStyle = {
  width: 'min(420px, 92vw)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 28,
  pointerEvents: 'auto' as const,
};

const meta: Meta = {
  title: 'Glass/LiquidGlass/Controls',
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Form controls built on the shared LiquidGlass surface — switch, checkbox, range slider, and progress bar.',
      },
    },
  },
};

export default meta;

function ControlledSwitch({
  defaultChecked,
  onChange: _storybookOnChange,
  ...props
}: SwitchArgs) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  useEffect(() => {
    setChecked(defaultChecked ?? false);
  }, [defaultChecked]);
  return (
    <LiquidGlassSwitch
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        _storybookOnChange?.(next);
      }}
    />
  );
}

function ControlledRange({
  defaultValue,
  onChange: _storybookOnChange,
  ...props
}: RangeArgs) {
  const [value, setValue] = useState(defaultValue ?? 50);
  useEffect(() => {
    setValue(defaultValue ?? 50);
  }, [defaultValue]);
  return (
    <LiquidGlassRange
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        _storybookOnChange?.(next);
      }}
    />
  );
}

function ControlledCheckbox({
  defaultChecked,
  onChange: _storybookOnChange,
  ...props
}: CheckboxArgs) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  useEffect(() => {
    setChecked(defaultChecked ?? false);
  }, [defaultChecked]);
  return (
    <LiquidGlassCheckbox
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        _storybookOnChange?.(next);
      }}
    />
  );
}

export const SwitchStory: StoryObj<SwitchArgs> = {
  name: 'Switch',
  argTypes: liquidGlassSwitchArgTypes,
  args: liquidGlassSwitchDefaults,
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(
        <div style={panelStyle}>
          <ControlledSwitch {...args} aria-label="Toggle" />
        </div>,
      )}
    </GlassScrollTestScene>
  ),
};

export const ProgressStory: StoryObj<ProgressArgs> = {
  name: 'Progress',
  argTypes: liquidGlassProgressArgTypes,
  args: liquidGlassProgressDefaults,
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(
        <div style={panelStyle}>
          <LiquidGlassProgress {...args} aria-label="Progress" />
        </div>,
      )}
    </GlassScrollTestScene>
  ),
};

export const ProgressIndeterminate: StoryObj<ProgressArgs> = {
  name: 'Progress / Indeterminate',
  parameters: { controls: { disable: true } },
  render: () => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(
        <div style={panelStyle}>
          <LiquidGlassProgress indeterminate aria-label="Loading" />
        </div>,
      )}
    </GlassScrollTestScene>
  ),
};

export const RangeStory: StoryObj<RangeArgs> = {
  name: 'Range',
  argTypes: liquidGlassRangeArgTypes,
  args: liquidGlassRangeDefaults,
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(
        <div style={panelStyle}>
          <ControlledRange {...args} aria-label="Volume" />
        </div>,
      )}
    </GlassScrollTestScene>
  ),
};

export const CheckboxStory: StoryObj<CheckboxArgs> = {
  name: 'Checkbox',
  argTypes: liquidGlassCheckboxArgTypes,
  args: liquidGlassCheckboxDefaults,
  render: (args) => (
    <GlassScrollTestScene contentPaddingBottom={80}>
      {centerScene(
        <div style={panelStyle}>
          <ControlledCheckbox {...args} />
        </div>,
      )}
    </GlassScrollTestScene>
  ),
};

export const AllControls: StoryObj = {
  name: 'All controls',
  parameters: { controls: { disable: true } },
  render: () => {
    const [on, setOn] = useState(true);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(68);
    const [progress, setProgress] = useState(45);

    useEffect(() => {
      const id = window.setInterval(() => {
        setProgress((v) => (v >= 100 ? 0 : v + 2));
      }, 120);
      return () => window.clearInterval(id);
    }, []);

    return (
      <GlassScrollTestScene contentPaddingBottom={80}>
        {centerScene(
          <div style={panelStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontSize: 14 }}>Notifications</span>
              <LiquidGlassSwitch checked={on} onChange={setOn} aria-label="Notifications" />
            </div>

            <LiquidGlassCheckbox
              label="Remember my settings"
              checked={checked}
              onChange={setChecked}
            />

            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8 }}>
                Volume — {volume}
              </div>
              <LiquidGlassRange value={volume} onChange={setVolume} aria-label="Volume" />
            </div>

            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8 }}>
                Download progress
              </div>
              <LiquidGlassProgress value={progress} aria-label="Download progress" />
            </div>
          </div>,
        )}
      </GlassScrollTestScene>
    );
  },
};
