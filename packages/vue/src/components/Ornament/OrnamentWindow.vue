<script setup lang="ts">
import { computed, useSlots, watchEffect, type CSSProperties, type Slots } from 'vue';
import type {
  OrnamentConfig,
  OrnamentContentAlignment,
  OrnamentEdge,
  OrnamentVisibility,
} from '../../Ornament/types';
import {
  alignmentToFlex,
  resolveOrnamentVisibility,
  warnIfTooManyOrnaments,
} from '../../Ornament/utils';
import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    edge?: OrnamentEdge;
    alignment?: OrnamentContentAlignment;
    visibility?: OrnamentVisibility;
    immersive?: boolean;
    ornaments?: OrnamentConfig[];
    class?: string;
    style?: CSSProperties;
    'aria-label'?: string;
  }>(),
  {
    edge: 'bottom',
    alignment: 'center',
    visibility: 'visible',
    immersive: false,
    'aria-label': 'Window',
  },
);

const slots: Slots = useSlots();

const resolvedOrnaments = computed((): OrnamentConfig[] => {
  if (props.ornaments?.length) return props.ornaments;
  return [];
});

watchEffect(() => warnIfTooManyOrnaments(resolvedOrnaments.value));

const showOrnaments = computed((): boolean =>
  resolveOrnamentVisibility(props.visibility, props.immersive),
);

const edges: OrnamentEdge[] = ['top', 'bottom', 'leading', 'trailing'];

function itemsForEdge(ornamentEdge: OrnamentEdge): OrnamentConfig[] {
  return resolvedOrnaments.value.filter(
    (item) => (item.edge ?? 'bottom') === ornamentEdge,
  );
}

const hasOrnamentSlot = computed((): boolean => Boolean(slots.ornament));
</script>

<template>
  <section
    :class="cn(styles.window, props.class)"
    :style="props.style"
    :aria-label="props['aria-label']"
    :data-immersive="immersive ? 'true' : undefined"
  >
    <div :class="styles.content" :data-immersive="immersive ? 'true' : undefined">
      <slot />
    </div>

    <template v-if="showOrnaments">
      <template v-for="ornamentEdge in edges" :key="ornamentEdge">
        <div
          v-for="item in itemsForEdge(ornamentEdge)"
          :key="item.id"
          :class="styles.ornamentLayer"
          :data-edge="ornamentEdge"
          :data-alignment="item.alignment ?? alignment"
          :style="{ justifyContent: alignmentToFlex(item.alignment ?? alignment) }"
        >
          <div :class="styles.ornament" role="toolbar" aria-label="Ornament">
            <div :class="styles.ornamentInner">
              <slot :name="`ornament-${item.id}`" />
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="hasOrnamentSlot"
        :class="styles.ornamentLayer"
        :data-edge="edge"
        :data-alignment="alignment"
        :style="{ justifyContent: alignmentToFlex(alignment) }"
      >
        <div :class="styles.ornament" role="toolbar" aria-label="Ornament">
          <div :class="styles.ornamentInner">
            <slot name="ornament" />
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
