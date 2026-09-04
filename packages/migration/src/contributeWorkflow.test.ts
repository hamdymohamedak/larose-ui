import { describe, expect, it } from 'vitest';
import {
  formatContributeChecklist,
  formatContributeReport,
  formatPackageList,
  normalizeScenarioId,
  planComponentScaffold,
  planContributeExtras,
  resolvePackageIds,
  sandboxHookFilePaths,
} from './index';

describe('resolvePackageIds', () => {
  it('expands all to react+vue+svelte', () => {
    expect(resolvePackageIds('all')).toEqual(['react', 'vue', 'svelte']);
    expect(resolvePackageIds('react')).toEqual(['react']);
  });
});

describe('planContributeExtras', () => {
  it('plans story stub', () => {
    const extras = planContributeExtras('StatusPill', { withStory: true });
    expect(extras.displayPaths.story).toBe(
      'apps/playground/stories/StatusPill.stories.tsx',
    );
    expect(extras.files[0]?.contents).toContain('Foundation/StatusPill');
  });

  it('plans sandbox hooks for forms', () => {
    const extras = planContributeExtras('StatusPill', { sandboxHook: 'forms' });
    expect(extras.hookTargets).toHaveLength(3);
    expect(extras.hookTargets[0]?.comment).toBe('TODO: mount StatusPill');
    expect(sandboxHookFilePaths('forms')[0]).toContain('Forms.tsx');
  });

  it('plans new shared scenario flow', () => {
    const extras = planContributeExtras('StatusPill', { scenario: 'focus-trap' });
    expect(extras.files).toHaveLength(3);
    expect(extras.scenarioWiring.some((w) => w.kind === 'scenarios-catalog')).toBe(true);
    expect(extras.displayPaths.scenario?.[0]).toContain('FocusTrap.tsx');
  });

  it('rejects existing scenario ids for --scenario', () => {
    expect(() => normalizeScenarioId('forms')).toThrow(/already exists/);
  });
});

describe('formatContributeChecklist', () => {
  it('includes workflow and checklist items', () => {
    const lines = formatContributeChecklist().join('\n');
    expect(lines).toContain('[ ] Implement adapters');
    expect(lines).toContain('Core → Styles → Adapters');
    expect(lines).toContain('Never create sandbox-button');
  });
});

describe('formatContributeReport appendix', () => {
  it('appends checklist', () => {
    const plan = planComponentScaffold('react', 'StatusPill');
    const report = formatContributeReport(plan, ['packages/react/src/StatusPill/StatusPill.tsx'], {
      appendix: formatContributeChecklist(),
    });
    expect(report).toContain('Contributor checklist:');
    expect(report).toContain('Next steps:');
  });
});

describe('formatPackageList', () => {
  it('documents all and optional flags', () => {
    const text = formatPackageList();
    expect(text).toContain('PACKAGE=all');
    expect(text).toContain('--with-story');
    expect(text).toContain('--with-sandbox-hook');
    expect(text).toContain('--scenario');
  });
});
