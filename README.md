<div align="center">

# ⌨️ TypeTester

**A minimalist, MonkeyType-style typing speed test — built with Next.js, TypeScript & Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

> **No login. No sign-up. No account.** Open the app and start typing immediately.

---

## ✨ Features

### Test Modes
| Mode | Options |
|------|---------|
| ⏱ **Time** | 15s / 30s / 60s / 120s countdown |
| 📝 **Words** | 10 / 25 / 50 / 100 fixed word count |

### Difficulty & Word Options
- 🟢 **Easy** / 🟡 **Medium** / 🔴 **Hard** — controls word complexity
- **Punctuation** toggle — adds commas, periods, apostrophes
- **Numbers** toggle — mixes in numeric values

### Typing Experience
- Real-time **character highlighting** — correct = green, incorrect = red, blinking cursor on current position
- **3-line word window** — only 3 rows visible at a time, scrolls smoothly as you type
- **Focus mode** — UI fades away while you're typing so nothing distracts you
- **CapsLock warning** — floating pill appears if CapsLock is on
- **Sound effects** — subtle audio feedback on correct / incorrect keypresses (toggle in header)
- Input focus is **auto-recovered** — can never get stuck unfocused during a test

### Stats & Results
- **Live stats bar** — WPM, accuracy %, countdown / words remaining (updates every 250ms)
- **Results screen** showing:
  - Large WPM display
  - Raw WPM, accuracy %, correct / incorrect keystrokes, time taken
  - 🏆 **New personal best badge** with glow animation
  - SVG WPM-over-time line chart (no library — pure `<polyline>`)
- **Best scores** saved per mode + option to `localStorage`

### Customisation
- **10 colour themes** — Dark, Light, Serika, Botanical, Carbon, Mocha, Ocean, Rosé, Lavender, Cream
- Quick **dark ↔ light toggle** in header
- All preferences (theme, sound) saved to `localStorage`
- **Monospace font** — Roboto Mono via Google Fonts

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Tab` + `Enter` | Restart the test |
| `Esc` | Re-focus the typing area |
| `Space` | Advance to next word |
| `Backspace` | Delete within current word only |

> Backspace will **not** go back to a previous word.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- npm (comes with Node)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Banisher2005/typetester.git
cd typetester

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deploy to Vercel

1. Click the **Deploy** button at the top of this README, **or**
2. Push to GitHub → go to [vercel.com/new](https://vercel.com/new) → import the repo → click **Deploy**

No `vercel.json`. No environment variables. Vercel auto-detects Next.js and it just works.

---

## 🗂️ Project Structure

```
typetester/
├── app/
│   ├── layout.tsx            # Root layout — Roboto Mono font, page metadata
│   ├── page.tsx              # Entry page — renders <TypingTest />
│   └── globals.css           # CSS custom properties, 10 themes, all component styles
│
├── components/
│   ├── TypingTest.tsx        # Main state machine (idle → running → finished)
│   ├── WordDisplay.tsx       # 3-line windowed word renderer with char highlighting
│   ├── StatsBar.tsx          # Live WPM / accuracy / countdown bar
│   ├── ResultsScreen.tsx     # Post-test summary + SVG WPM graph + best score badge
│   ├── ModeSelector.tsx      # Time/Words/Difficulty/Punctuation/Numbers controls
│   ├── ThemePicker.tsx       # Colour theme dropdown with swatch grid
│   └── CapsLockWarning.tsx   # Floating CapsLock pill indicator
│
├── lib/
│   ├── words.ts              # Word pool + Fisher-Yates shuffle + difficulty/punct/nums filters
│   ├── stats.ts              # calcWPM(), calcRawWPM(), calcAccuracy()
│   ├── bestScores.ts         # localStorage best score read/write helpers
│   └── sounds.ts             # SoundManager — Web Audio API click sounds
│
├── next.config.ts
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

The WPM graph samples one data point per second and renders as a pure SVG `<polyline>` — no charting library needed.

---

## 🎨 Themes

| Theme | Style |
|-------|-------|
| **Dark** | Classic dark — `#1a1a1a` background, amber accent |
| **Light** | Clean white — `#f5f5f5` background |
| **Serika** | MonkeyType's signature dark + yellow |
| **Carbon** | GitHub dark palette, blue accent |
| **Mocha** | Catppuccin Mocha — deep purple, pink accent |
| **Ocean** | Deep navy, cyan accent |
| **Botanical** | Dark forest green |
| **Rosé** | Deep purple-black, pink accent |
| **Lavender** | Dark + lavender-blue accent |
| **Cream** | Rosé Pine Dawn — warm cream, dusty rose |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + CSS custom properties |
| State | React hooks only (`useState`, `useRef`, `useCallback`, `useEffect`) |
| Audio | Web Audio API — no library |
| Font | [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) via `next/font/google` |
| Charts | Plain SVG `<polyline>` — zero dependencies |
| Storage | `localStorage` — theme, sound, best scores |
| Deployment | [Vercel](https://vercel.com/) — zero config |

---

## 📄 License

[MIT](LICENSE) © 2025 [Banisher2005](https://github.com/Banisher2005)
