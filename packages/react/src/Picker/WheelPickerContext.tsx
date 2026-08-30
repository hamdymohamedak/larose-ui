import { createContext, useContext } from 'react';

const WheelPickerRowHeightContext = createContext(0);

export const WheelPickerRowHeightProvider = WheelPickerRowHeightContext.Provider;

export function useWheelPickerRowHeight(): number {
  return useContext(WheelPickerRowHeightContext);
}
