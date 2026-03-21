import { useState } from "react";
import { C, mono, sans, useWidth, t } from "../shared";

const i18n = {
  intro:{
    en:"Tracking 12 predictions from March 2026. Status updated as events unfold — see which calls were right, wrong, or still in play.",
    zh:"追踪 2026 年 3 月的 12 项预测。随事件发展更新状态——看看哪些判断对了、错了、或仍在进行中。",
  },
  filterLabel:{en:"Filter by status",zh:"按状态筛选"},
  all:{en:"All",zh:"全部"},
  status_pending:{en:"Pending",zh:"待验证"},
  status_partial:{en:"Partially Verified",zh:"部分验证"},
  status_verified:{en:"Verified",zh:"已验证"},
  status_revised:{en:"Revised",zh:"已修正"},
  evidence:{en:"EVIDENCE & EVENTS",zh:"证据 & 事件"},
  original:{en:"ORIGINAL PREDICTION",zh:"原始预测"},
  updated:{en:"UPDATED CONFIDENCE",zh:"更新后确信度"},
  timeline:{en:"TIMELINE",zh:"时间线"},
  scorecard:{en:"SCORECARD",zh:"记分卡"},
};

const statusConfig = {
  pending:{label:i18n.status_pending,color:C.textDim,icon:"⏳"},
  partial:{label:i18n.status_partial,color:C.amber,icon:"🔶"},
  verified:{label:i18n.status_verified,color:C.green,icon:"✅"},
  revised:{label:i18n.status_revised,color:C.purple,icon:"🔄"},
};

const trackedPredictions = [
  {
    id:"acp-lsp",
    dim:{en:"Technology",zh:"技术"},dimColor:C.blue,dimIcon:"⚙️",
    title:{en:"ACP becomes the LSP of AI coding",zh:"ACP 成为 AI 编码的 LSP"},
    originalConf:90, currentConf:90, horizon:{en:"2026 H2",zh:"2026 下半年"},
    status:"partial",
    originalBody:{
      en:"By end of 2026, every major IDE and terminal agent will speak ACP.",
      zh:"到 2026 年底，每个主流 IDE 和终端 agent 都将支持 ACP。",
    },
    events:[
      {date:"2026-01",text:{en:"ACP Agent Registry launched with one-click install",zh:"ACP Agent Registry 上线一键安装"}},
      {date:"2026-02",text:{en:"VS Code extension marketplace adds ACP category",zh:"VS Code 扩展市场添加 ACP 分类"}},
      {date:"2026-03",text:{en:"JetBrains 2026.1 ships native ACP support",zh:"JetBrains 2026.1 内置 ACP 支持"}},
    ],
    commentary:{
      en:"On track. Major IDEs adopting faster than expected. The remaining question is whether CLI agents (Claude Code, Codex CLI) will adopt ACP or stick with proprietary protocols.",
      zh:"按预期推进。主流 IDE 采纳速度快于预期。剩余问题是 CLI agent（Claude Code、Codex CLI）是否会采纳 ACP 还是坚持自有协议。",
    },
  },
  {
    id:"a2ui-mobile",
    dim:{en:"Technology",zh:"技术"},dimColor:C.blue,dimIcon:"⚙️",
    title:{en:"A2UI kills the 'build a mobile app' step",zh:"A2UI 消灭了 '开发移动端应用' 这一步"},
    originalConf:70, currentConf:65, horizon:{en:"2027",zh:"2027"},
    status:"pending",
    originalBody:{
      en:"Agent-generated UIs via A2UI render natively on any device.",
      zh:"通过 A2UI 生成的 agent UI 在任何设备上原生渲染。",
    },
    events:[
      {date:"2026-01",text:{en:"A2UI v0.9 public preview released",zh:"A2UI v0.9 公开预览版发布"}},
      {date:"2026-03",text:{en:"Flutter GenUI SDK in beta with A2UI support",zh:"Flutter GenUI SDK beta 版支持 A2UI"}},
    ],
    commentary:{
      en:"Slightly downgraded. A2UI adoption is slower than expected for external apps — internal tools are adopting faster. The 'kill mobile app dev' prediction may take until 2028 for consumer-facing apps.",
      zh:"略有下调。A2UI 在外部应用的采纳慢于预期——内部工具采纳更快。'消灭移动端开发' 的预测对消费者应用可能要到 2028 年。",
    },
  },
  {
    id:"terminal-a2a",
    dim:{en:"Technology",zh:"技术"},dimColor:C.blue,dimIcon:"⚙️",
    title:{en:"Terminals become agent-to-agent interfaces",zh:"终端变成 agent 对 agent 的接口"},
    originalConf:45, currentConf:50, horizon:{en:"2028+",zh:"2028+"},
    status:"partial",
    originalBody:{
      en:"At L5, the terminal becomes the debug/inspection layer for agent meshes, consumed by orchestrator agents.",
      zh:"在 L5，终端变成 agent mesh 的调试/检查层，被编排 agent 消费。",
    },
    events:[
      {date:"2026-02",text:{en:"Claude Code headless API usage grows 4x",zh:"Claude Code headless API 使用量增长 4 倍"}},
      {date:"2026-03",text:{en:"GitHub Actions adds 'agent step' type for multi-agent CI",zh:"GitHub Actions 添加 '多 agent CI' 步骤类型"}},
    ],
    commentary:{
      en:"Upgraded slightly. Headless agent adoption is growing faster than expected. But human-facing terminal use is also growing — it's additive, not replacement.",
      zh:"略有上调。无头 agent 采纳增长快于预期。但面向人类的终端使用也在增长——是叠加关系，不是替代关系。",
    },
  },
  {
    id:"prompt-eng-dissolve",
    dim:{en:"Career",zh:"职业"},dimColor:C.amber,dimIcon:"👤",
    title:{en:"'Prompt engineering' dissolves into every role",zh:"'提示词工程' 融入所有角色"},
    originalConf:85, currentConf:90, horizon:{en:"2026 H2",zh:"2026 下半年"},
    status:"verified",
    originalBody:{
      en:"There won't be a standalone 'prompt engineer' role. Every developer becomes one by default.",
      zh:"不会有独立的 '提示词工程师' 角色。每个开发者默认就是提示词工程师。",
    },
    events:[
      {date:"2026-01",text:{en:"LinkedIn: 'prompt engineer' postings down 60% YoY",zh:"LinkedIn: '提示词工程师' 职位同比下降 60%"}},
      {date:"2026-02",text:{en:"'AI-assisted development' becomes assumed in 73% of job descriptions",zh:"73% 的职位描述将 'AI 辅助开发' 视为默认"}},
      {date:"2026-03",text:{en:"Google SRE adds 'agent orchestration' to standard interview loop",zh:"Google SRE 在标准面试流程中添加 'agent 编排'"}},
    ],
    commentary:{
      en:"Verified. The role dissolved faster than expected. 'Prompt engineering' is now like 'knowing how to Google' — a basic skill, not a job title.",
      zh:"已验证。角色消解速度快于预期。'提示词工程' 现在就像 '会用 Google 搜索'——基本技能，不是职位头衔。",
    },
  },
  {
    id:"10x-100x",
    dim:{en:"Career",zh:"职业"},dimColor:C.amber,dimIcon:"👤",
    title:{en:"The 10x developer becomes the 100x architect",zh:"10x 开发者变成 100x 架构师"},
    originalConf:70, currentConf:72, horizon:{en:"2027",zh:"2027"},
    status:"partial",
    originalBody:{
      en:"A single developer with good agent orchestration skills produces what used to require a small team.",
      zh:"一个拥有良好 agent 编排技能的开发者能产出过去需要一个小团队才能完成的工作。",
    },
    events:[
      {date:"2026-01",text:{en:"Multiple solo founders ship products that previously needed 5-person teams",zh:"多个独立创始人交付了之前需要 5 人团队的产品"}},
      {date:"2026-03",text:{en:"Y Combinator W26 batch: 40% are solo technical founders using agents",zh:"Y Combinator W26 批次: 40% 是使用 agent 的独立技术创始人"}},
    ],
    commentary:{
      en:"On track. The pattern is clear at startups, but enterprise adoption of the '100x architect' model is slower due to organizational inertia.",
      zh:"按预期推进。在创业公司中模式很清晰，但企业采纳 '100x 架构师' 模型因组织惯性而较慢。",
    },
  },
  {
    id:"career-split",
    dim:{en:"Career",zh:"职业"},dimColor:C.amber,dimIcon:"👤",
    title:{en:"'Software engineer' splits into two distinct careers",zh:"'软件工程师' 分裂为两个不同职业"},
    originalConf:50, currentConf:48, horizon:{en:"2028+",zh:"2028+"},
    status:"pending",
    originalBody:{
      en:"One path: System Architects (L4-L5). Other path: Agent Craft specialists (L2-L3).",
      zh:"一条路: 系统架构师 (L4-L5)。另一条路: Agent 工匠 (L2-L3)。",
    },
    events:[
      {date:"2026-02",text:{en:"First 'Agent Operations Engineer' job titles appear on LinkedIn",zh:"LinkedIn 上出现首批 'Agent 运维工程师' 职位"}},
    ],
    commentary:{
      en:"Too early to call. Early signals exist but the split is not yet visible in mainstream hiring. May take until 2028+ as predicted.",
      zh:"还太早下判断。早期信号存在但分裂在主流招聘中尚不明显。可能如预测的要到 2028+ 年。",
    },
  },
  {
    id:"team-follows-level",
    dim:{en:"Organization",zh:"组织"},dimColor:C.green,dimIcon:"🏢",
    title:{en:"Team structure follows automation level",zh:"团队结构跟随自动化级别"},
    originalConf:80, currentConf:82, horizon:{en:"2026 H2",zh:"2026 下半年"},
    status:"partial",
    originalBody:{
      en:"Organizations pushing L4+ start restructuring: fewer developers, more 'agent operators'.",
      zh:"推进到 L4+ 的组织开始重组: 更少的开发者，更多的 'agent 运维者'。",
    },
    events:[
      {date:"2026-01",text:{en:"Shopify announces 'AI-first' engineering reorg",zh:"Shopify 宣布 'AI 优先' 工程重组"}},
      {date:"2026-02",text:{en:"Klarna reduces engineering headcount while increasing output, cites AI agents",zh:"Klarna 减少工程人数同时增加产出，称归功于 AI agent"}},
      {date:"2026-03",text:{en:"McKinsey publishes 'AgentOps' framework for enterprise",zh:"McKinsey 发布企业 'AgentOps' 框架"}},
    ],
    commentary:{
      en:"Strong signals. Multiple public examples now. The pattern is clearer at tech-forward companies. Traditional enterprises are 6-12 months behind.",
      zh:"信号强烈。现在有多个公开案例。模式在科技前沿公司更清晰。传统企业落后 6-12 个月。",
    },
  },
  {
    id:"agent-budget",
    dim:{en:"Organization",zh:"组织"},dimColor:C.green,dimIcon:"🏢",
    title:{en:"'Agent budget' becomes a line item like cloud spend",zh:"'Agent 预算' 变成像云支出一样的预算科目"},
    originalConf:60, currentConf:65, horizon:{en:"2027",zh:"2027"},
    status:"partial",
    originalBody:{
      en:"Token costs for autonomous agents become a significant operational expense.",
      zh:"自主 agent 的 token 成本成为重要的运营支出。",
    },
    events:[
      {date:"2026-02",text:{en:"Anthropic launches usage dashboards with per-agent cost breakdown",zh:"Anthropic 推出含每个 agent 成本明细的使用仪表板"}},
      {date:"2026-03",text:{en:"First 'AI FinOps' tools appear (tracking agent token spend by team)",zh:"首批 'AI FinOps' 工具出现（按团队追踪 agent token 支出）"}},
    ],
    commentary:{
      en:"Upgraded. The tooling for agent cost tracking is arriving faster than expected. But most organizations are still in 'experimentation' phase without formal budgets.",
      zh:"上调。agent 成本追踪工具出现速度快于预期。但大多数组织仍在 '实验' 阶段，没有正式预算。",
    },
  },
  {
    id:"ide-moat",
    dim:{en:"Product",zh:"产品"},dimColor:C.purple,dimIcon:"📦",
    title:{en:"AI-native IDEs lose their moat",zh:"AI 原生 IDE 失去护城河"},
    originalConf:75, currentConf:78, horizon:{en:"2026 H2",zh:"2026 下半年"},
    status:"partial",
    originalBody:{
      en:"With ACP, any editor gets any agent. The competitive axis shifts from 'best AI integration' to 'best editing experience'.",
      zh:"有了 ACP，任何编辑器都能接入任何 agent。竞争轴从 '最佳 AI 集成' 转向 '最佳编辑体验'。",
    },
    events:[
      {date:"2026-01",text:{en:"JetBrains ACP support brings Cursor-like features to IntelliJ",zh:"JetBrains ACP 支持将类 Cursor 功能带到 IntelliJ"}},
      {date:"2026-02",text:{en:"Zed + ACP gains traction as lightweight alternative",zh:"Zed + ACP 作为轻量级替代方案获得关注"}},
      {date:"2026-03",text:{en:"Cursor announces deeper differentiation beyond ACP (custom models, UX)",zh:"Cursor 宣布超越 ACP 的更深差异化（自定义模型、UX）"}},
    ],
    commentary:{
      en:"Mostly on track, but AI-native IDEs are fighting back by differentiating on UX and custom model access. The moat is shrinking but not gone.",
      zh:"基本按预期推进，但 AI 原生 IDE 正通过差异化 UX 和自定义模型访问来反击。护城河在缩小但没有消失。",
    },
  },
  {
    id:"agent-marketplace",
    dim:{en:"Product",zh:"产品"},dimColor:C.purple,dimIcon:"📦",
    title:{en:"Agent marketplaces emerge (like app stores)",zh:"Agent 市场出现 (类似应用商店)"},
    originalConf:55, currentConf:58, horizon:{en:"2027",zh:"2027"},
    status:"pending",
    originalBody:{
      en:"Specialized agents become purchasable units. ACP Agent Registry + A2A + AP2 enable agent commerce.",
      zh:"专业 agent 变成可购买的单元。ACP Agent Registry + A2A + AP2 推动 agent 商业化。",
    },
    events:[
      {date:"2026-01",text:{en:"ACP Agent Registry reaches 200+ registered agents",zh:"ACP Agent Registry 注册 agent 达 200+"}},
      {date:"2026-03",text:{en:"AP2 (Agent Payment Protocol) enters public preview",zh:"AP2 (Agent Payment Protocol) 进入公开预览"}},
    ],
    commentary:{
      en:"Early infrastructure building. The registry exists but monetization models are still forming. True marketplace dynamics expected 2027.",
      zh:"早期基础设施建设中。注册中心存在但变现模式仍在形成。真正的市场动态预计 2027 年出现。",
    },
  },
  {
    id:"coding-like-driving",
    dim:{en:"Society",zh:"社会"},dimColor:C.cyan,dimIcon:"🌍",
    title:{en:"Coding becomes like driving — universal but not a profession",zh:"编程变得像开车——普及但不再是专业"},
    originalConf:65, currentConf:62, horizon:{en:"2027",zh:"2027"},
    status:"pending",
    originalBody:{
      en:"L1-L2 tools make basic software creation accessible to anyone who can describe what they want.",
      zh:"L1-L2 工具让任何能描述需求的人都能进行基本的软件创作。",
    },
    events:[
      {date:"2026-02",text:{en:"'Vibe coding' trend continues — non-devs shipping MVPs weekly",zh:"'Vibe coding' 趋势持续——非开发者每周交付 MVP"}},
      {date:"2026-03",text:{en:"Schools begin teaching 'AI-assisted development' instead of 'programming'",zh:"学校开始教 'AI 辅助开发' 而非 '编程'"}},
    ],
    commentary:{
      en:"Signals are there but 'coding = driving' is still aspirational. Non-technical builders are growing but still face significant barriers for complex applications.",
      zh:"信号存在但 '编程 = 开车' 仍是愿景。非技术构建者在增长但在复杂应用上仍面临显著障碍。",
    },
  },
  {
    id:"always-on-agents",
    dim:{en:"Society",zh:"社会"},dimColor:C.cyan,dimIcon:"🌍",
    title:{en:"Always-on agents reshape work-life boundary",zh:"'永不停止的 agent' 重塑工作生活边界"},
    originalConf:40, currentConf:45, horizon:{en:"2028+",zh:"2028+"},
    status:"partial",
    originalBody:{
      en:"When agents work 24/7 and send phone notifications, the boundary between 'working' and 'not working' blurs.",
      zh:"当 agent 24/7 工作并发送手机通知时，'工作' 和 '非工作' 的边界进一步模糊。",
    },
    events:[
      {date:"2026-02",text:{en:"'Agent DND mode' feature requests become top GitHub issue across tools",zh:"'Agent 请勿打扰模式' 功能请求成为各工具 GitHub 上的热门 issue"}},
      {date:"2026-03",text:{en:"First burnout reports explicitly mentioning 'agent notification fatigue'",zh:"首批明确提及 'agent 通知疲劳' 的职业倦怠报告"}},
    ],
    commentary:{
      en:"Upgraded. The work-life boundary erosion is happening faster than expected, driven by always-on notification patterns. The backlash is also starting earlier.",
      zh:"上调。工作生活边界的侵蚀速度快于预期，由永不停止的通知模式驱动。反弹也开始得更早。",
    },
  },
];

function ConfBar({original, current, color, mobile}) {
  const delta = current - original;
  const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
  const deltaColor = delta > 0 ? C.green : delta < 0 ? C.rose : C.textDim;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:mobile?60:80,height:5,background:C.border,borderRadius:3,overflow:"hidden",position:"relative"}}>
        <div style={{width:`${original}%`,height:"100%",background:color+"44",borderRadius:3,position:"absolute"}}/>
        <div style={{width:`${current}%`,height:"100%",background:color,borderRadius:3,position:"absolute",transition:"width 0.4s ease"}}/>
      </div>
      <span style={{fontSize:mobile?8:9,fontFamily:mono,color}}>{current}%</span>
      <span style={{fontSize:mobile?8:9,fontFamily:mono,color:deltaColor}}>{arrow}{Math.abs(delta)}</span>
    </div>
  );
}

function TrackerCard({p, expanded, onToggle, lang, mobile}) {
  const st = statusConfig[p.status];
  return (
    <div onClick={onToggle} style={{
      background:expanded?`linear-gradient(135deg,${p.dimColor}08,${C.surface})`:C.surface,
      border:`1px solid ${expanded?p.dimColor+"44":C.border}`,
      borderRadius:10,padding:mobile?"13px 14px":"16px 20px",
      cursor:"pointer",transition:"all 0.15s ease",
      borderLeft:`3px solid ${st.color}`,
    }}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
        <span style={{fontSize:mobile?8:9,fontFamily:mono,fontWeight:600,color:p.dimColor,background:p.dimColor+"18",padding:"2px 6px",borderRadius:3,border:`1px solid ${p.dimColor}22`}}>
          {p.dimIcon} {t(p.dim,lang)}
        </span>
        <span style={{fontSize:mobile?8:9,fontFamily:mono,fontWeight:600,color:st.color,background:st.color+"18",padding:"2px 6px",borderRadius:3,border:`1px solid ${st.color}22`}}>
          {st.icon} {t(st.label,lang)}
        </span>
        <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim}}>{t(p.horizon,lang)}</span>
        <div style={{marginLeft:"auto"}}>
          <ConfBar original={p.originalConf} current={p.currentConf} color={p.dimColor} mobile={mobile}/>
        </div>
      </div>

      {/* Title */}
      <div style={{fontFamily:mono,fontSize:mobile?12:15,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:4}}>
        {t(p.title,lang)}
      </div>

      {/* Original prediction summary */}
      <div style={{fontSize:mobile?10:11,color:C.textDim,lineHeight:1.5,fontStyle:"italic"}}>
        {t(p.originalBody,lang)}
      </div>

      {expanded && (
        <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${p.dimColor}22`}}>
          {/* Events timeline */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:p.dimColor,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              {t(i18n.evidence,lang)}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {p.events.map((ev,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{
                    fontSize:mobile?8:9,fontFamily:mono,color:p.dimColor,
                    background:p.dimColor+"12",padding:"2px 6px",borderRadius:3,
                    whiteSpace:"nowrap",flexShrink:0,
                  }}>{ev.date}</span>
                  <span style={{fontSize:mobile?10:11,color:C.textSub,lineHeight:1.5}}>
                    {t(ev.text,lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Commentary */}
          <div style={{
            background:st.color+"12",border:`1px solid ${st.color}22`,
            borderRadius:8,padding:mobile?"10px 12px":"12px 16px",
          }}>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:st.color,fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>
              {st.icon} {t(st.label,lang)}
            </div>
            <div style={{fontSize:mobile?10.5:12,color:C.text,lineHeight:1.65}}>
              {t(p.commentary,lang)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tracker({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["prompt-eng-dissolve"]));
  const toggle = k => setExpanded(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});

  const statuses = ["all","verified","partial","pending","revised"];
  const filtered = filter === "all" ? trackedPredictions : trackedPredictions.filter(p=>p.status===filter);

  // Scorecard
  const counts = {};
  for (const s of Object.keys(statusConfig)) counts[s] = trackedPredictions.filter(p=>p.status===s).length;

  return (
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{fontSize:mobile?10.5:12,color:C.textSub,textAlign:"center",marginBottom:mobile?14:20,lineHeight:1.6}}>
        {t(i18n.intro,lang)}
      </div>

      {/* Scorecard */}
      <div style={{
        display:"flex",justifyContent:"center",gap:mobile?6:12,marginBottom:mobile?14:20,flexWrap:"wrap",
      }}>
        {Object.entries(statusConfig).map(([key,cfg])=>(
          <div key={key} style={{
            background:C.surface,border:`1px solid ${cfg.color}22`,
            borderRadius:8,padding:mobile?"8px 12px":"10px 16px",textAlign:"center",
            minWidth:mobile?60:80,
          }}>
            <div style={{fontSize:mobile?18:22}}>{cfg.icon}</div>
            <div style={{fontFamily:mono,fontSize:mobile?16:20,fontWeight:700,color:cfg.color}}>
              {counts[key]}
            </div>
            <div style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim}}>
              {t(cfg.label,lang)}
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:mobile?4:6,marginBottom:mobile?14:20,flexWrap:"wrap"}}>
        {statuses.map(s=>{
          const cfg = s === "all" ? {label:i18n.all,color:C.textSub} : statusConfig[s];
          return (
            <button key={s} onClick={()=>setFilter(s)} style={{
              background:filter===s?cfg.color+"22":"transparent",
              color:filter===s?cfg.color:C.textDim,
              border:`1px solid ${filter===s?cfg.color+"44":C.border}`,
              borderRadius:12,padding:mobile?"4px 10px":"5px 14px",cursor:"pointer",
              fontFamily:mono,fontSize:mobile?9:10,fontWeight:filter===s?700:400,
              display:"flex",alignItems:"center",gap:4,
            }}>
              {s!=="all"&&<span style={{fontSize:mobile?11:13}}>{statusConfig[s].icon}</span>}
              {t(cfg.label,lang)}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:mobile?8:10}}>
        {filtered.map(p=>(
          <TrackerCard key={p.id} p={p} expanded={expanded.has(p.id)}
            onToggle={()=>toggle(p.id)} lang={lang} mobile={mobile}/>
        ))}
      </div>
    </div>
  );
}
