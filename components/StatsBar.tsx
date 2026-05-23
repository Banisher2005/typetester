"use client";

import React, { memo } from "react";
import type { TestMode } from "./ModeSelector";

interface StatsBarProps {
  liveWpm: number;
  accuracy: number;
  mode: TestMode;
  timeLeft?: number;
  wordsLeft?: number;
  isRunning: boolean;
}

const StatsBar = memo(function StatsBar({
  liveWpm,
  accuracy,
  mode,
  timeLeft,
  wordsLeft,
  isRunning,
}: StatsBarProps) {
  return (
    <div className="stats-bar" aria-live="polite" aria-atomic="false">
      <div className="stat-item">
        <span className="stat-value" id="live-wpm">{isRunning ? liveWpm : "—"}</span>
        <span className="stat-label">wpm</span>
      </div>

      <div className="stat-item">
        <span className="stat-value" id="live-accuracy">
          {isRunning ? `${accuracy}%` : "—"}
        </span>
        <span className="stat-label">acc</span>
      </div>

      {mode === "time" && timeLeft !== undefined && (
        <div className="stat-item">
          <span
            className="stat-value"
            id="timer-display"
            style={{ color: timeLeft <= 5 ? "var(--error)" : "var(--accent)" }}
          >
            {isRunning ? timeLeft : "—"}
          </span>
          <span className="stat-label">sec</span>
        </div>
      )}

      {mode === "words" && wordsLeft !== undefined && (
        <div className="stat-item">
          <span className="stat-value" id="words-remaining">
            {isRunning ? wordsLeft : "—"}
          </span>
          <span className="stat-label">words left</span>
        </div>
      )}
    </div>
  );
});

export default StatsBar;
