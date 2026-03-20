import { useState } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";

const i18n = {
  intro:{
    en:"Answer three questions to get a personalized recommendation for your AI coding setup.",
    zh:"回答三个问题，获取个性化的 AI 编码设置推荐。",
  },
  q1:{en:"What's your role?",zh:"你的角色是什么？"},
  q2:{en:"What type of work?",zh:"什么类型的工作？"},
  q3:{en:"Risk tolerance?",zh:"风险容忍度？"},
  result:{en:"RECOMMENDED SETUP",zh:"推荐配置"},
  level:{en:"Automation Level",zh:"自动化级别"},
  primary:{en:"Primary Device",zh:"主设备"},
  tools:{en:"Recommended Tools",zh:"推荐工具"},
  protocols:{en:"Key Protocols",zh:"关键协议"},
  workflow:{en:"Typical Workflow",zh:"典型工作流"},
  reset:{en:"Reset",zh:"重置"},
  next:{en:"What to try next",zh:"下一步尝试"},
};

const q1Options = [
  {id:"solo",label:{en:"Solo developer",zh:"独立开发者"},icon:"👤"},
  {id:"team",label:{en:"Team developer",zh:"团队开发者"},icon:"👥"},
  {id:"lead",label:{en:"Tech lead / Architect",zh:"技术负责人 / 架构师"},icon:"🏗️"},
  {id:"manager",label:{en:"Engineering manager",zh:"工程经理"},icon:"📊"},
];

const q2Options = [
  {id:"greenfield",label:{en:"New features / greenfield",zh:"新功能 / 全新项目"},icon:"🌱"},
  {id:"maintenance",label:{en:"Bug fixes / maintenance",zh:"Bug 修复 / 维护"},icon:"🔧"},
  {id:"refactor",label:{en:"Large refactoring",zh:"大规模重构"},icon:"🏗️"},
  {id:"review",label:{en:"Code review / oversight",zh:"代码审查 / 监督"},icon:"🔍"},
];

const q3Options = [
  {id:"cautious",label:{en:"Cautious — I review everything",zh:"谨慎 — 我审查一切"},icon:"🔒"},
  {id:"balanced",label:{en:"Balanced — trust but verify",zh:"均衡 — 信任但验证"},icon:"⚖️"},
  {id:"aggressive",label:{en:"Aggressive — let agents run",zh:"激进 — 让 agent 跑"},icon:"🚀"},
];

function getRecommendation(q1, q2, q3) {
  // Determine level
  let level = 2;
  if (q3 === "aggressive") level = 4;
  else if (q3 === "balanced") level = 3;
  else level = 2;

  if (q1 === "manager") level = Math.max(level, 3);
  if (q2 === "refactor" && q3 !== "cautious") level = Math.max(level, 4);
  if (q2 === "review") level = Math.min(level, 3);
  if (q2 === "greenfield" && q3 === "cautious") level = 2;

  const levelColors = [C.textSub, C.purple, C.blue, C.amber, C.green, C.cyan];

  const configs = {
    2: {
      color: levelColors[2],
      levelName:{en:"L2 Collaborative",zh:"L2 协作"},
      device:{en:"🖥️ IDE (Cursor / JetBrains + ACP agent)",zh:"🖥️ IDE (Cursor / JetBrains + ACP agent)"},
      tools:["Cursor / JetBrains","GitHub Copilot","MCP servers"],
      protocols:["ACP","MCP"],
      workflow:{
        en:"You drive. AI suggests inline. You accept/reject each change. Full control, faster output. Perfect for design-heavy work where every decision matters.",
        zh:"你主导。AI 内联建议。你接受/拒绝每个修改。完全控制，更快产出。适合每个决策都很重要的设计密集型工作。",
      },
      next:{
        en:"Try Claude Code for repetitive tasks (test writing, boilerplate). Let it handle the boring parts while you keep control over architecture.",
        zh:"试试用 Claude Code 处理重复性任务（写测试、样板代码）。让它处理无聊的部分，你保持对架构的控制。",
      },
    },
    3: {
      color: levelColors[3],
      levelName:{en:"L3 Semi-Autonomous",zh:"L3 半自动"},
      device:{en:"⌨️ Terminal (Claude Code) + 📱 Phone (approval)",zh:"⌨️ 终端 (Claude Code) + 📱 手机 (审批)"},
      tools:["Claude Code","Gemini CLI","Claude Code Remote Control"],
      protocols:["ACP","MCP","AG-UI"],
      workflow:{
        en:"Describe intent in natural language → Agent plans and executes → You review and approve. Ideal for well-defined tasks where the 'what' is clear but the 'how' is tedious.",
        zh:"用自然语言描述意图 → Agent 规划并执行 → 你审查并批准。适合 '做什么' 很清楚但 '怎么做' 很繁琐的明确任务。",
      },
      next:{
        en:"Set up overnight agents for maintenance tasks. Configure Governance boundaries (budget, file limits) and let agents handle dependency updates and test fixes while you sleep.",
        zh:"为维护任务设置夜间 agent。配置 Governance 边界（预算、文件限制），让 agent 在你睡觉时处理依赖更新和测试修复。",
      },
    },
    4: {
      color: levelColors[4],
      levelName:{en:"L4 Fully Automatic",zh:"L4 全自动"},
      device:{en:"⚡ Headless (CI/CD) + 📱 Phone (monitoring)",zh:"⚡ 无头端 (CI/CD) + 📱 手机 (监控)"},
      tools:["Claude Code (headless)","GitHub Actions","Governance rules"],
      protocols:["ACP","MCP","AG-UI","A2A"],
      workflow:{
        en:"Define Governance boundaries → Agents run 24/7 in containers → You monitor via phone notifications → Intervene only on exceptions. Best for maintenance, security scanning, and large-scale refactoring.",
        zh:"定义 Governance 边界 → Agent 在容器中 24/7 运行 → 你通过手机通知监控 → 只在异常时介入。最适合维护、安全扫描和大规模重构。",
      },
      next:{
        en:"Explore multi-agent coordination (A2A). Have a planning agent break down large tasks and delegate to specialized coding agents. Start with simple Factory patterns before attempting Fractal or adversarial setups.",
        zh:"探索多 agent 协调 (A2A)。让规划 agent 分解大任务并委派给专业编码 agent。先用简单的 Factory 模式，再尝试 Fractal 或对抗模式。",
      },
    },
  };

  return configs[level] || configs[3];
}

function OptionButton({opt, selected, onSelect, mobile, lang}) {
  const active = selected === opt.id;
  return (
    <button onClick={()=>onSelect(opt.id)} style={{
      background: active ? C.blue+"18" : C.surface,
      border: `1px solid ${active ? C.blue+"55" : C.border}`,
      borderRadius: 8, padding: mobile?"10px":"12px 16px",
      cursor:"pointer", transition:"all 0.15s ease",
      display:"flex", alignItems:"center", gap:mobile?8:10,
      width:"100%", textAlign:"left",
    }}>
      <span style={{fontSize:mobile?16:20}}>{opt.icon}</span>
      <span style={{
        fontFamily:sans, fontSize:mobile?11:12.5, color: active?C.blue:C.textSub,
        fontWeight: active?600:400,
      }}>{t(opt.label,lang)}</span>
    </button>
  );
}

export default function Guide({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);

  const allAnswered = q1 && q2 && q3;
  const rec = allAnswered ? getRecommendation(q1,q2,q3) : null;

  const reset = () => { setQ1(null); setQ2(null); setQ3(null); };

  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{fontSize:mobile?10.5:12,color:C.textSub,textAlign:"center",marginBottom:mobile?16:24,lineHeight:1.6}}>
        {t(i18n.intro,lang)}
      </div>

      {/* Questions */}
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:mobile?14:16,marginBottom:mobile?16:24}}>
        {/* Q1 */}
        <div>
          <div style={{fontFamily:mono,fontSize:mobile?10:11,fontWeight:700,color:C.blue,marginBottom:8}}>
            1. {t(i18n.q1,lang)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {q1Options.map(o=><OptionButton key={o.id} opt={o} selected={q1} onSelect={setQ1} mobile={mobile} lang={lang}/>)}
          </div>
        </div>
        {/* Q2 */}
        <div>
          <div style={{fontFamily:mono,fontSize:mobile?10:11,fontWeight:700,color:C.blue,marginBottom:8}}>
            2. {t(i18n.q2,lang)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {q2Options.map(o=><OptionButton key={o.id} opt={o} selected={q2} onSelect={setQ2} mobile={mobile} lang={lang}/>)}
          </div>
        </div>
        {/* Q3 */}
        <div>
          <div style={{fontFamily:mono,fontSize:mobile?10:11,fontWeight:700,color:C.blue,marginBottom:8}}>
            3. {t(i18n.q3,lang)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {q3Options.map(o=><OptionButton key={o.id} opt={o} selected={q3} onSelect={setQ3} mobile={mobile} lang={lang}/>)}
          </div>
        </div>
      </div>

      {/* Result */}
      {allAnswered && rec && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{
            background:`linear-gradient(135deg,${rec.color}10,${C.surface})`,
            border:`1px solid ${rec.color}44`,borderRadius:12,
            padding:mobile?"16px":"22px 26px",marginBottom:12,
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontFamily:mono,fontSize:mobile?9:10,fontWeight:700,color:rec.color,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {t(i18n.result,lang)}
              </div>
              <button onClick={reset} style={{
                background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,
                padding:"3px 10px",cursor:"pointer",fontFamily:mono,fontSize:mobile?8:9,
                color:C.textDim,
              }}>{t(i18n.reset,lang)}</button>
            </div>

            {/* Level */}
            <div style={{fontFamily:mono,fontSize:mobile?18:24,fontWeight:700,color:rec.color,marginBottom:6}}>
              {t(rec.levelName,lang)}
            </div>

            {/* Device */}
            <div style={{fontSize:mobile?12:14,color:C.text,marginBottom:14}}>
              {t(rec.device,lang)}
            </div>

            {/* Tools + Protocols */}
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <div style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,marginBottom:4}}>{t(i18n.tools,lang)}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {rec.tools.map((tool,i)=><Tag key={i} color={rec.color} mobile={mobile}>{tool}</Tag>)}
                </div>
              </div>
              <div>
                <div style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,marginBottom:4}}>{t(i18n.protocols,lang)}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {rec.protocols.map((p,i)=><Tag key={i} color={C.blue} mobile={mobile}>{p}</Tag>)}
                </div>
              </div>
            </div>

            {/* Workflow */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:mobile?8:9,fontFamily:mono,color:rec.color,fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>
                {t(i18n.workflow,lang)}
              </div>
              <div style={{fontSize:mobile?11:12,color:C.textSub,lineHeight:1.7}}>{t(rec.workflow,lang)}</div>
            </div>

            {/* Next step */}
            <div style={{
              background:rec.color+"12",border:`1px solid ${rec.color}22`,
              borderRadius:8,padding:mobile?"10px 12px":"12px 16px",
            }}>
              <div style={{fontSize:mobile?8:9,fontFamily:mono,color:rec.color,fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>
                {t(i18n.next,lang)}
              </div>
              <div style={{fontSize:mobile?10.5:12,color:C.text,lineHeight:1.6}}>{t(rec.next,lang)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
