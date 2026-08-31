import type { Density, MotionSemanticPreset, ReducedMotionPolicy, ThemeMode } from '@larose-ui/core';
import type {
  ColorTokens,
  ComponentTokenOverrides,
  TokenOverrides,
  TokenSet,
  TypographyRoles,
} from '@larose-ui/tokens';
import type { ThemePresetId } from './presets';

export interface LaRoseThemeMotionConfig {
  preset?: MotionSemanticPreset;
  reducedMotion?: ReducedMotionPolicy;
  duration?: Partial<TokenSet['duration']>;
  easing?: Partial<TokenSet['easing']>;
}

export interface LaRoseThemeTypographyInput {
  fontFamily?: string;
  roles?: Partial<TypographyRoles>;
}

export interface LaRoseThemeInput {
  /** Starting preset. Alias: `base`. Defaults to `refined`. */
  preset?: ThemePresetId;
  base?: ThemePresetId;
  /** Full token overrides merged on top of the preset. */
  tokens?: TokenOverrides;
  /** Shorthand for `tokens.colors`. */
  colors?: Partial<ColorTokens>;
  radius?: Partial<TokenSet['radius']>;
  spacing?: Partial<TokenSet['space']>;
  shadows?: Partial<TokenSet['shadow']>;
  typography?: LaRoseThemeTypographyInput;
  motion?: LaRoseThemeMotionConfig;
}

export interface LaRoseTheme extends LaRoseThemeInput {
  preset: ThemePresetId;
  tokens: TokenOverrides;
  motion: LaRoseThemeMotionConfig;
}

export interface ComponentDefaultPropsMap {
  Button: {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    buttonRole?: 'normal' | 'primary' | 'cancel' | 'destructive';
    shape?: 'capsule' | 'circle' | 'roundedRect';
    fullWidth?: boolean;
    flexible?: boolean;
    iconOnly?: boolean;
  };
  Input: {
    inputSize?: 'sm' | 'md' | 'lg';
    validateOn?: 'blur' | 'change';
    required?: boolean;
  };
  Card: {
    padding?: 'none' | 'sm' | 'md' | 'lg';
  };
  Modal: {
    closeOnOverlay?: boolean;
  };
  Drawer: {
    side?: 'left' | 'right';
    closeOnOverlay?: boolean;
  };
}

export interface ComponentMotionOverride {
  preset?: MotionSemanticPreset;
  duration?: number | string;
}

export interface ComponentConfigEntry {
  motion?: ComponentMotionOverride;
}

export type ComponentConfiguration = {
  [K in keyof ComponentDefaultPropsMap]?: ComponentConfigEntry & {
    defaultProps?: Partial<ComponentDefaultPropsMap[K]>;
    tokens?: K extends keyof ComponentTokenOverrides
      ? Partial<ComponentTokenOverrides[K]>
      : never;
  };
} & {
  Popover?: ComponentConfigEntry & {
    tokens?: Partial<ComponentTokenOverrides['Popover']>;
  };
  Collapse?: ComponentConfigEntry;
  Toast?: ComponentConfigEntry;
};

export interface ResolvedLaRoseTheme {
  preset: ThemePresetId;
  mode: ThemeMode;
  density: Density;
  tokenOverrides: TokenOverrides;
  brandColors: Partial<ColorTokens>;
  componentTokenOverrides: ComponentTokenOverrides;
  motion: LaRoseThemeMotionConfig;
}

export interface ResolveThemeInput {
  theme?: LaRoseThemeInput | LaRoseTheme;
  density?: Density;
  mode?: ThemeMode;
  /** @deprecated Use `theme.colors` instead. */
  brandColors?: Partial<ColorTokens>;
  /** @deprecated Use `theme.preset` instead. */
  themePreset?: ThemePresetId;
  components?: ComponentConfiguration;
}
