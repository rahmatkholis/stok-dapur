import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
process.env.STOK_AUDIT_BUNDLE = new URL('../dist/assets/app.js', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { harness, base, product, activity, wait, text } = require('./audit/harness.cjs');
const checks = [];
const initial = () => ({ ...base(), products: [product()] });
const corrected = () => ({ ...base(), products: [product('p1', 'egg', 7, { initialQuantity: 10 })], activityLog: [activity('correction', 3, { action: 'adjusted', title: 'Hasil timbang', adjustment: { productId: 'p1', before: 10, after: 7 } })] });
async function test(name, fixture, run) {
  const h = harness({ data: fixture });
  try { await wait(); await run(h); assert.equal(h.errors.length, 0, h.errors.join('\n')); checks.push(name); }
  finally { h.close(); }
}
async function open(h) { await h.click('▤ Inventori'); h.d.querySelector('.inventory-product').click(); await wait(); await h.click('Riwayat Pergerakan Stok'); }
async function correct(h, amount) {
  await open(h); await h.click('Sesuaikan stok');
  await h.set(h.field('Jumlah fisik sekarang'), amount); await h.set(h.field('Alasan koreksi'), 'Hasil timbang');
  await h.click('Simpan Penyesuaian');
}
await test('new correction is stored once, hidden from Activity, and shown as a card in product history', initial(), async h => {
  await correct(h, 7); assert.equal(h.data().products[0].quantity, 7); assert.equal(h.data().activityLog.length, 1);
  await h.click('✓ Aktivitas');
  assert(!text(h.d.getElementById('root')).includes('Hasil timbang'));
  assert(!h.all('button').some(button => text(button).startsWith('Koreksi ')));
  assert(text(h.d.getElementById('root')).includes('Semua 0'));
  await open(h); const card = h.btn('Buka koreksi stok: Hasil timbang');
  assert(card.className.includes('rounded-2xl')); assert(card.style.boxShadow);
  assert(text(card).includes('10 → 7 buah')); assert(text(card).includes('−3 buah'));
  assert.equal(h.data().activityLog.length, 1);
});
await test('existing corrections need no migration and open their details without entering Activity', corrected(), async h => {
  await open(h); const before = h.raw(); await h.click('Buka koreksi stok: Hasil timbang');
  assert(text(h.d.getElementById('root')).includes('Detail Koreksi Stok'));
  assert(!h.d.querySelector('nav'));
  assert(!h.d.querySelector('.fixed.inset-0'));
  await h.click('Kembali'); assert(h.d.querySelector('.product-detail-page')); assert.equal(h.raw(), before);
});
await test('cancelling an incorrect correction restores stock and keeps both audit records in history', corrected(), async h => {
  await open(h); await h.click('Buka koreksi stok: Hasil timbang'); await h.click('Batalkan Penyesuaian yang Salah');
  await h.click('Ya, Batalkan Penyesuaian');
  assert.equal(h.data().products[0].quantity, 10); assert.equal(h.data().activityLog.length, 2);
  assert(h.data().activityLog.find(entry => entry.id === 'correction').cancelledAt);
  assert(text(h.d.getElementById('root')).includes('Dibatalkan'));
  await h.click('Detail'); assert.equal(h.field('Jumlah').value, '10');
  await h.click('Kembali ke inventori'); await h.click('✓ Aktivitas'); assert(text(h.d.getElementById('root')).includes('Semua 0'));
});
await test('zero correction remains accessible in Inventory and can be restored', initial(), async h => {
  await correct(h, 0); assert.equal(h.data().products.length, 0);
  assert(text(h.d.getElementById('root')).includes('Riwayat stok yang sudah habis'));
  await h.click('Telur · Lihat riwayat stok');
  assert(!h.all('button').some(button => text(button) === 'Simpan Perubahan'));
  await h.click('Buka koreksi stok: Hasil timbang'); await h.click('Pulihkan 10 buah ke Inventori');
  assert.equal(h.data().products[0].quantity, 10);
  assert.equal(h.data().activityLog.length, 2);
  await h.click('Kembali ke inventori'); assert(!text(h.d.getElementById('root')).includes('Riwayat stok yang sudah habis'));
  assert(h.d.querySelector('.inventory-product'));
});
await test('usage and disposal still appear in Activity while correction is excluded from its counts and search', corrected(), async h => {
  // These earlier real events are independent of the adjustment display assertion.
  const data = h.data(); data.activityLog.push(activity('use', 1, { title: 'Sarapan' }), activity('dispose', 1, { action: 'disposed', title: 'Rusak' }));
  h.replace(data); await h.click('✓ Aktivitas');
  assert(text(h.d.getElementById('root')).includes('Semua 2'));
  assert(text(h.d.getElementById('root')).includes('Sarapan')); assert(text(h.d.getElementById('root')).includes('Rusak'));
  await h.set(h.d.querySelector('input[placeholder="Cari aktivitas..."]'), 'Hasil timbang');
  assert(text(h.d.getElementById('root')).includes('Tidak ditemukan'));
});
await test('a later usage blocks cancelling an earlier correction; the correct related activity can still open', (() => {
  const data = corrected(); data.products[0].quantity = 6;
  data.activityLog.unshift(activity('later', 1, { title: 'Masak setelah hitung', createdAt: '2026-10-07T06:00:00Z' })); return data;
})(), async h => {
  await open(h); await h.click('Buka koreksi stok: Hasil timbang');
  assert(!h.all('button').some(button => text(button) === 'Batalkan Penyesuaian yang Salah'));
  assert(text(h.d.getElementById('root')).includes('Ada catatan yang lebih baru'));
  h.all('button').find(button => text(button).includes('Masak setelah hitung')).click(); await wait();
  assert(text(h.d.getElementById('root')).includes('Masak setelah hitung')); assert.equal(h.data().products[0].quantity, 6);
});
await test('unsaved metadata blocks opening the correction card', corrected(), async h => {
  await open(h); await h.click('Detail'); await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas'); await h.click('Riwayat Pergerakan Stok');
  await h.click('Buka koreksi stok: Hasil timbang');
  assert(h.d.querySelector('.product-detail-page')); assert(text(h.d.querySelector('[role="alert"]')).includes('Simpan perubahan'));
  assert.equal(h.data().products[0].quantity, 7);
});
await test('an unrelated batch does not inherit another batch correction', (() => {
  const data = corrected(); data.products.push(product('other', 'egg', 4)); return data;
})(), async h => {
  await h.click('▤ Inventori'); h.d.querySelectorAll('.inventory-product')[1].click(); await wait(); await h.click('Riwayat Pergerakan Stok');
  assert(!h.all('button').some(button => button.getAttribute('aria-label') === 'Buka koreksi stok: Hasil timbang'));
  assert.equal(h.data().products.find(item => item.id === 'other').quantity, 4);
});
fs.writeFileSync('docs/STOCK-CORRECTION-HISTORY-CHECKS.json', JSON.stringify({ method: 'Production bundle in JSDOM: correction cards, single records, activity filtering, cancellation, zero-stock recovery, conflict safeguards, unsaved metadata, and batch isolation; no browser layout engine', passed: checks.length, checks }, null, 2) + '\n');
console.log(JSON.stringify({ stock_correction_history_checks: checks.length, passed: checks.length }));
