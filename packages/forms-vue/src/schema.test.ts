import { describe, expect, it } from 'vitest';
import { validateForm, type FormSchema } from '@larose-ui/forms-core';

describe('forms-vue schema re-export', () => {
  it('validates required fields', () => {
    const schema: FormSchema = {
      id: 'demo',
      fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
    };
    expect(validateForm(schema, {})).toEqual({ email: 'Email is required' });
  });
});
