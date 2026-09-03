<script lang="ts">
  import { getAuditContext } from './context';
  import styles from './AuditHistory.module.css';

  interface Props {
    field: string;
    resourceId?: string;
    onclose?: () => void;
  }

  let { field, resourceId, onclose }: Props = $props();
  const audit = getAuditContext();
  const history = $derived(audit.getHistory(field, resourceId));
</script>

<aside class={styles.panel} aria-label={`Audit history for ${field}`}>
  <header class={styles.header}>
    <strong>{field} history</strong>
    {#if onclose}
      <button type="button" onclick={onclose} aria-label="Close history">×</button>
    {/if}
  </header>
  {#if history.length === 0}
    <p class={styles.empty}>No changes recorded.</p>
  {:else}
    <ul class={styles.list}>
      {#each history as entry (entry.id)}
        <li>
          <div class={styles.change}>
            {entry.before || '(empty)'} → {entry.after || '(empty)'}
          </div>
          <div class={styles.meta}>
            Changed by {entry.actor} · {new Date(entry.timestamp).toLocaleString()}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</aside>
