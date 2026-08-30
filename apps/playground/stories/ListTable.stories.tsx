import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Card,
  List,
  ListRow,
  ListSection,
  OutlineView,
  Table,
  Typography,
} from '@larose-ui/react';

const settingsSections = [
  {
    header: 'Account',
    footer: 'Changes sync across your devices.',
    rows: [
      { title: 'Apple ID', subtitle: 'sara@icloud.com', accessory: 'disclosure' as const },
      { title: 'iCloud', subtitle: '5 GB of 5 GB used', accessory: 'disclosure' as const },
    ],
  },
  {
    header: 'Notifications',
    rows: [
      { title: 'Allow Notifications', accessory: 'checkmark' as const, selected: true },
      { title: 'Sounds', accessory: 'disclosure' as const },
    ],
  },
];

const employees = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

const outlineData = [
  {
    id: 'docs',
    label: 'Documents',
    values: { Kind: 'Folder', Size: '—' },
    children: [
      {
        id: 'brief',
        label: 'Product Brief.pages',
        values: { Kind: 'Document', Size: '420 KB' },
      },
      {
        id: 'assets',
        label: 'Assets',
        values: { Kind: 'Folder', Size: '—' },
        children: [
          {
            id: 'hero',
            label: 'Hero.png',
            values: { Kind: 'PNG image', Size: '1.2 MB' },
          },
        ],
      },
    ],
  },
];

const meta: Meta = {
  title: 'Foundation/Lists & Tables',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const GroupedList: Story = {
  render: () => (
    <div style={{ maxWidth: '28rem' }}>
      <List aria-label="Settings">
        {settingsSections.map((section) => (
          <ListSection key={section.header} header={section.header} footer={section.footer}>
            {section.rows.map((row) => (
              <ListRow key={row.title} {...row} onPress={() => undefined} />
            ))}
          </ListSection>
        ))}
      </List>
    </div>
  ),
};

export const ListAccessories: Story = {
  render: () => (
    <Card title="Accessory types" padding="md">
      <List variant="plain">
        <ListSection>
          <ListRow title="Inbox" accessory="disclosure" onPress={() => undefined} />
          <ListRow
            title="Weekly summary"
            subtitle="Delivered Fridays at 9:00 AM"
            accessory="info"
            onInfo={() => undefined}
            onPress={() => undefined}
          />
          <ListRow title="Include attachments" accessory="checkmark" selected onPress={() => undefined} />
        </ListSection>
      </List>
      <Typography role="footnote" muted>
        Disclosure navigates hierarchy; info buttons reveal details only.
      </Typography>
    </Card>
  ),
};

export const SortableTable: Story = {
  render: function SortableTableDemo() {
    const [selectedKey, setSelectedKey] = useState('1');
    return (
      <Table
        caption="Team directory"
        data={employees}
        keyExtractor={(row) => row.id}
        selectionMode="navigation"
        selectedKey={selectedKey}
        onSelectRow={(row) => setSelectedKey(row.id)}
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            sortValue: (row) => row.name,
            render: (row) => row.name,
          },
          {
            key: 'role',
            header: 'Role',
            sortable: true,
            sortValue: (row) => row.role,
            render: (row) => row.role,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => row.status,
          },
        ]}
      />
    );
  },
};

export const OutlineViewStory: Story = {
  name: 'Outline view (legacy)',
  render: () => (
    <OutlineView data={outlineData} defaultExpandedIds={['docs', 'assets']} columns={['Kind', 'Size']} />
  ),
};

export const MiddleTruncation: Story = {
  render: () => (
    <List variant="plain">
      <ListSection>
        <ListRow
          title="Quarterly-financial-report-final-v3.pdf"
          truncate="middle"
          accessory="disclosure"
          onPress={() => undefined}
        />
      </ListSection>
    </List>
  ),
};
