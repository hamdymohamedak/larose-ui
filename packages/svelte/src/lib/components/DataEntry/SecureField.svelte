<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import Input from '../Input/Input.svelte';

  interface Props {
    label?: string;
    hint?: string;
    fieldState?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    autocomplete?: string;
    placeholder?: string;
    name?: string;
    class?: string;
    style?: string;
    value?: string;
  }

  let {
    label,
    hint,
    fieldState,
    loading = false,
    error = null,
    disabled,
    readOnly,
    required = false,
    inputSize = 'md',
    id,
    autocomplete = 'current-password',
    placeholder,
    name,
    class: className,
    style,
    value = $bindable(''),
  }: Props = $props();

  $effect(() => {
    if (import.meta.env.DEV && value !== undefined && value !== '') {
      console.warn(
        '[SecureField] Avoid prepopulating password fields. Use biometric or keychain auth instead.',
      );
    }
  });
</script>

<Input
  type="password"
  {label}
  {hint}
  {fieldState}
  {loading}
  {error}
  {disabled}
  {readOnly}
  {required}
  {inputSize}
  {id}
  {autocomplete}
  spellcheck={false}
  {placeholder}
  {name}
  class={className}
  {style}
  bind:value
/>
