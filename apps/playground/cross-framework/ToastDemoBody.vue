<script setup lang="ts">
import { onMounted } from 'vue';
import Button from '../../../packages/vue/src/components/Button/Button.vue';
import { useToast } from '../../../packages/vue/src/composables/useToast';

const props = withDefaults(
  defineProps<{
    autoTitle?: string;
    autoMessage?: string;
    buttonLabel?: string;
  }>(),
  {
    autoTitle: 'Welcome',
    autoMessage: 'laRose toast notifications are ready.',
    buttonLabel: 'Show toast',
  },
);

const { toast } = useToast();

onMounted(() => {
  toast({
    title: props.autoTitle,
    message: props.autoMessage,
    variant: 'info',
  });
});

function show() {
  toast({ title: 'Saved', message: 'Employee record updated.', variant: 'success' });
}
</script>

<template>
  <Button @click="show">{{ buttonLabel }}</Button>
</template>
