"use client";

import React, { useState, useEffect } from "react";

interface CapsLockWarningProps {
  /** Pass the hidden input's ref so we can also detect CapsLock on focus */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function CapsLockWarning({ inputRef }: CapsLockWarningProps) {
  const [capsOn, setCapsOn] = useState(false);

  useEffect(() => {
    const check = (e: KeyboardEvent) => {
      // getModifierState is reliable on keydown/keyup
      setCapsOn(e.getModifierState("CapsLock"));
    };

    window.addEventListener("keydown", check);
    window.addEventListener("keyup", check);

    // Also check when the hidden input is focused
    const input = inputRef?.current;
    const onFocus = (e: FocusEvent) => {
      if (e instanceof KeyboardEvent) {
        setCapsOn(e.getModifierState("CapsLock"));
      }
    };
    if (input) input.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("keydown", check);
      window.removeEventListener("keyup", check);
      if (input) input.removeEventListener("focus", onFocus);
    };
  }, [inputRef]);

  return (
    <div
      className={`caps-lock-warning ${capsOn ? "caps-lock-visible" : ""}`}
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className="caps-lock-icon">⇪</span>
      <span>CAPS LOCK</span>
    </div>
  );
}
