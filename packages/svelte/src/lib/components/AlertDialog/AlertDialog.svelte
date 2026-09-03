<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    AlertDialogAction,
    AlertDialogPresentation,
    AlertDialogSuppression,
    AlertDialogTextField,
  } from '../../AlertDialog/types';
  import {
    formatAlertTitle,
    orderAlertActions,
    resolveCancelAction,
    shouldStyleDestructive,
    validateAlertActions,
    warnIfAlertTitleTooLong,
  } from '../../AlertDialog/utils';
  import styles from '@larose-ui/styles/components/AlertDialog/AlertDialog.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message?: string;
    actions: AlertDialogAction[];
    presentation?: AlertDialogPresentation;
    icon?: Snippet;
    showCautionIcon?: boolean;
    textField?: AlertDialogTextField;
    suppression?: AlertDialogSuppression;
    helpUrl?: string;
    accessory?: Snippet;
    defaultActionId?: string;
    class?: string;
    style?: string;
  }

  let {
    open,
    onOpenChange,
    title,
    message,
    actions,
    presentation = 'compact',
    icon,
    showCautionIcon = false,
    textField,
    suppression,
    helpUrl,
    accessory,
    defaultActionId,
    class: className,
    style,
  }: Props = $props();

  const titleId = `lr-alert-title-${Math.random().toString(36).slice(2, 9)}`;
  const messageId = `lr-alert-message-${Math.random().toString(36).slice(2, 9)}`;
  let dialogEl = $state<HTMLDivElement | null>(null);
  let internalText = $state(textField?.defaultValue ?? '');
  let suppressed = $state(suppression?.defaultChecked ?? false);

  const textValue = $derived(textField?.value ?? internalText);
  const orderedLayout = $derived(orderAlertActions(actions, presentation));
  const resolvedDefaultId = $derived(
    defaultActionId ?? orderedLayout.ordered.find((action) => action.role === 'default')?.id,
  );

  function close() {
    onOpenChange(false);
  }

  function runAction(action: AlertDialogAction) {
    action.onSelect?.();
    if (action.role !== 'cancel') close();
  }

  $effect(() => {
    if (!open) return;
    validateAlertActions(actions);
    warnIfAlertTitleTooLong(title);
  });

  $effect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const cancel = resolveCancelAction(actions);
      if (cancel) runAction(cancel);
      else close();
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => dialogEl?.focus());
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  });
</script>

{#if open}
  <div use:portal class={styles.overlay} data-presentation={presentation} role="presentation">
    <div
      bind:this={dialogEl}
      class={cn(styles.alert, className)}
      {style}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={message ? messageId : undefined}
      data-presentation={presentation}
      tabindex="-1"
    >
      <div class={styles.body}>
        <div class={styles.header}>
          {#if showCautionIcon}
            <svg class={styles.caution} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 8v5M12 16h.01M10.29 4.86 2.82 18a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 4.86a2 2 0 0 0 -3.42 0z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
          {#if icon}
            <span class={styles.icon}>{@render icon()}</span>
          {/if}
          <div>
            <h2 id={titleId} class={styles.title}>{formatAlertTitle(title)}</h2>
          </div>
        </div>

        {#if message}
          <p id={messageId} class={styles.message}>{message}</p>
        {/if}

        {#if accessory}
          <div class={styles.accessory}>{@render accessory()}</div>
        {/if}

        {#if textField}
          <label class={styles.field}>
            {#if textField.label}
              <span class={styles.fieldLabel}>{textField.label}</span>
            {/if}
            <input
              class={styles.input}
              type={textField.secure ? 'password' : 'text'}
              placeholder={textField.placeholder}
              value={textValue}
              oninput={(event) => {
                const next = event.currentTarget.value;
                if (textField.value === undefined) internalText = next;
                textField.onChange?.(next);
              }}
            />
          </label>
        {/if}

        {#if suppression}
          <label class={styles.suppression}>
            <input
              type="checkbox"
              checked={suppression.checked ?? suppressed}
              onchange={(event) => {
                const next = event.currentTarget.checked;
                if (suppression.checked === undefined) suppressed = next;
                suppression.onChange?.(next);
              }}
            />
            <span>{suppression.label}</span>
          </label>
        {/if}
      </div>

      <div class={styles.actions} data-layout={orderedLayout.layout}>
        {#each orderedLayout.ordered as action (action.id)}
          <button
            type="button"
            class={styles.action}
            data-role={action.role ?? 'default'}
            data-destructive={shouldStyleDestructive(action) ? 'true' : undefined}
            data-default-focus={resolvedDefaultId === action.id ? 'true' : undefined}
            onclick={() => runAction(action)}
          >
            {action.label}
          </button>
        {/each}
      </div>

      {#if helpUrl}
        <div class={styles.footer}>
          <button
            type="button"
            class={styles.help}
            onclick={() => window.open(helpUrl, '_blank', 'noopener,noreferrer')}
          >
            Help
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
