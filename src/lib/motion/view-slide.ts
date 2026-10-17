export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** スクロール連動 opacity の中盤で 0→1（左スライド用） */
export function viewSlideProgress(
  scrollOpacity: number,
  start: number,
  span: number
) {
  return clamp01((scrollOpacity - start) / span);
}

export function viewSlideEase(t: number) {
  return 1 - Math.pow(1 - t, 2);
}

export function viewSlideTranslateX(
  slide: number,
  distancePx = 120
): number {
  return (1 - viewSlideEase(slide)) * -distancePx;
}
