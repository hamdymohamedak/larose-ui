import { useState } from 'react';
import { Form, type FormProps } from '@larose/forms';
import { Input, Button } from '@larose/react';
import type { AIAdapter } from './adapter';
import { createMockAdapter } from './adapters/mockAdapter';
import styles from './SmartForm.module.css';
import { useSmartAIRuntime } from './useSmartAIRuntime';

export interface SmartFormProps extends FormProps {
  adapter?: AIAdapter;
  promptPlaceholder?: string;
  /** Permission required for AI populate actions */
  writePermission?: string;
}

export function SmartForm({
  adapter = createMockAdapter(),
  promptPlaceholder = 'Describe what to create… e.g. "Create employee for Ahmed Mohamed"',
  writePermission = 'employees.write',
  schema,
  initialValues = {},
  ...formProps
}: SmartFormProps) {
  const runtime = useSmartAIRuntime(adapter);
  const [prompt, setPrompt] = useState('');
  const [values, setValues] = useState(initialValues);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [denial, setDenial] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const populate = async () => {
    setDenial(null);
    const fields = schema.fields.map((f) => ({ name: f.name, label: f.label }));
    const execution = await runtime.populateForm(prompt, fields, writePermission);

    if (!execution.allowed || !execution.result) {
      setDenial(execution.denialReason ?? 'Action not permitted');
      setExplanation(null);
      return;
    }

    setValues((prev) => ({ ...prev, ...execution.result!.values }));
    setExplanation(execution.result.explanation);
    setFormKey((k) => k + 1);
  };

  return (
    <div className={styles.wrapper} data-lr-smart-form data-lr-component="SmartForm">
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
      {denial && (
        <p className={styles.denial} data-lr-ai-denied role="alert">
          {denial}
        </p>
      )}
      {explanation && !denial && <p className={styles.explanation}>{explanation}</p>}
      <Form key={formKey} schema={schema} initialValues={values} {...formProps} />
    </div>
  );
}
