import {
  FRAMEWORK_LABELS,
  FRAMEWORK_PACKAGES,
  type StorybookFramework,
} from './frameworkSupport';

export function UnsupportedFrameworkPanel({
  requested,
  supported,
  displayName,
}: {
  requested: StorybookFramework;
  supported: StorybookFramework[];
  displayName: string;
}) {
  const requestedLabel = FRAMEWORK_LABELS[requested];
  const supportedLabels = supported.map((framework) => FRAMEWORK_LABELS[framework]).join(', ');

  return (
    <div
      role="status"
      style={{
        maxWidth: 560,
        padding: '1.25rem 1.5rem',
        borderRadius: 12,
        border: '1px solid var(--larose-color-border-subtle, #d4d4d8)',
        background: 'var(--larose-color-surface-secondary, #f4f4f5)',
        color: 'var(--larose-color-text-primary, #18181b)',
        fontSize: 14,
        lineHeight: 1.55,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Not available in {requestedLabel}
      </div>
      <h2 style={{ margin: '0.4rem 0 0.75rem', fontSize: 18, fontWeight: 650 }}>
        {displayName} is not implemented for {FRAMEWORK_PACKAGES[requested]}
      </h2>
      <p style={{ margin: 0 }}>
        The Framework toolbar mounts the real {requestedLabel} package. This story only exists in{' '}
        <strong>{supportedLabels}</strong>, so the canvas is empty instead of showing a React
        stand-in.
      </p>
      <p style={{ margin: '0.75rem 0 0' }}>
        Switch the Framework toolbar back to React, or pick a story tagged for{' '}
        {requestedLabel} (Foundation / Glass / Parity). Changing the toolbar also jumps away from
        React-only demos automatically.
      </p>
    </div>
  );
}
