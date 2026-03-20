# Content Guide

## Origin

This SPA emerged from a conversation that started with a simple question:

> TUI 的兴起是因为 Claude Code 等 CLI AI Coding 工具的风靡。随着 AI 的便携化，MUI（Mobile UI）模式是否会像 TUI 这样快速发展并形成标准呢？

The discussion evolved through protocol research, architecture design, workflow analysis, and trend prediction. All content in this SPA is derived from that conversation and the web research conducted within it.

## Page-by-Page Content

### 📊 WHAT Mode

#### 🗺️ Landscape — Five-Layer Protocol Stack

**What it shows**: The complete architecture of how AI agents interact with humans, other agents, tools, and execution environments in 2026.

**Five layers** (top to bottom):
1. **Human Endpoints** — Four ways humans connect: Mobile (async approval), Terminal (full dev), IDE/Desktop (rich review), Headless (unattended)
2. **Agent↔Human Protocol** — ACP (editor↔agent), A2UI (declarative UI), AG-UI (event-driven runtime), Generative UI (three patterns)
3. **Agent Harness** — Control plane: Governance (allow/deny/modify), Runtime (agent loop), Capability (tool/skill/agent hierarchy), Coordination (Factory/Fractal/GenAdv orchestration)
4. **Agent↔Agent/Tool Protocol** — A2A (inter-agent), MCP (tool access), Oracle Agent Spec (definition standard), AP2 (payment)
5. **Execution Substrate** — Cloud containers, local machine, hybrid/edge, LLM inference

**Key insight**: These five layers are not a waterfall — data flows bidirectionally. The Harness layer is the pivot: it decides when to auto-proceed and when to hand off to humans.

**"WE ARE HERE" marker**: Positioned at L2-L3 boundary (45% on the spectrum bar). L2 labeled "MAINSTREAM", L3 labeled "FRONTIER".

#### 📈 Progression — L0→L5 Automation Stages

**What it shows**: Six levels of AI-assisted development, from fully manual to autonomous multi-agent orchestration.

**Design choice**: Each level card shows a human/AI percentage bar, making the time investment shift visceral. L3 is default-expanded as the current frontier.

**Three evolution patterns** (bottom summary):
- Human role: write code → review → describe intent → set boundaries → define goals
- Harness weight: none → Capability → +Governance → +Runtime → +Coordination
- Protocol stack: MCP → +ACP → +AG-UI/A2UI → +A2A → full mesh

#### 🎯 Examples — Same Bug, Six Levels

**What it shows**: The exact same task (fix a JWT authentication bug) at each automation level, step by step.

**Design choice**: Using the same task across all levels makes the transformation concrete. Readers can see exactly which steps disappear, which new ones appear, and who does what.

**Key data points**:
- L0: 6 human steps, ~4 hours
- L3: 2 human steps + 4 agent steps, ~25 minutes
- L4: 0 human steps (agent detects and fixes), ~8 minutes
- L5: Same bug triggers a full auth system migration, multi-agent mesh, ~6 hours agent time

**Each step tagged with**: executor (👤Human / 🤖Agent / ⚙️System), action description, tools/protocols used.

#### 🌅 Day in Life — Developer's Actual Day

**What it shows**: Seven time blocks from 07:30 to 22:00, showing how one developer uses four devices and three automation levels throughout a single day.

**Narrative arc**: Morning commute (phone, L4 overnight review) → coffee (phone, L3 dispatch) → deep work (IDE, L2 pair programming) → lunch (phone, L3 result approval) → afternoon (IDE, L2 code review) → evening (terminal, L4 overnight setup) → bedtime (phone, L4 status check).

**Summary stats**: ~3.5h human time vs ~11h agent time, 3 devices, L2/L3/L4 all used in one day.

**Key insight**: The same developer fluidly shifts between automation levels depending on the task. L2 for design-heavy new features, L3 for well-defined fixes, L4 for maintenance and overnight work.

#### 🧰 Tools — Ecosystem Map

**What it shows**: 17 tools/products organized by type (CLI Agent, IDE, Mobile, Framework, Platform), each annotated with supported protocols and applicable automation levels.

**Filterable by level**: Click L3 to see only tools that work at semi-autonomous level.

**Tools included**: Claude Code, Gemini CLI, Codex CLI, Aider, OpenCode, Cursor, Windsurf, JetBrains AI, Zed, GitHub Copilot, Claude Code RC, Pocket Agent, Moshi, CopilotKit, Google ADK, LangGraph, BeeAI.

### 💡 WHY Mode

#### 🔮 Insights — Core Observations

**8 insight cards**, each with a sharp claim and a "SO WHAT" punchline:

1. **TUI revival isn't nostalgia** — AI output is text stream, terminal is the optimal renderer
2. **MUI won't happen** — A2UI already makes mobile a render target
3. **Phone is an approval surface** — Output bandwidth is the bottleneck, not input
4. **Four endpoints are projections** — Not alternatives, same system different angles
5. **Less time, more leverage** — Human time drops, decision impact increases
6. **Governance is the real product** — What AI should be *allowed* to do matters more
7. **Protocols > Products** — MCP/ACP/A2A will outlive today's tools
8. **Future of coding is async** — Set intent → agent works overnight → review in morning

#### ⚖️ Inversion — Time vs Leverage Paradox

**Interactive visualization**: Select L0-L5, see dual bar chart of human time investment (decreasing) vs impact per decision (increasing).

**The Automation Paradox**: "As human time approaches zero, the value of each remaining human moment approaches infinity."

**Per-level details**: What human does + what human decides. At L0 you decide everything. At L5 you decide direction.

#### 🧭 Guide — Setup Recommendation

**Interactive 3-question form**:
1. Role: Solo dev / Team dev / Tech lead / Eng manager
2. Work type: Greenfield / Maintenance / Large refactoring / Code review
3. Risk tolerance: Cautious / Balanced / Aggressive

**Outputs**: Recommended level (L2-L5), primary device, tools, protocols, workflow description, "what to try next" advice.

**L5 trigger**: Tech lead or manager + aggressive risk tolerance, or large refactoring + aggressive.

#### 🔭 Predictions — Five Dimensions

**12 predictions across 5 dimensions**, each with confidence percentage, time horizon, early signals, and implications:

**Technology (3)**: ACP as LSP (90%), A2UI kills mobile app step (70%), terminals become agent-to-agent interfaces (45%)

**Career (3)**: Prompt engineering dissolves (85%), 10x dev becomes 100x architect (70%), software engineer splits into two careers (50%)

**Organization (2)**: Team structure follows automation level (80%), agent budget becomes line item (60%)

**Product (2)**: AI-native IDEs lose moat (75%), agent marketplaces emerge (55%)

**Society (2)**: Coding becomes like driving (65%), always-on agents reshape work-life boundary (40%)

**Filterable by dimension**. Sorted by time horizon (near → far).

## Data Sources

All protocol information was researched via web search during the conversation. Key sources:

- **A2UI**: Google Developers Blog (Dec 2025), github.com/google/A2UI, a2ui.org
- **ACP (Agent Client Protocol)**: JetBrains AI Blog (Jan 2026), agentclientprotocol.com, GitHub Copilot Changelog
- **AG-UI**: CopilotKit docs, ag-ui.com, GitHub ag-ui-protocol/ag-ui
- **A2A**: Google announcement, Linux Foundation, IBM ACP→A2A merger documentation
- **MCP**: Anthropic documentation, modelcontextprotocol.io
- **AP2**: getstream.io AI agent protocols survey
- **Mobile agent tools**: Claude Code Remote Control (subagentic.ai), Pocket Agent, Moshi, Sealos blog
- **Industry analysis**: Gartner 2025 predictions, McKinsey agentic AI report, MachineLearningMastery.com

## Editorial Decisions

1. **ACP disambiguation**: "ACP" in this SPA always means **Agent Client Protocol** (JetBrains + Zed), not IBM's Agent Communication Protocol. IBM's ACP has merged into A2A and is noted as such in the A2A card.

2. **ANP excluded**: Agent Network Protocol was evaluated and excluded — too China-telecom-centric with limited global adoption. Its DID identity concepts may surface as A2A extensions.

3. **L0-L5 framework**: This is an original framework from our conversation, not an industry standard. Inspired by autonomous driving levels (SAE L0-L5) but applied to AI-assisted development. Confidence percentages in Predictions are subjective estimates.

4. **"WE ARE HERE" positioning**: L2 mainstream / L3 frontier reflects March 2026 state. Most developers use Copilot inline (L2). Early adopters use Claude Code agentic mode (L3). L4/L5 are experimental.

5. **Tool selection**: The 17 tools in ToolEcosystem are not exhaustive. They were selected based on: protocol support (ACP/MCP/A2A), community adoption, and relevance to the L0-L5 framework.
