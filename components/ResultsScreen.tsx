"use client";

import React, { memo, useMemo } from "react";
import type { WPMDataPoint } from "@/lib/stats";
import type { TestMode } from "./ModeSelector";
import type { BestScore } from "@/lib/bestScores";

interface ResultsScreenProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  elapsedSeconds: number;
  wpmHistory: WPMDataPoint[];
  mode: TestMode;
  bestScore: BestScore | null;
  isNewBest: boolean;
  onRetry: () => void;
  onNewTest: () => void;
  onClearBests: () => void;
}

function AccuracyGraph({ data }: { data: WPMDataPoint[] }) {
  const W = 700;
  const H = 110;
  const PAD = { top: 10, right: 16, bottom: 24, left: 40 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const wpmValues = data.map((d) => d.wpm);
  const rawValues = data.map((d) => d.rawWpm);
  const allValues = [...wpmValues, ...rawValues, 0];
  const maxVal = Math.max(...allValues, 10);
  const minVal = 0;

  const xScale = (i: number) =>
    data.length <= 1 ? PAD.left : PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) =>
    PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const toPolyline = (values: number[]) =>
    values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");

  const wpmLine = data.length > 0 ? toPolyline(wpmValues) : "";
  const rawLine = data.length > 0 ? toPolyline(rawValues) : "";

  // Grid lines
  const gridCount = 4;
  const gridVals = Array.from({ length: gridCount + 1 }, (_, i) =>
    Math.round(minVal + ((maxVal - minVal) * i) / gridCount)
  );

  // X-axis labels (every ~5 seconds)
  const xLabels: number[] = [];
  if (data.length > 0) {
    const step = Math.max(1, Math.round(data.length / 6));
    for (let i = 0; i < data.length; i += step) xLabels.push(i);
    if (xLabels[xLabels.length - 1] !== data.length - 1)
      xLabels.push(data.length - 1);
  }

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-28 text-sm" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
        Not enough data for graph
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="accuracy-graph"
      aria-label="WPM over time graph"
      role="img"
    >
      {/* Grid lines */}
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            y1={yScale(v)}
            x2={W - PAD.right}
            y2={yScale(v)}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3,4"
          />
          <text
            x={PAD.left - 6}
            y={yScale(v) + 4}
            textAnchor="end"
            fontSize="9"
            fill="var(--text-muted)"
            opacity="0.6"
          >
            {v}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {xLabels.map((i) => (
        <text
          key={i}
          x={xScale(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-muted)"
          opacity="0.5"
        >
          {data[i].second}s
        </text>
      ))}

      {/* Raw WPM line (dimmer) */}
      <polyline
        points={rawLine}
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* WPM line */}
      <polyline
        points={wpmLine}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots on WPM line */}
      {wpmValues.map((v, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(v)}
          r="3"
          fill="var(--accent)"
          opacity="0.85"
        />
      ))}

      {/* Legend */}
      <g transform={`translate(${PAD.left + chartW - 120}, ${PAD.top})`}>
        <line x1="0" y1="5" x2="14" y2="5" stroke="var(--accent)" strokeWidth="2.5" />
        <text x="18" y="8" fontSize="9" fill="var(--text-muted)">wpm</text>
        <line x1="50" y1="5" x2="64" y2="5" stroke="var(--text-muted)" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="68" y="8" fontSize="9" fill="var(--text-muted)" opacity="0.6">raw</text>
      </g>
    </svg>
  );
}

const ResultsScreen = memo(function ResultsScreen({
  wpm,
  rawWpm,
  accuracy,
  correctChars,
  incorrectChars,
  elapsedSeconds,
  wpmHistory,
  bestScore,
  isNewBest,
  onRetry,
  onNewTest,
  onClearBests,
}: ResultsScreenProps) {
  const displayTime = useMemo(() => {
    const s = Math.round(elapsedSeconds);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }, [elapsedSeconds]);

  return (
    <div className="results-container w-full" role="region" aria-label="Test results">
      {/* Main stats */}
      <div className="result-card mb-4">
        <div className="flex flex-wrap gap-8 items-end">
          {/* WPM — big */}
          <div>
            <div className="result-wpm-label">wpm</div>
            <div className="result-wpm-row">
              <div className="result-wpm" id="result-wpm">{wpm}</div>
              {isNewBest && (
                <div className="new-best-badge" id="new-best-badge" aria-label="New personal best">
                  🏆 new best!
                </div>
              )}
            </div>
            {/* Previous best (shown only if not a new best and there's a saved score) */}
            {!isNewBest && bestScore && (
              <div className="best-score-hint" id="prev-best-hint">
                prev best: {bestScore.wpm} wpm
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "5rem", background: "var(--border)" }} />

          {/* Secondary stats grid */}
          <div className="flex flex-wrap gap-6">
            <div className="result-stat">
              <span className="result-stat-value" id="result-accuracy">{accuracy}%</span>
              <span className="result-stat-label">accuracy</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" id="result-raw-wpm">{rawWpm}</span>
              <span className="result-stat-label">raw wpm</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" id="result-correct" style={{ color: "var(--correct)" }}>
                {correctChars}
              </span>
              <span className="result-stat-label">correct</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" id="result-incorrect" style={{ color: "var(--error)" }}>
                {incorrectChars}
              </span>
              <span className="result-stat-label">incorrect</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" id="result-time">{displayTime}</span>
              <span className="result-stat-label">time</span>
            </div>
          </div>
        </div>
      </div>

      {/* WPM Graph */}
      <div className="result-card mb-6">
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          WPM over time
        </div>
        <AccuracyGraph data={wpmHistory} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 items-center justify-center">
        <button
          id="btn-retry"
          className="btn-primary"
          onClick={onRetry}
          title="Restart with same words (Tab + Enter)"
        >
          ↺ Try Again
        </button>
        <button
          id="btn-new-test"
          className="btn-secondary"
          onClick={onNewTest}
          title="New test with fresh words"
        >
          ⟳ New Test
        </button>
      </div>

      <p className="text-center mt-4 restart-hint">
        Tab + Enter to restart · Esc to focus
      </p>

      {/* Clear best scores link */}
      <div className="text-center mt-3">
        <button
          id="btn-clear-bests"
          className="clear-bests-btn"
          onClick={onClearBests}
          title="Clear all saved best scores"
        >
          clear best scores
        </button>
      </div>
    </div>
  );
});

export default ResultsScreen;
