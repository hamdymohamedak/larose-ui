import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  CommandPalette,
  FileUpload,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderTitle,
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  useCommandPaletteShortcut,
} from '@larose/react';

const meta: Meta = {
  title: 'Foundation/AppShell',
  tags: ['autodocs'],
};

export default meta;

export const SidebarDefault: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', minHeight: 320, border: '1px solid var(--lr-color-border)' }}>
      <Sidebar>
        <SidebarHeader>laRose</SidebarHeader>
        <SidebarNav>
          <SidebarGroup label="Workspace">
            <SidebarItem active>Dashboard</SidebarItem>
            <SidebarItem>Employees</SidebarItem>
            <SidebarItem>Reports</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Settings">
            <SidebarItem>Profile</SidebarItem>
            <SidebarItem disabled>Billing</SidebarItem>
          </SidebarGroup>
        </SidebarNav>
      </Sidebar>
      <div style={{ flex: 1, padding: '1rem' }}>Main content</div>
    </div>
  ),
};

export const HeaderDefault: StoryObj = {
  render: () => (
    <Header>
      <HeaderBrand>laRose</HeaderBrand>
      <HeaderActions>
        <Button variant="outline" size="sm">
          Help
        </Button>
        <Button size="sm">New</Button>
      </HeaderActions>
    </Header>
  ),
};

export const HeaderWithTitle: StoryObj = {
  render: () => (
    <Header>
      <HeaderTitle>Employees</HeaderTitle>
      <HeaderActions>
        <Button size="sm">Add employee</Button>
      </HeaderActions>
    </Header>
  ),
};

export const FileUploadDefault: StoryObj = {
  render: () => (
    <FileUpload
      label="Attachments"
      hint="PDF or CSV up to 10 MB"
      accept=".pdf,.csv"
      multiple
      onFilesChange={(files) => console.log(files)}
    />
  ),
};

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  useCommandPaletteShortcut(() => setOpen(true));

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette (⌘K)</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: 'add',
            label: 'Add employee',
            group: 'Actions',
            keywords: ['create', 'new'],
            onSelect: () => undefined,
          },
          {
            id: 'export',
            label: 'Export CSV',
            group: 'Actions',
            onSelect: () => undefined,
          },
          {
            id: 'theme',
            label: 'Toggle theme',
            group: 'Preferences',
            onSelect: () => undefined,
          },
        ]}
      />
    </>
  );
}

export const CommandPaletteDefault: StoryObj = {
  render: () => <CommandPaletteDemo />,
};

function AppShellDemo() {
  const [open, setOpen] = useState(false);
  useCommandPaletteShortcut(() => setOpen(true));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 420,
        border: '1px solid var(--lr-color-border)',
        borderRadius: 'var(--lr-radius-md)',
        overflow: 'hidden',
      }}
    >
      <Header>
        <HeaderTitle>Employees</HeaderTitle>
        <HeaderActions>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Commands
          </Button>
          <Button size="sm">Add</Button>
        </HeaderActions>
      </Header>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar>
          <SidebarHeader>laRose</SidebarHeader>
          <SidebarNav>
            <SidebarItem>Dashboard</SidebarItem>
            <SidebarItem active>Employees</SidebarItem>
            <SidebarItem>Settings</SidebarItem>
          </SidebarNav>
        </Sidebar>
        <main style={{ flex: 1, padding: '1rem' }}>
          <FileUpload label="Import employees" accept=".csv" buttonLabel="Drop CSV file here" />
        </main>
      </div>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'add', label: 'Add employee', onSelect: () => undefined },
          { id: 'refresh', label: 'Refresh list', onSelect: () => undefined },
        ]}
      />
    </div>
  );
}

export const AppShellLayout: StoryObj = {
  render: () => <AppShellDemo />,
};
