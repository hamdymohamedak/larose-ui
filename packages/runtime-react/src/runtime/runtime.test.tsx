import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LaRoseProvider } from '../LaRoseProvider';
import { useRuntime } from './useRuntime';

function RuntimeSnapshot() {
  const runtime = useRuntime();
  return (
    <div data-testid="snapshot">
      {runtime.environment}|{runtime.session}|{runtime.tenant?.id ?? 'none'}|
      {runtime.timezone}|{runtime.theme.density}
    </div>
  );
}

describe('Runtime 2.0', () => {
  it('exposes unified runtime context via useRuntime', () => {
    render(
      <LaRoseProvider
        environment="staging"
        tenant={{ id: 'acme', name: 'ACME Corp' }}
        user={{ id: 'ahmed', name: 'Ahmed' }}
        session="authenticated"
        timezone="Africa/Cairo"
        density="compact"
        permissions={['employees.read']}
        features={{ 'new-payroll': true }}
      >
        <RuntimeSnapshot />
      </LaRoseProvider>,
    );

    const snapshot = screen.getByTestId('snapshot');
    expect(snapshot.textContent).toContain('staging');
    expect(snapshot.textContent).toContain('authenticated');
    expect(snapshot.textContent).toContain('acme');
    expect(snapshot.textContent).toContain('Africa/Cairo');
    expect(snapshot.textContent).toContain('compact');
  });

  it('records runtime events on mount', () => {
    let mounted = false;
    render(
      <LaRoseProvider
        onRuntimeEvent={(event) => {
          if (event.type === 'runtime.mounted') mounted = true;
        }}
      >
        <span>app</span>
      </LaRoseProvider>,
    );
    expect(mounted).toBe(true);
  });
});
