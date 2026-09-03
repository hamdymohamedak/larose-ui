<script lang="ts">
  import type { PopUpCustomOption, PopUpOption } from '../../PopUpButton/types';
  import {
    buildPopUpMenuEntries,
    resolveDefaultValue,
    resolvePopUpLabel,
  } from '../../PopUpButton/utils';
  import styles from '@larose-ui/styles/components/PopUpButton/PopUpButton.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  let {
    label,
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Select…',
    customOption,
    explanatoryText,
    disabled = false,
    id,
    class: className,
    style,
  }: {
    label?: string;
    options: PopUpOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    customOption?: PopUpCustomOption;
    explanatoryText?: string;
    disabled?: boolean;
    id?: string;
    class?: string;
    style?: string;
  } = $props();

  const menuId = $props.id();
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let internalValue = $state(resolveDefaultValue(options, defaultValue) ?? '');
  let open = $state(false);
  let position = $state({ x: 0, y: 0 });

  const currentValue = $derived(value ?? internalValue);
  const menuEntries = $derived(buildPopUpMenuEntries(options, currentValue, customOption));
  const displayLabel = $derived(resolvePopUpLabel(options, currentValue, placeholder));
  const triggerId = $derived(id ?? `popup-${menuId}`);

  function setValue(next: string) {
    if (value === undefined) internalValue = next;
    onValueChange?.(next);
  }

  function openMenu() {
    const rect = triggerEl?.getBoundingClientRect();
    if (!rect) return;
    position = { x: rect.left, y: rect.bottom + 4 };
    open = true;
  }

  function close() {
    open = false;
  }

  function handleSelect(entryId: string) {
    if (customOption && entryId === customOption.value) customOption.onSelect?.();
    setValue(entryId);
    close();
  }

  $effect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
</script>

<div class={cn(styles.wrap, className)} {style}>
  {#if label || explanatoryText}
    <div class={styles.labelRow}>
      {#if label}
        <label class={styles.fieldLabel} for={triggerId}>{label}</label>
      {/if}
      {#if explanatoryText && !open}
        <p class={styles.explanatory}>{explanatoryText}</p>
      {/if}
    </div>
  {/if}
  <button
    bind:this={triggerEl}
    id={triggerId}
    type="button"
    class={styles.trigger}
    {disabled}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    onclick={() => (open ? close() : openMenu())}
  >
    <span class={styles.triggerLabel}>{displayLabel}</span>
    <svg class={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  </button>
  {#if open}
    <div use:portal>
      <div class={styles.menuBackdrop} role="presentation" onclick={close}></div>
      <div
        id={menuId}
        class={styles.menuPanel}
        role="listbox"
        aria-label={label ?? 'Options'}
        style={`position:fixed;left:${position.x}px;top:${position.y}px;z-index:1000;`}
        onclick={(event) => event.stopPropagation()}
      >
        <ul class={styles.list}>
          {#each menuEntries as entry, index (entry.type === 'separator' ? `sep-${index}` : entry.id)}
            {#if entry.type === 'separator'}
              <li class={styles.separator} role="separator"></li>
            {:else if entry.type !== 'submenu'}
              <li>
                <button
                  type="button"
                  class={styles.item}
                  role="option"
                  aria-selected={entry.selected ? true : undefined}
                  disabled={entry.disabled}
                  onclick={() => handleSelect(entry.id)}
                >
                  <span class={styles.checkmark} aria-hidden="true"
                    >{entry.selected ? '✓' : ''}</span
                  >
                  <span class={styles.itemLabel}>{entry.label}</span>
                </button>
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>
