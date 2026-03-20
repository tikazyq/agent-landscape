import { useState } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";

/* ═══ i18n ═══ */
const i18n = {
  specTitle:{en:"Automation Spectrum",zh:"自动化谱系"},
  specSub:{en:"L0→L5",zh:"L0→L5"},
  weAreHere:{en:"WE ARE HERE",zh:"当前位置"},
  mainstream:{en:"MAINSTREAM",zh:"主流"},
  frontier:{en:"FRONTIER",zh:"前沿"},
  flowTitle:{en:"Cross-Layer Data Flows",zh:"跨层数据流"},
  protoTitle:{en:"Protocol Reference",zh:"协议速查"},
};

const spectrum = [
  {l:"L0",name:{en:"Manual",zh:"人工"},color:C.textSub,shift:{en:"Memory-driven",zh:"记忆驱动"}},
  {l:"L1",name:{en:"Assisted",zh:"辅助"},color:C.purple,shift:{en:"Generate answers",zh:"生成答案"}},
  {l:"L2",name:{en:"Collab",zh:"协作"},color:C.blue,shift:{en:"Review & revise",zh:"审查修改"},marker:"mainstream"},
  {l:"L3",name:{en:"Semi-Auto",zh:"半自动"},color:C.amber,shift:{en:"Describe intent",zh:"描述意图"},marker:"frontier"},
  {l:"L4",name:{en:"Full-Auto",zh:"全自动"},color:C.green,shift:{en:"Set boundaries",zh:"设定边界"}},
  {l:"L5",name:{en:"Orchestr.",zh:"自主编排"},color:C.cyan,shift:{en:"Define goals",zh:"定义目标"}},
];

const connLabels = [
  {en:"render / user events",zh:"渲染 / 用户事件"},
  {en:"handoff contract",zh:"handoff 契约"},
  {en:"task / tool_call",zh:"task / tool_call"},
  {en:"execute / results",zh:"执行 / 结果"},
];

const layers = [
  {id:"endpoints",title:{en:"Human Endpoints",zh:"人类终端"},sub:{en:"Interaction surfaces",zh:"交互终端"},color:C.cyan,glow:C.cyanGlow,items:[
    {name:{en:"Mobile",zh:"移动端"},icon:"📱",tag:{en:"Async control",zh:"异步控制面"},desc:{en:"Intent dispatch · Approval · Notification-driven",zh:"意图下达 · 审批 · 通知驱动"},details:{en:["Claude Code Remote Control (QR pair → phone takeover)","Pocket Agent · Moshi (dedicated mobile controllers)","A2UI → Flutter / SwiftUI / Compose","Fire-and-forget: start → background → push result","Voice input + tap approval + push notifications"],zh:["Claude Code Remote Control (QR配对→手机接续)","Pocket Agent · Moshi (专用移动控制器)","A2UI → Flutter / SwiftUI / Compose","Fire-and-forget: 启动→后台→推送结果","语音输入 + 触控审批 + 通知驱动"]}},
    {name:{en:"Terminal",zh:"终端"},icon:"⌨️",tag:{en:"Full dev",zh:"全功能开发"},desc:{en:"Text streaming · Pipe composition · Persistent sessions",zh:"文本流式 · 管道组合 · Session 持久化"},details:{en:["Claude Code · Gemini CLI · Aider · Codex CLI","ACP access: agent --acp (stdio/TCP)","Ratatui · Ink · Bubbletea","tmux/Mosh persistent session + Remote Control","ANSI/VT100 standard chain"],zh:["Claude Code · Gemini CLI · Aider · Codex CLI","ACP 接入: agent --acp (stdio/TCP)","Ratatui · Ink · Bubbletea","tmux/Mosh 持久 session + Remote Control","ANSI/VT100 标准链"]}},
    {name:{en:"IDE / Desktop",zh:"IDE / 桌面"},icon:"🖥️",tag:{en:"Rich review",zh:"富交互审查"},desc:{en:"ACP access · Generative UI · Diff review",zh:"ACP 接入 · Generative UI · Diff 审查"},details:{en:["JetBrains (ACP Registry) · Zed · VS Code","Cursor · Windsurf (AI-native IDE)","ACP: LSP for AI agents","A2UI → React / Lit / Angular","Diff viewer · Code review · Dashboard"],zh:["JetBrains (ACP Registry) · Zed · VS Code","Cursor · Windsurf (AI-native IDE)","ACP: LSP for AI agents","A2UI → React / Lit / Angular","Diff viewer · Code review · Dashboard"]}},
    {name:{en:"Headless",zh:"无头端"},icon:"⚡",tag:{en:"Unattended",zh:"无人值守"},desc:{en:"CI/CD · Webhook · Bot · IoT",zh:"CI/CD · Webhook · Bot · IoT"},details:{en:["GitHub Actions + agent (ACP over TCP)","Webhook → autonomous exec → callback","Slack / Teams / Discord bot","Cron agents (24/7)","IoT / Edge endpoints"],zh:["GitHub Actions + agent (ACP over TCP)","Webhook → 自主执行 → 结果回调","Slack / Teams / Discord bot","Cron agents (24/7)","IoT / Edge endpoints"]}},
  ]},
  {id:"ui-protocol",title:{en:"Agent↔Human Protocol",zh:"Agent↔人类协议"},sub:{en:"UI protocol layer",zh:"UI 协议层"},color:C.blue,glow:C.blueGlow,items:[
    {name:{en:"ACP",zh:"ACP"},icon:"🔗",tag:{en:"JetBrains+Zed",zh:"JetBrains+Zed"},desc:{en:"Agent Client Protocol — LSP for AI Agents",zh:"Agent Client Protocol — LSP for AI Agents"},details:{en:["Editor ↔ AI agent standard interface","JSON-RPC stdio / HTTP+WS","Copilot CLI · Claude Code · Gemini CLI","Agent Registry: one-click install to IDE","Complements MCP: ACP→agent, MCP→tool"],zh:["编辑器 ↔ AI agent 标准接口","JSON-RPC stdio / HTTP+WS","Copilot CLI · Claude Code · Gemini CLI","Agent Registry: 一键安装到 IDE","与 MCP 互补: ACP 连 agent，MCP 连 tool"]}},
    {name:{en:"A2UI",zh:"A2UI"},icon:"🎨",tag:{en:"Google",zh:"Google"},desc:{en:"Declarative UI — Agent output → native render",zh:"声明式 UI — Agent 输出 → 原生渲染"},details:{en:["JSON → native components per platform","Secure: declarative data, not executable code","Web / Flutter / SwiftUI / Compose","Streaming incremental updates","Adopted by Gemini Enterprise, v1.0 underway"],zh:["JSON → 各平台原生组件渲染","安全: 声明式数据，非可执行代码","Web / Flutter / SwiftUI / Compose","流式增量更新","Gemini Enterprise 已采用，v1.0 推进中"]}},
    {name:{en:"AG-UI",zh:"AG-UI"},icon:"🔄",tag:{en:"CopilotKit",zh:"CopilotKit"},desc:{en:"Agent↔Frontend event-driven bidirectional",zh:"Agent↔Frontend 事件驱动双向通信"},details:{en:["State sync · Tool call events · HITL primitives","Transport-agnostic: SSE / WS / HTTP","Adopted by Google · LangChain · AWS · MS","A2UI = what to show, AG-UI = how to sync","Shared State: bidirectional read/write"],zh:["状态同步 · Tool call 事件 · HITL 原语","传输无关: SSE / WebSocket / HTTP","Google · LangChain · AWS · MS 已采用","A2UI 描述内容，AG-UI 传输事件","Shared State 双向读写"]}},
    {name:{en:"GenUI",zh:"GenUI"},icon:"✨",tag:{en:"Pattern",zh:"模式"},desc:{en:"3 modes — control ↔ freedom tradeoff",zh:"三模式 — 控制权↔自由度权衡"},details:{en:["Static: frontend owns UI (AG-UI)","Declarative: A2UI / Open-JSON-UI","Open-ended: MCP Apps","Mode adapts to device context","CopilotKit unified support"],zh:["Static: 前端掌控 (AG-UI)","Declarative: A2UI / Open-JSON-UI","Open-ended: MCP Apps","按设备上下文选模式","CopilotKit 三模式统一"]}},
  ]},
  {id:"harness",title:{en:"Agent Harness",zh:"Agent Harness"},sub:{en:"Control plane",zh:"控制面"},color:C.amber,glow:C.amberGlow,items:[
    {name:{en:"Governance",zh:"Governance"},icon:"🛡️",tag:{en:"Crosscutting",zh:"横切约束"},desc:{en:"evaluate(action,ctx,state) → Allow|Deny|Modify",zh:"evaluate(action,ctx,state) → Allow|Deny|Modify"},details:{en:["Interceptor: all actions pass through","Rule Crystallization → static rules","Budget · Rate · Safety boundaries","Handoff contract (UI-agnostic)","Deny → push approval via AG-UI"],zh:["拦截器: 所有 action 必经","Rule Crystallization → 静态规则","Budget · Rate · Safety 边界","handoff 契约 (不耦合 UI)","Deny → AG-UI 推审批到人类端"]}},
    {name:{en:"Runtime",zh:"Runtime"},icon:"⚙️",tag:{en:"Lifecycle",zh:"生命周期"},desc:{en:"Agent Loop state machine · Session · Recovery",zh:"Agent Loop 状态机 · Session · 错误恢复"},details:{en:["Plan → Approve → Execute → Review","Session/Context isolated windows","Token budget + auto downgrade","Exponential backoff retry","Checkpoint + state persistence"],zh:["Plan → Approve → Exec → Review","Session/Context 独立窗口","Token 预算 + 自动降级","指数退避重试","断点续传 + 状态持久化"]}},
    {name:{en:"Capability",zh:"Capability"},icon:"🧩",tag:{en:"Registry",zh:"能力注册"},desc:{en:"Tool / Skill / Agent hierarchy · Typed Schema",zh:"Tool / Skill / Agent 层次 · Typed Schema"},details:{en:["Tool (atomic) → Skill (composed) → Agent (autonomous)","Pydantic / Zod typed schemas","Skill lifecycle: define→discover→load→exec→evolve","skill-evolver closed-loop repair","Skills 2.0: hot-reload + isolated context"],zh:["Tool(原子) → Skill(组合) → Agent(自主)","Pydantic / Zod schema","Skill: 定义→发现→加载→执行→进化","skill-evolver 闭环修复","Skills 2.0 热加载 + 独立上下文"]}},
    {name:{en:"Coordination",zh:"Coordination"},icon:"🔀",tag:{en:"Orchestration",zh:"编排模式"},desc:{en:"Factory / Fractal / Generative Adversarial",zh:"Factory / Fractal / GenAdv"},details:{en:["Factory: BUILD→INSPECT linear pipeline","Fractal: DECOMPOSE→SOLVE→REUNIFY tree","GenAdv: Generator + Discriminator","Convergence control · mode collapse guard","Sub-agent isolated context + aggregation"],zh:["Factory: BUILD→INSPECT 线性管线","Fractal: DECOMPOSE→SOLVE→REUNIFY 树形","GenAdv: Generator + Discriminator","收敛控制 · 模式坍缩防护","子 Agent 独立上下文 + 聚合"]}},
  ]},
  {id:"agent-comm",title:{en:"Agent↔Agent/Tool",zh:"Agent↔Agent/Tool"},sub:{en:"Communication layer",zh:"通信层"},color:C.green,glow:C.greenGlow,items:[
    {name:{en:"A2A",zh:"A2A"},icon:"🤝",tag:{en:"Google·LF",zh:"Google·LF"},desc:{en:"Inter-agent — delegation · discovery · mesh",zh:"Agent 间 — 委派 · 发现 · Mesh"},details:{en:["Google-led + IBM ACP(Comm) merged","Linux Foundation governance","AgentCard capability metadata","P2P task delegation + lifecycle","Cross-org agent mesh"],zh:["Google + IBM ACP(Comm) 合并","Linux Foundation 治理","AgentCard 能力元数据","P2P 任务委派 + 生命周期","跨组织 agent mesh"]}},
    {name:{en:"MCP",zh:"MCP"},icon:"🔌",tag:{en:"Anthropic",zh:"Anthropic"},desc:{en:"Agent↔Tool — USB-C for AI",zh:"Agent↔Tool — USB-C for AI"},details:{en:["Standardized tool + data source interface","JSON-RPC · Server/Client","MCP 1.0 shipped (2026 early)","Supported by all major tools","MCP Apps: tool+UI bundled"],zh:["标准化工具 + 数据源接口","JSON-RPC · Server/Client","MCP 1.0 (2026 early)","全主流工具已支持","MCP Apps: tool+UI 打包"]}},
    {name:{en:"Agent Spec",zh:"Agent Spec"},icon:"📋",tag:{en:"Oracle",zh:"Oracle"},desc:{en:"Framework-agnostic agent definition",zh:"框架无关 Agent 定义标准"},details:{en:["Define once, run on any runtime","AG-UI + A2UI integration","Oracle + Google + CopilotKit","Reusable Agents + GenUI (2026.3)","Reduces ecosystem friction"],zh:["一次定义，多运行时执行","AG-UI + A2UI 集成","Oracle+Google+CopilotKit","Reusable Agents + GenUI","减少集成摩擦"]}},
    {name:{en:"AP2",zh:"AP2"},icon:"💳",tag:{en:"Google",zh:"Google"},desc:{en:"Agent Payment Protocol",zh:"Agent 支付授权协议"},details:{en:["Secure financial transaction protocol","Cart Mandates authorization","Scoped digital contracts","Restricted credentials (unattended)","Agentic Commerce infrastructure"],zh:["Agent 金融交易安全协议","Cart Mandates 授权","限定数字合约","受限交易凭证","Agentic Commerce 基础设施"]}},
  ]},
  {id:"execution",title:{en:"Execution Substrate",zh:"执行底座"},sub:{en:"Runtime environment",zh:"运行环境"},color:C.purple,glow:C.purpleGlow,items:[
    {name:{en:"Cloud",zh:"云容器"},icon:"☁️",tag:{en:"Isolated",zh:"隔离执行"},desc:{en:"Codespaces · DevBox · Sealos",zh:"Codespaces · DevBox · Sealos"},details:{en:["Per-agent isolated container","Scale-to-zero","xterm.js + WS bridge","Remote Control / ACP integration","Multi-agent parallel execution"],zh:["每 agent 独立容器","Scale-to-zero","xterm.js + WS bridge","Remote Control / ACP 对接","多 agent 并行"]}},
    {name:{en:"Local",zh:"本地"},icon:"💻",tag:{en:"Dev env",zh:"本地环境"},desc:{en:"CLI local · File/Git direct access",zh:"CLI 本地 · 文件/Git 直接访问"},details:{en:["Claude Code / Codex / Gemini CLI","Full filesystem + Git","GPU inference (Ollama / vLLM)","tmux + hooks notifications","Remote Control bridge"],zh:["Claude Code / Codex / Gemini CLI","文件系统 + Git","GPU 推理 (Ollama / vLLM)","tmux + hooks 通知","Remote Control 桥接"]}},
    {name:{en:"Hybrid",zh:"混合"},icon:"🔗",tag:{en:"Edge",zh:"混合拓扑"},desc:{en:"On-device + cloud offload",zh:"on-device + cloud offload"},details:{en:["Apple Intelligence pattern","Cloudflare Tunnel","Cloud phone containers","Gemini Nano edge inference","Offline cache + online sync"],zh:["Apple Intelligence 模式","Cloudflare Tunnel 穿透","云手机 container","Gemini Nano 边缘推理","离线缓存 + 在线同步"]}},
    {name:{en:"LLM",zh:"LLM"},icon:"🧠",tag:{en:"Inference",zh:"模型服务"},desc:{en:"Model routing · Token budget",zh:"模型路由 · Token 预算"},details:{en:["Haiku→Sonnet→Opus tiered routing","OpenAI · Gemini · Mistral","Ollama / vLLM / llama.cpp","Token budget management","Prompt caching optimization"],zh:["Haiku→Sonnet→Opus 分级路由","OpenAI · Gemini · Mistral","Ollama / vLLM / llama.cpp","Token 预算管理","Prompt caching 优化"]}},
  ]},
];

const crossFlows = [
  {label:{en:"Mobile → Cloud",zh:"Mobile → Cloud"},color:C.cyan,path:{en:"NL intent → AG-UI → Governance → Container → push",zh:"NL 意图 → AG-UI → Governance → Container → 推送"}},
  {label:{en:"IDE → Local (ACP)",zh:"IDE → Local (ACP)"},color:C.blue,path:{en:"Editor → ACP JSON-RPC → Loop → MCP → Diff",zh:"编辑器 → ACP → Agent Loop → MCP → Diff 回显"}},
  {label:{en:"Headless Mesh",zh:"Headless Mesh"},color:C.green,path:{en:"Webhook → A2A → parallel agents → aggregate → handoff on error",zh:"Webhook → A2A → 多 Agent 并行 → 聚合 → 异常 handoff"}},
];

const protocols = [
  {p:"MCP",by:"Anthropic",r:{en:"Agent↔Tool",zh:"Agent↔Tool"}},
  {p:"ACP",by:"JetBrains+Zed",r:{en:"Editor↔Agent",zh:"Editor↔Agent"}},
  {p:"A2A",by:"Google·LF",r:{en:"Agent↔Agent",zh:"Agent↔Agent"}},
  {p:"A2UI",by:"Google",r:{en:"UI spec",zh:"UI 描述"}},
  {p:"AG-UI",by:"CopilotKit",r:{en:"Agent↔Frontend",zh:"Agent↔Frontend"}},
  {p:"AP2",by:"Google",r:{en:"Agent payment",zh:"Agent 支付"}},
];

/* ═══ Sub-components ═══ */
function Card({item,color,glow,expanded,onToggle,mobile,lang}){
  return(
    <div onClick={onToggle} style={{background:expanded?`linear-gradient(135deg,${glow},${C.surface})`:C.surface,border:`1px solid ${expanded?color+"55":C.border}`,borderRadius:8,padding:mobile?"11px 12px":"12px 14px",cursor:"pointer",transition:"all 0.15s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:mobile?5:7,marginBottom:4}}>
        <span style={{fontSize:mobile?13:15}}>{item.icon}</span>
        <span style={{color:C.text,fontWeight:700,fontSize:mobile?11:13,fontFamily:mono}}>{t(item.name,lang)}</span>
        {item.tag&&<span style={{fontSize:mobile?7:8,color,background:glow,padding:"2px 5px",borderRadius:3,fontFamily:mono,fontWeight:600,marginLeft:"auto",whiteSpace:"nowrap",border:`1px solid ${color}22`}}>{t(item.tag,lang)}</span>}
      </div>
      <div style={{color:C.textSub,fontSize:mobile?9.5:10.5,lineHeight:1.45,fontFamily:sans}}>{t(item.desc,lang)}</div>
      {expanded&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${color}22`}}>
        {(Array.isArray(item.details)?item.details:item.details[lang]).map((d,i)=>(
          <div key={i} style={{color:C.textSub,fontSize:mobile?9.5:10.5,lineHeight:1.6,paddingLeft:11,position:"relative",fontFamily:sans}}>
            <span style={{position:"absolute",left:0,color:color+"99",fontSize:7,top:3}}>▸</span>{d}
          </div>
        ))}
      </div>}
    </div>
  );
}

function Conn({label,color,lang}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"3px 0",gap:6}}>
      <div style={{height:1,width:28,background:`linear-gradient(90deg,transparent,${color}44)`}}/>
      <span style={{color:C.textDim,fontSize:8,fontFamily:mono,whiteSpace:"nowrap"}}>▲▼ {t(label,lang)}</span>
      <div style={{height:1,width:28,background:`linear-gradient(90deg,${color}44,transparent)`}}/>
    </div>
  );
}

/* ═══ Main View ═══ */
export default function Landscape({lang}){
  const w=useWidth();
  const mobile=w<640;
  const[exp,setExp]=useState(new Set());
  const toggle=k=>setExp(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});

  const cardCols=mobile?2:4;
  const specCols=mobile?3:6;
  const flowCols=mobile?1:3;
  const protoCols=mobile?2:3;

  return(
    <>
      {/* Spectrum */}
      <div style={{maxWidth:940,margin:mobile?"0 auto 12px":"0 auto 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
          <div style={{width:2,height:12,background:C.rose,borderRadius:1}}/>
          <span style={{fontFamily:mono,fontSize:mobile?9:11,fontWeight:700,color:C.rose}}>{t(i18n.specTitle,lang)}</span>
          <span style={{fontSize:mobile?8:10,color:C.textDim,marginLeft:3}}>{t(i18n.specSub,lang)}</span>
          <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.rose}22,transparent)`,marginLeft:6}}/>
        </div>
        <div style={{position:"relative",marginBottom:6}}>
          <div style={{height:3,borderRadius:2,overflow:"hidden",background:`linear-gradient(90deg,${C.textSub},${C.purple},${C.blue},${C.amber},${C.green},${C.cyan})`}}/>
          <div style={{position:"absolute",left:"45%",top:-1,bottom:-1,width:2,background:C.text,borderRadius:1,boxShadow:`0 0 6px ${C.text}`}}/>
          <div style={{position:"absolute",left:"45%",top:6,transform:"translateX(-50%)",background:C.amber,color:C.bg,fontSize:mobile?6:8,fontFamily:mono,fontWeight:700,padding:"1px 5px",borderRadius:3,whiteSpace:"nowrap"}}>{t(i18n.weAreHere,lang)}</div>
        </div>
        <div style={{height:mobile?10:14}}/>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${specCols},1fr)`,gap:mobile?4:6}}>
          {spectrum.map(s=>{
            const mk=s.marker;
            const mkL=mk==="mainstream"?t(i18n.mainstream,lang):mk==="frontier"?t(i18n.frontier,lang):null;
            const mkC=mk==="mainstream"?C.blue:mk==="frontier"?C.amber:null;
            return(<div key={s.l} style={{background:C.surface,border:`1px solid ${mk?s.color+"44":C.border}`,borderRadius:mobile?6:8,padding:mobile?"5px 6px":"8px 10px",borderTop:`${mk?3:2}px solid ${s.color}`,boxShadow:mk?`0 0 8px ${s.color}15`:"none"}}>
              <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:1}}>
                <span style={{fontFamily:mono,fontSize:mobile?7:10,fontWeight:700,color:s.color,opacity:0.6}}>{s.l}</span>
                <span style={{fontFamily:mono,fontSize:mobile?7.5:10,fontWeight:700,color:s.color}}>{t(s.name,lang)}</span>
                {mkL&&<span style={{fontSize:mobile?5:7,fontFamily:mono,fontWeight:700,color:C.bg,background:mkC,padding:"1px 4px",borderRadius:2,marginLeft:"auto",animation:"pulse 2s ease-in-out infinite"}}>{mkL}</span>}
              </div>
              {!mobile&&<div style={{fontSize:9,color:C.textDim,marginTop:2,fontStyle:"italic"}}>→ {t(s.shift,lang)}</div>}
            </div>);
          })}
        </div>
      </div>

      {/* Layers */}
      <div style={{maxWidth:940,margin:"0 auto"}}>
        {layers.map((layer,li)=>(
          <div key={layer.id}>
            {li>0&&<Conn label={connLabels[li-1]} color={layer.color} lang={lang}/>}
            <div style={{background:`linear-gradient(160deg,${layer.glow},transparent 50%)`,border:`1px solid ${layer.color}18`,borderRadius:mobile?8:10,padding:mobile?"10px 8px 12px":"14px 14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:mobile?8:12}}>
                <div style={{width:2,height:12,background:layer.color,borderRadius:1}}/>
                <span style={{fontFamily:mono,fontSize:mobile?10:12,fontWeight:700,color:layer.color}}>{t(layer.title,lang)}</span>
                <span style={{fontSize:mobile?8:10,color:C.textDim}}>{t(layer.sub,lang)}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${cardCols},1fr)`,gap:mobile?5:8}}>
                {layer.items.map(item=>{
                  const k=`${layer.id}-${t(item.name,lang)}`;
                  return <Card key={k} item={item} color={layer.color} glow={layer.glow} expanded={exp.has(k)} onToggle={()=>toggle(k)} mobile={mobile} lang={lang}/>;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross Flows */}
      <div style={{maxWidth:940,margin:mobile?"12px auto 0":"20px auto 0"}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:mobile?8:10,padding:mobile?"10px 12px":"14px 16px"}}>
          <div style={{fontFamily:mono,fontSize:mobile?9:11,fontWeight:700,color:C.textSub,marginBottom:mobile?7:10}}>{t(i18n.flowTitle,lang)}</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${flowCols},1fr)`,gap:mobile?8:14}}>
            {crossFlows.map(f=>(
              <div key={t(f.label,lang)} style={{borderLeft:`2px solid ${f.color}`,paddingLeft:9}}>
                <div style={{fontFamily:mono,fontSize:mobile?8.5:10,fontWeight:600,color:f.color,marginBottom:2}}>{t(f.label,lang)}</div>
                <div style={{color:C.textDim,fontSize:mobile?8.5:9.5,lineHeight:1.5}}>{t(f.path,lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Ref */}
      <div style={{maxWidth:940,margin:mobile?"8px auto 0":"12px auto 0"}}>
        <div style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:mobile?8:10,padding:mobile?"10px 12px":"14px 16px"}}>
          <div style={{fontFamily:mono,fontSize:mobile?9:11,fontWeight:700,color:C.textSub,marginBottom:mobile?7:10}}>{t(i18n.protoTitle,lang)}</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${protoCols},1fr)`,gap:mobile?"4px 8px":"6px 16px"}}>
            {protocols.map(p=>(
              <div key={p.p} style={{display:"flex",alignItems:"baseline",gap:4,padding:"2px 0"}}>
                <span style={{fontFamily:mono,fontSize:mobile?8.5:10,fontWeight:700,color:C.blue,minWidth:mobile?28:36}}>{p.p}</span>
                <span style={{fontSize:mobile?7.5:9.5,color:C.textDim}}>{p.by}</span>
                <span style={{fontSize:mobile?7.5:9.5,color:C.textSub,marginLeft:"auto",whiteSpace:"nowrap"}}>{t(p.r,lang)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
