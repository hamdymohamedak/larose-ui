import {
  compileScript,
  compileTemplate,
  parse,
  type SFCDescriptor,
} from '@vue/compiler-sfc';
import type { CompileResult } from './types';
import { runEsmAsCjs } from './moduleRunner';
import { getPlaygroundRegistry } from './scopes';

function isSfc(source: string): boolean {
  return /<template[\s>]/.test(source) || /<script[\s>]/.test(source);
}

function assembleSfcModule(descriptor: SFCDescriptor, id: string): string {
  const script = compileScript(descriptor, { id, inlineTemplate: false });
  const template =
    descriptor.template != null
      ? compileTemplate({
          source: descriptor.template.content,
          filename: 'App.vue',
          id,
          compilerOptions: {
            bindingMetadata: script.bindings,
          },
        })
      : null;

  if (template?.errors?.length) {
    throw new Error(template.errors.map(String).join('\n'));
  }

  const scriptCode = script.content.replace(/export\s+default/, 'const __sfc_main =');
  const renderCode = template
    ? `${template.code.replace(/export\s+function\s+render/, 'function render').replace(/export\s+\{[\s\S]*$/, '')}
__sfc_main.render = render;`
    : '';

  return `${scriptCode}
${renderCode}
export default __sfc_main;
`;
}

export function compileVue(source: string): CompileResult {
  try {
    const registry = getPlaygroundRegistry();
    let moduleSource: string;
    let css = '';

    if (isSfc(source)) {
      const { descriptor, errors } = parse(source, { filename: 'App.vue' });
      if (errors.length) {
        throw new Error(errors.map((e) => e.message).join('\n'));
      }
      moduleSource = assembleSfcModule(descriptor, 'larose-live-vue');
      css = descriptor.styles.map((style) => style.content).join('\n');
    } else {
      moduleSource = source;
    }

    const exports = runEsmAsCjs(moduleSource, registry, {
      typescript: true,
      filename: 'App.vue.js',
    });

    const component = exports.default ?? exports.App;
    if (!component) {
      return {
        ok: false,
        framework: 'vue',
        error: 'Vue demo must export a default component.',
      };
    }

    return { ok: true, framework: 'vue', component, css: css || undefined };
  } catch (error) {
    return {
      ok: false,
      framework: 'vue',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
