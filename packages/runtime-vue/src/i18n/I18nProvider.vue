<script setup lang="ts">
import type { Locale, Messages } from '@larose-ui/runtime-core';
import { provideI18n, useI18n } from './context';

const props = withDefaults(
  defineProps<{
    locale?: Locale;
    messages?: Partial<Record<Locale, Partial<Messages>>>;
  }>(),
  { locale: 'en' },
);

provideI18n(props.locale, props.messages);
const i18n = useI18n();
</script>

<template>
  <div :dir="i18n.dir" :lang="locale">
    <slot />
  </div>
</template>
