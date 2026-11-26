// Draws a mission sheet in the style of the SAS: Rogue Regiment mission book.
// Letter page at 150 dpi: 1275 x 1650 px. The page grows taller if the text needs it.
import { PIECE } from './data/catalog.js?v=8558a541';
import { boardCanvas, keyLabel, isObjective, drawPiece, pieceSize, img, pieceSrc, preload } from './board.js?v=8558a541';

export const C = {
  crimson: '#b00c36', charcoal: '#231f20', olive: '#2f3623', khaki: '#c9c39f',
  paper1: '#f4f0e2', paper2: '#e2dcc2', ink: '#231f20',
};
const TRACK = ['#3e4220', '#585a28', '#7a7a2a', '#9a9226', '#c3a81c', '#f2ae13', '#e48823', '#d5632e', '#c84234'];
const W = 1275, PAGE_H = 1650;
const DISPLAY = '"Russo One", "Arial Black", sans-serif';
const BODY = 'Lato, "Gill Sans", "Segoe UI", sans-serif';

export async function fontsReady() {
  try { await Promise.all([document.fonts.load(`40px ${DISPLAY}`), document.fonts.load(`20px Lato`), document.fonts.load(`bold 20px Lato`), document.fonts.load(`italic 20px Lato`)]); } catch { /* ignore */ }
}

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// Wrap text into lines. Segments: [{t, b(bold), i(italic)}]. Returns lines of segments.
function wrapRich(ctx, segs, maxW, size) {
  const font = s => `${s.i ? 'italic ' : ''}${s.b ? 'bold ' : ''}${size}px ${BODY}`;
  const words = [];
  for (const s of segs) s.t.split(/(\s+)/).forEach(w => { if (w) words.push({ ...s, t: w }); });
  const lines = []; let line = [], lw = 0;
  for (const w of words) {
    ctx.font = font(w); const ww = ctx.measureText(w.t).width;
    if (/^\s+$/.test(w.t)) { if (line.length) { line.push(w); lw += ww; } continue; }
    if (lw + ww > maxW && line.length) {
      while (line.length && /^\s+$/.test(line[line.length - 1].t)) line.pop();
      lines.push(line); line = []; lw = 0;
    }
    line.push(w); lw += ww;
  }
  if (line.length) lines.push(line);
  return { lines, font };
}
function drawRich(ctx, wrapped, x, y, lh, align = 'left', maxW = 0) {
  for (const line of wrapped.lines) {
    let total = 0;
    for (const w of line) { ctx.font = wrapped.font(w); total += ctx.measureText(w.t).width; }
    let cx = align === 'center' ? x + (maxW - total) / 2 : x;
    for (const w of line) { ctx.font = wrapped.font(w); ctx.fillText(w.t, cx, y); cx += ctx.measureText(w.t).width; }
    y += lh;
  }
  return y;
}
// "**bold**" markup to segments
function rich(text, base = {}) {
  const out = []; const re = /\*\*(.+?)\*\*/g; let i = 0, m;
  while ((m = re.exec(text))) { if (m.index > i) out.push({ ...base, t: text.slice(i, m.index) }); out.push({ ...base, b: true, t: m[1] }); i = re.lastIndex; }
  if (i < text.length) out.push({ ...base, t: text.slice(i) });
  return out;
}

export function keyEntries(board) {
  const keys = new Map(), objs = new Map();
  for (const pc of board.pieces) {
    const label = keyLabel(pc);
    const target = isObjective(pc) ? objs : keys;
    if (!target.has(label)) target.set(label, pc);
  }
  return { key: [...keys].map(([label, pc]) => ({ label, pc })), objectives: [...objs].map(([label, pc]) => ({ label, pc })) };
}

function drawKeyIcon(ctx, pc, x, y, boxW, boxH) {
  const def = PIECE[pc.p];
  const flat = { ...pc, x: 0, y: 0, rot: 0 };
  const { w, h } = pieceSize(flat);
  const s = Math.min(boxW / w, boxH / h, def.kind === 'token' || def.kind === 'marker' ? 34 : 999);
  ctx.save();
  ctx.translate(x + (boxW - w * s) / 2, y + (boxH - h * s) / 2);
  drawPiece(ctx, flat, s);
  ctx.restore();
}

export async function renderSheet(m) {
  await fontsReady();
  const srcs = m.board.pieces.map(pieceSrc).filter(Boolean);
  await preload(srcs);
  const map = boardCanvas(m.board, 48, 0.25);

  // measure pass on a scratch canvas
  const scratch = document.createElement('canvas').getContext('2d');
  const colX = 905, colW = 310;
  const { key, objectives } = keyEntries(m.board);
  const rowH = 46;
  const keyH = key.length || objectives.length ? 56 + key.length * rowH + (objectives.length ? 52 + objectives.length * rowH : 0) + 18 : 0;
  const setupLines = [];
  const st = m.setup || {};
  if (st.operators) setupLines.push(rich(`Operators: **${st.operators}**`));
  if (st.deck) setupLines.push(rich(`Event deck: **${st.deck}**`));
  if (st.window) setupLines.push(rich(`Event Window: **${st.window}**`));
  const setupWrapped = setupLines.map(l => wrapRich(scratch, l, colW - 36, 21));
  const noteWrapped = st.note ? wrapRich(scratch, rich(st.note, { i: false }), colW - 36, 16) : null;
  const setupH = setupLines.length || noteWrapped ? 56 + setupWrapped.reduce((a, w) => a + w.lines.length * 28, 0) + (noteWrapped ? 10 + noteWrapped.lines.length * 21 : 0) + 22 : 0;

  // map box
  const mapX = 60, mapY = 185, mapMaxW = colX - mapX - 40, mapMaxH = 860;
  const sc = Math.min(mapMaxW / map.width, mapMaxH / map.height, 1.2);
  const mw = map.width * sc, mh = map.height * sc;
  const colBottom = mapY + keyH + (keyH && setupH ? 26 : 0) + setupH;
  const top2 = Math.max(mapY + mh, colBottom) + 40;

  // briefing panel text
  const textW = W - 2 * 95 - 2 * 40;
  const quote = m.quote ? wrapRich(scratch, [{ t: `“${m.quote.trim()}”${m.speaker ? ' - ' + m.speaker.trim() : ''}`, i: true }], textW, 24) : null;
  const paras = (m.briefing || '').split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean).map(p => wrapRich(scratch, rich(p), textW, 22));
  let panelH = 40 + (quote ? quote.lines.length * 32 + 20 : 0) + paras.reduce((a, p) => a + p.lines.length * 30 + 14, 0) + 100;
  const trackY = top2 + panelH + 50;
  const H = Math.max(PAGE_H, trackY + 200);

  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingQuality = 'high';

  // background
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.12, C.paper1); g.addColorStop(1, C.paper2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // title bar
  const title = ((m.number ? `Mission ${m.number} - ` : '') + (m.title || 'Untitled mission')).toUpperCase();
  rr(ctx, 50, 60, W - 100, 82, 41); ctx.fillStyle = C.crimson; ctx.fill();
  const type = (m.type || '').toUpperCase();
  let typeW = 0;
  if (type) {
    ctx.font = `26px ${DISPLAY}`; typeW = Math.max(170, ctx.measureText(type).width + 60);
    rr(ctx, W - 62 - typeW, 70, typeW, 62, 31); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = C.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(type, W - 62 - typeW / 2, 102);
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
  let ts = 40; ctx.font = `${ts}px ${DISPLAY}`;
  while (ctx.measureText(title).width > W - 200 - typeW && ts > 22) { ts -= 2; ctx.font = `${ts}px ${DISPLAY}`; }
  ctx.fillText(title, 95, 103);

  // map
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
  ctx.drawImage(map, mapX + (mapMaxW - mw) / 2, mapY, mw, mh);
  ctx.restore();

  // key panel
  let y = mapY;
  const panel = (title, h) => {
    ctx.fillStyle = '#fff'; ctx.fillRect(colX, y, colW, h);
    ctx.fillStyle = C.olive; ctx.fillRect(colX, y, colW, 46);
    ctx.strokeStyle = C.olive; ctx.lineWidth = 2; ctx.strokeRect(colX, y, colW, h);
    ctx.fillStyle = '#fff'; ctx.font = `22px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(title, colX + colW / 2, y + 24); ctx.textAlign = 'left';
  };
  if (keyH) {
    panel('KEY', keyH);
    let ky = y + 60;
    const row = e => {
      drawKeyIcon(ctx, e.pc, colX + 16, ky, 48, 36);
      ctx.fillStyle = C.ink; ctx.font = `20px ${BODY}`; ctx.textBaseline = 'middle';
      let label = e.label; while (ctx.measureText(label).width > colW - 90 && label.length > 4) label = label.slice(0, -2) + '…';
      ctx.fillText(label, colX + 76, ky + 18); ky += rowH;
    };
    key.forEach(row);
    if (objectives.length) {
      ky += 6; ctx.fillStyle = C.olive; ctx.font = `20px ${DISPLAY}`; ctx.textAlign = 'center';
      ctx.fillText('OBJECTIVES', colX + colW / 2, ky + 18); ctx.textAlign = 'left'; ky += 46;
      objectives.forEach(row);
    }
    y += keyH + 26;
  }
  if (setupH) {
    panel('RECOMMENDED SETUP', setupH);
    let sy = y + 76; ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic';
    for (const w of setupWrapped) sy = drawRich(ctx, w, colX + 18, sy, 28);
    if (noteWrapped) { ctx.fillStyle = '#444'; drawRich(ctx, noteWrapped, colX + 18, sy + 6, 21); }
  }

  // briefing panel
  const px = 95, pw = W - 190;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 10;
  rr(ctx, px, top2, pw, panelH, 22); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  let by = top2 + 48; ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic';
  if (quote) { by = drawRich(ctx, quote, px + 40, by, 32, 'center', textW) + 20; }
  for (const p of paras) by = drawRich(ctx, p, px + 40, by, 30) + 14;

  // victory bar
  const vy = top2 + panelH - 78, vx = px + 30, vw = pw - 60;
  rr(ctx, vx, vy, vw, 52, 26); ctx.fillStyle = C.crimson; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `23px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`MAJOR VICTORY - ${(m.major || '-').toString().toUpperCase()}`, vx + vw / 4, vy + 27);
  ctx.fillText(`MINOR VICTORY - ${(m.minor || 'N/A').toString().toUpperCase()}`, vx + vw * 3 / 4, vy + 27);
  ctx.beginPath(); ctx.arc(vx + vw / 2, vy + 26, 42, 0, Math.PI * 2); ctx.fillStyle = C.charcoal; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = `40px ${DISPLAY}`; ctx.fillText('V', vx + vw / 2, vy + 28);

  // stealth tracker
  const n = 10, r = 50, gap = (W - 2 * 95 - n * 2 * r) / (n - 1);
  const stl = m.stealth || {};
  for (let i = 0; i < n; i++) {
    const cx = 95 + r + i * (2 * r + gap), cy = trackY + r;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = i < 9 ? TRACK[i] : C.crimson; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (i < 9) { ctx.font = `52px ${DISPLAY}`; ctx.fillText(String(9 - i), cx, cy + 3); }
    else drawBell(ctx, cx, cy, 26);
    const v = 9 - i;
    const num = x => (x === '' || x == null ? NaN : Number(x));
    const lab = i > 8 ? '' : num(stl.easy) === v ? 'EASY' : num(stl.normal) === v ? 'NORMAL' : num(stl.hard) === v ? 'HARD' : '';
    if (lab) {
      rr(ctx, cx - 54, cy + r + 4, 108, 38, 19); ctx.fillStyle = C.charcoal; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = `19px ${DISPLAY}`; ctx.fillText(lab, cx, cy + r + 24);
    }
  }

  // footer
  ctx.fillStyle = '#6b6650'; ctx.font = `16px ${BODY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const by2 = m.author ? `Mission by ${m.author}. ` : '';
  ctx.fillText(`${by2}Fan-made mission for SAS: Rogue Regiment by Robert Butler, Word Forge Games. Made with sas.skirmishgames.app`, W / 2, H - 28);
  return cv;
}

function drawBell(ctx, cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(-s * 0.85, s * 0.55);
  ctx.quadraticCurveTo(-s * 0.55, s * 0.3, -s * 0.6, -s * 0.15);
  ctx.quadraticCurveTo(-s * 0.6, -s * 0.85, 0, -s * 0.88);
  ctx.quadraticCurveTo(s * 0.6, -s * 0.85, s * 0.6, -s * 0.15);
  ctx.quadraticCurveTo(s * 0.55, s * 0.3, s * 0.85, s * 0.55);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, s * 0.72, s * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -s * 0.95, s * 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
