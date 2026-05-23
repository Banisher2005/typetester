"use client";

import React, { useState, useRef, useEffect } from "react";

export interface ThemeDefinition {
  id: string;
  name: string;
  bg: string;
  accent: string;
  text: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: "dark",       name: "Dark",       bg: "#1a1a1a", accent: "#f0c040", text: "#e2e2e2" },
  { id: "light",      name: "Light",      bg: "#f5f5f5", accent: "#d97706", text: "#1a1a1a" },
  { id: "serika",     name: "Serika",     bg: "#323437", accent: "#e2b714", text: "#d1d0c5" },
  { id: "botanical",  name: "Botanical",  bg: "#1a2e1a", accent: "#81c784", text: "#c8e6c9" },
  { id: "carbon",     name: "Carbon",     bg: "#0d1117", accent: "#58a6ff", text: "#c9d1d9" },
  { id: "mocha",      name: "Mocha",      bg: "#1e1e2e", accent: "#f5c2e7", text: "#cdd6f4" },
  { id: "ocean",      name: "Ocean",      bg: "#0b1622", accent: "#4dd0e1", text: "#b4c8db" },
  { id: "rose",       name: "Rosé",       bg: "#1c1520", accent: "#f48fb1", text: "#e0d0e0" },
  { id: "lavender",   name: "Lavender",   bg: "#181825", accent: "#b4befe", text: "#cdd6f4" },
  { id: "cream",      name: "Cream",      bg: "#faf4ed", accent: "#d7827e", text: "#575279" },
];

interface ThemePickerProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export default function ThemePicker({ currentTheme, onThemeChange }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="theme-picker-wrapper" ref={pickerRef}>
      <button
        id="theme-picker-btn"
        className="header-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change color theme"
        title="Change color theme"
      >
        🎨
      </button>

      {open && (
        <div className="theme-picker-dropdown" role="listbox" aria-label="Color themes">
          <div className="theme-picker-title">theme</div>
          <div className="theme-picker-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-swatch-btn ${currentTheme === t.id ? "theme-swatch-active" : ""}`}
                onClick={() => {
                  onThemeChange(t.id);
                  setOpen(false);
                }}
                role="option"
                aria-selected={currentTheme === t.id}
                title={t.name}
              >
                <div className="theme-swatch" style={{ background: t.bg }}>
                  <span className="theme-swatch-dot" style={{ background: t.accent }} />
                  <span className="theme-swatch-dot" style={{ background: t.text, opacity: 0.7 }} />
                </div>
                <span className="theme-swatch-name">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
