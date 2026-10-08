import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
await build({ entryPoints: ['tests/movement-entry.jsx'], outfile: 'tests/.runtime/movements.js', bundle: true, format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, target: 'es2022' });
process.env.STOK_AUDIT_BUNDLE = new URL('./.runtime/movements.js', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { harness, base, product, activity, wait, text } = require('./audit/harness.cjs');
const checks = [];
const fixture = (...products) => ({ ...base(), products });
const read = h => h.w.__readStockMovements('qa', 'p1');
const cards = h => [...h.d.querySelectorAll('.stock-history-card')];
async function open(h) { await h.click('▤ Inventori'); h.d.querySelector('.inventory-product').click(); await wait(); await h.click('Riwayat Pergerakan Stok'); }
async function adjust(h, value, reason = 'Hasil hitung ulang') { await h.click('Sesuaikan stok'); await h.set(h.field('Jumlah fisik sekarang'), value); await h.set(h.field('Alasan koreksi'), reason); await h.click('Simpan Penyesuaian'); }
async function test(name, data, run) {
  const h = harness({ data }); try { await wait(); await run(h); assert.equal(h.errors.length, 0, h.errors.join('\n')); checks.push(name); } finally { h.close(); }
}
function purchase() {
  const data = fixture(product('p1', 'egg', 6, { initialQuantity: 10, stockSource: 'purchase' }));
  data.shoppingActivities = [{ id: 'trip', title: 'Belanja Mingguan', status: 'ongoing', createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' }];
  data.shoppingItems = [{ id: 'shop', activityId: 'trip', itemId: 'egg', name: 'Telur', category: 'Segar', quantity: 10, unit: 'buah', bought: true, createdAt: '2026-10-01T00:00:00Z', receipts: [{ productId: 'p1', quantity: 10, product: product('p1'), createdAt: '2026-10-01T00:00:00Z' }] }];
  data.activityLog = [activity('adjust', 1, { action: 'adjusted', title: 'Timbang ulang', adjustment: { productId: 'p1', before: 7, after: 6 } }), activity('waste', 1, { action: 'disposed', title: 'Rusak' }), activity('use', 2, { title: 'Masak siang' })]; return data;
}
await test('stock adjustment opens directly with locked current stock and no selection gateway', fixture(product()), async h => {
  await open(h); await h.click('Sesuaikan stok'); const dialog = h.d.querySelector('[role="dialog"]');
  assert(dialog); assert(!text(dialog).includes('Apa yang perlu diperbaiki')); assert(!text(dialog).includes('Pembelian salah dicatat')); assert(!text(dialog).includes('Catatan terkait'));
  assert(h.field('Stok tercatat').readOnly); assert.equal(h.field('Stok tercatat').value, '10 buah'); assert.equal(h.field('Jumlah fisik sekarang').value, '10');
});
await test('decreasing physical count creates one correction with the correct delta and source', fixture(product()), async h => {
  await open(h); await adjust(h, 7); assert.equal(h.data().products[0].quantity, 7); assert.equal(h.data().activityLog.length, 1);
  await open(h); const card = h.btn('Buka koreksi stok: Hasil hitung ulang');
  assert(text(card).includes('−3 buah')); assert.equal(read(h).movements[0].before, 10); assert.equal(read(h).movements[0].after, 7); assert(text(card).includes('Koreksi')); assert(!card.querySelector('.stock-history-balance')); assert(card.querySelector('.stock-history-arrow'));
});
await test('increasing physical count is a positive correction', fixture(product()), async h => { await open(h); await adjust(h, 12); assert.equal(h.data().activityLog[0].adjustment.after, 12); await open(h); assert(text(h.btn('Buka koreksi stok: Hasil hitung ulang')).includes('+2 buah')); });
await test('zero count remains available through archived correction history', fixture(product()), async h => { await open(h); await adjust(h, 0); assert.equal(h.data().products.length, 0); await h.click('Telur · Lihat riwayat stok'); assert.equal(read(h).movements[0].after, 0); assert(text(h.btn('Buka koreksi stok: Hasil hitung ulang')).includes('−10 buah')); });
for (const [name, value, reason] of [['unchanged', 10, 'Hitung'], ['blank quantity', '', 'Hitung'], ['negative', -1, 'Hitung'], ['precision', 7.12345, 'Hitung'], ['missing reason', 7, '']]) {
  await test(`invalid ${name} adjustment leaves data unchanged`, fixture(product()), async h => {
    await open(h); const before = h.raw(); await h.click('Sesuaikan stok'); await h.set(h.field('Jumlah fisik sekarang'), value); await h.set(h.field('Alasan koreksi'), reason);
    h.d.querySelector('[role="dialog"] form').dispatchEvent(new h.w.Event('submit', { bubbles: true, cancelable: true })); await wait(); assert(h.d.querySelector('[role="alert"]')); assert.equal(h.raw(), before);
  });
}
await test('all sources share signed amounts, source labels, balances and one card per event', purchase(), async h => {
  await open(h); const before = h.raw(); assert.equal(cards(h).length, 4);
  const timeline = read(h); assert(timeline.balancesKnown); assert.deepEqual(JSON.parse(JSON.stringify(timeline.movements.map(event => [event.action, event.delta, event.before, event.after]))), [['adjusted', -1, 7, 6], ['disposed', -1, 8, 7], ['used', -2, 10, 8], ['received', 10, 0, 10]]);
  assert.deepEqual(cards(h).map(card => card.querySelector('.stock-history-kind').textContent.trim()), ['Koreksi stok', 'Dibuang · Aktivitas', 'Dipakai · Aktivitas', 'Stok masuk · Belanja']);
  assert.equal(h.raw(), before); assert.equal(h.data().activityLog.length, 3); assert.equal(h.data().shoppingItems[0].receipts.length, 1);
});
await test('purchase movement opens its existing shopping source', purchase(), async h => { await open(h); await h.click('Buka stok masuk: Belanja Mingguan'); assert(text(h.d.getElementById('root')).includes('Belanja Mingguan')); assert(!h.d.querySelector('.product-detail-page')); });
await test('usage movement opens its matching activity', purchase(), async h => { await open(h); await h.click('Buka dipakai: Masak siang'); assert(text(h.d.getElementById('root')).includes('Masak siang')); assert(!h.d.querySelector('.product-detail-page')); });
await test('correction movement opens its detail without entering Activity', purchase(), async h => { await open(h); await h.click('Buka koreksi stok: Timbang ulang'); assert(text(h.d.getElementById('root')).includes('Detail Koreksi Stok')); assert(!h.d.querySelector('nav')); });
await test('unsaved metadata blocks both adjustment and opening shopping history', purchase(), async h => {
  await open(h); await h.click('Detail'); await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas'); await h.click('Riwayat Pergerakan Stok');
  await h.click('Sesuaikan stok'); assert(!h.d.querySelector('[role="dialog"]')); assert(text(h.d.querySelector('[role="alert"]')).includes('Simpan perubahan'));
  await h.click('Buka stok masuk: Belanja Mingguan'); assert(h.d.querySelector('.product-detail-page')); assert(text(h.d.querySelector('[role="alert"]')).includes('Simpan perubahan'));
});
await test('manual origin stays a balance anchor without adding a movement', fixture(product('p1', 'egg', 8, { initialQuantity: 10 })), async h => {
  const current = h.data(); current.activityLog = [activity('use', 2)]; h.replace(current); await open(h);
  assert.equal(cards(h).length, 1); assert(!cards(h).some(card => card.dataset.movementId === 'origin:p1')); assert.equal(read(h).origin.quantity, 10); assert.equal(read(h).movements[0].before, 10); assert.equal(read(h).movements[0].after, 8); assert(read(h).balancesKnown);
});
await test('missing origin quantities do not invent historic balances', fixture(product('p1', 'egg', 8, { initialQuantity: undefined, stockSource: undefined })), async h => {
  const current = h.data(); current.activityLog = [activity('use', 2)]; h.replace(current); await open(h);
  assert.equal(read(h).balancesKnown, false); assert.equal(read(h).movements[0].after, null); assert(text(h.btn('Buka dipakai: Sarapan')).includes('−2 buah'));
});
await test('a mismatch at an old physical correction hides inferred balances even when final totals match', (() => { const data = fixture(product('p1', 'egg', 5, { initialQuantity: 10 })); data.activityLog = [activity('use', 2), activity('adjust', 3, { action: 'adjusted', adjustment: { productId: 'p1', before: 9, after: 6 }, title: 'Legacy count' })]; return data; })(), async h => { await open(h); assert.equal(read(h).balancesKnown, false); assert.equal(read(h).movements[0].after, null); assert.equal(read(h).movements[1].before, 9); assert.equal(read(h).movements[1].after, 6); });
await test('backdated usage is ordered by recording and keeps the physical balance correct', (() => { const data = fixture(product('p1', 'egg', 6, { initialQuantity: 10 })); data.activityLog = [activity('later', 1, { date: '2026-10-05', title: 'Dicatat kemudian', createdAt: '2026-10-07T06:00:00Z' }), activity('adjust', 3, { action: 'adjusted', adjustment: { productId: 'p1', before: 10, after: 7 }, title: 'Hitung fisik' })]; return data; })(), async h => { await open(h); assert.equal(cards(h)[0].dataset.movementId, 'later'); assert.equal(read(h).balancesKnown, true); assert.equal(read(h).movements[0].before, 7); assert.equal(read(h).movements[0].after, 6); assert(text(cards(h)[0]).includes('5 Okt')); });
await test('cancellation retains original and reversal cards with a reconciled balance', (() => { const data = fixture(product()); data.activityLog = [activity('reverse', 3, { action: 'adjusted', title: 'Pembatalan', reversalOf: 'adjust', adjustment: { productId: 'p1', before: 7, after: 10 } }), activity('adjust', 3, { action: 'adjusted', title: 'Salah', cancelledAt: '2026-10-07T05:00:00Z', adjustment: { productId: 'p1', before: 10, after: 7 } })]; return data; })(), async h => { await open(h); assert.equal(read(h).balancesKnown, true); assert(text(cards(h)[0]).includes('+3 buah')); assert(text(cards(h)[1]).includes('Dibatalkan')); assert.equal(cards(h).length, 2); });
await test('mixed-unit legacy records show recorded amounts and leave remaining stock unknown', (() => { const data = fixture(product('p1', 'rice', 500, { initialQuantity: 1500 })); data.activityLog = [activity('mixed', 1, { items: [{ productId: 'p1', productName: 'Beras', category: 'Pokok', quantity: 1, unit: 'kg' }] })]; return data; })(), async h => { await open(h); assert(text(h.btn('Buka dipakai: Sarapan')).includes('−1 kg')); assert.equal(read(h).movements[0].after, null); });
await test('decimal corrections render a rounded delta and correct stock transitions', fixture(product('p1', 'rice', 10)), async h => { await open(h); await adjust(h, 7.2); await open(h); assert(text(h.btn('Buka koreksi stok: Hasil hitung ulang')).includes('−2,8 gram')); assert.equal(read(h).balancesKnown, true); });
await test('receipt source stays scoped to the selected inventory card', (() => { const data = purchase(); data.products.push(product('other', 'egg', 4)); return data; })(), async h => { await h.click('▤ Inventori'); h.d.querySelectorAll('.inventory-product')[1].click(); await wait(); await h.click('Riwayat Pergerakan Stok'); assert.equal(cards(h).length, 0); assert(text(h.d.getElementById('root')).includes('Belum ada pergerakan stok.')); assert(!text(h.d.getElementById('root')).includes('Timbang ulang')); });
await test('missing timestamps stay unknown and never show an invented epoch date', fixture(product('p1', 'egg', 10, { createdAt: null })), async h => { await open(h); assert.equal(cards(h).length, 0); assert.equal(read(h).origin.recordedAt, null); assert(!text(h.d.getElementById('root')).includes('1970')); });
await test('legacy correction in a mismatched unit does not relabel its before/after as the current unit', (() => {
  const data = fixture(product('p1', 'rice', 7, { initialQuantity: 10 })); data.activityLog = [activity('mixed-adjust', 3, { action: 'adjusted', title: 'Old units', adjustment: { productId: 'p1', before: 10, after: 7 }, items: [{ productId: 'p1', productName: 'Beras', quantity: 3, unit: 'kg', category: 'Pokok' }] })]; return data;
})(), async h => { await open(h); const card = h.btn('Buka koreksi stok: Old units'); assert(text(card).includes('3 kg')); assert.equal(read(h).movements[0].after, null); assert(!text(card).includes('10 → 7 gram')); });
await test('opening stock without movements has only an empty state and no incomplete-history warning', fixture(product('p1', 'egg', 5)), async h => {
  await open(h); const before = h.raw();
  const history = h.d.querySelector('[aria-label="Riwayat Pergerakan Stok"]');
  assert.equal(text(history), 'Belum ada pergerakan stok.'); assert.equal(cards(h).length, 0);
  assert(!history.querySelector('[role="status"]')); assert.equal(h.raw(), before);
  await h.click('Detail'); assert(text(h.d.querySelector('[aria-label="Asal stok"]')).includes('Stok awal'));
});
await test('unknown legacy origin is not fabricated and has no placeholder movement', fixture(product('p1', 'egg', 5, { stockSource: undefined, initialQuantity: undefined })), async h => {
  await open(h); assert.equal(cards(h).length, 0); assert.equal(read(h).origin.kind, 'unknown'); assert.equal(read(h).origin.quantity, null);
  assert(!text(h.d.getElementById('root')).includes('Catatan stok lama'));
  await h.click('Detail'); assert(text(h.d.querySelector('[aria-label="Asal stok"]')).includes('Belum diketahui'));
});
await test('purchase without later changes still has one receipt movement and no duplicate Detail block', (() => { const data = purchase(); data.products[0].quantity = 10; data.activityLog = []; return data; })(), async h => {
  await open(h); assert.equal(cards(h).length, 1); assert.equal(cards(h)[0].dataset.movementId, 'origin:p1'); assert(text(cards(h)[0]).includes('+10 buah'));
  await h.click('Detail'); const detail = h.d.querySelector('[role="tabpanel"]'); assert(text(detail.firstElementChild).includes('Dari belanja')); assert(!text(detail).includes('Jumlah pembelian'));
});
await test('purchase movement without recording time uses available date and never epoch', (() => { const data = purchase(); data.shoppingItems[0].receipts[0].product.createdAt = null; return data; })(), async h => {
  await open(h); const card = cards(h).find(card => card.dataset.movementId === 'origin:p1'); assert(text(card).includes('1 Okt')); assert(!text(card).includes('00.00')); assert(!text(card).includes('1970'));
});
await test('new demo stock records its opening source and quantity without activity transactions', { ...base(), demoSeeded: false }, async h => {
  const seeded = h.data().products; assert(seeded.length > 0);
  for (const entry of seeded) { assert.equal(entry.stockSource, 'manual'); assert.equal(entry.initialQuantity, entry.quantity); }
  assert.equal(h.data().activityLog.length, 0);
});
await test('recognized old demo stock uses the original template rather than remaining quantity', (() => {
  const seedId = 'seed_0_123456789';
  const data = fixture(product(seedId, 'rice', 3, { name: 'Beras Pandan Wangi', category: 'Bahan Pokok', unit: 'kg', initialQuantity: undefined, stockSource: undefined }));
  data.activityLog = [activity('seed-use', 2, { items: [{ productId: seedId, productName: 'Beras Pandan Wangi', category: 'Bahan Pokok', quantity: 2, unit: 'kg' }] })]; return data;
})(), async h => {
  await open(h); const before = h.raw(), timeline = h.w.__readStockMovements('qa', 'seed_0_123456789');
  assert.equal(timeline.origin.kind, 'manual'); assert.equal(timeline.origin.quantity, 5); assert(timeline.balancesKnown);
  assert.equal(cards(h).length, 1); assert.equal(timeline.movements[0].before, 5); assert.equal(timeline.movements[0].after, 3); assert.equal(h.raw(), before);
});
await test('unrecognized seed-like records are not assigned a fabricated opening balance', fixture(product('seed_0_123456789', 'egg', 5, { initialQuantity: undefined, stockSource: undefined })), async h => {
  await open(h); const timeline = h.w.__readStockMovements('qa', 'seed_0_123456789');
  assert.equal(timeline.origin.kind, 'unknown'); assert.equal(timeline.origin.quantity, null); assert.equal(cards(h).length, 0);
});
fs.writeFileSync('docs/STOCK-MOVEMENTS-CHECKS.json', JSON.stringify({ method: 'Production React in JSDOM: direct adjustment, source navigation, immutable transaction counts, physical recording order, incomplete historic balances, cancellation, decimals and batch isolation. No real-device visual verification.', passed: checks.length, checks }, null, 2) + '\n');
console.log(JSON.stringify({ stock_movement_checks: checks.length, passed: checks.length }));
