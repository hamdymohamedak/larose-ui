import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLaRose } from '@larose-ui/testing';
import { DevToolsPanel } from './DevToolsPanel';

describe('DevToolsPanel', () => {
  it('renders toggle and opens panel with runtime context', async () => {
    renderWithLaRose(<DevToolsPanel />, {
      permissions: ['employees.read'],
      tenant: { id: 'acme', name: 'ACME' },
      session: 'authenticated',
    });

    expect(screen.getByRole('button', { name: /larose devtools/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /larose devtools/i }));
    expect(screen.getByText(/Session/)).toBeInTheDocument();
    expect(screen.getByText(/authenticated/)).toBeInTheDocument();
    expect(screen.getByText(/employees.read/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Inspector/i }));
    expect(screen.getByText(/Select mode/i)).toBeInTheDocument();
  });
});
