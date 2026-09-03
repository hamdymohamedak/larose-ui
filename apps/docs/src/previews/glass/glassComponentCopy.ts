export interface GlassComponentCopy {
  tagline: string;
  why: string;
  effect: string;
  when: string;
}

export const GLASS_COMPONENT_COPY: Record<string, GlassComponentCopy> = {
  LiquidGlass: {
    tagline: 'The base refracting surface — build any custom glass UI on top.',
    why: 'Standard blur-only “frosted glass” flattens depth. LiquidGlass bends the pixels behind the bezel using a displacement map, so edges feel thick and optical like iOS liquid glass.',
    effect: 'Chromium applies an SVG displacement filter to the backdrop; other browsers fall back to tuned frosted blur. Every optics prop (bezel width, displacement scale, specular rim) is exposed.',
    when: 'Use as a shell for cards, panels, or custom controls over photos, gradients, or live content.',
  },
  LiquidGlassTabBar: {
    tagline: 'Floating iOS-style tab bar with a morphing selection lens.',
    why: 'Bottom navigation is always over rich content — flat bars look pasted on. This bar refracts the scene behind it and slides a glass indicator between tabs.',
    effect: 'Shared LiquidGlass track + animated pill indicator. Tabs stay readable with high-contrast icons while the bezel picks up color from whatever scrolls underneath.',
    when: 'Primary app navigation on mobile-style layouts, dashboards, or media apps with colorful backgrounds.',
  },
  LiquidGlassButton: {
    tagline: 'Pill CTA with full liquid glass optics.',
    why: 'Primary actions on aurora or photo backgrounds need to feel tactile without opaque blocks that hide the scene.',
    effect: 'Convex squircle bezel refracts the backdrop; specular rim and inner highlights sell the glass thickness.',
    when: 'Hero CTAs, onboarding, and floating actions over non-solid backgrounds.',
  },
  LiquidGlassTopBar: {
    tagline: 'Floating top navigation with segmented glass control.',
    why: 'Top bars sit over scrolling content — glass keeps context visible while anchoring title and section switches.',
    effect: 'Three-column layout with a segmented nav track inside a single refracting shell; floating or edge variants.',
    when: 'Discover/browse flows, settings hubs, or any screen with section switching at the top.',
  },
  LiquidGlassSwitch: {
    tagline: 'Toggle with glass track and sliding glass thumb.',
    why: 'Settings on premium surfaces should match the rest of the liquid glass system instead of default flat switches.',
    effect: 'Dual LiquidGlass layers — track tint shifts when on; thumb slides with spring easing and its own refraction.',
    when: 'Feature toggles in glass panels, control centers, or notification settings.',
  },
  LiquidGlassRange: {
    tagline: 'Slider with glass track, fill, and draggable thumb.',
    why: 'Volume/brightness controls over colorful UI need a thumb that feels physical and picks up background color.',
    effect: 'Native range input for accessibility; visual layer uses glass track + moving thumb with displacement.',
    when: 'Media controls, filters, or any scalar value on glass surfaces.',
  },
  LiquidGlassProgress: {
    tagline: 'Progress bar with luminous glass fill.',
    why: 'Loading states on glass panels should glow through the bar instead of using flat system progress.',
    effect: 'Glass track with gradient fill; supports determinate value and indeterminate animation.',
    when: 'Downloads, uploads, or multi-step flows inside glass cards.',
  },
  LiquidGlassCheckbox: {
    tagline: 'Checkbox with glass box and animated checkmark.',
    why: 'Form controls in a glass settings sheet should share the same material language as buttons and switches.',
    effect: 'Glass square with tint shift when checked; checkmark scales in with spring motion.',
    when: 'Multi-select settings, consent toggles, or filters on glass backgrounds.',
  },
};
