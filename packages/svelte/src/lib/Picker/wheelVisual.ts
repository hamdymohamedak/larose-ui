export interface WheelItemVisual {
  opacity: number;
  scale: number;
  rotateX: number;
}

export function getWheelItemVisual(distanceRows: number): WheelItemVisual {
  const abs = Math.min(Math.abs(distanceRows), 2.5);
  if (abs < 0.001) {
    return { opacity: 1, scale: 1, rotateX: 0 };
  }
  const direction = distanceRows < 0 ? 1 : -1;
  return {
    opacity: Math.max(0.28, 1 - abs * 0.22),
    scale: Math.max(0.86, 1 - abs * 0.045),
    rotateX: direction * abs * 14,
  };
}
