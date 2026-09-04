export interface SandboxScenario {
  id: string;
  title: string;
  description: string;
}

export declare const SCENARIOS: SandboxScenario[];

export declare const SANDBOX_PORTS: {
  react: number;
  vue: number;
  svelte: number;
};

export declare const SANDBOX_GLASS_OPTICS: Record<string, string | number | boolean>;
export declare const SANDBOX_GLASS_CONTROLS: Record<string, string | number | boolean>;
export declare const SANDBOX_GLASS_CARD: Record<string, string | number | boolean>;
export declare const SANDBOX_GLASS_CHROME: Record<string, string | number | boolean>;
