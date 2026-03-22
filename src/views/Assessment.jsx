import { useState } from "react";
import { C, mono, sans, useWidth, t, Tag } from "../shared";
import Guide from "./Guide";

const i18n = {
  tab_assessment:{en:"Self-Assessment",zh:"自评测试"},
  tab_guide:{en:"Setup Guide",zh:"配置指南"},
  intro:{
    en:"Answer 8 questions about your daily workflow. Find out where you really are on the L0→L5 spectrum.",
    zh:"回答 8 个关于日常工作流的问题，看看你在 L0→L5 光谱上的真实位置。",
  },
  result:{en:"YOUR ASSESSMENT",zh:"你的评估结果"},
  reset:{en:"Retake",zh:"重新测试"},
  progress:{en:"PROGRESS",zh:"进度"},
  levelLabel:{en:"Level",zh:"级别"},
  breakdown:{en:"SCORE BREAKDOWN",zh:"得分明细"},
  interpretation:{en:"INTERPRETATION",zh:"解读"},
  nextStep:{en:"NEXT STEP",zh:"下一步"},
  share:{en:"Share your level",zh:"分享你的级别"},
};

const questions = [
  {
    q:{en:"How do you start a typical coding task?",zh:"你通常怎么开始一个编码任务？"},
    icon:"🚀",
    options:[
      {label:{en:"Open editor, start typing code",zh:"打开编辑器，开始敲代码"},score:0},
      {label:{en:"Ask AI for suggestions, then copy-paste",zh:"让 AI 给建议，然后复制粘贴"},score:1},
      {label:{en:"Describe intent in IDE, AI writes, I review inline",zh:"在 IDE 中描述意图，AI 写代码，我内联审查"},score:2},
      {label:{en:"Give a natural language task to CLI agent, review result",zh:"给 CLI agent 自然语言任务，审查结果"},score:3},
    ],
  },
  {
    q:{en:"How do you handle bug fixes?",zh:"你怎么处理 Bug 修复？"},
    icon:"🐛",
    options:[
      {label:{en:"Read logs, debug manually, write fix",zh:"看日志，手动调试，写修复"},score:0},
      {label:{en:"Paste error to AI, get fix suggestion, apply manually",zh:"把错误贴给 AI，获取修复建议，手动应用"},score:1},
      {label:{en:"AI diagnoses and proposes fix in editor, I approve",zh:"AI 在编辑器中诊断并提出修复，我批准"},score:2},
      {label:{en:"Describe the bug, agent finds root cause and fixes autonomously",zh:"描述 bug，agent 自主定位根因并修复"},score:3},
    ],
  },
  {
    q:{en:"How do you write tests?",zh:"你怎么写测试？"},
    icon:"🧪",
    options:[
      {label:{en:"Write all tests manually",zh:"全部手写测试"},score:0},
      {label:{en:"AI generates test templates, I fill in logic",zh:"AI 生成测试模板，我填入逻辑"},score:1},
      {label:{en:"AI writes full tests, I review and adjust",zh:"AI 写完整测试，我审查和调整"},score:2},
      {label:{en:"Agent writes tests, runs them, iterates until passing",zh:"Agent 写测试、运行、迭代直到通过"},score:3},
    ],
  },
  {
    q:{en:"How many devices do you use for development?",zh:"你用几种设备进行开发？"},
    icon:"📱",
    options:[
      {label:{en:"Just my laptop/desktop",zh:"只用笔记本/台式机"},score:0},
      {label:{en:"Laptop + occasionally check things on phone",zh:"笔记本 + 偶尔在手机上看看"},score:1},
      {label:{en:"IDE + terminal + phone for approvals",zh:"IDE + 终端 + 手机用于审批"},score:2},
      {label:{en:"IDE + terminal + phone + headless agents in cloud",zh:"IDE + 终端 + 手机 + 云端无头 agent"},score:3},
    ],
  },
  {
    q:{en:"What happens while you sleep?",zh:"你睡觉时发生了什么？"},
    icon:"🌙",
    options:[
      {label:{en:"Nothing — work stops when I stop",zh:"什么都没有——我停下工作就停了"},score:0},
      {label:{en:"CI/CD runs scheduled builds/tests",zh:"CI/CD 运行定时构建/测试"},score:1},
      {label:{en:"Agents handle some maintenance tasks overnight",zh:"Agent 在夜间处理一些维护任务"},score:2},
      {label:{en:"Autonomous agents work through my task queue 24/7",zh:"自主 agent 24/7 处理我的任务队列"},score:3},
    ],
  },
  {
    q:{en:"How do you do code review?",zh:"你怎么做代码审查？"},
    icon:"🔍",
    options:[
      {label:{en:"Read every line manually in PR",zh:"在 PR 中逐行手动阅读"},score:0},
      {label:{en:"AI summarizes PR, I focus on key areas",zh:"AI 总结 PR，我关注关键区域"},score:1},
      {label:{en:"AI reviews and comments, I review AI's review",zh:"AI 审查并评论，我审查 AI 的审查"},score:2},
      {label:{en:"Agent reviews, approves routine PRs, flags risky ones for me",zh:"Agent 审查，批准常规 PR，标记有风险的给我"},score:3},
    ],
  },
  {
    q:{en:"How do you interact with AI coding tools?",zh:"你怎么与 AI 编码工具交互？"},
    icon:"💬",
    options:[
      {label:{en:"I don't use AI for coding",zh:"我不用 AI 写代码"},score:0},
      {label:{en:"Chat / autocomplete in browser or editor",zh:"在浏览器或编辑器中聊天 / 自动补全"},score:1},
      {label:{en:"IDE agent with inline diff review",zh:"IDE agent 配合内联 diff 审查"},score:2},
      {label:{en:"CLI agent + governance rules + phone approval workflow",zh:"CLI agent + governance 规则 + 手机审批工作流"},score:3},
    ],
  },
  {
    q:{en:"How do you handle repetitive tasks (dependency updates, migrations)?",zh:"你怎么处理重复任务（依赖更新、迁移）？"},
    icon:"🔄",
    options:[
      {label:{en:"Do them manually, one by one",zh:"逐个手动处理"},score:0},
      {label:{en:"Use scripts I wrote or found online",zh:"用自己写的或网上找的脚本"},score:1},
      {label:{en:"AI generates scripts, I review and run",zh:"AI 生成脚本，我审查并运行"},score:2},
      {label:{en:"Agent handles them automatically, I just monitor results",zh:"Agent 自动处理，我只监控结果"},score:3},
    ],
  },
];

const levels = [
  {
    level:0,name:{en:"L0 Manual",zh:"L0 手工"},color:C.textSub,
    desc:{en:"You're fully manual. You write every line, debug every bug, and test every path yourself. Pure craftsmanship.",zh:"你完全手工操作。每一行代码、每个 bug、每条测试路径都亲自处理。纯粹的工匠精神。"},
    next:{en:"Try using AI autocomplete (GitHub Copilot, Cursor Tab) for boilerplate code. Start with tests — low risk, high time savings.",zh:"试试用 AI 自动补全（GitHub Copilot、Cursor Tab）处理样板代码。从测试开始——风险低、省时多。"},
  },
  {
    level:1,name:{en:"L1 Assisted",zh:"L1 辅助"},color:C.purple,
    desc:{en:"You use AI as a search engine / autocomplete. It speeds things up, but you still drive 100% of decisions and implementation.",zh:"你把 AI 当搜索引擎/自动补全。它加速了你的工作，但你仍然 100% 主导决策和实现。"},
    next:{en:"Move from copy-paste to inline review. Try Cursor's Composer or Claude Code for a whole task (not just a function). Let AI handle the 'how', you focus on the 'what'.",zh:"从复制粘贴转向内联审查。试试 Cursor 的 Composer 或 Claude Code 处理一个完整任务（不只是一个函数）。让 AI 处理 '怎么做'，你专注于 '做什么'。"},
  },
  {
    level:2,name:{en:"L2 Collaborative",zh:"L2 协作"},color:C.blue,
    desc:{en:"You and AI are genuine collaborators. AI writes substantial code, you review and steer. You're in the mainstream of 2026 adoption.",zh:"你和 AI 是真正的协作者。AI 写大量代码，你审查和引导。你处于 2026 年采纳的主流位置。"},
    next:{en:"Try CLI agents (Claude Code, Gemini CLI) for well-defined tasks. Experience the jump from 'AI in my editor' to 'AI as my junior dev'. Set up phone-based approval for non-critical tasks.",zh:"试试 CLI agent（Claude Code、Gemini CLI）处理明确定义的任务。体验从 '编辑器里的 AI' 到 'AI 作为初级开发者' 的飞跃。为非关键任务设置手机审批。"},
  },
  {
    level:3,name:{en:"L3 Semi-Autonomous",zh:"L3 半自动"},color:C.amber,
    desc:{en:"You're at the frontier. Agents handle most implementation, you provide intent and review results. You're ahead of 80% of developers.",zh:"你在前沿。Agent 处理大部分实现，你提供意图并审查结果。你领先于 80% 的开发者。"},
    next:{en:"Set up overnight agents for maintenance. Configure Governance boundaries (file scope, budget limits). Explore A2A for multi-agent workflows. You're ready for L4 on low-risk tasks.",zh:"为维护任务设置夜间 agent。配置 Governance 边界（文件范围、预算限制）。探索 A2A 多 agent 工作流。你已经准备好在低风险任务上尝试 L4。"},
  },
];

function getLevel(totalScore) {
  const maxScore = questions.length * 3;
  const pct = totalScore / maxScore;
  if (pct < 0.15) return 0;
  if (pct < 0.40) return 1;
  if (pct < 0.65) return 2;
  return 3;
}

function ProgressBar({current, total, mobile}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:mobile?14:20}}>
      <div style={{flex:1,height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:C.blue,borderRadius:2,transition:"width 0.3s ease"}}/>
      </div>
      <span style={{fontSize:mobile?9:10,fontFamily:mono,color:C.textDim}}>{current}/{total}</span>
    </div>
  );
}

function AssessmentQuiz({lang, mobile}) {
  const [answers, setAnswers] = useState({});

  const answered = Object.keys(answers).length;
  const allDone = answered === questions.length;
  const totalScore = Object.values(answers).reduce((a,b)=>a+b, 0);
  const levelIdx = allDone ? getLevel(totalScore) : null;
  const levelData = levelIdx !== null ? levels[levelIdx] : null;

  const reset = () => setAnswers({});

  return (
    <>
      <div style={{fontSize:mobile?10.5:12,color:C.textSub,textAlign:"center",marginBottom:mobile?14:20,lineHeight:1.6}}>
        {t(i18n.intro,lang)}
      </div>

      {!allDone && <ProgressBar current={answered} total={questions.length} mobile={mobile}/>}

      {/* Questions */}
      {!allDone && (
        <div style={{display:"flex",flexDirection:"column",gap:mobile?12:16}}>
          {questions.map((q,qi)=>(
            <div key={qi} style={{
              background:answers[qi]!==undefined?C.surface+"88":C.surface,
              border:`1px solid ${answers[qi]!==undefined?C.green+"44":C.border}`,
              borderRadius:10,padding:mobile?"14px":"18px 20px",
              opacity:answers[qi]!==undefined?0.7:1,
              transition:"all 0.2s ease",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:mobile?18:22}}>{q.icon}</span>
                <div style={{fontFamily:mono,fontSize:mobile?11:13,fontWeight:700,color:C.text,lineHeight:1.3}}>
                  {qi+1}. {t(q.q,lang)}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?4:6}}>
                {q.options.map((opt,oi)=>{
                  const selected = answers[qi] === opt.score;
                  return (
                    <button key={oi} onClick={()=>setAnswers(prev=>({...prev,[qi]:opt.score}))} style={{
                      background:selected?C.blue+"18":C.bg,
                      border:`1px solid ${selected?C.blue+"55":C.border}`,
                      borderRadius:6,padding:mobile?"8px 10px":"10px 12px",
                      cursor:"pointer",textAlign:"left",transition:"all 0.15s ease",
                    }}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
                        <span style={{
                          width:16,height:16,borderRadius:"50%",flexShrink:0,marginTop:1,
                          border:`2px solid ${selected?C.blue:C.border}`,
                          background:selected?C.blue:"transparent",
                          display:"flex",alignItems:"center",justifyContent:"center",
                        }}>
                          {selected && <span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>}
                        </span>
                        <span style={{
                          fontSize:mobile?10:11,fontFamily:sans,
                          color:selected?C.blue:C.textSub,fontWeight:selected?600:400,
                          lineHeight:1.5,
                        }}>
                          {t(opt.label,lang)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {allDone && levelData && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{
            background:`linear-gradient(135deg,${levelData.color}10,${C.surface})`,
            border:`1px solid ${levelData.color}44`,borderRadius:12,
            padding:mobile?"16px":"24px 28px",
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontFamily:mono,fontSize:mobile?9:10,fontWeight:700,color:levelData.color,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {t(i18n.result,lang)}
              </div>
              <button onClick={reset} style={{
                background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,
                padding:"3px 10px",cursor:"pointer",fontFamily:mono,fontSize:mobile?8:9,
                color:C.textDim,
              }}>{t(i18n.reset,lang)}</button>
            </div>

            {/* Level name */}
            <div style={{fontFamily:mono,fontSize:mobile?22:30,fontWeight:700,color:levelData.color,marginBottom:6}}>
              {t(levelData.name,lang)}
            </div>

            {/* Score bar */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:mobile?8:9,fontFamily:mono,color:C.textDim,marginBottom:6}}>
                {t(i18n.breakdown,lang)}: {totalScore}/{questions.length*3}
              </div>
              <div style={{display:"flex",gap:2,height:mobile?6:8}}>
                {questions.map((_,qi)=>(
                  <div key={qi} style={{
                    flex:1,borderRadius:2,
                    background:answers[qi]===0?C.textDim+"44":
                              answers[qi]===1?C.purple+"66":
                              answers[qi]===2?C.blue+"88":C.green+"aa",
                    transition:"background 0.3s ease",
                  }}/>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim}}>L0</span>
                <span style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim}}>L1</span>
                <span style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim}}>L2</span>
                <span style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim}}>L3+</span>
              </div>
            </div>

            {/* Interpretation */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:mobile?8:9,fontFamily:mono,color:levelData.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {t(i18n.interpretation,lang)}
              </div>
              <div style={{fontSize:mobile?11:13,color:C.textSub,lineHeight:1.7,fontFamily:sans}}>
                {t(levelData.desc,lang)}
              </div>
            </div>

            {/* Next step */}
            <div style={{
              background:levelData.color+"12",border:`1px solid ${levelData.color}22`,
              borderRadius:8,padding:mobile?"10px 12px":"14px 18px",
            }}>
              <div style={{fontSize:mobile?8:9,fontFamily:mono,color:levelData.color,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {t(i18n.nextStep,lang)}
              </div>
              <div style={{fontSize:mobile?11:12.5,color:C.text,lineHeight:1.7,fontFamily:sans}}>
                {t(levelData.next,lang)}
              </div>
            </div>

            {/* Level comparison bar */}
            <div style={{marginTop:16,display:"flex",gap:4}}>
              {levels.map((lv,i)=>(
                <div key={i} style={{
                  flex:1,borderRadius:6,padding:mobile?"8px 4px":"10px 8px",textAlign:"center",
                  background:i===levelIdx?lv.color+"22":C.bg,
                  border:`1px solid ${i===levelIdx?lv.color+"55":C.border}`,
                  transition:"all 0.2s ease",
                }}>
                  <div style={{fontFamily:mono,fontSize:mobile?10:12,fontWeight:700,color:i===levelIdx?lv.color:C.textDim}}>
                    L{lv.level}
                  </div>
                  <div style={{fontSize:mobile?7:8,fontFamily:mono,color:C.textDim,marginTop:2}}>
                    {i===levelIdx?"← YOU":""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Assessment({lang}) {
  const w = useWidth();
  const mobile = w < 640;
  const [subTab, setSubTab] = useState("assessment");

  const subTabs = [
    {id:"assessment",label:i18n.tab_assessment,icon:"📋"},
    {id:"guide",label:i18n.tab_guide,icon:"🧭"},
  ];

  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      {/* Sub-tab toggle */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:mobile?14:20}}>
        <div style={{
          display:"inline-flex",background:C.surface,
          border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",
        }}>
          {subTabs.map(tb=>(
            <button key={tb.id} onClick={()=>setSubTab(tb.id)} style={{
              background:subTab===tb.id?C.blue+"22":"transparent",
              color:subTab===tb.id?C.blue:C.textDim,
              border:"none",padding:mobile?"6px 14px":"7px 20px",
              cursor:"pointer",fontFamily:mono,fontSize:mobile?10:11,
              fontWeight:subTab===tb.id?700:400,transition:"all 0.15s ease",
              display:"flex",alignItems:"center",gap:5,
            }}>
              <span style={{fontSize:mobile?12:14}}>{tb.icon}</span>
              {t(tb.label,lang)}
            </button>
          ))}
        </div>
      </div>

      {subTab === "assessment" && <AssessmentQuiz lang={lang} mobile={mobile}/>}
      {subTab === "guide" && <Guide lang={lang}/>}
    </div>
  );
}
