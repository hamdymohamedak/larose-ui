export type GeneratorKind = 'form' | 'page' | 'feature';

export interface GeneratorOptions {
  permissionPrefix?: string;
  resource?: string;
}

function slug(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function generateForm(name: string, options: GeneratorOptions = {}): string {
  const id = options.resource ?? slug(name);
  return `import { Form } from '@larose-ui/forms-react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Can } from '@larose-ui/permissions-react';

const ${name}Schema = {
  id: '${id}',
  title: '${name}',
  fields: [
    { name: 'name', type: 'text' as const, label: 'Name', required: true },
  ],
};

export function ${name}Form() {
  return (
    <LaRoseProvider permissions={['${id}.write']}>
      <Can permission="${id}.write">
        <Form schema={${name}Schema} submitLabel="Save" />
      </Can>
    </LaRoseProvider>
  );
}
`;
}

export function generatePage(name: string, options: GeneratorOptions = {}): string {
  const resource = options.resource ?? slug(name);
  const permission = options.permissionPrefix ?? resource;

  return `import { LaRoseProvider } from '@larose-ui/runtime-react';
import { DataView } from '@larose-ui/data-react';
import { useJourneyPage } from '@larose-ui/observability-react';

export function ${name}Page() {
  useJourneyPage('${resource}');

  return (
    <LaRoseProvider permissions={['${permission}.read']} tenant={{ id: 'acme', name: 'ACME' }}>
      <DataView url="/api/${resource}" permission="${permission}.read">
        {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
      </DataView>
    </LaRoseProvider>
  );
}
`;
}

export function generateFeature(name: string, options: GeneratorOptions = {}): string {
  const resource = options.resource ?? slug(name);
  const permission = options.permissionPrefix ?? resource;
  const pascal = name.replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());

  return `import { LaRoseProvider } from '@larose-ui/runtime-react';
import { DataView } from '@larose-ui/data-react';
import { SmartTable } from '@larose-ui/ai-react';
import { DevToolsProvider } from '@larose-ui/devtools-react';
import { useJourneyPage } from '@larose-ui/observability-react';
import { Can } from '@larose-ui/permissions-react';
import { Card } from '@larose-ui/react';

interface ${pascal}Row {
  id: string;
  name: string;
}

export function ${name}Feature() {
  useJourneyPage('${resource}');

  return (
    <LaRoseProvider
      permissions={['${permission}.read']}
      tenant={{ id: 'acme', name: 'ACME' }}
      session="authenticated"
    >
      <DevToolsProvider>
        <Card title="${name}" padding="md">
          <Can permission="${permission}.read">
            <DataView<${pascal}Row[]> url="/api/${resource}" permission="${permission}.read">
              {(rows) => (
                <SmartTable
                  readPermission="${permission}.read"
                  data={rows}
                  keyExtractor={(row) => row.id}
                  columns={[
                    { key: 'id', header: 'ID', priority: 'low' },
                    { key: 'name', header: 'Name', priority: 'high' },
                  ]}
                />
              )}
            </DataView>
          </Can>
        </Card>
      </DevToolsProvider>
    </LaRoseProvider>
  );
}
`;
}

export function runGenerator(
  kind: GeneratorKind,
  name: string,
  options?: GeneratorOptions,
): string {
  switch (kind) {
    case 'form':
      return generateForm(name, options);
    case 'page':
      return generatePage(name, options);
    case 'feature':
      return generateFeature(name, options);
  }
}
