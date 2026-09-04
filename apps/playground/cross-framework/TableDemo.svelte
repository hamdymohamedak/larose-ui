<script lang="ts">
  import Table from '../../../packages/svelte/src/lib/components/ListTable/Table.svelte';

  interface Props {
    caption?: string;
  }

  let { caption = 'Team directory' }: Props = $props();

  const data = [
    { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
    { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
    { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
  ];

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];
</script>

<Table {caption} {data} {columns} keyExtractor={(row) => String(row.id)} />
