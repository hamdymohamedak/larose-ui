import { describe, expect, it } from 'vitest';
import {
  appendChangelogUnreleased,
  formatPackageList,
  planComponentScaffold,
  resolvePackageProfile,
  toPascalCase,
} from './componentScaffold';

describe('toPascalCase', () => {
  it('normalizes names', () => {
    expect(toPascalCase('status-pill')).toBe('StatusPill');
    expect(toPascalCase('StatusPill')).toBe('StatusPill');
    expect(toPascalCase('status pill')).toBe('StatusPill');
  });
});

describe('planComponentScaffold', () => {
  it('plans react UI component with styles and test', () => {
    const plan = planComponentScaffold('react', 'StatusPill');
    expect(plan.name).toBe('StatusPill');
    expect(plan.kind).toBe('ui-component');
    expect(plan.displayPaths.component).toBe(
      'packages/react/src/StatusPill/StatusPill.tsx',
    );
    expect(plan.displayPaths.test).toBe(
      'packages/react/src/StatusPill/StatusPill.test.tsx',
    );
    expect(plan.displayPaths.styles).toBe(
      'packages/styles/src/components/StatusPill/StatusPill.module.css',
    );
    expect(plan.indexUpdates[0]?.exportLines.join('\n')).toContain(
      "export { StatusPill } from './StatusPill/StatusPill'",
    );
    expect(plan.changelogPackages).toEqual(['react', 'styles']);
  });

  it('plans vue and svelte under components/', () => {
    const vue = planComponentScaffold('vue', 'StatusPill');
    expect(vue.displayPaths.component).toBe(
      'packages/vue/src/components/StatusPill/StatusPill.vue',
    );
    expect(vue.indexUpdates[0]?.exportLines[0]).toContain(
      "export { default as StatusPill } from './components/StatusPill/StatusPill.vue'",
    );

    const svelte = planComponentScaffold('svelte', 'StatusPill');
    expect(svelte.displayPaths.component).toBe(
      'packages/svelte/src/lib/components/StatusPill/StatusPill.svelte',
    );
  });

  it('plans tauri as module without styles', () => {
    const plan = planComponentScaffold('tauri', 'WindowBridge');
    expect(plan.kind).toBe('module');
    expect(plan.displayPaths.styles).toBeUndefined();
    expect(plan.displayPaths.component).toBe(
      'packages/tauri/src/windowBridge/windowBridge.ts',
    );
    expect(plan.changelogPackages).toEqual(['tauri']);
  });

  it('rejects invalid names', () => {
    expect(() => planComponentScaffold('react', '123')).toThrow(/Invalid/);
  });
});

describe('resolvePackageProfile', () => {
  it('falls back to generic for unknown packages', () => {
    const profile = resolvePackageProfile('network', {
      name: '@larose-ui/network',
      scripts: { build: 'tsup', test: 'vitest run' },
    });
    expect(profile.kind).toBe('module');
    expect(profile.framework).toBe('generic');
    expect(profile.usesSharedStyles).toBe(false);
  });
});

describe('appendChangelogUnreleased', () => {
  it('inserts Unreleased section after title', () => {
    const input = '# @larose-ui/react\n\n## 0.2.0\n\n### Minor Changes\n\n- old\n';
    const out = appendChangelogUnreleased(input, 'Scaffolded StatusPill component stub.');
    expect(out).toContain('## Unreleased');
    expect(out).toContain('### Minor Changes');
    expect(out).toContain('Scaffolded StatusPill component stub.');
    expect(out.indexOf('## Unreleased')).toBeLessThan(out.indexOf('## 0.2.0'));
  });

  it('appends to existing Unreleased', () => {
    const input =
      '# @larose-ui/react\n\n## Unreleased\n\n### Minor Changes\n\n- existing\n\n## 0.2.0\n';
    const out = appendChangelogUnreleased(input, 'Scaffolded Foo.');
    expect(out).toContain('- Scaffolded Foo.');
    expect(out).toContain('- existing');
  });
});

describe('formatPackageList', () => {
  it('lists known targets', () => {
    const text = formatPackageList();
    expect(text).toContain('react');
    expect(text).toContain('vue');
    expect(text).toContain('tauri');
    expect(text).toContain('make contribute');
  });
});
