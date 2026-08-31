export {
  registerHost,
  readRegisteredHost,
  clearRegisteredHost,
} from './host';

export {
  acceleratorToElectron,
  acceleratorToTauri,
} from './acceleratorNative';

export {
  mapMenuEntries,
  mapMenuBarToNative,
} from './nativeMenu';
export type {
  NativeMenuItem,
  NativeMenuBarMenu,
  NativeMenuBarInput,
  MapNativeMenuOptions,
} from './nativeMenu';

export {
  WINDOW_CHROME_CSS_VARS,
  DEFAULT_WINDOW_CHROME,
  applyWindowChromeTokens,
  WINDOW_CHROME_STYLES,
} from './windowChrome';
export type { WindowChromeOptions, WindowChromeVibrancy } from './windowChrome';

export {
  detectHostEnvironment,
  capabilitiesForPlatform,
} from '@larose-ui/runtime-core';
export type {
  HostPlatform,
  HostOS,
  HostCapabilities,
  HostEnvironment,
} from '@larose-ui/runtime-core';

export { STANDARD_ACCELERATORS } from '@larose-ui/core';
export type { StandardAcceleratorId, Accelerator } from '@larose-ui/core';
