<script lang="ts">
  import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    src: string;
    title?: string;
    class?: string;
    style?: string;
    sandbox?: string;
  }

  let {
    src,
    title = 'Web view',
    class: className,
    style,
    sandbox = 'allow-scripts allow-same-origin allow-forms',
  }: Props = $props();
</script>

<iframe {src} {title} class={cn(styles.frameOnly, className)} {style} {sandbox}></iframe>
