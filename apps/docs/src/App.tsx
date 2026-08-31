import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner, Typography } from '@larose-ui/react';
import { DocsShell } from '@/layout/DocsShell';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const GettingStartedPage = lazy(() =>
  import('@/pages/GettingStartedPage').then((m) => ({ default: m.GettingStartedPage })),
);
const GuidePage = lazy(() => import('@/pages/CatalogPages').then((m) => ({ default: m.GuidePage })));
const GuidesIndexPage = lazy(() =>
  import('@/pages/CatalogPages').then((m) => ({ default: m.GuidesIndexPage })),
);
const PackagePage = lazy(() => import('@/pages/CatalogPages').then((m) => ({ default: m.PackagePage })));
const PackagesIndexPage = lazy(() =>
  import('@/pages/CatalogPages').then((m) => ({ default: m.PackagesIndexPage })),
);
const ComponentDocPage = lazy(() =>
  import('@/pages/CatalogPages').then((m) => ({ default: m.ComponentDocPage })),
);
const ComponentsIndexPage = lazy(() =>
  import('@/pages/CatalogPages').then((m) => ({ default: m.ComponentsIndexPage })),
);
const ThemeBuilderPage = lazy(() =>
  import('@/pages/DesignPages').then((m) => ({ default: m.ThemeBuilderPage })),
);
const TokenExplorerPage = lazy(() =>
  import('@/pages/DesignPages').then((m) => ({ default: m.TokenExplorerPage })),
);
const MotionPlaygroundPage = lazy(() =>
  import('@/pages/DesignPages').then((m) => ({ default: m.MotionPlaygroundPage })),
);
const PlaygroundPage = lazy(() => import('@/pages/DesignPages').then((m) => ({ default: m.PlaygroundPage })));
const AccessibilityPage = lazy(() =>
  import('@/pages/PlatformPages').then((m) => ({ default: m.AccessibilityPage })),
);
const ArchitecturePage = lazy(() =>
  import('@/pages/PlatformPages').then((m) => ({ default: m.ArchitecturePage })),
);
const MigrationPage = lazy(() =>
  import('@/pages/PlatformPages').then((m) => ({ default: m.MigrationPage })),
);
const ChangelogPage = lazy(() =>
  import('@/pages/PlatformPages').then((m) => ({ default: m.ChangelogPage })),
);

function RouteFallback() {
  return (
    <div className="docs-route-fallback">
      <Spinner size="md" />
      <Typography muted>Loading documentation…</Typography>
    </div>
  );
}

function suspense(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DocsShell />}>
          <Route index element={suspense(<HomePage />)} />
          <Route path="/docs/getting-started" element={suspense(<GettingStartedPage />)} />
          <Route path="/docs/guides" element={suspense(<GuidesIndexPage />)} />
          <Route path="/docs/guides/:guideId" element={suspense(<GuidePage />)} />
          <Route path="/docs/packages" element={suspense(<PackagesIndexPage />)} />
          <Route path="/docs/packages/:packageId" element={suspense(<PackagePage />)} />
          <Route path="/docs/components" element={suspense(<ComponentsIndexPage />)} />
          <Route path="/docs/components/:componentId" element={suspense(<ComponentDocPage />)} />
          <Route path="/docs/design/theme-builder" element={suspense(<ThemeBuilderPage />)} />
          <Route path="/docs/design/tokens" element={suspense(<TokenExplorerPage />)} />
          <Route path="/docs/design/motion" element={suspense(<MotionPlaygroundPage />)} />
          <Route path="/docs/playground" element={suspense(<PlaygroundPage />)} />
          <Route path="/docs/accessibility" element={suspense(<AccessibilityPage />)} />
          <Route path="/docs/architecture" element={suspense(<ArchitecturePage />)} />
          <Route path="/docs/migration" element={suspense(<MigrationPage />)} />
          <Route path="/changelog" element={suspense(<ChangelogPage />)} />
          <Route path="/docs/design/customization" element={<Navigate to="/docs/guides/customization" replace />} />
          <Route path="/docs/v/:version/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
