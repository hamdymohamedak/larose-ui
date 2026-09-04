<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import {
  Breadcrumb,
  Button,
  Card,
  Header,
  HeaderActions,
  HeaderTitle,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
} from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox">
    <div style="display: flex; min-height: 420px" data-sbx="navigation-root">
      <Sidebar>
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarNav>
          <SidebarItem href="#">Dashboard</SidebarItem>
          <SidebarItem :active="true">Projects</SidebarItem>
          <SidebarItem href="#">Settings</SidebarItem>
        </SidebarNav>
      </Sidebar>
      <div style="flex: 1; display: flex; flex-direction: column">
        <Header>
          <HeaderTitle>Projects</HeaderTitle>
          <HeaderActions>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">New project</Button>
          </HeaderActions>
        </Header>
        <main class="sbx-stack" style="padding: 1.25rem">
          <Breadcrumb :items="[{ label: 'Home', href: '#' }, { label: 'Projects' }]" />
          <Card title="Active projects" description="Shell layout under a real provider tree.">
            <p class="sbx-muted" style="margin: 0">
              Navigation scenario — same intent on React / Svelte sandboxes.
            </p>
          </Card>
        </main>
      </div>
    </div>
  </LaRoseProvider>
</template>
