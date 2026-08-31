import { Component, type ReactNode } from 'react';
import { Typography } from '@larose-ui/react';
import { getComponentPreviewBySlug, hasComponentPreview } from '@/previews';

interface SafePreviewProps {
  children: ReactNode;
}

interface SafePreviewState {
  failed: boolean;
}

class SafePreview extends Component<SafePreviewProps, SafePreviewState> {
  state: SafePreviewState = { failed: false };

  static getDerivedStateFromError(): SafePreviewState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <Typography muted className="docs-card-copy">
          Preview unavailable for this component.
        </Typography>
      );
    }
    return this.props.children;
  }
}

export function ComponentPreview({ slug }: { slug: string }) {
  return <SafePreview>{getComponentPreviewBySlug(slug)}</SafePreview>;
}

export { hasComponentPreview };
