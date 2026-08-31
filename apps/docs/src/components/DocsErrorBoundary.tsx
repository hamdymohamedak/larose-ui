import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card, Typography } from '@larose-ui/react';

interface DocsErrorBoundaryProps {
  children: ReactNode;
}

interface DocsErrorBoundaryState {
  error: Error | null;
}

export class DocsErrorBoundary extends Component<DocsErrorBoundaryProps, DocsErrorBoundaryState> {
  state: DocsErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): DocsErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Docs page failed to render', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="docs-content">
          <Card title="Unable to render this page" padding="md">
            <Typography muted className="docs-card-copy">
              {this.state.error.message}
            </Typography>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => this.setState({ error: null })}>
                Try again
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
