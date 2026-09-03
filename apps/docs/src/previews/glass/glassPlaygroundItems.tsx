import type { LiquidGlassTabItem, LiquidGlassTopBarItem } from '@larose-ui/react';
import { IconHome, IconProfile, IconSearch, IconSettings } from '@/previews/glass/glassPreviewIcons';

export type TabBarTabPreset = 'full' | 'iconsOnly' | 'badges' | 'threeTabs';

function IconPlus({ size = 23 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={8.5} />
      <path d="M12 8.2v7.6M8.2 12h7.6" />
    </svg>
  );
}

function IconLibrary({ size = 23 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h9a2 2 0 0 1 2 2v14l-6.5-3.4L4 20V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function IconBell({ size = 23 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export const TAB_PRESETS: Record<TabBarTabPreset, LiquidGlassTabItem[]> = {
  full: [
    { key: 'home', icon: <IconHome />, label: 'Home', ariaLabel: 'Home' },
    { key: 'search', icon: <IconSearch />, label: 'Search', ariaLabel: 'Search' },
    { key: 'create', icon: <IconPlus />, ariaLabel: 'Create' },
    { key: 'library', icon: <IconLibrary />, label: 'Library', ariaLabel: 'Library' },
    { key: 'profile', icon: <IconProfile />, label: 'Profile', ariaLabel: 'Profile' },
  ],
  iconsOnly: [
    { key: 'home', icon: <IconHome />, ariaLabel: 'Home' },
    { key: 'search', icon: <IconSearch />, ariaLabel: 'Search' },
    { key: 'create', icon: <IconPlus />, ariaLabel: 'Create' },
    { key: 'library', icon: <IconLibrary />, ariaLabel: 'Library' },
    { key: 'profile', icon: <IconProfile />, ariaLabel: 'Profile' },
  ],
  badges: [
    { key: 'home', icon: <IconHome />, label: 'Home' },
    { key: 'search', icon: <IconSearch />, label: 'Search' },
    { key: 'notifs', icon: <IconBell />, label: 'Alerts', badge: 12 },
    { key: 'library', icon: <IconLibrary />, label: 'Library', badge: '•' },
    { key: 'settings', icon: <IconSettings />, label: 'Settings' },
  ],
  threeTabs: [
    { key: 'home', icon: <IconHome />, label: 'Home' },
    { key: 'search', icon: <IconSearch />, label: 'Search' },
    { key: 'create', icon: <IconPlus />, ariaLabel: 'Create' },
  ],
};

export const TOP_BAR_NAV_ITEMS: LiquidGlassTopBarItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'library', label: 'Library' },
];

export function TopBarTrailingIcon() {
  return (
    <button
      type="button"
      aria-label="Settings"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 999,
        border: 'none',
        background: 'rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 16,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <IconSettings />
    </button>
  );
}
