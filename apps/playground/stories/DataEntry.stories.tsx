import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Card,
  FormContinue,
  Input,
  SecureField,
  Select,
  Typography,
  combineValidators,
  createEmailValidator,
  createRequiredValidator,
  isFormComplete,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Entering Data',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ClearPromptsAndDefaults: Story = {
  render: () => (
    <Card title="Account" padding="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email"
          placeholder="username@company.com"
          hint="We'll use this for sign-in notifications."
          defaultValue=""
        />
        <Select
          label="Department"
          hint="Choose a team instead of typing free text when possible."
          defaultValue="eng"
          options={[
            { label: 'Engineering', value: 'eng' },
            { label: 'Design', value: 'design' },
            { label: 'Operations', value: 'ops' },
          ]}
        />
      </div>
    </Card>
  ),
};

export const DynamicValidation: Story = {
  render: function DynamicValidationDemo() {
    const emailValidate = combineValidators(
      createRequiredValidator('Email is required'),
      createEmailValidator(),
    );

    return (
      <Card title="Invite teammate" padding="md">
        <Input
          label="Work email"
          placeholder="name@company.com"
          required
          validate={emailValidate}
          validateOn="change"
          hint="Errors appear as you type so you can fix them immediately."
        />
      </Card>
    );
  },
};

export const NumericFormatting: Story = {
  render: () => (
    <Card title="Budget" padding="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input label="Amount" format="currency" defaultValue="1250" hint="Formats on blur." />
        <Input label="Growth target" format="percent" defaultValue="12" hint="Enter whole numbers." />
      </div>
    </Card>
  ),
};

export const SecurePasswordField: Story = {
  render: () => (
    <Card title="Sign in" padding="md">
      <SecureField
        label="Password"
        required
        hint="Password fields are never prepopulated per Apple HIG."
      />
    </Card>
  ),
};

export const PasteAndDrop: Story = {
  render: () => (
    <Card title="Quick entry" padding="md">
      <Input
        label="Invite code"
        acceptDrop
        hint="Paste or drag plain text into the field."
        placeholder="Drop text here"
      />
    </Card>
  ),
};

export const ContinueWhenComplete: Story = {
  render: function ContinueWhenCompleteDemo() {
    const [values, setValues] = useState({ name: '', email: '' });
    const complete = isFormComplete(values, ['name', 'email']);

    return (
      <Card title="Onboarding" padding="md">
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          onSubmit={(event) => event.preventDefault()}
        >
          <Typography role="subheadline">
            Continue stays disabled until required fields contain data.
          </Typography>
          <Input
            label="Full name"
            required
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            label="Email"
            required
            placeholder="username@company.com"
            value={values.email}
            validate={createEmailValidator()}
            validateOn="blur"
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          />
          <div>
            <FormContinue complete={complete} />
          </div>
        </form>
      </Card>
    );
  },
};

export const ExpansionTooltip: Story = {
  render: () => (
    <Card title="macOS expansion tooltip" padding="md">
      <Input
        label="Project URL"
        expansionTooltip
        defaultValue="https://intranet.company.com/teams/platform/design-systems/refined-ui"
        style={{ maxWidth: '16rem' }}
        hint="Hover truncated values to see the full entry."
      />
    </Card>
  ),
};
