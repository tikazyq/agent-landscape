# Protocol Reference

Quick reference for the six protocols featured in this SPA. All information reflects the state as of March 2026.

## MCP — Model Context Protocol

| | |
|---|---|
| **Owner** | Anthropic |
| **Role** | Agent ↔ Tool/Data access |
| **Analogy** | USB-C for AI |
| **Transport** | JSON-RPC |
| **License** | Open source |
| **Status** | MCP 1.0 shipped early 2026 |

**What it does**: Standardizes how AI agents connect to external tools, databases, and APIs. An MCP server exposes capabilities (tools, resources, prompts); an MCP client (the agent) consumes them.

**Key adoption**: Claude Code, Cursor, Windsurf, VS Code, JetBrains — virtually every major AI coding tool supports MCP.

**MCP Apps**: A newer extension that bundles tool functionality with UI, allowing distribution of interactive agent capabilities.

**References**:
- https://modelcontextprotocol.io
- Anthropic documentation

---

## ACP — Agent Client Protocol

| | |
|---|---|
| **Owner** | JetBrains + Zed Industries |
| **Role** | Editor/IDE ↔ AI coding agent |
| **Analogy** | LSP (Language Server Protocol) for AI Agents |
| **Transport** | JSON-RPC over stdio (local) / HTTP + WebSocket (remote) |
| **License** | Open standard |
| **Status** | Public beta, Agent Registry launched Jan 28, 2026 |

**What it does**: Standardizes communication between code editors and AI coding agents. Any agent implementing ACP works in any ACP-compatible editor — no custom integration needed.

**Key adoption**: GitHub Copilot CLI (`copilot --acp`), Claude Code, Gemini CLI, Codex CLI, OpenCode, goose. JetBrains and Zed have native support.

**Important disambiguation**: This is NOT the same as IBM's "Agent Communication Protocol" (also abbreviated ACP). IBM's protocol has merged into A2A under the Linux Foundation. In this project, "ACP" always refers to Agent Client Protocol.

**References**:
- https://agentclientprotocol.com
- https://www.jetbrains.com/acp/
- JetBrains AI Blog: "ACP Agent Registry Is Live" (Jan 2026)
- GitHub Changelog: "ACP support in Copilot CLI" (Jan 28, 2026)

---

## A2A — Agent-to-Agent Protocol

| | |
|---|---|
| **Owner** | Google (initiated), Linux Foundation (governance) |
| **Role** | Agent ↔ Agent communication |
| **Analogy** | gRPC for Agents |
| **Transport** | HTTP-based, peer-to-peer |
| **License** | Open source, Linux Foundation |
| **Status** | Active development, merged with IBM's ACP (Communication) |

**What it does**: Enables AI agents to discover each other, negotiate capabilities, delegate tasks, and collaborate across organizational boundaries. Uses AgentCard metadata for capability advertisement.

**Key distinction from ACP**: A2A connects agents to agents. ACP connects editors to agents. They operate at different layers and are complementary.

**Merger note**: IBM's Agent Communication Protocol (a REST-based agent-to-agent protocol) merged into A2A in September 2025. The ACP team joined forces with A2A under Linux Foundation governance. BeeAI remains as reference implementation.

**References**:
- https://google.github.io/A2A/
- Google Developers Blog: "Announcing the Agent2Agent Protocol"
- Linux Foundation announcement
- IBM Research: ACP → A2A migration documentation

---

## A2UI — Agent to UI

| | |
|---|---|
| **Owner** | Google |
| **Role** | Declarative UI description format |
| **Analogy** | Protobuf for UI |
| **Transport** | JSON (flat adjacency list model) |
| **License** | Apache 2.0 |
| **Status** | v0.9 public preview, v1.0 on roadmap for 2026 |

**What it does**: Allows AI agents to describe rich, interactive user interfaces as structured JSON. Client applications render these descriptions using their native UI frameworks — the same A2UI response renders on React (web), Flutter (mobile), SwiftUI (iOS), Jetpack Compose (Android).

**Security model**: Declarative data, not executable code. Agents can only request components from a pre-approved catalog. No HTML/JS injection risk.

**Key adoption**: Gemini Enterprise (internal), Flutter GenUI SDK (uses A2UI under the hood), OpenClaw, Google ADK Python v1.24.0+.

**Relationship to AG-UI**: A2UI describes *what* to render. AG-UI handles *how* to synchronize state and events between agent and frontend. They are complementary layers, often used together.

**References**:
- https://a2ui.org
- https://github.com/google/A2UI
- Google Developers Blog: "Introducing A2UI" (Dec 2025)

---

## AG-UI — Agent-User Interaction Protocol

| | |
|---|---|
| **Owner** | CopilotKit |
| **Role** | Agent ↔ Frontend runtime communication |
| **Analogy** | WebSocket for Agents |
| **Transport** | Event-based, transport-agnostic (SSE, WebSocket, HTTP) |
| **License** | Open source |
| **Status** | Active, adopted by Google, LangChain, AWS, Microsoft |

**What it does**: Provides a bidirectional event stream between an agentic backend and a user-facing frontend application. Handles state synchronization, tool call events, human-in-the-loop workflows, and streaming updates.

**Not a UI spec**: AG-UI doesn't describe what UI to show (that's A2UI's job). It defines how agent state, UI intents, and user interactions flow in real time.

**Event types**: Lifecycle events (RUN_STARTED, RUN_FINISHED), text message events, state management events (STATE_SNAPSHOT, STATE_DELTA), tool call events.

**Generative UI support**: AG-UI sits below A2UI, Open-JSON-UI, and MCP Apps, enabling all three Generative UI patterns (Static, Declarative, Open-ended) through a single runtime layer.

**References**:
- https://docs.ag-ui.com
- https://github.com/ag-ui-protocol/ag-ui
- https://www.copilotkit.ai/ag-ui
- Microsoft Learn: AG-UI Integration with Agent Framework

---

## AP2 — Agent Payment Protocol

| | |
|---|---|
| **Owner** | Google |
| **Role** | Agent payment authorization |
| **Analogy** | Stripe for Agents |
| **Transport** | Credential-based |
| **License** | Open |
| **Status** | Early stage |

**What it does**: Provides a secure way for agents to complete financial transactions without full account access. Users sign limited digital contracts (mandates) defining exactly how much an agent is allowed to spend.

**Credential types**:
- **Cart Mandates (Active Presence)**: Used when the user is present during the transaction
- **Restricted credentials**: For unattended/autonomous agent transactions with spending limits

**Use case**: "Agentic Commerce" — agents discovering products, comparing prices, and completing purchases on behalf of users, all within pre-authorized budget boundaries.

**References**:
- getstream.io: "Top AI Agent Protocols in 2026"
- Google A2A ecosystem documentation

---

## Protocol Stack Summary

```
┌─────────────────────────────────────────────┐
│              Human Endpoints                 │
│    Mobile · Terminal · IDE · Headless        │
├─────────────────────────────────────────────┤
│         Agent ↔ Human Protocol               │
│    ACP (editor↔agent)                        │
│    A2UI (UI description) + AG-UI (runtime)   │
├─────────────────────────────────────────────┤
│            Agent Harness                     │
│    Governance · Runtime · Capability ·       │
│    Coordination                              │
├─────────────────────────────────────────────┤
│       Agent ↔ Agent/Tool Protocol            │
│    A2A (agent mesh) · MCP (tool access)      │
│    Oracle Agent Spec · AP2 (payment)         │
├─────────────────────────────────────────────┤
│          Execution Substrate                 │
│    Cloud · Local · Hybrid · LLM              │
└─────────────────────────────────────────────┘
```

Each layer communicates bidirectionally with its neighbors. The Harness layer is the control pivot — it decides what flows up (to humans) and what flows down (to execution).
