import type { FormFieldSchema, FormSchema } from '@larose/forms';

export type UISchemaType = 'form' | 'page' | 'table';

export interface UISchemaField {
  type: FormFieldSchema['type'];
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  permission?: string;
  options?: FormFieldSchema['options'];
  showWhen?: FormFieldSchema['showWhen'];
}

export interface UISchema {
  type: UISchemaType;
  id: string;
  title?: string;
  permission?: string;
  fields?: UISchemaField[];
  submitUrl?: string;
}

export function compileFormSchema(schema: UISchema): FormSchema {
  if (schema.type !== 'form') {
    throw new Error(`Expected form schema, got "${schema.type}"`);
  }

  return {
    id: schema.id,
    title: schema.title,
    fields: (schema.fields ?? []).map((field) => ({
      name: field.name,
      type: field.type,
      label: field.label ?? field.name,
      placeholder: field.placeholder,
      required: field.required,
      hint: field.hint,
      options: field.options,
      showWhen: field.showWhen,
    })),
  };
}

export function validateUISchema(schema: UISchema): string[] {
  const errors: string[] = [];

  if (!schema.id) errors.push('Schema id is required');
  if (!schema.type) errors.push('Schema type is required');

  if (schema.type === 'form' && (!schema.fields || schema.fields.length === 0)) {
    errors.push('Form schema requires at least one field');
  }

  for (const field of schema.fields ?? []) {
    if (!field.name) errors.push('Field name is required');
    if (!field.type) errors.push(`Field "${field.name}" requires a type`);
  }

  return errors;
}
