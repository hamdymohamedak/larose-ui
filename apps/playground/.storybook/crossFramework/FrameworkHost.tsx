import { useEffect, useMemo, useRef } from 'react';
import { StorybookProvider } from '../StorybookProvider';
import { FRAMEWORK_LABELS, storySupportsFramework } from './frameworkSupport';
import { mountSvelteStory } from './mountSvelte';
import { mountVueStory } from './mountVue';
import type {
  CrossFrameworkComponentDefinition,
  CrossFrameworkProviderContext,
  CrossFrameworkRenderArgs,
  StorybookFramework,
} from './types';
import { UnsupportedFrameworkPanel } from './UnsupportedFramework';

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
  const supported = storySupportsFramework(framework, definition.frameworks);
  const mapped = useMemo(() => definition.mapArgs(args), [definition, args]);
  const mountRef = useRef<HTMLDivElement>(null);
  const mountKey = useMemo(
    () => JSON.stringify({ framework, args, provider }),
    [framework, args, provider],
  );

  useEffect(() => {
    const target = mountRef.current;
    if (!target || !supported || framework === 'react') return;

    const cleanup =
      framework === 'vue'
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
  }, [supported, framework, definition.componentName, mapped, mountKey, provider]);

  if (!supported) {
    return (
      <UnsupportedFrameworkPanel
        requested={framework}
        supported={definition.frameworks}
        displayName={definition.displayName}
      />
    );
  }

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
          Mounted package
        </span>
        <code
          style={{
            padding: '0.15rem 0.45rem',
            borderRadius: 6,
            background: 'var(--larose-color-surface-secondary, #f4f4f5)',
          }}
        >
          {FRAMEWORK_LABELS[framework]}
        </code>
        <span>· {definition.displayName}</span>
      </div>

      {framework === 'react' ? (
        <StorybookProvider theme={provider.theme} density={provider.density}>
          {definition.renderReact(mapped.props, mapped.slotText, provider)}
        </StorybookProvider>
      ) : (
        <div ref={mountRef} key={mountKey} />
      )}
    </div>
  );
}
