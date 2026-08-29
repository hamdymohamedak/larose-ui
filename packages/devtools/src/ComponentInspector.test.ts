import { describe, expect, it } from 'vitest';
import { createDefaultRuntimeContext } from '@larose/core';
import { buildInspectorReadout } from './ComponentInspector';

describe('buildInspectorReadout', () => {
  it('includes runtime context slices', () => {
    const runtime = createDefaultRuntimeContext({
      session: 'authenticated',
      environment: 'staging',
      tenant: { id: 'acme', name: 'ACME' },
    });

    const lines = buildInspectorReadout(
      {
        name: 'EmployeeTable',
        source: 'observed',
        dataset: { 'data-lr-observed': 'EmployeeTable' },
        tagName: 'div',
      },
      runtime,
    );

    expect(lines.join('\n')).toContain('EmployeeTable');
    expect(lines.join('\n')).toContain('authenticated');
    expect(lines.join('\n')).toContain('staging');
    expect(lines.join('\n')).toContain('acme');
  });

  it('includes react props and performance metrics', () => {
    const lines = buildInspectorReadout(
      {
        name: 'EmployeeTable',
        source: 'observed',
        dataset: { 'data-lr-observed': 'EmployeeTable' },
        tagName: 'div',
        react: {
          displayName: 'ObservedComponent',
          props: { name: 'EmployeeTable', pageSize: '25' },
        },
      },
      null,
      {
        renderCount: 3,
        lastRenderMs: 18.2,
        avgRenderMs: 12.5,
        threshold: 'slow',
      },
    );

    const text = lines.join('\n');
    expect(text).toContain('React: ObservedComponent');
    expect(text).toContain('name=EmployeeTable');
    expect(text).toContain('Renders: 3');
    expect(text).toContain('Last render: 18.2ms (slow)');
    expect(text).toContain('Avg render: 12.5ms');
  });
});
