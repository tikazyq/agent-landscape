import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { C, mono, t } from "./shared";

// Draw rounded rectangle
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

// Generate the poster on a canvas and return as data URL
async function renderPoster(url, lang, title, subtitle) {
  const W = 640, H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#06080d");
  bg.addColorStop(1, "#0d1117");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative network lines
  const nodes = [
    [80, 80], [280, 160], [520, 100], [580, 260],
    [420, 340], [160, 300], [60, 220],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,4],[2,5]];
  ctx.strokeStyle = "rgba(77,142,255,0.12)";
  ctx.lineWidth = 1;
  for (const [a, b] of edges) {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  }

  // Decorative nodes
  const colors = ["#4d8eff","#a78bfa","#22d3ee","#fb7185","#fbbf24","#34d399","#4d8eff"];
  for (let i = 0; i < nodes.length; i++) {
    ctx.beginPath();
    ctx.arc(nodes[i][0], nodes[i][1], i % 2 === 0 ? 4 : 5, 0, Math.PI * 2);
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = 0.25;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Accent gradient bar
  const accent = ctx.createLinearGradient(50, 0, 200, 0);
  accent.addColorStop(0, "#4d8eff");
  accent.addColorStop(0.5, "#a78bfa");
  accent.addColorStop(1, "#fb7185");
  ctx.fillStyle = accent;
  roundRect(ctx, 50, 390, 100, 4, 2);
  ctx.fill();

  // Title
  ctx.fillStyle = "#e1e7ef";
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "top";

  // Word-wrap title
  const titleLines = wrapText(ctx, title, W - 100);
  let ty = 416;
  for (const line of titleLines) {
    ctx.fillText(line, 50, ty);
    ty += 46;
  }

  // Subtitle
  ctx.fillStyle = "#8b949e";
  ctx.font = "18px system-ui, -apple-system, sans-serif";
  const subLines = wrapText(ctx, subtitle, W - 100);
  ty += 8;
  for (const line of subLines) {
    ctx.fillText(line, 50, ty);
    ty += 26;
  }

  // Tags row
  ty += 16;
  const tags = [
    { text: lang === "zh" ? "协议栈" : "Protocol Stack", color: "#4d8eff" },
    { text: lang === "zh" ? "自动化" : "Automation", color: "#a78bfa" },
    { text: lang === "zh" ? "Agent 系统" : "Agent Systems", color: "#34d399" },
  ];
  ctx.font = "14px monospace";
  let tx = 50;
  for (const tag of tags) {
    const tw = ctx.measureText(tag.text).width + 20;
    ctx.fillStyle = tag.color;
    ctx.globalAlpha = 0.15;
    roundRect(ctx, tx, ty, tw, 28, 6);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = tag.color;
    ctx.fillText(tag.text, tx + 10, ty + 8);
    tx += tw + 10;
  }

  // Divider line
  const divY = H - 250;
  ctx.strokeStyle = "#1b2433";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, divY);
  ctx.lineTo(W - 50, divY);
  ctx.stroke();

  // QR code section
  const qrSize = 160;
  const qrX = W - 50 - qrSize;
  const qrY = divY + 24;

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: qrSize,
    margin: 1,
    color: { dark: "#e1e7ef", light: "#0d1117" },
    errorCorrectionLevel: "M",
  });

  // Draw QR with white background
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
  ctx.fill();

  // Draw QR image
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Scan hint text next to QR
  const hintX = 50;
  const hintY = qrY + 10;
  ctx.fillStyle = "#e1e7ef";
  ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "zh" ? "扫码查看" : "Scan to view", hintX, hintY);
  ctx.fillStyle = "#8b949e";
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "zh" ? "微信扫一扫 或 长按识别" : "WeChat scan or long-press", hintX, hintY + 28);
  ctx.fillText(lang === "zh" ? "AI Agent 全景交互图" : "AI Agent Interaction Landscape", hintX, hintY + 54);

  // Footer
  ctx.fillStyle = "#525e70";
  ctx.font = "12px monospace";
  ctx.fillText(
    lang === "zh" ? "L0 人工 → L5 自主编排 — 2026.3" : "L0 Manual → L5 Autonomous Orchestration — Mar 2026",
    50, H - 30
  );

  return canvas.toDataURL("image/png");
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
      // Try native share with file (best for mobile WeChat)
      const blob = await (await fetch(posterUrl)).blob();
      const file = new File([blob], "ai-agent-landscape.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "AI Agent Landscape" });
      } else {
        // Fallback: download the image
        const a = document.createElement("a");
        a.href = posterUrl;
        a.download = "ai-agent-landscape.png";
        a.click();
      }
    } catch {
      // If share was cancelled, just ignore
    }
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
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Poster preview */}
      <div style={{
        maxWidth: mobile ? "90vw" : 360,
        maxHeight: "70vh",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
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
            width: mobile ? "80vw" : 320, height: mobile ? "120vw" : 480,
            background: C.surface, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: C.textDim, fontFamily: mono, fontSize: 13,
          }}>
            {t({ en: "Generating…", zh: "生成中…" }, lang)}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        display: "flex", gap: 12, marginTop: 16,
      }}>
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
              : { en: "💾 Save / Share Image", zh: "💾 保存 / 分享图片" },
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

      {/* Hint */}
      <p style={{
        color: C.textDim, fontFamily: mono, fontSize: 11,
        marginTop: 12, textAlign: "center",
      }}>
        {t({
          en: "Long-press the image to save, then share in WeChat",
          zh: "长按图片保存，然后发送到微信",
        }, lang)}
      </p>
    </div>
  );
}
