"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ModeSelector, {
  TestMode,
  TimeOption,
  WordOption,
  DifficultyLevel,
} from "./ModeSelector";
import WordDisplay, { WordData } from "./WordDisplay";
import StatsBar from "./StatsBar";
import ResultsScreen from "./ResultsScreen";
import CapsLockWarning from "./CapsLockWarning";
import { getWords } from "@/lib/words";
import { calcWPM, calcRawWPM, calcAccuracy, WPMDataPoint } from "@/lib/stats";
import { SoundManager } from "@/lib/sounds";
import {
  getBestScore,
  saveBestScore,
  clearBestScores,
  BestScore,
} from "@/lib/bestScores";

type TestPhase = "idle" | "running" | "finished";

const WORD_COUNT_FOR_TIME_MODE = 200;

function buildWordData(words: string[]): WordData[] {
  return words.map((w, i) => ({
    word: w,
    typed: "",
    state: i === 0 ? "current" : "upcoming",
  }));
}

export default function TypingTest() {
  // ── Mode state ────────────────────────────────────────────────────────────
  const [testMode, setTestMode] = useState<TestMode>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(60);
  const [wordOption, setWordOption] = useState<WordOption>(50);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // ── Sound ─────────────────────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ── Test state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [wpmHistory, setWpmHistory] = useState<WPMDataPoint[]>([]);
  const [liveWpm, setLiveWpm] = useState(0);

  // ── Final results snapshot ────────────────────────────────────────────────
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    elapsedSeconds: 0,
  });

  // ── Best score state ──────────────────────────────────────────────────────
  const [bestScore, setBestScore] = useState<BestScore | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);
  const elapsedRef = useRef(0);
  const wpmHistoryRef = useRef<WPMDataPoint[]>([]);
  const tabPressedRef = useRef(false);
  const phaseRef = useRef<TestPhase>("idle");
  const wordsRef = useRef<WordData[]>([]);

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { wordsRef.current = words; }, [words]);

  // ── Theme init ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("typetester-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("typetester-theme", theme);
  }, [theme]);

  // ── Sound init ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("typetester-sound");
    if (saved === "off") {
      setSoundEnabled(false);
      SoundManager.setEnabled(false);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      SoundManager.setEnabled(next);
      localStorage.setItem("typetester-sound", next ? "on" : "off");
      return next;
    });
  }, []);

  // ── Generate words ────────────────────────────────────────────────────────
  const generateWords = useCallback(
    (
      mode: TestMode,
      wOption: WordOption,
      diff: DifficultyLevel,
      punct: boolean,
      nums: boolean
    ) => {
      const count = mode === "time" ? WORD_COUNT_FOR_TIME_MODE : wOption;
      const raw = getWords(count, diff, punct, nums);
      return buildWordData(raw);
    },
    []
  );

  // ── Initialize / reset ────────────────────────────────────────────────────
  const resetTest = useCallback(
    (keepWords = false) => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;

      const newWords = keepWords
        ? wordsRef.current.map((w, i) => ({
            ...w,
            typed: "",
            state: (i === 0 ? "current" : "upcoming") as WordData["state"],
          }))
        : generateWords(testMode, wordOption, difficulty, punctuation, numbers);

      correctCharsRef.current = 0;
      totalCharsRef.current = 0;
      elapsedRef.current = 0;
      wpmHistoryRef.current = [];
      startTimeRef.current = null;

      setWords(newWords);
      setCurrentWordIndex(0);
      setCurrentInput("");
      setCorrectChars(0);
      setTotalChars(0);
      setElapsedSeconds(0);
      setTimeLeft(timeOption);
      setWpmHistory([]);
      setLiveWpm(0);
      setIsNewBest(false);
      setPhase("idle");

      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [testMode, wordOption, timeOption, difficulty, punctuation, numbers, generateWords]
  );

  // Initial load
  useEffect(() => {
    const initial = generateWords("time", 50, "medium", false, false);
    setWords(initial);
    setTimeLeft(60);
    setTimeout(() => inputRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Finish test ────────────────────────────────────────────────────────────
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    const elapsed = elapsedRef.current;
    const correct = correctCharsRef.current;
    const total = totalCharsRef.current;
    const incorrect = total - correct;

    const wpm = calcWPM(correct, elapsed);
    const rawWpm = calcRawWPM(total, elapsed);
    const accuracy = calcAccuracy(correct, total);

    setFinalStats({
      wpm,
      rawWpm,
      accuracy,
      correctChars: correct,
      incorrectChars: Math.max(0, incorrect),
      elapsedSeconds: elapsed,
    });
    setWpmHistory([...wpmHistoryRef.current]);
    setPhase("finished");

    // Sound
    SoundManager.playFinish();

    // Best score — read current mode/option from closure
    // (these are stable at time of finish call)
  }, []);

  // We need testMode/timeOption/wordOption when finish is called —
  // use a ref to avoid stale closures
  const testModeRef = useRef(testMode);
  const timeOptionRef = useRef(timeOption);
  const wordOptionRef = useRef(wordOption);
  useEffect(() => { testModeRef.current = testMode; }, [testMode]);
  useEffect(() => { timeOptionRef.current = timeOption; }, [timeOption]);
  useEffect(() => { wordOptionRef.current = wordOption; }, [wordOption]);

  // Persist best score + load prev best when phase changes to finished
  useEffect(() => {
    if (phase !== "finished") return;

    const mode = testModeRef.current;
    const option = mode === "time" ? timeOptionRef.current : wordOptionRef.current;

    const prevBest = getBestScore(mode, option);
    setBestScore(prevBest);

    const newBest = saveBestScore(mode, option, finalStats.wpm, finalStats.accuracy);
    setIsNewBest(newBest);

    // Update displayed bestScore to the new value if it's a new best
    if (newBest) {
      setBestScore({ wpm: finalStats.wpm, accuracy: finalStats.accuracy, date: new Date().toISOString() });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Timer logic ───────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      elapsedRef.current = elapsed;

      const second = Math.floor(elapsed);
      const wpm = calcWPM(correctCharsRef.current, elapsed);
      const rawWpm = calcRawWPM(totalCharsRef.current, elapsed);

      // Record WPM history once per second
      if (wpmHistoryRef.current.length === 0 || wpmHistoryRef.current[wpmHistoryRef.current.length - 1].second < second) {
        wpmHistoryRef.current.push({ second, wpm, rawWpm });
      }

      setLiveWpm(wpm);
      setElapsedSeconds(elapsed);

      if (phaseRef.current === "running") {
        if (testMode === "time") {
          const remaining = Math.max(0, timeOption - elapsed);
          setTimeLeft(Math.ceil(remaining));
          if (remaining <= 0) {
            finishTest();
          }
        }
      }
    }, 250);
  }, [testMode, timeOption, finishTest]);

  // ── Keyboard shortcut handler ─────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }
      if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        resetTest(false);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      tabPressedRef.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resetTest]);

  // ── Computed live stats ───────────────────────────────────────────────────
  const liveAccuracy = useMemo(
    () => calcAccuracy(correctCharsRef.current, totalCharsRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [correctChars, totalChars]
  );

  const wordsLeft = useMemo(() => {
    if (testMode !== "words") return 0;
    return Math.max(0, words.length - currentWordIndex - 1);
  }, [testMode, words.length, currentWordIndex]);

  // ── Input handler ─────────────────────────────────────────────────────────
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (phaseRef.current === "finished") return;

      const val = e.target.value;

      // Start timer on first keystroke
      if (phaseRef.current === "idle" && val.length > 0) {
        setPhase("running");
        phaseRef.current = "running";
        startTimer();
      }

      // Space pressed — advance word
      if (val.endsWith(" ")) {
        const typed = val.trimEnd();
        if (typed.length === 0) {
          setCurrentInput("");
          return;
        }

        const nextIdx = currentWordIndex + 1;

        // Count chars for this word submission
        const wordTarget = wordsRef.current[currentWordIndex]?.word ?? "";
        let wordCorrect = 0;
        const maxLen = Math.max(typed.length, wordTarget.length);
        for (let i = 0; i < maxLen; i++) {
          if (typed[i] === wordTarget[i]) wordCorrect++;
        }
        // Space itself counts as a char (correct if we advance)
        const wordTotal = typed.length + 1; // +1 for space
        correctCharsRef.current += wordCorrect;
        totalCharsRef.current += wordTotal;
        setCorrectChars(correctCharsRef.current);
        setTotalChars(totalCharsRef.current);

        // Update word state
        setWords((prev) => {
          const updated = [...prev];
          updated[currentWordIndex] = {
            ...updated[currentWordIndex],
            typed,
            state: "done",
          };
          if (nextIdx < updated.length) {
            updated[nextIdx] = { ...updated[nextIdx], state: "current" };
          }
          wordsRef.current = updated;
          return updated;
        });

        setCurrentWordIndex(nextIdx);
        setCurrentInput("");

        // Words mode: check if finished
        if (testMode === "words" && nextIdx >= wordOption) {
          elapsedRef.current = startTimeRef.current
            ? (Date.now() - startTimeRef.current) / 1000
            : 0;
          finishTest();
        }

        return;
      }

      // Backspace — don't allow going back to previous word, just update current
      setCurrentInput(val);
    },
    [currentWordIndex, testMode, wordOption, startTimer, finishTest]
  );

  // Track chars for live accuracy on non-space keystrokes
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (phaseRef.current === "finished") return;

      // Prevent Tab default (handled globally)
      if (e.key === "Tab") {
        e.preventDefault();
        return;
      }

      // Don't track backspace or modifier keys
      if (
        e.key === "Backspace" ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "CapsLock" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      )
        return;

      if (e.key === " ") return; // handled in onChange

      // Single printable char: count it + play sound
      if (e.key.length === 1) {
        const wordTarget = wordsRef.current[currentWordIndex]?.word ?? "";
        const typedSoFar = currentInput;
        const pos = typedSoFar.length;
        const isCorrect = e.key === wordTarget[pos];

        totalCharsRef.current += 1;
        if (isCorrect) {
          correctCharsRef.current += 1;
          SoundManager.playCorrect();
        } else {
          SoundManager.playIncorrect();
        }
        setTotalChars(totalCharsRef.current);
        setCorrectChars(correctCharsRef.current);
      }
    },
    [currentWordIndex, currentInput]
  );

  // ── Mode change resets test ───────────────────────────────────────────────
  const handleModeChange = useCallback(
    (mode: TestMode) => {
      setTestMode(mode);
      setTimeout(() => resetTest(false), 0);
    },
    [resetTest]
  );

  const handleTimeChange = useCallback(
    (t: TimeOption) => {
      setTimeOption(t);
      setTimeLeft(t);
      setTimeout(() => resetTest(false), 0);
    },
    [resetTest]
  );

  const handleWordChange = useCallback(
    (w: WordOption) => {
      setWordOption(w);
      setTimeout(() => resetTest(false), 0);
    },
    [resetTest]
  );

  const handleDifficultyChange = useCallback(
    (d: DifficultyLevel) => {
      setDifficulty(d);
      setTimeout(() => resetTest(false), 0);
    },
    [resetTest]
  );

  const handlePunctuationToggle = useCallback(() => {
    setPunctuation((prev) => {
      setTimeout(() => resetTest(false), 0);
      return !prev;
    });
  }, [resetTest]);

  const handleNumbersToggle = useCallback(() => {
    setNumbers((prev) => {
      setTimeout(() => resetTest(false), 0);
      return !prev;
    });
  }, [resetTest]);

  const handleClearBests = useCallback(() => {
    clearBestScores();
    setBestScore(null);
    setIsNewBest(false);
  }, []);

  // ── Clicking the word display focuses the input ───────────────────────────
  const handleDisplayClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // ── Clean up on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full"
      style={{ maxWidth: "900px" }}
      id="typetester-app"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <span className="app-logo" aria-label="TypeTester">
          typetester
        </span>
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            id="sound-toggle"
            className="theme-toggle"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          {/* Theme toggle */}
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            title="Toggle light/dark theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Mode selector — hidden during results */}
      {phase !== "finished" && (
        <div className="mb-6 flex justify-center">
          <ModeSelector
            mode={testMode}
            timeOption={timeOption}
            wordOption={wordOption}
            difficulty={difficulty}
            punctuation={punctuation}
            numbers={numbers}
            onModeChange={handleModeChange}
            onTimeChange={handleTimeChange}
            onWordChange={handleWordChange}
            onDifficultyChange={handleDifficultyChange}
            onPunctuationToggle={handlePunctuationToggle}
            onNumbersToggle={handleNumbersToggle}
            disabled={phase === "running"}
          />
        </div>
      )}

      {phase === "finished" ? (
        /* Results */
        <ResultsScreen
          wpm={finalStats.wpm}
          rawWpm={finalStats.rawWpm}
          accuracy={finalStats.accuracy}
          correctChars={finalStats.correctChars}
          incorrectChars={finalStats.incorrectChars}
          elapsedSeconds={finalStats.elapsedSeconds}
          wpmHistory={wpmHistory}
          mode={testMode}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onRetry={() => resetTest(true)}
          onNewTest={() => resetTest(false)}
          onClearBests={handleClearBests}
        />
      ) : (
        <>
          {/* Live stats bar */}
          <div className="mb-5 flex justify-center">
            <StatsBar
              liveWpm={liveWpm}
              accuracy={liveAccuracy}
              mode={testMode}
              timeLeft={Math.ceil(timeLeft)}
              wordsLeft={wordsLeft}
              isRunning={phase === "running"}
            />
          </div>

          {/* Typing area */}
          <div
            className={`typing-area ${phase === "running" ? "typing-active" : ""}`}
            onClick={handleDisplayClick}
            id="typing-area"
          >
            {/* Caps Lock Warning */}
            <CapsLockWarning inputRef={inputRef} />

            {/* Hidden input */}
            <input
              ref={inputRef}
              id="hidden-input"
              className="hidden-input"
              type="text"
              value={currentInput}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Type here"
              tabIndex={0}
            />

            {/* Word display */}
            <WordDisplay
              words={words}
              currentWordIndex={currentWordIndex}
              currentInput={currentInput}
            />
          </div>

          {/* Restart hint */}
          {phase === "idle" && (
            <p className="text-center mt-6 restart-hint">
              Start typing to begin · Tab + Enter to restart · Esc to focus
            </p>
          )}
          {phase === "running" && testMode === "time" && (
            <p className="text-center mt-4 restart-hint">
              Tab + Enter to restart
            </p>
          )}
        </>
      )}
    </div>
  );
}
