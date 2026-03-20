# AI Agent Interaction Landscape

> 多平台 AI Agent 交互全景 — 协议栈、自动化递进、工具生态与趋势预测

A bilingual (EN/中文) interactive SPA that maps the 2026 AI agent ecosystem: protocols, automation levels, tools, workflows, and predictions across technology, career, organization, product, and society dimensions.

## Live Demo

Deploy to Vercel → zero config, instant preview.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

## Deploy to Vercel

**Option A: GitHub → Vercel**

1. Push this directory to a GitHub repo
2. Import in Vercel, Framework Preset = **Vite**
3. Done. Auto-detects `npm run build`, output `dist/`

**Option B: CLI**

```bash
npx vercel
```

## Structure

```
src/
├── main.jsx            # React mount point
├── shared.jsx          # Theme, colors, fonts, i18n helpers, shared components
├── App.jsx             # Two-mode navigation (WHAT/WHY) + language toggle
└── views/
    ├── Landscape.jsx   # 🗺️ Five-layer protocol stack panorama
    ├── Progression.jsx # 📈 L0→L5 automation progression
    ├── Examples.jsx    # 🎯 Same bug at six automation levels
    ├── DayInLife.jsx   # 🌅 Developer's day across devices
    ├── ToolEcosystem.jsx # 🧰 Tools mapped to protocols and levels
    ├── Insights.jsx    # 🔮 Sharp observations (8 insight cards)
    ├── Inversion.jsx   # ⚖️ Time vs leverage paradox
    ├── Guide.jsx       # 🧭 Interactive setup recommendation
    └── Predictions.jsx # 🔭 12 predictions across 5 dimensions
```

## Navigation

```
[EN/中文]  [📊 WHAT · 现状]  [💡 WHY · 观点]

📊 WHAT ── what's happening now
  🗺️ Landscape    Five-layer protocol stack
  📈 Progression   L0→L5 automation stages
  🎯 Examples      Same task, six levels compared
  🌅 Day in Life   One developer's actual day
  🧰 Tools         17 tools mapped to protocols

💡 WHY ── why it matters, what's next
  🔮 Insights      8 core observations
  ⚖️ Inversion     Time↓ Leverage↑ paradox
  🧭 Guide         3 questions → setup recommendation
  🔭 Predictions   12 predictions across 5 dimensions
```

## Key Concepts

### L0→L5 Automation Spectrum

| Level | Name | Human Role | Key Shift |
|-------|------|------------|-----------|
| L0 | Manual | Write everything | Memory-driven |
| L1 | Assisted | Ask AI, copy-paste | Generate answers |
| L2 | Collaborative | Review inline suggestions | Review & revise |
| **L3** | **Semi-Auto** | **Describe intent, approve** | **Describe intent** |
| L4 | Full-Auto | Set boundaries | Set boundaries |
| L5 | Orchestration | Define goals | Define goals |

**Current position**: L2 (mainstream) → L3 (frontier)

### Protocol Stack

| Protocol | Owner | Role | Analogy |
|----------|-------|------|---------|
| MCP | Anthropic | Agent ↔ Tool/Data | USB-C for AI |
| ACP | JetBrains + Zed | Editor ↔ Agent | LSP for AI Agents |
| A2A | Google · Linux Foundation | Agent ↔ Agent | gRPC for Agents |
| A2UI | Google | UI description format | Protobuf for UI |
| AG-UI | CopilotKit | Agent ↔ Frontend runtime | WebSocket for Agents |
| AP2 | Google | Agent payment authorization | Stripe for Agents |

## Features

- **Bilingual**: Full EN/中文 toggle, all content translated
- **Mobile-optimized**: Responsive grid (2-col on mobile, 4-col on desktop)
- **Interactive**: Expandable cards, level selectors, dimension filters
- **Zero dependencies**: Only React 18 + Vite, no UI library
- **~88KB gzip**: All 9 pages in a single bundle

## Background

This SPA emerged from a deep conversation analyzing:

1. Whether TUI's revival (driven by Claude Code, Gemini CLI, etc.) could lead to a "MUI" (Mobile UI) standard
2. How A2UI, AG-UI, ACP, A2A, and MCP protocols form a layered stack
3. The progression from manual coding (L0) to autonomous agent orchestration (L5)
4. What this means for developers, organizations, and the industry

See [docs/CONTENT.md](docs/CONTENT.md) for content sources and editorial decisions.
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical design.
See [docs/PROTOCOLS.md](docs/PROTOCOLS.md) for protocol reference.

## License

MIT
