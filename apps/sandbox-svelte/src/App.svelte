<script lang="ts">
  import { SCENARIOS } from '../../sandbox-shared/scenarios.js';
  import HomeScenario from './scenarios/HomeScenario.svelte';
  import NavigationScenario from './scenarios/NavigationScenario.svelte';
  import CommandScenario from './scenarios/CommandScenario.svelte';
  import OverlaysScenario from './scenarios/OverlaysScenario.svelte';
  import ToastScenario from './scenarios/ToastScenario.svelte';
  import ThemeScenario from './scenarios/ThemeScenario.svelte';
  import FormsScenario from './scenarios/FormsScenario.svelte';
  import AcceleratorsScenario from './scenarios/AcceleratorsScenario.svelte';
  import LiquidGlassScenario from './scenarios/LiquidGlassScenario.svelte';

  function readRoute() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash === 'shell') return 'navigation';
    if (hash === 'command-palette') return 'command';
    return hash || 'home';
  }

  let route = $state(readRoute());

  $effect(() => {
    const onHash = () => {
      route = readRoute();
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  });

  const current = $derived(SCENARIOS.find((s) => s.id === route) ?? SCENARIOS[0]!);
</script>

<div class="sbx-root" data-sbx-framework="svelte">
  <nav class="sbx-nav" aria-label="Sandbox scenarios">
    <div class="sbx-brand">
      <strong>laRose sandbox</strong>
      <span>Svelte 5 · kitchen sink</span>
    </div>
    {#each SCENARIOS as scenario (scenario.id)}
      <a href={`#/${scenario.id}`} aria-current={scenario.id === current.id ? 'page' : undefined}>
        {scenario.title}
      </a>
    {/each}
  </nav>
  <div class="sbx-main">
    <header class="sbx-banner">
      <div>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </div>
      <span class="sbx-pill">Svelte 5</span>
    </header>
    <div class="sbx-stage" data-sbx-scenario={current.id}>
      {#if route === 'navigation'}
        <NavigationScenario />
      {:else if route === 'command'}
        <CommandScenario />
      {:else if route === 'overlays'}
        <OverlaysScenario />
      {:else if route === 'toast'}
        <ToastScenario />
      {:else if route === 'theme'}
        <ThemeScenario />
      {:else if route === 'forms'}
        <FormsScenario />
      {:else if route === 'accelerators'}
        <AcceleratorsScenario />
      {:else if route === 'liquid-glass'}
        <LiquidGlassScenario />
      {:else}
        <HomeScenario />
      {/if}
    </div>
  </div>
</div>
