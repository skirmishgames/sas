// FAQ and errata page: search, section filter, deep links.
import { FAQ, ERRATA, FAQ_SOURCE } from './data/faq.js?v=515fc801';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let q = '', section = '';
let openMission = () => {};

function mark(text) {
  const safe = esc(text);
  if (!q) return safe;
  const words = q.split(/\s+/).filter(w => w.length > 1).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!words.length) return safe;
  return safe.replace(new RegExp(`(${words.join('|')})`, 'gi'), '<mark>$1</mark>');
}
const hit = (...parts) => !q || q.toLowerCase().split(/\s+/).every(w => parts.join(' ').toLowerCase().includes(w));

function render() {
  let count = 0;
  const groups = FAQ.filter(g => !section || g.id === section).map(g => {
    const items = g.items.filter(it => hit(it.q, it.a, g.title));
    count += items.length;
    if (!items.length) return '';
    return `<section class="fgroup" id="faq-${g.id}"><h2>${esc(g.title)}</h2>${items.map(it => `
      <details class="fitem" id="q-${it.id}" ${q ? 'open' : ''}>
        <summary><span>${mark(it.q)}</span></summary>
        <div class="fans"><p>${mark(it.a)}</p><button type="button" class="link-btn" data-link="${it.id}" title="Copy a link to this answer">Copy link</button></div>
      </details>`).join('')}</section>`;
  }).join('');
  const showErrata = !section || section === 'errata';
  const errata = ERRATA.filter(e => hit(e.group, e.where, e.text));
  const eh = showErrata && errata.length ? `<section class="fgroup errata" id="faq-errata"><h2>Errata</h2>${['Rule book', 'Missions', 'Other'].map(gr => {
    const list = errata.filter(e => e.group === gr); if (!list.length) return '';
    return `<h3>${gr}</h3><div class="ecards">${list.map(e => `<div class="ecard" id="q-${e.id}"><b>${mark(e.where)}</b><p>${mark(e.text)}</p>${e.mission ? `<button type="button" class="link-btn" data-mission="${e.mission}">See mission</button>` : ''}</div>`).join('')}</div>`;
  }).join('')}</section>` : '';
  if (showErrata) count += errata.length;
  $('#faqBody').innerHTML = (groups + eh) || '<p class="muted mnone">Nothing matches. Try other words.</p>';
  $('#faqCount').textContent = q || section ? `${count} result${count === 1 ? '' : 's'}` : '';
}

export function focusFaq(id) {
  if (!id) return;
  q = ''; section = ''; $('#faqSearch').value = ''; $$chips();
  render();
  const el = document.getElementById('q-' + id);
  if (el) { if (el.tagName === 'DETAILS') el.open = true; el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); }
}

function $$chips() { document.querySelectorAll('#faqChips button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sec === section)); }

export function initFaq({ showMission }) {
  openMission = showMission;
  $('#faqSource').textContent = FAQ_SOURCE;
  $('#faqChips').innerHTML = `<button type="button" data-sec="" aria-pressed="true">All</button>` +
    FAQ.map(g => `<button type="button" data-sec="${g.id}" aria-pressed="false">${esc(g.title)}</button>`).join('') +
    `<button type="button" data-sec="errata" aria-pressed="false">Errata</button>`;
  $('#faqChips').addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (!b) return; section = b.dataset.sec; $$chips(); render(); });
  $('#faqSearch').addEventListener('input', e => { q = e.target.value.trim(); render(); });
  $('#faqExpand').addEventListener('click', () => {
    const items = [...document.querySelectorAll('.fitem')]; const open = items.some(d => !d.open);
    items.forEach(d => { d.open = open; }); $('#faqExpand').textContent = open ? 'Collapse all' : 'Expand all';
  });
  $('#faqBody').addEventListener('click', async e => {
    const l = e.target.closest('[data-link]');
    if (l) {
      const url = `${location.origin}${location.pathname}#faq&q=${l.dataset.link}`;
      try { await navigator.clipboard.writeText(url); l.textContent = 'Link copied'; setTimeout(() => { l.textContent = 'Copy link'; }, 1500); } catch { prompt('Copy this link:', url); }
    }
    const mm = e.target.closest('[data-mission]');
    if (mm) openMission(mm.dataset.mission);
  });
  render();
}

export { ERRATA };
