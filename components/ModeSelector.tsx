"use client";

import React from "react";

export type TestMode = "time" | "words";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;

interface ModeSelectorProps {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  onModeChange: (mode: TestMode) => void;
  onTimeChange: (t: TimeOption) => void;
  onWordChange: (w: WordOption) => void;
  disabled?: boolean;
}

const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120];
const WORD_OPTIONS: WordOption[] = [10, 25, 50, 100];

export default function ModeSelector({
  mode,
  timeOption,
  wordOption,
  onModeChange,
  onTimeChange,
  onWordChange,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div className="mode-selector" role="toolbar" aria-label="Test mode selector">
      {/* Mode type */}
      <div className="mode-group">
        <button
          id="mode-time"
          className={`mode-btn ${mode === "time" ? "active" : ""}`}
          onClick={() => !disabled && onModeChange("time")}
          aria-pressed={mode === "time"}
          title="Time mode"
        >
          ⏱ time
        </button>
        <button
          id="mode-words"
          className={`mode-btn ${mode === "words" ? "active" : ""}`}
          onClick={() => !disabled && onModeChange("words")}
          aria-pressed={mode === "words"}
          title="Words mode"
        >
          📝 words
        </button>
      </div>

      <div className="mode-divider" />

      {/* Time options */}
      {mode === "time" && (
        <div className="mode-group" role="group" aria-label="Time options">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              id={`time-option-${t}`}
              className={`mode-btn ${timeOption === t ? "active" : ""}`}
              onClick={() => !disabled && onTimeChange(t)}
              aria-pressed={timeOption === t}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Word count options */}
      {mode === "words" && (
        <div className="mode-group" role="group" aria-label="Word count options">
          {WORD_OPTIONS.map((w) => (
            <button
              key={w}
              id={`word-option-${w}`}
              className={`mode-btn ${wordOption === w ? "active" : ""}`}
              onClick={() => !disabled && onWordChange(w)}
              aria-pressed={wordOption === w}
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
