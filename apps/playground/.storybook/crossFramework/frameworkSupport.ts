export type StorybookFramework = 'react' | 'vue' | 'svelte';

export const FRAMEWORK_LABELS: Record<StorybookFramework, string> = {
  react: 'React',
  vue: 'Vue 3',
  svelte: 'Svelte 5',
};

export const FRAMEWORK_PACKAGES: Record<StorybookFramework, string> = {
  react: '@larose-ui/react',
  vue: '@larose-ui/vue',
  svelte: '@larose-ui/svelte',
};

export const FRAMEWORK_TAG_PREFIX = 'fw-';

export function isStorybookFramework(value: unknown): value is StorybookFramework {
  return value === 'react' || value === 'vue' || value === 'svelte';
}

export function frameworkTag(framework: StorybookFramework): string {
  return `${FRAMEWORK_TAG_PREFIX}${framework}`;
}

export function frameworkAvailabilityTags(frameworks: StorybookFramework[]): string[] {
  return frameworks.map(frameworkTag);
}

export function resolveStoryFrameworks(options: {
  explicit?: StorybookFramework[];
  registryFrameworks?: StorybookFramework[];
}): StorybookFramework[] {
  if (options.explicit && options.explicit.length > 0) {
    return options.explicit;
  }
  if (options.registryFrameworks && options.registryFrameworks.length > 0) {
    return options.registryFrameworks;
  }
  return ['react'];
}

export function storySupportsFramework(
  requested: StorybookFramework,
  supported: StorybookFramework[],
): boolean {
  return supported.includes(requested);
}

export function storyIndexSupportsFramework(
  tags: readonly string[] | undefined,
  framework: StorybookFramework,
): boolean {
  const frameworkTags = (tags ?? []).filter((tag) => tag.startsWith(FRAMEWORK_TAG_PREFIX));
  if (frameworkTags.length === 0) {
    return framework === 'react';
  }
  return frameworkTags.includes(frameworkTag(framework));
}

export function readToolbarFramework(globals: Record<string, unknown> | undefined): StorybookFramework {
  const value = globals?.framework;
  return isStorybookFramework(value) ? value : 'react';
}
