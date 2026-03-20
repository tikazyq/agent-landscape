import { useState } from "react";
import { C, mono, sans, useWidth, LangToggle, t } from "./shared";
import Landscape from "./views/Landscape";
import Progression from "./views/Progression";
import Examples from "./views/Examples";
import DayInLife from "./views/DayInLife";
import ToolEcosystem from "./views/ToolEcosystem";

const tabs = [
  { id:"landscape", label:{en:"Landscape",zh:"交互全景"}, icon:"🗺️" },
  { id:"progression", label:{en:"Progression",zh:"自动化递进"}, icon:"📈" },
  { id:"examples", label:{en:"Examples",zh:"实战示例"}, icon:"🎯" },
  { id:"dayinlife", label:{en:"Day in Life",zh:"开发者日常"}, icon:"🌅" },
  { id:"tools", label:{en:"Tools",zh:"工具生态"}, icon:"🧰" },
];

const titles = {
  landscape:{en:"AI Agent Interaction Landscape",zh:"AI Agent 交互全景"},
  progression:{en:"AI Automation Progression",zh:"AI 自动化递进"},
  examples:{en:"Workflow Examples by Stage",zh:"各阶段实战工作流"},
  dayinlife:{en:"A Developer's Day",zh:"开发者的一天"},
  tools:{en:"Tool & Protocol Ecosystem",zh:"工具 & 协议生态"},
};

const subtitles = {
  landscape:{en:"Protocol Stack · Multi-Platform · Agent Systems — tap cards to expand",zh:"协议栈 · 多端交互 · Agent 系统全景 — 点击卡片展开"},
  progression:{en:"Six stages from manual to autonomous orchestration — tap to expand",zh:"从人工到自主编排的六个阶段 — 点击展开详情"},
  examples:{en:"Same bug, six automation levels — see how the workflow transforms",zh:"同一个 Bug，六种自动化级别 — 看工作流如何演变"},
  dayinlife:{en:"One developer, one day, four devices, four automation levels",zh:"一个开发者，一天，四种设备，四种自动化级别"},
  tools:{en:"Tools and products mapped to protocols and automation levels",zh:"工具与产品按协议和自动化级别分类"},
};

const footer = {
  en:"L0 Manual → L1 Assisted → L2 Collaborative → L3 Semi-Auto → L4 Full-Auto → L5 Autonomous Orchestration — Mar 2026",
  zh:"L0 人工 → L1 辅助 → L2 协作 → L3 半自动 → L4 全自动 → L5 自主编排 — 2026.3",
};

export default function App(){
  const[lang,setLang]=useState("zh");
  const[tab,setTab]=useState("landscape");
  const w=useWidth();
  const mobile=w<640;

  return(
    <div style={{background:C.bg,minHeight:"100vh",padding:mobile?"16px 10px":"28px 16px",fontFamily:sans,color:C.text}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>

      <div style={{maxWidth:940,margin:mobile?"0 auto 14px":"0 auto 24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:mobile?6:12,marginBottom:mobile?10:16,flexWrap:"wrap"}}>
          <LangToggle lang={lang} setLang={setLang}/>
          <div style={{display:"inline-flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",flexWrap:"wrap",justifyContent:"center"}}>
            {tabs.map(tb=>(
              <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
                background:tab===tb.id?C.blue+"22":"transparent",
                color:tab===tb.id?C.blue:C.textDim,
                border:"none",padding:mobile?"5px 8px":"5px 14px",
                cursor:"pointer",fontFamily:mono,fontSize:mobile?9:11,
                fontWeight:tab===tb.id?700:400,transition:"all 0.15s ease",
                display:"flex",alignItems:"center",gap:3,whiteSpace:"nowrap",
              }}>
                <span style={{fontSize:mobile?10:13}}>{tb.icon}</span>
                {(!mobile||tab===tb.id)&&<span>{t(tb.label,lang)}</span>}
              </button>
            ))}
          </div>
        </div>

        <h1 style={{fontSize:mobile?16:22,fontWeight:700,fontFamily:mono,margin:0,letterSpacing:"-0.03em"}}>
          {t(titles[tab],lang)}
        </h1>
        <p style={{color:C.textDim,fontSize:mobile?9.5:12,marginTop:mobile?3:6}}>
          {t(subtitles[tab],lang)}
        </p>
      </div>

      {tab==="landscape"&&<Landscape lang={lang}/>}
      {tab==="progression"&&<Progression lang={lang}/>}
      {tab==="examples"&&<Examples lang={lang}/>}
      {tab==="dayinlife"&&<DayInLife lang={lang}/>}
      {tab==="tools"&&<ToolEcosystem lang={lang}/>}

      <div style={{maxWidth:940,margin:mobile?"12px auto 0":"20px auto 0",textAlign:"center"}}>
        <p style={{color:C.textDim,fontSize:mobile?7:9,fontFamily:mono}}>{t(footer,lang)}</p>
      </div>
    </div>
  );
}
