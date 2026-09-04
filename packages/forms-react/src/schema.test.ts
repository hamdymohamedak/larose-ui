import { describe, expect, it } from 'vitest';
import { evaluateCondition, getVisibleFields, validateForm } from '@larose-ui/forms-core';


const schema = {
  id: 'employee',
  fields: [
    { name: 'country', type: 'select' as const, label: 'Country', options: [] },
    {
      name: 'governorate',
      type: 'text' as const,
      label: 'Governorate',
      showWhen: { field: 'country', equals: 'Egypt' },
    },
    { name: 'name', type: 'text' as const, label: 'Name', required: true },
  ],
};

describe('conditional fields', () => {
  it('shows governorate when country is Egypt', () => {
    const visible = getVisibleFields(schema, { country: 'Egypt', name: '' });
    expect(visible.map((f) => f.name)).toContain('governorate');
  });

  it('hides governorate for other countries', () => {
    const visible = getVisibleFields(schema, { country: 'Germany', name: '' });
    expect(visible.map((f) => f.name)).not.toContain('governorate');
  });
});

describe('validateForm', () => {
  it('requires name field', () => {
    const errors = validateForm(schema, { country: 'Egypt', name: '' });
    expect(errors.name).toBeDefined();
  });
});

describe('evaluateCondition', () => {
  it('evaluates equals', () => {
    expect(evaluateCondition({ field: 'a', equals: '1' }, { a: '1' })).toBe(true);
  });
});
