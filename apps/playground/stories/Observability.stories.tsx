import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LaRoseProvider } from '@larose/runtime';
import {
  ObservedForm,
  ObservedComponent,
  ObservedErrorBoundary,
  useObservability,
  useInteractionObserver,
} from '@larose/observability';
import { Form } from '@larose/forms';
import { Button, Card } from '@larose/react';

function MetricsPanel() {
  const { getFormFunnelMetrics, exportPrometheus } = useObservability();
  const metrics = getFormFunnelMetrics('employee-create');
  const [prometheus, setPrometheus] = useState('');

  return (
    <Card title="Form Funnel Metrics" padding="md">
      <dl style={{ fontSize: '0.875rem', margin: 0 }}>
        <dt>Opens</dt>
        <dd>{metrics.opens}</dd>
        <dt>Submissions</dt>
        <dd>{metrics.submissions}</dd>
        <dt>Successes</dt>
        <dd>{metrics.successes}</dd>
        <dt>Completion Rate</dt>
        <dd>{(metrics.completionRate * 100).toFixed(0)}%</dd>
        <dt>Abandonment Rate</dt>
        <dd>{(metrics.abandonmentRate * 100).toFixed(0)}%</dd>
      </dl>
      <Button size="sm" variant="outline" onClick={() => setPrometheus(exportPrometheus())}>
        Export Prometheus
      </Button>
      {prometheus && (
        <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflow: 'auto' }}>
          {prometheus}
        </pre>
      )}
    </Card>
  );
}

function RageClickDemo() {
  const { onClick } = useInteractionObserver('rage-demo-button');
  return (
    <Button onClick={(e) => onClick(e)} variant="secondary">
      Click rapidly to trigger rage_click event
    </Button>
  );
}

function BrokenComponent() {
  throw new Error('Intentional render error for observability demo');
}

function ObservabilityDemo() {
  const [showBroken, setShowBroken] = useState(false);

  const schema = {
    id: 'employee-create',
    title: 'Create Employee',
    fields: [
      { name: 'name', type: 'text' as const, label: 'Name', required: true },
      { name: 'role', type: 'text' as const, label: 'Role', required: true },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
      <ObservedComponent name="EmployeeCreatePanel">
        <ObservedForm name="employee-create">
          <Form
            schema={schema}
            onSubmit={async () => {
              await new Promise((r) => setTimeout(r, 500));
            }}
            submitLabel="Create"
          />
        </ObservedForm>
      </ObservedComponent>

      <MetricsPanel />

      <RageClickDemo />

      <div>
        <Button variant="destructive" size="sm" onClick={() => setShowBroken(true)}>
          Trigger Error Boundary
        </Button>
        {showBroken && (
          <ObservedErrorBoundary name="BrokenPanel">
            <BrokenComponent />
          </ObservedErrorBoundary>
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--lr-color-text-muted)' }}>
        Open browser console to see laRose observability events.
      </p>
    </div>
  );
}

const meta: Meta = {
  title: 'Observability/Demo',
  component: ObservabilityDemo,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <LaRoseProvider observabilityDebug permissions={['employees.create']}>
        <Story />
      </LaRoseProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const FormFunnel: Story = {
  render: () => <ObservabilityDemo />,
};
