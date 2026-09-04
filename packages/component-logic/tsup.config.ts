import { defineConfig } from 'tsup';
import { readdirSync, existsSync } from 'node:fs';

const modules = readdirSync('src', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const entry = ['src/index.ts'];
for (const name of modules) {
  entry.push(`src/${name}/index.ts`);
  for (const file of ['utils-public.ts', 'standardMenus-public.ts', 'activityUtils-public.ts']) {
    const p = `src/${name}/${file}`;
    if (existsSync(p)) entry.push(p);
  }
}

export default defineConfig({
  entry,
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: true,
});
