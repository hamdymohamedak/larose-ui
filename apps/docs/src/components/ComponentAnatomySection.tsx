import type { ComponentAnatomy } from '@/data/playground.generated';

export function ComponentAnatomySection({ anatomy }: { anatomy: ComponentAnatomy }) {
  return (
    <section id="anatomy" className="docs-anatomy-section">
      <h2>Component anatomy</h2>
      <p>{anatomy.summary}</p>

      <pre className="docs-anatomy-tree" aria-label="Component structure">
        {anatomy.structure
          .map((node, index) => `${index === 0 ? '' : '│\n'}${index === anatomy.structure.length - 1 ? '└── ' : '├── '}${node}`)
          .join('\n')}
      </pre>

      <h3>Composition</h3>
      <p>{anatomy.composition}</p>

      <h3>Slots</h3>
      <ul>
        {anatomy.slots.map((slot) => (
          <li key={slot}>
            <code>{slot}</code>
          </li>
        ))}
      </ul>

      <h3>States</h3>
      <div className="docs-link-grid">
        {anatomy.states.map((state) => (
          <span key={state} className="docs-link-chip">
            {state}
          </span>
        ))}
      </div>
    </section>
  );
}
