import { Form } from '@larose/forms';
import { Can } from '@larose/permissions';
import { Alert } from '@larose/react';
import { compileFormSchema, validateUISchema, type UISchema } from './uiSchema';

export interface SchemaRendererProps {
  schema: UISchema;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;
}

export function SchemaRenderer({ schema, onSubmit }: SchemaRendererProps) {
  const errors = validateUISchema(schema);

  if (errors.length > 0) {
    return (
      <Alert variant="error" title="Invalid UI schema">
        <ul style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Alert>
    );
  }

  if (schema.type !== 'form') {
    return (
      <Alert variant="info" title="Schema type not rendered">
        Page and table schemas are composed at the app layer. Use compileFormSchema for forms.
      </Alert>
    );
  }

  const formSchema = compileFormSchema(schema);
  const form = (
    <Form
      schema={formSchema}
      submitUrl={schema.submitUrl}
      onSubmit={onSubmit}
      submitLabel="Save"
    />
  );

  if (schema.permission) {
    return (
      <Can permission={schema.permission} fallback="forbidden">
        {form}
      </Can>
    );
  }

  return form;
}
