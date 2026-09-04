<script setup lang="ts">
import Table from '../../../packages/vue/src/components/ListTable/Table.vue';

withDefaults(
  defineProps<{
    caption?: string;
    selectedKey?: string;
  }>(),
  {
    caption: 'Team directory',
    selectedKey: '1',
  },
);

const data = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

const columns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    sortValue: (row: (typeof data)[number]) => row.name,
    render: (row: (typeof data)[number]) => row.name,
  },
  {
    key: 'role',
    header: 'Role',
    sortable: true,
    sortValue: (row: (typeof data)[number]) => row.role,
    render: (row: (typeof data)[number]) => row.role,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: (typeof data)[number]) => row.status,
  },
];
</script>

<template>
  <Table
    :caption="caption"
    :data="data"
    :columns="columns"
    :key-extractor="(row) => row.id"
    selection-mode="navigation"
    :selected-key="selectedKey"
  />
</template>
