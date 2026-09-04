<script setup lang="ts">
import Header from '../../../packages/vue/src/components/Header/Header.vue';
import HeaderBrand from '../../../packages/vue/src/components/Header/HeaderBrand.vue';
import HeaderTitle from '../../../packages/vue/src/components/Header/HeaderTitle.vue';
import HeaderActions from '../../../packages/vue/src/components/Header/HeaderActions.vue';

withDefaults(
  defineProps<{
    title?: string;
    brand?: string;
  }>(),
  { title: 'Employees', brand: 'laRose' },
);
</script>

<template>
  <Header>
    <HeaderBrand>{{ brand }}</HeaderBrand>
    <HeaderTitle>{{ title }}</HeaderTitle>
    <HeaderActions>
      <button type="button">Action</button>
    </HeaderActions>
  </Header>
</template>
