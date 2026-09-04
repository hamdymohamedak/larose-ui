<script setup lang="ts">
import { h, ref } from 'vue';
import { LaRoseProvider } from '@larose-ui/runtime-vue';
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
} from '@larose-ui/vue';
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

function tabGlyph(label: string) {
  return {
    render: () =>
      h(
        'span',
        { style: 'font-size:11px;font-weight:700', 'aria-hidden': 'true' },
        label.slice(0, 1),
      ),
  };
}

const TAB_ITEMS: LiquidGlassTabItem[] = [
  { key: 'home', label: 'Home', icon: tabGlyph('Home'), ariaLabel: 'Home' },
  { key: 'search', label: 'Search', icon: tabGlyph('Search'), ariaLabel: 'Search' },
  { key: 'create', label: 'Create', icon: tabGlyph('Create'), ariaLabel: 'Create' },
];

const nav = ref('discover');
const tab = ref('home');
const notifications = ref(true);
const volume = ref(55);
const clicks = ref(0);
</script>

<template>
  <LaRoseProvider theme="dark" locale="en" tenant-id="sandbox">
    <div class="sbx-glass-scene" data-sbx="liquid-glass">
      <LiquidGlassTopBar
        title="laRose"
        :items="TOP_BAR_ITEMS"
        :active-key="nav"
        position="relative"
        :top="0"
        :inset-x="0"
        v-bind="glassChrome"
        @change="nav = $event"
      />

      <div class="sbx-stack" style="margin-top: 20px">
        <p class="sbx-muted" style="margin: 0">
          Kitchen sink for liquid glass surfaces — refraction, specular rims, and chrome together.
        </p>

        <LiquidGlass
          width="100%"
          :height="200"
          v-bind="glassCard"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px',
            gap: '16px',
          }"
        >
          <div class="sbx-glass-card-copy">
            <h3>Glass card</h3>
            <p>Specular rim + aurora refraction via explicit sandbox optics props.</p>
          </div>

          <div class="sbx-stack" style="gap: 14px">
            <div class="sbx-glass-field">
              <span>Notifications</span>
              <LiquidGlassSwitch
                :checked="notifications"
                ariaLabel="Notifications"
                v-bind="glassControls"
                @change="notifications = $event"
              />
            </div>
            <LiquidGlassCheckbox label="Sync across devices" :default-checked="true" v-bind="glassControls" />
          </div>
        </LiquidGlass>

        <div class="sbx-stack" style="gap: 12px">
          <LiquidGlassRange :value="volume" ariaLabel="Volume" v-bind="glassControls" @change="volume = $event" />
          <LiquidGlassProgress :value="volume" ariaLabel="Storage used" v-bind="glassControls" />
        </div>

        <div class="sbx-glass-row">
          <LiquidGlassButton data-sbx="glass-button" v-bind="glassControls" @click="clicks += 1">
            Get started
          </LiquidGlassButton>
          <LiquidGlassButton
            :displacement-scale="22"
            :bezel-width="14"
            :show-specular="true"
            :specular-top-opacity="0.8"
            :specular-edge-opacity="0.55"
            :inner-top-highlight="0.4"
            tint="rgba(255,255,255,0.08)"
            border-color="rgba(255,255,255,0.35)"
          >
            Learn more
          </LiquidGlassButton>
          <LiquidGlassButton disabled v-bind="glassControls">Disabled</LiquidGlassButton>
        </div>

        <p class="sbx-muted" data-sbx="glass-clicks" style="margin: 0">Button clicks: {{ clicks }}</p>
      </div>

      <LiquidGlassTabBar
        :items="TAB_ITEMS"
        :active-key="tab"
        position="absolute"
        :bottom="16"
        v-bind="glassChrome"
        @change="tab = $event"
      />
    </div>
  </LaRoseProvider>
</template>
