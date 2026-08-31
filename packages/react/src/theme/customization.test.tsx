import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { LaRoseProvider } from '../provider/LaRoseProvider';

describe('component defaults', () => {
  it('applies global Button defaults while allowing instance overrides', async () => {
    render(
      <LaRoseProvider
        components={{
          Button: {
            defaultProps: {
              variant: 'secondary',
              size: 'lg',
            },
          },
        }}
      >
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
      </LaRoseProvider>,
    );

    const defaultButton = screen.getByRole('button', { name: 'Default' });
    const primaryButton = screen.getByRole('button', { name: 'Primary' });

    expect(defaultButton.dataset.variant).toBe('secondary');
    expect(defaultButton.dataset.size).toBe('lg');
    expect(primaryButton.dataset.variant).toBe('primary');
    expect(primaryButton.dataset.size).toBe('lg');
  });

  it('preserves button behavior with customized defaults', async () => {
    const user = userEvent.setup();

    render(
      <LaRoseProvider
        components={{
          Button: {
            defaultProps: { variant: 'secondary' },
          },
        }}
      >
        <Button onClick={() => undefined}>Click me</Button>
      </LaRoseProvider>,
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeEnabled();
    await user.click(button);
  });
});
