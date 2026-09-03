import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  ToastProvider,
  Tooltip,
  useToast,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Overlays',
  tags: ['autodocs', 'fw-react'],
};

export default meta;

export const TooltipDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'tooltip' } },
  args: { content: 'Export employees as CSV', label: 'Export' },

  render: () => (
    <Tooltip content="Export employees as CSV">
      <Button variant="outline">Export</Button>
    </Tooltip>
  ),
};

function ToastDemo() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Welcome',
      message: 'laRose toast notifications are ready.',
      variant: 'info',
    });
  }, [toast]);

  return (
    <Button
      onClick={() =>
        toast({ title: 'Saved', message: 'Employee record updated.', variant: 'success' })
      }
    >
      Show toast
    </Button>
  );
}

export const ToastDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'toast' } },
  args: {
    autoTitle: 'Welcome',
    autoMessage: 'laRose toast notifications are ready.',
    buttonLabel: 'Show toast',
  },
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const TabsDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'tabs' } },
  args: { defaultValue: 'profile' },

  render: () => (
    <Tabs defaultValue="profile">
      <TabsList aria-label="Employee sections">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsPanel value="profile">Profile details and contact info.</TabsPanel>
      <TabsPanel value="permissions">Role and permission assignments.</TabsPanel>
      <TabsPanel value="activity">Recent audit events.</TabsPanel>
    </Tabs>
  ),
};
