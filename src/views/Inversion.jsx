import { useState } from "react";
import { C, mono, sans, useWidth, t } from "../shared";

const i18n = {
  timeAxis:{en:"Human Time Investment",zh:"人类时间投入"},
  leverageAxis:{en:"Impact per Decision",zh:"每个决策的影响力"},
  tapLevel:{en:"Tap a level for details",zh:"点击级别查看详情"},
  timeLabel:{en:"TIME",zh:"时间"},
  leverageLabel:{en:"LEVERAGE",zh:"杠杆"},
  what:{en:"WHAT HUMAN DOES",zh:"人类做什么"},
  decides:{en:"WHAT HUMAN DECIDES",zh:"人类决策什么"},
  paradox:{en:"The Automation Paradox",zh:"自动化悖论"},
  paradoxBody:{
    en:"As human time approaches zero, the value of each remaining human moment approaches infinity. A 30-second approval at L4 can greenlight 8 hours of agent work. A 30-minute goal definition at L5 shapes days of multi-agent output. The less you do, the more each action matters.",
    zh:"当人类时间趋近于零时，每个剩余时刻的价值趋近于无穷大。L4 的 30 秒审批可以为 8 小时的 agent 工作放行。L5 的 30 分钟目标定义塑造数天的多 agent 产出。你做得越少，每个行动越重要。",
  },
};

const levels = [
  { l:0, name:{en:"Manual",zh:"人工"}, color:C.textSub,
    timePct:100, leveragePct:5,
    time:{en:"~4 hrs / bug fix",zh:"~4 小时 / bug 修复"},
    leverage:{en:"1 line of code → 1 line of effect",zh:"1 行代码 → 1 行效果"},
    what:{en:"Write every line, run every test, type every commit message",zh:"写每一行代码，跑每个测试，输入每条 commit 消息"},
    decides:{en:"Everything — no delegation possible",zh:"一切 — 无法委派"},
  },
  { l:1, name:{en:"Assisted",zh:"辅助"}, color:C.purple,
    timePct:80, leveragePct:12,
    time:{en:"~2 hrs / bug fix",zh:"~2 小时 / bug 修复"},
    leverage:{en:"1 question → 1 answer to copy-paste",zh:"1 个问题 → 1 个可复制粘贴的答案"},
    what:{en:"Ask questions, copy-paste answers, manually test and commit",zh:"提问，复制粘贴答案，手动测试和提交"},
    decides:{en:"What to ask, which answer to use",zh:"问什么，用哪个答案"},
  },
  { l:2, name:{en:"Collab",zh:"协作"}, color:C.blue,
    timePct:55, leveragePct:25,
    time:{en:"~45 min / bug fix",zh:"~45 分钟 / bug 修复"},
    leverage:{en:"1 accept/reject → multiple lines of code",zh:"1 次接受/拒绝 → 多行代码"},
    what:{en:"Review inline suggestions, accept or reject, make design decisions",zh:"审查内联建议，接受或拒绝，做设计决策"},
    decides:{en:"Architecture and design direction — AI fills implementation",zh:"架构和设计方向 — AI 填充实现"},
  },
  { l:3, name:{en:"Semi-Auto",zh:"半自动"}, color:C.amber,
    timePct:25, leveragePct:55,
    time:{en:"~10 min human + ~15 min agent",zh:"~10 分钟人 + ~15 分钟 agent"},
    leverage:{en:"1 sentence of intent → complete multi-file fix + tests + PR",zh:"1 句话意图 → 完整的多文件修复 + 测试 + PR"},
    what:{en:"Describe intent, approve plan, approve result",zh:"描述意图，审批计划，审批结果"},
    decides:{en:"What to build and whether the result is acceptable",zh:"构建什么，以及结果是否可接受"},
  },
  { l:4, name:{en:"Full-Auto",zh:"全自动"}, color:C.green,
    timePct:5, leveragePct:80,
    time:{en:"~0 min (agent 8+ hrs overnight)",zh:"~0 分钟 (agent 夜间 8+ 小时)"},
    leverage:{en:"1 boundary rule → governs hours of autonomous work",zh:"1 条边界规则 → 约束数小时的自主工作"},
    what:{en:"Set governance boundaries, review exception alerts",zh:"设定治理边界，审查异常告警"},
    decides:{en:"What's allowed and what's not — agent handles the rest",zh:"什么被允许、什么被禁止 — agent 处理其余一切"},
  },
  { l:5, name:{en:"Orchestr.",zh:"自主编排"}, color:C.cyan,
    timePct:2, leveragePct:98,
    time:{en:"~30 min goal setting → days of agent mesh work",zh:"~30 分钟目标设定 → 数天 agent mesh 工作"},
    leverage:{en:"1 goal definition → shapes entire system evolution",zh:"1 个目标定义 → 塑造整个系统演进"},
    what:{en:"Define strategic goals and constraints",zh:"定义战略目标和约束"},
    decides:{en:"Direction — where the whole system should go",zh:"方向 — 整个系统应该去哪"},
  },
];

function Bar({pct, color, label, maxW, mobile}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:mobile?6:10}}>
      <div style={{flex:1,height:mobile?14:18,background:C.border,borderRadius:4,overflow:"hidden",position:"relative"}}>
        <div style={{
          width:`${pct}%`,height:"100%",
          background:`linear-gradient(90deg,${color}88,${color})`,
          borderRadius:4,transition:"width 0.6s ease",
        }}/>
        <span style={{
          position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",
          fontSize:mobile?8:10,fontFamily:mono,color:C.text,fontWeight:700,
        }}>{pct}%</span>
      </div>
    </div>
  );
}

export default function Inversion({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [selected, setSelected] = useState(3);
  const lv = levels[selected];

  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      {/* Visual chart area */}
      <div style={{
        background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,
        padding:mobile?"14px":"20px 24px",marginBottom:mobile?12:16,
      }}>
        {/* Level selector */}
        <div style={{display:"flex",justifyContent:"center",gap:mobile?4:8,marginBottom:mobile?14:20}}>
          {levels.map((lv,i)=>(
            <button key={i} onClick={()=>setSelected(i)} style={{
              background:selected===i?lv.color+"22":"transparent",
              border:`1px solid ${selected===i?lv.color+"66":C.border}`,
              borderRadius:8,padding:mobile?"8px 8px":"10px 14px",cursor:"pointer",
              transition:"all 0.15s ease",minWidth:mobile?42:56,
              borderTop:`${selected===i?3:1}px solid ${selected===i?lv.color:C.border}`,
            }}>
              <div style={{fontFamily:mono,fontSize:mobile?10:12,fontWeight:700,color:lv.color}}>L{lv.l}</div>
              {!mobile&&<div style={{fontSize:8,color:C.textDim,marginTop:2}}>{t(lv.name,lang)}</div>}
            </button>
          ))}
        </div>

        {/* Dual bars */}
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <span style={{fontSize:mobile?9:10,fontFamily:mono,color:C.textDim,minWidth:mobile?60:90}}>
              ⏱ {t(i18n.timeLabel,lang)}
            </span>
            <div style={{flex:1}}><Bar pct={lv.timePct} color={C.textSub} mobile={mobile}/></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:mobile?9:10,fontFamily:mono,color:C.textDim,minWidth:mobile?60:90}}>
              ⚡ {t(i18n.leverageLabel,lang)}
            </span>
            <div style={{flex:1}}><Bar pct={lv.leveragePct} color={lv.color} mobile={mobile}/></div>
          </div>
        </div>

        {/* The X pattern - time down, leverage up */}
        <div style={{
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:mobile?10:20,
          padding:mobile?"10px 0":"14px 0",borderTop:`1px solid ${C.border}`,
        }}>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,textTransform:"uppercase",marginBottom:4}}>
              ⏱ {t(i18n.timeAxis,lang)}
            </div>
            <div style={{fontSize:mobile?12:15,fontFamily:mono,fontWeight:700,color:C.textSub,marginBottom:4}}>
              {t(lv.time,lang)}
            </div>
          </div>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:lv.color,textTransform:"uppercase",marginBottom:4}}>
              ⚡ {t(i18n.leverageAxis,lang)}
            </div>
            <div style={{fontSize:mobile?12:15,fontFamily:mono,fontWeight:700,color:lv.color,marginBottom:4}}>
              {t(lv.leverage,lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Detail card */}
      <div style={{
        background:`linear-gradient(135deg,${lv.color}08,${C.surface})`,
        border:`1px solid ${lv.color}33`,borderRadius:10,
        padding:mobile?"14px":"18px 22px",marginBottom:mobile?12:16,
      }}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?12:20}}>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:lv.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>
              {t(i18n.what,lang)}
            </div>
            <div style={{fontSize:mobile?11:12,color:C.textSub,lineHeight:1.6}}>{t(lv.what,lang)}</div>
          </div>
          <div>
            <div style={{fontSize:mobile?8:9,fontFamily:mono,color:lv.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>
              {t(i18n.decides,lang)}
            </div>
            <div style={{fontSize:mobile?11:12,color:C.text,lineHeight:1.6,fontWeight:500}}>{t(lv.decides,lang)}</div>
          </div>
        </div>
      </div>

      {/* Paradox callout */}
      <div style={{
        background:C.surfaceAlt,border:`1px solid ${C.amber}22`,borderRadius:10,
        padding:mobile?"14px":"18px 22px",borderLeft:`3px solid ${C.amber}`,
      }}>
        <div style={{fontFamily:mono,fontSize:mobile?12:14,fontWeight:700,color:C.amber,marginBottom:8}}>
          {t(i18n.paradox,lang)}
        </div>
        <div style={{fontSize:mobile?11:12.5,color:C.textSub,lineHeight:1.7,fontFamily:sans}}>
          {t(i18n.paradoxBody,lang)}
        </div>
      </div>
    </div>
  );
}
