import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { DocsThemeProvider } from './theme/DocsThemeProvider';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
import './styles/docs.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocsThemeProvider>
      <App />
    </DocsThemeProvider>
  </StrictMode>,
);
