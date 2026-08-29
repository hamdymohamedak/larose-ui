import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PermissionProvider, Can } from './index';

describe('Can', () => {
  it('renders children when permitted', () => {
    render(
      <PermissionProvider permissions={['employees.delete']}>
        <Can permission="employees.delete">
          <button>Delete</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('hides when not permitted', () => {
    render(
      <PermissionProvider permissions={['employees.read']}>
        <Can permission="employees.delete">
          <button>Delete</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows explainable message when disabled fallback', () => {
    render(
      <PermissionProvider permissions={[]}>
        <Can permission="employees.delete" fallback="disabled">
          <button>Delete</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.getByRole('note')).toHaveTextContent('Missing permission');
  });
});
