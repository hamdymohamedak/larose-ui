<script lang="ts">
  import type { PickerColumn, PickerValue } from '../../Picker/types';
  import { columnsFromValues } from '../../Picker/utils';
  import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
  import { cn } from '../../utils/cn';
  import WheelColumn from './WheelColumn.svelte';

  interface Props {
    columns: PickerColumn[];
    value?: PickerValue;
    onChange?: (value: PickerValue) => void;
    disabled?: boolean;
    inline?: boolean;
    compact?: boolean;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    columns,
    value = $bindable<PickerValue>({}),
    onChange,
    disabled = false,
    inline = false,
    compact = false,
    class: className,
    style,
    'aria-label': ariaLabel = 'Picker',
  }: Props = $props();

  const resolvedColumns = $derived(columnsFromValues(columns, value));
  const wheelClassName = $derived(
    cn(
      styles.wheels,
      inline && styles.wheelsInline,
      compact && styles.wheelsCompact,
      className,
    ),
  );

  function setColumn(columnId: string, next: string) {
    const updated = { ...value, [columnId]: next };
    value = updated;
    onChange?.(updated);
  }
</script>

<div class={wheelClassName} {style} role="group" aria-label={ariaLabel}>
  {#each resolvedColumns as column (column.id)}
    <WheelColumn
      id={column.id}
      label={column.label}
      options={column.options}
      value={value[column.id] ?? column.options[0]?.value ?? ''}
      onChange={(next) => setColumn(column.id, next)}
      {disabled}
      columnFlex={column.flex}
    />
  {/each}
</div>
