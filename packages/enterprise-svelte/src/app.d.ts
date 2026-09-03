declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.svelte' {
  export { SvelteComponent as default } from 'svelte';
}
