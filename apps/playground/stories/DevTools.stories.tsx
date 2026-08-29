import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose/runtime';
import { DevToolsProvider } from '@larose/devtools';
import { Button, Card } from '@larose/react';

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
  title: 'DevOps/DevTools',
  component: DevToolsDemo,
};

export default meta;
type Story = StoryObj<typeof DevToolsDemo>;

export const Inspector: Story = {};
