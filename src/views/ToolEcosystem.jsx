import { useState } from "react";
import { C, mono, sans, useWidth, t } from "../shared";

const i18n = {
  filterByLevel:{en:"Filter by automation level",zh:"按自动化级别筛选"},
  all:{en:"All",zh:"全部"},
  protocols:{en:"Protocols",zh:"协议"},
  levels:{en:"Levels",zh:"级别"},
  type:{en:"Type",zh:"类型"},
  legend:{en:"Supported protocols shown as colored dots. Automation levels show where each tool operates.",zh:"彩色圆点表示支持的协议。自动化级别表示每个工具的工作范围。"},
};

const protocolColors = {
  MCP:C.green, ACP:C.blue, "A2A":C.cyan, "A2UI":C.amber, "AG-UI":C.purple, "AP2":C.rose,
};

const typeColors = {
  "CLI Agent":C.amber,
  "IDE":C.blue,
  "Mobile":C.cyan,
  "Framework":C.purple,
  "Protocol":C.green,
  "Platform":C.rose,
};

const tools = [
  {name:"Claude Code",by:"Anthropic",icon:"⌨️",type:"CLI Agent",
    desc:{en:"Terminal-based AI coding agent with 1M token context",zh:"基于终端的 AI 编码 agent，100万 token 上下文"},
    protocols:["MCP","ACP"],levels:[2,3,4,5],highlight:true},
  {name:"Gemini CLI",by:"Google",icon:"⌨️",type:"CLI Agent",
    desc:{en:"Google's terminal agent with Plan Mode and Conductor",zh:"Google 终端 agent，支持 Plan Mode 和 Conductor"},
    protocols:["MCP","ACP"],levels:[2,3,4]},
  {name:"Codex CLI",by:"OpenAI",icon:"⌨️",type:"CLI Agent",
    desc:{en:"OpenAI's terminal coding agent",zh:"OpenAI 终端编码 agent"},
    protocols:["MCP","ACP"],levels:[2,3,4]},
  {name:"Aider",by:"Open Source",icon:"⌨️",type:"CLI Agent",
    desc:{en:"Open-source AI pair programming in terminal",zh:"开源终端 AI 结对编程"},
    protocols:["MCP"],levels:[2,3]},
  {name:"OpenCode",by:"Open Source",icon:"⌨️",type:"CLI Agent",
    desc:{en:"Open-source ACP-compatible terminal agent",zh:"开源 ACP 兼容终端 agent"},
    protocols:["MCP","ACP"],levels:[2,3]},
  {name:"Cursor",by:"Cursor Inc",icon:"🖥️",type:"IDE",
    desc:{en:"AI-native IDE with Tab completion and agent mode",zh:"AI 原生 IDE，支持 Tab 补全和 agent 模式"},
    protocols:["MCP"],levels:[2,3]},
  {name:"Windsurf",by:"Codeium",icon:"🖥️",type:"IDE",
    desc:{en:"AI-native IDE with Cascade multi-file editing",zh:"AI 原生 IDE，支持 Cascade 多文件编辑"},
    protocols:["MCP"],levels:[2,3]},
  {name:"JetBrains AI",by:"JetBrains",icon:"🖥️",type:"IDE",
    desc:{en:"AI integration with ACP Agent Registry for all JetBrains IDEs",zh:"通过 ACP Agent Registry 为所有 JetBrains IDE 提供 AI 集成"},
    protocols:["MCP","ACP"],levels:[2,3]},
  {name:"Zed",by:"Zed Industries",icon:"🖥️",type:"IDE",
    desc:{en:"High-performance editor with native ACP support",zh:"高性能编辑器，原生 ACP 支持"},
    protocols:["MCP","ACP"],levels:[2,3]},
  {name:"GitHub Copilot",by:"GitHub/MS",icon:"🖥️",type:"IDE",
    desc:{en:"Inline AI suggestions + Copilot CLI with ACP",zh:"内联 AI 建议 + Copilot CLI 支持 ACP"},
    protocols:["MCP","ACP"],levels:[1,2,3]},
  {name:"Claude Code RC",by:"Anthropic",icon:"📱",type:"Mobile",
    desc:{en:"Remote Control — continue terminal sessions from phone",zh:"Remote Control — 从手机继续终端会话"},
    protocols:["AG-UI","A2UI"],levels:[3,4]},
  {name:"Pocket Agent",by:"Community",icon:"📱",type:"Mobile",
    desc:{en:"Mobile OS for AI agents — WebSocket bridge to local machine",zh:"AI Agent 移动操作系统 — WebSocket 桥接本地机器"},
    protocols:["AG-UI"],levels:[3,4]},
  {name:"Moshi",by:"Community",icon:"📱",type:"Mobile",
    desc:{en:"Mobile terminal for AI agents via Mosh protocol",zh:"通过 Mosh 协议连接 AI agent 的移动终端"},
    protocols:[],levels:[3,4]},
  {name:"CopilotKit",by:"CopilotKit",icon:"🔧",type:"Framework",
    desc:{en:"AG-UI protocol creator — full-stack agentic app framework",zh:"AG-UI 协议创建者 — 全栈 agentic 应用框架"},
    protocols:["AG-UI","A2UI","MCP"],levels:[2,3,4,5]},
  {name:"Google ADK",by:"Google",icon:"🔧",type:"Framework",
    desc:{en:"Agent Development Kit with A2A + A2UI integration",zh:"Agent 开发套件，集成 A2A + A2UI"},
    protocols:["A2A","A2UI","MCP"],levels:[3,4,5]},
  {name:"LangGraph",by:"LangChain",icon:"🔧",type:"Framework",
    desc:{en:"Stateful agent orchestration with AG-UI support",zh:"有状态 agent 编排，支持 AG-UI"},
    protocols:["AG-UI","MCP"],levels:[3,4,5]},
  {name:"BeeAI",by:"IBM/LF",icon:"🌐",type:"Platform",
    desc:{en:"Open-source agent orchestration platform (ACP→A2A migration)",zh:"开源 agent 编排平台 (ACP→A2A 迁移中)"},
    protocols:["A2A","MCP"],levels:[4,5]},
];

function ProtocolDot({proto, mobile}) {
  const c = protocolColors[proto] || C.textDim;
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:3,marginRight:mobile?6:8}} title={proto}>
      <div style={{width:mobile?6:7,height:mobile?6:7,borderRadius:"50%",background:c,boxShadow:`0 0 4px ${c}44`}}/>
      <span style={{fontSize:mobile?7:8,fontFamily:mono,color:c}}>{proto}</span>
    </div>
  );
}

function LevelDot({level, mobile}) {
  const colors = [C.textSub, C.purple, C.blue, C.amber, C.green, C.cyan];
  const c = colors[level];
  return (
    <span style={{
      fontSize:mobile?7:8, fontFamily:mono, fontWeight:600,
      color:c, background:c+"18", padding:"1px 4px", borderRadius:2,
      border:`1px solid ${c}22`,
    }}>L{level}</span>
  );
}

function ToolCard({tool, lang, mobile}) {
  const [open, setOpen] = useState(false);
  const tc = typeColors[tool.type] || C.textDim;
  return (
    <div onClick={()=>setOpen(!open)} style={{
      background: open ? C.surfaceAlt : C.surface,
      border:`1px solid ${open ? tc+"44" : C.border}`,
      borderRadius:8, padding:mobile?"10px 11px":"12px 14px",
      cursor:"pointer", transition:"all 0.15s ease",
      borderLeft:`3px solid ${tc}`,
    }}>
      <div style={{display:"flex",alignItems:"center",gap:mobile?6:8,marginBottom:4}}>
        <span style={{fontSize:mobile?14:16}}>{tool.icon}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontFamily:mono,fontSize:mobile?11:13,fontWeight:700,color:C.text}}>{tool.name}</span>
            {tool.highlight && <span style={{fontSize:mobile?6:7,fontFamily:mono,fontWeight:700,color:C.bg,background:C.amber,padding:"1px 4px",borderRadius:2}}>★</span>}
          </div>
          <span style={{fontSize:mobile?8:9,color:C.textDim}}>{tool.by}</span>
        </div>
        <span style={{fontSize:mobile?7:8,color:tc,background:tc+"15",padding:"2px 6px",borderRadius:3,fontFamily:mono,fontWeight:600,border:`1px solid ${tc}22`,whiteSpace:"nowrap"}}>{tool.type}</span>
      </div>

      <div style={{fontSize:mobile?9.5:10.5,color:C.textSub,lineHeight:1.45,marginBottom:6}}>{t(tool.desc,lang)}</div>

      <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:mobile?2:4}}>
        {tool.protocols.map(p => <ProtocolDot key={p} proto={p} mobile={mobile}/>)}
        <span style={{width:1,height:10,background:C.border,margin:mobile?"0 3px":"0 6px"}}/>
        {tool.levels.map(l => <LevelDot key={l} level={l} mobile={mobile}/>)}
      </div>

      {open && (
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",flexWrap:"wrap",gap:6}}>
          <div>
            <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim}}>{t(i18n.protocols,lang)}: </span>
            {tool.protocols.length > 0 ? tool.protocols.join(", ") : "—"}
          </div>
          <div>
            <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim}}>{t(i18n.levels,lang)}: </span>
            {tool.levels.map(l=>`L${l}`).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolEcosystem({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? tools : tools.filter(t => t.levels.includes(parseInt(filter)));

  const types = [...new Set(tools.map(t => t.type))];

  return (
    <>
      {/* Legend */}
      <div style={{maxWidth:800,margin:mobile?"0 auto 12px":"0 auto 16px",textAlign:"center"}}>
        <div style={{fontSize:mobile?9:10,color:C.textDim,lineHeight:1.5,marginBottom:mobile?8:12}}>{t(i18n.legend,lang)}</div>
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:mobile?8:14}}>
          {Object.entries(protocolColors).map(([p,c]) => (
            <div key={p} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:mobile?8:9,fontFamily:mono,color:c}}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div style={{maxWidth:800,margin:mobile?"0 auto 12px":"0 auto 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap"}}>
          <span style={{fontSize:mobile?9:10,color:C.textDim,fontFamily:mono,marginRight:4}}>{t(i18n.filterByLevel,lang)}:</span>
          {["all",0,1,2,3,4,5].map(v => {
            const colors = [C.textSub,C.textSub,C.purple,C.blue,C.amber,C.green,C.cyan];
            const c = v === "all" ? C.textSub : colors[v+1];
            const label = v === "all" ? t(i18n.all,lang) : `L${v}`;
            return (
              <button key={v} onClick={()=>setFilter(String(v))} style={{
                background: filter===String(v) ? c+"22" : "transparent",
                color: filter===String(v) ? c : C.textDim,
                border:`1px solid ${filter===String(v)?c+"44":C.border}`,
                borderRadius:12, padding:"3px 10px", cursor:"pointer",
                fontFamily:mono, fontSize:mobile?9:10, fontWeight:filter===String(v)?700:400,
                transition:"all 0.15s ease",
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Tool grid by type */}
      <div style={{maxWidth:800,margin:"0 auto"}}>
        {types.map(type => {
          const typeTools = filtered.filter(t => t.type === type);
          if (typeTools.length === 0) return null;
          const tc = typeColors[type];
          return (
            <div key={type} style={{marginBottom:mobile?16:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:mobile?8:10}}>
                <div style={{width:2,height:12,background:tc,borderRadius:1}}/>
                <span style={{fontFamily:mono,fontSize:mobile?10:12,fontWeight:700,color:tc}}>{type}</span>
                <span style={{fontSize:mobile?8:9,color:C.textDim}}>({typeTools.length})</span>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${tc}22,transparent)`,marginLeft:6}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?6:8}}>
                {typeTools.map(tool => <ToolCard key={tool.name} tool={tool} lang={lang} mobile={mobile}/>)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
