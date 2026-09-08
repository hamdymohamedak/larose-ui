import { describe, expect, it } from 'vitest';
import {
  planContributeRemoval,
  removeScaffoldChangelogBullet,
  stripIndexExportLines,
  stripSandboxHookComment,
} from './contributeRemove';
import { appendChangelogUnreleased, planComponentScaffold } from './componentScaffold';

describe('stripIndexExportLines', () => {
  it('removes Activity exports without touching ActivityView', () => {
    const plan = planComponentScaffold('react', 'Activity');
    const source = `export { ActivityView } from './Sharing/ActivityView';
export type { ActivityViewProps } from './Sharing/ActivityView';

export { Activity } from './Activity/Activity';
export type { ActivityProps } from './Activity/Activity';
`;
    const next = stripIndexExportLines(source, plan.indexUpdates[0]!.exportLines);
    expect(next).toContain("export { ActivityView } from './Sharing/ActivityView'");
    expect(next).not.toContain("export { Activity } from './Activity/Activity'");
    expect(next).not.toContain('ActivityProps');
  });
});

describe('removeScaffoldChangelogBullet', () => {
  it('removes the Unreleased scaffold bullet for that name only', () => {
    let changelog = '# @larose-ui/react\n\n## 0.2.0\n';
    changelog = appendChangelogUnreleased(
      changelog,
      'Scaffolded Activity component stub for contributor implementation.',
    );
    changelog = appendChangelogUnreleased(
      changelog,
      'Scaffolded StatusPill component stub for contributor implementation.',
    );
    const next = removeScaffoldChangelogBullet(changelog, 'Activity');
    expect(next).not.toContain('Scaffolded Activity');
    expect(next).toContain('Scaffolded StatusPill');
    expect(next).toContain('## Unreleased');
  });
});

describe('stripSandboxHookComment', () => {
  it('removes the TODO mount comment', () => {
    const input = `export function FormsScenario() { return null; }\n{/* TODO: mount StatusPill */}\n`;
    expect(stripSandboxHookComment(input, 'TODO: mount StatusPill')).not.toContain(
      'TODO: mount StatusPill',
    );
  });
});

describe('planContributeRemoval', () => {
  it('targets the same react + styles folders contribute creates', () => {
    const plan = planContributeRemoval(['react'], 'Activity');
    expect(plan.directories).toContain('packages/react/src/Activity');
    expect(plan.directories).toContain('packages/styles/src/components/Activity');
    expect(plan.optionalFiles).toContain('apps/playground/stories/Activity.stories.tsx');
    expect(plan.notes.some((n) => n.includes('Storybook'))).toBe(true);
    expect(plan.indexUpdates[0]?.exportLines.join('\n')).toContain(
      "export { Activity } from './Activity/Activity'",
    );
  });

  it('always targets Storybook even when removing a vue-only package id', () => {
    const plan = planContributeRemoval(['vue'], 'StatusPill');
    expect(plan.optionalFiles).toContain('apps/playground/stories/StatusPill.stories.tsx');
  });

  it('does not point at namesake folders like Sharing/ActivityView', () => {
    const plan = planContributeRemoval(['react'], 'Activity');
    expect(plan.directories.join('\n')).not.toContain('Sharing');
  });
});
