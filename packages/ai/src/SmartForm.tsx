import { useState } from 'react';
import { Form, type FormProps } from '@larose/forms';
import { Input, Button } from '@larose/react';
import type { AIAdapter } from './adapter';
import { createMockAdapter } from './adapters/mockAdapter';
import styles from './SmartForm.module.css';

export interface SmartFormProps extends FormProps {
  adapter?: AIAdapter;
  promptPlaceholder?: string;
}

export function SmartForm({
  adapter = createMockAdapter(),
  promptPlaceholder = 'Describe what to create… e.g. "Create employee for Ahmed Mohamed"',
  schema,
  initialValues = {},
  ...formProps
}: SmartFormProps) {
  const [prompt, setPrompt] = useState('');
  const [values, setValues] = useState(initialValues);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const populate = async () => {
    const fields = schema.fields.map((f) => ({ name: f.name, label: f.label }));
    const result = await adapter.populateForm(prompt, fields);
    setValues((prev) => ({ ...prev, ...result.values }));
    setExplanation(result.explanation);
    setFormKey((k) => k + 1);
  };

  return (
    <div className={styles.wrapper} data-lr-smart-form>
      <div className={styles.promptRow}>
        <Input
          label="Smart populate"
          placeholder={promptPlaceholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void populate();
          }}
        />
        <Button variant="outline" onClick={() => void populate()}>
          Populate
        </Button>
      </div>
      {explanation && <p className={styles.explanation}>{explanation}</p>}
      <Form key={formKey} schema={schema} initialValues={values} {...formProps} />
    </div>
  );
}
