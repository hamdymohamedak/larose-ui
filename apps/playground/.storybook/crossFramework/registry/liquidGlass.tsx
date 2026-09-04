import type { ComponentProps, ReactNode } from 'react';
import {
  LiquidGlass,
  LiquidGlassTabBar,
  LiquidGlassTopBar,
  type LiquidGlassTabItem,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from '../types';
import {
  defineCustomParity,
  serializableProps,
  slotFromArgs,
} from '../defineParity';

const TabIcon = ({ label }: { label: string }) => (
  <span style={{ fontSize: 11, fontWeight: 700 }}>{label.slice(0, 1)}</span>
);

const TAB_PRESETS: Record<string, LiquidGlassTabItem[]> = {
  full: [
    { key: 'home', label: 'Home', icon: <TabIcon label="Home" />, ariaLabel: 'Home' },
    { key: 'search', label: 'Search', icon: <TabIcon label="Search" />, ariaLabel: 'Search' },
    { key: 'create', icon: <TabIcon label="Create" />, ariaLabel: 'Create' },
    { key: 'library', label: 'Library', icon: <TabIcon label="Library" />, ariaLabel: 'Library' },
    { key: 'profile', label: 'Profile', icon: <TabIcon label="Profile" />, ariaLabel: 'Profile' },
  ],
  iconsOnly: [
    { key: 'home', icon: <TabIcon label="Home" />, ariaLabel: 'Home' },
    { key: 'search', icon: <TabIcon label="Search" />, ariaLabel: 'Search' },
    { key: 'create', icon: <TabIcon label="Create" />, ariaLabel: 'Create' },
    { key: 'library', icon: <TabIcon label="Library" />, ariaLabel: 'Library' },
    { key: 'profile', icon: <TabIcon label="Profile" />, ariaLabel: 'Profile' },
  ],
  badges: [
    { key: 'home', label: 'Home', icon: <TabIcon label="Home" /> },
    { key: 'search', label: 'Search', icon: <TabIcon label="Search" /> },
    { key: 'notifs', label: 'Alerts', icon: <TabIcon label="Alerts" />, badge: 12 },
    { key: 'library', label: 'Library', icon: <TabIcon label="Library" />, badge: '•' },
    { key: 'settings', label: 'Settings', icon: <TabIcon label="Settings" /> },
  ],
  threeTabs: [
    { key: 'home', label: 'Home', icon: <TabIcon label="Home" /> },
    { key: 'search', label: 'Search', icon: <TabIcon label="Search" /> },
    { key: 'create', icon: <TabIcon label="Create" />, ariaLabel: 'Create' },
  ],
};

const TOP_BAR_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'library', label: 'Library' },
];

function resolveTabItems(tabPreset: unknown): LiquidGlassTabItem[] {
  const key = typeof tabPreset === 'string' ? tabPreset : 'full';
  return TAB_PRESETS[key] ?? TAB_PRESETS.full ?? [];
}

export const liquidGlassRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  liquidGlass: defineCustomParity({
    id: 'liquidGlass',
    displayName: 'LiquidGlass',
    componentName: 'LiquidGlassSurfaceDemo',
    mapArgs: ({ label, children, ...rest }) => ({
      props: {
        label: slotFromArgs({ label, children }, 'Liquid glass'),
        width: 280,
        height: 120,
        ...serializableProps(rest),
      },
      slotText: slotFromArgs({ label, children }, 'Liquid glass'),
    }),
    renderReact: (props, slotText) => (
      <LiquidGlass
        {...(props as unknown as ComponentProps<typeof LiquidGlass>)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
          ...(typeof props.style === 'object' && props.style && !Array.isArray(props.style)
            ? (props.style as object)
            : {}),
        }}
      >
        {slotText ?? (typeof props.label === 'string' ? props.label : 'Liquid glass')}
      </LiquidGlass>
    ),
  }),

  liquidGlassTabBar: defineCustomParity({
    id: 'liquidGlassTabBar',
    displayName: 'LiquidGlassTabBar',
    componentName: 'LiquidGlassTabBarDemo',
    mapArgs: ({ tabPreset = 'full', defaultActiveKey = 'home', items: _items, ...rest }) => ({
      props: {
        tabPreset,
        defaultActiveKey,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => {
      const { tabPreset, ...chrome } = props;
      return (
        <LiquidGlassTabBar
          {...(chrome as unknown as ComponentProps<typeof LiquidGlassTabBar>)}
          items={resolveTabItems(tabPreset)}
          defaultActiveKey={String(props.defaultActiveKey ?? 'home')}
        />
      );
    },
  }),

  liquidGlassTopBar: defineCustomParity({
    id: 'liquidGlassTopBar',
    displayName: 'LiquidGlassTopBar',
    componentName: 'LiquidGlassTopBarDemo',
    mapArgs: ({
      items: _items,
      defaultActiveKey = 'home',
      title = 'laRose',
      showTrailing = true,
      ...rest
    }) => ({
      props: {
        defaultActiveKey,
        title,
        showTrailing,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => {
      const { showTrailing, ...chrome } = props;
      return (
        <LiquidGlassTopBar
          {...(chrome as unknown as ComponentProps<typeof LiquidGlassTopBar>)}
          items={TOP_BAR_ITEMS}
          trailing={
            showTrailing === false ? undefined : (
              <span style={{ fontSize: 12, opacity: 0.8 }}>Account</span>
            )
          }
        />
      );
    },
  }),

  liquidGlassAllControls: defineCustomParity({
    id: 'liquidGlassAllControls',
    displayName: 'LiquidGlass Controls',
    componentName: 'LiquidGlassAllControlsDemo',
    mapArgs: () => ({ props: {} }),
    renderReact: () => null as ReactNode,
  }),
};
