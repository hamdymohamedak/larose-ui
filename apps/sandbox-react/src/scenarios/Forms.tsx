import { useState, type FormEvent } from 'react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Input, Card } from '@larose-ui/react';

function FormsDemo() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState('');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(name.trim() || '(empty)');
  }

  return (
    <div className="sbx-stage-pad sbx-stack">
      <Card title="Quick form">
        <form className="sbx-stack" onSubmit={onSubmit}>
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-sbx="form-name"
          />
          <Button type="submit" data-sbx="form-submit">
            Submit
          </Button>
        </form>
      </Card>
      <p data-sbx="form-result" className="sbx-muted">
        {submitted ? `Submitted: ${submitted}` : 'Not submitted yet.'}
      </p>
    </div>
  );
}

export function FormsScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
      <FormsDemo />
    </LaRoseProvider>
  );
}
