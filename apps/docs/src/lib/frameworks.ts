import { isGlassDocComponent } from '@/lib/glassComponents';

export type DocsFramework = 'react' | 'vue' | 'svelte';

export const DOCS_FRAMEWORKS: { id: DocsFramework; label: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue 3' },
  { id: 'svelte', label: 'Svelte 5' },
];

/** Components with React, Vue, and Svelte bindings in the monorepo. */
export const PARITY_COMPONENTS = new Set([
  'Spinner',
  'Badge',
  'Label',
  'Button',
  'Input',
  'Textarea',
  'Checkbox',
  'Radio',
  'Switch',
  'Select',
  'Progress',
  'Alert',
  'Card',
  'Modal',
  'Dialog',
]);

export function getSupportedFrameworks(componentName: string): DocsFramework[] {
  if (PARITY_COMPONENTS.has(componentName)) {
    return ['react', 'vue', 'svelte'];
  }
  return ['react'];
}

export function frameworkLanguage(framework: DocsFramework): string {
  if (framework === 'vue') return 'vue';
  if (framework === 'svelte') return 'svelte';
  return 'tsx';
}

export type InstallStackMode = 'ui' | 'runtime';

export function getInstallCommand(
  framework: DocsFramework,
  _componentName?: string,
  stack: InstallStackMode = 'ui',
): string {
  const base = '@larose-ui/tokens @larose-ui/styles';
  if (framework === 'vue') {
    return stack === 'runtime'
      ? `pnpm add @larose-ui/vue @larose-ui/runtime-vue ${base}`
      : `pnpm add @larose-ui/vue ${base}`;
  }
  if (framework === 'svelte') {
    return stack === 'runtime'
      ? `pnpm add @larose-ui/svelte @larose-ui/runtime-svelte ${base}`
      : `pnpm add @larose-ui/svelte ${base}`;
  }
  return stack === 'runtime'
    ? `pnpm add @larose-ui/react @larose-ui/runtime-react ${base}`
    : `pnpm add @larose-ui/react ${base}`;
}

export function getImportCode(componentName: string, framework: DocsFramework): string {
  if (framework === 'vue') {
    return `import { ${componentName}, LaRoseProvider } from '@larose-ui/vue';`;
  }
  if (framework === 'svelte') {
    return `import { ${componentName}, LaRoseProvider } from '@larose-ui/svelte';`;
  }
  return `import { ${componentName} } from '@larose-ui/react';`;
}

export function getStylesImport(framework: DocsFramework): string {
  void framework;
  return `import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`;
}

export function getProviderSetup(framework: DocsFramework): string {
  const styles = getStylesImport(framework);

  if (framework === 'vue') {
    return `${styles}

// main.ts
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`;
  }

  if (framework === 'svelte') {
    return `${styles}

// +layout.svelte or App.svelte root
<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light">
  <slot />
</LaRoseProvider>`;
  }

  return `${styles}
import '@larose-ui/react/styles.css';

import { LaRoseProvider } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" density="comfortable">
  <App />
</LaRoseProvider>`;
}

const VOID_COMPONENTS = new Set(['Spinner', 'Skeleton']);

export function getUsageCode(componentName: string, framework: DocsFramework): string {
  if (framework === 'svelte') {
    if (VOID_COMPONENTS.has(componentName)) {
      return `<${componentName} />`;
    }
    if (componentName === 'Checkbox' || componentName === 'Radio' || componentName === 'Switch') {
      return `<${componentName} label="Enable notifications" checked />`;
    }
    if (componentName === 'Input' || componentName === 'Textarea' || componentName === 'Select') {
      return `<${componentName} label="Email" placeholder="you@example.com" />`;
    }
    return `<${componentName} variant="primary">
  {#snippet children()}Example{/snippet}
</${componentName}>`;
  }

  if (framework === 'vue') {
    if (VOID_COMPONENTS.has(componentName)) {
      return `<${componentName} />`;
    }
    if (componentName === 'Checkbox' || componentName === 'Radio' || componentName === 'Switch') {
      return `<${componentName} label="Enable notifications" :checked="true" />`;
    }
    if (componentName === 'Input' || componentName === 'Textarea' || componentName === 'Select') {
      return `<${componentName} label="Email" placeholder="you@example.com" />`;
    }
    return `<${componentName} variant="primary">Example</${componentName}>`;
  }

  if (isGlassDocComponent(componentName)) {
    const importLine = getImportCode(componentName, 'react');
    if (componentName === 'LiquidGlassSwitch') {
      return `${importLine}\n\n<LiquidGlassSwitch defaultChecked aria-label="Notifications" />`;
    }
    if (componentName === 'LiquidGlassCheckbox') {
      return `${importLine}\n\n<LiquidGlassCheckbox label="Enable notifications" defaultChecked />`;
    }
    if (componentName === 'LiquidGlassProgress') {
      return `${importLine}\n\n<LiquidGlassProgress value={62} aria-label="Progress" />`;
    }
    if (componentName === 'LiquidGlassRange') {
      return `${importLine}\n\n<LiquidGlassRange defaultValue={50} aria-label="Volume" />`;
    }
    if (componentName === 'LiquidGlassButton') {
      return `${importLine}\n\n<LiquidGlassButton>Continue</LiquidGlassButton>`;
    }
    return `${importLine}\n\n<${componentName} />`;
  }

  if (VOID_COMPONENTS.has(componentName)) {
    return `<${componentName} />`;
  }
  return `<${componentName}>Example</${componentName}>`;
}

export function getGettingStartedExample(framework: DocsFramework): string {
  if (framework === 'vue') {
    return `<script setup lang="ts">
import { LaRoseProvider, Button, Card, Input } from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider theme="light">
    <Card title="Hello laRose">
      <Input label="Name" placeholder="Your name" />
      <Button variant="primary">Save</Button>
    </Card>
  </LaRoseProvider>
</template>`;
  }

  if (framework === 'svelte') {
    return `<script lang="ts">
  import { LaRoseProvider, Button, Card, Input } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light">
  <Card title="Hello laRose">
    <Input label="Name" placeholder="Your name" />
    <Button variant="primary">
      {#snippet children()}Save{/snippet}
    </Button>
  </Card>
</LaRoseProvider>`;
  }

  return `import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" density="comfortable">
      <Card title="Hello laRose">
        <Input label="Name" placeholder="Your name" />
        <Button variant="primary">Save</Button>
      </Card>
    </LaRoseProvider>
  );
}`;
}


export function getCssImportOrder(framework: DocsFramework): string {
  const lines = [
    "import '@larose-ui/tokens/styles.css';",
    "import '@larose-ui/styles/styles.css';",
  ];
  if (framework === 'react') {
    lines.push("import '@larose-ui/react/styles.css';");
  }
  return lines.join('\n');
}
