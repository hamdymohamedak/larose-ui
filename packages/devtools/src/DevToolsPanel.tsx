import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  useOptionalRuntime,
  useOptionalRuntimeEvents,
  useTheme,
  useNetwork,
  useBreakpoint,
  useI18n,
  useEnvironment,
} from '@larose-ui/runtime';
import { usePermissions } from '@larose-ui/permissions';
import { useOptionalObservability } from '@larose-ui/observability';
import type { RuntimeEvent } from '@larose-ui/core';
import {
  buildInspectorReadout,
  InspectorOverlay,
  useComponentInspector,
} from './ComponentInspector';
import { getComponentPerformance } from './componentPerformance';

export interface DevToolsPanelProps {
  defaultOpen?: boolean;
}

type DevToolsTab = 'context' | 'timeline' | 'inspector' | 'journey';

export function DevToolsPanel({ defaultOpen = false }: DevToolsPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState<DevToolsTab>('context');
  const [inspectMode, setInspectMode] = useState(false);
  const runtime = useOptionalRuntime();
  const runtimeEvents = useOptionalRuntimeEvents();
  const [timeline, setTimeline] = useState<RuntimeEvent[]>([]);
  const { hovered, selected, clearSelection } = useComponentInspector(inspectMode);

  const theme = useTheme();
  const { locale, dir } = useI18n();
  const network = useNetwork();
  const { breakpoint, width } = useBreakpoint();
  const environment = useEnvironment();
  const { permissions } = usePermissions();
  const observability = useOptionalObservability();
  const journey = observability?.getJourney(20) ?? [];
  const rageAnalyses = observability?.getRageClickAnalyses() ?? [];
  const performanceSummary = useMemo(() => {
    if (!selected || !observability) return null;
    const events = observability.collector.getEvents({ component: selected.name });
    return getComponentPerformance(events);
  }, [selected, observability]);

  useEffect(() => {
    if (!runtimeEvents) return;
    setTimeline(runtimeEvents.getTimeline(25));
    return runtimeEvents.subscribe(() => setTimeline(runtimeEvents.getTimeline(25)));
  }, [runtimeEvents]);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      <InspectorOverlay target={inspectMode ? hovered ?? selected : null} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle laRose DevTools"
        style={toggleStyle}
      >
        laRose
      </button>
      {open && (
        <aside data-lr-devtools style={panelStyle}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <TabButton active={tab === 'context'} onClick={() => { setTab('context'); setInspectMode(false); }}>
              Context
            </TabButton>
            <TabButton active={tab === 'timeline'} onClick={() => { setTab('timeline'); setInspectMode(false); }}>
              Timeline ({timeline.length})
            </TabButton>
            <TabButton
              active={tab === 'inspector'}
              onClick={() => setTab('inspector')}
            >
              Inspector
            </TabButton>
            <TabButton active={tab === 'journey'} onClick={() => { setTab('journey'); setInspectMode(false); }}>
              Journey ({journey.length})
            </TabButton>
          </div>

          {tab === 'inspector' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={inspectMode}
                  onChange={(e) => setInspectMode(e.target.checked)}
                />
                Select mode
              </label>
              {!selected && (
                <p style={{ color: 'var(--lr-color-text-muted, #666)', margin: '0 0 8px' }}>
                  Click a laRose component on the page to inspect it.
                </p>
              )}
              {selected &&
                buildInspectorReadout(selected, runtime, performanceSummary).map((line) => (
                  <div key={line} style={{ lineHeight: 1.5 }}>
                    {line}
                  </div>
                ))}
              {selected && (
                <button
                  type="button"
                  onClick={clearSelection}
                  style={{ marginTop: 8, fontSize: 11, cursor: 'pointer' }}
                >
                  Clear selection
                </button>
              )}
            </div>
          )}

          {tab === 'context' && runtime && (
            <>
              <Section title="Session">{runtime.session}</Section>
              <Section title="Tenant">
                {runtime.tenant?.name ?? runtime.tenant?.id ?? 'none'}
              </Section>
              <Section title="User">{runtime.user?.name ?? runtime.user?.id ?? 'none'}</Section>
              <Section title="Environment">{runtime.environment}</Section>
              <Section title="Theme">
                {runtime.theme.mode} / {runtime.theme.density}
                {runtime.theme.tenantId ? ` · ${runtime.theme.tenantId}` : ''}
              </Section>
              <Section title="Locale">
                {runtime.locale.locale} ({runtime.locale.dir}) · {runtime.timezone}
              </Section>
              <Section title="Network">
                {runtime.network.condition} · online={String(runtime.network.online)}
                {runtime.network.rtt !== undefined ? ` · ${runtime.network.rtt}ms` : ''}
              </Section>
              <Section title="Offline">
                {runtime.offline.status} · queue={runtime.offline.queueLength}
              </Section>
              <Section title="Permissions">
                {runtime.permissions.granted.length
                  ? runtime.permissions.granted.join(', ')
                  : 'none'}
              </Section>
              <Section title="Features">
                {Object.keys(runtime.features.flags).length
                  ? Object.entries(runtime.features.flags)
                      .map(([k, v]) => `${k}:${v.enabled ? 'on' : 'off'}`)
                      .join(', ')
                  : 'none'}
              </Section>
              <Section title="Version">
                fe={runtime.version.frontend}
                {runtime.version.api ? ` · api=${runtime.version.api}` : ''}
              </Section>
              <Section title="A11y">
                reducedMotion={String(runtime.accessibility.reducedMotion)} · highContrast=
                {String(runtime.accessibility.highContrast)}
              </Section>
            </>
          )}

          {tab === 'context' && !runtime && (
            <>
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
            </>
          )}

          {tab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {timeline.length === 0 && (
                <span style={{ color: 'var(--lr-color-text-muted, #666)' }}>No events yet</span>
              )}
              {timeline
                .slice()
                .reverse()
                .map((event, index) => (
                  <div key={`${event.timestamp}-${index}`} style={{ lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--lr-color-text-muted, #888)' }}>
                      {formatTime(event.timestamp)}
                    </span>{' '}
                    {event.type}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <span style={{ color: 'var(--lr-color-text-muted, #666)' }}>
                        {' '}
                        {JSON.stringify(event.metadata)}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}

          {tab === 'journey' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {!observability && (
                <span style={{ color: 'var(--lr-color-text-muted, #666)' }}>
                  ObservabilityProvider required
                </span>
              )}
              {observability && journey.length === 0 && (
                <span style={{ color: 'var(--lr-color-text-muted, #666)' }}>
                  No journey steps yet
                </span>
              )}
              {journey
                .slice()
                .reverse()
                .map((step) => (
                  <div key={step.id} style={{ lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--lr-color-text-muted, #888)' }}>
                      {formatTime(step.timestamp)}
                    </span>{' '}
                    [{step.kind}] {step.label}
                    {step.context?.network && (
                      <span style={{ color: 'var(--lr-color-text-muted, #666)' }}>
                        {' '}
                        · net={step.context.network}
                      </span>
                    )}
                  </div>
                ))}
              {rageAnalyses.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Rage click analysis</strong>
                  {rageAnalyses
                    .slice()
                    .reverse()
                    .slice(0, 3)
                    .map((analysis) => (
                      <div key={`${analysis.component}-${analysis.timestamp}`} style={{ marginTop: 4 }}>
                        {analysis.component} ({analysis.clickCount}x)
                        {analysis.likelyCauses.map((cause) => (
                          <div
                            key={`${cause.type}-${cause.label}`}
                            style={{ color: 'var(--lr-color-text-muted, #666)', paddingLeft: 8 }}
                          >
                            → {cause.type}: {cause.label} ({cause.confidence})
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {observability && tab === 'context' && (
            <Section title="Observability">
              {observability.collector.getEvents().length} UX events tracked
            </Section>
          )}
        </aside>
      )}
    </>
  );
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour12: false });
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '4px 6px',
        fontSize: 11,
        fontWeight: 600,
        border: '1px solid var(--lr-color-border, #ccc)',
        borderRadius: 4,
        background: active
          ? 'var(--lr-color-primary, #2563eb)'
          : 'var(--lr-color-surface, #fff)',
        color: active ? 'var(--lr-color-text-inverse, #fff)' : 'inherit',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
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

const toggleStyle: CSSProperties = {
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
};

const panelStyle: CSSProperties = {
  position: 'fixed',
  bottom: 56,
  left: 16,
  zIndex: 9999,
  width: 360,
  maxHeight: '60vh',
  overflow: 'auto',
  padding: 12,
  borderRadius: 8,
  border: '1px solid var(--lr-color-border, #ccc)',
  background: 'var(--lr-color-surface-elevated, #fff)',
  fontSize: 12,
  fontFamily: 'monospace',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

export function DevToolsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DevToolsPanel />
    </>
  );
}
