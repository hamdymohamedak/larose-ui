import { type ReactNode, useEffect, useState } from 'react';
import { Button, ButtonGroup, Select } from '@larose-ui/react';

export type PreviewViewport = 'desktop' | 'tablet' | 'mobile';
export type PreviewDirection = 'ltr' | 'rtl';
export type PreviewAppearance = 'light' | 'dark' | 'system';

const VIEWPORT_WIDTH: Record<PreviewViewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface PreviewToolbarProps {
  viewport: PreviewViewport;
  direction: PreviewDirection;
  appearance: PreviewAppearance;
  onViewportChange: (value: PreviewViewport) => void;
  onDirectionChange: (value: PreviewDirection) => void;
  onAppearanceChange: (value: PreviewAppearance) => void;
}

export function PreviewToolbar({
  viewport,
  direction,
  appearance,
  onViewportChange,
  onDirectionChange,
  onAppearanceChange,
}: PreviewToolbarProps) {
  return (
    <div className="docs-preview-toolbar">
      <ButtonGroup aria-label="Preview viewport">
        {(['desktop', 'tablet', 'mobile'] as PreviewViewport[]).map((option) => (
          <Button
            key={option}
            size="sm"
            variant={viewport === option ? 'primary' : 'outline'}
            onClick={() => onViewportChange(option)}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>

      <ButtonGroup aria-label="Text direction">
        <Button
          size="sm"
          variant={direction === 'ltr' ? 'primary' : 'outline'}
          onClick={() => onDirectionChange('ltr')}
        >
          LTR
        </Button>
        <Button
          size="sm"
          variant={direction === 'rtl' ? 'primary' : 'outline'}
          onClick={() => onDirectionChange('rtl')}
        >
          RTL
        </Button>
      </ButtonGroup>

      <Select
        aria-label="Preview appearance"
        value={appearance}
        onChange={(event) => onAppearanceChange(event.target.value as PreviewAppearance)}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
      />
    </div>
  );
}

export function PreviewViewportFrame({
  viewport,
  direction,
  appearance,
  children,
}: {
  viewport: PreviewViewport;
  direction: PreviewDirection;
  appearance: PreviewAppearance;
  children: ReactNode;
}) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const resolvedAppearance =
    appearance === 'system' ? (systemDark ? 'dark' : 'light') : appearance;

  return (
    <div className="docs-preview-viewport-shell">
      <div
        className="docs-preview-viewport"
        style={{
          width: VIEWPORT_WIDTH[viewport],
          maxWidth: '100%',
          direction,
        }}
        data-preview-theme={resolvedAppearance}
      >
        {children}
      </div>
    </div>
  );
}
