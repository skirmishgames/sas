// Smoke test. Serve the site first: python3 -m http.server 8765
// Then: node test/smoke.js [base url] [screenshot folder]
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8765/';
const SHOTS = process.argv[3] || null;
const assert = (c, msg) => { if (!c) throw new Error('FAIL: ' + msg); console.log('ok  ' + msg); };

async function canvasPoint(page, bx, by) {
  // board square coordinates to page coordinates
  return page.evaluate(([x, y]) => {
    const e = window.__sas.editor; const r = e.cv.getBoundingClientRect();
    return { x: r.left + (x - e.ox) * e.scale, y: r.top + (y - e.oy) * e.scale };
  }, [bx, by]);
}

async function run(viewport, label) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, hasTouch: label === 'phone', isMobile: label === 'phone' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(800);
  const phone = label === 'phone';
  const openPieces = async () => { if (phone) { await page.click('.mobile-bar [data-open="palette"]'); await page.waitForTimeout(300); } };
  const tap = async (x, y) => { const p = await canvasPoint(page, x, y); phone ? await page.touchscreen.tap(p.x, p.y) : await page.mouse.click(p.x, p.y); await page.waitForTimeout(120); };
  const board = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__sas.mission.board)));

  // place tiles
  await openPieces();
  await page.click('.pitem[data-tile="1A"]');
  await tap(5, 5);
  await openPieces();
  await page.click('.pitem[data-tile="7B"]');
  await tap(15, 5);
  let b = await board();
  assert(b.tiles.length === 2, `${label}: two tiles placed`);
  // same tile number refused
  await openPieces();
  await page.click('.pitem[data-tile="1B"]');
  await tap(5, 15);
  b = await board();
  assert(b.tiles.length === 2, `${label}: second side of tile 1 refused`);
  await page.keyboard.press('Escape');
  if (phone) await page.click('#brushDone').catch(() => {});

  // guards stay armed
  await openPieces();
  if (phone) await page.fill('#paletteSearch', 'guard');
  await page.click('.pitem[data-piece="axis-guard"]');
  await tap(3.5, 3.5); await tap(12.5, 6.5);
  await page.click('#brushDone');
  b = await board();
  assert(b.pieces.filter(p => p.p === 'axis-guard').length === 2, `${label}: two guards placed`);

  // vehicle with convoy role
  await openPieces();
  if (phone) await page.fill('#paletteSearch', '');
  await page.evaluate(() => { document.querySelector('[data-group="axisveh"]').open = true; });
  await page.click('[data-role="convoy"]');
  await page.click('.pitem[data-piece="truck"]');
  await tap(10, 15);
  b = await board();
  const truck = b.pieces.find(p => p.p === 'truck');
  assert(truck && truck.role === 'convoy', `${label}: convoy truck placed`);

  // rotate selection with inspector
  if (phone) { await page.click('.mobile-bar [data-side-open="sel"]'); await page.waitForTimeout(300); }
  await page.click('#sideSel [data-act="rotate"]');
  b = await board();
  assert(b.pieces.find(p => p.p === 'truck').rot === 90, `${label}: truck rotated`);
  if (phone) await page.click('#side [data-close]');

  // route
  await openPieces();
  await page.evaluate(() => { document.querySelector('[data-group="routes"]').open = true; });
  await page.click('.pitem[data-route="patrol"]');
  await tap(1.5, 8.5); await tap(8.5, 8.5); await tap(8.5, 2.5);
  await page.click('#brushDone');
  b = await board();
  assert(b.routes.length === 1 && b.routes[0].pts.length === 3, `${label}: route drawn`);

  // undo / redo
  await page.click('#undoBtn');
  assert((await board()).routes.length === 0, `${label}: undo`);
  await page.click('#redoBtn');
  assert((await board()).routes.length === 1, `${label}: redo`);

  // mission details and sheet
  await page.fill('#titleInput', 'Smoke Test');
  if (phone) await page.click('.mobile-bar [data-side-open="mission"]'); else await page.click('[data-side="mission"]');
  await page.fill('[name="major"]', '5');
  await page.fill('[name="briefing"]', 'Get in, blow it up, get out.');
  if (phone) await page.click('#side [data-close]');
  await page.click('[role="tab"][data-mode="sheet"]');
  await page.waitForFunction(() => document.querySelector('#sheetImg').src.startsWith('data:image/png'), null, { timeout: 8000 });
  assert(true, `${label}: sheet rendered`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-sheet.png` });
  await page.click('[role="tab"][data-mode="board"]');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-board.png` });

  // share link round trip
  const code = await page.evaluate(async () => (await import('./js/store.js')).encodeShare(window.__sas.mission));
  const back = await page.evaluate(async c => (await import('./js/store.js')).decodeShare(c), code);
  assert(back.title === 'Smoke Test' && back.board.tiles.length === 2, `${label}: share link round trip (${code.length} chars)`);

  // export a backup, then import it and a single mission file
  if (!phone) {
    await page.click('#exportBtn');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="backup"]')]);
    const backupPath = await dl.path();
    const fs = require('fs');
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    assert(backup.format === 'sas-rogue-regiment-backup' && backup.missions.length >= 1, 'desktop: backup exported');
    await page.click('#exportBtn');
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="json"]')]);
    const single = await dl2.path();
    await page.setInputFiles('#fileInput', single);
    await page.waitForTimeout(500);
    const after = await page.evaluate(async () => (await (await import('./js/store.js')).listMissions()).length);
    assert(after === backup.missions.length + 1, 'desktop: mission file imported as a new mission');
    await page.setInputFiles('#fileInput', backupPath);
    await page.waitForTimeout(500);
    const after2 = await page.evaluate(async () => (await (await import('./js/store.js')).listMissions()).length);
    assert(after2 === after, 'desktop: backup import restores without duplicates');
  }

  // persistence
  await page.waitForTimeout(1200);
  await page.reload();
  await page.waitForTimeout(1000);
  const t = await page.evaluate(() => window.__sas.mission.title);
  assert(t === 'Smoke Test', `${label}: mission restored after reload`);

  // mission index
  await page.click('.tabs a[data-view="missions"]');
  await page.waitForTimeout(400);
  const total = await page.$$eval('#mGrid .mcard', c => c.length);
  assert(total >= 29, `${label}: mission index lists ${total} missions`);
  await page.fill('#mSearch', 'fortress');
  await page.waitForTimeout(150);
  assert((await page.$$eval('#mGrid .mcard', c => c.length)) === 1, `${label}: mission search`);
  await page.fill('#mSearch', '');
  await page.selectOption('#fSeries', 'Kickstarter');
  assert((await page.$$eval('#mGrid .mcard', c => c.length)) === 6, `${label}: series filter`);
  await page.click('#mGrid .mcard');
  await page.waitForTimeout(200);
  assert(await page.isVisible('#missionDlg'), `${label}: mission detail opens`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-mission.png` });
  await page.click('#missionDlg [data-template]');
  await page.waitForTimeout(500);
  const tt = await page.evaluate(() => window.__sas.mission.title);
  assert(/variant$/.test(tt), `${label}: template starts a new mission`);
  await page.click('.tabs a[data-view="missions"]');
  await page.waitForTimeout(300);
  await page.click('#mClear');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-missions.png` });

  // Fan Ops
  await page.click('.tabs a[data-view="ops"]');
  await page.waitForTimeout(400);
  assert((await page.$$eval('.opcard', c => c.length)) >= 1, `${label}: Fan Ops lists missions`);
  assert(await page.$eval('.opcard .status', e => e.textContent) === 'Needs playtest', `${label}: playtest status shown`);
  const href = await page.$eval('.opcard a[href^="mailto:"]', a => a.href);
  assert(decodeURIComponent(href).includes('What to test') || decodeURIComponent(href).includes('Answer:'), `${label}: feedback email template`);
  await page.click('#opsStatus [data-st="playtested"]');
  assert((await page.$$eval('.opcard', c => c.length)) === 0, `${label}: status filter`);
  await page.click('#opsStatus [data-st=""]');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.opcard [data-act="sheet"]')]);
  const pdfBytes = require('fs').readFileSync(await pdf.path());
  assert(pdf.suggestedFilename().endsWith('.pdf') && pdfBytes.slice(0, 4).toString() === '%PDF', `${label}: mission sheet PDF downloads`);
  if (SHOTS) require('fs').copyFileSync(await pdf.path(), `${SHOTS}/${label}-sheet.pdf`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-ops.png` });
  await page.click('.opcard [data-act="open"]');
  await page.waitForTimeout(700);
  const opened = await page.evaluate(() => [window.__sas.mission.title, window.__sas.mission.board.tiles.length, location.hash]);
  assert(opened[0] === 'Bird in the Hand' && opened[1] === 6 && opened[2] === '#designer', `${label}: fan mission opens in designer`);

  // FAQ and errata
  await page.click('.tabs a[data-view="faq"]');
  await page.waitForTimeout(300);
  const qs = await page.$$eval('.fitem', c => c.length);
  assert(qs >= 35, `${label}: FAQ lists ${qs} questions`);
  await page.fill('#faqSearch', 'mortar');
  await page.waitForTimeout(150);
  assert((await page.$$eval('.fitem', c => c.length)) === 2, `${label}: FAQ search`);
  await page.fill('#faqSearch', '');
  await page.click('#faqChips [data-sec="errata"]');
  assert((await page.$$eval('.ecard', c => c.length)) === 6, `${label}: errata section`);
  await page.click('.ecard [data-mission="mb-p19"]');
  await page.waitForTimeout(400);
  assert(await page.isVisible('#missionDlg .merrata'), `${label}: errata links to mission`);
  await page.click('#missionDlg [data-close-dlg]');
  await page.goto(BASE + '#faq&q=speargun');
  await page.waitForTimeout(600);
  assert(await page.$eval('#q-speargun', d => d.open), `${label}: FAQ deep link opens answer`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-faq.png` });

  // about page
  await page.click('.tabs a[data-view="about"]');
  await page.waitForTimeout(300);
  assert(await page.isVisible('#view-about'), `${label}: about page`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-about.png` });

  assert(errors.length === 0, `${label}: no console errors ${errors.join(' | ')}`);
  await browser.close();
}

(async () => {
  await run({ width: 1400, height: 900 }, 'desktop');
  await run({ width: 390, height: 844 }, 'phone');
  console.log('All smoke tests passed');
})().catch(e => { console.error(e.message); process.exit(1); });
