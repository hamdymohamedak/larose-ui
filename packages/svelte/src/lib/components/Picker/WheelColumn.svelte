<script lang="ts">
  import type { PickerOption } from '../../Picker/types';
  import { PICKER_ROW_HEIGHT_PX } from '../../Picker/utils';
  import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    id: string;
    label?: string;
    options: PickerOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    columnFlex?: number;
    class?: string;
    style?: string;
  }

  let {
    id,
    label,
    options,
    value = $bindable(''),
    onChange,
    disabled = false,
    columnFlex,
    class: className,
    style = '',
  }: Props = $props();

  const labelId = `${id}-label`;
  let viewportEl = $state<HTMLElement | null>(null);
  let syncing = $state(false);

  const selectedIndex = $derived(
    Math.max(0, options.findIndex((option) => option.value === value)),
  );
  const padding = `calc((var(--lr-picker-wheel-height) - ${PICKER_ROW_HEIGHT_PX}px) / 2)`;
  const columnStyle = $derived(
    [style, columnFlex !== undefined ? `flex:${columnFlex}` : ''].filter(Boolean).join(';'),
  );

  function commit(index: number) {
    const option = options[Math.max(0, Math.min(options.length - 1, index))];
    if (!option || option.disabled) return;
    if (option.value === value) return;
    value = option.value;
    onChange?.(option.value);
  }

  function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
    if (!viewportEl) return;
    syncing = true;
    viewportEl.scrollTo({ top: index * PICKER_ROW_HEIGHT_PX, behavior });
    requestAnimationFrame(() => {
      syncing = false;
    });
  }

  function snapFromScroll() {
    if (!viewportEl || disabled || syncing) return;
    const index = Math.round(viewportEl.scrollTop / PICKER_ROW_HEIGHT_PX);
    const clamped = Math.max(0, Math.min(options.length - 1, index));
    scrollToIndex(clamped, 'smooth');
    commit(clamped);
  }

  function onScroll() {
    if (!viewportEl || disabled || syncing) return;
    const index = Math.round(viewportEl.scrollTop / PICKER_ROW_HEIGHT_PX);
    commit(index);
  }

  $effect(() => {
    const index = selectedIndex;
    if (!viewportEl) return;
    scrollToIndex(index);
  });
</script>

<div class={cn(styles.wheelColumn, className)} role="group" aria-labelledby={label ? labelId : undefined} style={columnStyle}>
  {#if label}<span id={labelId} class={styles.wheelLabel}>{label}</span>{/if}
  <div
    bind:this={viewportEl}
    class={styles.wheelViewport}
    style="overflow-y:auto;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;"
    onscroll={onScroll}
    onscrollend={snapFromScroll}
  >
    <div class={styles.wheelFadeTop} aria-hidden="true"></div>
    <div class={styles.wheelSelection} aria-hidden="true"></div>
    <div
      {id}
      class={styles.wheelList}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${id}-option-${selectedIndex}`}
      tabindex={disabled ? -1 : 0}
      style={`padding-top:${padding};padding-bottom:${padding}`}
      onkeydown={(event) => {
        if (disabled) return;
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const next = Math.max(0, selectedIndex - 1);
          scrollToIndex(next, 'smooth');
          commit(next);
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const next = Math.min(options.length - 1, selectedIndex + 1);
          scrollToIndex(next, 'smooth');
          commit(next);
        }
      }}
    >
      {#each options as option, index (option.value)}
        <div
          id={`${id}-option-${index}`}
          role="option"
          aria-selected={option.value === value}
          data-wheel-item=""
          class={styles.wheelItem}
          data-centered={option.value === value ? 'true' : undefined}
          data-disabled={option.disabled ? 'true' : undefined}
          style={`height:${PICKER_ROW_HEIGHT_PX}px;scroll-snap-align:center`}
          onclick={() => {
            if (disabled || option.disabled) return;
            scrollToIndex(index, 'smooth');
            commit(index);
          }}
        >
          <span class={styles.wheelItemLabel}>{option.label}</span>
        </div>
      {/each}
    </div>
    <div class={styles.wheelFadeBottom} aria-hidden="true"></div>
  </div>
</div>
