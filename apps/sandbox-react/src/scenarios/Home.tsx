import { SCENARIOS } from '../../../sandbox-shared/scenarios.js';

export function HomeScenario() {
  return (
    <div className="sbx-stage-pad sbx-stack">
      <p className="sbx-muted">
        Kitchen sink for <code>@larose-ui/react</code>. Pair with Vue / Svelte sandboxes +{' '}
        <code>pnpm test:parity</code> for cross-framework user-flow checks. Storybook remains docs
        only.
      </p>
      <ul className="sbx-stack" style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {SCENARIOS.filter((s) => s.id !== 'home').map((s) => (
          <li key={s.id}>
            <a href={`#/${s.id}`}>{s.title}</a> — {s.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
