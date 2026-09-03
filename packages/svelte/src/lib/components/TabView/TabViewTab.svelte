<script lang="ts">
  import { getTabViewContext } from '../../TabView/context';
  import { formatTabLabel } from '../../TabView/utils';
  import styles from '@larose-ui/styles/components/TabView/TabView.module.css';

  let {
    value,
    label,
    disabled,
    class: className,
    style,
  }: { value: string; label: string; disabled?: boolean; class?: string; style?: string } = $props();

  const ctx = $derived(getTabViewContext('TabViewTab'));
  const selected = $derived(ctx.value === value);
</script>

<li role="presentation" class={className} {style}>
  <button
    type="button"
    id={`${ctx.baseId}-tab-${value}`}
    role="tab"
    class={styles.tab}
    aria-selected={selected}
    aria-controls={`${ctx.baseId}-panel-${value}`}
    tabindex={selected ? 0 : -1}
    data-selected={selected ? 'true' : undefined}
    {disabled}
    onclick={() => ctx.onValueChange(value)}
  >
    {formatTabLabel(label)}
  </button>
</li>
