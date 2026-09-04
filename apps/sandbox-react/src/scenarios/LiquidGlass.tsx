import { useState } from 'react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import {
  LiquidGlass,
  LiquidGlassButton,
  LiquidGlassCheckbox,
  LiquidGlassProgress,
  LiquidGlassRange,
  LiquidGlassSwitch,
  LiquidGlassTabBar,
  LiquidGlassTopBar,
  type LiquidGlassOptics,
  type LiquidGlassTabItem,
} from '@larose-ui/react';
import {
  SANDBOX_GLASS_CARD,
  SANDBOX_GLASS_CHROME,
  SANDBOX_GLASS_CONTROLS,
} from '../../../sandbox-shared/liquidGlassOptics.js';

const glassControls = SANDBOX_GLASS_CONTROLS as unknown as LiquidGlassOptics;
const glassCard = SANDBOX_GLASS_CARD as unknown as LiquidGlassOptics & { borderRadius: number };
const glassChrome = SANDBOX_GLASS_CHROME as unknown as LiquidGlassOptics;

const TOP_BAR_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'library', label: 'Library' },
];

function TabGlyph({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700 }} aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  );
}

const TAB_ITEMS: LiquidGlassTabItem[] = [
  { key: 'home', label: 'Home', icon: <TabGlyph label="Home" />, ariaLabel: 'Home' },
  { key: 'search', label: 'Search', icon: <TabGlyph label="Search" />, ariaLabel: 'Search' },
  { key: 'create', label: 'Create', icon: <TabGlyph label="Create" />, ariaLabel: 'Create' },
];

function LiquidGlassDemo() {
  const [nav, setNav] = useState('discover');
  const [tab, setTab] = useState('home');
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(55);
  const [clicks, setClicks] = useState(0);

  return (
    <div className="sbx-glass-scene" data-sbx="liquid-glass">
      <LiquidGlassTopBar
        title="laRose"
        items={TOP_BAR_ITEMS}
        activeKey={nav}
        onChange={setNav}
        position="relative"
        top={0}
        insetX={0}
        {...glassChrome}
      />

      <div className="sbx-stack" style={{ marginTop: 20 }}>
        <p className="sbx-muted" style={{ margin: 0 }}>
          Kitchen sink for liquid glass surfaces — refraction, specular rims, and chrome together.
        </p>

        <LiquidGlass
          width="100%"
          height={200}
          {...glassCard}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 20,
            gap: 16,
          }}
        >
          <div className="sbx-glass-card-copy">
            <h3>Glass card</h3>
            <p>Specular rim + aurora refraction via explicit sandbox optics props.</p>
          </div>

          <div className="sbx-stack" style={{ gap: 14 }}>
            <div className="sbx-glass-field">
              <span>Notifications</span>
              <LiquidGlassSwitch
                checked={notifications}
                onChange={setNotifications}
                aria-label="Notifications"
                {...glassControls}
              />
            </div>
            <LiquidGlassCheckbox label="Sync across devices" defaultChecked {...glassControls} />
          </div>
        </LiquidGlass>

        <div className="sbx-stack" style={{ gap: 12 }}>
          <LiquidGlassRange
            value={volume}
            onChange={setVolume}
            aria-label="Volume"
            {...glassControls}
          />
          <LiquidGlassProgress value={volume} aria-label="Storage used" {...glassControls} />
        </div>

        <div className="sbx-glass-row">
          <LiquidGlassButton data-sbx="glass-button" onClick={() => setClicks((n) => n + 1)} {...glassControls}>
            Get started
          </LiquidGlassButton>
          <LiquidGlassButton
            displacementScale={22}
            bezelWidth={14}
            showSpecular
            specularTopOpacity={0.8}
            specularEdgeOpacity={0.55}
            innerTopHighlight={0.4}
            tint="rgba(255,255,255,0.08)"
            borderColor="rgba(255,255,255,0.35)"
          >
            Learn more
          </LiquidGlassButton>
          <LiquidGlassButton disabled {...glassControls}>
            Disabled
          </LiquidGlassButton>
        </div>

        <p className="sbx-muted" data-sbx="glass-clicks" style={{ margin: 0 }}>
          Button clicks: {clicks}
        </p>
      </div>

      <LiquidGlassTabBar
        items={TAB_ITEMS}
        activeKey={tab}
        onChange={setTab}
        position="absolute"
        bottom={16}
        {...glassChrome}
      />
    </div>
  );
}

export function LiquidGlassScenario() {
  return (
    <LaRoseProvider theme="dark" locale="en" tenantId="sandbox">
      <LiquidGlassDemo />
    </LaRoseProvider>
  );
}
