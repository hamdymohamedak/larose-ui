<script lang="ts">
  import styles from '@larose-ui/styles/components/Button/Button.module.css';
  import Tooltip from '../Tooltip/Tooltip.svelte';
  import { cn } from '../../utils/cn';

  interface Props {
    helpTopic?: string;
    class?: string;
    style?: string;
    disabled?: boolean;
    'aria-label'?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let {
    helpTopic,
    class: className,
    style,
    disabled,
    'aria-label': ariaLabel = 'Help',
    onclick,
  }: Props = $props();
</script>

{#snippet button()}
  <button
    type="button"
    class={cn(styles.helpButton, className)}
    {style}
    aria-label={ariaLabel}
    {disabled}
    {onclick}
  >
    ?
  </button>
{/snippet}

{#if helpTopic}
  <Tooltip content={helpTopic}>
    {@render button()}
  </Tooltip>
{:else}
  {@render button()}
{/if}
