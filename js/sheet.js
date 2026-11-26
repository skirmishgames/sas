// Draws a mission sheet in the style of the SAS: Rogue Regiment mission book.
// Letter page at 150 dpi: 1275 x 1650 px. The page grows taller if the text needs it.
import { PIECE } from './data/catalog.js?v=515fc801';
import { boardCanvas, keyLabel, isObjective, drawPiece, pieceSize, img, pieceSrc, preload } from './board.js?v=515fc801';

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


// ---------- layout ----------
// The sheet is laid out as letter pages at 150 dpi (1275 x 1650 px). The map comes first, full width and
// centred, as large as the page allows. Key and setup sit in a band under it. The briefing, victory bar and
// stealth tracker follow on the same page when they fit with a large map, otherwise on page 2.
const M = 60, CW = W - 2 * M;           // page margin and content width
const BODY_PX = 21, LH = 29;            // 21 px = 10 pt at 150 dpi
const TITLE_BOTTOM = 160, GAP = 24, TRACK_H = 205;

function measureBlocks(ctx, m, key, objectives) {
  // key: two columns of rows, objectives after a sub-header
  const setupW = 330, keyW = CW - setupW - GAP;
  const cols = 2, rowH = 42;
  const rows = Math.ceil(key.length / cols) + (objectives.length ? 1 + Math.ceil(objectives.length / cols) : 0);
  const keyH = key.length || objectives.length ? 52 + rows * rowH + 14 : 0;
  const st = m.setup || {};
  const lines = [];
  if (st.operators) lines.push(rich(`Operators: **${st.operators}**`));
  if (st.deck) lines.push(rich(`Event deck: **${st.deck}**`));
  if (st.window) lines.push(rich(`Event Window: **${st.window}**`));
  const setupWrapped = lines.map(l => wrapRich(ctx, l, setupW - 32, BODY_PX));
  const noteWrapped = st.note ? wrapRich(ctx, rich(st.note), setupW - 32, 17) : null;
  const setupH = lines.length || noteWrapped ? 66 + setupWrapped.reduce((a, w) => a + w.lines.length * LH, 0) + (noteWrapped ? 8 + noteWrapped.lines.length * 22 : 0) + 14 : 0;
  const bandH = Math.max(keyH, setupH);
  // briefing panel
  const textW = CW - 80;
  const quote = m.quote ? wrapRich(ctx, [{ t: `“${m.quote.trim()}”${m.speaker ? ' - ' + m.speaker.trim() : ''}`, i: true }], textW, BODY_PX + 1) : null;
  const paras = (m.briefing || '').split(/\n\s*\n|\n/).map(t => t.trim()).filter(Boolean).map(t => wrapRich(ctx, rich(t), textW, BODY_PX));
  const briefH = 36 + (quote ? quote.lines.length * (LH + 1) + 16 : 0) + paras.reduce((a, q) => a + q.lines.length * LH + 12, 0) + 92;
  return { setupW, keyW, cols, rowH, keyH, setupH, bandH, setupWrapped, noteWrapped, textW, quote, paras, briefH };
}

function newPage(m) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = PAGE_H;
  const ctx = cv.getContext('2d'); ctx.imageSmoothingQuality = 'high';
  const g = ctx.createLinearGradient(0, 0, 0, PAGE_H);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.1, C.paper1); g.addColorStop(1, C.paper2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, PAGE_H);
  // title bar
  const title = ((m.number ? `Mission ${m.number} - ` : '') + (m.title || 'Untitled mission')).toUpperCase();
  rr(ctx, 40, 50, W - 80, 80, 40); ctx.fillStyle = C.crimson; ctx.fill();
  const type = (m.type || '').toUpperCase(); let typeW = 0;
  if (type) {
    ctx.font = `26px ${DISPLAY}`; typeW = Math.max(170, ctx.measureText(type).width + 60);
    rr(ctx, W - 52 - typeW, 60, typeW, 60, 30); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = C.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(type, W - 52 - typeW / 2, 91);
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
  let ts = 40; ctx.font = `${ts}px ${DISPLAY}`;
  while (ctx.measureText(title).width > W - 180 - typeW && ts > 22) { ts -= 2; ctx.font = `${ts}px ${DISPLAY}`; }
  ctx.fillText(title, 82, 92);
  return { cv, ctx };
}

function footer(ctx, m, pageNo, pages) {
  ctx.fillStyle = '#6b6650'; ctx.font = `15px ${BODY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const by = m.author ? `Mission by ${m.author}. ` : '';
  const pg = pages > 1 ? `  Page ${pageNo} of ${pages}.` : '';
  ctx.fillText(`${by}Fan-made mission for SAS: Rogue Regiment by Robert Butler, Word Forge Games. Made with sas.skirmishgames.app.${pg}`, W / 2, PAGE_H - 26);
}

function panelHead(ctx, x, y, w, h, title) {
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.olive; ctx.fillRect(x, y, w, 44);
  ctx.strokeStyle = C.olive; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#fff'; ctx.font = `21px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(title, x + w / 2, y + 23); ctx.textAlign = 'left';
}

function drawBand(ctx, y, L, key, objectives, m) {
  if (L.keyH) {
    panelHead(ctx, M, y, L.keyW, L.bandH, 'KEY');
    const colW = (L.keyW - 24) / L.cols;
    let r = 0;
    const row = (e, i, base) => {
      const c = i % L.cols, rr2 = base + Math.floor(i / L.cols);
      const x = M + 12 + c * colW, ry = y + 52 + rr2 * L.rowH;
      drawKeyIcon(ctx, e.pc, x, ry + 2, 46, 34);
      ctx.fillStyle = C.ink; ctx.font = `${BODY_PX - 1}px ${BODY}`; ctx.textBaseline = 'middle';
      let label = e.label; while (ctx.measureText(label).width > colW - 70 && label.length > 4) label = label.slice(0, -2) + '.';
      ctx.fillText(label, x + 58, ry + 20);
    };
    key.forEach((e, i) => row(e, i, 0));
    r = Math.ceil(key.length / L.cols);
    if (objectives.length) {
      const oy = y + 52 + r * L.rowH;
      ctx.fillStyle = C.olive; ctx.font = `18px ${DISPLAY}`; ctx.textBaseline = 'middle';
      ctx.fillText('OBJECTIVES', M + 16, oy + 20);
      ctx.strokeStyle = C.khaki; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(M + 150, oy + 20); ctx.lineTo(M + L.keyW - 16, oy + 20); ctx.stroke();
      objectives.forEach((e, i) => row(e, i, r + 1));
    }
  }
  if (L.setupH) {
    const x = L.keyH ? M + L.keyW + GAP : M, w = L.keyH ? L.setupW : CW;
    panelHead(ctx, x, y, w, L.bandH, 'RECOMMENDED SETUP');
    let sy = y + 76; ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic';
    for (const wr of L.setupWrapped) sy = drawRich(ctx, wr, x + 16, sy, LH);
    if (L.noteWrapped) { ctx.fillStyle = '#4a463a'; drawRich(ctx, L.noteWrapped, x + 16, sy + 6, 22); }
  }
}

function drawBriefing(ctx, y, L, m) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 10;
  rr(ctx, M, y, CW, L.briefH, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  let by = y + 44; ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic';
  if (L.quote) by = drawRich(ctx, L.quote, M + 40, by, LH + 1, 'center', L.textW) + 16;
  for (const p of L.paras) by = drawRich(ctx, p, M + 40, by, LH) + 12;
  // victory bar
  const vy = y + L.briefH - 74, vx = M + 30, vw = CW - 60;
  rr(ctx, vx, vy, vw, 50, 25); ctx.fillStyle = C.crimson; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `22px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`MAJOR VICTORY - ${(m.major || '-').toString().toUpperCase()}`, vx + vw / 4, vy + 26);
  ctx.fillText(`MINOR VICTORY - ${(m.minor || 'N/A').toString().toUpperCase()}`, vx + vw * 3 / 4, vy + 26);
  ctx.beginPath(); ctx.arc(vx + vw / 2, vy + 25, 40, 0, Math.PI * 2); ctx.fillStyle = C.charcoal; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = `38px ${DISPLAY}`; ctx.fillText('V', vx + vw / 2, vy + 27);
  ctx.textAlign = 'left';
}

function drawTracker(ctx, y, m) {
  const n = 10, r = 50, gap = (CW - 40 - n * 2 * r) / (n - 1);
  const stl = m.stealth || {};
  const num = x => (x === '' || x == null ? NaN : Number(x));
  for (let i = 0; i < n; i++) {
    const cx = M + 20 + r + i * (2 * r + gap), cy = y + r;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = i < 9 ? TRACK[i] : C.crimson; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (i < 9) { ctx.font = `52px ${DISPLAY}`; ctx.fillText(String(9 - i), cx, cy + 3); } else drawBell(ctx, cx, cy, 26);
    const v = 9 - i;
    const lab = i > 8 ? '' : num(stl.easy) === v ? 'EASY' : num(stl.normal) === v ? 'NORMAL' : num(stl.hard) === v ? 'HARD' : '';
    if (lab) {
      rr(ctx, cx - 54, cy + r + 4, 108, 38, 19); ctx.fillStyle = C.charcoal; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = `19px ${DISPLAY}`; ctx.fillText(lab, cx, cy + r + 24);
    }
  }
  ctx.textAlign = 'left';
}

function drawMap(ctx, map, y, maxH) {
  const s = Math.min(CW / map.width, maxH / map.height, 1.4);
  const w = map.width * s, h = map.height * s;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
  ctx.drawImage(map, M + (CW - w) / 2, y, w, h); ctx.restore();
  return h;
}

// Returns an array of page canvases (one or two).
export async function renderPages(m) {
  await fontsReady();
  await preload(m.board.pieces.map(pieceSrc).filter(Boolean));
  const empty = !m.board.tiles.length && !m.board.pieces.length;
  const map = empty ? null : boardCanvas(m.board, 60, 0.15);
  const scratch = document.createElement('canvas').getContext('2d');
  const { key, objectives } = keyEntries(m.board);
  const L = measureBlocks(scratch, m, key, objectives);
  const top = TITLE_BOTTOM + GAP;
  const band = L.bandH ? L.bandH + GAP : 0;
  const bottom = PAGE_H - 50; // footer space
  const lower = L.briefH + GAP + TRACK_H;
  // one page: map gets what is left after band, briefing and tracker
  const h1 = bottom - top - band - lower - GAP;
  // two pages: map gets page 1 minus the band
  const h2 = bottom - top - band - GAP;
  const sc = h => (map ? Math.min(CW / map.width, Math.max(0, h) / map.height, 1.4) : 0);
  // one page when the map can still be big there: at least 36% of the page height (official sheets use about 39%) or 90% of the content width
  const big = h => map && (map.height * sc(h) >= 0.36 * PAGE_H || map.width * sc(h) >= 0.9 * CW);
  const onePage = !map || big(h1);
  const pages = [];
  const p1 = newPage(m); pages.push(p1);
  let y = top;
  if (!onePage && map) { // centre the map and band on page 1
    const mh = map.height * sc(h2);
    y = top + Math.max(0, (bottom - top - mh - GAP - band) / 2);
  }
  if (map) y += drawMap(p1.ctx, map, y, onePage ? h1 : h2) + GAP;
  if (L.bandH) { drawBand(p1.ctx, y, L, key, objectives, m); y += L.bandH + GAP; }
  if (onePage) {
    const ly = Math.max(y, bottom - lower);
    drawBriefing(p1.ctx, ly, L, m);
    drawTracker(p1.ctx, ly + L.briefH + GAP + 10, m);
    footer(p1.ctx, m, 1, 1);
  } else {
    const p2 = newPage(m); pages.push(p2);
    const by = top;
    drawBriefing(p2.ctx, by, L, m);
    drawTracker(p2.ctx, by + L.briefH + GAP + 10, m);
    footer(p1.ctx, m, 1, 2); footer(p2.ctx, m, 2, 2);
  }
  return pages;
}

// Kept for callers that want one image: pages stacked vertically.
export async function renderSheet(m) {
  const pages = await renderPages(m);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = PAGE_H * pages.length + 20 * (pages.length - 1);
  const ctx = cv.getContext('2d'); ctx.fillStyle = '#888'; ctx.fillRect(0, 0, cv.width, cv.height);
  pages.forEach((p, i) => ctx.drawImage(p.cv, 0, i * (PAGE_H + 20)));
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

// Mission sheet as a letter-size PDF at 100% (art at 150 dpi, 1275 px = 8.5 in).
export async function sheetPdf(m, filename) {
  if (!window.jspdf) throw new Error('The PDF library has not loaded yet. Try again in a moment.');
  const pages = await renderPages(m);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter', compress: true });
  pages.forEach((p, i) => {
    if (i) doc.addPage('letter');
    doc.addImage(p.cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 612, 792);
  });
  doc.setProperties({ title: m.title || 'SAS mission', subject: 'Fan-made mission for SAS: Rogue Regiment', creator: 'sas.skirmishgames.app' });
  doc.save(filename);
}
