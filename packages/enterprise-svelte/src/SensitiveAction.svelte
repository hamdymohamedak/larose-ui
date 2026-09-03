<script lang="ts">
  import { Dialog, Button } from '@larose-ui/svelte';
  import { getEnvironment } from '@larose-ui/runtime-svelte';
  import { getOptionalObservabilityContext } from '@larose-ui/observability-svelte';

  interface Props {
    label: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    requireProductionConfirm?: boolean;
    onconfirm?: () => void | Promise<void>;
  }

  let {
    label,
    description = 'This action may have irreversible consequences.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    requireProductionConfirm = true,
    onconfirm,
  }: Props = $props();

  let open = $state(false);
  let busy = $state(false);
  const environment = getEnvironment();
  const observability = getOptionalObservabilityContext();
  const isProduction = environment === 'production';

  async function handleConfirm() {
    busy = true;
    try {
      observability?.track({
        type: 'interaction',
        component: 'SensitiveAction',
        metadata: { label, environment },
      });
      await onconfirm?.();
      open = false;
    } finally {
      busy = false;
    }
  }
</script>

<Button variant="destructive" onclick={() => (open = true)}>{label}</Button>
<Dialog
  {open}
  title={label}
  description={isProduction && requireProductionConfirm
    ? `${description} You are in production.`
    : description}
  {confirmLabel}
  {cancelLabel}
  loading={busy}
  variant="destructive"
  onclose={() => (open = false)}
  onconfirm={() => void handleConfirm()}
/>
