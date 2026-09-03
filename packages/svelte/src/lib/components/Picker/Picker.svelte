<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import FieldShell from '../FieldShell/FieldShell.svelte';
  import Popover from '../Popover/Popover.svelte';
  import { fieldIdFromLabel } from '../../DataEntry/utils';
  import type { PickerColumn, PickerStyle, PickerValue } from '../../Picker/types';
  import { resolvePickerChrome } from '../../Picker/chrome';
  import WheelPicker from './WheelPicker.svelte';
  import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    columns: PickerColumn[];
    value?: PickerValue;
    appearance?: PickerStyle;
    style?: PickerStyle | Record<string, string | number>;
    label?: string;
    hint?: string;
    error?: string | null;
    state?: UIState;
    loading?: boolean;
    disabled?: boolean;
    inputSize?: Size;
    placeholder?: string;
    formatValue?: (value: PickerValue, columns: PickerColumn[]) => string;
    class?: string;
    'aria-label'?: string;
  }

  let {
    columns,
    value = $bindable<PickerValue>({}),
    appearance,
    style,
    label,
    hint,
    error = null,
    state,
    loading = false,
    disabled = false,
    placeholder = 'Select',
    formatValue,
    class: className,
    'aria-label': ariaLabel,
  }: Props = $props();

  const chrome = $derived(resolvePickerChrome(appearance, style, 'wheels'));
  const fieldId = $props.id();
  const inputId = $derived(label ? fieldIdFromLabel(label) : fieldId);
  const uiState = $derived(resolveUIState({ state, loading, error, disabled }));
  const errorMessage = $derived(typeof error === 'string' ? error : null);
  const isDisabled = $derived(disabled || uiState === 'disabled' || uiState === 'loading');
  const displayLabel = $derived.by(() => {
    const formatter =
      formatValue ??
      ((v: PickerValue, cols: PickerColumn[]) =>
        cols
          .map(
            (column) =>
              column.options.find((o) => o.value === v[column.id])?.label ?? v[column.id],
          )
          .filter(Boolean)
          .join(' '));
    return formatter(value, columns).trim() || placeholder;
  });
  const cssStyle = $derived(
    chrome.css
      ? Object.entries(chrome.css)
          .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`)
          .join(';')
      : undefined,
  );
</script>

{#if chrome.appearance === 'compact'}
  <FieldShell {label} {hint} error={errorMessage} htmlFor={inputId} {uiState} class={className} style={cssStyle}>
    <div class={styles.compactField}>
      <Popover side="bottom" aria-label={ariaLabel ?? label ?? 'Picker'} panelClass={styles.compactPopover}>
        {#snippet trigger()}
          <button
            id={inputId}
            type="button"
            class={styles.compactTrigger}
            disabled={isDisabled}
            aria-haspopup="dialog"
          >
            <span class={styles.compactValue}>{displayLabel}</span>
            <span class={styles.compactChevron} aria-hidden="true">▾</span>
          </button>
        {/snippet}
        {#snippet content()}
          <div class={styles.popoverPanelWheels}>
            <WheelPicker
              {columns}
              bind:value
              disabled={isDisabled}
              compact
              aria-label={ariaLabel ?? label ?? 'Picker'}
            />
          </div>
        {/snippet}
      </Popover>
    </div>
  </FieldShell>
{:else}
  <FieldShell {label} {hint} error={errorMessage} htmlFor={inputId} {uiState} class={className} style={cssStyle}>
    <div class={cn(styles.picker)}>
      <WheelPicker
        {columns}
        bind:value
        disabled={isDisabled}
        aria-label={ariaLabel ?? label ?? 'Picker'}
      />
    </div>
  </FieldShell>
{/if}
