import { useState } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";

const i18n = {
  tapHint:{en:"Tap a time block to see details",zh:"点击时间块查看详情"},
  device:{en:"DEVICE",zh:"设备"},
  level:{en:"LEVEL",zh:"级别"},
  protocols:{en:"PROTOCOLS",zh:"协议"},
  takeaway:{en:"TAKEAWAY",zh:"要点"},
  dayTheme:{en:"Theme: The same developer, one day, four devices, four automation levels — seamlessly connected.",zh:"主题: 同一个开发者，一天，四种设备，四种自动化级别 — 无缝衔接。"},
};

const timeline = [
  {
    time:"07:30", period:{en:"Morning Commute",zh:"早晨通勤"}, icon:"🚇",
    device:{en:"📱 Phone",zh:"📱 手机"}, level:"L4", levelColor:C.green,
    summary:{en:"Check overnight agent results on the train",zh:"地铁上检查夜间 agent 运行结果"},
    detail:{en:"Last night you set a headless agent to refactor the payment module. It ran 3 hours, edited 28 files, all 412 tests pass. You get a push notification with a summary card (A2UI rendered on iOS). Swipe to approve the PR. Total interaction: 15 seconds.",zh:"昨晚你设置了一个 headless agent 重构支付模块。它运行了 3 小时，编辑了 28 个文件，412 个测试全部通过。你收到一条推送通知和摘要卡片 (A2UI 在 iOS 上渲染)。滑动批准 PR。总交互时间: 15 秒。"},
    protocols:["AG-UI","A2UI","Governance"],
    takeaway:{en:"L4 Full-Auto: Agent worked while you slept. Phone is just the approval surface.",zh:"L4 全自动: Agent 在你睡觉时工作。手机只是审批面。"},
  },
  {
    time:"08:15", period:{en:"Coffee + Quick Fix",zh:"咖啡 + 快速修复"}, icon:"☕",
    device:{en:"📱 Phone",zh:"📱 手机"}, level:"L3", levelColor:C.amber,
    summary:{en:"A Slack alert about a login bug — dispatch agent from phone",zh:"Slack 报了个登录 bug — 从手机派发 agent"},
    detail:{en:"QA posted a login failure in Slack. You open Claude app, type: \"fix the JWT expiry bug in auth middleware, run tests\". Claude Code Remote Control connects to your desktop. Agent starts working. You put your phone away and order coffee.",zh:"QA 在 Slack 报了个登录失败。你打开 Claude app，输入: \"修复 auth middleware 的 JWT 过期 bug，跑测试\"。Claude Code Remote Control 连接到你的桌面。Agent 开始工作。你把手机收起来，点了杯咖啡。"},
    protocols:["Claude Code RC","MCP","AG-UI"],
    takeaway:{en:"L3 Semi-Auto: Intent dispatched from phone. Agent executes on desktop. No laptop needed.",zh:"L3 半自动: 意图从手机下达。Agent 在桌面执行。不需要笔记本。"},
  },
  {
    time:"09:30", period:{en:"Deep Work — Feature Dev",zh:"深度工作 — 功能开发"}, icon:"💻",
    device:{en:"🖥️ IDE (Cursor)",zh:"🖥️ IDE (Cursor)"}, level:"L2", levelColor:C.blue,
    summary:{en:"Pair-program a new OAuth integration with AI in real-time",zh:"与 AI 实时结对编程一个新的 OAuth 集成"},
    detail:{en:"This requires careful design decisions — you stay in control. Cursor's Tab completion suggests code as you type. You architect the OAuth flow, AI fills in implementation. You review each suggestion inline, accept or reject. The AI understands your codebase context via ACP + MCP. After 2 hours, the feature is done. You wrote ~30% of the code, AI wrote ~70%, but you made every design decision.",zh:"这需要仔细的设计决策 — 你保持控制权。Cursor Tab 补全在你输入时建议代码。你设计 OAuth 流程，AI 填充实现。你逐行审查建议，接受或拒绝。AI 通过 ACP + MCP 理解你的代码库上下文。2 小时后，功能完成。你写了约 30% 的代码，AI 写了约 70%，但每个设计决策都是你做的。"},
    protocols:["ACP","MCP"],
    takeaway:{en:"L2 Collaborative: Human leads architecture, AI fills implementation. Control stays with you.",zh:"L2 协作: 人类主导架构，AI 填充实现。控制权在你手中。"},
  },
  {
    time:"11:45", period:{en:"Bug Fix Complete",zh:"Bug 修复完成"}, icon:"✅",
    device:{en:"📱 Phone (notification)",zh:"📱 手机 (通知)"}, level:"L3", levelColor:C.amber,
    summary:{en:"The morning's login bug fix is done — approve from phone",zh:"早上的登录 bug 修复完成 — 从手机审批"},
    detail:{en:"Push notification: \"JWT auth fix complete. 3 files changed, 8 tests added, all passing.\" You tap the notification, see a diff summary rendered as native iOS cards (A2UI). Tap approve. The PR auto-merges and deploys to staging. You never opened a laptop for this bug.",zh:"推送通知: \"JWT auth 修复完成。3 个文件修改，新增 8 个测试，全部通过。\" 你点击通知，看到 diff 摘要渲染为原生 iOS 卡片 (A2UI)。点击批准。PR 自动合并并部署到 staging。你全程没打开笔记本。"},
    protocols:["AG-UI","A2UI","Governance"],
    takeaway:{en:"L3 result delivery: Started on phone, agent worked on desktop, result approved on phone. Full cycle without a laptop.",zh:"L3 结果交付: 手机发起，agent 在桌面执行，手机审批结果。全程不需要笔记本。"},
  },
  {
    time:"14:00", period:{en:"Code Review Session",zh:"代码审查会议"}, icon:"🔍",
    device:{en:"🖥️ IDE (JetBrains)",zh:"🖥️ IDE (JetBrains)"}, level:"L2", levelColor:C.blue,
    summary:{en:"Review teammate's PR with AI-assisted analysis",zh:"用 AI 辅助分析审查同事的 PR"},
    detail:{en:"A teammate submitted a complex database migration PR. You open it in JetBrains with an AI agent (via ACP Agent Registry). The agent highlights potential issues: missing index, N+1 query risk, inconsistent naming. You discuss each point, some are valid, some you override. The agent drafts review comments, you edit and post them.",zh:"同事提交了一个复杂的数据库迁移 PR。你在 JetBrains 中打开，通过 ACP Agent Registry 连接 AI agent。Agent 高亮潜在问题: 缺失索引、N+1 查询风险、命名不一致。你逐一讨论，有些有效，有些你否决。Agent 起草 review 评论，你编辑后发布。"},
    protocols:["ACP","MCP"],
    takeaway:{en:"L2 for review: AI catches patterns humans miss. Human judgment for what actually matters.",zh:"L2 审查: AI 捕获人类遗漏的模式。人类判断什么真正重要。"},
  },
  {
    time:"16:00", period:{en:"Set Up Overnight Tasks",zh:"设置夜间任务"}, icon:"🌙",
    device:{en:"⌨️ Terminal",zh:"⌨️ 终端"}, level:"L4", levelColor:C.green,
    summary:{en:"Configure headless agents for overnight work",zh:"配置 headless agent 进行夜间工作"},
    detail:{en:"In terminal, you set up two overnight tasks: (1) Agent A: \"Upgrade all dependencies, fix breaking changes, ensure all tests pass. Budget: 200K tokens.\" (2) Agent B: \"Run security audit on the new OAuth module, report vulnerabilities.\" Governance rules auto-set: no production deploys, max file changes 50, alert if budget exceeds 80%. Both agents will run in isolated cloud containers overnight.",zh:"在终端设置两个夜间任务: (1) Agent A: \"升级所有依赖，修复破坏性变更，确保测试通过。预算: 20万 tokens。\" (2) Agent B: \"对新 OAuth 模块运行安全审计，报告漏洞。\" Governance 规则自动设置: 不允许生产部署，最大文件变更 50 个，预算超 80% 时告警。两个 agent 将在隔离的云容器中运行一整夜。"},
    protocols:["Claude Code","MCP","Governance","A2A"],
    takeaway:{en:"L4 setup: 5 minutes of human intent → 8+ hours of autonomous agent work overnight.",zh:"L4 设置: 5 分钟人类意图 → 8+ 小时的夜间自主 agent 工作。"},
  },
  {
    time:"22:00", period:{en:"Before Bed",zh:"睡前"}, icon:"🛏️",
    device:{en:"📱 Phone",zh:"📱 手机"}, level:"L4", levelColor:C.green,
    summary:{en:"Quick check: agents running normally, no alerts",zh:"快速检查: agent 正常运行，无告警"},
    detail:{en:"Open Claude app. Dashboard shows: Agent A at 45% progress, 89K tokens used. Agent B completed security audit, found 2 low-severity issues, auto-filed tickets. No alerts requiring human action. You close the app. Tomorrow morning on the train, you'll review Agent A's results.",zh:"打开 Claude app。仪表盘显示: Agent A 进度 45%，已使用 89K tokens。Agent B 完成安全审计，发现 2 个低危问题，自动创建了 ticket。没有需要人类操作的告警。你关闭 app。明天早上地铁上你会审查 Agent A 的结果。"},
    protocols:["AG-UI","A2UI","Governance"],
    takeaway:{en:"The cycle continues: agents work → human reviews → agents work. The phone is the async control surface that keeps it all flowing.",zh:"循环继续: agent 工作 → 人类审查 → agent 工作。手机是保持一切流转的异步控制面。"},
  },
];

const deviceIcons = {"📱":"cyan","🖥️":"blue","⌨️":"amber"};

function TimeBlock({item, expanded, onToggle, lang, mobile}) {
  return (
    <div style={{display:"flex",gap:mobile?10:16}}>
      {/* Timeline */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:mobile?44:56}}>
        <div style={{fontFamily:mono,fontSize:mobile?11:13,fontWeight:700,color:item.levelColor,whiteSpace:"nowrap"}}>{item.time}</div>
        <div style={{width:2,flex:1,background:`linear-gradient(180deg,${item.levelColor}44,${C.border})`,marginTop:4}}/>
      </div>
      {/* Card */}
      <div onClick={onToggle} style={{
        flex:1, cursor:"pointer", marginBottom:mobile?8:12,
        background:expanded?`linear-gradient(135deg,${C.surface},${item.levelColor}08)`:C.surface,
        border:`1px solid ${expanded?item.levelColor+"44":C.border}`,
        borderRadius:10, padding:mobile?"12px 12px":"14px 16px",
        transition:"all 0.15s ease",
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <span style={{fontSize:mobile?18:22}}>{item.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:mono,fontSize:mobile?12:14,fontWeight:700,color:C.text}}>{t(item.period,lang)}</div>
            <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}}>
              <Tag color={C.cyan} mobile={mobile}>{t(item.device,lang)}</Tag>
              <Tag color={item.levelColor} mobile={mobile}>{item.level}</Tag>
            </div>
          </div>
          <div style={{fontSize:10,color:C.textDim,fontFamily:mono,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s ease"}}>▼</div>
        </div>
        <div style={{fontSize:mobile?10.5:11.5,color:C.textSub,lineHeight:1.5}}>{t(item.summary,lang)}</div>

        {expanded && (
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${item.levelColor}22`}}>
            <div style={{fontSize:mobile?10.5:12,color:C.text,lineHeight:1.7,marginBottom:12,fontFamily:sans}}>
              {t(item.detail,lang)}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
              <span style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,marginRight:4}}>{t(i18n.protocols,lang)}:</span>
              {item.protocols.map((p,i)=><Tag key={i} color={item.levelColor} mobile={mobile}>{p}</Tag>)}
            </div>
            <div style={{background:item.levelColor+"12",border:`1px solid ${item.levelColor}22`,borderRadius:6,padding:"8px 12px"}}>
              <span style={{fontSize:mobile?8:9,fontFamily:mono,color:item.levelColor,fontWeight:700}}>{t(i18n.takeaway,lang)}: </span>
              <span style={{fontSize:mobile?10:11,color:C.text,lineHeight:1.6}}>{t(item.takeaway,lang)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DayInLife({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [expanded, setExpanded] = useState(new Set([1]));
  const toggle = k => setExpanded(p => {const n=new Set(p); n.has(k)?n.delete(k):n.add(k); return n;});

  return (
    <>
      {/* Theme */}
      <div style={{maxWidth:720,margin:mobile?"0 auto 16px":"0 auto 24px",textAlign:"center"}}>
        <div style={{fontSize:mobile?10:12,color:C.textSub,lineHeight:1.6,fontStyle:"italic",fontFamily:sans}}>
          {t(i18n.dayTheme,lang)}
        </div>
        <div style={{fontSize:mobile?9:10,color:C.textDim,marginTop:6}}>{t(i18n.tapHint,lang)}</div>
      </div>

      {/* Device legend */}
      <div style={{maxWidth:720,margin:mobile?"0 auto 12px":"0 auto 16px",display:"flex",justifyContent:"center",gap:mobile?10:16,flexWrap:"wrap"}}>
        {[{d:"📱",l:{en:"Phone",zh:"手机"},c:C.cyan},{d:"🖥️",l:{en:"IDE",zh:"IDE"},c:C.blue},{d:"⌨️",l:{en:"Terminal",zh:"终端"},c:C.amber}].map(x=>(
          <div key={x.d} style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14}}>{x.d}</span>
            <span style={{fontSize:mobile?9:10,color:x.c,fontFamily:mono}}>{t(x.l,lang)}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{maxWidth:720,margin:"0 auto"}}>
        {timeline.map((item,i) => (
          <TimeBlock key={i} item={item} expanded={expanded.has(i)} onToggle={()=>toggle(i)} lang={lang} mobile={mobile}/>
        ))}
      </div>

      {/* Summary stats */}
      <div style={{maxWidth:720,margin:mobile?"16px auto 0":"24px auto 0"}}>
        <div style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:mobile?"12px 14px":"16px 18px",display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:mobile?10:16}}>
          {[
            {n:{en:"Human time",zh:"人类耗时"},v:{en:"~3.5 hrs",zh:"~3.5 小时"},c:C.blue},
            {n:{en:"Agent time",zh:"Agent 耗时"},v:{en:"~11 hrs",zh:"~11 小时"},c:C.amber},
            {n:{en:"Devices used",zh:"使用设备"},v:{en:"3 (📱⌨️🖥️)",zh:"3 (📱⌨️🖥️)"},c:C.cyan},
            {n:{en:"Automation levels",zh:"自动化级别"},v:{en:"L2 · L3 · L4",zh:"L2 · L3 · L4"},c:C.green},
          ].map(s=>(
            <div key={t(s.n,lang)} style={{textAlign:"center"}}>
              <div style={{fontFamily:mono,fontSize:mobile?16:20,fontWeight:700,color:s.c}}>{t(s.v,lang)}</div>
              <div style={{fontSize:mobile?9:10,color:C.textDim,marginTop:2}}>{t(s.n,lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
