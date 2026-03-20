import { useState } from "react";
import { C, mono, sans, useWidth, t } from "../shared";

const insights = [
  {
    id: "tui",
    icon: "⌨️",
    color: C.amber,
    title: { en: "TUI revival isn't nostalgia", zh: "TUI 复兴不是怀旧" },
    claim: {
      en: "AI output is natively a text stream. The terminal is the most efficient text stream renderer ever built. TUI frameworks (Ratatui, Ink, Bubbletea) just lowered the barrier.",
      zh: "AI 的输出天然是文本流。终端是有史以来最高效的文本流渲染器。TUI 框架 (Ratatui, Ink, Bubbletea) 只是降低了门槛。",
    },
    counter: {
      en: "It's not that developers suddenly love terminals again — it's that AI made terminals the optimal interface again.",
      zh: "不是开发者突然又爱上终端了——是 AI 让终端重新成为了最优界面。",
    },
  },
  {
    id: "mui",
    icon: "📱",
    color: C.cyan,
    title: { en: "MUI won't happen (and doesn't need to)", zh: "MUI 不会出现（也不需要）" },
    claim: {
      en: "There won't be a 'Mobile UI standard for agents' like TUI has ANSI/VT100. Instead, A2UI already makes mobile a native render target. The same JSON renders on Flutter, SwiftUI, and React.",
      zh: "不会出现类似 TUI 的 ANSI/VT100 那样的 'agent 移动端 UI 标准'。A2UI 已经让移动端成为原生渲染目标。同一份 JSON 在 Flutter、SwiftUI、React 上渲染。",
    },
    counter: {
      en: "The question isn't 'will MUI standardize' — it's already being absorbed into cross-platform protocols.",
      zh: "问题不是 'MUI 会不会标准化'——它已经被跨平台协议吸收了。",
    },
  },
  {
    id: "phone",
    icon: "🔔",
    color: C.green,
    title: { en: "Your phone is an approval surface, not a coding tool", zh: "手机是审批面，不是编程工具" },
    claim: {
      en: "The bottleneck on mobile isn't input (AI handles that) — it's output. Code review requires visual bandwidth that 6-inch screens can't provide. Phones are optimal for: approve/reject, intent dispatch, notification monitoring.",
      zh: "移动端的瓶颈不在输入（AI 解决了）——在输出。代码审查需要的视觉带宽是 6 寸屏幕提供不了的。手机最适合: 审批、意图下达、通知监控。",
    },
    counter: {
      en: "Stop trying to replicate desktop on mobile. Design for what mobile is uniquely good at.",
      zh: "别再想着在手机上复刻桌面体验了。围绕手机独有的优势来设计。",
    },
  },
  {
    id: "projection",
    icon: "🪞",
    color: C.blue,
    title: { en: "Four endpoints are projections, not alternatives", zh: "四种终端是投影，不是替代" },
    claim: {
      en: "Mobile, Terminal, IDE, and Headless are not competing interaction modes. They're different projections of the same agent system. One task can start on phone, execute in cloud, be reviewed in IDE.",
      zh: "Mobile、Terminal、IDE、Headless 不是互相竞争的交互模式。它们是同一个 agent 系统的不同投影面。一个任务可以手机发起、云端执行、IDE 审查。",
    },
    counter: {
      en: "Think 'multi-screen cinema' not 'which screen is best'.",
      zh: "应该想 '多屏影院'，而不是 '哪个屏幕最好'。",
    },
  },
  {
    id: "leverage",
    icon: "⚖️",
    color: C.amber,
    title: { en: "Less time, more leverage", zh: "时间更短，杠杆更大" },
    claim: {
      en: "From L0 to L5, human time investment drops from 100% to 2%. But the impact per human decision increases exponentially. At L0 you write one line affecting one line. At L5 you define one goal affecting an entire agent mesh's output.",
      zh: "从 L0 到 L5，人类时间投入从 100% 降到 2%。但每个人类决策的影响力指数级增长。L0 你写一行代码影响一行。L5 你定义一个目标影响整个 agent mesh 的产出。",
    },
    counter: {
      en: "Automation isn't replacing humans — it's amplifying the weight of each human decision.",
      zh: "自动化不是在替代人类——而是在放大每个人类决策的权重。",
    },
  },
  {
    id: "harness",
    icon: "🛡️",
    color: C.purple,
    title: { en: "Governance is the real product", zh: "Governance 才是真正的产品" },
    claim: {
      en: "Everyone focuses on what AI can do. The harder problem is what AI should be allowed to do. Governance (evaluate → Allow|Deny|Modify) becomes more critical as autonomy increases — at L4/L5, it's the only thing between agents and production.",
      zh: "大家都关注 AI 能做什么。更难的问题是 AI 该被允许做什么。Governance (evaluate → Allow|Deny|Modify) 随自动化程度提高变得越来越关键——在 L4/L5，它是 agent 和生产环境之间唯一的防线。",
    },
    counter: {
      en: "The most valuable AI infrastructure in 2027 won't be the smartest model — it'll be the best guardrails.",
      zh: "2027 年最有价值的 AI 基础设施不会是最聪明的模型——而是最好的护栏。",
    },
  },
  {
    id: "protocol",
    icon: "🔌",
    color: C.green,
    title: { en: "Protocols > Products", zh: "协议 > 产品" },
    claim: {
      en: "The real winner of the AI coding tool war won't be a specific product. It'll be the protocol layer: MCP (tool access), ACP (editor integration), A2A (agent mesh). Products come and go; protocols compound.",
      zh: "AI 编码工具大战的真正赢家不会是某个具体产品。而是协议层: MCP (工具接入)、ACP (编辑器集成)、A2A (agent 网格)。产品来来去去，协议会复利增长。",
    },
    counter: {
      en: "Just like HTTP outlived Netscape, these protocols will outlive today's AI tools.",
      zh: "就像 HTTP 比 Netscape 活得久，这些协议会比今天的 AI 工具活得更久。",
    },
  },
  {
    id: "async",
    icon: "🌙",
    color: C.cyan,
    title: { en: "The future of coding is async", zh: "编程的未来是异步的" },
    claim: {
      en: "At L4+, the dominant pattern is: set intent → agent works overnight → review results in the morning. Development becomes an async loop, not a synchronous session. The 'coding session' as we know it is dissolving.",
      zh: "在 L4+，主导模式是: 设定意图 → agent 夜间工作 → 早上审查结果。开发变成异步循环，不再是同步会话。我们认知的 '编程会话' 正在消解。",
    },
    counter: {
      en: "You'll spend more time thinking about what to build than actually building it. That's the point.",
      zh: "你会花更多时间思考构建什么，而不是实际构建。这才是重点。",
    },
  },
];

function InsightCard({ item, expanded, onToggle, lang, mobile }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded
          ? `linear-gradient(135deg, ${item.color}10, ${C.surface})`
          : C.surface,
        border: `1px solid ${expanded ? item.color + "44" : C.border}`,
        borderRadius: 10,
        padding: mobile ? "14px" : "18px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderLeft: `3px solid ${item.color}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: mobile ? 10 : 14 }}>
        <span style={{ fontSize: mobile ? 22 : 28, lineHeight: 1 }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: mobile ? 13 : 16,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            {t(item.title, lang)}
          </div>
          <div
            style={{
              fontSize: mobile ? 11 : 12.5,
              color: C.textSub,
              lineHeight: 1.7,
              fontFamily: sans,
            }}
          >
            {t(item.claim, lang)}
          </div>
          {expanded && (
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${item.color}22`,
              }}
            >
              <div
                style={{
                  background: item.color + "12",
                  border: `1px solid ${item.color}22`,
                  borderRadius: 8,
                  padding: mobile ? "10px 12px" : "12px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: mobile ? 8 : 9,
                    fontFamily: mono,
                    color: item.color,
                    fontWeight: 700,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {lang === "en" ? "SO WHAT" : "所以呢"}
                </div>
                <div
                  style={{
                    fontSize: mobile ? 11.5 : 13,
                    color: C.text,
                    lineHeight: 1.6,
                    fontWeight: 500,
                    fontFamily: sans,
                    fontStyle: "italic",
                  }}
                >
                  "{t(item.counter, lang)}"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Insights({ lang }) {
  const w = useWidth();
  const mobile = w < 640;
  const [expanded, setExpanded] = useState(new Set(["tui"]));
  const toggle = (k) =>
    setExpanded((p) => {
      const n = new Set(p);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: mobile ? 8 : 10,
        }}
      >
        {insights.map((item) => (
          <InsightCard
            key={item.id}
            item={item}
            expanded={expanded.has(item.id)}
            onToggle={() => toggle(item.id)}
            lang={lang}
            mobile={mobile}
          />
        ))}
      </div>
    </div>
  );
}
