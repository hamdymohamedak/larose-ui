import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { DocsThemeProvider } from './theme/DocsThemeProvider';
import { FrameworkProvider } from './theme/FrameworkProvider';
import { registerDocsWebMcpTools } from '@/webmcp/register-docs-tools';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import '@larose-ui/react/styles.css';
import './styles/docs.css';

registerDocsWebMcpTools();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocsThemeProvider>
      <FrameworkProvider>
        <App />
      </FrameworkProvider>
    </DocsThemeProvider>
  </StrictMode>,
);
