export interface TestStats {
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedSeconds: number;
}

export function calcWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

export function calcRawWPM(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((totalChars / 5) / (elapsedSeconds / 60));
}

export function calcAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

export interface WPMDataPoint {
  second: number;
  wpm: number;
  rawWpm: number;
}
