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

// Automation spectrum with time story
const spectrum = [
  { l:"L0", pct:100, name:{en:"Manual",zh:"人工"}, color:"#525e70", time:{en:"4h",zh:"4小时"} },
  { l:"L1", pct:80,  name:{en:"Assisted",zh:"辅助"}, color:"#4d8eff", time:{en:"2h",zh:"2小时"} },
  { l:"L2", pct:55,  name:{en:"Collab",zh:"协作"}, color:"#22d3ee", time:{en:"45m",zh:"45分钟"}, here:true },
  { l:"L3", pct:25,  name:{en:"Semi-Auto",zh:"半自动"}, color:"#a78bfa", time:{en:"25m",zh:"25分钟"} },
  { l:"L4", pct:5,   name:{en:"Full-Auto",zh:"全自动"}, color:"#fbbf24", time:{en:"8m",zh:"8分钟"} },
  { l:"L5", pct:2,   name:{en:"Orchestr.",zh:"自主编排"}, color:"#fb7185", time:{en:"0m*",zh:"0分钟*"} },
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
  { name:"MCP", org:"Anthropic", desc:{en:"Agent↔Tool",zh:"Agent↔工具"}, color:"#4d8eff" },
  { name:"ACP", org:"JetBrains", desc:{en:"Editor↔Agent",zh:"编辑器↔Agent"}, color:"#22d3ee" },
  { name:"A2A", org:"Google", desc:{en:"Agent↔Agent",zh:"Agent↔Agent"}, color:"#a78bfa" },
  { name:"AG-UI", org:"CopilotKit", desc:{en:"Agent↔UI",zh:"Agent↔前端"}, color:"#34d399" },
];

// Key stats for the hero section
const stats = [
  { value:"6", label:{en:"Levels",zh:"级别"}, color:"#4d8eff" },
  { value:"7", label:{en:"Layers",zh:"层级"}, color:"#a78bfa" },
  { value:"18", label:{en:"Tools",zh:"工具"}, color:"#22d3ee" },
  { value:"6", label:{en:"Protocols",zh:"协议"}, color:"#34d399" },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

async function renderPoster(url, lang, title, subtitle) {
  const W = 720, H = 1420;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const PAD = 48;
  const barAreaW = W - PAD * 2;

  // ── Rich gradient background ──
  const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bg.addColorStop(0, "#050810");
  bg.addColorStop(0.3, "#0a1020");
  bg.addColorStop(0.6, "#0d1117");
  bg.addColorStop(1, "#060a12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Ambient color blobs for depth ──
  const blobs = [
    { x: 120, y: 160, r: 200, color: "77,142,255", alpha: 0.04 },
    { x: 580, y: 100, r: 160, color: "167,139,250", alpha: 0.03 },
    { x: 400, y: 800, r: 250, color: "34,211,238", alpha: 0.02 },
    { x: 600, y: 1200, r: 180, color: "251,191,36", alpha: 0.02 },
  ];
  for (const blob of blobs) {
    const grd = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
    grd.addColorStop(0, `rgba(${blob.color},${blob.alpha})`);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(blob.x - blob.r, blob.y - blob.r, blob.r * 2, blob.r * 2);
  }

  // ── Fine dot grid pattern (top area only) ──
  ctx.fillStyle = "rgba(77,142,255,0.06)";
  for (let x = PAD; x < W - PAD; x += 32) {
    for (let gy = 60; gy < 300; gy += 32) {
      ctx.beginPath();
      ctx.arc(x, gy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Network constellation with glow (top area) ──
  const nodes = [
    { pos: [90, 90], size: 5 },
    { pos: [250, 60], size: 4 },
    { pos: [420, 100], size: 6 },
    { pos: [580, 80], size: 3 },
    { pos: [640, 190], size: 5 },
    { pos: [520, 250], size: 4 },
    { pos: [300, 220], size: 3 },
    { pos: [140, 200], size: 4 },
    { pos: [60, 150], size: 3 },
    { pos: [380, 160], size: 5 },
    { pos: [200, 140], size: 3 },
    { pos: [500, 150], size: 4 },
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],
    [1,10],[10,9],[9,2],[9,11],[11,5],[6,9],[2,11],[7,10],
  ];
  const nodeColors = [
    "#4d8eff","#a78bfa","#22d3ee","#fb7185","#fbbf24","#34d399",
    "#4d8eff","#a78bfa","#22d3ee","#fb7185","#fbbf24","#34d399",
  ];

  // Draw edges with gradient
  for (const [a, b] of edges) {
    const grad = ctx.createLinearGradient(
      nodes[a].pos[0], nodes[a].pos[1],
      nodes[b].pos[0], nodes[b].pos[1]
    );
    grad.addColorStop(0, nodeColors[a] + "18");
    grad.addColorStop(0.5, nodeColors[a] + "10");
    grad.addColorStop(1, nodeColors[b] + "18");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(nodes[a].pos[0], nodes[a].pos[1]);
    ctx.lineTo(nodes[b].pos[0], nodes[b].pos[1]);
    ctx.stroke();
  }

  // Draw nodes with glow
  for (let i = 0; i < nodes.length; i++) {
    const [nx, ny] = nodes[i].pos;
    const { r, g, b } = hexToRgb(nodeColors[i]);
    const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 28);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
    grd.addColorStop(0.5, `rgba(${r},${g},${b},0.04)`);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(nx - 28, ny - 28, 56, 56);
    ctx.beginPath();
    ctx.arc(nx, ny, nodes[i].size, 0, Math.PI * 2);
    ctx.fillStyle = nodeColors[i];
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(nx, ny, nodes[i].size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.5;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── Title area ──
  let y = 300;

  // Gradient accent bar
  const accentGr = ctx.createLinearGradient(PAD, 0, PAD + 100, 0);
  accentGr.addColorStop(0, "#4d8eff");
  accentGr.addColorStop(1, "#a78bfa");
  ctx.fillStyle = accentGr;
  roundRect(ctx, PAD, y, 80, 4, 2);
  ctx.fill();
  y += 32;

  // Title
  ctx.shadowColor = "rgba(77,142,255,0.2)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#f0f4f8";
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "top";
  const titleLines = wrapText(ctx, title, W - PAD * 2);
  for (const line of titleLines) {
    ctx.fillText(line, PAD, y);
    y += 48;
  }
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = "#8b949e";
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  y += 2;
  const subLines = wrapText(ctx, subtitle, W - PAD * 2);
  for (const line of subLines) {
    ctx.fillText(line, PAD, y);
    y += 24;
  }

  // ── Key Stats Row ──
  y += 24;
  const statW = (barAreaW - 10 * 3) / 4;
  for (let i = 0; i < stats.length; i++) {
    const sx = PAD + i * (statW + 10);
    const { r, g, b } = hexToRgb(stats[i].color);

    // Stat card background
    ctx.fillStyle = `rgba(${r},${g},${b},0.06)`;
    roundRect(ctx, sx, y, statW, 56, 10);
    ctx.fill();
    ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
    ctx.lineWidth = 1;
    roundRect(ctx, sx, y, statW, 56, 10);
    ctx.stroke();

    // Big number
    ctx.fillStyle = stats[i].color;
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    const numW = ctx.measureText(stats[i].value).width;
    ctx.fillText(stats[i].value, sx + (statW - numW) / 2, y + 6);

    // Label
    ctx.fillStyle = "#8b949e";
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    const lblText = t(stats[i].label, lang);
    const lblW = ctx.measureText(lblText).width;
    ctx.fillText(lblText, sx + (statW - lblW) / 2, y + 36);
  }
  y += 56;

  // ── L0-L5 Automation Spectrum with time + "WE ARE HERE" ──
  y += 28;
  ctx.fillStyle = "#6b7685";
  ctx.font = "bold 12px monospace";
  ctx.fillText(lang === "zh" ? "▎同一个 Bug 修复，不同自动化级别" : "▎SAME BUG FIX — DIFFERENT AUTOMATION", PAD, y);
  y += 26;

  const barH = 34;
  const gap = 5;

  for (const level of spectrum) {
    // Background track
    ctx.fillStyle = "#0f1520";
    roundRect(ctx, PAD, y, barAreaW, barH, 8);
    ctx.fill();
    ctx.strokeStyle = "#1a2030";
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, y, barAreaW, barH, 8);
    ctx.stroke();

    // Gradient filled bar
    const aiPct = 100 - level.pct;
    const fillW = Math.max(barAreaW * (aiPct / 100), 36);
    const { r, g, b } = hexToRgb(level.color);
    const barGrad = ctx.createLinearGradient(PAD, 0, PAD + fillW, 0);
    barGrad.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
    barGrad.addColorStop(1, `rgba(${r},${g},${b},0.08)`);
    ctx.fillStyle = barGrad;
    roundRect(ctx, PAD, y, fillW, barH, 8);
    ctx.fill();

    // Left accent
    const accentGrad = ctx.createLinearGradient(PAD, y, PAD, y + barH);
    accentGrad.addColorStop(0, level.color);
    accentGrad.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
    ctx.fillStyle = accentGrad;
    roundRect(ctx, PAD, y, 4, barH, 2);
    ctx.fill();

    // Level badge
    ctx.fillStyle = level.color + "20";
    roundRect(ctx, PAD + 12, y + 5, 32, barH - 10, 5);
    ctx.fill();
    ctx.fillStyle = level.color;
    ctx.font = "bold 13px monospace";
    ctx.fillText(level.l, PAD + 16, y + 11);

    // Name
    ctx.fillStyle = "#e1e7ef";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText(t(level.name, lang), PAD + 56, y + 11);

    // Time on right
    ctx.fillStyle = level.color;
    ctx.font = "bold 13px monospace";
    const timeText = t(level.time, lang);
    const timeW = ctx.measureText(timeText).width;
    ctx.fillText(timeText, PAD + barAreaW - timeW - 14, y + 11);

    y += barH + gap;

    // "WE ARE HERE" marker after L2
    if (level.here) {
      const markerY = y - 1;
      // Dashed line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, markerY);
      ctx.lineTo(W - PAD, markerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      const hereText = lang === "zh" ? "← 我们在这里 (2026)" : "← WE ARE HERE (2026)";
      ctx.font = "bold 11px monospace";
      const hereW = ctx.measureText(hereText).width;
      // Background pill
      ctx.fillStyle = "#fbbf24" + "20";
      roundRect(ctx, W - PAD - hereW - 18, markerY - 11, hereW + 16, 20, 4);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(hereText, W - PAD - hereW - 10, markerY - 5);
      y += 18;
    }
  }

  // Time reduction callout
  y += 6;
  const calloutText = lang === "zh"
    ? "人力投入：4小时 → 0分钟 · 决策杠杆指数级增长"
    : "Human effort: 4h → 0min · Decision leverage grows exponentially";
  ctx.fillStyle = "#525e70";
  ctx.font = "italic 11px system-ui, -apple-system, sans-serif";
  ctx.fillText(calloutText, PAD, y);

  // ── Protocol Stack with company attribution ──
  y += 28;
  ctx.fillStyle = "#6b7685";
  ctx.font = "bold 12px monospace";
  ctx.fillText(lang === "zh" ? "▎协议栈" : "▎PROTOCOL STACK", PAD, y);
  y += 24;

  const protoW = (barAreaW - 10 * 3) / 4;
  const protoH = 72;
  for (let i = 0; i < protocols.length; i++) {
    const px = PAD + i * (protoW + 10);
    const { r, g, b } = hexToRgb(protocols[i].color);

    // Card bg
    const cardGrad = ctx.createLinearGradient(px, y, px, y + protoH);
    cardGrad.addColorStop(0, `rgba(${r},${g},${b},0.10)`);
    cardGrad.addColorStop(1, `rgba(${r},${g},${b},0.03)`);
    ctx.fillStyle = cardGrad;
    roundRect(ctx, px, y, protoW, protoH, 10);
    ctx.fill();

    // Border
    ctx.strokeStyle = `rgba(${r},${g},${b},0.20)`;
    ctx.lineWidth = 1;
    roundRect(ctx, px, y, protoW, protoH, 10);
    ctx.stroke();

    // Top accent line
    ctx.fillStyle = protocols[i].color;
    roundRect(ctx, px + 12, y, protoW - 24, 2, 1);
    ctx.fill();

    // Name
    ctx.fillStyle = protocols[i].color;
    ctx.font = "bold 15px monospace";
    const nameW = ctx.measureText(protocols[i].name).width;
    ctx.fillText(protocols[i].name, px + (protoW - nameW) / 2, y + 14);

    // Company
    ctx.fillStyle = "#525e70";
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    const orgW = ctx.measureText(protocols[i].org).width;
    ctx.fillText(protocols[i].org, px + (protoW - orgW) / 2, y + 34);

    // Desc
    ctx.fillStyle = "#8b949e";
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    const descText = t(protocols[i].desc, lang);
    const descW = ctx.measureText(descText).width;
    ctx.fillText(descText, px + (protoW - descW) / 2, y + 50);
  }
  y += protoH;

  // ── Insight Quote ──
  y += 28;
  const insight = insights[Math.floor(Math.random() * insights.length)];
  const quoteText = t(insight, lang);

  ctx.font = "italic 15px system-ui, -apple-system, sans-serif";
  const quoteLines = wrapText(ctx, quoteText, barAreaW - 56);
  const quoteH = quoteLines.length * 26 + 32;

  // Quote background
  const quoteBg = ctx.createLinearGradient(PAD, y, PAD + barAreaW, y);
  quoteBg.addColorStop(0, "rgba(77,142,255,0.06)");
  quoteBg.addColorStop(1, "rgba(167,139,250,0.03)");
  ctx.fillStyle = quoteBg;
  roundRect(ctx, PAD, y, barAreaW, quoteH, 12);
  ctx.fill();

  // Quote left accent
  const quoteAccent = ctx.createLinearGradient(PAD, y, PAD, y + quoteH);
  quoteAccent.addColorStop(0, "#4d8eff");
  quoteAccent.addColorStop(1, "#a78bfa");
  ctx.fillStyle = quoteAccent;
  roundRect(ctx, PAD, y, 3, quoteH, 2);
  ctx.fill();

  // Quote mark
  ctx.fillStyle = "#4d8eff50";
  ctx.font = "bold 32px serif";
  ctx.fillText("\u201C", PAD + 18, y + 10);

  // Quote text
  ctx.fillStyle = "#d0d8e4";
  ctx.font = "italic 15px system-ui, -apple-system, sans-serif";
  let qy = y + 20;
  for (const line of quoteLines) {
    ctx.fillText(line, PAD + 28, qy);
    qy += 26;
  }
  y += quoteH;

  // ── Bottom: QR + CTA ──
  const bottomY = H - 210;

  // Decorative divider
  const divGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  divGrad.addColorStop(0, "transparent");
  divGrad.addColorStop(0.2, "#1b2433");
  divGrad.addColorStop(0.8, "#1b2433");
  divGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, bottomY);
  ctx.lineTo(W - PAD, bottomY);
  ctx.stroke();

  // QR code
  const qrSize = 140;
  const qrX = W - PAD - qrSize;
  const qrY = bottomY + 28;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: qrSize * 2,
    margin: 1,
    color: { dark: "#1a2332", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  // QR white bg with shadow
  ctx.shadowColor = "rgba(77,142,255,0.15)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 14);
  ctx.fill();
  ctx.shadowBlur = 0;

  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // CTA text
  ctx.fillStyle = "#f0f4f8";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "zh" ? "扫码查看完整全景" : "Scan for full landscape", PAD, bottomY + 36);

  ctx.fillStyle = "#8b949e";
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    lang === "zh" ? "覆盖 18 款工具 · 7 层协议架构" : "18 tools mapped · 7-layer protocol architecture",
    PAD, bottomY + 64
  );

  ctx.fillStyle = "#525e70";
  ctx.font = "13px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    lang === "zh" ? "微信扫一扫 或 长按识别二维码" : "Scan QR or long-press to recognize",
    PAD, bottomY + 88
  );

  // Mini protocol tags at bottom
  ctx.font = "11px monospace";
  const miniTags = [
    { name: "MCP", color: "#4d8eff" },
    { name: "ACP", color: "#22d3ee" },
    { name: "A2A", color: "#a78bfa" },
    { name: "AG-UI", color: "#34d399" },
    { name: "A2UI", color: "#fbbf24" },
  ];
  let mtx = PAD;
  const mty = bottomY + 118;
  for (const tag of miniTags) {
    const tw = ctx.measureText(tag.name).width + 16;
    ctx.fillStyle = tag.color + "15";
    roundRect(ctx, mtx, mty, tw, 24, 5);
    ctx.fill();
    ctx.strokeStyle = tag.color + "25";
    ctx.lineWidth = 1;
    roundRect(ctx, mtx, mty, tw, 24, 5);
    ctx.stroke();
    ctx.fillStyle = tag.color;
    ctx.fillText(tag.name, mtx + 8, mty + 7);
    mtx += tw + 8;
  }

  // Footer
  ctx.fillStyle = "#383f4a";
  ctx.font = "11px monospace";
  ctx.fillText(
    lang === "zh" ? "AI Agent Landscape · 2026.3" : "AI Agent Landscape · Mar 2026",
    PAD, H - 28
  );

  // ── Subtle border frame ──
  ctx.strokeStyle = "rgba(77,142,255,0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, 12, 12, W - 24, H - 24, 20);
  ctx.stroke();

  return canvas.toDataURL("image/png");
}

export default function SharePoster({ lang, mobile, title, subtitle, onClose }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const overlayRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const url = window.location.href;
    renderPoster(url, lang, title, subtitle).then(setPosterUrl);
  }, [lang, title, subtitle]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleSave = useCallback(async () => {
    if (!posterUrl) return;
    setSaving(true);
    try {
      const blob = await (await fetch(posterUrl)).blob();
      const file = new File([blob], "ai-agent-landscape.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "AI Agent Landscape" });
        showToast(t({ en: "Shared successfully!", zh: "分享成功！" }, lang));
      } else {
        const a = document.createElement("a");
        a.href = posterUrl;
        a.download = "ai-agent-landscape.png";
        a.click();
        showToast(t({ en: "Image saved to downloads!", zh: "图片已保存到下载！" }, lang));
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        showToast(t({ en: "Save failed, please long-press image to save", zh: "保存失败，请长按图片保存" }, lang), "error");
      }
    }
    setSaving(false);
  }, [posterUrl, lang, showToast]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 10001,
          background: toast.type === "error" ? "#dc2626" : "#059669",
          color: "#fff",
          padding: "10px 24px",
          borderRadius: 24,
          fontFamily: mono, fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "toast-in 0.3s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div style={{
        maxWidth: mobile ? "92vw" : 400,
        maxHeight: "78vh",
        borderRadius: 16, overflow: "hidden auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(77,142,255,0.08)",
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
          background: posterUrl ? "linear-gradient(135deg, #4d8eff, #6366f1)" : C.surface,
          color: "#fff", border: "none",
          borderRadius: 24, padding: "10px 28px",
          fontFamily: mono, fontSize: 13, fontWeight: 600,
          cursor: posterUrl ? "pointer" : "default",
          opacity: posterUrl ? 1 : 0.5,
          transition: "all 0.2s ease",
          boxShadow: posterUrl ? "0 4px 16px rgba(77,142,255,0.3)" : "none",
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
