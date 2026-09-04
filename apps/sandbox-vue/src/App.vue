<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { SCENARIOS } from '../../sandbox-shared/scenarios.js';
import HomeScenario from './scenarios/HomeScenario.vue';
import NavigationScenario from './scenarios/NavigationScenario.vue';
import CommandScenario from './scenarios/CommandScenario.vue';
import OverlaysScenario from './scenarios/OverlaysScenario.vue';
import ToastScenario from './scenarios/ToastScenario.vue';
import ThemeScenario from './scenarios/ThemeScenario.vue';
import FormsScenario from './scenarios/FormsScenario.vue';
import AcceleratorsScenario from './scenarios/AcceleratorsScenario.vue';

function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'shell') return 'navigation';
  if (hash === 'command-palette') return 'command';
  return hash || 'home';
}

const route = ref(readRoute());
function onHash() {
  route.value = readRoute();
}
onMounted(() => window.addEventListener('hashchange', onHash));
onUnmounted(() => window.removeEventListener('hashchange', onHash));

const current = computed(() => SCENARIOS.find((s) => s.id === route.value) ?? SCENARIOS[0]!);
</script>

<template>
  <div class="sbx-root" data-sbx-framework="vue">
    <nav class="sbx-nav" aria-label="Sandbox scenarios">
      <div class="sbx-brand">
        <strong>laRose sandbox</strong>
        <span>Vue 3 · kitchen sink</span>
      </div>
      <a
        v-for="scenario in SCENARIOS"
        :key="scenario.id"
        :href="`#/${scenario.id}`"
        :aria-current="scenario.id === current.id ? 'page' : undefined"
      >
        {{ scenario.title }}
      </a>
    </nav>
    <div class="sbx-main">
      <header class="sbx-banner">
        <div>
          <h1>{{ current.title }}</h1>
          <p>{{ current.description }}</p>
        </div>
        <span class="sbx-pill">Vue 3</span>
      </header>
      <div class="sbx-stage" :data-sbx-scenario="current.id">
        <HomeScenario v-if="route === 'home'" />
        <NavigationScenario v-else-if="route === 'navigation'" />
        <CommandScenario v-else-if="route === 'command'" />
        <OverlaysScenario v-else-if="route === 'overlays'" />
        <ToastScenario v-else-if="route === 'toast'" />
        <ThemeScenario v-else-if="route === 'theme'" />
        <FormsScenario v-else-if="route === 'forms'" />
        <AcceleratorsScenario v-else-if="route === 'accelerators'" />
        <HomeScenario v-else />
      </div>
    </div>
  </div>
</template>
