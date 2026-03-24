/** React Strict Mode の二重マウントでも API が並列で二重送信されないようにする */
let processingLocked = false;

export function resetEstimateProcessingLock(): void {
  processingLocked = false;
}

/** 取得できたら true（このマウントが処理担当） */
export function acquireEstimateProcessingLock(): boolean {
  if (processingLocked) return false;
  processingLocked = true;
  return true;
}

export function releaseEstimateProcessingLock(): void {
  processingLocked = false;
}
