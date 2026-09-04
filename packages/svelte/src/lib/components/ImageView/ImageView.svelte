<script lang="ts">
  import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
  import { cn } from '../../utils/cn';
  import type { ImageBackground, ImageFit, ImageFrameSequence } from '../../ImageView/types';
  import { nextFrameIndex, sequenceInterval } from '../../ImageView/utils';

  interface Props {
    src?: string;
    alt: string;
    fit?: ImageFit;
    objectPosition?: string;
    background?: ImageBackground;
    sequence?: ImageFrameSequence;
    class?: string;
    style?: string;
    frameClass?: string;
    frameStyle?: string;
  }

  let {
    src,
    alt,
    fit = 'contain',
    objectPosition = 'center',
    background = 'opaque',
    sequence,
    class: className,
    style,
    frameClass,
    frameStyle,
  }: Props = $props();

  let frameIndex = $state(0);

  $effect(() => {
    if (!sequence?.frames.length) return;
    frameIndex = 0;
    const timer = window.setInterval(() => {
      frameIndex = nextFrameIndex(frameIndex, sequence.frames.length);
    }, sequenceInterval(sequence));
    return () => window.clearInterval(timer);
  });

  const activeSrc = $derived(sequence?.frames.length ? sequence.frames[frameIndex] : src);
</script>

{#if activeSrc}
  <div class={cn(styles.frame, frameClass)} style={frameStyle} data-background={background}>
    <img
      src={activeSrc}
      alt={alt}
      class={cn(styles.image, className)}
      style={`object-fit:${fit};object-position:${objectPosition};${style ?? ''}`}
    />
  </div>
{/if}
