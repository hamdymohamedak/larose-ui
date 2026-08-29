import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLaRose } from '@larose/testing';
import { DevToolsPanel } from './DevToolsPanel';

describe('DevToolsPanel', () => {
  it('renders toggle and opens panel', async () => {
    renderWithLaRose(<DevToolsPanel />, {
      permissions: ['employees.read'],
      tenantId: 'acme',
    });

    expect(screen.getByRole('button', { name: /larose devtools/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /larose devtools/i }));
    expect(screen.getByText(/Theme/)).toBeInTheDocument();
    expect(screen.getByText(/employees.read/)).toBeInTheDocument();
  });
});
