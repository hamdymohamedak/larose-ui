import { describe, expect, it } from 'vitest';
import { compileFormSchema, validateUISchema } from './uiSchema';

describe('validateUISchema', () => {
  it('requires form fields', () => {
    expect(validateUISchema({ type: 'form', id: 'x', fields: [] }).length).toBeGreaterThan(0);
  });

  it('compiles to FormSchema', () => {
    const schema = compileFormSchema({
      type: 'form',
      id: 'employee',
      title: 'Employee',
      fields: [{ type: 'text', name: 'name', label: 'Name', required: true }],
    });
    expect(schema.fields[0]?.name).toBe('name');
  });
});
