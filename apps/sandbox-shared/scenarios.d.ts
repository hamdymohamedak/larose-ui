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
