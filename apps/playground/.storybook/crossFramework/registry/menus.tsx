import type { ComponentProps } from 'react';
import {
  Button,
  CommandPalette,
  ContextMenu,
  DockBar,
  DockMenu,
  EditMenu,
  HomeScreenQuickActions,
  Menu,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from '../types';
import {
  defineCustomParity,
  serializableProps,
  slotFromArgs,
} from '../defineParity';
import {
  DEFAULT_COMMANDS,
  DEFAULT_CONTEXT_ENTRIES,
  DEFAULT_MENU_ENTRIES,
  DEFAULT_QUICK_ACTIONS,
} from './defaults';

export const menusRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  menu: defineCustomParity({
    id: 'menu',
    displayName: 'Menu',
    componentName: 'MenuDemo',
    mapArgs: ({
      open = true,
      title = 'Actions',
      entries = DEFAULT_MENU_ENTRIES,
      layout = 'large',
      label,
      children,
      showTrigger,
      ...rest
    }) => {
      const resolvedShowTrigger =
        typeof showTrigger === 'boolean' ? showTrigger : layout === 'large';
      return {
        props: {
          open,
          title,
          entries,
          layout,
          showTrigger: resolvedShowTrigger,
          triggerLabel: slotFromArgs({ label, children }, 'Open menu'),
          ...serializableProps(rest),
        },
      };
    },
    renderReact: (props) => (
      <div
        style={{
          minHeight: '16rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Menu
          {...(props as unknown as ComponentProps<typeof Menu>)}
          onOpenChange={() => undefined}
        >
          {props.showTrigger !== false ? (
            <Button variant="secondary">{String(props.triggerLabel ?? 'Open menu')}</Button>
          ) : undefined}
        </Menu>
      </div>
    ),
  }),

  contextMenu: defineCustomParity({
    id: 'contextMenu',
    displayName: 'ContextMenu',
    componentName: 'ContextMenu',
    mapArgs: ({
      open = true,
      title = 'Message',
      entries = DEFAULT_CONTEXT_ENTRIES,
      label,
      children,
      ...rest
    }) => ({
      props: { open, title, entries, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Right-click me'),
    }),
    renderReact: (props, slotText) => (
      <ContextMenu {...(props as unknown as ComponentProps<typeof ContextMenu>)}>
        <button type="button">{slotText ?? 'Right-click me'}</button>
      </ContextMenu>
    ),
  }),

  editMenu: defineCustomParity({
    id: 'editMenu',
    displayName: 'EditMenu',
    componentName: 'EditMenu',
    mapArgs: ({
      open = true,
      context = { hasSelection: true, canPaste: true, isEditable: true },
      variant = 'compact',
      label,
      children,
      ...rest
    }) => ({
      props: { open, context, variant, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Selected text'),
    }),
    renderReact: (props, slotText) => (
      <EditMenu {...(props as unknown as ComponentProps<typeof EditMenu>)}>
        <span>{slotText ?? 'Selected text'}</span>
      </EditMenu>
    ),
  }),

  dockMenu: defineCustomParity({
    id: 'dockMenu',
    displayName: 'DockMenu',
    componentName: 'DockMenu',
    mapArgs: ({
      appName = 'Safari',
      isRunning = true,
      open = true,
      openWindows = [{ id: '1', title: 'Apple' }],
      ...rest
    }) => ({
      props: {
        appName,
        isRunning,
        open,
        openWindows,
        ...serializableProps(rest),
      },
      slotText: String(appName).slice(0, 1),
    }),
    renderReact: (props, slotText) => (
      <DockMenu
        {...(props as unknown as ComponentProps<typeof DockMenu>)}
        icon={<span>{slotText ?? 'S'}</span>}
      />
    ),
  }),

  dockBar: defineCustomParity({
    id: 'dockBar',
    displayName: 'DockBar',
    componentName: 'DockBar',
    mapArgs: ({ label, children, ...rest }) => ({
      props: serializableProps(rest),
      slotText: slotFromArgs({ label, children }, 'Dock apps'),
    }),
    renderReact: (_props, slotText) => (
      <DockBar>
        <span style={{ padding: '0.5rem 1rem' }}>{slotText}</span>
      </DockBar>
    ),
  }),

  commandPalette: defineCustomParity({
    id: 'commandPalette',
    displayName: 'CommandPalette',
    componentName: 'CommandPalette',
    mapArgs: ({
      open = true,
      placeholder = 'Search commands…',
      emptyMessage = 'No commands found',
      ariaLabel = 'Command palette',
      items,
      itemCount,
      showGroups = true,
      ...rest
    }) => {
      const base = (items as typeof DEFAULT_COMMANDS | undefined) ?? DEFAULT_COMMANDS;
      const sliced =
        typeof itemCount === 'number' ? base.slice(0, Math.max(0, itemCount)) : base;
      const withGroups = showGroups
        ? sliced
        : sliced.map(({ group: _group, ...item }) => item);
      return {
        props: {
          open,
          placeholder,
          emptyMessage,
          ariaLabel,
          items: withGroups.map((item) => ({ ...item, onSelect: () => undefined })),
          ...serializableProps(rest),
        },
      };
    },
    renderReact: (props) => (
      <CommandPalette
        {...(props as unknown as ComponentProps<typeof CommandPalette>)}
        onOpenChange={() => undefined}
      />
    ),
  }),

  homeScreenQuickActions: defineCustomParity({
    id: 'homeScreenQuickActions',
    displayName: 'HomeScreenQuickActions',
    componentName: 'HomeScreenQuickActions',
    mapArgs: ({
      appName = 'Mail',
      open = true,
      actions = DEFAULT_QUICK_ACTIONS,
      ...rest
    }) => ({
      props: {
        appName,
        open,
        actions: (actions as { id: string; label: string }[]).map((action) => ({
          ...action,
          onSelect: () => undefined,
        })),
        ...serializableProps(rest),
      },
      slotText: String(appName).slice(0, 1),
    }),
    renderReact: (props) => (
      <HomeScreenQuickActions
        {...(props as unknown as ComponentProps<typeof HomeScreenQuickActions>)}
      />
    ),
  }),
};
