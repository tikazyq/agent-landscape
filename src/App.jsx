import { useState } from "react";
import { C, mono, sans, useWidth, LangToggle, ShareButton, t } from "./shared";
import Landscape from "./views/Landscape";
import Progression from "./views/Progression";
import Examples from "./views/Examples";
import DayInLife from "./views/DayInLife";
import ToolEcosystem from "./views/ToolEcosystem";
import Insights from "./views/Insights";
import Inversion from "./views/Inversion";
import Predictions from "./views/Predictions";
import Security from "./views/Security";
import Assessment from "./views/Assessment";

const modes = [
  { id:"what", label:{en:"📊 WHAT",zh:"📊 现状"}, color:C.blue },
  { id:"why",  label:{en:"💡 WHY",zh:"💡 观点"}, color:C.amber },
];

const whatTabs = [
  { id:"landscape",  label:{en:"Landscape",zh:"全景"},     icon:"🗺️" },
  { id:"progression", label:{en:"Progression",zh:"递进"},  icon:"📈" },
  { id:"examples",   label:{en:"Examples",zh:"示例"},      icon:"🎯" },
  { id:"dayinlife",  label:{en:"Day in Life",zh:"日常"},   icon:"🌅" },
  { id:"tools",      label:{en:"Tools",zh:"工具"},         icon:"🧰" },
  { id:"assessment", label:{en:"Assessment",zh:"自评/指南"},  icon:"📋" },
];

const whyTabs = [
  { id:"insights",    label:{en:"Insights",zh:"观点"},      icon:"🔮" },
  { id:"inversion",   label:{en:"Inversion",zh:"反转"},     icon:"⚖️" },
  { id:"predictions", label:{en:"Predictions",zh:"预测/追踪"}, icon:"🔭" },
  { id:"security",    label:{en:"Security",zh:"安全"},       icon:"🔒" },
];

const titles = {
  landscape:  {en:"AI Agent Interaction Landscape",zh:"AI Agent 交互全景"},
  progression:{en:"AI Automation Progression",zh:"AI 自动化递进"},
  examples:   {en:"Workflow Examples by Stage",zh:"各阶段实战工作流"},
  dayinlife:  {en:"A Developer's Day",zh:"开发者的一天"},
  tools:      {en:"Tool & Protocol Ecosystem",zh:"工具 & 协议生态"},
  insights:   {en:"Key Insights",zh:"核心观点"},
  inversion:  {en:"The Great Inversion",zh:"大反转"},
  predictions:{en:"Predictions & Tracker",zh:"预测与追踪"},
  security:   {en:"Security & Governance",zh:"安全与治理"},
  assessment: {en:"Assessment & Guide",zh:"自评与指南"},
};

const subtitles = {
  landscape:  {en:"Protocol stack · Multi-platform · Agent systems — tap to expand",zh:"协议栈 · 多端交互 · Agent 系统全景 — 点击展开"},
  progression:{en:"Six stages from manual to autonomous orchestration",zh:"从人工到自主编排的六个阶段"},
  examples:   {en:"Same bug, six automation levels — see the transformation",zh:"同一个 Bug，六种自动化级别 — 看工作流演变"},
  dayinlife:  {en:"One developer, one day, four devices, four automation levels",zh:"一个开发者，一天，四种设备，四种自动化级别"},
  tools:      {en:"Tools and products mapped to protocols and levels",zh:"工具按协议和自动化级别分类"},
  insights:   {en:"Sharp observations from the AI agent landscape — tap to expand",zh:"关于 AI Agent 生态的尖锐观察 — 点击展开"},
  inversion:  {en:"Less time, more leverage — the automation paradox",zh:"时间更短，杠杆更大 — 自动化悖论"},
  predictions:{en:"12 predictions with tracking, evidence, and updated confidence",zh:"12 项预测及追踪：证据、事件与更新后的确信度"},
  security:   {en:"Threat vectors, trust chains, and defense patterns for autonomous agents",zh:"自主 Agent 的威胁向量、信任链和防御模式 — 点击展开"},
  assessment: {en:"Self-assessment quiz + personalized setup recommendation",zh:"自评测试 + 个性化配置推荐"},
};

const footer = {
  en:"L0 Manual → L5 Autonomous Orchestration — Mar 2026",
  zh:"L0 人工 → L5 自主编排 — 2026.3",
};

const viewMap = {
  landscape:  Landscape,
  progression:Progression,
  examples:   Examples,
  dayinlife:  DayInLife,
  tools:      ToolEcosystem,
  insights:   Insights,
  inversion:  Inversion,
  predictions:Predictions,
  security:   Security,
  assessment: Assessment,
};

export default function App() {
  const [lang, setLang] = useState("zh");
  const [mode, setMode] = useState("what");
  const [whatTab, setWhatTab] = useState("landscape");
  const [whyTab, setWhyTab] = useState("insights");
  const w = useWidth();
  const mobile = w < 640;

  const tabs = mode === "what" ? whatTabs : whyTabs;
  const tab = mode === "what" ? whatTab : whyTab;
  const setTab = mode === "what" ? setWhatTab : setWhyTab;
  const modeColor = mode === "what" ? C.blue : C.amber;

  const View = viewMap[tab];

  return (
    <div style={{
      background:C.bg, minHeight:"100vh",
      padding:mobile?"16px 10px":"28px 16px",
      fontFamily:sans, color:C.text,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>

      <div style={{maxWidth:940,margin:mobile?"0 auto 12px":"0 auto 20px",textAlign:"center"}}>
        {/* Row 1: Lang + Mode */}
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"center",
          gap:mobile?8:12, marginBottom:mobile?8:12, flexWrap:"wrap",
        }}>
          <LangToggle lang={lang} setLang={setLang}/>
          <ShareButton lang={lang} mobile={mobile} title={t(titles[tab],lang)} subtitle={t(subtitles[tab],lang)}/>
          <div style={{
            display:"inline-flex",background:C.surface,
            border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",
          }}>
            {modes.map(m=>(
              <button key={m.id} onClick={()=>setMode(m.id)} style={{
                background:mode===m.id?m.color+"22":"transparent",
                color:mode===m.id?m.color:C.textDim,
                border:"none",padding:mobile?"5px 12px":"6px 18px",
                cursor:"pointer",fontFamily:mono,
                fontSize:mobile?10:12,fontWeight:mode===m.id?700:400,
                transition:"all 0.15s ease",
              }}>{t(m.label,lang)}</button>
            ))}
          </div>
        </div>

        {/* Row 2: Sub-tabs */}
        <div style={{
          display:"inline-flex",background:C.surface,
          border:`1px solid ${modeColor}22`,borderRadius:20,
          overflow:"hidden",flexWrap:"wrap",justifyContent:"center",
          marginBottom:mobile?10:14,
        }}>
          {tabs.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
              background:tab===tb.id?modeColor+"22":"transparent",
              color:tab===tb.id?modeColor:C.textDim,
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

        {/* Title */}
        <h1 style={{
          fontSize:mobile?15:22,fontWeight:700,fontFamily:mono,
          margin:0,letterSpacing:"-0.03em",
        }}>
          {t(titles[tab],lang)}
        </h1>
        <p style={{color:C.textDim,fontSize:mobile?9.5:12,marginTop:mobile?3:6}}>
          {t(subtitles[tab],lang)}
        </p>
      </div>

      {/* Content */}
      {View && <View lang={lang}/>}

      {/* Footer */}
      <div style={{maxWidth:940,margin:mobile?"12px auto 0":"20px auto 0",textAlign:"center"}}>
        <p style={{color:C.textDim,fontSize:mobile?7:9,fontFamily:mono}}>{t(footer,lang)}</p>
      </div>
    </div>
  );
}
