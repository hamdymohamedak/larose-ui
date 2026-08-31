import { useEffect, useMemo, useRef } from 'react';
import { StorybookProvider } from '../StorybookProvider';
import { mountSvelteStory } from './mountSvelte';
import { mountVueStory } from './mountVue';
import type {
  CrossFrameworkComponentDefinition,
  CrossFrameworkProviderContext,
  CrossFrameworkRenderArgs,
  StorybookFramework,
} from './types';
import { pickSupportedFramework } from './types';

const frameworkLabels: Record<StorybookFramework, string> = {
  react: 'React',
  vue: 'Vue 3',
  svelte: 'Svelte 5',
};

function FrameworkNotice({
  requested,
  active,
  definition,
}: {
  requested: StorybookFramework;
  active: StorybookFramework;
  definition: CrossFrameworkComponentDefinition;
}) {
  if (requested === active) return null;

  return (
    <div
      style={{
        marginBottom: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: 8,
        background: 'var(--larose-color-surface-secondary, #f4f4f5)',
        border: '1px solid var(--larose-color-border-subtle, #e4e4e7)',
        fontSize: 13,
      }}
    >
      {frameworkLabels[requested]} is not available for {definition.displayName}. Showing{' '}
      {frameworkLabels[active]} instead.
    </div>
  );
}

export function CrossFrameworkHost({
  definition,
  args,
  framework,
  provider,
}: {
  definition: CrossFrameworkComponentDefinition;
  args: CrossFrameworkRenderArgs;
  framework: StorybookFramework;
  provider: CrossFrameworkProviderContext;
}) {
  const activeFramework = pickSupportedFramework(framework, definition.frameworks);
  const mapped = useMemo(() => definition.mapArgs(args), [definition, args]);
  const mountRef = useRef<HTMLDivElement>(null);
  const mountKey = useMemo(
    () => JSON.stringify({ activeFramework, args, provider }),
    [activeFramework, args, provider],
  );

  useEffect(() => {
    const target = mountRef.current;
    if (!target || activeFramework === 'react') return;

    const cleanup =
      activeFramework === 'vue'
        ? mountVueStory(target, {
            componentName: definition.componentName,
            componentProps: mapped.props,
            slotText: mapped.slotText,
            provider,
          })
        : mountSvelteStory(target, {
            componentName: definition.componentName,
            componentProps: mapped.props,
            slotText: mapped.slotText,
            provider,
          });

    return cleanup;
  }, [activeFramework, definition.componentName, mapped, mountKey, provider]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          fontSize: 12,
          color: 'var(--larose-color-text-secondary, #71717a)',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Framework
        </span>
        <code
          style={{
            padding: '0.15rem 0.45rem',
            borderRadius: 6,
            background: 'var(--larose-color-surface-secondary, #f4f4f5)',
          }}
        >
          {frameworkLabels[activeFramework]}
        </code>
        <span>· {definition.displayName}</span>
      </div>

      <FrameworkNotice
        requested={framework}
        active={activeFramework}
        definition={definition}
      />

      {activeFramework === 'react' ? (
        <StorybookProvider theme={provider.theme} density={provider.density}>
          {definition.renderReact(mapped.props, mapped.slotText, provider)}
        </StorybookProvider>
      ) : (
        <div ref={mountRef} key={mountKey} />
      )}
    </div>
  );
}

export function ReactOnlyFrameworkNotice({
  framework,
}: {
  framework: StorybookFramework;
}) {
  if (framework === 'react') return null;

  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 8,
        border: '1px dashed var(--larose-color-border-subtle, #d4d4d8)',
        color: 'var(--larose-color-text-secondary, #71717a)',
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <strong>{frameworkLabels[framework]}</strong> rendering is only enabled for stories under{' '}
      <code>Parity/*</code>. Use the toolbar Framework control on parity stories, or open{' '}
      <code>Parity/{'{Component}'}</code> to compare implementations.
    </div>
  );
}
