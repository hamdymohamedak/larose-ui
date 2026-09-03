<script lang="ts">
  import Accordion from '../../../packages/svelte/src/lib/components/Accordion/Accordion.svelte';
  import AccordionItem from '../../../packages/svelte/src/lib/components/Accordion/AccordionItem.svelte';
  import AccordionTrigger from '../../../packages/svelte/src/lib/components/Accordion/AccordionTrigger.svelte';
  import AccordionContent from '../../../packages/svelte/src/lib/components/Accordion/AccordionContent.svelte';

  let {
    type = 'single' as 'single' | 'multiple',
    collapsible = true,
    defaultValue = ['profile'],
  }: {
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    defaultValue?: string[];
  } = $props();
</script>

<Accordion {type} {collapsible} {defaultValue}>
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
