"use client";

import React, { memo, useRef, useEffect } from "react";

export type CharState = "correct" | "incorrect" | "untyped" | "extra";

export interface WordData {
  word: string;
  typed: string;
  state: "current" | "done" | "upcoming";
}

interface WordDisplayProps {
  words: WordData[];
  currentWordIndex: number;
  currentInput: string;
}

const LINE_HEIGHT_REM = 2.6; // must match CSS line-height

const WordDisplay = memo(function WordDisplay({
  words,
  currentWordIndex,
  currentInput,
}: WordDisplayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);

  // Scroll so the current word's line is always in the top visible row
  useEffect(() => {
    if (!wrapperRef.current || !currentWordRef.current) return;
    const wrapper = wrapperRef.current;
    const word = currentWordRef.current;
    const wordTop = word.offsetTop;
    // We want the line containing wordTop to be the first visible line
    // but never scroll back up (monotonic scroll)
    const targetScroll = Math.max(0, wordTop - 4); // 4px padding
    wrapper.scrollTop = targetScroll;
  }, [currentWordIndex]);

  return (
    <div
      ref={wrapperRef}
      className="word-display"
      role="text"
      aria-label="Typing test passage"
      style={{
        overflowY: "hidden",
        maxHeight: `${LINE_HEIGHT_REM * 3}rem`,
        lineHeight: `${LINE_HEIGHT_REM}rem`,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", rowGap: "0" }}>
        {words.map((wordData, wordIdx) => {
          const isCurrent = wordIdx === currentWordIndex;
          const isDone = wordIdx < currentWordIndex;
          const typed = isCurrent ? currentInput : wordData.typed;

          let wordClass = "word";
          if (isCurrent) wordClass += " word-current";
          else if (isDone && wordData.typed !== wordData.word) {
            wordClass += " word-incorrect-done";
          }

          const chars = wordData.word.split("");
          const typedChars = typed.split("");
          const maxLen = Math.max(chars.length, typedChars.length);

          return (
            <span
              key={wordIdx}
              className={wordClass}
              ref={isCurrent ? currentWordRef : undefined}
            >
              {Array.from({ length: maxLen }, (_, charIdx) => {
                const original = chars[charIdx];
                const typedChar = typedChars[charIdx];

                // Extra typed character beyond word length
                if (charIdx >= chars.length) {
                  return (
                    <span key={charIdx} className="char char-extra">
                      {typedChar}
                    </span>
                  );
                }

                let charClass = "char";

                if (!isCurrent && !isDone) {
                  charClass += " char-untyped";
                } else if (isCurrent) {
                  if (charIdx < typedChars.length) {
                    charClass += typedChar === original ? " char-correct" : " char-incorrect";
                  } else if (charIdx === typedChars.length) {
                    charClass += " char-cursor char-untyped";
                  } else {
                    charClass += " char-untyped";
                  }
                } else {
                  // Done word
                  if (charIdx < typedChars.length) {
                    charClass += typedChar === original ? " char-correct" : " char-incorrect";
                  } else {
                    charClass += " char-incorrect"; // missing characters
                  }
                }

                return (
                  <span key={charIdx} className={charClass}>
                    {original}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
});

export default WordDisplay;
