import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  formatDoctorReport,
  formatDoctorJson,
  runDoctor,
  runGenerate,
  runMigrate,
  runRelease,
  runVisualRegressionCheck,
} from './doctor.js';
import { contributeListReport, runContributeComponent } from './contribute.js';
import { formatVisualRegressionReport } from '@larose-ui/quality-core';
import { resolveSafePath } from './pathSafety.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const rootDir = resolve(process.cwd());

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

function flagValue(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}

function printHelp(): void {
  console.log(`laRose CLI

Usage:
  larose doctor              Run quality checks
  larose doctor --ci         CI mode (warnings fail)
  larose doctor --json       JSON report for CI pipelines
  larose doctor --ci --json  Combined CI + JSON output
  larose visual-regression   Validate Storybook story manifest
  larose migrate --to 1.0.0       Migration report (dry run)
  larose migrate --to 1.0.0 --apply  Apply safe codemods
  larose generate form Name     Generate form scaffold
  larose generate page Name     Generate page scaffold
  larose generate feature Name  Generate full feature scaffold
  larose contribute list                    List contribution package targets
  larose contribute component Name --package react|vue|svelte|all
       Guided scaffold: adapters + styles + checklist
       Flags: --dry-run  --skip-styles  --skip-changelog  --skip-index
              --with-story
              --with-sandbox-hook <forms|overlays|...>
              --scenario <flow-id>
  larose release                Monorepo release readiness report
  larose release --json         JSON release report

Makefile shortcuts:
  make contribute NAME=StatusPill PACKAGE=all
  make contribute NAME=StatusPill PACKAGE=react WITH_STORY=1
  make contribute NAME=X PACKAGE=all SANDBOX_HOOK=forms
  make contribute-list
`);
}

async function main() {
  switch (command) {
    case 'doctor': {
      const options = {
        ci: hasFlag('--ci'),
        skipVisual: hasFlag('--skip-visual'),
        skipBrowser: hasFlag('--skip-browser'),
      };
      const result = await runDoctor(rootDir, options);
      if (hasFlag('--json')) {
        console.log(formatDoctorJson(result, options));
      } else {
        console.log(formatDoctorReport(result, options));
      }
      process.exit(result.passed ? 0 : 1);
      break;
    }
    case 'visual-regression': {
      const result = await runVisualRegressionCheck(rootDir);
      console.log(formatVisualRegressionReport(result));
      process.exit(result.passed ? 0 : 1);
      break;
    }
    case 'migrate': {
      const toIndex = args.indexOf('--to');
      const version = toIndex >= 0 ? args[toIndex + 1] ?? '1.0.0' : '1.0.0';
      const apply = args.includes('--apply');
      console.log(await runMigrate(rootDir, version, { apply }));
      break;
    }
    case 'generate': {
      const type = (args[1] as 'form' | 'page' | 'feature') ?? 'form';
      const name = args[2] ?? 'Example';
      const output = args[3];
      const code = runGenerate(type, name);
      if (output) {
        const safeOutput = resolveSafePath(rootDir, output);
        writeFileSync(safeOutput, code);
        console.log(`Generated ${safeOutput}`);
      } else {
        console.log(code);
      }
      break;
    }
    case 'contribute': {
      const sub = args[1] ?? 'list';
      if (sub === 'list' || sub === '--list') {
        console.log(contributeListReport());
        break;
      }
      if (sub === 'component' || sub === 'module') {
        const name = args[2];
        const packageId = flagValue('--package') ?? flagValue('-p') ?? flagValue('--to');
        if (!name || !packageId) {
          console.error(
            'Usage: larose contribute component <Name> --package <react|vue|svelte|all|...>',
          );
          process.exit(1);
        }
        try {
          const result = await runContributeComponent(rootDir, packageId, name, {
            dryRun: hasFlag('--dry-run'),
            skipStyles: hasFlag('--skip-styles'),
            skipChangelog: hasFlag('--skip-changelog'),
            skipIndex: hasFlag('--skip-index'),
            withStory: hasFlag('--with-story'),
            sandboxHook: flagValue('--with-sandbox-hook'),
            scenario: flagValue('--scenario'),
          });
          console.log(result.report);
        } catch (err) {
          console.error(err instanceof Error ? err.message : err);
          process.exit(1);
        }
        break;
      }
      console.error(`Unknown contribute subcommand: ${sub}`);
      console.error('Use: larose contribute list | larose contribute component Name --package react');
      process.exit(1);
      break;
    }
    case 'release': {
      const { output, ready } = await runRelease(rootDir, hasFlag('--json'));
      console.log(output);
      process.exit(ready ? 0 : 1);
      break;
    }
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      printHelp();
      process.exit(command === undefined ? 0 : 1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
