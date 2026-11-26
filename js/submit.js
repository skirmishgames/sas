// Submit page: pick a saved mission, download its file, and open a pre-filled email.
import { listMissions, getMission, exportJSON, slug } from './store.js?v=688f7e9d';
import { EXPANSIONS } from './data/missions.js?v=688f7e9d';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL = 'skirmishgames.app@gmail.com';
let current = null;
let downloaded = false;

function val(id) { return ($(id).value || '').trim(); }

function mailHref() {
  const title = val('#subTitle') || 'Untitled mission';
  const needs = [...document.querySelectorAll('#subNeeds input:checked')].map(i => i.value);
  const body = [
    'Hi Ivan,',
    '',
    'I would like to share my mission on SAS Fan Ops. The mission file is attached.',
    '',
    `Mission title: ${title}`,
    `Mission type: ${val('#subType') || '-'}`,
    `File name: ${slug(title)}.sasmission.json`,
    `Credit me as: ${val('#subCredit') || '-'}`,
    `BGG username (optional): ${val('#subBgg') || '-'}`,
    `Components needed: ${needs.length ? needs.join(', ') : '-'}`,
    `Times played so far: ${val('#subPlayed') || '-'}`,
    '',
    'Premise (one or two sentences, no spoilers):',
    val('#subPremise') || '-',
    '',
    'What should playtesters watch for:',
    val('#subFocus') || '-',
    '',
    'Anything else:',
    val('#subNotes') || '-',
    '',
    'I designed this mission myself (or have the designer\'s permission) and I am happy for it to be published on sas.skirmishgames.app with credit.',
    '',
    'Reminder: attach the .sasmission.json file before sending.',
  ].join('\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(`SAS Fan Ops submission: ${title}`)}&body=${encodeURIComponent(body)}`;
}

function refresh() {
  const ok = $('#subConsent').checked && val('#subTitle') && val('#subCredit');
  const btn = $('#subEmail');
  btn.classList.toggle('disabled', !ok);
  btn.setAttribute('aria-disabled', String(!ok));
  btn.href = ok ? mailHref() : '#submit';
  $('#subHint').textContent = ok ? (downloaded || !current ? 'Your email app opens with everything filled in. Attach the mission file, then send.' : 'Download the mission file first so you can attach it.')
    : 'Fill in the mission title and how to credit you, and tick the box, to enable the email button.';
}

async function fillMissions() {
  const list = await listMissions();
  const sel = $('#subMission');
  sel.innerHTML = list.length
    ? '<option value="">Choose a saved mission</option>' + list.map(m => `<option value="${m.id}">${esc(m.title || 'Untitled mission')}</option>`).join('')
    : '<option value="">No saved missions in this browser yet</option>';
  $('#subDownload').disabled = true;
}

async function pick(id) {
  current = id ? await getMission(id) : null;
  downloaded = false;
  $('#subDownload').disabled = !current;
  if (current) {
    $('#subTitle').value = current.title || '';
    $('#subType').value = current.type || '';
    if (!val('#subCredit') && current.author) $('#subCredit').value = current.author;
    const t = current.board.tiles.length, p = current.board.pieces.length;
    $('#subPicked').textContent = `${t} tile${t === 1 ? '' : 's'}, ${p} piece${p === 1 ? '' : 's'}${current.briefing ? ', briefing written' : ', no briefing yet'}${current.stealth && current.stealth.normal ? '' : ', stealth tracker not set'}.`;
  } else $('#subPicked').textContent = '';
  refresh();
}

export function initSubmit() {
  $('#subNeeds').innerHTML = EXPANSIONS.map(e => `<label class="check"><input type="checkbox" value="${esc(e)}" ${e === 'Core' ? 'checked' : ''}> ${esc(e === 'Core' ? 'Core box' : e)}</label>`).join('');
  $('#subMission').addEventListener('change', e => pick(e.target.value));
  $('#subDownload').addEventListener('click', () => { if (!current) return; exportJSON(current); downloaded = true; refresh(); });
  $('#view-submit').addEventListener('input', refresh);
  $('#subEmail').addEventListener('click', e => { if ($('#subEmail').getAttribute('aria-disabled') === 'true') { e.preventDefault(); refresh(); } });
  refresh();
}

export function showSubmit(preId) {
  fillMissions().then(() => {
    const id = preId || (current && current.id);
    if (!id || ![...$('#subMission').options].some(o => o.value === id)) return;
    $('#subMission').value = id;
    if (!current || current.id !== id) pick(id); else $('#subDownload').disabled = false;
  });
}
