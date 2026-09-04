<script lang="ts">
  import Button from '../../../packages/svelte/src/lib/components/Button/Button.svelte';
  import ButtonGroup from '../../../packages/svelte/src/lib/components/Button/ButtonGroup.svelte';

  interface Props {
    orientation?: 'horizontal' | 'vertical';
    fullWidth?: boolean;
    ariaLabel?: string;
  }

  let {
    orientation = 'horizontal',
    fullWidth = false,
    ariaLabel = 'Save options',
  }: Props = $props();
</script>

<ButtonGroup {orientation} {fullWidth} aria-label={ariaLabel}>
  <Button variant="primary" buttonRole="primary" {fullWidth}>Save</Button>
  <Button variant="secondary" {fullWidth}>Save As…</Button>
  <Button variant="secondary" buttonRole="cancel" {fullWidth}>Cancel</Button>
</ButtonGroup>
