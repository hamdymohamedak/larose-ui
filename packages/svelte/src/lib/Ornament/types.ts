
export type OrnamentEdge = 'top' | 'bottom' | 'leading' | 'trailing';

export type OrnamentVisibility = 'visible' | 'hidden' | 'automatic';

export type OrnamentContentAlignment = 'center' | 'leading' | 'trailing';

export interface OrnamentConfig {
  id: string;
  content: unknown;
  edge?: OrnamentEdge;
  alignment?: OrnamentContentAlignment;
  /** Hide during immersive content (video, photo). */
  autoHideImmersive?: boolean;
}
