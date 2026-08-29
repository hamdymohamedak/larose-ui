import type { VersionInfo } from '@larose-ui/core';
import { LAROSE_VERSION } from '@larose-ui/core';

function parseMajor(version: string): number {
  const match = version.match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
}

export interface VersionCheckOptions {
  frontend?: string;
  backend?: string;
  minBackend?: string;
  maxBackend?: string;
  deprecatedFeatures?: string[];
  requiredFeatures?: string[];
}

export function checkVersionCompatibility(options: VersionCheckOptions): VersionInfo {
  const frontend = options.frontend ?? LAROSE_VERSION;
  const backend = options.backend;
  const warnings: string[] = [];
  let compatible = true;

  if (backend && options.minBackend) {
    if (parseMajor(backend) < parseMajor(options.minBackend)) {
      compatible = false;
      warnings.push(
        `Backend v${backend} is below minimum v${options.minBackend}. Some features may be unavailable.`,
      );
    }
  }

  if (backend && options.maxBackend) {
    if (parseMajor(backend) > parseMajor(options.maxBackend)) {
      compatible = false;
      warnings.push(
        `Backend v${backend} exceeds supported maximum v${options.maxBackend}. Application update required.`,
      );
    }
  }

  for (const feature of options.requiredFeatures ?? []) {
    if (options.deprecatedFeatures?.includes(feature)) {
      compatible = false;
      warnings.push(`Feature "${feature}" requires an application update.`);
    }
  }

  for (const deprecated of options.deprecatedFeatures ?? []) {
    warnings.push(`API "${deprecated}" is deprecated and may be removed.`);
  }

  return { frontend, backend, compatible, warnings };
}
