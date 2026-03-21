import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { C, mono, t } from "./shared";

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let current = "";
  for (const char of text) {
    const test = current + char;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Content data for the poster
const spectrum = [
  { l:"L0", pct:100, name:{en:"Manual",zh:"人工"}, color:"#525e70" },
  { l:"L1", pct:80,  name:{en:"Assisted",zh:"辅助"}, color:"#4d8eff" },
  { l:"L2", pct:55,  name:{en:"Collab",zh:"协作"}, color:"#22d3ee" },
  { l:"L3", pct:25,  name:{en:"Semi-Auto",zh:"半自动"}, color:"#a78bfa" },
  { l:"L4", pct:5,   name:{en:"Full-Auto",zh:"全自动"}, color:"#fbbf24" },
  { l:"L5", pct:2,   name:{en:"Orchestr.",zh:"自主编排"}, color:"#fb7185" },
];

const insights = [
  {
    en: "Automation isn't replacing humans — it's amplifying the weight of each human decision.",
    zh: "自动化不是在替代人类 — 而是在放大每一个人类决策的权重。",
  },
  {
    en: "The most valuable AI infra in 2027 won't be the smartest model — it'll be the best guardrails.",
    zh: "2027 年最有价值的 AI 基础设施不是最聪明的模型 — 而是最好的护栏。",
  },
  {
    en: "Just like HTTP outlived Netscape, these protocols will outlive today's AI tools.",
    zh: "就像 HTTP 比 Netscape 活得久，这些协议将比今天的 AI 工具活得更久。",
  },
  {
    en: "You'll spend more time thinking about what to build than actually building it. That's the point.",
    zh: "你将花更多时间思考要构建什么，而非真正去构建。这正是关键。",
  },
];

const protocols = [
  { name:"MCP", desc:{en:"Agent↔Tool",zh:"Agent↔工具"}, color:"#4d8eff" },
  { name:"ACP", desc:{en:"Editor↔Agent",zh:"编辑器↔Agent"}, color:"#22d3ee" },
  { name:"A2A", desc:{en:"Agent↔Agent",zh:"Agent↔Agent"}, color:"#a78bfa" },
  { name:"AG-UI", desc:{en:"Agent↔UI",zh:"Agent↔前端"}, color:"#34d399" },
];

async function renderPoster(url, lang, title, subtitle) {
  const W = 720, H = 1280;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const PAD = 48;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#06080d");
  bg.addColorStop(0.6, "#0d1117");
  bg.addColorStop(1, "#0a0f18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(77,142,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = PAD; x < W - PAD; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, 380); ctx.stroke();
  }
  for (let y = 60; y < 380; y += 40) {
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
  }

  // Decorative network constellation (top area)
  const nodes = [
    [100, 100], [300, 80], [550, 120], [620, 200],
    [480, 280], [200, 260], [80, 200], [380, 180],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,7],[7,4],[7,2],[5,7]];
  ctx.strokeStyle = "rgba(77,142,255,0.10)";
  ctx.lineWidth = 1;
  for (const [a, b] of edges) {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  }
  const nodeColors = ["#4d8eff","#a78bfa","#22d3ee","#fb7185","#fbbf24","#34d399","#4d8eff","#a78bfa"];
  for (let i = 0; i < nodes.length; i++) {
    // Glow
    const grd = ctx.createRadialGradient(nodes[i][0], nodes[i][1], 0, nodes[i][0], nodes[i][1], 20);
    grd.addColorStop(0, nodeColors[i] + "30");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(nodes[i][0] - 20, nodes[i][1] - 20, 40, 40);
    // Dot
    ctx.beginPath();
    ctx.arc(nodes[i][0], nodes[i][1], 3, 0, Math.PI * 2);
    ctx.fillStyle = nodeColors[i];
    ctx.globalAlpha = 0.6;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── Title area ──
  let y = 340;

  // Accent bar
  const accent = ctx.createLinearGradient(PAD, 0, PAD + 80, 0);
  accent.addColorStop(0, "#4d8eff");
  accent.addColorStop(1, "#a78bfa");
  ctx.fillStyle = accent;
  roundRect(ctx, PAD, y, 60, 4, 2);
  ctx.fill();
  y += 28;

  // Title
  ctx.fillStyle = "#e1e7ef";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "top";
  const titleLines = wrapText(ctx, title, W - PAD * 2);
  for (const line of titleLines) {
    ctx.fillText(line, PAD, y);
    y += 42;
  }

  // Subtitle
  ctx.fillStyle = "#8b949e";
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  y += 4;
  const subLines = wrapText(ctx, subtitle, W - PAD * 2);
  for (const line of subLines) {
    ctx.fillText(line, PAD, y);
    y += 24;
  }

  // ── L0-L5 Automation Spectrum ──
  y += 28;
  ctx.fillStyle = "#525e70";
  ctx.font = "bold 11px monospace";
  ctx.fillText(lang === "zh" ? "▎自动化频谱" : "▎AUTOMATION SPECTRUM", PAD, y);
  y += 24;

  const barAreaW = W - PAD * 2;
  const barH = 32;
  const gap = 8;

  for (const level of spectrum) {
    // Background track
    ctx.fillStyle = "#131a24";
    roundRect(ctx, PAD, y, barAreaW, barH, 6);
    ctx.fill();

    // Filled bar (human effort %)
    const aiPct = 100 - level.pct;
    const fillW = Math.max(barAreaW * (aiPct / 100), 30);
    ctx.fillStyle = level.color + "30";
    roundRect(ctx, PAD, y, fillW, barH, 6);
    ctx.fill();

    // Left accent
    ctx.fillStyle = level.color;
    roundRect(ctx, PAD, y, 4, barH, 2);
    ctx.fill();

    // Level label
    ctx.fillStyle = level.color;
    ctx.font = "bold 13px monospace";
    ctx.fillText(level.l, PAD + 14, y + 11);

    // Name
    ctx.fillStyle = "#e1e7ef";
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.fillText(t(level.name, lang), PAD + 52, y + 11);

    // AI percentage on right
    ctx.fillStyle = level.color;
    ctx.font = "bold 12px monospace";
    const pctText = `${aiPct}% AI`;
    const pctW = ctx.measureText(pctText).width;
    ctx.fillText(pctText, PAD + barAreaW - pctW - 12, y + 11);

    y += barH + gap;
  }

  // ── Protocol Stack ──
  y += 16;
  ctx.fillStyle = "#525e70";
  ctx.font = "bold 11px monospace";
  ctx.fillText(lang === "zh" ? "▎协议栈" : "▎PROTOCOL STACK", PAD, y);
  y += 20;

  const protoW = (barAreaW - 12 * 3) / 4;
  for (let i = 0; i < protocols.length; i++) {
    const px = PAD + i * (protoW + 12);
    // Card bg
    ctx.fillStyle = protocols[i].color + "12";
    roundRect(ctx, px, y, protoW, 56, 8);
    ctx.fill();
    // Border
    ctx.strokeStyle = protocols[i].color + "30";
    ctx.lineWidth = 1;
    roundRect(ctx, px, y, protoW, 56, 8);
    ctx.stroke();
    // Name
    ctx.fillStyle = protocols[i].color;
    ctx.font = "bold 14px monospace";
    const nameW = ctx.measureText(protocols[i].name).width;
    ctx.fillText(protocols[i].name, px + (protoW - nameW) / 2, y + 14);
    // Desc
    ctx.fillStyle = "#8b949e";
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    const descText = t(protocols[i].desc, lang);
    const descW = ctx.measureText(descText).width;
    ctx.fillText(descText, px + (protoW - descW) / 2, y + 36);
  }
  y += 56;

  // ── Insight Quote ──
  y += 28;
  const insight = insights[Math.floor(Math.random() * insights.length)];
  const quoteText = t(insight, lang);

  // Quote background
  ctx.fillStyle = "#4d8eff08";
  roundRect(ctx, PAD, y, barAreaW, 0, 10); // measure first
  ctx.font = "italic 15px system-ui, -apple-system, sans-serif";
  const quoteLines = wrapText(ctx, quoteText, barAreaW - 48);
  const quoteH = quoteLines.length * 24 + 28;
  ctx.fillStyle = "#4d8eff0a";
  roundRect(ctx, PAD, y, barAreaW, quoteH, 10);
  ctx.fill();

  // Quote accent
  ctx.fillStyle = "#4d8eff40";
  roundRect(ctx, PAD, y, 3, quoteH, 2);
  ctx.fill();

  // Quote mark
  ctx.fillStyle = "#4d8eff60";
  ctx.font = "bold 28px serif";
  ctx.fillText("\u201C", PAD + 16, y + 12);

  // Quote text
  ctx.fillStyle = "#c8d1dc";
  ctx.font = "italic 15px system-ui, -apple-system, sans-serif";
  let qy = y + 18;
  for (const line of quoteLines) {
    ctx.fillText(line, PAD + 24, qy);
    qy += 24;
  }
  y += quoteH;

  // ── Bottom: QR + CTA ──
  const bottomY = H - 200;

  // Divider
  ctx.strokeStyle = "#1b2433";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, bottomY);
  ctx.lineTo(W - PAD, bottomY);
  ctx.stroke();

  // QR code
  const qrSize = 140;
  const qrX = W - PAD - qrSize;
  const qrY = bottomY + 24;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: qrSize * 2,
    margin: 1,
    color: { dark: "#1a2332", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  // QR white bg
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
  ctx.fill();

  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // CTA text
  ctx.fillStyle = "#e1e7ef";
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "zh" ? "扫码查看完整全景" : "Scan for full landscape", PAD, bottomY + 36);

  ctx.fillStyle = "#8b949e";
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    lang === "zh" ? "微信扫一扫 或 长按识别二维码" : "Scan QR or long-press to recognize",
    PAD, bottomY + 64
  );

  // Mini protocol tags at bottom
  ctx.font = "11px monospace";
  const miniTags = ["MCP","ACP","A2A","AG-UI","A2UI"];
  let mtx = PAD;
  const mty = bottomY + 100;
  for (const tag of miniTags) {
    const tw = ctx.measureText(tag).width + 14;
    ctx.fillStyle = "#4d8eff18";
    roundRect(ctx, mtx, mty, tw, 22, 4);
    ctx.fill();
    ctx.fillStyle = "#4d8eff";
    ctx.fillText(tag, mtx + 7, mty + 6);
    mtx += tw + 6;
  }

  // Footer
  ctx.fillStyle = "#383f4a";
  ctx.font = "11px monospace";
  ctx.fillText(
    lang === "zh" ? "AI Agent Landscape · 2026.3" : "AI Agent Landscape · Mar 2026",
    PAD, H - 28
  );

  return canvas.toDataURL("image/png");
}

export default function SharePoster({ lang, mobile, title, subtitle, onClose }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const url = window.location.href;
    renderPoster(url, lang, title, subtitle).then(setPosterUrl);
  }, [lang, title, subtitle]);

  const handleSave = useCallback(async () => {
    if (!posterUrl) return;
    setSaving(true);
    try {
      const blob = await (await fetch(posterUrl)).blob();
      const file = new File([blob], "ai-agent-landscape.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "AI Agent Landscape" });
      } else {
        const a = document.createElement("a");
        a.href = posterUrl;
        a.download = "ai-agent-landscape.png";
        a.click();
      }
    } catch {}
    setSaving(false);
  }, [posterUrl]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{
        maxWidth: mobile ? "92vw" : 400,
        maxHeight: "75vh",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 20px 80px rgba(0,0,0,0.7)",
        border: `1px solid ${C.border}`,
      }}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt="Share poster"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <div style={{
            width: mobile ? "85vw" : 360, height: mobile ? "150vw" : 640,
            background: C.surface, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: C.textDim, fontFamily: mono, fontSize: 13,
          }}>
            {t({ en: "Generating…", zh: "生成中…" }, lang)}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={handleSave} disabled={!posterUrl || saving} style={{
          background: C.blue, color: "#fff", border: "none",
          borderRadius: 24, padding: "10px 24px",
          fontFamily: mono, fontSize: 13, fontWeight: 600,
          cursor: posterUrl ? "pointer" : "default",
          opacity: posterUrl ? 1 : 0.5,
          transition: "opacity 0.2s ease",
        }}>
          {t(
            saving
              ? { en: "Sharing…", zh: "分享中…" }
              : { en: "💾 Save / Share", zh: "💾 保存 / 分享" },
            lang
          )}
        </button>
        <button onClick={onClose} style={{
          background: C.surface, color: C.textSub,
          border: `1px solid ${C.border}`,
          borderRadius: 24, padding: "10px 20px",
          fontFamily: mono, fontSize: 13, fontWeight: 500,
          cursor: "pointer",
        }}>
          {t({ en: "Close", zh: "关闭" }, lang)}
        </button>
      </div>

      <p style={{
        color: C.textDim, fontFamily: mono, fontSize: 11,
        marginTop: 12, textAlign: "center",
      }}>
        {t({
          en: "Long-press image to save · Share in any chat",
          zh: "长按图片保存 · 发送到任意聊天",
        }, lang)}
      </p>
    </div>
  );
}
