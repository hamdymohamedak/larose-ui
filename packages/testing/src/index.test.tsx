import { describe, expect, it } from 'vitest';
import { renderWithLaRose, defaultTestMatrix } from './index';
import { screen } from '@testing-library/react';

describe('renderWithLaRose', () => {
  it('renders with provider', () => {
    renderWithLaRose(<button>Save</button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('defaultTestMatrix', () => {
  it('includes core scenarios', () => {
    expect(defaultTestMatrix.length).toBeGreaterThan(3);
  });
});
