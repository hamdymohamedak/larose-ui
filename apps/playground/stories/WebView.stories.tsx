import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  WebView,
  WebViewShell,
  useWebViewHistory,
} from '@larose-ui/react';

const emailHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 1rem; color: #1d1d1f; }
      h1 { font-size: 1.125rem; margin: 0 0 0.75rem; }
      p { line-height: 1.5; margin: 0 0 0.75rem; }
      a { color: #0071e3; }
    </style>
  </head>
  <body>
    <h1>Design review tomorrow</h1>
    <p>Hi team — attached are the refined tokens and component updates.</p>
    <p><a href="https://example.com/docs">View documentation</a></p>
  </body>
</html>`;

const pages = [
  { url: 'https://example.com/inbox', title: 'Inbox' },
  { url: 'https://example.com/message/42', title: 'Design review tomorrow' },
  { url: 'https://example.com/docs', title: 'Documentation' },
];

const meta: Meta = {
  title: 'Foundation/Web Views',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const EmbeddedHtml: Story = {
  name: 'Embedded HTML (Mail-style)',
  render: () => (
    <Card title="Message body" padding="md">
      <Typography role="footnote" muted>
        Rich HTML content displayed in-app — like Mail message bodies.
      </Typography>
      <div style={{ marginTop: '1rem' }}>
        <WebView html={emailHtml} title="Email message" height={220} />
      </div>
    </Card>
  ),
};

export const BriefWebsiteAccess: Story = {
  render: () => (
    <Card title="Help article" padding="md">
      <Typography role="footnote" muted>
        Brief website access without leaving the app — not a full browser replacement.
      </Typography>
      <div style={{ marginTop: '1rem' }}>
        <WebView src="https://example.com" title="Example help page" height={280} />
      </div>
    </Card>
  ),
};

export const WithNavigation: Story = {
  render: function NavigationDemo() {
    const { currentUrl, canGoBack, canGoForward, back, forward, navigate } = useWebViewHistory(
      pages[0]!.url,
    );
    const currentPage = pages.find((page) => page.url === currentUrl) ?? pages[0]!;

    return (
      <Card title="Multi-page content" padding="md">
        <WebViewShell
          src={currentUrl}
          title={currentPage.title}
          height={260}
          navigation={{
            canGoBack,
            canGoForward,
            onBack: back,
            onForward: forward,
            title: currentPage.title,
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {pages.map((page) => (
            <Button key={page.url} size="sm" variant="secondary" onClick={() => navigate(page.url)}>
              Open {page.title}
            </Button>
          ))}
        </div>
      </Card>
    );
  },
};

export const NavigationOnly: Story = {
  render: function NavigationControlsDemo() {
    const [index, setIndex] = useState(0);
    const canGoBack = index > 0;
    const canGoForward = index < pages.length - 1;

    return (
      <WebViewShell
        html={emailHtml}
        title={pages[index]!.title}
        height={220}
        navigation={{
          canGoBack,
          canGoForward,
          onBack: () => setIndex((value) => Math.max(0, value - 1)),
          onForward: () => setIndex((value) => Math.min(pages.length - 1, value + 1)),
          title: pages[index]!.title,
        }}
      />
    );
  },
};
