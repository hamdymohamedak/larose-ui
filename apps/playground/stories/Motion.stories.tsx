import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@larose-ui/react';
import { Modal } from '@larose-ui/react';
import { Drawer } from '@larose-ui/react';
import { ToastProvider, useToast } from '@larose-ui/react';
import { Popover } from '@larose-ui/react';
import { Tooltip } from '@larose-ui/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@larose-ui/react';

const meta: Meta = {
  title: 'Design System/Motion',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ message: 'Saved successfully', variant: 'success' })}>
        Show toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ title: 'Update', message: 'A new version is available.', variant: 'info' })
        }
      >
        Stack another
      </Button>
    </div>
  );
}

export const ToastEnterExit: StoryObj = {
  render: () => (
    <ToastProvider placement="bottom-right">
      <ToastDemo />
    </ToastProvider>
  ),
};

export const DialogMotion: StoryObj = {
  render: function DialogStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Motion dialog">
          <p style={{ margin: 0 }}>Subtle scale, fade, and vertical movement on enter and exit.</p>
        </Modal>
      </>
    );
  },
};

export const DrawerMotion: StoryObj = {
  render: function DrawerStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Drawer" side="right">
          <p>Slides in with gentle spring easing. Exit reverses naturally.</p>
        </Drawer>
      </>
    );
  },
};

export const PopoverAndTooltip: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', paddingTop: '4rem' }}>
      <Popover
        trigger={<Button variant="secondary">Popover</Button>}
        content={<p style={{ margin: 0 }}>Spatially-aware entrance from the trigger.</p>}
        side="bottom"
      />
      <Tooltip content="Subtle tooltip motion" side="top">
        <Button variant="outline">Tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const AccordionCollapse: StoryObj = {
  render: () => (
    <Accordion type="single" collapsible defaultValue={['item-1']}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is laRose motion?</AccordionTrigger>
        <AccordionContent>
          A centralized, Apple-inspired motion language — calm, responsive, and intentional.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Reduced motion</AccordionTrigger>
        <AccordionContent>
          Enable reduced motion in system settings to see instant state transitions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const RapidOpenClose: StoryObj = {
  render: function RapidStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={() => setOpen((v) => !v)}>Toggle</Button>
          <Button variant="secondary" onClick={() => { setOpen(true); setOpen(false); setOpen(true); }}>
            Rapid open/close
          </Button>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} title="Interruptible">
          <p style={{ margin: 0 }}>Should end in a consistent state without duplicate portals.</p>
        </Modal>
      </>
    );
  },
};
