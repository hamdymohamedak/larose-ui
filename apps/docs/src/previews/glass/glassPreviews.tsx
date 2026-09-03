import type { ReactNode } from 'react';
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
import { LiquidGlassPreviewScene } from '@/previews/glass/LiquidGlassPreviewScene';
import { IconHome, IconProfile, IconSearch, IconSettings } from '@/previews/glass/glassPreviewIcons';

const TAB_ITEMS = [
  { key: 'home', label: 'Home', icon: <IconHome />, ariaLabel: 'Home' },
  { key: 'search', label: 'Search', icon: <IconSearch />, ariaLabel: 'Search' },
  { key: 'profile', label: 'Profile', icon: <IconProfile />, ariaLabel: 'Profile' },
];

const TOP_BAR_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'library', label: 'Library' },
];

export const GLASS_STATIC_PREVIEWS: Record<string, () => ReactNode> = {
  LiquidGlass: () => (
    <LiquidGlassPreviewScene layout="center">
      <LiquidGlass
        width="min(100%, 320px)"
        height={120}
        borderRadius={28}
        style={{ display: 'flex', alignItems: 'flex-end', padding: 20 }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 650, fontSize: 17, marginBottom: 4 }}>Glass card</div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>Backdrop refracts through the bezel</div>
        </div>
      </LiquidGlass>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassButton: () => (
    <LiquidGlassPreviewScene layout="center" showScrollContent={false}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <LiquidGlassButton style={{ minWidth: 160 }}>Get started</LiquidGlassButton>
        <LiquidGlassButton style={{ minWidth: 140 }} displacementScale={22} tint="rgba(255,255,255,0.07)">
          Learn more
        </LiquidGlassButton>
      </div>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassSwitch: () => (
    <LiquidGlassPreviewScene layout="center" showScrollContent={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#F3F1FA', fontSize: 14 }}>
          <span>Notifications</span>
          <LiquidGlassSwitch defaultChecked aria-label="Notifications" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#F3F1FA', fontSize: 14 }}>
          <span>Off</span>
          <LiquidGlassSwitch aria-label="Dark mode" />
        </div>
      </div>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassCheckbox: () => (
    <LiquidGlassPreviewScene layout="center" showScrollContent={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <LiquidGlassCheckbox label="Sync across devices" defaultChecked />
        <LiquidGlassCheckbox label="Send analytics" />
      </div>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassRange: () => (
    <LiquidGlassPreviewScene layout="center" showScrollContent={false}>
      <div style={{ width: 'min(100%, 340px)' }}>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 10 }}>Volume</div>
        <LiquidGlassRange defaultValue={62} aria-label="Volume" />
      </div>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassProgress: () => (
    <LiquidGlassPreviewScene layout="center" showScrollContent={false}>
      <div style={{ width: 'min(100%, 340px)' }}>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 10 }}>Downloading… 68%</div>
        <LiquidGlassProgress value={68} aria-label="Download progress" />
      </div>
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassTabBar: () => (
    <LiquidGlassPreviewScene layout="bottom-bar">
      <LiquidGlassTabBar
        position="absolute"
        bottom={18}
        items={TAB_ITEMS}
        defaultActiveKey="home"
        maxWidth={380}
        style={{ pointerEvents: 'auto' }}
      />
    </LiquidGlassPreviewScene>
  ),

  LiquidGlassTopBar: () => (
    <LiquidGlassPreviewScene layout="top-bar" showScrollContent>
      <LiquidGlassTopBar
        title="laRose"
        position="absolute"
        top={16}
        variant="floating"
        items={TOP_BAR_ITEMS}
        defaultActiveKey="discover"
        trailing={<IconSettings />}
        style={{ pointerEvents: 'auto' }}
      />
    </LiquidGlassPreviewScene>
  ),
};
