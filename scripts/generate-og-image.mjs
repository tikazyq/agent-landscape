import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background gradient
const bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, '#06080d');
bg.addColorStop(1, '#0d1117');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Network lines
const nodes = [
  [100, 100], [400, 250], [700, 150], [1000, 300],
  [800, 480], [500, 400], [200, 500],
];
const edges = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5],[2,4],
];
ctx.strokeStyle = 'rgba(77,142,255,0.15)';
ctx.lineWidth = 1.5;
for (const [a, b] of edges) {
  ctx.beginPath();
  ctx.moveTo(nodes[a][0], nodes[a][1]);
  ctx.lineTo(nodes[b][0], nodes[b][1]);
  ctx.stroke();
}

// Nodes
const colors = ['#4d8eff','#a78bfa','#22d3ee','#fb7185','#fbbf24','#34d399','#4d8eff'];
for (let i = 0; i < nodes.length; i++) {
  ctx.beginPath();
  ctx.arc(nodes[i][0], nodes[i][1], i % 2 === 0 ? 6 : 8, 0, Math.PI * 2);
  ctx.fillStyle = colors[i];
  ctx.globalAlpha = 0.3;
  ctx.fill();
}
ctx.globalAlpha = 1;

// Accent bar
const accent = ctx.createLinearGradient(100, 0, 220, 0);
accent.addColorStop(0, '#4d8eff');
accent.addColorStop(0.5, '#a78bfa');
accent.addColorStop(1, '#fb7185');
ctx.fillStyle = accent;
roundRect(ctx, 100, 260, 120, 4, 2);
ctx.fill();

// Title
ctx.fillStyle = '#e1e7ef';
ctx.font = 'bold 56px sans-serif';
ctx.fillText('AI Agent Landscape', 100, 320);

// Subtitle
ctx.fillStyle = '#8b949e';
ctx.font = '26px sans-serif';
ctx.fillText('Multi-Platform AI Agent Interaction Landscape', 100, 380);

// Tags
const tags = [
  { text: 'Protocol Stack', color: '#4d8eff', x: 100 },
  { text: 'Automation', color: '#a78bfa', x: 290 },
  { text: 'Agent Systems', color: '#34d399', x: 440 },
];
ctx.font = '18px monospace';
for (const tag of tags) {
  const w = ctx.measureText(tag.text).width + 24;
  ctx.fillStyle = tag.color;
  ctx.globalAlpha = 0.12;
  roundRect(ctx, tag.x, 420, w, 34, 6);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = tag.color;
  ctx.fillText(tag.text, tag.x + 12, 443);
}

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

writeFileSync('public/og-image.png', canvas.toBuffer('image/png'));
console.log('Generated public/og-image.png');
