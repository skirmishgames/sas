// Board model, renderer and canvas interaction for the mission designer.
import { SQ, TILE, PIECE, ROLES } from './data/catalog.js?v=3ce8ebc5';

export const T = 10; // squares per map tile

// ---------- images ----------
const imgCache = new Map();
let onImgLoad = () => {};
export function setImageListener(fn) { onImgLoad = fn; }
export function img(src) {
  let im = imgCache.get(src);
  if (!im) {
    im = new Image();
    im.decoding = 'async';
    im.onload = () => onImgLoad();
    im.src = src;
    imgCache.set(src, im);
  }
  return im;
}
export function preload(srcs) {
  return Promise.all([...new Set(srcs)].map(src => new Promise(res => {
    const im = img(src);
    const done = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(res);
    if (im.complete && im.naturalWidth) done();
    else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', () => res(), { once: true }); }
  })));
}

// Every image a board needs: map tiles and pieces.
export function boardSrcs(board) {
  return [...board.tiles.map(t => TILE[t.t] && TILE[t.t].src), ...board.pieces.map(pieceSrc)].filter(Boolean);
}

// Load every image for a board before drawing it off screen. Throws if any image is missing.
export async function loadBoard(board) {
  const srcs = boardSrcs(board);
  await preload(srcs);
  const missing = srcs.filter(s => { const im = img(s); return !(im.complete && im.naturalWidth); });
  if (missing.length) throw new Error(`Could not load ${missing.length} map image${missing.length > 1 ? 's' : ''}. Check your connection and try again.`);
}

// ---------- model helpers ----------
export function emptyBoard() { return { tiles: [], pieces: [], routes: [] }; }
let uidN = 0;
export const uid = () => 'p' + Date.now().toString(36) + (uidN++).toString(36);

export function pieceSize(pc) {
  const def = PIECE[pc.p];
  let w = def.w || 1, h = def.h || 1;
  if (pc.rot % 180 === 90) [w, h] = [h, w];
  return { w, h };
}

export function pieceSrc(pc) {
  const def = PIECE[pc.p];
  if (def.faces) return def.faces[(pc.face || 0) % def.faces.length];
  return def.src;
}

export function pieceName(pc) {
  const def = PIECE[pc.p];
  if (def.faceNames) return def.faceNames[(pc.face || 0) % def.faceNames.length];
  return def.name;
}

export function keyLabel(pc) {
  if (pc.label && pc.label.trim()) return pc.label.trim();
  const def = PIECE[pc.p];
  if (def.kind === 'vehicle') return `Axis ${def.name} ${ROLES[pc.role || 'patrol'].name}`;
  if (def.kind === 'marker') return pc.text ? `Marker ${pc.text}` : 'Marker';
  if (def.key) return def.key;
  if (def.faceNames) return pieceName(pc);
  return def.name;
}

export function isObjective(pc) {
  if (pc.obj !== undefined) return pc.obj;
  return !!PIECE[pc.p].objective;
}

export function bounds(board, pad = 0) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (a, b, c, d) => { x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); };
  for (const t of board.tiles) add(t.c * T, t.r * T, t.c * T + T, t.r * T + T);
  for (const pc of board.pieces) { const { w, h } = pieceSize(pc); add(pc.x, pc.y, pc.x + w, pc.y + h); }
  for (const r of board.routes) for (const [x, y] of r.pts) add(x, y, x + 1, y + 1);
  if (x0 === Infinity) return { x: 0, y: 0, w: 3 * T, h: 3 * T, empty: true };
  return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2 };
}

export function tileBounds(board) {
  if (!board.tiles.length) return { c0: 0, r0: 0, c1: 2, r1: 2 };
  let c0 = Infinity, r0 = Infinity, c1 = -Infinity, r1 = -Infinity;
  for (const t of board.tiles) { c0 = Math.min(c0, t.c); r0 = Math.min(r0, t.r); c1 = Math.max(c1, t.c); r1 = Math.max(r1, t.r); }
  return { c0, r0, c1, r1 };
}

// ---------- drawing ----------
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

export function drawMarker(ctx, cx, cy, r, color, text) {
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color || '#b00c36'; ctx.fill();
  ctx.lineWidth = Math.max(1, r * 0.12); ctx.strokeStyle = '#fff'; ctx.stroke();
  if (text) {
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.round(r * (text.length > 2 ? 0.7 : 1.0))}px "Russo One", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 3), cx, cy + r * 0.05);
  }
  ctx.restore();
}

// Draw one piece in board units (s = pixels per square), origin already applied.
export function drawPiece(ctx, pc, s) {
  const def = PIECE[pc.p];
  const { w, h } = pieceSize(pc);
  const cx = (pc.x + w / 2) * s, cy = (pc.y + h / 2) * s;
  ctx.save();
  ctx.translate(cx, cy);
  if (def.kind === 'marker') {
    drawMarker(ctx, 0, 0, s * 0.42, pc.color, pc.text);
    ctx.restore();
    return;
  }
  ctx.rotate((pc.rot || 0) * Math.PI / 180);
  const dw = (def.w || 1) * s, dh = (def.h || 1) * s;
  const im = img(pieceSrc(pc));
  if (def.kind === 'token') {
    const k = 0.92;
    if (im.complete && im.naturalWidth) ctx.drawImage(im, -dw * k / 2, -dh * k / 2, dw * k, dh * k);
  } else if (def.contain) {
    if (im.complete && im.naturalWidth) {
      const sc = Math.min(dw / im.naturalWidth, dh / im.naturalHeight);
      ctx.drawImage(im, -im.naturalWidth * sc / 2, -im.naturalHeight * sc / 2, im.naturalWidth * sc, im.naturalHeight * sc);
    }
  } else {
    const inset = def.kind === 'objective' && def.w === 2 && def.h === 2 ? s * 0.05 : 0;
    if (im.complete && im.naturalWidth) ctx.drawImage(im, -dw / 2 + inset, -dh / 2 + inset, dw - inset * 2, dh - inset * 2);
    if (def.kind === 'vehicle' || def.kind === 'opvehicle') {
      const col = def.kind === 'vehicle' ? ROLES[pc.role || 'patrol'].color : '#9cff00';
      ctx.lineWidth = Math.max(1.5, s * 0.07);
      ctx.strokeStyle = col;
      roundRect(ctx, -dw / 2 + ctx.lineWidth / 2, -dh / 2 + ctx.lineWidth / 2, dw - ctx.lineWidth, dh - ctx.lineWidth, s * 0.08);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawRoute(ctx, r, s, highlight) {
  if (r.pts.length < 1) return;
  ctx.save();
  ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
  const pts = r.pts.map(([x, y]) => [(x + 0.5) * s, (y + 0.5) * s]);
  const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  const lw = Math.max(2, s * 0.11);
  if (highlight) { path(); ctx.strokeStyle = 'rgba(255,200,0,.55)'; ctx.lineWidth = lw * 3; ctx.stroke(); }
  path();
  ctx.setLineDash([s * 0.32, s * 0.16]);
  ctx.lineWidth = lw;
  ctx.strokeStyle = r.style === 'convoy' ? '#ffffff' : '#111111';
  ctx.stroke();
  if (pts.length === 1) { ctx.fillStyle = ctx.strokeStyle; ctx.fillRect(pts[0][0] - lw, pts[0][1] - lw, lw * 2, lw * 2); }
  ctx.restore();
}

const LAYER = { spawn: 0, objective: 1, opvehicle: 2, vehicle: 2, token: 3, marker: 4 };

// Render a whole board. ox, oy: board-square coordinate at canvas (0,0) after the given transform.
export function renderBoard(ctx, board, s, opt = {}) {
  for (const t of board.tiles) {
    const def = TILE[t.t];
    const im = def && img(def.src);
    const x = t.c * T * s, y = t.r * T * s, size = T * s;
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((t.rot || 0) * Math.PI / 180);
    if (im && im.complete && im.naturalWidth) ctx.drawImage(im, -size / 2, -size / 2, size, size);
    else { ctx.fillStyle = '#5d6b3a'; ctx.fillRect(-size / 2, -size / 2, size, size); }
    ctx.restore();
    if (opt.tileEdges) { ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.strokeRect(x, y, size, size); }
  }
  for (const r of board.routes) drawRoute(ctx, r, s, opt.selected === r.uid);
  const ps = [...board.pieces].sort((a, b) => LAYER[PIECE[a.p].kind] - LAYER[PIECE[b.p].kind]);
  for (const pc of ps) drawPiece(ctx, pc, s);
}

// Export the board as a canvas cropped to content.
export function boardCanvas(board, s = SQ, pad = 0.5) {
  const b = bounds(board, pad);
  const c = document.createElement('canvas');
  c.width = Math.ceil(b.w * s); c.height = Math.ceil(b.h * s);
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(-b.x * s, -b.y * s);
  renderBoard(ctx, board, s, { tileEdges: true });
  return c;
}

// ---------- interactive editor ----------
export class Editor {
  constructor(canvas, { getBoard, setBoard, onChange, onSelect, toast }) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.getBoard = getBoard; this.setBoard = setBoard;
    this.onChange = onChange; this.onSelect = onSelect; this.toast = toast;
    this.scale = 20; this.ox = -2; this.oy = -2; // view: board square at canvas top-left
    this.tool = 'select'; this.brush = null; this.sel = null; this.routeDraft = null;
    this.undoStack = []; this.redoStack = [];
    this.pointers = new Map();
    this.ghost = null;
    this.showGrid = true;
    setImageListener(() => this.draw());
    this.bind();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
    this.resize();
  }

  get board() { return this.getBoard(); }

  // ---- history ----
  snapshot() { this.undoStack.push(JSON.stringify(this.board)); if (this.undoStack.length > 80) this.undoStack.shift(); this.redoStack = []; }
  undo() { if (!this.undoStack.length) return; this.redoStack.push(JSON.stringify(this.board)); this.setBoard(JSON.parse(this.undoStack.pop())); this.select(null); this.changed(); }
  redo() { if (!this.redoStack.length) return; this.undoStack.push(JSON.stringify(this.board)); this.setBoard(JSON.parse(this.redoStack.pop())); this.select(null); this.changed(); }
  resetHistory() { this.undoStack = []; this.redoStack = []; }
  changed() { this.draw(); this.onChange(); }

  // ---- view ----
  resize() {
    const r = this.cv.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.cv.width = Math.max(1, Math.round(r.width * dpr)); this.cv.height = Math.max(1, Math.round(r.height * dpr));
    this.cv.style.width = r.width + 'px'; this.cv.style.height = r.height + 'px';
    this.dpr = dpr;
    if (!this.fitted && r.width > 0) { this.fit(); this.fitted = true; }
    this.draw();
  }
  fit() {
    const b = bounds(this.board, 2);
    const w = this.cv.width / this.dpr, h = this.cv.height / this.dpr;
    if (!w || !h) return;
    this.scale = Math.max(6, Math.min(60, Math.min(w / b.w, h / b.h)));
    this.ox = b.x + b.w / 2 - w / 2 / this.scale;
    this.oy = b.y + b.h / 2 - h / 2 / this.scale;
    this.draw();
  }
  zoomAt(f, sx, sy) {
    const ns = Math.max(5, Math.min(90, this.scale * f));
    const bx = this.ox + sx / this.scale, by = this.oy + sy / this.scale;
    this.scale = ns; this.ox = bx - sx / ns; this.oy = by - sy / ns;
    this.draw();
  }
  zoomBy(f) { this.zoomAt(f, this.cv.width / this.dpr / 2, this.cv.height / this.dpr / 2); }
  toBoard(e) {
    const r = this.cv.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    return { sx, sy, x: this.ox + sx / this.scale, y: this.oy + sy / this.scale };
  }

  // ---- draw ----
  draw() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this._draw(); });
  }
  _draw() {
    const { ctx, cv } = this; const s = this.scale; const b = this.board;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, -this.ox * s * this.dpr, -this.oy * s * this.dpr);
    ctx.imageSmoothingQuality = 'high';

    // empty tile slots around the current layout
    const tb = tileBounds(b);
    const occupied = new Set(b.tiles.map(t => t.c + ',' + t.r));
    const placingTile = this.tool === 'place' && this.brush && this.brush.tile;
    ctx.save();
    ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5;
    for (let r = tb.r0 - 1; r <= tb.r1 + 1; r++) for (let c = tb.c0 - 1; c <= tb.c1 + 1; c++) {
      if (occupied.has(c + ',' + r)) continue;
      ctx.strokeStyle = placingTile ? 'rgba(176,12,54,.7)' : 'rgba(120,120,90,.35)';
      ctx.strokeRect(c * T * s + 3, r * T * s + 3, T * s - 6, T * s - 6);
    }
    ctx.restore();

    renderBoard(ctx, b, s, { tileEdges: true, selected: this.sel && this.sel.type === 'route' ? this.sel.uid : null });

    if (this.routeDraft) drawRoute(ctx, this.routeDraft, s, true);

    // selection
    const sel = this.selected();
    if (sel) {
      let x, y, w, h;
      if (this.sel.type === 'tile') { x = sel.c * T; y = sel.r * T; w = h = T; }
      else if (this.sel.type === 'piece') { ({ w, h } = pieceSize(sel)); x = sel.x; y = sel.y; }
      if (w) {
        ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = '#ffc400'; ctx.setLineDash([8, 5]);
        ctx.strokeRect(x * s - 2, y * s - 2, w * s + 4, h * s + 4); ctx.restore();
      }
    }
    // ghost preview while placing
    if (this.ghost && this.tool === 'place') {
      ctx.save(); ctx.globalAlpha = 0.6;
      if (this.brush.tile) {
        const im = img(TILE[this.brush.tile].src);
        if (im.complete) ctx.drawImage(im, this.ghost.c * T * s, this.ghost.r * T * s, T * s, T * s);
      } else drawPiece(ctx, this.ghost, s);
      ctx.restore();
    }
    if (this.tool === 'route' && this.ghost) {
      ctx.save(); ctx.fillStyle = 'rgba(255,196,0,.5)'; ctx.fillRect(this.ghost.x * s, this.ghost.y * s, s, s); ctx.restore();
    }
  }

  // ---- selection ----
  selected() {
    if (!this.sel) return null;
    const b = this.board;
    if (this.sel.type === 'tile') return b.tiles.find(t => t.c === this.sel.c && t.r === this.sel.r) || null;
    if (this.sel.type === 'piece') return b.pieces.find(p => p.uid === this.sel.uid) || null;
    if (this.sel.type === 'route') return b.routes.find(p => p.uid === this.sel.uid) || null;
    return null;
  }
  select(sel) { this.sel = sel; this.draw(); this.onSelect(sel, this.selected()); }

  hit(x, y) {
    const b = this.board;
    const ps = [...b.pieces].sort((a, c) => LAYER[PIECE[c.p].kind] - LAYER[PIECE[a.p].kind]);
    for (const pc of ps) { const { w, h } = pieceSize(pc); if (x >= pc.x && x < pc.x + w && y >= pc.y && y < pc.y + h) return { type: 'piece', uid: pc.uid }; }
    for (const r of b.routes) {
      for (let i = 0; i < r.pts.length; i++) {
        const [ax, ay] = r.pts[i].map(v => v + 0.5);
        const [bx, by] = (r.pts[i + 1] || r.pts[i]).map(v => v + 0.5);
        if (distSeg(x, y, ax, ay, bx, by) < 0.45) return { type: 'route', uid: r.uid };
      }
    }
    const c = Math.floor(x / T), rr = Math.floor(y / T);
    if (b.tiles.some(t => t.c === c && t.r === rr)) return { type: 'tile', c, r: rr };
    return null;
  }

  // ---- tools ----
  setTool(tool, brush = null) {
    if (this.routeDraft && tool !== 'route') this.finishRoute();
    this.tool = tool; this.brush = brush; this.ghost = null;
    this.cv.dataset.tool = tool;
    this.draw();
  }
  arm(brush) { this.setTool('place', brush); }

  placeAt(x, y) {
    const b = this.board, br = this.brush;
    if (br.tile) {
      const c = Math.floor(x / T), r = Math.floor(y / T);
      const def = TILE[br.tile];
      const clash = b.tiles.find(t => TILE[t.t].num === def.num && !(t.c === c && t.r === r));
      if (clash) { this.toast(`Tile ${def.num} is already on the board as ${clash.t}. Each tile is double-sided, so use Flip on that tile instead.`); return; }
      this.snapshot();
      const ex = b.tiles.findIndex(t => t.c === c && t.r === r);
      const tile = { t: br.tile, c, r, rot: 0 };
      if (ex >= 0) b.tiles.splice(ex, 1, tile); else b.tiles.push(tile);
      this.changed();
      this.setTool('select');
      this.select({ type: 'tile', c, r });
      return;
    }
    const def = PIECE[br.p];
    const count = b.pieces.filter(p => p.p === br.p).length;
    if (def.max && count >= def.max) { this.toast(`The game has ${def.max} ${def.name} piece${def.max > 1 ? 's' : ''}. That many are already placed.`); }
    const pc = this.ghostFor(x, y);
    pc.uid = uid();
    this.snapshot();
    b.pieces.push(pc);
    this.changed();
    const stay = def.kind === 'token' || def.kind === 'marker';
    if (!stay) { this.setTool('select'); }
    this.select({ type: 'piece', uid: pc.uid });
  }

  ghostFor(x, y) {
    const br = this.brush;
    const pc = { p: br.p, rot: br.rot || 0, face: br.face || 0 };
    if (PIECE[br.p].kind === 'vehicle') pc.role = br.role || 'patrol';
    if (PIECE[br.p].kind === 'marker') { pc.color = br.color || '#b00c36'; pc.text = br.text || ''; }
    const { w, h } = pieceSize(pc);
    pc.x = Math.round(x - w / 2); pc.y = Math.round(y - h / 2);
    return pc;
  }

  finishRoute() {
    const d = this.routeDraft; this.routeDraft = null;
    if (d && d.pts.length >= 2) { this.snapshot(); this.board.routes.push(d); this.changed(); this.select({ type: 'route', uid: d.uid }); }
    else this.draw();
    this.onSelect(this.sel, this.selected());
  }

  // ---- edits on selection ----
  mutateSel(fn) {
    const it = this.selected(); if (!it) return;
    this.snapshot(); fn(it); this.changed(); this.onSelect(this.sel, this.selected());
  }
  rotateSel(dir = 1) {
    this.mutateSel(it => {
      if (this.sel.type === 'piece') {
        const before = pieceSize(it); const cx = it.x + before.w / 2, cy = it.y + before.h / 2;
        it.rot = ((it.rot || 0) + 90 * dir + 360) % 360;
        const after = pieceSize(it); it.x = Math.round(cx - after.w / 2); it.y = Math.round(cy - after.h / 2);
      } else if (this.sel.type === 'tile') it.rot = ((it.rot || 0) + 90 * dir + 360) % 360;
    });
  }
  flipSel() {
    const it = this.selected(); if (!it) return;
    if (this.sel.type === 'tile') {
      const def = TILE[it.t]; if (!def.side) { this.toast('The bunker tile has one side.'); return; }
      this.mutateSel(t => { t.t = def.num + (def.side === 'A' ? 'B' : 'A'); });
    } else if (this.sel.type === 'piece') {
      const def = PIECE[it.p]; if (!def.faces || def.faces.length < 2) { this.toast('This piece has no other side.'); return; }
      this.mutateSel(p => { p.face = ((p.face || 0) + 1) % def.faces.length; });
    }
  }
  deleteSel() {
    if (!this.sel) return;
    const b = this.board; this.snapshot();
    if (this.sel.type === 'tile') b.tiles = b.tiles.filter(t => !(t.c === this.sel.c && t.r === this.sel.r));
    if (this.sel.type === 'piece') b.pieces = b.pieces.filter(p => p.uid !== this.sel.uid);
    if (this.sel.type === 'route') b.routes = b.routes.filter(p => p.uid !== this.sel.uid);
    this.setBoard(b); this.select(null); this.changed();
  }
  duplicateSel() {
    const it = this.selected(); if (!it || this.sel.type !== 'piece') return;
    this.snapshot();
    const cp = { ...JSON.parse(JSON.stringify(it)), uid: uid(), x: it.x + 1, y: it.y + 1 };
    this.board.pieces.push(cp); this.changed(); this.select({ type: 'piece', uid: cp.uid });
  }

  // ---- pointer handling ----
  bind() {
    const cv = this.cv;
    cv.addEventListener('pointerdown', e => this.down(e));
    cv.addEventListener('pointermove', e => this.move(e));
    cv.addEventListener('pointerup', e => this.up(e));
    cv.addEventListener('pointercancel', e => this.up(e));
    cv.addEventListener('pointerleave', () => { if (!this.pointers.size) { this.ghost = null; this.draw(); } });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const r = cv.getBoundingClientRect();
      if (e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX)) this.zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
      else { this.ox += e.deltaX / this.scale; this.draw(); }
    }, { passive: false });
    cv.addEventListener('dblclick', () => { if (this.tool === 'route') this.finishRoute(); });
    cv.addEventListener('contextmenu', e => e.preventDefault());
  }

  down(e) {
    this.cv.setPointerCapture(e.pointerId);
    const p = this.toBoard(e);
    this.pointers.set(e.pointerId, p);
    if (this.pointers.size === 2) { // pinch
      const [a, b] = [...this.pointers.values()];
      this.pinch = { d: Math.hypot(a.sx - b.sx, a.sy - b.sy), s: this.scale };
      this.drag = null; return;
    }
    const middle = e.button === 1 || e.button === 2;
    if (middle) { this.drag = { mode: 'pan', sx: p.sx, sy: p.sy, ox: this.ox, oy: this.oy }; return; }
    if (this.tool === 'place') { this.drag = { mode: 'tap', sx: p.sx, sy: p.sy, ox: this.ox, oy: this.oy, x: p.x, y: p.y }; return; }
    if (this.tool === 'route') { this.drag = { mode: 'routeTap', sx: p.sx, sy: p.sy, ox: this.ox, oy: this.oy, x: p.x, y: p.y }; return; }
    const h = this.hit(p.x, p.y);
    const same = h && this.sel && h.type === this.sel.type && (h.uid ? h.uid === this.sel.uid : h.c === this.sel.c && h.r === this.sel.r);
    // Tiles only move once already selected, so a drag on the map pans by default.
    if (h && (h.type === 'piece' || (h.type === 'tile' && same))) {
      const it = h.type === 'piece' ? this.board.pieces.find(q => q.uid === h.uid) : this.board.tiles.find(t => t.c === h.c && t.r === h.r);
      this.drag = { mode: 'move', hit: h, it, sx: p.sx, sy: p.sy, x: p.x, y: p.y, start: h.type === 'piece' ? { x: it.x, y: it.y } : { c: it.c, r: it.r }, moved: false };
      if (!same) this.select(h);
    } else {
      this.drag = { mode: 'pan', sx: p.sx, sy: p.sy, ox: this.ox, oy: this.oy, tapHit: h };
    }
  }

  move(e) {
    const p = this.toBoard(e);
    if (this.pointers.has(e.pointerId)) this.pointers.set(e.pointerId, p);
    if (this.pinch && this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
      this.zoomAt((this.pinch.s * d / this.pinch.d) / this.scale, (a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
      return;
    }
    const d = this.drag;
    if (!d) { // hover ghost (mouse)
      if (this.tool === 'place' && this.brush) {
        this.ghost = this.brush.tile ? { c: Math.floor(p.x / T), r: Math.floor(p.y / T) } : this.ghostFor(p.x, p.y);
        this.draw();
      } else if (this.tool === 'route') { this.ghost = { x: Math.floor(p.x), y: Math.floor(p.y) }; this.draw(); }
      return;
    }
    const dist = Math.hypot(p.sx - d.sx, p.sy - d.sy);
    if (d.mode === 'pan' || ((d.mode === 'tap' || d.mode === 'routeTap') && dist > 8)) {
      d.mode = d.mode === 'pan' ? 'pan' : 'panFromTap';
    }
    if (d.mode === 'pan' || d.mode === 'panFromTap') {
      d.panned = d.panned || dist > 4;
      this.ox = d.ox - (p.sx - d.sx) / this.scale; this.oy = d.oy - (p.sy - d.sy) / this.scale; this.draw();
    } else if (d.mode === 'move') {
      if (!d.moved && dist < 4) return;
      if (!d.moved) { this.snapshot(); d.moved = true; }
      const dx = p.x - d.x, dy = p.y - d.y;
      if (d.hit.type === 'piece') { d.it.x = Math.round(d.start.x + dx); d.it.y = Math.round(d.start.y + dy); }
      else {
        const nc = Math.round(d.start.c + dx / T), nr = Math.round(d.start.r + dy / T);
        if (nc !== d.it.c || nr !== d.it.r) {
          const other = this.board.tiles.find(t => t.c === nc && t.r === nr && t !== d.it);
          if (other) { other.c = d.it.c; other.r = d.it.r; }
          d.it.c = nc; d.it.r = nr; this.sel = { type: 'tile', c: nc, r: nr };
        }
      }
      this.draw();
    }
  }

  up(e) {
    this.pointers.delete(e.pointerId);
    if (this.pinch) { if (this.pointers.size < 2) this.pinch = null; this.drag = null; return; }
    const d = this.drag; this.drag = null;
    if (!d) return;
    if (d.mode === 'tap') { this.placeAt(d.x, d.y); this.ghost = null; this.draw(); }
    else if (d.mode === 'routeTap') {
      const pt = [Math.floor(d.x), Math.floor(d.y)];
      if (!this.routeDraft) this.routeDraft = { uid: uid(), style: this.routeStyle || 'patrol', pts: [] };
      const last = this.routeDraft.pts[this.routeDraft.pts.length - 1];
      if (!last || last[0] !== pt[0] || last[1] !== pt[1]) this.routeDraft.pts.push(pt);
      this.draw(); this.onSelect(this.sel, this.selected());
    } else if (d.mode === 'move') { if (d.moved) this.changed(); this.onSelect(this.sel, this.selected()); }
    else if (d.mode === 'pan' && !d.panned) this.select(d.tapHit || null);
  }
}

function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay; const l = dx * dx + dy * dy;
  let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
