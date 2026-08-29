import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  formatDoctorReport,
  runDoctor,
  runGenerate,
  runMigrate,
} from './doctor.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const rootDir = resolve(process.cwd());

async function main() {
  switch (command) {
    case 'doctor': {
      const result = await runDoctor(rootDir);
      console.log(formatDoctorReport(result));
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
      const type = (args[1] as 'form' | 'page') ?? 'form';
      const name = args[2] ?? 'Example';
      const output = args[3];
      const code = runGenerate(type, name);
      if (output) {
        writeFileSync(output, code);
        console.log(`Generated ${output}`);
      } else {
        console.log(code);
      }
      break;
    }
    default:
      console.log(`laRose CLI

Usage:
  larose doctor              Run quality checks
  larose migrate --to 1.0.0       Migration report (dry run)
  larose migrate --to 1.0.0 --apply  Apply safe codemods
  larose generate form Name  Generate form scaffold
  larose generate page Name  Generate page scaffold
`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
