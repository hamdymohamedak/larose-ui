import {
  DocumentLauncher,
  DocumentToolbar,
  FileBrowser,
  Header,
  HeaderActions,
  HeaderTitle,
  Typography,
  UnsavedIndicator,
  Card,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from '../types';
import {
  defineCustomParity,
  definePropsParity,
  serializableProps,
} from '../defineParity';
import { DEFAULT_FILE_BROWSER_FILES } from './defaults';

export const documentRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  documentToolbar: definePropsParity({
    id: 'documentToolbar',
    displayName: 'DocumentToolbar',
    propKeys: ['newLabel', 'openLabel', 'saveLabel', 'canSave', 'showAddButton'],
    defaultProps: {
      newLabel: 'New Document',
      openLabel: 'Open Recent',
      saveLabel: 'Save',
      canSave: true,
      showAddButton: true,
    },
    withNoopHandlers: ['onNew', 'onOpen', 'onSave'],
    Component: DocumentToolbar,
  }),

  fileBrowser: definePropsParity({
    id: 'fileBrowser',
    displayName: 'FileBrowser',
    propKeys: ['files', 'activeTab', 'showExtensions'],
    defaultProps: {
      files: DEFAULT_FILE_BROWSER_FILES,
      activeTab: 'recents',
      showExtensions: false,
    },
    withNoopHandlers: ['onTabChange', 'onShowExtensionsChange', 'onSelect', 'onOpen'],
    Component: FileBrowser,
  }),

  documentLauncher: definePropsParity({
    id: 'documentLauncher',
    displayName: 'DocumentLauncher',
    propKeys: ['appTitle', 'files', 'primaryActionLabel', 'secondaryActionLabel'],
    defaultProps: {
      appTitle: 'Pages',
      files: DEFAULT_FILE_BROWSER_FILES,
      primaryActionLabel: 'Start Writing',
      secondaryActionLabel: 'Choose a Template',
    },
    withNoopHandlers: ['onPrimaryAction', 'onSecondaryAction'],
    Component: DocumentLauncher,
  }),

  unsavedIndicators: defineCustomParity({
    id: 'unsavedIndicators',
    displayName: 'UnsavedIndicators',
    componentName: 'UnsavedIndicatorsDemo',
    mapArgs: () => ({ props: {} }),
    renderReact: () => (
      <Card title="Autosave vs manual save" padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <UnsavedIndicator title="Untitled" edited autosaveEnabled />
          <UnsavedIndicator title="Budget Proposal" edited={false} autosaveEnabled />
          <UnsavedIndicator title="Meeting Notes" edited autosaveEnabled={false} />
        </div>
      </Card>
    ),
  }),

  documentWorkspace: defineCustomParity({
    id: 'documentWorkspace',
    displayName: 'DocumentWorkspace',
    componentName: 'DocumentWorkspaceDemo',
    mapArgs: ({ title = 'Product Roadmap', ...rest }) => ({
      props: { title, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <>
        <Header>
          <HeaderTitle>
            <UnsavedIndicator
              title={String(props.title ?? 'Product Roadmap')}
              edited
              autosaveEnabled
            />
          </HeaderTitle>
          <HeaderActions>
            <DocumentToolbar
              showAddButton={false}
              onSave={() => undefined}
              saveLabel="Save"
              canSave
            />
          </HeaderActions>
        </Header>
        <div style={{ marginTop: '1rem' }}>
          <Typography role="footnote" muted>
            Toggle autosave to see the unsaved-changes dot when manual save is required.
          </Typography>
        </div>
      </>
    ),
  }),
};
