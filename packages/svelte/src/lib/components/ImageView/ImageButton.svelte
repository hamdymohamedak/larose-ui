<script lang="ts">
  import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    src: string;
    alt: string;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onclick?: () => void;
  }

  let { src, alt, class: className, style, ariaLabel, onclick }: Props = $props();
</script>

<button type="button" class={cn(styles.imageButton, className)} {style} aria-label={ariaLabel ?? alt} {onclick}>
  <img {src} {alt} class={styles.imageButtonImage} />
</button>
