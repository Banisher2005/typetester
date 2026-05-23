"use client";

import React from "react";

export type TestMode = "time" | "words";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;
export type DifficultyLevel = "easy" | "medium" | "hard";

interface ModeSelectorProps {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  difficulty: DifficultyLevel;
  punctuation: boolean;
  numbers: boolean;
  onModeChange: (mode: TestMode) => void;
  onTimeChange: (t: TimeOption) => void;
  onWordChange: (w: WordOption) => void;
  onDifficultyChange: (d: DifficultyLevel) => void;
  onPunctuationToggle: () => void;
  onNumbersToggle: () => void;
  disabled?: boolean;
}

const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120];
const WORD_OPTIONS: WordOption[] = [10, 25, 50, 100];
const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: "easy", label: "easy" },
  { value: "medium", label: "medium" },
  { value: "hard", label: "hard" },
];

export default function ModeSelector({
  mode,
  timeOption,
  wordOption,
  difficulty,
  punctuation,
  numbers,
  onModeChange,
  onTimeChange,
  onWordChange,
  onDifficultyChange,
  onPunctuationToggle,
  onNumbersToggle,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div className="mode-selector-stack">
      {/* Row 1: mode type + time/word sub-options */}
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

        <div className="mode-divider" />

        {/* Punctuation + Numbers toggles */}
        <div className="mode-group" role="group" aria-label="Content options">
          <button
            id="toggle-punctuation"
            className={`mode-btn mode-btn-icon ${punctuation ? "active" : ""}`}
            onClick={() => !disabled && onPunctuationToggle()}
            aria-pressed={punctuation}
            title="Toggle punctuation"
          >
            @
          </button>
          <button
            id="toggle-numbers"
            className={`mode-btn mode-btn-icon ${numbers ? "active" : ""}`}
            onClick={() => !disabled && onNumbersToggle()}
            aria-pressed={numbers}
            title="Toggle numbers"
          >
            #
          </button>
        </div>
      </div>

      {/* Row 2: Difficulty selector */}
      <div className="mode-selector mode-selector-secondary" role="group" aria-label="Difficulty">
        <span className="mode-label">difficulty</span>
        <div className="mode-divider" />
        <div className="mode-group">
          {DIFFICULTY_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              id={`difficulty-${value}`}
              className={`mode-btn mode-btn-difficulty mode-btn-difficulty-${value} ${difficulty === value ? "active" : ""}`}
              onClick={() => !disabled && onDifficultyChange(value)}
              aria-pressed={difficulty === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
