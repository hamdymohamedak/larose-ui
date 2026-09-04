
export type SearchFieldPlacement =
  | 'toolbar-trailing'
  | 'sidebar-top'
  | 'inline'
  | 'tab-dedicated'
  | 'bottom-toolbar';

export type SearchFieldPlatform = 'ios' | 'ipados' | 'macos' | 'tvos' | 'visionos' | 'watchos';

export interface SearchToken {
  id: string;
  label: string;
  icon?: unknown;
}

export interface SearchScopeOption {
  id: string;
  label: string;
}

export interface SearchFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  platform?: SearchFieldPlatform;
  placement?: SearchFieldPlacement;
  /** Search while typing (default true). */
  immediate?: boolean;
  suggestions?: string[];
  recentSearches?: string[];
  scope?: {
    options: SearchScopeOption[];
    value: string;
    onChange: (scopeId: string) => void;
  };
  tokens?: SearchToken[];
  onTokenRemove?: (tokenId: string) => void;
  onTokenSelect?: (tokenId: string) => void;
  showDictation?: boolean;
  autoFocus?: boolean;
  className?: string;
  style?: Record<string, string | number>;
  'aria-label'?: string;
}

export interface SearchScopeBarProps {
  options: SearchScopeOption[];
  value: string;
  onChange: (scopeId: string) => void;
  className?: string;
  style?: Record<string, string | number>;
}

export interface SearchTokenChipProps {
  token: SearchToken;
  onRemove?: () => void;
  onSelect?: () => void;
}
