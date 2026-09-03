<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ButtonRole, Size, Variant } from '@larose-ui/core';
  import { createAsyncStateMachine } from '@larose-ui/core';
  import type { ButtonShape } from '../../button/utils';
  import Button from '../Button/Button.svelte';

  interface Props {
    action: () => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    disabled?: boolean;
    fullWidth?: boolean;
    class?: string;
    style?: string;
    children: Snippet;
  }

  let {
    action,
    onSuccess,
    onError,
    variant = 'primary',
    size = 'md',
    buttonRole,
    shape,
    disabled,
    fullWidth,
    class: className,
    style,
    children,
  }: Props = $props();

  const machine = createAsyncStateMachine();
  let tick = $state(0);

  const errorMessage = $derived.by(() => {
    void tick;
    const err = machine.error;
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as { message: string }).message);
    }
    return err ? String(err) : null;
  });

  const loading = $derived.by(() => {
    void tick;
    return machine.state === 'submitting';
  });

  const error = $derived.by(() => {
    void tick;
    return machine.state === 'error' ? errorMessage : null;
  });

  async function handleClick() {
    machine.send({ type: 'SUBMIT' });
    tick += 1;
    try {
      await action();
      machine.send({ type: 'SUCCESS' });
      onSuccess?.();
    } catch (err) {
      machine.send({ type: 'ERROR', error: err });
      onError?.(err);
    } finally {
      tick += 1;
    }
  }
</script>

<Button
  {variant}
  {size}
  {buttonRole}
  {shape}
  {loading}
  {error}
  {disabled}
  {fullWidth}
  class={className}
  {style}
  onclick={() => void handleClick()}
>
  {@render children()}
</Button>
