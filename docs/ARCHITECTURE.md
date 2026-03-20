# Architecture

## Tech Stack

- **Vite 6** — build tool, zero-config for Vercel
- **React 18** — UI library, functional components + hooks only
- **Inline styles** — no CSS files, no CSS-in-JS library, no Tailwind
- **Google Fonts** — Inter (body) + JetBrains Mono (code/labels)
- **No UI library** — all components hand-built for minimal bundle

## Design Decisions

### Why inline styles, no CSS?

The entire app is data-driven. Each card, label, and color is computed from data objects. Inline styles make this trivial — no class name mapping, no style extraction, no build-time CSS processing. The tradeoff (no pseudo-classes, no media queries in CSS) is handled by the `useWidth()` hook which switches layout at 640px.

### Why no router?

Nine pages, all lightweight. A tab-based SPA with `useState` keeps the mental model simple. No URL state to manage, no route transitions, no code splitting needed at ~88KB gzip. If the app grows past 15 pages, consider adding `react-router` with lazy loading.

### Why two-mode navigation (WHAT/WHY)?

The original design had 5 tabs in a flat list. Adding 4 more (Insights, Inversion, Guide, Predictions) would make 9 tabs — unnavigable on mobile. The two-mode split creates a mental frame: "WHAT helps you understand the current state, WHY helps you form opinions about what's next." Each mode has 4-5 sub-tabs, which fits mobile well.

### i18n approach

Every user-facing string is an `{en: "...", zh: "..."}` object. The `t(s, lang)` helper resolves it. Technical terms (MCP, ACP, A2A, JSON-RPC, etc.) are kept identical in both languages. This is intentional — these are proper nouns in the AI agent ecosystem.

The `lang` state lives in `App.jsx` and is passed as a prop to all views. No context/provider needed for this scale.

## File Responsibilities

### `src/shared.jsx` (~60 lines)

Exports consumed by all views:

- `C` — color palette object (13 colors + 6 glow variants)
- `mono`, `sans` — font family strings
- `useWidth()` — window width hook for responsive breakpoints
- `t(s, lang)` — i18n resolver
- `LangToggle` — EN/中文 pill toggle component
- `Tag` — small colored badge component

### `src/App.jsx` (~165 lines)

Top-level shell:

- Mode state (`what` / `why`) controls which tab set is visible
- Each mode has its own tab state, preserved when switching modes
- `viewMap` object maps tab IDs to view components — no if/else chain
- Responsive: on mobile, only the active tab label is shown, others show icon only

### View Components

Each view is self-contained: own data, own sub-components, own i18n strings. They receive only `{lang}` as props. No shared state between views.

| View | Lines | Key Pattern |
|------|-------|-------------|
| Landscape | 209 | Nested expandable cards in a 5-layer grid |
| Progression | 167 | Vertical card stack with connector arrows, staggered animation |
| Examples | 236 | Level selector + timeline with who/action/tools per step |
| DayInLife | 175 | Time-based vertical timeline with device/level tags |
| ToolEcosystem | 218 | Filterable grid grouped by type, protocol dots + level badges |
| Insights | 243 | Card list with "SO WHAT" expandable section |
| Inversion | 187 | Dual bar chart (time vs leverage) + level selector |
| Guide | 261 | 3-question form → computed recommendation card |
| Predictions | 338 | Dimension-filterable cards with confidence bars + horizon tags |

## Responsive Strategy

Single breakpoint: `640px`.

- `useWidth()` returns current `window.innerWidth`
- `const mobile = w < 640` — boolean used throughout
- Grid columns: typically `4` on desktop, `2` on mobile
- Font sizes: typically `11-13px` desktop, `9-11px` mobile
- Padding: typically `16-20px` desktop, `10-14px` mobile
- Tab labels: full text on desktop, icon-only (except active) on mobile

## Color System

```
Background:  #06080d (near-black)
Surface:     #0d1117 (card background)
Surface Alt: #131a24 (alternate sections)
Border:      #1b2433

Text:        #e1e7ef (primary)
Text Sub:    #8b95a5 (secondary)
Text Dim:    #525e70 (tertiary)

Accent colors (each has a matching "glow" at 10-12% opacity):
  Blue:   #4d8eff — UI protocols, L2 Collaborative
  Green:  #34d399 — Communication protocols, L4 Full-Auto
  Amber:  #fbbf24 — Harness, L3 Semi-Auto, WHY mode
  Purple: #a78bfa — Execution, L1 Assisted
  Cyan:   #22d3ee — Endpoints, L5 Orchestration
  Rose:   #fb7185 — Spectrum header accent
```

## Animation

Minimal, CSS-only:

- `@keyframes pulse` — breathing effect on "MAINSTREAM" / "FRONTIER" badges
- `@keyframes fadeUp` — used by Guide recommendation card
- Staggered `setTimeout` in Progression for card reveal on mount
- All transitions are 150-400ms ease

## Bundle Analysis

```
Total:  ~269KB raw / ~88KB gzip
React:  ~140KB raw (React 18 production)
App:    ~129KB raw (all 9 views + data)
```

No code splitting — all views are in a single chunk. At 88KB gzip this is under the "single meaningful paint" threshold. If growth continues past 150KB gzip, consider `React.lazy()` per view.
