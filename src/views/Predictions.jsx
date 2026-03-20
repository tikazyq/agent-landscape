import { useState } from "react";
import { C, mono, sans, useWidth, t } from "../shared";

const i18n = {
  horizon:{en:"PREDICTION HORIZON",zh:"预测时间线"},
  confidence:{en:"CONFIDENCE",zh:"确信度"},
  signal:{en:"EARLY SIGNALS",zh:"早期信号"},
  implication:{en:"SO WHAT",zh:"意味着什么"},
  filterDim:{en:"Filter by dimension",zh:"按维度筛选"},
  all:{en:"All",zh:"全部"},
  h_near:{en:"2026 H2",zh:"2026 下半年"},
  h_mid:{en:"2027",zh:"2027"},
  h_far:{en:"2028+",zh:"2028+"},
};

const dimensions = [
  {id:"tech",label:{en:"Technology",zh:"技术"},icon:"⚙️",color:C.blue},
  {id:"career",label:{en:"Career",zh:"职业"},icon:"👤",color:C.amber},
  {id:"org",label:{en:"Organization",zh:"组织"},icon:"🏢",color:C.green},
  {id:"product",label:{en:"Product",zh:"产品"},icon:"📦",color:C.purple},
  {id:"society",label:{en:"Society",zh:"社会"},icon:"🌍",color:C.cyan},
];

const predictions = [
  // ── Tech ──
  {
    dim:"tech", horizon:"near", confidence:90, color:C.blue,
    title:{en:"ACP becomes the LSP of AI coding",zh:"ACP 成为 AI 编码的 LSP"},
    body:{
      en:"By end of 2026, every major IDE and terminal agent will speak ACP. The 'which editor supports which agent' question disappears, just like 'which editor supports which language' disappeared after LSP.",
      zh:"到 2026 年底，每个主流 IDE 和终端 agent 都将支持 ACP。'哪个编辑器支持哪个 agent' 的问题消失，就像 LSP 之后 '哪个编辑器支持哪种语言' 的问题消失了一样。",
    },
    signals:{
      en:["JetBrains + Zed co-developed ACP","GitHub Copilot CLI added ACP in Jan 2026","Agent Registry launched with one-click install"],
      zh:["JetBrains + Zed 联合开发 ACP","GitHub Copilot CLI 在 2026.1 添加 ACP","Agent Registry 上线一键安装"],
    },
    implication:{
      en:"Agent builders should implement ACP now. Editor lock-in is ending — compete on agent quality, not distribution.",
      zh:"Agent 开发者现在就该实现 ACP。编辑器锁定正在结束——竞争 agent 质量，而非分发渠道。",
    },
  },
  {
    dim:"tech", horizon:"mid", confidence:70, color:C.blue,
    title:{en:"A2UI kills the 'build a mobile app' step",zh:"A2UI 消灭了 '开发移动端应用' 这一步"},
    body:{
      en:"Agent-generated UIs via A2UI render natively on any device. For many internal tools and developer utilities, nobody builds a separate mobile app anymore — the agent generates the right interface on the fly.",
      zh:"通过 A2UI 生成的 agent UI 在任何设备上原生渲染。对于大量内部工具和开发者工具，不再有人开发独立的移动端应用——agent 即时生成合适的界面。",
    },
    signals:{
      en:["Gemini Enterprise using A2UI internally","A2UI v1.0 targeting 2026","Flutter GenUI SDK already uses A2UI under the hood"],
      zh:["Gemini Enterprise 内部使用 A2UI","A2UI v1.0 计划 2026 发布","Flutter GenUI SDK 底层已使用 A2UI"],
    },
    implication:{
      en:"Frontend developers shift from 'building UIs' to 'building component catalogs that agents compose'. The skill becomes curation, not creation.",
      zh:"前端开发者从 '构建 UI' 转向 '构建 agent 可组合的组件目录'。技能从创作变为策展。",
    },
  },
  {
    dim:"tech", horizon:"far", confidence:45, color:C.blue,
    title:{en:"Terminals become agent-to-agent interfaces",zh:"终端变成 agent 对 agent 的接口"},
    body:{
      en:"At L5, the terminal is no longer a human-facing surface. It becomes the debug/inspection layer for agent meshes. Humans interact via natural language + phone approvals. The terminal is consumed by orchestrator agents, not developers.",
      zh:"在 L5，终端不再是面向人类的界面。它变成 agent mesh 的调试/检查层。人类通过自然语言 + 手机审批交互。终端被编排 agent 消费，而非开发者。",
    },
    signals:{
      en:["Claude Code headless mode adoption growing","Agent-to-agent communication via A2A","MCP Apps bundling UI with tools"],
      zh:["Claude Code headless 模式使用量增长","A2A agent 间通信","MCP Apps 将 UI 与工具打包"],
    },
    implication:{
      en:"TUI frameworks (Ratatui, Ink) may pivot from human-facing to agent-facing rendering. The 'UI' concept itself is being redefined.",
      zh:"TUI 框架 (Ratatui, Ink) 可能从面向人类转向面向 agent 的渲染。'UI' 概念本身正在被重新定义。",
    },
  },
  // ── Career ──
  {
    dim:"career", horizon:"near", confidence:85, color:C.amber,
    title:{en:"'Prompt engineering' dissolves into every role",zh:"'提示词工程' 融入所有角色"},
    body:{
      en:"There won't be a standalone 'prompt engineer' role. Instead, every developer becomes a prompt engineer by default. The skill is table stakes, like knowing Git. The real differentiator becomes system design: how you structure agent loops, governance rules, and skill architectures.",
      zh:"不会有独立的 '提示词工程师' 角色。每个开发者默认就是提示词工程师。这个技能是基本功，就像会用 Git 一样。真正的差异化在于系统设计: 如何构建 agent 循环、governance 规则、skill 架构。",
    },
    signals:{
      en:["Prompt engineering job posts declining on LinkedIn","'AI-assisted' becoming assumed in job descriptions","SDD (Specification-Driven Development) gaining traction"],
      zh:["LinkedIn 上提示词工程职位减少","'AI 辅助' 在职位描述中成为默认假设","SDD (规范驱动开发) 逐渐流行"],
    },
    implication:{
      en:"Stop learning 'prompt tricks'. Start learning agent system architecture: Harness design, Governance rules, multi-agent coordination patterns.",
      zh:"别再学 '提示词技巧' 了。开始学 agent 系统架构: Harness 设计、Governance 规则、多 agent 协调模式。",
    },
  },
  {
    dim:"career", horizon:"mid", confidence:70, color:C.amber,
    title:{en:"The 10x developer becomes the 100x architect",zh:"10x 开发者变成 100x 架构师"},
    body:{
      en:"At L3-L4, a single developer with good agent orchestration skills produces what used to require a small team. The bottleneck shifts from coding speed to judgment quality: which problems to solve, which constraints to set, when to intervene.",
      zh:"在 L3-L4，一个拥有良好 agent 编排技能的开发者能产出过去需要一个小团队才能完成的工作。瓶颈从编码速度转向判断质量: 解决哪些问题、设定什么约束、何时介入。",
    },
    signals:{
      en:["Solo developers shipping complex products (Pieter Levels pattern)","Team sizes shrinking at AI-native startups","'Agent-native' companies emerging (Tier 3 in Gartner framework)"],
      zh:["独立开发者交付复杂产品 (Pieter Levels 模式)","AI 原生创业公司团队规模缩小","'Agent 原生' 公司涌现 (Gartner 框架中的 Tier 3)"],
    },
    implication:{
      en:"Junior developer roles don't disappear — they transform. Entry-level becomes 'agent supervisor' not 'code writer'. Mentorship shifts to teaching judgment, not syntax.",
      zh:"初级开发者角色不会消失——会转型。入门级变成 'agent 监督者' 而非 '代码编写者'。指导从教语法转向教判断力。",
    },
  },
  {
    dim:"career", horizon:"far", confidence:50, color:C.amber,
    title:{en:"'Software engineer' splits into two distinct careers",zh:"'软件工程师' 分裂为两个不同职业"},
    body:{
      en:"One path: System Architects who design agent orchestration, governance rules, and high-level goals (L4-L5). Other path: Agent Craft specialists who build and tune individual agent capabilities, skills, and tools (L2-L3). The generalist 'full-stack developer' erodes.",
      zh:"一条路: 系统架构师，设计 agent 编排、governance 规则和高层目标 (L4-L5)。另一条路: Agent 工匠，构建和调优单个 agent 能力、skill 和工具 (L2-L3)。通才型 '全栈开发者' 逐渐消失。",
    },
    signals:{
      en:["'AI infrastructure engineer' job titles emerging","Separate skill trees for agent design vs. agent operation","Governance-as-a-service startups appearing"],
      zh:["'AI 基础设施工程师' 职位出现","agent 设计 vs. agent 运维的技能树分化","Governance-as-a-service 创业公司出现"],
    },
    implication:{
      en:"Choose your path now. If you love systems thinking: go architecture. If you love craft: go deep on individual agent capabilities.",
      zh:"现在就选择你的路径。如果你喜欢系统思维: 走架构路线。如果你喜欢工匠精神: 深耕单个 agent 能力。",
    },
  },
  // ── Organization ──
  {
    dim:"org", horizon:"near", confidence:80, color:C.green,
    title:{en:"Team structure follows automation level",zh:"团队结构跟随自动化级别"},
    body:{
      en:"Organizations running L2-L3 still need traditional dev teams. Those pushing L4+ start restructuring: fewer developers, more 'agent operators' who set boundaries and review outputs. DevOps becomes AgentOps.",
      zh:"运行 L2-L3 的组织仍然需要传统开发团队。推进到 L4+ 的组织开始重组: 更少的开发者，更多的 'agent 运维者' 负责设定边界和审查产出。DevOps 变成 AgentOps。",
    },
    signals:{
      en:["Gartner: 40% enterprise apps embed agents by end of 2026","McKinsey: high-performers 3x more likely to scale agents","Agent washing: only ~130 of thousands of claimed vendors are genuinely agentic"],
      zh:["Gartner: 到 2026 年底 40% 企业应用嵌入 agent","McKinsey: 高绩效组织规模化 agent 的可能性高 3 倍","Agent 洗白: 数千家声称的供应商中仅约 130 家是真正 agentic 的"],
    },
    implication:{
      en:"Don't reorganize for L5 today. Match team structure to your actual automation level. Most teams should be optimizing for L3 right now.",
      zh:"不要为 L5 重组团队。让团队结构匹配实际自动化级别。大多数团队现在应该优化 L3。",
    },
  },
  {
    dim:"org", horizon:"mid", confidence:60, color:C.green,
    title:{en:"'Agent budget' becomes a line item like cloud spend",zh:"'Agent 预算' 变成像云支出一样的预算科目"},
    body:{
      en:"Token costs for autonomous agents become a significant operational expense. Organizations develop agent economics: cost-per-fix, cost-per-feature, ROI models. FinOps for AI agents emerges as a discipline.",
      zh:"自主 agent 的 token 成本成为重要的运营支出。组织开发 agent 经济学: 每次修复成本、每个功能成本、ROI 模型。AI agent 的 FinOps 作为一个学科出现。",
    },
    signals:{
      en:["Three-tier model routing (Haiku→Sonnet→Opus) already optimizing costs","Agent cost optimization becoming 'first-class architectural concern'","Token budget as Governance parameter in Harness design"],
      zh:["三级模型路由 (Haiku→Sonnet→Opus) 已在优化成本","Agent 成本优化成为 '一等公民架构关注点'","Token 预算作为 Harness 设计中的 Governance 参数"],
    },
    implication:{
      en:"CFOs will care about agent spend. Engineering leaders need to justify autonomous agent costs the way they justify cloud infrastructure today.",
      zh:"CFO 会关心 agent 支出。工程负责人需要像今天论证云基础设施一样论证自主 agent 的成本。",
    },
  },
  // ── Product ──
  {
    dim:"product", horizon:"near", confidence:75, color:C.purple,
    title:{en:"AI-native IDEs lose their moat",zh:"AI 原生 IDE 失去护城河"},
    body:{
      en:"Cursor and Windsurf's advantage was 'AI built in'. With ACP, any editor gets any agent. JetBrains users don't need to switch. The competitive axis shifts from 'best AI integration' to 'best editing experience' — which incumbents already own.",
      zh:"Cursor 和 Windsurf 的优势是 'AI 内置'。有了 ACP，任何编辑器都能接入任何 agent。JetBrains 用户不需要切换。竞争轴从 '最佳 AI 集成' 转向 '最佳编辑体验'——而传统玩家已经拥有这一点。",
    },
    signals:{
      en:["ACP Agent Registry launched Jan 2026","JetBrains community noting Cursor-like features now available natively","'ACP makes the editor choice irrelevant' — community sentiment"],
      zh:["ACP Agent Registry 2026.1 上线","JetBrains 社区注意到类 Cursor 功能已原生可用","'ACP 让编辑器选择变得无关紧要' — 社区情绪"],
    },
    implication:{
      en:"If you're building an AI coding product: compete on agent intelligence and Governance, not on editor chrome. The editor is becoming a commodity.",
      zh:"如果你在做 AI 编码产品: 在 agent 智能和 Governance 上竞争，而不是编辑器外壳。编辑器正在变成商品。",
    },
  },
  {
    dim:"product", horizon:"mid", confidence:55, color:C.purple,
    title:{en:"Agent marketplaces emerge (like app stores)",zh:"Agent 市场出现 (类似应用商店)"},
    body:{
      en:"A2A + ACP + MCP create a composable ecosystem. Specialized agents (security auditor, performance optimizer, migration specialist) become purchasable units. Oracle Agent Spec enables 'define once, run anywhere' agent distribution.",
      zh:"A2A + ACP + MCP 创建了可组合的生态系统。专业 agent (安全审计、性能优化、迁移专家) 变成可购买的单元。Oracle Agent Spec 实现 '一次定义，到处运行' 的 agent 分发。",
    },
    signals:{
      en:["ACP Agent Registry as marketplace prototype","Oracle + Google + CopilotKit joint release of Reusable Agents","AP2 (Agent Payment Protocol) launched by Google"],
      zh:["ACP Agent Registry 作为市场原型","Oracle + Google + CopilotKit 联合发布 Reusable Agents","Google 发布 AP2 (Agent Payment Protocol)"],
    },
    implication:{
      en:"The API economy gave us SaaS. The agent economy gives us AaaS (Agent-as-a-Service). Build specialized agents, not general platforms.",
      zh:"API 经济给了我们 SaaS。Agent 经济给我们 AaaS (Agent-as-a-Service)。构建专业 agent，而非通用平台。",
    },
  },
  // ── Society ──
  {
    dim:"society", horizon:"mid", confidence:65, color:C.cyan,
    title:{en:"Coding becomes like driving — universal but not a profession",zh:"编程变得像开车——普及但不再是专业"},
    body:{
      en:"L1-L2 tools make basic software creation accessible to anyone who can describe what they want. 'Coding' as a specialized skill follows the path of literacy: once rare and valuable, now assumed. The profession doesn't vanish — but it transforms into systems engineering.",
      zh:"L1-L2 工具让任何能描述需求的人都能进行基本的软件创作。'编程' 作为专业技能走上了识字的路径: 曾经稀有且有价值，现在变成基本假设。职业不会消失——但会转型为系统工程。",
    },
    signals:{
      en:["No-code/low-code platforms integrating AI agents","Non-technical founders shipping MVPs with Claude/ChatGPT","'Vibe coding' culture emerging in indie hacker community"],
      zh:["无代码/低代码平台集成 AI agent","非技术创始人用 Claude/ChatGPT 交付 MVP","独立开发者社区出现 'Vibe coding' 文化"],
    },
    implication:{
      en:"The supply of software increases dramatically. Competitive advantage shifts from 'can you build it' to 'should you build it' — product judgment, not technical execution.",
      zh:"软件供给大幅增加。竞争优势从 '你能不能做' 转向 '你该不该做'——产品判断力，而非技术执行力。",
    },
  },
  {
    dim:"society", horizon:"far", confidence:40, color:C.cyan,
    title:{en:"The 'always-on agent' reshapes work-life boundary",zh:"'永不停止的 agent' 重塑工作生活边界"},
    body:{
      en:"When agents work 24/7 and send phone notifications for approvals, the boundary between 'working' and 'not working' blurs further. The developer's Day-in-Life story (our demo) shows work seeping into commute, coffee break, bedtime. Agent async patterns need deliberate off-switch design.",
      zh:"当 agent 24/7 工作并发送手机通知请求审批时，'工作' 和 '非工作' 的边界进一步模糊。开发者日常故事（我们的演示）展示了工作渗透到通勤、咖啡时间、睡前。Agent 异步模式需要刻意设计关闭开关。",
    },
    signals:{
      en:["Claude Code Remote Control enabling 'code from bed' pattern","ntfy-based push notifications for agent completion","Pocket Agent marketing 'your laptop in your pocket'"],
      zh:["Claude Code Remote Control 实现 '床上写代码' 模式","基于 ntfy 的 agent 完成推送通知","Pocket Agent 营销 '口袋里的笔记本电脑'"],
    },
    implication:{
      en:"Governance isn't just about agent safety — it's about human wellbeing. Design 'do not disturb' rules into your Harness. Your Governance layer should protect you from your agents, not just your codebase.",
      zh:"Governance 不只是关于 agent 安全——也是关于人类福祉。在你的 Harness 中设计 '请勿打扰' 规则。你的 Governance 层应该保护你免受 agent 打扰，而不仅仅是保护代码库。",
    },
  },
];

const horizonMap = {near:i18n.h_near, mid:i18n.h_mid, far:i18n.h_far};
const horizonOrder = {near:0, mid:1, far:2};

function ConfidenceBar({pct, color, mobile}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:mobile?60:80,height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.4s ease"}}/>
      </div>
      <span style={{fontSize:mobile?8:9,fontFamily:mono,color}}>{pct}%</span>
    </div>
  );
}

function PredictionCard({p, expanded, onToggle, lang, mobile}) {
  const dim = dimensions.find(d=>d.id===p.dim);
  return (
    <div onClick={onToggle} style={{
      background:expanded?`linear-gradient(135deg,${p.color}08,${C.surface})`:C.surface,
      border:`1px solid ${expanded?p.color+"44":C.border}`,
      borderRadius:10, padding:mobile?"13px 14px":"16px 20px",
      cursor:"pointer", transition:"all 0.15s ease",
      borderLeft:`3px solid ${p.color}`,
    }}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
        <span style={{fontSize:mobile?8:9,fontFamily:mono,fontWeight:600,color:dim?.color,background:dim?.color+"18",padding:"2px 6px",borderRadius:3,border:`1px solid ${dim?.color}22`}}>
          {dim?.icon} {t(dim?.label,lang)}
        </span>
        <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim}}>{t(horizonMap[p.horizon],lang)}</span>
        <div style={{marginLeft:"auto"}}><ConfidenceBar pct={p.confidence} color={p.color} mobile={mobile}/></div>
      </div>

      <div style={{fontFamily:mono,fontSize:mobile?12:15,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:6}}>
        {t(p.title,lang)}
      </div>

      <div style={{fontSize:mobile?10.5:12,color:C.textSub,lineHeight:1.65}}>
        {t(p.body,lang)}
      </div>

      {expanded && (
        <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${p.color}22`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?10:16}}>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:p.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              {t(i18n.signal,lang)}
            </div>
            {t(p.signals,lang).map((s,i)=>(
              <div key={i} style={{fontSize:mobile?10:10.5,color:C.textSub,lineHeight:1.6,paddingLeft:10,position:"relative"}}>
                <span style={{position:"absolute",left:0,color:p.color+"88",fontSize:8,top:3}}>▸</span>{s}
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:p.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              {t(i18n.implication,lang)}
            </div>
            <div style={{
              background:p.color+"12",border:`1px solid ${p.color}22`,
              borderRadius:6,padding:mobile?"8px 10px":"10px 14px",
              fontSize:mobile?10.5:11.5,color:C.text,lineHeight:1.6,fontStyle:"italic",
            }}>
              {t(p.implication,lang)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Predictions({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(new Set());
  const toggle = k => setExpanded(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});

  const filtered = filter === "all" ? predictions : predictions.filter(p=>p.dim===filter);
  const sorted = [...filtered].sort((a,b)=>horizonOrder[a.horizon]-horizonOrder[b.horizon]);

  return (
    <div style={{maxWidth:760,margin:"0 auto"}}>
      {/* Dimension filter */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:mobile?4:6,marginBottom:mobile?14:20,flexWrap:"wrap"}}>
        <button onClick={()=>setFilter("all")} style={{
          background:filter==="all"?C.textSub+"22":"transparent",
          color:filter==="all"?C.text:C.textDim,
          border:`1px solid ${filter==="all"?C.textSub+"44":C.border}`,
          borderRadius:12,padding:mobile?"4px 10px":"5px 14px",cursor:"pointer",
          fontFamily:mono,fontSize:mobile?9:10,fontWeight:filter==="all"?700:400,
        }}>{t(i18n.all,lang)}</button>
        {dimensions.map(d=>(
          <button key={d.id} onClick={()=>setFilter(d.id)} style={{
            background:filter===d.id?d.color+"22":"transparent",
            color:filter===d.id?d.color:C.textDim,
            border:`1px solid ${filter===d.id?d.color+"44":C.border}`,
            borderRadius:12,padding:mobile?"4px 10px":"5px 14px",cursor:"pointer",
            fontFamily:mono,fontSize:mobile?9:10,fontWeight:filter===d.id?700:400,
            display:"flex",alignItems:"center",gap:4,
          }}>
            <span style={{fontSize:mobile?11:13}}>{d.icon}</span>
            {t(d.label,lang)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:mobile?8:10}}>
        {sorted.map((p,i)=>(
          <PredictionCard key={i} p={p} expanded={expanded.has(i)} onToggle={()=>toggle(i)} lang={lang} mobile={mobile}/>
        ))}
      </div>
    </div>
  );
}
