import { useEffect, useState, type ReactNode } from 'react';
import { SCENARIOS } from '../../sandbox-shared/scenarios.js';
import { HomeScenario } from './scenarios/Home';
import { NavigationScenario } from './scenarios/Navigation';
import { CommandScenario } from './scenarios/Command';
import { OverlaysScenario } from './scenarios/Overlays';
import { ToastScenario } from './scenarios/Toast';
import { ThemeScenario } from './scenarios/Theme';
import { FormsScenario } from './scenarios/Forms';
import { AcceleratorsScenario } from './scenarios/Accelerators';

function readRoute(): string {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'shell' || hash === 'command-palette') {
    return hash === 'shell' ? 'navigation' : 'command';
  }
  return hash || 'home';
}

function SandboxChrome({ route, children }: { route: string; children: ReactNode }) {
  const current = SCENARIOS.find((s) => s.id === route) ?? SCENARIOS[0]!;

  return (
    <div className="sbx-root" data-sbx-framework="react">
      <nav className="sbx-nav" aria-label="Sandbox scenarios">
        <div className="sbx-brand">
          <strong>laRose sandbox</strong>
          <span>React · kitchen sink</span>
        </div>
        {SCENARIOS.map((scenario) => (
          <a
            key={scenario.id}
            href={`#/${scenario.id}`}
            aria-current={scenario.id === current.id ? 'page' : undefined}
          >
            {scenario.title}
          </a>
        ))}
      </nav>
      <div className="sbx-main">
        <header className="sbx-banner">
          <div>
            <h1>{current.title}</h1>
            <p>{current.description}</p>
          </div>
          <span className="sbx-pill">React</span>
        </header>
        <div className="sbx-stage" data-sbx-scenario={current.id}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const body = (() => {
    switch (route) {
      case 'navigation':
        return <NavigationScenario />;
      case 'command':
        return <CommandScenario />;
      case 'overlays':
        return <OverlaysScenario />;
      case 'toast':
        return <ToastScenario />;
      case 'theme':
        return <ThemeScenario />;
      case 'forms':
        return <FormsScenario />;
      case 'accelerators':
        return <AcceleratorsScenario />;
      default:
        return <HomeScenario />;
    }
  })();

  return <SandboxChrome route={route}>{body}</SandboxChrome>;
}
