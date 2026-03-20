import { useState, useEffect } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";

const i18n = {
  selectStage:{en:"Select a stage to see a real workflow",zh:"选择阶段查看真实工作流"},
  taskLabel:{en:"TASK",zh:"任务"},
  who:{en:"WHO",zh:"执行者"},
  human:{en:"Human",zh:"人类"},
  agent:{en:"Agent",zh:"Agent"},
  system:{en:"System",zh:"系统"},
  toolsUsed:{en:"TOOLS & PROTOCOLS",zh:"工具 & 协议"},
  outcome:{en:"OUTCOME",zh:"结果"},
  timeLabel:{en:"TIME",zh:"耗时"},
  insight:{en:"KEY INSIGHT",zh:"关键洞察"},
};

const examples = [
  {
    level:0, color:C.textSub, glow:"rgba(139,149,165,0.08)", icon:"👤",
    name:{en:"L0 · Manual",zh:"L0 · 人工"},
    scenario:{en:"Fix a login authentication bug",zh:"修复登录认证 Bug"},
    time:{en:"~4 hours",zh:"~4 小时"},
    insight:{en:"Every step requires human memory and context switching. The bottleneck is the developer's recall speed and typing speed.",zh:"每一步都依赖人类记忆和上下文切换。瓶颈是开发者的回忆速度和手速。"},
    steps:[
      {who:"human",action:{en:"Read bug report in Jira, try to reproduce",zh:"在 Jira 阅读 bug 报告，尝试复现"},tools:["Jira","Browser"]},
      {who:"human",action:{en:"Search StackOverflow for similar JWT issues",zh:"在 StackOverflow 搜索类似 JWT 问题"},tools:["Google","StackOverflow"]},
      {who:"human",action:{en:"Manually trace code path: controller → service → auth middleware",zh:"手动追踪代码路径: controller → service → auth middleware"},tools:["VS Code"]},
      {who:"human",action:{en:"Write fix, manually run tests",zh:"编写修复代码，手动运行测试"},tools:["VS Code","Terminal"]},
      {who:"human",action:{en:"git add, commit, push, create PR, write description",zh:"git add, commit, push, 创建 PR, 写描述"},tools:["Git","GitHub"]},
      {who:"human",action:{en:"Wait for review, address comments, merge",zh:"等待 review，处理评论，合并"},tools:["GitHub"]},
    ]
  },
  {
    level:1, color:C.purple, glow:C.purpleGlow, icon:"💬",
    name:{en:"L1 · Assisted",zh:"L1 · 辅助"},
    scenario:{en:"Fix a login authentication bug",zh:"修复登录认证 Bug"},
    time:{en:"~2 hours",zh:"~2 小时"},
    insight:{en:"AI generates answers but human still manually moves code between chat and editor. The copy-paste bottleneck replaces the memory bottleneck.",zh:"AI 生成答案但人类仍需手动在聊天和编辑器之间搬运代码。复制粘贴瓶颈取代了记忆瓶颈。"},
    steps:[
      {who:"human",action:{en:"Read bug report, paste error log to ChatGPT",zh:"阅读 bug 报告，把错误日志贴给 ChatGPT"},tools:["Jira","ChatGPT"]},
      {who:"agent",action:{en:"AI analyzes error, suggests JWT token expiry issue",zh:"AI 分析错误，建议是 JWT token 过期问题"},tools:["ChatGPT"]},
      {who:"human",action:{en:"Paste relevant code to AI, ask for fix",zh:"把相关代码贴给 AI，请求修复方案"},tools:["ChatGPT","VS Code"]},
      {who:"agent",action:{en:"AI generates patched code snippet",zh:"AI 生成修补代码片段"},tools:["ChatGPT"]},
      {who:"human",action:{en:"Copy-paste fix into editor, manually test",zh:"复制粘贴修复到编辑器，手动测试"},tools:["VS Code","Terminal"]},
      {who:"human",action:{en:"git commit, push, create PR (write description manually)",zh:"git commit, push, 创建 PR (手写描述)"},tools:["Git","GitHub"]},
    ]
  },
  {
    level:2, color:C.blue, glow:C.blueGlow, icon:"🤝",
    name:{en:"L2 · Collaborative",zh:"L2 · 协作"},
    scenario:{en:"Fix a login authentication bug",zh:"修复登录认证 Bug"},
    time:{en:"~45 min",zh:"~45 分钟"},
    insight:{en:"AI understands the full codebase context. No more copy-paste — suggestions appear inline. Human reviews diffs instead of writing code.",zh:"AI 理解完整代码库上下文。不再需要复制粘贴——建议直接内联出现。人类审查 diff 而非手写代码。"},
    steps:[
      {who:"human",action:{en:"Open project in Cursor, describe bug in chat panel",zh:"在 Cursor 中打开项目，在聊天面板描述 bug"},tools:["Cursor","ACP"]},
      {who:"agent",action:{en:"AI scans codebase, identifies auth middleware issue, highlights file",zh:"AI 扫描代码库，定位 auth middleware 问题，高亮文件"},tools:["Cursor","MCP"]},
      {who:"agent",action:{en:"AI proposes inline fix with diff preview",zh:"AI 提出内联修复方案并预览 diff"},tools:["Cursor"]},
      {who:"human",action:{en:"Review diff, accept with one click",zh:"审查 diff，一键接受"},tools:["Cursor"]},
      {who:"agent",action:{en:"AI suggests test case, human approves",zh:"AI 建议测试用例，人类批准"},tools:["Cursor","MCP"]},
      {who:"human",action:{en:"AI drafts PR description, human reviews and submits",zh:"AI 起草 PR 描述，人类审查后提交"},tools:["Cursor","GitHub"]},
    ]
  },
  {
    level:3, color:C.amber, glow:C.amberGlow, icon:"🔄",
    name:{en:"L3 · Semi-Auto",zh:"L3 · 半自动"},
    scenario:{en:"Fix a login authentication bug",zh:"修复登录认证 Bug"},
    time:{en:"~10 min (human) + ~15 min (agent)",zh:"~10 分钟(人类) + ~15 分钟(agent)"},
    insight:{en:"Human describes intent in one sentence. Agent does all the mechanical work — code edit, test, git. Human only approves the final plan and result.",zh:"人类用一句话描述意图。Agent 完成所有机械工作——代码编辑、测试、Git。人类只审批最终方案和结果。"},
    steps:[
      {who:"human",action:{en:"In terminal: \"fix the JWT auth bug in login flow, token expiry isn't handled\"",zh:"终端输入: \"修复登录流程中的 JWT auth bug，token 过期没处理\""},tools:["Claude Code"]},
      {who:"agent",action:{en:"Agent reads codebase, generates multi-step plan:\n1. Fix middleware\n2. Add token refresh\n3. Update tests\n4. Commit",zh:"Agent 阅读代码库，生成多步计划:\n1. 修复 middleware\n2. 添加 token 刷新\n3. 更新测试\n4. 提交"},tools:["Claude Code","MCP"]},
      {who:"human",action:{en:"Review plan → approve (one keystroke: y)",zh:"审查计划 → 批准 (一个按键: y)"},tools:["Claude Code"]},
      {who:"agent",action:{en:"Agent edits 3 files, runs test suite, all pass",zh:"Agent 编辑 3 个文件，运行测试套件，全部通过"},tools:["Claude Code","MCP"]},
      {who:"agent",action:{en:"Agent commits with descriptive message, creates PR",zh:"Agent 用描述性消息提交，创建 PR"},tools:["Claude Code","Git","GitHub"]},
      {who:"human",action:{en:"Review PR diff on phone (push notification), approve",zh:"在手机上审查 PR diff (推送通知)，批准"},tools:["Mobile","AG-UI","A2UI"]},
    ]
  },
  {
    level:4, color:C.green, glow:C.greenGlow, icon:"⚡",
    name:{en:"L4 · Full-Auto",zh:"L4 · 全自动"},
    scenario:{en:"Fix a login authentication bug",zh:"修复登录认证 Bug"},
    time:{en:"~0 min (human) + ~8 min (agent)",zh:"~0 分钟(人类) + ~8 分钟(agent)"},
    insight:{en:"Human didn't even know there was a bug. Agent detected it, fixed it, tested it, and deployed it — all within Governance boundaries. Human only sees a notification.",zh:"人类甚至不知道有 bug。Agent 检测到、修复、测试、部署——全在 Governance 边界内。人类只看到一条通知。"},
    steps:[
      {who:"system",action:{en:"CI pipeline detects auth test failure after dependency update",zh:"CI 流水线在依赖更新后检测到 auth 测试失败"},tools:["GitHub Actions"]},
      {who:"agent",action:{en:"Headless agent triggered by webhook, analyzes failure",zh:"Headless agent 被 webhook 触发，分析故障"},tools:["Claude Code","MCP","A2A"]},
      {who:"agent",action:{en:"Agent traces root cause: JWT library breaking change",zh:"Agent 追踪根因: JWT 库的破坏性变更"},tools:["Claude Code","MCP"]},
      {who:"agent",action:{en:"Agent fixes code, runs full test suite, all green",zh:"Agent 修复代码，运行全部测试，全绿"},tools:["Claude Code","MCP"]},
      {who:"agent",action:{en:"Governance checks: within budget, no security-sensitive changes → auto-approve",zh:"Governance 检查: 在预算内，无安全敏感变更 → 自动批准"},tools:["Harness Governance"]},
      {who:"system",action:{en:"Auto-merge PR, deploy to staging. Push notification to human",zh:"自动合并 PR，部署到 staging。推送通知给人类"},tools:["GitHub Actions","Mobile"]},
    ]
  },
  {
    level:5, color:C.cyan, glow:C.cyanGlow, icon:"🌐",
    name:{en:"L5 · Orchestration",zh:"L5 · 自主编排"},
    scenario:{en:"Major auth system overhaul: migrate from JWT to OAuth2 + passkey",zh:"认证系统大重构: 从 JWT 迁移到 OAuth2 + passkey"},
    time:{en:"~30 min (human goal setting) + ~6 hours (agent mesh)",zh:"~30 分钟(人类目标设定) + ~6 小时(agent mesh)"},
    insight:{en:"Human defines the goal and constraints. Agent mesh self-organizes: architect agent designs the plan, coding agents implement in parallel, testing agent validates, security agent audits. Coordination handles the topology.",zh:"人类定义目标和约束。Agent mesh 自组织: 架构 agent 设计方案，编码 agent 并行实现，测试 agent 验证，安全 agent 审计。Coordination 层处理拓扑。"},
    steps:[
      {who:"human",action:{en:"Define goal: \"Migrate auth from JWT to OAuth2+passkey. Budget: 500K tokens. Constraint: zero downtime.\"",zh:"定义目标: \"将认证从 JWT 迁移到 OAuth2+passkey。预算: 50万 tokens。约束: 零停机。\""},tools:["Terminal"]},
      {who:"agent",action:{en:"Architect agent designs migration plan, splits into 4 parallel workstreams",zh:"架构 agent 设计迁移方案，拆分为 4 个并行工作流"},tools:["A2A","Coordination"]},
      {who:"agent",action:{en:"Coding agents (×3) implement OAuth2, passkey, and migration layer in parallel",zh:"编码 agent (×3) 并行实现 OAuth2、passkey、迁移层"},tools:["Claude Code","MCP","A2A"]},
      {who:"agent",action:{en:"Testing agent writes and runs integration tests as code is produced",zh:"测试 agent 在代码产出时编写并运行集成测试"},tools:["Claude Code","MCP"]},
      {who:"agent",action:{en:"Security agent audits for vulnerabilities, requests one change → coding agent fixes",zh:"安全 agent 审计漏洞，要求一处修改 → 编码 agent 修复"},tools:["A2A","Governance"]},
      {who:"human",action:{en:"Review final summary on phone: 12 files, 340 tests pass, security audit clean → approve deploy",zh:"在手机上查看最终摘要: 12 个文件，340 个测试通过，安全审计通过 → 批准部署"},tools:["Mobile","AG-UI","A2UI"]},
    ]
  },
];

const whoColors = { human: C.blue, agent: C.amber, system: C.green };
const whoIcons = { human: "👤", agent: "🤖", system: "⚙️" };

function Step({step, index, color, lang, mobile}) {
  const wc = whoColors[step.who];
  return (
    <div style={{
      display:"flex", gap: mobile?8:12, padding: mobile?"8px 0":"10px 0",
      borderBottom:`1px solid ${C.border}`,
    }}>
      {/* Timeline dot + line */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:mobile?24:32}}>
        <div style={{
          width:mobile?20:24, height:mobile?20:24, borderRadius:"50%",
          background:wc+"22", border:`2px solid ${wc}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:mobile?10:12,
        }}>{whoIcons[step.who]}</div>
        <div style={{flex:1,width:1,background:C.border,marginTop:4}}/>
      </div>
      {/* Content */}
      <div style={{flex:1,paddingBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontFamily:mono,fontSize:mobile?8:9,fontWeight:700,color:wc,textTransform:"uppercase"}}>
            {t(i18n[step.who],lang)}
          </span>
          <span style={{fontSize:mobile?7:8,color:C.textDim,fontFamily:mono}}>Step {index+1}</span>
        </div>
        <div style={{fontSize:mobile?10.5:11.5,color:C.text,lineHeight:1.6,whiteSpace:"pre-line"}}>
          {t(step.action,lang)}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>
          {step.tools.map((tool,i) => (
            <span key={i} style={{
              fontSize:mobile?7:8, color:color, background:color+"15",
              padding:"1px 5px", borderRadius:3, fontFamily:mono, fontWeight:500,
              border:`1px solid ${color}22`,
            }}>{tool}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Examples({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [selected, setSelected] = useState(3);

  const ex = examples[selected];

  return (
    <>
      {/* Stage selector */}
      <div style={{maxWidth:720,margin:mobile?"0 auto 16px":"0 auto 24px"}}>
        <div style={{fontSize:mobile?9:11,color:C.textDim,fontFamily:sans,textAlign:"center",marginBottom:mobile?8:12}}>
          {t(i18n.selectStage,lang)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${mobile?3:6},1fr)`,gap:mobile?4:6}}>
          {examples.map((e,i) => (
            <button key={i} onClick={()=>setSelected(i)} style={{
              background: selected===i ? e.glow : C.surface,
              border:`1px solid ${selected===i ? e.color+"66" : C.border}`,
              borderRadius:mobile?6:8, padding:mobile?"8px 4px":"10px 8px",
              cursor:"pointer", transition:"all 0.15s ease",
              borderTop:`${selected===i?3:2}px solid ${e.color}`,
            }}>
              <div style={{fontSize:mobile?14:18,marginBottom:2}}>{e.icon}</div>
              <div style={{fontFamily:mono,fontSize:mobile?8:9,fontWeight:700,color:e.color}}>L{e.level}</div>
              {!mobile && <div style={{fontSize:8,color:C.textDim,marginTop:1}}>{t(e.name,lang).split("·")[1]?.trim()}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Selected example */}
      <div style={{maxWidth:720,margin:"0 auto"}}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg,${ex.glow},${C.surface})`,
          border:`1px solid ${ex.color}33`,
          borderRadius:10, padding:mobile?"14px 14px":"18px 20px",
          marginBottom:mobile?12:16,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:mobile?24:32}}>{ex.icon}</span>
            <div>
              <div style={{fontFamily:mono,fontSize:mobile?14:18,fontWeight:700,color:C.text}}>{t(ex.name,lang)}</div>
              <div style={{fontSize:mobile?10:12,color:ex.color,marginTop:2}}>{t(ex.scenario,lang)}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:mobile?12:20,flexWrap:"wrap"}}>
            <div>
              <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,textTransform:"uppercase"}}>{t(i18n.timeLabel,lang)} </span>
              <span style={{fontSize:mobile?10:11,fontFamily:mono,color:ex.color,fontWeight:600}}>{t(ex.time,lang)}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{
          background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:10, padding:mobile?"12px 12px":"16px 18px",
          marginBottom:mobile?12:16,
        }}>
          {ex.steps.map((step,i) => (
            <Step key={i} step={step} index={i} color={ex.color} lang={lang} mobile={mobile}/>
          ))}
        </div>

        {/* Insight */}
        <div style={{
          background:ex.glow, border:`1px solid ${ex.color}22`,
          borderRadius:10, padding:mobile?"12px 14px":"16px 18px",
        }}>
          <div style={{fontSize:mobile?8:9,fontFamily:mono,color:ex.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
            {t(i18n.insight,lang)}
          </div>
          <div style={{fontSize:mobile?11:12.5,color:C.text,lineHeight:1.7,fontFamily:sans}}>
            {t(ex.insight,lang)}
          </div>
        </div>
      </div>
    </>
  );
}
