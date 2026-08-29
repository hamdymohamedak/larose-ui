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
} from '@larose/react';

const meta: Meta = {
  title: 'Foundation/Overlays',
  tags: ['autodocs'],
};

export default meta;

export const TooltipDefault: StoryObj = {
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
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const TabsDefault: StoryObj = {
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
