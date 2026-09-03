import { Typography } from '@larose-ui/react';
import type { DocsComponentApi } from '@/data/api.generated';

interface ApiReferenceProps {
  api: DocsComponentApi;
  componentName: string;
  packageName?: string;
}

export function ApiReference({ api, componentName, packageName = '@larose-ui/react' }: ApiReferenceProps) {
  const ownProps = api.props.filter((prop) => !prop.inherited);
  const inheritedProps = api.props.filter((prop) => prop.inherited);

  return (
    <section id="api" className="docs-api-section">
      <h2>API</h2>
      <p>
        Extracted from <code>{componentName}Props</code> in <code>{packageName}</code>.
      </p>

      <PropTable title="Props" rows={ownProps} />
      {inheritedProps.length > 0 ? (
        <details className="docs-api-inherited">
          <summary>Standard DOM props ({inheritedProps.length})</summary>
          <PropTable rows={inheritedProps} compact />
        </details>
      ) : null}

      {api.events.length > 0 ? (
        <>
          <h3>Events</h3>
          <PropTable rows={api.events.filter((prop) => !prop.inherited)} />
        </>
      ) : null}

      {api.accessibility.length > 0 ? (
        <>
          <h3>Accessibility</h3>
          <ul>
            {api.accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function PropTable({
  title,
  rows,
  compact = false,
}: {
  title?: string;
  rows: DocsComponentApi['props'];
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <Typography muted className="docs-card-copy">
        No props documented.
      </Typography>
    );
  }

  return (
    <div className="docs-api-table-wrap">
      {title ? <h3>{title}</h3> : null}
      <table className={`docs-api-table${compact ? ' docs-api-table--compact' : ''}`}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            {!compact ? <th>Default</th> : null}
            <th>Required</th>
            {!compact ? <th>Description</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              {!compact ? (
                <td>{row.default ? <code>{row.default}</code> : '—'}</td>
              ) : null}
              <td>{row.required ? 'Yes' : 'No'}</td>
              {!compact ? <td>{row.description ?? '—'}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
