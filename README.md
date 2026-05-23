<div align="center">

# ⌨️ TypeTester

**A minimalist, MonkeyType-style typing speed test — built with Next.js, TypeScript & Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Banisher2005/typetester)

</div>

---

## 📸 Preview

| Dark Mode | Results Screen |
|-----------|---------------|
| ![Dark Mode](https://placehold.co/480x260/1a1a1a/f0c040?text=TypeTester+Dark) | ![Results](https://placehold.co/480x260/242424/4caf50?text=Results+%E2%80%94+WPM+%2B+Graph) |

> **No login. No sign-up. No account.** Open the app and start typing.

---

## ✨ Features

- **Two test modes**
  - ⏱ **Time** — 15 / 30 / 60 / 120 second countdown
  - 📝 **Words** — 10 / 25 / 50 / 100 fixed word count
- **Real-time character highlighting** — correct chars turn green, incorrect turn red, blinking cursor on the current position
- **3-line word window** that smoothly scrolls as you advance through words
- **Live stats bar** — WPM, accuracy %, and timer/words-remaining update every 250 ms
- **Results screen** with:
  - Large WPM display
  - Raw WPM, accuracy, correct/incorrect keystrokes, time taken
  - SVG WPM-over-time line chart (zero dependencies)
- **Keyboard shortcuts** — `Tab + Enter` to restart, `Esc` to refocus
- **Light / Dark theme** toggle, saved to `localStorage`
- **Monospace font** — Roboto Mono via Google Fonts
- Fully **static** — no server, no database, no auth

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm (comes with Node)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Banisher2005/typertester.git
cd typetester

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deploy to Vercel

The fastest way:

1. Click the **Deploy** button at the top of this README, **or**
2. Do it manually:

```bash
# Push to GitHub (already done ✓)
# Then go to https://vercel.com/new and import your repository
# Vercel auto-detects Next.js — click Deploy, done.
```

No `vercel.json` needed. No environment variables. It just works.

---

## 🗂️ Project Structure

```
typetester/
├── app/
│   ├── layout.tsx          # Root layout — Roboto Mono font, meta tags
│   ├── page.tsx            # Entry page — renders <TypingTest />
│   └── globals.css         # CSS custom properties, component styles, animations
│
├── components/
│   ├── TypingTest.tsx      # Main state machine (idle → running → finished)
│   ├── WordDisplay.tsx     # 3-line windowed word renderer with char highlighting
│   ├── StatsBar.tsx        # Live WPM / accuracy / countdown bar
│   ├── ResultsScreen.tsx   # Post-test summary + SVG WPM graph
│   └── ModeSelector.tsx    # Time / Words mode tabs + sub-option buttons
│
├── lib/
│   ├── words.ts            # 300-word pool + Fisher-Yates shuffle
│   └── stats.ts            # WPM, raw WPM, accuracy calculations
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧮 How Stats Are Calculated

| Metric | Formula |
|--------|---------|
| **WPM** | `(correctChars / 5) / (elapsedSeconds / 60)` |
| **Raw WPM** | `(totalChars / 5) / (elapsedSeconds / 60)` |
| **Accuracy** | `(correctChars / totalChars) × 100` |

The WPM graph records one data point per second tick and renders as an SVG `<polyline>` — no charting library required.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` + `Enter` | Restart the current test |
| `Esc` | Focus the typing area |
| `Space` | Advance to the next word |
| `Backspace` | Delete within the current word |

> Backspace will **not** go back to a previous word.

---

## 🎨 Design Tokens

| Token | Dark | Light |
|-------|------|-------|
| Background | `#1a1a1a` | `#f5f5f5` |
| Text | `#e2e2e2` | `#1a1a1a` |
| Correct | `#4caf50` | `#2e7d32` |
| Incorrect | `#f44336` | `#c62828` |
| Cursor / Accent | `#f0c040` | `#d97706` |

Theme preference is saved in `localStorage` under the key `typetester-theme`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + vanilla CSS vars |
| State | React hooks only (`useState`, `useRef`, `useCallback`, `useEffect`) |
| Font | [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) via `next/font/google` |
| Charts | Plain SVG `<polyline>` — zero dependencies |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📄 License

[MIT](LICENSE) © 2025 [Banisher2005](https://github.com/Banisher2005)
