<script setup lang="ts">
import Accordion from '../../../packages/vue/src/components/Accordion/Accordion.vue';
import AccordionItem from '../../../packages/vue/src/components/Accordion/AccordionItem.vue';
import AccordionTrigger from '../../../packages/vue/src/components/Accordion/AccordionTrigger.vue';
import AccordionContent from '../../../packages/vue/src/components/Accordion/AccordionContent.vue';

withDefaults(
  defineProps<{
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    defaultValue?: string[];
  }>(),
  {
    type: 'single',
    collapsible: true,
    defaultValue: () => ['profile'],
  },
);
</script>

<template>
  <Accordion :type="type" :collapsible="collapsible" :default-value="defaultValue">
    <AccordionItem value="profile">
      <AccordionTrigger>Profile</AccordionTrigger>
      <AccordionContent>Name, email, and department settings.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="security">
      <AccordionTrigger>Security</AccordionTrigger>
      <AccordionContent>Password, MFA, and active sessions.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="notifications">
      <AccordionTrigger>Notifications</AccordionTrigger>
      <AccordionContent>Email and in-app notification preferences.</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
