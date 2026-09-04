<script lang="ts">
  import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
  import PullDownButton from './PullDownButton.svelte';

  let {
    entries,
    menuTitle,
    onAction,
    destructiveConfirmation,
    disabled = false,
    longPress = false,
    'aria-label': ariaLabel = 'More',
    class: className,
    style,
  }: {
    entries: MenuEntry[];
    menuTitle?: string;
    onAction?: (entry: MenuItemConfig) => void;
    destructiveConfirmation?: {
      title?: string;
      description?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    };
    disabled?: boolean;
    longPress?: boolean;
    'aria-label'?: string;
    class?: string;
    style?: string;
  } = $props();
</script>

<PullDownButton
  variant="more"
  label={ariaLabel}
  {entries}
  {menuTitle}
  {onAction}
  {destructiveConfirmation}
  {disabled}
  {longPress}
  class={className}
  {style}
/>
