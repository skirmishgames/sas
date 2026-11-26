// Mission index: search, filters and detail view.
import { MISSIONS, SERIES, EXPANSIONS } from './data/missions.js?v=8c0cdd94';
import { ERRATA } from './data/faq.js?v=8c0cdd94';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uniq = a => [...new Set(a)];
const OWN_KEY = 'sas-owned';

const state = { q: '', series: '', type: '', deck: '', ops: '', size: '', tag: '', sort: 'book', owned: false };
let owned = new Set(JSON.parse(localStorage.getItem(OWN_KEY) || 'null') || EXPANSIONS);
let onTemplate = () => {};

const sizeBand = n => (n <= 4 ? 'small' : n <= 6 ? 'medium' : 'large');
const SIZE_NAMES = { small: 'Up to 4 tiles', medium: '5 to 6 tiles', large: '7 tiles or more' };

function matches(m) {
  if (state.series && m.series !== state.series) return false;
  if (state.type && m.type !== state.type) return false;
  if (state.deck && m.deck !== state.deck) return false;
  if (state.ops && String(m.operatorCount) !== state.ops) return false;
  if (state.size && sizeBand(m.tiles || 0) !== state.size) return false;
  if (state.tag && !m.tags.includes(state.tag)) return false;
  if (state.owned && !m.needs.every(s => owned.has(s))) return false;
  if (state.q) {
    const hay = [m.title, m.type, m.series, m.summary, m.deck, ...m.key, ...m.objectives, ...m.special, ...m.namedOperators, ...m.tags].join(' ').toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).every(w => hay.includes(w))) return false;
  }
  return true;
}

function sorted(list) {
  const by = {
    book: (a, b) => a.order - b.order,
    title: (a, b) => a.title.localeCompare(b.title),
    opsUp: (a, b) => a.operatorCount - b.operatorCount || a.order - b.order,
    sizeUp: (a, b) => (a.tiles || 0) - (b.tiles || 0) || a.order - b.order,
    sizeDown: (a, b) => (b.tiles || 0) - (a.tiles || 0) || a.order - b.order,
  };
  return [...list].sort(by[state.sort]);
}

function label(m) {
  if (m.series === 'Core') return `Mission ${m.number}`;
  if (m.number) return `${m.series} ${m.number}`;
  return m.series;
}

function stealthLine(s) {
  if (!s) return '';
  const p = [];
  if (s.easy) p.push(`Easy ${s.easy}`);
  if (s.normal) p.push(`Normal ${s.normal}`);
  if (s.hard) p.push(`Hard ${s.hard}`);
  return p.join(', ');
}

function card(m) {
  return `<article class="mcard" data-id="${m.id}" tabindex="0" aria-label="${esc(m.title)}">
    <div class="mthumb"><img src="assets/missions/${m.id}.webp" alt="" loading="lazy"><span class="mtype">${esc(m.type)}</span></div>
    <div class="mbody">
      <div class="mseries series-${m.seriesSlug}">${esc(label(m))}</div>
      <h3>${esc(m.title)}</h3>
      <p class="msum">${esc(m.summary)}</p>
      <ul class="mfacts">
        <li title="Operators: ${esc(m.operators)}">${m.operatorCount} Operator${m.operatorCount === 1 ? '' : 's'}</li>${m.tags.includes('Willys Jeep') ? '<li>Willys Jeep</li>' : ''}
        ${m.tiles ? `<li title="Map tiles">${m.tiles} tiles</li>` : ''}
        ${m.deck ? `<li title="Event deck"><span class="deck deck-${slugify(m.deck)}"></span>${esc(m.deck)}</li>` : ''}
      </ul>
    </div>
  </article>`;
}

const slugify = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');

function render() {
  const list = sorted(MISSIONS.filter(matches));
  $('#mCount').textContent = `${list.length} of ${MISSIONS.length} missions`;
  $('#mGrid').innerHTML = list.length ? list.map(card).join('') : `<p class="muted mnone">No missions match. Clear a filter or two.</p>`;
}

function options(sel, values, all, names = {}) {
  $(sel).innerHTML = `<option value="">${all}</option>` + values.map(v => `<option value="${esc(v)}">${esc(names[v] || v)}</option>`).join('');
}

export function detail(id) {
  const m = MISSIONS.find(x => x.id === id); if (!m) return;
  const d = $('#missionDlg');
  d.querySelector('.dlg-head h2').textContent = m.title;
  d.querySelector('.mdetail').innerHTML = `
    <div class="mdet-map"><img src="assets/missions/${m.id}.webp" alt="Map for ${esc(m.title)}"></div>
    <div class="mdet-info">
      <p class="mseries series-${m.seriesSlug}">${esc(label(m))} &middot; ${esc(m.type)}</p>
      <p>${esc(m.summary)}</p>
      <dl class="mdl">
        <dt>Operators</dt><dd>${esc(m.operators)}${m.namedOperators.length ? ` (${esc(m.namedOperators.join(', '))})` : ''}</dd>
        <dt>Event deck</dt><dd>${esc(m.deck || '-')}</dd>
        <dt>Event window</dt><dd>${esc(m.window || 'None')}</dd>
        <dt>Map</dt><dd>${m.tiles ? `${m.tiles} tiles${m.layout && m.layout !== 'irregular' ? ` (${esc(m.layout)})` : ''}` : '-'}</dd>
        <dt>Victory</dt><dd>Major ${esc(m.major || '-')}${m.minor ? `, minor ${esc(m.minor)}` : ''}</dd>
        <dt>Stealth</dt><dd>${esc(stealthLine(m.stealth) || '-')}</dd>
        <dt>Needs</dt><dd>${esc(m.needs.join(', '))}</dd>
        <dt>Source</dt><dd>${esc(m.source)}${m.page ? `, p.${m.page}` : ''}</dd>
      </dl>
      ${m.key.length ? `<h4>On the map</h4><p class="mtags">${m.key.map(k => `<span>${esc(k)}</span>`).join('')}</p>` : ''}
      ${m.objectives.length ? `<h4>Objectives</h4><p class="mtags obj">${m.objectives.map(k => `<span>${esc(k)}</span>`).join('')}</p>` : ''}
      ${m.special.length ? `<h4>Special rules</h4><ul class="mspecial">${m.special.map(k => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
      ${m.errata.length ? `<p class="merrata"><b>Errata applied:</b> ${m.errata.map(e => esc((ERRATA.find(x => x.id === e) || {}).text || '')).join(' ')} <a href="#faq&q=${m.errata[0]}">See errata</a></p>` : ''}
      <p class="note">Full briefing and setup are on the mission page in your copy of the ${esc(m.source)}.</p>
      <div class="mdet-actions"><button type="button" class="btn primary" data-template="${m.id}">Use as a template</button></div>
    </div>`;
  d.showModal();
}

function renderOwned() {
  $('#ownedList').innerHTML = EXPANSIONS.map(s => `<label class="check"><input type="checkbox" value="${esc(s)}" ${owned.has(s) ? 'checked' : ''}> ${esc(s === 'Core' ? 'SAS: Rogue Regiment (core box)' : s)}</label>`).join('');
}

export function initMissions({ template }) {
  onTemplate = template;
  options('#fSeries', SERIES.filter(s => MISSIONS.some(m => m.series === s)), 'All series');
  options('#fType', uniq(MISSIONS.map(m => m.type)).sort(), 'All types');
  options('#fDeck', uniq(MISSIONS.map(m => m.deck).filter(Boolean)).sort(), 'All event decks');
  const opCounts = uniq(MISSIONS.map(m => m.operatorCount)).sort((a, b) => a - b).map(String);
  options('#fOps', opCounts, 'Any Operators', Object.fromEntries(opCounts.map(n => [n, `${n} Operator${n === '1' ? '' : 's'}`])));
  options('#fSize', ['small', 'medium', 'large'], 'Any map size', SIZE_NAMES);
  const tags = uniq(MISSIONS.flatMap(m => m.tags)).sort();
  options('#fTag', tags, 'Any feature');
  renderOwned();
  const bind = (sel, key) => $(sel).addEventListener('input', e => { state[key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; render(); });
  bind('#mSearch', 'q'); bind('#fSeries', 'series'); bind('#fType', 'type'); bind('#fDeck', 'deck'); bind('#fOps', 'ops'); bind('#fSize', 'size'); bind('#fTag', 'tag'); bind('#mSort', 'sort'); bind('#fOwned', 'owned');
  $('#ownedList').addEventListener('change', e => {
    if (e.target.checked) owned.add(e.target.value); else owned.delete(e.target.value);
    localStorage.setItem(OWN_KEY, JSON.stringify([...owned]));
    render();
  });
  $('#mClear').addEventListener('click', () => {
    Object.assign(state, { q: '', series: '', type: '', deck: '', ops: '', size: '', tag: '', owned: false });
    ['#mSearch', '#fSeries', '#fType', '#fDeck', '#fOps', '#fSize', '#fTag'].forEach(s => { $(s).value = ''; });
    $('#fOwned').checked = false; render();
  });
  $('#mGrid').addEventListener('click', e => { const c = e.target.closest('.mcard'); if (c) detail(c.dataset.id); });
  $('#mGrid').addEventListener('keydown', e => { if (e.key === 'Enter') { const c = e.target.closest('.mcard'); if (c) detail(c.dataset.id); } });
  $('#missionDlg').addEventListener('click', e => {
    const t = e.target.closest('[data-template]');
    if (t) { $('#missionDlg').close(); onTemplate(MISSIONS.find(m => m.id === t.dataset.template)); }
    if (e.target === $('#missionDlg')) $('#missionDlg').close();
  });
  render();
}
