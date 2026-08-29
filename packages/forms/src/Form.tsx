import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { Input, Button, Alert, Textarea, Select } from '@larose/react';
import { useMutation } from '@larose/data';
import {
  useOptionalObservability,
  markFormSubmitted,
  trackFormSuccess,
  trackFormError,
  trackFormValidationFailed,
} from '@larose/observability';
import type { ApiError } from '@larose/core';
import {
  getVisibleFields,
  validateForm,
  type FormSchema,
  type FormValues,
} from './schema';
import styles from './Form.module.css';

export interface FormProps {
  schema: FormSchema;
  initialValues?: FormValues;
  submitUrl?: string;
  onSubmit?: (values: FormValues) => Promise<void> | void;
  submitLabel?: string;
}

export function Form({
  schema,
  initialValues = {},
  submitUrl,
  onSubmit,
  submitLabel = 'Save',
}: FormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const observability = useOptionalObservability();
  const formName = schema.id;

  const mutation = useMutation<unknown, FormValues>({
    url: submitUrl ?? '/__larose_noop__',
    method: 'POST',
  });

  const visibleFields = useMemo(
    () => getVisibleFields(schema, values),
    [schema, values],
  );

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validateForm(schema, values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        if (observability) {
          trackFormValidationFailed(
            formName,
            observability.track,
            Object.keys(validationErrors),
          );
        }
        return;
      }

      if (observability) {
        markFormSubmitted(formName, observability.track);
      }

      if (onSubmit) {
        setLocalSubmitting(true);
        try {
          await onSubmit(values);
          if (observability) trackFormSuccess(formName, observability.track);
        } catch (err) {
          if (observability) {
            trackFormError(
              formName,
              observability.track,
              err instanceof Error ? err.message : 'Submit failed',
            );
          }
          throw err;
        } finally {
          setLocalSubmitting(false);
        }
      } else if (submitUrl) {
        const result = await mutation.mutate(values);
        if (mutation.error && observability) {
          trackFormError(formName, observability.track, mutation.error.message);
        } else if (result !== undefined && observability) {
          trackFormSuccess(formName, observability.track);
        }
      }
    },
    [schema, values, onSubmit, submitUrl, mutation, observability, formName],
  );

  const serverError = submitUrl ? (mutation.error as ApiError | null) : null;
  const isSubmitting = localSubmitting || mutation.status === 'submitting';

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-form-id={schema.id}>
      {schema.title && <h2 className={styles.title}>{schema.title}</h2>}

      {serverError && (
        <Alert variant="error" title="Save failed">
          {serverError.message}
        </Alert>
      )}

      {visibleFields.map((field) => (
        <div key={field.name}>
          {field.type === 'select' ? (
            <Select
              label={field.label}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              options={field.options ?? []}
              error={touched[field.name] ? errors[field.name] : undefined}
            />
          ) : field.type === 'textarea' ? (
            <Textarea
              label={field.label}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              error={touched[field.name] ? errors[field.name] : undefined}
              hint={field.hint}
            />
          ) : (
            <Input
              label={field.label}
              name={field.name}
              type={field.type === 'number' ? 'number' : field.type}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              hint={field.hint}
              error={touched[field.name] ? errors[field.name] : undefined}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
