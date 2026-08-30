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
import { formatVisualRegressionReport } from './quality/visualManifest.js';
import { resolveSafePath } from './pathSafety.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const rootDir = resolve(process.cwd());

function hasFlag(flag: string): boolean {
  return args.includes(flag);
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
    case 'release': {
      const { output, ready } = await runRelease(rootDir, hasFlag('--json'));
      console.log(output);
      process.exit(ready ? 0 : 1);
      break;
    }
    default:
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
  larose release                Monorepo release readiness report
  larose release --json         JSON release report
`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
