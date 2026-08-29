import { useState, type ReactNode } from 'react';
import {
  useTheme,
  useNetwork,
  useBreakpoint,
  useI18n,
  useEnvironment,
} from '@larose/runtime';
import { usePermissions } from '@larose/permissions';
import { useOptionalObservability } from '@larose/observability';

export interface DevToolsPanelProps {
  defaultOpen?: boolean;
}

export function DevToolsPanel({ defaultOpen = false }: DevToolsPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useTheme();
  const { locale, dir } = useI18n();
  const network = useNetwork();
  const { breakpoint, width } = useBreakpoint();
  const environment = useEnvironment();
  const { permissions } = usePermissions();
  const observability = useOptionalObservability();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle laRose DevTools"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--lr-color-border, #ccc)',
          background: 'var(--lr-color-surface-elevated, #fff)',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        laRose
      </button>
      {open && (
        <aside
          data-lr-devtools
          style={{
            position: 'fixed',
            bottom: 56,
            left: 16,
            zIndex: 9999,
            width: 320,
            maxHeight: '60vh',
            overflow: 'auto',
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--lr-color-border, #ccc)',
            background: 'var(--lr-color-surface-elevated, #fff)',
            fontSize: 12,
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Section title="Theme">
            mode={theme.theme} density={theme.density}
            {theme.tenantId ? ` tenant=${theme.tenantId}` : ''}
          </Section>
          <Section title="Locale">{locale} ({dir})</Section>
          <Section title="Environment">{environment}</Section>
          <Section title="Network">{network.condition} (online={String(network.online)})</Section>
          <Section title="Responsive">{breakpoint} ({width}px)</Section>
          <Section title="Permissions">
            {permissions.length ? permissions.join(', ') : 'none'}
          </Section>
          {observability && (
            <Section title="Events">
              {observability.collector.getEvents().length} tracked
            </Section>
          )}
        </aside>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <strong style={{ display: 'block', marginBottom: 2 }}>{title}</strong>
      <div style={{ color: 'var(--lr-color-text-muted, #666)' }}>{children}</div>
    </div>
  );
}

export function DevToolsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DevToolsPanel />
    </>
  );
}
