import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  PathControl,
  SearchField,
  Sidebar,
  SidebarDisclosureSection,
  SidebarGroup,
  SidebarItem,
  SidebarNav,
  SidebarSearch,
  TokenField,
  Typography,
} from '@larose-ui/react';

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M4 8h6l2 2h8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" aria-hidden="true">
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zm0 0 2-3h12l2 3" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

const meta: Meta = {
  title: 'Foundation/Navigation and Search',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const pathSegments = [
  { id: 'disk', label: 'Macintosh HD' },
  { id: 'users', label: 'Users' },
  { id: 'me', label: 'me' },
  { id: 'docs', label: 'Documents' },
  { id: 'file', label: 'HIG Design.pages' },
];

export const PathControlStandard: Story = {
  name: 'Path control (standard)',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'pathControl' } },
  args: {
    variant: "standard",
    selectedId: "file",
  },

  render: () => (
    <PathControl
      segments={pathSegments}
      selectedId="file"
      variant="standard"
      onSegmentSelect={() => undefined}
    />
  ),
};

export const PathControlPopup: Story = {
  name: 'Path control (pop-up)',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'pathControl' } },
  args: {
    variant: "popup",
    selectedId: "file",
  },

  render: () => (
    <PathControl
      segments={pathSegments}
      variant="popup"
      editable
      onSegmentSelect={() => undefined}
      onChoose={() => undefined}
    />
  ),
};

export const SearchFieldMail: Story = {
  name: 'Search field with scope and tokens',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'searchField' } },
  args: {
    value: "Design",
    placeholder: "Search",
  },

  render: function SearchDemo() {
    const [query, setQuery] = useState('Design');
    const [scope, setScope] = useState('all');

    return (
      <div style={{ maxWidth: '24rem', display: 'grid', gap: '1rem' }}>
        <SearchField
          platform="ipados"
          placement="toolbar-trailing"
          value={query}
          onChange={setQuery}
          suggestions={['Design systems', 'Design review', 'Design tokens']}
          recentSearches={['Quarterly planning']}
          scope={{
            value: scope,
            onChange: setScope,
            options: [
              { id: 'all', label: 'All Mailboxes' },
              { id: 'current', label: 'Current Mailbox' },
            ],
          }}
          tokens={[{ id: 'contact', label: 'Juan Chavez' }]}
          onTokenRemove={() => undefined}
        />
        <Typography role="caption">Query: {query || '(empty)'}</Typography>
      </div>
    );
  },
};

export const SidebarMail: Story = {
  name: 'Sidebar with search and disclosure',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'sidebar' } },
  args: { brand: 'Mail' },

  render: () => (
    <div style={{ display: 'flex', minHeight: '18rem', border: '1px solid rgb(0 0 0 / 0.08)', borderRadius: '0.75rem' }}>
      <Sidebar platform="ipados">
        <SidebarSearch placeholder="Search mailboxes" suggestions={['Inbox', 'VIP', 'Flagged']} />
        <SidebarNav>
          <SidebarGroup label="Favorites">
            <SidebarItem active icon={<InboxIcon />} badge={3}>
              Inbox
            </SidebarItem>
            <SidebarItem icon={<FolderIcon />} accentColor="#ffcc00">
              VIP
            </SidebarItem>
          </SidebarGroup>
          <SidebarDisclosureSection label="Smart Mailboxes">
            <SidebarItem icon={<FolderIcon />}>Today</SidebarItem>
            <SidebarItem icon={<FolderIcon />}>Unread</SidebarItem>
          </SidebarDisclosureSection>
        </SidebarNav>
      </Sidebar>
      <div style={{ flex: 1, padding: '1rem' }}>Message list</div>
    </div>
  ),
};

export const TokenFieldMail: Story = {
  name: 'Token field (macOS Mail)',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'tokenField' } },

  render: function TokenDemo() {
    const [tokens, setTokens] = useState([{ id: '1', label: 'Juan Chavez' }]);
    return (
      <div style={{ maxWidth: '28rem' }}>
        <TokenField
          tokens={tokens}
          onTokensChange={setTokens}
          suggestions={[
            { id: 'a', label: 'Ada Lovelace' },
            { id: 'j', label: 'Juan Chavez' },
            { id: 't', label: 'Tim Cook' },
          ]}
          onContextMenuEntries={(token) => [
            { id: 'vip', label: 'Mark ' + token.label + ' as VIP' },
            { id: 'card', label: 'Open Contact Card' },
          ]}
        />
      </div>
    );
  },
};
