<script lang="ts">
  import { monthMatrix, parseISODate, toISODate, weekdayLabels } from '../../Picker/utils';
  import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    value?: string;
    onChange?: (isoDate: string) => void;
    locale?: string;
    minDate?: string;
    maxDate?: string;
    class?: string;
    style?: string;
  }

  let {
    value = $bindable<string | undefined>(undefined),
    onChange,
    locale = 'en',
    minDate,
    maxDate,
    class: className,
    style,
  }: Props = $props();

  const parsed = $derived(parseISODate(value));
  let visibleYear = $state(parsed.year);
  let visibleMonth = $state(parsed.month);

  $effect(() => {
    visibleYear = parsed.year;
    visibleMonth = parsed.month;
  });

  const monthLabel = $derived(
    new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(visibleYear, visibleMonth, 1),
    ),
  );
  const weeks = $derived(monthMatrix(visibleYear, visibleMonth));
  const weekdays = $derived(weekdayLabels(locale));
  const selected = $derived(parseISODate(value));

  function shiftMonth(delta: number) {
    const next = new Date(visibleYear, visibleMonth + delta, 1);
    visibleYear = next.getFullYear();
    visibleMonth = next.getMonth();
  }

  function isDisabled(day: number) {
    const iso = toISODate(visibleYear, visibleMonth, day);
    if (minDate && iso < minDate) return true;
    if (maxDate && iso > maxDate) return true;
    return false;
  }

  function select(day: number) {
    const iso = toISODate(visibleYear, visibleMonth, day);
    value = iso;
    onChange?.(iso);
  }
</script>

<div class={cn(styles.calendar, className)} {style}>
  <div class={styles.calendarHeader}>
    <button type="button" class={styles.calendarNav} onclick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
    <span class={styles.calendarTitle}>{monthLabel}</span>
    <button type="button" class={styles.calendarNav} onclick={() => shiftMonth(1)} aria-label="Next month">›</button>
  </div>
  <div class={styles.weekdays} aria-hidden="true">
    {#each weekdays as label}
      <span class={styles.weekday}>{label}</span>
    {/each}
  </div>
  {#each weeks as week, weekIndex}
    <div class={styles.week}>
      {#each week as day, dayIndex}
        {#if day === null}
          <span class={styles.dayButton} data-outside="true"></span>
        {:else}
          <button
            type="button"
            class={styles.dayButton}
            data-selected={
              day === selected.day && visibleMonth === selected.month && visibleYear === selected.year
                ? 'true'
                : undefined
            }
            disabled={isDisabled(day)}
            onclick={() => select(day)}
          >
            {day}
          </button>
        {/if}
      {/each}
    </div>
  {/each}
</div>
