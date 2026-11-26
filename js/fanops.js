// Fan Ops page: fan-made missions with playtest status and feedback by email.
import { FANOPS, STATUS, PLAYTESTS_NEEDED } from './data/fanops.js?v=d2fa9c1b';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL = 'skirmishgames.app@gmail.com';
const state = { status: '', type: '', q: '' };
let hooks = {};

function feedbackHref(m) {
  const subject = `SAS playtest: ${m.title} v${m.version}`;
  const body = [
    `Mission: ${m.title} v${m.version}`,
    'Players:',
    'Operators used:',
    'Difficulty (Easy, Normal or Hard):',
    'Event deck:',
    'Playing time:',
    'Result (major victory, minor victory or failed) and victory points:',
    '',
    ...m.testNotes.map((t, i) => `${i + 1}. ${t}\nAnswer:\n`),
    'Anything else:',
  ].join('\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function card(m) {
  const st = STATUS[m.status];
  const n = m.playtests.length;
  return `<article class="mcard opcard" id="op-${m.id}">
    <div class="mthumb"><img src="assets/ops/${m.id}.webp" alt="" loading="lazy"><span class="mtype">${esc(m.type)}</span></div>
    <div class="mbody">
      <div class="opmeta"><span class="status status-${m.status}" title="${esc(st.note)}">${esc(st.label)}</span><span class="muted">v${esc(m.version)} by ${esc(m.author)}</span></div>
      <h3>${esc(m.title)}</h3>
      <p class="msum">${esc(m.premise)}</p>
      <ul class="mfacts">
        <li>${m.operators} Operators</li><li>${m.tiles} tiles</li>
        <li><span class="deck deck-${m.deck.toLowerCase().replace(/[^a-z]+/g, '-')}"></span>${esc(m.deck)}</li>
        <li>${esc(m.needs.join(' + '))}</li>
      </ul>
      ${m.status === 'untested' ? `<details class="focus"><summary>What to test (${m.testNotes.length})</summary><ol>${m.testNotes.map(t => `<li>${esc(t)}</li>`).join('')}</ol></details>` : ''}
      ${m.changes.length ? `<details class="focus"><summary>Changes (${m.changes.length})</summary><ul>${m.changes.map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>` : ''}
      <div class="opactions">
        <button type="button" class="btn small primary" data-act="open" data-id="${m.id}">Open in designer</button>
        <button type="button" class="btn small" data-act="sheet" data-id="${m.id}">Mission sheet</button>
        <a class="btn small" href="${feedbackHref(m)}">Send feedback</a>
        <button type="button" class="btn small" data-act="link" data-id="${m.id}">Copy link</button>
      </div>
      <p class="note">${n >= PLAYTESTS_NEEDED ? `Playtested ${n} times.` : `Playtests: ${n} of ${PLAYTESTS_NEEDED}. It counts as playtested after ${PLAYTESTS_NEEDED}.`}</p>
    </div>
  </article>`;
}

function render() {
  const q = state.q.toLowerCase();
  const list = FANOPS.filter(m => (!state.status || m.status === state.status) && (!state.type || m.type === state.type) &&
    (!q || [m.title, m.type, m.premise, m.author].join(' ').toLowerCase().includes(q)));
  $('#opsGrid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted mnone">No fan missions match.</p>';
  $('#opsCount').textContent = `${list.length} of ${FANOPS.length} fan mission${FANOPS.length === 1 ? '' : 's'}`;
}

async function loadFile(m) {
  const res = await fetch(m.file);
  if (!res.ok) throw new Error('Could not load the mission file.');
  return hooks.parse(await res.text());
}

export function focusOp(id) {
  const el = document.getElementById('op-' + id);
  if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); }
}

export function initFanOps(h) {
  hooks = h;
  const types = [...new Set(FANOPS.map(m => m.type))].sort();
  $('#opsType').innerHTML = '<option value="">All types</option>' + types.map(t => `<option>${esc(t)}</option>`).join('');
  $('#opsStatus').innerHTML = `<button type="button" data-st="" aria-pressed="true">All</button>` +
    Object.entries(STATUS).map(([k, v]) => `<button type="button" data-st="${k}" aria-pressed="false" title="${esc(v.note)}">${esc(v.label)}</button>`).join('');
  $('#opsStatus').addEventListener('click', e => {
    const b = e.target.closest('[data-st]'); if (!b) return;
    state.status = b.dataset.st; document.querySelectorAll('#opsStatus button').forEach(x => x.setAttribute('aria-pressed', x === b)); render();
  });
  $('#opsType').addEventListener('input', e => { state.type = e.target.value; render(); });
  $('#opsSearch').addEventListener('input', e => { state.q = e.target.value.trim(); render(); });
  $('#opsGrid').addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const m = FANOPS.find(x => x.id === b.dataset.id);
    try {
      if (b.dataset.act === 'open') await hooks.open(await loadFile(m), m);
      if (b.dataset.act === 'sheet') { b.disabled = true; await hooks.sheet(await loadFile(m), m); b.disabled = false; }
      if (b.dataset.act === 'link') {
        const url = `${location.origin}${location.pathname}#ops&id=${m.id}`;
        try { await navigator.clipboard.writeText(url); b.textContent = 'Link copied'; setTimeout(() => { b.textContent = 'Copy link'; }, 1500); } catch { prompt('Copy this link:', url); }
      }
    } catch (err) { b.disabled = false; hooks.toast(err.message); }
  });
  render();
}
