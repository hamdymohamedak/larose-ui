import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertPackageStructure, runContributeComponent } from './contribute';
import { planComponentScaffold } from '@larose-ui/migration';

async function fakeMonorepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'larose-contribute-'));
  await mkdir(join(root, 'packages/react/src'), { recursive: true });
  await mkdir(join(root, 'packages/styles/src/components'), { recursive: true });
  await writeFile(
    join(root, 'packages/react/package.json'),
    JSON.stringify({ name: '@larose-ui/react', scripts: { build: 'tsup', test: 'vitest' } }),
  );
  await writeFile(join(root, 'packages/react/src/index.ts'), 'export {};\n');
  await writeFile(
    join(root, 'packages/react/CHANGELOG.md'),
    '# @larose-ui/react\n\n## 0.2.0\n\n### Minor Changes\n\n- baseline\n',
  );
  await writeFile(
    join(root, 'packages/styles/package.json'),
    JSON.stringify({ name: '@larose-ui/styles' }),
  );
  await writeFile(
    join(root, 'packages/styles/CHANGELOG.md'),
    '# @larose-ui/styles\n\n## 0.2.0\n\n### Minor Changes\n\n- baseline\n',
  );
  return root;
}

describe('runContributeComponent', () => {
  it('creates react stubs, styles, index export, and changelog', async () => {
    const root = await fakeMonorepo();
    const result = await runContributeComponent(root, 'react', 'StatusPill');

    expect(result.created).toContain('packages/react/src/StatusPill/StatusPill.tsx');
    expect(result.created).toContain('packages/react/src/StatusPill/StatusPill.test.tsx');
    expect(result.created).toContain(
      'packages/styles/src/components/StatusPill/StatusPill.module.css',
    );

    const component = await readFile(
      join(root, 'packages/react/src/StatusPill/StatusPill.tsx'),
      'utf-8',
    );
    expect(component).toContain('TODO: implement StatusPill');

    const index = await readFile(join(root, 'packages/react/src/index.ts'), 'utf-8');
    expect(index).toContain("export { StatusPill } from './StatusPill/StatusPill'");

    const changelog = await readFile(join(root, 'packages/react/CHANGELOG.md'), 'utf-8');
    expect(changelog).toContain('## Unreleased');
    expect(changelog).toContain('StatusPill');

    const stylesChangelog = await readFile(join(root, 'packages/styles/CHANGELOG.md'), 'utf-8');
    expect(stylesChangelog).toContain('StatusPill');
  });

  it('refuses to overwrite existing files', async () => {
    const root = await fakeMonorepo();
    await runContributeComponent(root, 'react', 'StatusPill');
    await expect(runContributeComponent(root, 'react', 'StatusPill')).rejects.toThrow(
      /overwrite/i,
    );
  });

  it('dry-run does not write files', async () => {
    const root = await fakeMonorepo();
    const result = await runContributeComponent(root, 'react', 'Ghost', { dryRun: true });
    expect(result.report).toContain('[dry-run]');
    await expect(
      readFile(join(root, 'packages/react/src/Ghost/Ghost.tsx'), 'utf-8'),
    ).rejects.toThrow();
  });
});

describe('assertPackageStructure', () => {
  it('fails when package is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'larose-missing-'));
    const plan = planComponentScaffold('react', 'X');
    await expect(assertPackageStructure(root, 'react', plan)).rejects.toThrow(/not found/i);
  });
});
