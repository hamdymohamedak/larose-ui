export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export type DiagnosticCategory =
  | 'deprecation'
  | 'contract'
  | 'accessibility'
  | 'build'
  | 'browser'
  | 'visual';

export interface Diagnostic {
  severity: DiagnosticSeverity;
  category: DiagnosticCategory;
  message: string;
  fix?: string;
  file?: string;
}

export interface FrameworkTarget {
  id: string;
  componentsRoot: string;
  storiesDir?: string;
  storySuffix?: string;
  componentExtensions?: string[];
}

export interface LaRoseQualityConfig {
  frameworks: FrameworkTarget[];
}

export const DEFAULT_FRAMEWORK_TARGETS: FrameworkTarget[] = [
  {
    id: 'react',
    componentsRoot: 'packages/react/src',
    storiesDir: 'apps/playground/stories',
    storySuffix: '.stories.tsx',
    componentExtensions: ['.tsx'],
  },
];

export const DEFAULT_LAROSE_CONFIG: LaRoseQualityConfig = {
  frameworks: DEFAULT_FRAMEWORK_TARGETS,
};

export function resolveLaRoseConfig(raw?: Partial<LaRoseQualityConfig>): LaRoseQualityConfig {
  const frameworks =
    raw?.frameworks && raw.frameworks.length > 0 ? raw.frameworks : DEFAULT_FRAMEWORK_TARGETS;
  return {
    frameworks: frameworks.map((target) => ({
      storySuffix: '.stories.tsx',
      componentExtensions: ['.tsx'],
      ...target,
    })),
  };
}
