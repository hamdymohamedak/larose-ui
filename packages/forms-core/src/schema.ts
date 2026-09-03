export type FieldType = 'text' | 'email' | 'number' | 'select' | 'date' | 'textarea';

export interface FieldCondition {
  field: string;
  equals?: unknown;
  notEquals?: unknown;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormFieldSchema {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  showWhen?: FieldCondition;
  dependsOn?: string;
  options?: SelectOption[];
}

export interface FormSchema {
  id: string;
  title?: string;
  fields: FormFieldSchema[];
}

export type FormValues = Record<string, string>;

export function evaluateCondition(
  condition: FieldCondition,
  values: FormValues,
): boolean {
  const current = values[condition.field];
  if (condition.equals !== undefined) return current === condition.equals;
  if (condition.notEquals !== undefined) return current !== condition.notEquals;
  return Boolean(current);
}

export function getVisibleFields(
  schema: FormSchema,
  values: FormValues,
): FormFieldSchema[] {
  return schema.fields.filter((field) => {
    if (!field.showWhen) return true;
    return evaluateCondition(field.showWhen, values);
  });
}

export function validateForm(
  schema: FormSchema,
  values: FormValues,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const visible = getVisibleFields(schema, values);

  for (const field of visible) {
    const value = values[field.name]?.trim() ?? '';
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
    }
    if (field.type === 'email' && value && !value.includes('@')) {
      errors[field.name] = 'Invalid email address';
    }
  }

  return errors;
}
