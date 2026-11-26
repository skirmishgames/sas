import { TILES, TILE, PIECES, PIECE, PALETTE_GROUPS, ROLES, BOXES, MISSION_TYPES, EVENT_DECKS, recommendedFor } from './data/catalog.js?v=8c0cdd94';
import { Editor, emptyBoard, pieceSize, pieceSrc, pieceName, keyLabel, isObjective, boardCanvas, uid, preload, drawPiece } from './board.js?v=8c0cdd94';
import { renderSheet, fontsReady } from './sheet.js?v=8c0cdd94';
import { initMissions, detail as missionDetail } from './missions.js?v=8c0cdd94';
import { initFaq, focusFaq } from './faq.js?v=8c0cdd94';
import * as store from './store.js?v=8c0cdd94';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MARKER_COLOURS = ['#b00c36', '#e48823', '#f2ae13', '#4a7a2c', '#1a6fb0', '#6a3fa0', '#231f20', '#7a6a50'];

// ---------- state ----------
let m = blankMission();
let saveTimer = 0, sheetTimer = 0, dirty = false;
let brushRole = 'patrol', brushMarker = { color: MARKER_COLOURS[0], text: '' };

function blankMission() {
  return { id: store.newId(), title: '', number: '', type: '', quote: '', speaker: '', briefing: '', major: '', minor: '', author: '',
    setup: { operators: '', deck: '', window: '', note: '' }, stealth: { easy: '', normal: '', hard: '' }, board: emptyBoard(), created: Date.now() };
}

// ---------- toast ----------
let toastT = 0;
function toast(msg, ms = 3500) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms);
}

// ---------- editor ----------
const editor = new Editor($('#board'), {
  getBoard: () => m.board,
  setBoard: b => { m.board = b; },
  onChange: () => { markDirty(); refreshPalette(); updateHint(); renderAdvice(); },
  onSelect: () => { renderInspector(); updateBrushBar(); refreshPalette(); if (editor.sel && isPhone()) openSideTab('sel', false); },
  toast,
});

const isPhone = () => matchMedia('(max-width: 960px)').matches;

function markDirty() {
  dirty = true; $('#saveState').textContent = 'Saving';
  clearTimeout(saveTimer); saveTimer = setTimeout(save, 700);
  if ($('#view-designer').dataset.mode === 'sheet') queueSheet();
}
async function save() {
  try { await store.putMission(m); localStorage.setItem('sas-current', m.id); dirty = false; $('#saveState').textContent = 'Saved'; }
  catch { $('#saveState').textContent = 'Not saved'; }
}

function loadMission(mm, { keepId = true } = {}) {
  m = { ...blankMission(), ...mm, setup: { ...blankMission().setup, ...(mm.setup || {}) }, stealth: { ...blankMission().stealth, ...(mm.stealth || {}) } };
  if (!keepId) m.id = store.newId();
  for (const p of m.board.pieces) if (!p.uid) p.uid = uid();
  for (const r of m.board.routes) if (!r.uid) r.uid = uid();
  editor.resetHistory(); editor.select(null); editor.setTool('select');
  $('#titleInput').value = m.title || '';
  fillForm(); refreshPalette(); updateHint(); renderAdvice();
  editor.fitted = false; editor.fit();
  if ($('#view-designer').dataset.mode === 'sheet') queueSheet();
}

// ---------- palette ----------
function paletteItems(g) {
  if (g.id === 'tiles') return TILES.map(t => ({ tile: t.id, name: t.name, src: t.src, box: t.box }));
  if (g.id === 'routes') return [];
  const list = g.ids ? g.ids.map(id => PIECE[id]) : PIECES.filter(p => g.kinds.includes(p.kind));
  return list.map(p => ({ p: p.id, name: p.name, src: p.src || (p.faces && p.faces[0]), box: p.box, kind: p.kind }));
}

function buildPalette() {
  const body = $('#paletteBody');
  const open = JSON.parse(localStorage.getItem('sas-open-groups') || '["tiles","units"]');
  body.innerHTML = PALETTE_GROUPS.map(g => {
    const items = paletteItems(g);
    let inner = '';
    if (g.id === 'axisveh') inner += `<div class="role-pick" role="group" aria-label="Vehicle role">${Object.entries(ROLES).map(([k, r]) => `<button type="button" data-role="${k}" aria-pressed="${k === brushRole}"><span class="swatch" style="background:${r.color}"></span>${r.name}</button>`).join('')}</div>`;
    if (g.id === 'routes') inner += `<div class="pgrid"><button type="button" class="pitem" data-route="patrol"><svg viewBox="0 0 60 20" style="width:56px;height:20px"><path d="M2 10h56" stroke="#111" stroke-width="4" stroke-dasharray="8 4"/></svg>Patrol route</button><button type="button" class="pitem" data-route="convoy"><svg viewBox="0 0 60 20" style="width:56px;height:20px;background:#4a5330;border-radius:3px"><path d="M2 10h56" stroke="#fff" stroke-width="4" stroke-dasharray="8 4"/></svg>Convoy route</button></div><p class="note">Tap squares one after another to draw the route. Double-click or tap Finish to end it.</p>`;
    if (items.length) inner += `<div class="pgrid${g.id === 'tiles' ? ' tiles' : ''}">${items.map(it => {
      const data = it.tile ? `data-tile="${it.tile}"` : `data-piece="${it.p}"`;
      const pic = it.kind === 'marker' ? `<svg viewBox="0 0 40 40" style="width:38px;height:38px"><circle cx="20" cy="20" r="16" fill="#b00c36" stroke="#fff" stroke-width="3"/><text x="20" y="26" font-size="15" text-anchor="middle" fill="#fff" stroke="none" font-family="Russo One">A</text></svg>` : `<img src="${it.src}" alt="" loading="lazy">`;
      return `<button type="button" class="pitem" ${data} title="${esc(it.name)}${it.box ? ' (' + BOXES[it.box] + ')' : ''}">${pic}<span>${esc(it.name)}</span>${it.box && it.box !== 'RR' ? `<span class="box">${esc(BOXES[it.box])}</span>` : ''}</button>`;
    }).join('')}</div>`;
    if (g.id === 'items') inner += `<p class="note">Custom markers cover pieces without art (snipers, mortar teams, HMG teams). Set the colour and letters after placing.</p>`;
    return `<details class="pgroup" data-group="${g.id}" ${open.includes(g.id) ? 'open' : ''}><summary>${esc(g.name)}</summary><div class="pbody">${inner}</div></details>`;
  }).join('');
  refreshPalette();
}

function refreshPalette() {
  const usedNums = new Map(m.board.tiles.map(t => [TILE[t.t].num, t.t]));
  $$('.pitem[data-tile]').forEach(b => {
    const t = TILE[b.dataset.tile];
    b.classList.toggle('used', usedNums.has(t.num));
    b.title = usedNums.has(t.num) ? `${t.name}: tile ${t.num} is on the board as ${usedNums.get(t.num)}` : t.name;
  });
  const br = editor.brush;
  $$('.pitem').forEach(b => b.classList.toggle('active', !!br && ((br.tile && b.dataset.tile === br.tile) || (br.p && b.dataset.piece === br.p))));
  $$('.pitem[data-route]').forEach(b => b.classList.toggle('active', editor.tool === 'route' && editor.routeStyle === b.dataset.route));
}

$('#paletteBody').addEventListener('click', e => {
  const role = e.target.closest('[data-role]');
  if (role) { brushRole = role.dataset.role; $$('[data-role]').forEach(b => b.setAttribute('aria-pressed', b === role)); if (editor.brush && editor.brush.p && PIECE[editor.brush.p].kind === 'vehicle') editor.brush.role = brushRole; return; }
  const it = e.target.closest('.pitem'); if (!it) return;
  if (it.dataset.route) { editor.setTool('route'); editor.routeStyle = it.dataset.route; editor.routeDraft = null; }
  else if (it.dataset.tile) {
    if (editor.brush && editor.brush.tile === it.dataset.tile) { editor.setTool('select'); }
    else editor.arm({ tile: it.dataset.tile });
  } else {
    const p = it.dataset.piece;
    if (editor.brush && editor.brush.p === p) editor.setTool('select');
    else editor.arm({ p, role: brushRole, color: brushMarker.color, text: brushMarker.text });
  }
  refreshPalette(); updateBrushBar();
  if (isPhone() && editor.tool !== 'select') closeDrawers();
});
$('#paletteBody').addEventListener('toggle', () => {
  localStorage.setItem('sas-open-groups', JSON.stringify($$('.pgroup[open]').map(d => d.dataset.group)));
}, true);
$('#paletteSearch').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  $$('.pgroup').forEach(g => {
    let any = false;
    g.querySelectorAll('.pitem').forEach(b => { const hit = !q || b.textContent.toLowerCase().includes(q) || (b.title || '').toLowerCase().includes(q); b.hidden = !hit; any = any || hit; });
    g.hidden = !!q && !any; if (q && any) g.open = true;
  });
});

function updateBrushBar() {
  const bar = $('#brushBar'), lab = $('#brushLabel'), done = $('#brushDone');
  if (editor.tool === 'place' && editor.brush) {
    const name = editor.brush.tile ? TILE[editor.brush.tile].name : PIECE[editor.brush.p].name;
    lab.textContent = editor.brush.tile ? `Tap a slot to place ${name}` : `Tap the map to place ${name}`;
    done.textContent = 'Done'; bar.hidden = false;
  } else if (editor.tool === 'route') {
    const n = editor.routeDraft ? editor.routeDraft.pts.length : 0;
    lab.textContent = n ? `${editor.routeStyle === 'convoy' ? 'Convoy' : 'Patrol'} route: ${n} point${n > 1 ? 's' : ''}. Tap the next square.` : `Tap the first square of the ${editor.routeStyle} route`;
    done.textContent = n >= 2 ? 'Finish' : 'Cancel'; bar.hidden = false;
  } else bar.hidden = true;
}
$('#brushDone').addEventListener('click', () => {
  if (editor.tool === 'route') editor.finishRoute();
  editor.setTool('select'); refreshPalette(); updateBrushBar();
});

// ---------- inspector ----------
function renderInspector() {
  const box = $('#sideSel');
  const sel = editor.sel, it = editor.selected();
  if (!it) {
    const counts = `${m.board.tiles.length} tile${m.board.tiles.length === 1 ? '' : 's'}, ${m.board.pieces.length} piece${m.board.pieces.length === 1 ? '' : 's'}, ${m.board.routes.length} route${m.board.routes.length === 1 ? '' : 's'}`;
    box.innerHTML = `<p class="muted">Nothing selected. Tap a tile, piece or route on the map.</p><p class="muted">${counts}.</p>
      <p class="note"><b>Keys:</b> R rotate, F flip, Delete remove, D duplicate, Ctrl+Z undo, Esc stop placing.</p>`;
    return;
  }
  let head = '', body = '';
  const actions = [];
  if (sel.type === 'tile') {
    const def = TILE[it.t];
    head = `<img src="${def.src}" alt=""><div><h3>${esc(def.name)}</h3><small>Rotation ${it.rot || 0}°</small></div>`;
    actions.push(['rotate', 'Rotate'], ['flip', def.side ? `Flip to ${def.num}${def.side === 'A' ? 'B' : 'A'}` : 'Flip'], ['delete', 'Remove']);
    body = `<p class="note">Drag the selected tile to move it. Dropping it on another tile swaps the two.</p>`;
  } else if (sel.type === 'route') {
    head = `<div><h3>${it.style === 'convoy' ? 'Convoy' : 'Patrol'} route</h3><small>${it.pts.length} points</small></div>`;
    actions.push(['style', it.style === 'convoy' ? 'Make patrol' : 'Make convoy'], ['reverse', 'Reverse'], ['popPoint', 'Remove last point'], ['delete', 'Remove']);
    body = `<p class="note">Convoy routes are white, patrol routes are black, as in the mission book.</p>`;
  } else {
    const def = PIECE[it.p];
    head = `<canvas width="112" height="112" id="inspIcon"></canvas><div><h3>${esc(pieceName(it))}</h3><small>${def.box ? esc(BOXES[def.box]) : 'Any box'}</small></div>`;
    actions.push(['rotate', 'Rotate']);
    if (def.faces && def.faces.length > 1) actions.push(['flip', 'Other side']);
    actions.push(['duplicate', 'Duplicate'], ['delete', 'Remove']);
    if (def.kind === 'vehicle') body += `<label>Role<select data-f="role">${Object.entries(ROLES).map(([k, r]) => `<option value="${k}" ${k === (it.role || 'patrol') ? 'selected' : ''}>${r.name}</option>`).join('')}</select></label>`;
    if (def.kind === 'marker') body += `<div class="color-row" role="group" aria-label="Marker colour">${MARKER_COLOURS.map(c => `<button type="button" data-color="${c}" style="background:${c}" aria-pressed="${c === it.color}" aria-label="Colour ${c}"></button>`).join('')}</div>
      <label>Letters on the marker <input data-f="text" maxlength="3" value="${esc(it.text || '')}" placeholder="S"></label>`;
    body += `<label>Key label <input data-f="label" maxlength="40" value="${esc(it.label || '')}" placeholder="${esc(keyLabel({ ...it, label: '' }))}"></label>
      <label class="check"><input type="checkbox" data-f="obj" ${isObjective(it) ? 'checked' : ''}> List under Objectives</label>
      <p class="note">Pieces with the same key label share one line in the key.</p>`;
  }
  box.innerHTML = `<div class="insp-title">${head}</div><div class="insp-actions">${actions.map(([a, l]) => `<button type="button" class="btn${a === 'delete' ? ' danger' : ''}" data-act="${a}">${l}</button>`).join('')}</div>${body}`;
  const ic = $('#inspIcon');
  if (ic) {
    const ctx = ic.getContext('2d'); const flat = { ...it, x: 0, y: 0 }; const { w, h } = pieceSize(flat);
    const s = Math.min(104 / w, 104 / h, 70);
    preload([pieceSrc(it)].filter(Boolean)).then(() => { ctx.clearRect(0, 0, 112, 112); ctx.save(); ctx.translate((112 - w * s) / 2, (112 - h * s) / 2); drawPiece(ctx, flat, s); ctx.restore(); });
  }
}

$('#sideSel').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (b) {
    const a = b.dataset.act;
    if (a === 'rotate') editor.rotateSel(1);
    else if (a === 'flip') editor.flipSel();
    else if (a === 'delete') editor.deleteSel();
    else if (a === 'duplicate') editor.duplicateSel();
    else if (a === 'style') editor.mutateSel(r => { r.style = r.style === 'convoy' ? 'patrol' : 'convoy'; });
    else if (a === 'reverse') editor.mutateSel(r => { r.pts.reverse(); });
    else if (a === 'popPoint') editor.mutateSel(r => { if (r.pts.length > 2) r.pts.pop(); });
    return;
  }
  const c = e.target.closest('[data-color]');
  if (c) { brushMarker.color = c.dataset.color; editor.mutateSel(p => { p.color = c.dataset.color; }); }
});
$('#sideSel').addEventListener('change', e => {
  const f = e.target.dataset.f; if (!f) return;
  const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  if (f === 'role') brushRole = v;
  if (f === 'text') brushMarker.text = v;
  editor.mutateSel(p => { p[f] = v; });
});

// ---------- mission form ----------
$('#typeList').innerHTML = MISSION_TYPES.map(t => `<option value="${esc(t)}">`).join('');
$('#deckList').innerHTML = EVENT_DECKS.map(t => `<option value="${esc(t)}">`).join('');
function getPath(o, p) { return p.split('.').reduce((a, k) => (a ? a[k] : ''), o); }
function setPath(o, p, v) { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => (a[k] = a[k] || {}), o)[last] = v; }
function fillForm() {
  for (const el of $('#sideMission').elements) if (el.name) el.value = getPath(m, el.name) ?? '';
  const rec = recommendedFor(m.board.tiles.length || 4);
  $('[name="setup.operators"]').placeholder = rec.operators;
  $('[name="stealth.normal"]').placeholder = rec.normal;
  $('[name="stealth.easy"]').placeholder = rec.normal + 1;
  $('[name="stealth.hard"]').placeholder = rec.normal - 1;
}
$('#sideMission').addEventListener('input', e => { if (e.target.name) { setPath(m, e.target.name, e.target.value); markDirty(); if (e.target.name.startsWith('stealth') || e.target.name.startsWith('setup')) renderAdvice(); } });
$('#sideMission').addEventListener('submit', e => e.preventDefault());
$('#titleInput').addEventListener('input', e => { m.title = e.target.value; markDirty(); });

function renderAdvice() {
  const n = m.board.tiles.length;
  const rec = recommendedFor(n || 4);
  const out = [];
  const boxes = new Set();
  for (const t of m.board.tiles) if (TILE[t.t].box) boxes.add(TILE[t.t].box);
  for (const p of m.board.pieces) if (PIECE[p.p].box) boxes.add(PIECE[p.p].box);
  if (n) out.push(`<p><b>${n} tile${n > 1 ? 's' : ''}.</b> Rule book guidance for this size: ${rec.operators} Operators, stealth meter Normal ${rec.normal}.${n < 8 && m.board.pieces.some(p => p.p === 'willys') ? ' The rule book removes the Willys Jeep from maps under 8 tiles.' : ''}</p>`);
  if (boxes.size) out.push(`<p><b>Needs:</b> ${[...boxes].sort((a, b) => (a === 'RR' ? -1 : b === 'RR' ? 1 : 0)).map(b => BOXES[b]).join(', ')}.</p>`);
  const over = [];
  const count = {};
  for (const p of m.board.pieces) count[p.p] = (count[p.p] || 0) + 1;
  for (const [id, c] of Object.entries(count)) { const d = PIECE[id]; if (d.max && c > d.max) over.push(`${c} x ${d.name} (the game has ${d.max})`); }
  if (over.length) out.push(`<p class="warn">More pieces than the game supplies: ${over.join('; ')}.</p>`);
  if (n && !m.board.pieces.some(p => p.p === 'entry-exit') && !m.board.pieces.some(p => PIECE[p.p].id.startsWith('op-'))) out.push(`<p class="warn">No Operator start or entry/exit tile yet.</p>`);
  const s = m.stealth;
  if (s.easy && s.normal && Number(s.easy) <= Number(s.normal)) out.push(`<p class="warn">Easy should start higher on the stealth tracker than Normal.</p>`);
  $('#advice').innerHTML = out.join('') || '<p class="muted">Tips appear here as you build.</p>';
}

// ---------- side tabs, drawers ----------
function openSideTab(tab, focus = true) {
  $$('[data-side]').forEach(b => b.setAttribute('aria-selected', b.dataset.side === tab));
  $('#sideSel').hidden = tab !== 'sel'; $('#sideMission').hidden = tab !== 'mission';
  if (tab === 'mission') fillForm();
  if (isPhone() && focus) { closeDrawers(); $('#side').classList.add('open'); markBar(); }
}
$$('[data-side]').forEach(b => b.addEventListener('click', () => openSideTab(b.dataset.side, false)));
function closeDrawers() { $('#palette').classList.remove('open'); $('#side').classList.remove('open'); markBar(); }
function markBar() {
  $$('.mobile-bar button').forEach(b => {
    const id = b.dataset.open; const open = $('#' + id).classList.contains('open');
    b.classList.toggle('on', open && (!b.dataset.sideOpen || !$(b.dataset.sideOpen === 'sel' ? '#sideSel' : '#sideMission').hidden));
  });
}
$$('.mobile-bar button').forEach(b => b.addEventListener('click', () => {
  const el = $('#' + b.dataset.open);
  const wasOn = b.classList.contains('on');
  closeDrawers();
  if (wasOn) return;
  if (b.dataset.sideOpen) openSideTab(b.dataset.sideOpen, false);
  el.classList.add('open'); markBar();
}));
$$('[data-close]').forEach(b => b.addEventListener('click', closeDrawers));
$('#stage').addEventListener('pointerdown', () => { if (isPhone() && $('#palette').classList.contains('open')) closeDrawers(); });

// ---------- toolbar ----------
$('#undoBtn').onclick = () => editor.undo();
$('#redoBtn').onclick = () => editor.redo();
$('#zoomIn').onclick = () => editor.zoomBy(1.25);
$('#zoomOut').onclick = () => editor.zoomBy(0.8);
$('#fitBtn').onclick = () => editor.fit();
$('#newBtn').onclick = async () => {
  if (dirty) await save();
  if (m.board.tiles.length || m.board.pieces.length) toast('Previous mission saved under My missions.');
  loadMission(blankMission(), { keepId: true });
  localStorage.setItem('sas-current', m.id);
};
$('#openBtn').onclick = openMissions;

$$('.seg[role="tablist"] [data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
function setMode(mode) {
  $('#view-designer').dataset.mode = mode;
  $$('[data-mode][role="tab"]').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === mode));
  if (mode === 'sheet') { editor.setTool('select'); updateBrushBar(); queueSheet(0); }
}
function queueSheet(delay = 400) {
  clearTimeout(sheetTimer);
  sheetTimer = setTimeout(async () => {
    $('#sheetStatus').textContent = 'Drawing sheet';
    const cv = await renderSheet(m);
    $('#sheetImg').src = cv.toDataURL('image/png');
    $('#sheetStatus').textContent = 'Preview. Use Export to download or print.';
  }, delay);
}

// export menu
$('#exportBtn').addEventListener('click', e => { e.stopPropagation(); $('#exportMenu').hidden = !$('#exportMenu').hidden; });
document.addEventListener('click', e => { if (!e.target.closest('.menu-wrap')) $('#exportMenu').hidden = true; });
$('#exportMenu').addEventListener('click', async e => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  $('#exportMenu').hidden = true;
  const name = store.slug(m.title);
  if (a.dataset.act === 'map-png') {
    if (!m.board.tiles.length && !m.board.pieces.length) return toast('The map is empty.');
    await preload(m.board.pieces.map(pieceSrc).filter(Boolean));
    boardCanvas(m.board, 48, 0.25).toBlob(b => store.downloadBlob(b, name + '-map.png'));
  } else if (a.dataset.act === 'sheet-png') {
    toast('Drawing mission sheet...');
    (await renderSheet(m)).toBlob(b => store.downloadBlob(b, name + '-sheet.png'));
  } else if (a.dataset.act === 'print') {
    const cv = await renderSheet(m);
    $('#printArea').innerHTML = `<img src="${cv.toDataURL('image/png')}" alt="">`;
    const im = $('#printArea img');
    await (im.decode ? im.decode().catch(() => {}) : Promise.resolve());
    window.print();
  } else if (a.dataset.act === 'json') store.exportJSON(m);
  else if (a.dataset.act === 'backup') backupAll();
  else if (a.dataset.act === 'share') {
    const code = await store.encodeShare(m);
    const url = `${location.origin}${location.pathname}#designer&m=${code}`;
    try { await navigator.clipboard.writeText(url); toast(`Share link copied (${url.length} characters).`); }
    catch { prompt('Copy this link:', url); }
  }
});
$('#fileInput').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const res = store.parseImport(await f.text());
    if (dirty) await save();
    if (res.backup) {
      const existing = new Set((await store.listMissions()).map(x => x.id));
      let added = 0, replaced = 0;
      for (const mm of res.missions) { if (!mm.id) mm.id = store.newId(); existing.has(mm.id) ? replaced++ : added++; await store.putMission(mm); }
      const cur = res.missions.find(x => x.id === m.id);
      if (cur) loadMission(cur);
      toast(`Backup imported: ${added} new mission${added === 1 ? '' : 's'}${replaced ? `, ${replaced} updated` : ''}.`, 5000);
      if ($('#missionsDlg').open) openMissions();
    } else {
      const mm = res.missions[0];
      loadMission(mm, { keepId: false }); await save();
      if ($('#missionsDlg').open) $('#missionsDlg').close();
      toast(`Imported ${mm.title || 'mission'}.`);
    }
  } catch (err) { toast(err.message || 'Could not read that file.'); }
});
async function backupAll() {
  if (dirty) await save();
  const n = await store.exportAll();
  toast(n ? `Backup of ${n} mission${n === 1 ? '' : 's'} downloaded.` : 'No saved missions to back up yet.');
}
$('#importBtn').onclick = () => $('#fileInput').click();
$('#backupBtn2').onclick = backupAll;
$('#importBtn2').onclick = () => $('#fileInput').click();

// my missions dialog
async function openMissions() {
  if (dirty) await save();
  const list = await store.listMissions();
  $('#missionsList').innerHTML = list.length ? list.map(x => `<li class="${x.id === m.id ? 'current' : ''}" data-id="${x.id}"><div class="meta"><b>${esc(x.title || 'Untitled mission')}</b><small>${x.board.tiles.length} tiles, edited ${new Date(x.updated).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}</small></div>
    <button type="button" class="btn small" data-m="open">Open</button><button type="button" class="btn small" data-m="copy">Copy</button><button type="button" class="btn small danger" data-m="del" aria-label="Delete">Delete</button></li>`).join('') : '<li class="muted">No saved missions yet.</li>';
  $('#missionsDlg').showModal();
}
$('#missionsList').addEventListener('click', async e => {
  const b = e.target.closest('[data-m]'); if (!b) return;
  const id = b.closest('li').dataset.id;
  const mm = await store.getMission(id);
  if (b.dataset.m === 'open') { loadMission(mm); localStorage.setItem('sas-current', mm.id); $('#missionsDlg').close(); }
  if (b.dataset.m === 'copy') { const c = { ...mm, id: store.newId(), title: (mm.title || 'Untitled') + ' (copy)' }; await store.putMission(c); openMissions(); }
  if (b.dataset.m === 'del') {
    if (!confirm(`Delete "${mm.title || 'Untitled mission'}" from this browser? This cannot be undone.`)) return;
    await store.deleteMission(id);
    if (id === m.id) { loadMission(blankMission()); }
    openMissions();
  }
});
$$('[data-close-dlg]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

// quick start layouts
$('#emptyHint').addEventListener('click', e => {
  const q = e.target.closest('[data-quick]'); if (!q) return;
  const [cols, rows] = q.dataset.quick.split('x').map(Number);
  const nums = [...Array(12).keys()].map(i => i + 1).sort(() => Math.random() - 0.5);
  editor.snapshot();
  let k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) m.board.tiles.push({ t: `${nums[k++]}${Math.random() < 0.5 ? 'A' : 'B'}`, c, r, rot: 0 });
  editor.changed(); editor.fit();
  toast('Random tiles placed. Select a tile to flip, rotate or move it, or pick a different tile and tap it to replace.', 5000);
});
function updateHint() { $('#emptyHint').hidden = m.board.tiles.length > 0 || m.board.pieces.length > 0; }

// keyboard
document.addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select') || $('#view-designer').hidden) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? editor.redo() : editor.undo(); }
  else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); editor.redo(); }
  else if (k === 'escape') { if (editor.tool === 'route') editor.finishRoute(); editor.setTool('select'); refreshPalette(); updateBrushBar(); }
  else if (k === 'enter' && editor.tool === 'route') { editor.finishRoute(); editor.setTool('select'); updateBrushBar(); }
  else if (k === 'r') editor.rotateSel(e.shiftKey ? -1 : 1);
  else if (k === 'f') editor.flipSel();
  else if (k === 'd' && !e.ctrlKey && !e.metaKey) editor.duplicateSel();
  else if (k === 'delete' || k === 'backspace') { e.preventDefault(); editor.deleteSel(); }
});
$('#board').addEventListener('pointerup', () => setTimeout(updateBrushBar, 0));

// ---------- routing, theme ----------
function route() {
  const h = location.hash.replace(/^#/, '');
  const view = h.split('&')[0] || 'designer';
  const v = ['designer', 'missions', 'faq', 'about'].includes(view) ? view : 'designer';
  $$('.view').forEach(s => { s.hidden = s.id !== 'view-' + v; });
  $$('.tabs a').forEach(a => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (v === 'designer') editor.resize();
  if (v === 'faq') { const fq = (h.match(/&q=([\w-]+)/) || [])[1]; if (fq) setTimeout(() => focusFaq(fq), 50); }
  if (v !== 'missions' && $('#missionDlg').open) $('#missionDlg').close();
}
window.addEventListener('hashchange', route);
$('#themeBtn').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; try { localStorage.setItem('sas-theme', t); } catch { /* private mode */ }
});
window.addEventListener('beforeunload', () => { if (dirty) store.putMission(m); });

// ---------- start ----------
async function useTemplate(src) {
  if (dirty) await save();
  const mm = blankMission();
  Object.assign(mm, { title: `${src.title} variant`, type: src.type, major: src.major || '', minor: src.minor || '',
    setup: { operators: src.operators || '', deck: src.deck || '', window: src.window || '', note: '' },
    stealth: { easy: src.stealth?.easy ?? '', normal: src.stealth?.normal ?? '', hard: src.stealth?.hard ?? '' },
    briefing: `Based on ${src.title} (${src.source}${src.page ? ' p.' + src.page : ''}).` });
  loadMission(mm); await save();
  location.hash = '#designer';
  toast(`New mission started from ${src.title}: setup, victory points and stealth copied. Build the map from the mission page.`, 6000);
}

async function start() {
  buildPalette();
  initMissions({ template: useTemplate });
  initFaq({ showMission: id => { location.hash = '#missions'; setTimeout(() => missionDetail(id), 60); } });
  route();
  const share = (location.hash.match(/[&#]m=([A-Za-z0-9_-]+)/) || [])[1];
  if (share) {
    try { const mm = await store.decodeShare(share); loadMission(mm, { keepId: false }); await save(); toast(`Opened shared mission: ${mm.title || 'Untitled'}. It is now saved in your browser.`, 5000); }
    catch { toast('That share link could not be read.'); }
    history.replaceState(null, '', '#designer');
  } else {
    try {
      const id = localStorage.getItem('sas-current');
      const mm = id && await store.getMission(id);
      if (mm) loadMission(mm); else loadMission(m);
    } catch { loadMission(m); }
  }
  openSideTab('sel', false);
  renderInspector();
  fontsReady();
}
start();
window.__sas = { editor, get mission() { return m; }, loadMission };
