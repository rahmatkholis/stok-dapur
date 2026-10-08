import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
await build({ entryPoints: ['tests/audit-entry.jsx'], outfile: 'tests/.runtime/group-edit.js', bundle: true, format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, target: 'es2022' });
process.env.STOK_AUDIT_BUNDLE = new URL('./.runtime/group-edit.js', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { harness, base, product, activity, recipe, wait, text } = require('./audit/harness.cjs');
const checks = [];
const data = (...products) => ({ ...base(), products });
const two = () => data(product('a', 'egg', 6), product('b', 'egg', 4, { receivedDate: '2026-10-05' }));
const corrected = () => ({ ...data(product('p1', 'egg', 7, { initialQuantity: 10 })), activityLog: [activity('correction', 3, { action: 'adjusted', title: 'Hasil timbang', adjustment: { productId: 'p1', before: 10, after: 7 } })] });
async function test(name, fixture, run) {
  const h = harness({ data: fixture });
  try { await wait(); await run(h); assert.equal(h.errors.length, 0, h.errors.join('\n')); checks.push(name); }
  finally { h.close(); }
}
async function inventory(h) { await h.click('▤ Inventori'); }
async function openCard(h) { await inventory(h); h.d.querySelector('.inventory-product').click(); await wait(); }
async function openCorrection(h) { await openCard(h); await h.click('Riwayat Pergerakan Stok'); await h.click('Buka koreksi stok: Hasil timbang'); }
const callEdit = (h, update, version = h.call('getStockAdjustmentEditState', 'qa', 'correction').version) => h.call('editStockAdjustment', 'qa', 'correction', update, version);
await test('matching receipts show one sum without changing stored batches', two(), async h => {
  await inventory(h); const before = h.raw();
  assert.equal(h.d.querySelectorAll('.inventory-product').length, 1);
  assert.equal(text(h.d.querySelector('.inventory-product-quantity')), '10 buah');
  assert(text(h.d.getElementById('root')).includes('1 item stok'));
  h.d.querySelector('.inventory-product').click(); await wait();
  assert(h.d.querySelector('.grouped-product-page'));
  assert(text(h.d.getElementById('root')).includes('Stok saat ini: 10 buah'));
  assert.equal(h.d.querySelectorAll('.grouped-receipt').length, 2);
  assert.equal(h.raw(), before); await h.click('Kembali ke inventori');
});
for (const [label, change] of [['expiry', { expiryDate: '2026-10-15' }], ['location', { location: 'Kulkas' }], ['unit', { unit: 'bungkus' }], ['expiry kind', { expiryKind: 'estimated' }], ['future availability', { receivedDate: '2026-10-10' }], ['item identity', { itemId: 'rice', name: 'Beras', category: 'Pokok', unit: 'gram' }]]) {
  await test(`different ${label} stays in a separate card`, data(product('a', 'egg', 6), product('b', 'egg', 4, change)), async h => { await inventory(h); assert.equal(h.d.querySelectorAll('.inventory-product').length, 2); });
}
await test('distinct future dates stay separate while identical future dates combine', data(product('a', 'egg', 6, { receivedDate: '2026-10-10' }), product('b', 'egg', 4, { receivedDate: '2026-10-11' }), product('c', 'egg', 2, { receivedDate: '2026-10-10' })), async h => { await inventory(h); assert.deepEqual([...h.d.querySelectorAll('.inventory-product-quantity')].map(text), ['8 buah', '4 buah']); });
await test('category view also combines matching cards', two(), async h => { await inventory(h); await h.click('Kategori'); h.all('button').find(button => text(button).includes('Segar')).click(); await wait(); assert.equal(h.d.querySelectorAll('.inventory-product').length, 1); });
await test('editing one grouped receipt changes only its metadata and splits the cards', two(), async h => {
  await openCard(h); await h.click('Detail / edit penerimaan 2026-10-05 · 4 buah');
  assert.equal(h.field('Jumlah').value, '4');
  await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas'); await h.click('Simpan Perubahan');
  assert.equal(h.data().products.find(item => item.id === 'a').location ?? '', '');
  assert.equal(h.data().products.find(item => item.id === 'b').location, 'Kulkas');
  assert.equal(h.d.querySelectorAll('.inventory-product').length, 2);
});
await test('opening an individual receipt and backing returns to grouped detail', two(), async h => { await openCard(h); await h.click('Detail / edit penerimaan 2026-10-01 · 6 buah'); await h.click('Kembali ke inventori'); assert(h.d.querySelector('.grouped-product-page')); await h.click('Kembali ke inventori'); assert(h.d.querySelector('.inventory-product')); });
function purchased() {
  const fixture = two(); fixture.products = fixture.products.map(batch => ({ ...batch, stockSource: 'purchase' }));
  fixture.shoppingActivities = [{ id: 'trip', title: 'Belanja Mingguan', status: 'ongoing', createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-05T00:00:00Z' }];
  fixture.shoppingItems = [{ id: 'shopping-egg', activityId: 'trip', itemId: 'egg', name: 'Telur', category: 'Segar', quantity: 10, unit: 'buah', bought: true, createdAt: '2026-10-01T00:00:00Z', receipts: fixture.products.map(batch => ({ id: `receipt-${batch.id}`, productId: batch.id, quantity: batch.quantity, product: batch, createdAt: batch.createdAt })) }]; return fixture;
}
await test('combined detail preserves each purchase amount, date, and shopping link at the bottom', purchased(), async h => {
  await openCard(h); const detail = h.d.querySelector('[role="tabpanel"]');
  assert.equal(detail.lastElementChild.getAttribute('aria-label'), 'Diterima dari Belanja');
  assert.equal(h.d.querySelectorAll('.grouped-receipt').length, 2);
  const receipts = [...h.d.querySelectorAll('.grouped-receipt')].map(text);
  assert(receipts[0].includes('Jumlah pembelian: 6 buah')); assert(receipts[1].includes('Jumlah pembelian: 4 buah'));
  assert(receipts[1].includes('5 Okt')); await h.click('Belanja Mingguan →');
  assert(text(h.d.getElementById('root')).includes('Belanja Mingguan'));
});
await test('correcting one purchase quantity leaves the other purchase intact', purchased(), async h => {
  assert.equal(h.call('xt', 'qa', 'shopping-egg', 'a', 5), null);
  assert.equal(h.data().products.find(item => item.id === 'a').quantity, 5);
  assert.equal(h.data().products.find(item => item.id === 'b').quantity, 4);
  assert.equal(h.data().shoppingItems[0].receipts.find(receipt => receipt.productId === 'b').quantity, 4);
  assert.equal(h.data().products.reduce((sum, batch) => sum + batch.quantity, 0), 9);
});
const separatePurchases = purchased();
separatePurchases.shoppingItems = separatePurchases.shoppingItems[0].receipts.map((receipt, index) => ({ ...separatePurchases.shoppingItems[0], id: `shopping-${index}`, quantity: receipt.quantity, receipts: [receipt] }));
await test('cancelling one shopping item leaves the other purchase and card amount intact', separatePurchases, async h => {
  assert.equal(h.call('St', 'qa', 'shopping-0'), null);
  assert.equal(h.data().products.length, 1); assert.equal(h.data().products[0].id, 'b');
  assert.equal(h.data().shoppingItems[1].receipts.length, 1);
  assert.equal(h.data().products.reduce((sum, batch) => sum + batch.quantity, 0), 4);
});
await test('recipe availability still totals original batches after display grouping', { ...two(), recipes: [recipe()] }, h => { const result = h.call('I', h.data().recipes[0], h.data().products, 1, h.data().itemMasters); assert.equal(result[0].available, 10); assert.equal(result[0].shortage, 0); assert.equal(result[0].allocations[0].productId, 'a'); assert.equal(h.data().products.length, 2); });
await test('latest correction edits quantity and reason once, retaining before/id/time and consistent ledger', corrected(), async h => {
  await openCorrection(h); await h.click('Edit Koreksi'); assert(h.field('Jumlah sebelum koreksi').readOnly);
  await h.set(h.field('Jumlah setelah koreksi'), 6); await h.set(h.field('Alasan koreksi'), 'Timbangan diperiksa'); await h.click('Simpan Koreksi');
  const record = h.data().activityLog[0]; assert.equal(record.id, 'correction'); assert.equal(record.adjustment.before, 10); assert.equal(record.adjustment.after, 6); assert.equal(record.items[0].quantity, 4); assert.equal(record.createdAt, '2026-10-07T05:00:00.000Z'); assert.equal(record.revisions.length, 1); assert.equal(record.revisions[0].previousAfter, 7);
  assert.equal(h.data().products[0].quantity, 6); assert.equal(h.data().activityLog.length, 1); assert.equal(h.call('He', 'qa', 'p1').summary.consistent, true);
  await h.click('Buka koreksi stok: Timbangan diperiksa'); assert(text(h.d.getElementById('root')).includes('Riwayat edit (1)'));
});
await test('subsequent usage allows reason only and rejects changing older physical quantity', (() => { const fixture = corrected(); fixture.products[0].quantity = 5; fixture.activityLog.unshift(activity('later', 2)); return fixture; })(), async h => {
  await openCorrection(h); await h.click('Edit Koreksi'); assert(h.field('Jumlah setelah koreksi').readOnly);
  const before = h.raw(); assert(callEdit(h, { after: 6, title: 'Salah' })); assert.equal(h.raw(), before);
  await h.set(h.field('Alasan koreksi'), 'Penjelasan baru'); await h.click('Simpan Koreksi');
  assert.equal(h.data().products[0].quantity, 5); assert.equal(h.data().activityLog.find(entry => entry.id === 'correction').adjustment.after, 7);
});
await test('a cancelled later movement still prevents rewriting an old physical count', (() => { const fixture = corrected(); fixture.activityLog.unshift(activity('later', 2, { cancelledAt: '2026-10-07T06:00:00Z' })); return fixture; })(), h => { assert.equal(h.call('getStockAdjustmentEditState', 'qa', 'correction').canEditQuantity, false); });
await test('stale correction editor rejects saving after another edit without losing either value', corrected(), h => {
  const version = h.call('getStockAdjustmentEditState', 'qa', 'correction').version;
  assert.equal(callEdit(h, { after: 6, title: 'Edit pertama' }, version), null); const before = h.raw();
  assert(callEdit(h, { after: 5, title: 'Edit kedua' }, version)); assert.equal(h.raw(), before);
});
for (const [label, update] of [['negative', { after: -1, title: 'Alasan' }], ['nonfinite', { after: NaN, title: 'Alasan' }], ['excess precision', { after: 6.12345, title: 'Alasan' }], ['blank reason', { after: 6, title: ' ' }], ['return to before', { after: 10, title: 'Alasan' }]]) {
  await test(`invalid ${label} edit leaves storage untouched`, corrected(), h => { const before = h.raw(); assert(callEdit(h, update)); assert.equal(h.raw(), before); });
}
await test('editing to zero archives stock, remains accessible, and can be edited back to positive', corrected(), async h => {
  await openCorrection(h); await h.click('Edit Koreksi'); await h.set(h.field('Jumlah setelah koreksi'), 0); await h.click('Simpan Koreksi'); assert.equal(h.data().products.length, 0);
  await h.click('Kembali ke inventori'); await h.click('Telur · Lihat riwayat stok'); await h.click('Buka koreksi stok: Hasil timbang'); await h.click('Edit Koreksi'); await h.set(h.field('Jumlah setelah koreksi'), 6); await h.click('Simpan Koreksi');
  assert.equal(h.data().products[0].quantity, 6); assert.equal(h.data().activityLog.length, 1); assert.equal(h.data().activityLog[0].revisions.length, 2);
});
await test('cancelling an edited correction restores the original before quantity and retains revisions', corrected(), h => {
  assert.equal(callEdit(h, { after: 6, title: 'Diperiksa' }), null); assert.equal(h.call('Je', 'qa', 'correction'), null);
  assert.equal(h.data().products[0].quantity, 10); assert.equal(h.data().activityLog.length, 2); assert.equal(h.data().activityLog.find(event => event.id === 'correction').revisions.length, 1);
  assert.equal(h.call('He', 'qa', 'p1').summary.consistent, true);
  assert.equal(h.call('getStockAdjustmentEditState', 'qa', 'correction').canEditReason, false);
});
await test('cancelled corrections and reversal records cannot be edited', corrected(), h => {
  assert.equal(h.call('Je', 'qa', 'correction'), null); const before = h.raw();
  assert(callEdit(h, { after: 6, title: 'Forbidden' })); assert.equal(h.raw(), before);
  const reversal = h.data().activityLog.find(event => event.reversalOf);
  assert.equal(h.call('getStockAdjustmentEditState', 'qa', reversal.id).canEditReason, false);
});
await test('unchanged save adds no revision or duplicate activity', corrected(), h => { const before = h.raw(); assert.equal(callEdit(h, { after: 7, title: 'Hasil timbang' }), null); assert.equal(h.raw(), before); });
await test('grouped history opens correction for the original batch and edits only that batch', (() => { const fixture = corrected(); fixture.products.push(product('other', 'egg', 4)); return fixture; })(), async h => {
  await openCard(h); await h.click('Riwayat Pergerakan Stok'); await h.click('Buka koreksi stok: Hasil timbang'); await h.click('Edit Koreksi');
  assert.equal(h.field('Jumlah setelah koreksi').value, '7'); await h.set(h.field('Jumlah setelah koreksi'), 6); await h.click('Simpan Koreksi');
  assert.equal(h.data().products.find(batch => batch.id === 'other').quantity, 4);
  await h.click('Kembali ke inventori'); assert(h.d.querySelector('.grouped-product-page')); assert(text(h.d.getElementById('root')).includes('Stok saat ini: 10 buah'));
});
await test('receiving matching purchases stores two independent batches that combine after reload', (() => {
  const fixture = data(); fixture.shoppingActivities = [{ id: 'trip', title: 'Belanja', createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' }];
  fixture.shoppingItems = [{ id: 'plan', activityId: 'trip', itemId: 'egg', name: 'Telur', category: 'Segar', quantity: 10, unit: 'buah', bought: false, createdAt: '2026-10-01T00:00:00Z' }]; return fixture;
})(), async h => {
  assert.equal(h.call('vt', 'qa', 'plan', product('ignored', 'egg', 6)), null);
  assert.equal(h.call('vt', 'qa', 'plan', product('ignored', 'egg', 4, { receivedDate: '2026-10-05' })), null);
  const fixture = h.data(); assert.equal(fixture.products.length, 2); assert.equal(fixture.shoppingItems[0].receipts.length, 2);
  assert.notEqual(fixture.products[0].id, fixture.products[1].id);
  const fresh = harness({ data: fixture }); try { await wait(); await inventory(fresh); assert.equal(fresh.d.querySelectorAll('.inventory-product').length, 1); assert.equal(text(fresh.d.querySelector('.inventory-product-quantity')), '10 buah'); } finally { fresh.close(); }
});
await test('cooking still allocates across original batches and leaves the correct combined remainder', { ...two(), recipes: [recipe('r1', 'egg', 8)] }, h => {
  assert.equal(h.call('st', 'qa', 'r1', 1), null);
  assert(!h.data().products.some(batch => batch.id === 'a')); assert.equal(h.data().products.find(batch => batch.id === 'b').quantity, 2);
  assert.equal(h.data().activityLog.length, 1); assert.equal(h.data().activityLog[0].items.length, 2);
  assert.equal(h.call('He', 'qa', 'a').summary.consistent, true); assert.equal(h.call('He', 'qa', 'b').summary.consistent, true);
});
await test('stock movement while a correction editor is open prevents stale quantity writes', corrected(), h => {
  const version = h.call('getStockAdjustmentEditState', 'qa', 'correction').version;
  const current = h.data(); current.products[0].quantity = 5; current.activityLog.unshift(activity('later', 2)); h.replace(current); const before = h.raw();
  assert(callEdit(h, { after: 6, title: 'Old count' }, version)); assert.equal(h.raw(), before);
  assert.equal(callEdit(h, { after: 7, title: 'Reason only' }, version), null); assert.equal(h.data().products[0].quantity, 5);
});
await test('decimal correction displays a rounded delta and keeps the stock ledger consistent', corrected(), async h => {
  await openCorrection(h); await h.click('Edit Koreksi'); await h.set(h.field('Jumlah setelah koreksi'), 7.2); await h.click('Simpan Koreksi');
  assert(text(h.btn('Buka koreksi stok: Hasil timbang')).includes('−2.8 buah'));
  assert.equal(h.data().activityLog[0].items[0].quantity, 2.8); assert.equal(h.call('He', 'qa', 'p1').summary.consistent, true);
});
fs.writeFileSync('docs/GROUPED-STOCK-CORRECTION-EDIT-CHECKS.json', JSON.stringify({ method: 'Production React bundle in JSDOM plus atomic store API checks; no real browser layout verification', passed: checks.length, checks }, null, 2) + '\n');
console.log(JSON.stringify({ grouped_stock_and_correction_edit_checks: checks.length, passed: checks.length }));
