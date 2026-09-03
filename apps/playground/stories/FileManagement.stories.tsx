import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Card,
  DocumentLauncher,
  DocumentToolbar,
  FileBrowser,
  FilePreview,
  FileUpload,
  Header,
  HeaderActions,
  HeaderTitle,
  Typography,
  UnsavedIndicator,
  type FileBrowserItem,
} from '@larose-ui/react';

const sampleFiles: FileBrowserItem[] = [
  {
    id: '1',
    name: 'Quarterly Report.numbers',
    extension: 'numbers',
    size: 245_760,
    modifiedAt: '2026-08-29T14:22:00',
    location: 'icloud',
    syncStatus: 'synced',
  },
  {
    id: '2',
    name: 'Launch Brief.key',
    extension: 'key',
    size: 512_000,
    modifiedAt: '2026-08-28T09:10:00',
    location: 'local',
    syncStatus: 'syncing',
    shared: true,
  },
  {
    id: '3',
    name: 'Wireframes.pdf',
    extension: 'pdf',
    size: 1_024_000,
    modifiedAt: '2026-08-27T18:45:00',
    location: 'remote',
    syncStatus: 'error',
    shared: true,
  },
];

const meta: Meta = {
  title: 'Foundation/File Management',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const DocumentToolbarStory: Story = {
  name: 'Create & Open',
  render: () => (
    <DocumentToolbar
      onNew={() => undefined}
      onOpen={() => undefined}
      onSave={() => undefined}
      newLabel="New Document"
      openLabel="Open Recent"
    />
  ),
};

export const FileBrowserStory: Story = {
  render: function FileBrowserDemo() {
    const [tab, setTab] = useState<'recents' | 'shared' | 'browse'>('recents');
    const [showExtensions, setShowExtensions] = useState(false);
    const [selectedId, setSelectedId] = useState<string>();

    return (
      <FileBrowser
        files={sampleFiles}
        activeTab={tab}
        onTabChange={setTab}
        showExtensions={showExtensions}
        onShowExtensionsChange={setShowExtensions}
        selectedId={selectedId}
        onSelect={(file) => setSelectedId(file.id)}
        onOpen={(file) => setSelectedId(file.id)}
      />
    );
  },
};

export const QuickLookPreview: Story = {
  render: () => (
    <FilePreview
      source={{
        name: 'Release Notes.md',
        textContent: '# Release Notes\n\n- Autosave improvements\n- New document launcher',
        type: 'text/markdown',
      }}
    />
  ),
};

export const UnsavedChanges: Story = {
  render: () => (
    <Card title="Autosave vs manual save" padding="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <UnsavedIndicator title="Untitled" edited autosaveEnabled />
        <UnsavedIndicator title="Budget Proposal" edited={false} autosaveEnabled />
        <UnsavedIndicator title="Meeting Notes" edited autosaveEnabled={false} />
      </div>
    </Card>
  ),
};

export const DocumentLauncherStory: Story = {
  render: function LauncherDemo() {
    const [showExtensions, setShowExtensions] = useState(false);

    return (
      <DocumentLauncher
        appTitle="Pages"
        primaryActionLabel="Start Writing"
        secondaryActionLabel="Choose a Template"
        onPrimaryAction={() => undefined}
        onSecondaryAction={() => undefined}
        files={sampleFiles}
        showExtensions={showExtensions}
        onShowExtensionsChange={setShowExtensions}
      />
    );
  },
};

export const DocumentWorkspace: Story = {
  render: function WorkspaceDemo() {
    const [edited, setEdited] = useState(true);
    const [autosave, setAutosave] = useState(true);

    return (
      <>
        <Header>
          <HeaderTitle>
            <UnsavedIndicator title="Product Roadmap" edited={edited} autosaveEnabled={autosave} />
          </HeaderTitle>
          <HeaderActions>
            <DocumentToolbar
              showAddButton={false}
              onSave={() => setEdited(false)}
              saveLabel="Save"
              canSave={edited}
            />
          </HeaderActions>
        </Header>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          <Typography role="footnote" muted>
            Toggle autosave to see the unsaved-changes dot when manual save is required.
          </Typography>
          <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={autosave}
              onChange={(event) => setAutosave(event.target.checked)}
            />
            Autosave enabled
          </label>
          <button type="button" onClick={() => setEdited(true)}>
            Mark as edited
          </button>
        </div>
      </>
    );
  },
};

export const ImportWithFileUpload: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'fileUpload' } },
  args: {
    label: "Import document",
    hint: "PDF, Pages, or Numbers",
  },

  render: () => (
    <Card title="Import attachment" padding="md">
      <FileUpload
        label="Attach files"
        hint="Drag files here or paste from the Finder — extensions hidden in lists by default."
        accept=".pdf,.png,.jpg"
        buttonLabel="Choose files or drag here"
      />
    </Card>
  ),
};
