/// <reference types="vite/client" />

declare module '@larose-ui/styles/components/*/*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '@larose-ui/styles/components/*/*/*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
