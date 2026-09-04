import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { DevToolsProvider } from '@larose-ui/devtools-react';
import { Button, Card } from '@larose-ui/react';

function DevToolsDemo() {
  return (
    <LaRoseProvider
      permissions={['employees.read', 'employees.write']}
      tenantId="acme"
      observabilityDebug
    >
      <DevToolsProvider>
        <Card title="DevTools Demo" padding="md">
          <p style={{ marginTop: 0 }}>
            Click the laRose button in the bottom-left corner to inspect runtime state.
          </p>
          <Button>Sample action</Button>
        </Card>
      </DevToolsProvider>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof DevToolsDemo> = {
  tags: ['fw-react'],
  title: 'DevOps/DevTools',
  component: DevToolsDemo,
  parameters: { laRose: { standalone: true } },
};

export default meta;
type Story = StoryObj<typeof DevToolsDemo>;

export const Inspector: Story = {};
