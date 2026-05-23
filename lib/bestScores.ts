import type { TestMode } from "@/components/ModeSelector";
import type { WordOption, TimeOption } from "@/components/ModeSelector";

export interface BestScore {
  wpm: number;
  accuracy: number;
  date: string; // ISO string
}

const STORAGE_KEY = "typetester-best-scores";

type ScoreMap = Record<string, BestScore>;

function scoreKey(mode: TestMode, option: TimeOption | WordOption): string {
  return `${mode}-${option}`;
}

function loadScores(): ScoreMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreMap) : {};
  } catch {
    return {};
  }
}

function saveScores(scores: ScoreMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Quota exceeded or private mode — ignore
  }
}

/** Get the best score for a given mode + option combination. */
export function getBestScore(
  mode: TestMode,
  option: TimeOption | WordOption
): BestScore | null {
  const scores = loadScores();
  return scores[scoreKey(mode, option)] ?? null;
}

/**
 * Save a new score if it's better than the existing best.
 * Returns true if this is a new personal best.
 */
export function saveBestScore(
  mode: TestMode,
  option: TimeOption | WordOption,
  wpm: number,
  accuracy: number
): boolean {
  const scores = loadScores();
  const key = scoreKey(mode, option);
  const existing = scores[key];

  if (!existing || wpm > existing.wpm) {
    scores[key] = { wpm, accuracy, date: new Date().toISOString() };
    saveScores(scores);
    return true;
  }
  return false;
}

/** Clear all saved best scores. */
export function clearBestScores(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
