import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import type { LaRoseRuntimeContext } from '@larose-ui/core';
import type { ComponentPerformanceSummary } from '@larose-ui/devtools-core';
import { resolveReactComponentInfo, type ReactComponentInfo } from './reactFiber';

export interface InspectedElement {
  name: string;
  source: 'observed' | 'observed-form' | 'provider' | 'component';
  dataset: Record<string, string>;
  tagName: string;
  domNode?: Element;
  react?: ReactComponentInfo | null;
}

const INSPECTABLE_SELECTOR =
  '[data-lr-observed], [data-lr-observed-form], [data-lr-provider], [data-lr-component]';

export function useComponentInspector(active: boolean) {
  const [hovered, setHovered] = useState<InspectedElement | null>(null);
  const [selected, setSelected] = useState<InspectedElement | null>(null);

  const resolveElement = useCallback((target: Element): InspectedElement | null => {
    const el = target.closest(INSPECTABLE_SELECTOR);
    if (!el) return null;

    const observed = el.getAttribute('data-lr-observed');
    const observedForm = el.getAttribute('data-lr-observed-form');
    const component = el.getAttribute('data-lr-component');

    const name =
      observed ?? observedForm ?? component ?? (el.hasAttribute('data-lr-provider') ? 'LaRoseProvider' : 'unknown');

    const source = observed
      ? 'observed'
      : observedForm
        ? 'observed-form'
        : el.hasAttribute('data-lr-provider')
          ? 'provider'
          : 'component';

    const dataset: Record<string, string> = {};
    for (const attr of el.attributes) {
      if (attr.name.startsWith('data-lr-')) {
        dataset[attr.name] = attr.value;
      }
    }

    return {
      name,
      source,
      dataset,
      tagName: el.tagName.toLowerCase(),
      domNode: el,
      react: resolveReactComponentInfo(el),
    };
  }, []);

  useEffect(() => {
    if (!active) {
      setHovered(null);
      return;
    }

    const onMove = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest('[data-lr-devtools]')) {
        setHovered(null);
        return;
      }
      const info = resolveElement(target);
      setHovered(info);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest('[data-lr-devtools]')) return;

      const info = resolveElement(target);
      if (info) {
        event.preventDefault();
        event.stopPropagation();
        setSelected(info);
      }
    };

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [active, resolveElement]);

  return { hovered, selected, clearSelection: () => setSelected(null) };
}

export function InspectorOverlay({
  target,
}: {
  target: InspectedElement | null;
}) {
  if (!target || typeof document === 'undefined') return null;

  const el =
    target.domNode ??
    document.querySelector(
      `[data-lr-observed="${target.name}"], [data-lr-observed-form="${target.name}"], [data-lr-component="${target.name}"], [data-lr-provider]`,
    );
  if (!el || !(el instanceof HTMLElement)) return null;

  const rect = el.getBoundingClientRect();
  const style: CSSProperties = {
    position: 'fixed',
    top: rect.top - 2,
    left: rect.left - 2,
    width: rect.width + 4,
    height: rect.height + 4,
    border: '2px solid var(--lr-color-primary, #2563eb)',
    borderRadius: 4,
    pointerEvents: 'none',
    zIndex: 9998,
    boxShadow: '0 0 0 1px rgba(37, 99, 235, 0.3)',
  };

  return <div data-lr-inspector-overlay style={style} />;
}

export function buildInspectorReadout(
  element: InspectedElement,
  runtime: LaRoseRuntimeContext | null,
  performance?: ComponentPerformanceSummary | null,
): string[] {
  const lines = [
    `${element.name}`,
    `├── Source: ${element.source}`,
    `├── Tag: ${element.tagName}`,
  ];

  if (element.react) {
    lines.push(`├── React: ${element.react.displayName}`);
    const propEntries = Object.entries(element.react.props);
    if (propEntries.length > 0) {
      lines.push('├── Props:');
      for (const [key, value] of propEntries.slice(0, 12)) {
        lines.push(`│   ${key}=${value}`);
      }
      if (propEntries.length > 12) {
        lines.push(`│   … +${propEntries.length - 12} more`);
      }
    }
  }

  if (performance && performance.renderCount > 0) {
    lines.push(`├── Renders: ${performance.renderCount}`);
    if (performance.lastRenderMs !== null) {
      lines.push(
        `├── Last render: ${performance.lastRenderMs.toFixed(1)}ms (${performance.threshold ?? 'unknown'})`,
      );
    }
    if (performance.avgRenderMs !== null) {
      lines.push(`├── Avg render: ${performance.avgRenderMs.toFixed(1)}ms`);
    }
  }

  if (runtime) {
    lines.push(`├── Session: ${runtime.session}`);
    lines.push(`├── Environment: ${runtime.environment}`);
    lines.push(`├── Network: ${runtime.network.condition}${runtime.network.rtt ? ` (${runtime.network.rtt}ms)` : ''}`);
    lines.push(`├── Tenant: ${runtime.tenant?.id ?? 'none'}`);
    lines.push(`├── Locale: ${runtime.locale.locale} (${runtime.locale.dir})`);
    lines.push(`├── Theme: ${runtime.theme.mode} / ${runtime.theme.density}`);
    lines.push(`├── Permissions: ${runtime.permissions.granted.length} granted`);
    lines.push(`├── Features: ${Object.keys(runtime.features.flags).length} active`);
    lines.push(`└── API version: ${runtime.version.api ?? 'unknown'}`);
  }

  const dataAttrs = Object.entries(element.dataset);
  if (dataAttrs.length > 0) {
    lines.push('Dataset:');
    for (const [key, value] of dataAttrs) {
      lines.push(`  ${key}=${value}`);
    }
  }

  return lines;
}
