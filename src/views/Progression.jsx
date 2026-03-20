import { useState, useEffect } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";

const i18n = {
  barLeft:{en:"👤 Human-driven",zh:"👤 人类驱动"},
  barRight:{en:"🌐 Agent-driven",zh:"🌐 Agent 驱动"},
  human:{en:"Human",zh:"人"},ai:{en:"AI",zh:"AI"},
  scenes:{en:"TYPICAL SCENARIOS",zh:"典型场景"},
  endpointsLabel:{en:"ENDPOINTS & PROTOCOLS",zh:"接入端 & 协议"},
  harnessLabel:{en:"HARNESS ROLE",zh:"HARNESS 角色"},
  keyShiftLabel:{en:"KEY SHIFT",zh:"关键跃迁"},
  weAreHere:{en:"WE ARE HERE",zh:"当前位置"},
  mainstream:{en:"MAINSTREAM",zh:"主流"},
  frontier:{en:"FRONTIER",zh:"前沿"},
  evoTitle:{en:"Evolution Pattern",zh:"演进规律"},
};

const stages = [
  {level:0,name:{en:"Manual",zh:"人工操作"},color:C.textSub,glow:"rgba(139,149,165,0.08)",icon:"👤",tagline:{en:"Humans write everything",zh:"人类编写一切"},human:100,agent:0,
    desc:{en:"Developers manually write code, run tests, deploy. AI only serves as a search engine or documentation reference.",zh:"开发者手动编写代码、运行测试、部署。AI 仅作为搜索引擎或文档查阅辅助。"},
    examples:{en:["Google + StackOverflow","Manual git commit / deploy","Manual code review"],zh:["Google + StackOverflow","手动 git commit / deploy","人工 code review"]},
    endpoints:{en:["Desktop"],zh:["Desktop"]},protocols:[],
    harnessRole:{en:"None",zh:"无"},keyShift:{en:"From memory-driven to pattern matching",zh:"从记忆驱动到模式匹配"}},
  {level:1,name:{en:"Assisted",zh:"工具辅助"},color:C.purple,glow:C.purpleGlow,icon:"💬",tagline:{en:"Human asks, AI answers",zh:"人问 AI 答"},human:80,agent:20,
    desc:{en:"Conversational AI provides suggestions. Humans copy-paste results. Single request-response, no persistent state.",zh:"对话式 AI 提供建议，人类复制粘贴结果。单次请求-响应，无持久状态。"},
    examples:{en:["ChatGPT / Claude conversations","Copilot single-line completion","AI explaining error messages"],zh:["ChatGPT / Claude 对话","Copilot 单行补全","AI 解释报错信息"]},
    endpoints:{en:["Web / Desktop"],zh:["Web / Desktop"]},protocols:["MCP"],
    harnessRole:{en:"Not needed — stateless single interactions",zh:"无需 — 单次交互无状态"},keyShift:{en:"From searching answers to generating answers",zh:"从搜索答案到生成答案"}},
  {level:2,name:{en:"Collaborative",zh:"人机协作"},color:C.blue,glow:C.blueGlow,icon:"🤝",tagline:{en:"Human leads + AI assists in real-time",zh:"人类主导 + AI 实时辅助"},human:55,agent:45,marker:"mainstream",
    desc:{en:"AI embedded in editor, context-aware in real-time. Humans retain control, AI offers multi-line suggestions, refactoring plans, inline docs.",zh:"AI 嵌入编辑器，实时理解上下文。人类保持控制权，AI 提供多行建议、重构方案、内联文档。"},
    examples:{en:["Cursor Tab multi-line completion","Copilot inline suggestions","AI-driven code review suggestions"],zh:["Cursor Tab 多行补全","Copilot inline suggestions","AI 驱动的 code review 建议"]},
    endpoints:{en:["IDE / Desktop","Terminal"],zh:["IDE / Desktop","Terminal"]},protocols:["ACP","MCP"],
    harnessRole:{en:"Lightweight — Capability layer manages available Skills/Tools",zh:"轻量 — Capability 层管理可用 Skill/Tool"},keyShift:{en:"From writing code to reviewing changes",zh:"从手动编写到审查修改"}},
  {level:3,name:{en:"Semi-Autonomous",zh:"半自动"},color:C.amber,glow:C.amberGlow,icon:"🔄",tagline:{en:"Agent plans & executes, human approves key points",zh:"Agent 规划执行，人类审批关键节点"},human:25,agent:75,marker:"frontier",
    desc:{en:"Agent receives high-level intent, autonomously plans multi-step actions. Humans intervene at critical decision points.",zh:"Agent 接收高层意图后自主规划多步骤方案，执行文件编辑、测试运行、Git 操作。人类在关键决策点介入审批。"},
    examples:{en:["Claude Code standard mode","Aider multi-file refactoring","Devin task execution + Review"],zh:["Claude Code 标准模式","Aider 多文件重构","Devin 任务执行 + Review"]},
    endpoints:{en:["Terminal (TUI)","IDE","Mobile (approval)"],zh:["Terminal (TUI)","IDE","Mobile (审批)"]},protocols:["ACP","MCP","AG-UI","A2UI"],
    harnessRole:{en:"Core — Governance intercept + Approval Gate + Runtime state machine",zh:"核心 — Governance 拦截 + Approval Gate + Runtime 状态机"},keyShift:{en:"From writing code to describing intent",zh:"从编写代码到描述意图"}},
  {level:4,name:{en:"Fully Automatic",zh:"全自动"},color:C.green,glow:C.greenGlow,icon:"⚡",tagline:{en:"Agent runs autonomously, notifies human only on exceptions",zh:"Agent 自主闭环，异常才通知人类"},human:5,agent:95,
    desc:{en:"Agent runs 24/7 in cloud containers. Only hands off to humans when budget or safety boundaries are exceeded.",zh:"Agent 在云容器中 24/7 运行。仅在超出预算或安全边界时 handoff 人类。"},
    examples:{en:["Headless CI agent auto-fixing tests","Cron code quality scan + repair","Webhook-triggered auto PRs"],zh:["Headless CI agent 自动修 test","Cron 代码质量扫描+修复","Webhook 触发的自动 PR"]},
    endpoints:{en:["Headless / API","Mobile (notifications)"],zh:["Headless / API","Mobile (通知)"]},protocols:["ACP","MCP","AG-UI","A2A"],
    harnessRole:{en:"Full — Governance auto-adjudication + Rule Crystallization tightening boundaries",zh:"完整 — Governance 自动裁决 + Rule Crystallization 持续收紧边界"},keyShift:{en:"From approving every step to setting boundaries",zh:"从审批每一步到设定边界"}},
  {level:5,name:{en:"Autonomous Orchestration",zh:"自主编排"},color:C.cyan,glow:C.cyanGlow,icon:"🌐",tagline:{en:"Multi-agent self-organizing, humans define goals & constraints",zh:"多 Agent 自组织协作，人类定义目标和约束"},human:2,agent:98,
    desc:{en:"Multiple specialized agents discover, negotiate, and team up via A2A. Humans only define high-level goals and Governance rules.",zh:"多个专业 Agent 通过 A2A 自主发现、协商、组队。人类只定义高层目标和 Governance 规则。"},
    examples:{en:["Agent mesh: arch + coding + testing agents self-teaming","Cross-org agent collaboration (A2A mesh)","Self-evolving Skill system (skill-evolver loop)"],zh:["Agent mesh: 架构+编码+测试 agent 自组队","跨组织 agent 协作 (A2A mesh)","自进化 Skill 系统 (skill-evolver 闭环)"]},
    endpoints:{en:["All: Mobile→Desktop→Headless adaptive"],zh:["全端: Mobile→Desktop→Headless 自适应"]},protocols:["ACP","MCP","A2A","A2UI","AG-UI","AP2"],
    harnessRole:{en:"Full Harness — Runtime + Capability + Governance + Coordination all active",zh:"完整 Harness — Runtime+Capability+Governance+Coordination 四层全启"},keyShift:{en:"From defining workflows to defining goals",zh:"从定义流程到定义目标"}},
];

const evoItems = [
  {label:{en:"Human role migration",zh:"人类角色迁移"},color:C.amber,text:{en:"Write code → Review changes → Describe intent → Set boundaries → Define goals",zh:"编写代码 → 审查修改 → 描述意图 → 设定边界 → 定义目标"}},
  {label:{en:"Harness weight grows",zh:"Harness 权重递增"},color:C.green,text:{en:"None → Capability → +Governance → +Runtime → +Coordination (all four)",zh:"无 → Capability → +Governance → +Runtime → +Coordination 四层全启"}},
  {label:{en:"Protocol stack expands",zh:"协议栈渐进启用"},color:C.blue,text:{en:"MCP → +ACP → +AG-UI/A2UI → +A2A → full protocol mesh",zh:"MCP → +ACP → +AG-UI/A2UI → +A2A → 全协议互联"}},
];

function ProgressBar({human,agent,color,lang,mobile}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:mobile?5:8,marginTop:8}}>
      <span style={{fontSize:mobile?8:9,color:C.textDim,fontFamily:mono,minWidth:mobile?24:28}}>{t(i18n.human,lang)} {human}%</span>
      <div style={{flex:1,height:6,background:C.border,borderRadius:3,overflow:"hidden",display:"flex"}}>
        <div style={{width:`${human}%`,height:"100%",background:`linear-gradient(90deg,${C.textDim},${C.textSub})`,transition:"width 0.6s ease"}}/>
        <div style={{width:`${agent}%`,height:"100%",background:`linear-gradient(90deg,${color}88,${color})`,transition:"width 0.6s ease"}}/>
      </div>
      <span style={{fontSize:mobile?8:9,color,fontFamily:mono,minWidth:mobile?24:28,textAlign:"right"}}>{t(i18n.ai,lang)} {agent}%</span>
    </div>
  );
}

function StageCard({stage,expanded,onToggle,animDelay,lang,mobile}){
  const[vis,setVis]=useState(false);
  useEffect(()=>{const tm=setTimeout(()=>setVis(true),animDelay);return()=>clearTimeout(tm);},[animDelay]);
  const mk=stage.marker;
  const mkLabel=mk==="mainstream"?t(i18n.mainstream,lang):mk==="frontier"?t(i18n.frontier,lang):null;
  const mkColor=mk==="mainstream"?C.blue:mk==="frontier"?C.amber:null;
  const isCur=!!mk;

  return(
    <div onClick={onToggle} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(12px)",transition:"all 0.4s ease",background:expanded?`linear-gradient(135deg,${stage.glow},${C.surface})`:C.surface,border:`1px solid ${isCur&&!expanded?stage.color+"44":expanded?stage.color+"55":C.border}`,borderRadius:10,padding:mobile?"12px 14px":"16px 18px",cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:isCur?`0 0 12px ${stage.color}15`:"none"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:isCur?3:2,background:`linear-gradient(90deg,${stage.color},${isCur?stage.color+"88":"transparent"})`}}/>
      <div style={{display:"flex",alignItems:"center",gap:mobile?8:10,marginBottom:8}}>
        <span style={{fontSize:mobile?18:22}}>{stage.icon}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:mobile?5:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:mono,fontSize:mobile?9:11,fontWeight:700,color:stage.color,opacity:0.5}}>L{stage.level}</span>
            <span style={{fontFamily:mono,fontSize:mobile?13:15,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>{t(stage.name,lang)}</span>
            {mkLabel&&<span style={{fontSize:mobile?7:8,fontFamily:mono,fontWeight:700,color:C.bg,background:mkColor,padding:"2px 6px",borderRadius:3,animation:"pulse 2s ease-in-out infinite"}}>{mkLabel}</span>}
          </div>
          <div style={{fontSize:mobile?10:11,color:stage.color,marginTop:2,fontWeight:500}}>{t(stage.tagline,lang)}</div>
        </div>
        <div style={{fontSize:10,color:C.textDim,fontFamily:mono,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s ease"}}>▼</div>
      </div>
      <ProgressBar human={stage.human} agent={stage.agent} color={stage.color} lang={lang} mobile={mobile}/>
      <p style={{fontSize:mobile?10.5:11.5,color:C.textSub,lineHeight:1.6,margin:"10px 0 0",fontFamily:sans}}>{t(stage.desc,lang)}</p>
      {expanded&&(
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${stage.color}22`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?"12px":"14px 20px"}}>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:stage.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t(i18n.scenes,lang)}</div>
            {t(stage.examples,lang).map((e,i)=>(<div key={i} style={{fontSize:mobile?10:10.5,color:C.textSub,lineHeight:1.7,paddingLeft:10,position:"relative"}}><span style={{position:"absolute",left:0,color:stage.color+"88",fontSize:8,top:3}}>▸</span>{e}</div>))}
          </div>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:stage.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t(i18n.endpointsLabel,lang)}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{t(stage.endpoints,lang).map((ep,i)=><Tag key={i} color={C.cyan} mobile={mobile}>{ep}</Tag>)}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>{stage.protocols.map((p,i)=><Tag key={i} color={C.blue} mobile={mobile}>{p}</Tag>)}</div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:stage.color,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t(i18n.harnessLabel,lang)}</div>
            <div style={{fontSize:mobile?10:10.5,color:C.textSub,lineHeight:1.6}}>{t(stage.harnessRole,lang)}</div>
          </div>
          <div style={{gridColumn:"1 / -1",marginTop:4}}>
            <div style={{background:stage.glow,border:`1px solid ${stage.color}22`,borderRadius:6,padding:"8px 12px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:mobile?8:9,fontFamily:mono,color:stage.color,fontWeight:700,whiteSpace:"nowrap"}}>{t(i18n.keyShiftLabel,lang)}</span>
              <span style={{fontSize:mobile?10:11,color:C.text,fontWeight:500}}>{t(stage.keyShift,lang)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConnArrow({fromColor,toColor}){
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"2px 0"}}><div style={{width:1,height:20,background:`linear-gradient(180deg,${fromColor}66,${toColor}66)`}}/><div style={{width:0,height:0,borderLeft:"4px solid transparent",borderRight:"4px solid transparent",borderTop:`5px solid ${toColor}66`}}/></div>);
}

/* ═══ Main View ═══ */
export default function Progression({lang}){
  const w=useWidth();
  const mobile=w<640;
  const[expanded,setExpanded]=useState(new Set([3]));
  const toggle=k=>setExpanded(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});

  return(
    <>
      {/* Gradient bar */}
      <div style={{maxWidth:720,margin:mobile?"0 auto 16px":"0 auto 24px"}}>
        <div style={{position:"relative"}}>
          <div style={{height:4,borderRadius:2,overflow:"hidden",background:`linear-gradient(90deg,${C.textSub},${C.purple},${C.blue},${C.amber},${C.green},${C.cyan})`}}/>
          <div style={{position:"absolute",left:"45%",top:-1,bottom:-1,width:2,background:C.text,borderRadius:1,boxShadow:`0 0 6px ${C.text}`}}/>
          <div style={{position:"absolute",left:"45%",top:6,transform:"translateX(-50%)",background:C.amber,color:C.bg,fontSize:mobile?6:8,fontFamily:mono,fontWeight:700,padding:"1px 5px",borderRadius:3,whiteSpace:"nowrap"}}>{t(i18n.weAreHere,lang)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:mobile?14:16}}>
          <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim}}>{t(i18n.barLeft,lang)}</span>
          <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.cyan}}>{t(i18n.barRight,lang)}</span>
        </div>
      </div>

      {/* Stages */}
      <div style={{maxWidth:720,margin:"0 auto"}}>
        {stages.map((stage,i)=>(
          <div key={stage.level}>
            {i>0&&<ConnArrow fromColor={stages[i-1].color} toColor={stage.color}/>}
            <StageCard stage={stage} expanded={expanded.has(stage.level)} onToggle={()=>toggle(stage.level)} animDelay={i*80} lang={lang} mobile={mobile}/>
          </div>
        ))}
      </div>

      {/* Evolution */}
      <div style={{maxWidth:720,margin:mobile?"16px auto 0":"24px auto 0"}}>
        <div style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:mobile?"12px 14px":"16px 18px"}}>
          <div style={{fontFamily:mono,fontSize:mobile?10:11,fontWeight:700,color:C.textSub,marginBottom:mobile?10:12}}>{t(i18n.evoTitle,lang)}</div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:mobile?10:14}}>
            {evoItems.map(s=>(<div key={t(s.label,lang)} style={{borderLeft:`2px solid ${s.color}`,paddingLeft:10}}><div style={{fontFamily:mono,fontSize:mobile?9:10,fontWeight:600,color:s.color,marginBottom:4}}>{t(s.label,lang)}</div><div style={{fontSize:mobile?9.5:10,color:C.textDim,lineHeight:1.6}}>{t(s.text,lang)}</div></div>))}
          </div>
        </div>
      </div>
    </>
  );
}
