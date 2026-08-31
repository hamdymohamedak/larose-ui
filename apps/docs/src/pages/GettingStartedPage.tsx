import { MarkdownContent } from '@/components/MarkdownContent';

const gettingStarted = `# Getting started

Install laRose UI packages and wrap your app with \`LaRoseProvider\`.

## Install

\`\`\`bash
pnpm add @larose-ui/react @larose-ui/tokens
\`\`\`

For runtime features (network, offline, toasts, permissions):

\`\`\`bash
pnpm add @larose-ui/runtime @larose-ui/permissions
\`\`\`

## Minimal app

\`\`\`tsx
import { LaRoseProvider } from '@larose-ui/react';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" density="comfortable">
      <Card title="Hello laRose">
        <Input label="Name" placeholder="Your name" />
        <Button>Save</Button>
      </Card>
    </LaRoseProvider>
  );
}
\`\`\`

## Runtime stack

\`\`\`tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

<LaRoseProvider
  theme="light"
  locale="en"
  permissions={['app.read']}
  tenantId="acme"
>
  <Card title="Dashboard">
    <Button>Continue</Button>
  </Card>
</LaRoseProvider>
\`\`\`

## Next steps

- Browse all [packages](/docs/packages)
- Explore [components](/docs/components)
- Read the [customization guide](/docs/guides/customization)
`;

export function GettingStartedPage() {
  return <MarkdownContent source={gettingStarted} />;
}
