// Browser storage for missions (IndexedDB), JSON files and share links.

const DB = 'sas-missions';
const STORE = 'missions';
let dbp = null;

function db() {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbp;
}

async function tx(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const t = d.transaction(STORE, mode);
    const s = t.objectStore(STORE);
    const r = fn(s);
    t.oncomplete = () => resolve(r && 'result' in r ? r.result : undefined);
    t.onerror = () => reject(t.error);
  });
}

export const listMissions = async () => {
  const all = (await tx('readonly', s => s.getAll())) || [];
  return all.sort((a, b) => (b.updated || 0) - (a.updated || 0));
};
export const getMission = id => tx('readonly', s => s.get(id));
export const putMission = m => tx('readwrite', s => s.put({ ...m, updated: Date.now() }));
export const deleteMission = id => tx('readwrite', s => s.delete(id));

export function newId() {
  return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export function slug(s) {
  return (s || 'mission').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mission';
}

export function exportJSON(m) {
  const out = { format: 'sas-rogue-regiment-mission', version: 1, mission: m };
  downloadBlob(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }), slug(m.title) + '.sasmission.json');
}

export function parseJSON(text) {
  const data = JSON.parse(text);
  const m = data && data.format === 'sas-rogue-regiment-mission' ? data.mission : data;
  if (!m || !m.board || !Array.isArray(m.board.tiles)) throw new Error('This file is not a SAS mission.');
  return m;
}

// Share links: deflate the mission JSON into the URL hash.
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function pipe(bytes, stream) {
  const res = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeShare(m) {
  const { id, updated, ...rest } = m;
  const bytes = new TextEncoder().encode(JSON.stringify(rest));
  if (typeof CompressionStream === 'undefined') return 'j' + b64u(bytes);
  return 'z' + b64u(await pipe(bytes, new CompressionStream('deflate-raw')));
}

export async function decodeShare(code) {
  const kind = code[0];
  let bytes = unb64u(code.slice(1));
  if (kind === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  return parseJSON(new TextDecoder().decode(bytes));
}
