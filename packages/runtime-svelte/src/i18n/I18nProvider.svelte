<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Locale, Messages } from '@larose-ui/runtime-core';
  import { createI18nValue, setI18nContext } from './context';

  interface Props {
    locale?: Locale;
    messages?: Partial<Record<Locale, Partial<Messages>>>;
    children?: Snippet;
  }

  let { locale = 'en', messages, children }: Props = $props();
  const i18n = createI18nValue(locale, messages);
  setI18nContext(i18n);
</script>

<div dir={i18n.dir} lang={locale}>
  {@render children?.()}
</div>
