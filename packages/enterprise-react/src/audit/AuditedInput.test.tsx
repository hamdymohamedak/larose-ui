import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuditProvider } from './AuditProvider';
import { AuditedInput } from './AuditedInput';

describe('AuditedInput', () => {
  it('records audit trail on change', async () => {
    render(
      <AuditProvider actor="Ahmed">
        <AuditedInput field="salary" label="Salary" defaultValue="10000" />
      </AuditProvider>,
    );

    const input = screen.getByLabelText('Salary');
    fireEvent.change(input, { target: { value: '12000' } });
    await userEvent.click(screen.getByRole('button', { name: /view history/i }));

    expect(screen.getByText(/10000 → 12000/)).toBeInTheDocument();
    expect(screen.getByText(/Changed by Ahmed/)).toBeInTheDocument();
  });
});
