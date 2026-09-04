<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
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
  } from '@larose-ui/svelte';
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

  const TAB_ITEMS: LiquidGlassTabItem[] = [
    { key: 'home', label: 'Home', ariaLabel: 'Home' },
    { key: 'search', label: 'Search', ariaLabel: 'Search' },
    { key: 'create', label: 'Create', ariaLabel: 'Create' },
  ];

  let nav = $state('discover');
  let tab = $state('home');
  let notifications = $state(true);
  let volume = $state(55);
  let clicks = $state(0);
</script>

<LaRoseProvider theme="dark" locale="en" tenantId="sandbox">
  <div class="sbx-glass-scene" data-sbx="liquid-glass">
    <LiquidGlassTopBar
      title="laRose"
      items={TOP_BAR_ITEMS}
      activeKey={nav}
      onChange={(key: string) => (nav = key)}
      position="relative"
      top={0}
      insetX={0}
      {...glassChrome}
    />

    <div class="sbx-stack" style="margin-top: 20px">
      <p class="sbx-muted" style="margin: 0">
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
          padding: '20px',
          gap: '16px',
        }}
      >
        <div class="sbx-glass-card-copy">
          <h3>Glass card</h3>
          <p>Specular rim + aurora refraction via explicit sandbox optics props.</p>
        </div>

        <div class="sbx-stack" style="gap: 14px">
          <div class="sbx-glass-field">
            <span>Notifications</span>
            <LiquidGlassSwitch
              checked={notifications}
              onChange={(next: boolean) => (notifications = next)}
              ariaLabel="Notifications"
              {...glassControls}
            />
          </div>
          <LiquidGlassCheckbox label="Sync across devices" defaultChecked {...glassControls} />
        </div>
      </LiquidGlass>

      <div class="sbx-stack" style="gap: 12px">
        <LiquidGlassRange
          value={volume}
          onChange={(next: number) => (volume = next)}
          ariaLabel="Volume"
          {...glassControls}
        />
        <LiquidGlassProgress value={volume} ariaLabel="Storage used" {...glassControls} />
      </div>

      <div class="sbx-glass-row">
        <LiquidGlassButton
          data-sbx="glass-button"
          {...glassControls}
          onclick={() => (clicks += 1)}
        >
          Get started
        </LiquidGlassButton>
        <LiquidGlassButton
          displacementScale={22}
          bezelWidth={14}
          showSpecular={true}
          specularTopOpacity={0.8}
          specularEdgeOpacity={0.55}
          innerTopHighlight={0.4}
          tint="rgba(255,255,255,0.08)"
          borderColor="rgba(255,255,255,0.35)"
        >
          Learn more
        </LiquidGlassButton>
        <LiquidGlassButton disabled {...glassControls}>Disabled</LiquidGlassButton>
      </div>

      <p class="sbx-muted" data-sbx="glass-clicks" style="margin: 0">Button clicks: {clicks}</p>
    </div>

    <LiquidGlassTabBar
      items={TAB_ITEMS}
      activeKey={tab}
      onChange={(key: string) => (tab = key)}
      position="absolute"
      bottom={16}
      {...glassChrome}
    >
      {#snippet icon(item: LiquidGlassTabItem)}
        <span style="font-size:11px;font-weight:700" aria-hidden="true">
          {(item.label ?? item.ariaLabel ?? item.key).slice(0, 1)}
        </span>
      {/snippet}
    </LiquidGlassTabBar>
  </div>
</LaRoseProvider>
