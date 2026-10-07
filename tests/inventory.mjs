import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
process.env.STOK_AUDIT_BUNDLE = new URL('../dist/assets/app.js', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { harness, base, product, recipe, wait, text } = require('./audit/harness.cjs');
const checks = [];
async function test(name, data, run) {
  const h = harness({ data });
  try {
    await wait();
    await h.click('▤ Inventori');
    const before = h.raw();
    await run(h);
    assert.equal(h.errors.length, 0, h.errors.join('\n'));
    if (!name.includes('saves') && !name.includes('correction')) assert.equal(h.raw(), before, 'Viewing inventory changed data');
    checks.push(name);
  } finally { h.close(); }
}
const data = (...products) => ({ ...base(), products });
const card = h => h.d.querySelector('.inventory-product');
const summary = h => card(h).querySelector('summary');
const open = async h => { summary(h).click(); await wait(); assert.equal(card(h).open, true); };
await test('single batch has one quantity, no recipe calculation, opens and closes', data(product()), async h => {
  assert.equal(card(h).open, false);
  assert.equal(card(h).querySelectorAll('.inventory-product-quantity').length, 1);
  assert.equal(text(summary(h)).split('10 buah').length - 1, 1);
  assert(!text(card(h)).includes('Dihitung untuk resep'));
  assert(!text(summary(h)).includes('1 batch'));
  assert(!card(h).querySelector('.inventory-product-status'));
  await open(h); assert(h.btn('Edit stok'));
  summary(h).click(); await wait(); assert.equal(card(h).open, false);
});
await test('expired stock remains in physical total', data(product('p1', 'rice', 600, { expiryDate: '2026-10-02', location: 'Freezer' })), h => {
  assert(text(summary(h)).includes('600 gram'));
  assert(text(summary(h)).includes('Tanggal terlewat'));
  assert(text(summary(h)).includes('Freezer'));
});
const two = data(product('old', 'egg', 6, { expiryDate: '2026-10-02', location: 'Kulkas' }), product('new', 'egg', 4, { location: 'Rak' }));
await test('two batches show combined amount and partial expiry; second edit targets second batch', two, async h => {
  assert.equal(h.d.querySelectorAll('.inventory-product').length, 1);
  assert(text(summary(h)).includes('10 buah'));
  assert(text(summary(h)).includes('2 batch'));
  assert(text(summary(h)).includes('Sebagian melewati tanggal'));
  assert(!text(summary(h)).includes('2 Okt'));
  await open(h); await h.click('Edit batch 2');
  assert.equal(h.field('Jumlah').value, '4');
  assert.equal(h.field('Lokasi Penyimpanan').value, 'Rak');
});
await test('location filter shows matching quantity, with full total in detail', two, async h => {
  await h.click('Filter⌄'); await h.click('Kulkas'); await h.click('Tutup');
  assert(text(summary(h)).includes('6 buah'));
  assert(text(summary(h)).includes('1 dari 2 batch'));
  assert(!text(summary(h)).includes('Rak'));
  await open(h);
  assert(text(card(h)).includes('Total seluruh stok: 10 buah'));
});
await test('search ignores case and supports empty results', data(product()), async h => {
  await h.set(h.field('Cari produk atau kategori'), 'TELUR');
  assert(text(summary(h)).includes('10 buah'));
  await h.set(h.field('Cari produk atau kategori'), 'tidak-ada');
  assert.equal(h.d.querySelectorAll('.inventory-product').length, 0);
  assert(text(h.d.getElementById('root')).includes('Produk tidak ditemukan'));
});
await test('unknown date and absent location have clear labels', data(product('p1', 'egg', 10, { expiryDate: '', expiryKind: 'unknown', location: '' })), h => {
  assert(text(summary(h)).includes('Tanggal belum diisi'));
  assert(text(summary(h)).includes('Tanpa lokasi'));
});
await test('zero stock does not receive expired-stock alert', data(product('p1', 'egg', 0, { expiryDate: '2026-10-02' })), h => {
  assert(text(summary(h)).includes('0 buah'));
  assert.equal(text(card(h).querySelector('.inventory-product-status')), 'Stok habis');
});
await test('convertible units are combined; incompatible units remain separate', data(product('p1', 'rice', 500), product('p2', 'rice', 1, { unit: 'kg' }), product('p3', 'rice', 2, { unit: 'bungkus' })), h => {
  assert.equal(text(card(h).querySelector('.inventory-product-quantity')), '1.500 gram + 2 bungkus');
});
await test('metadata edit saves intended location and retains stock', data(product()), async h => {
  await open(h); await h.click('Edit stok');
  await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas');
  await h.click('Simpan Perubahan');
  assert.equal(h.data().products[0].location, 'Kulkas');
  assert.equal(h.data().products[0].quantity, 10);
  assert(text(summary(h)).includes('Kulkas'));
});
await test('stock correction remains accessible from expanded card', data(product()), async h => {
  await open(h); await h.click('Edit stok'); await h.click('Perbaiki catatan stok');
  const action = h.all('button').find(b => text(b).includes('Jumlah fisik berbeda')); assert(action); action.click(); await wait();
  await h.set(h.d.querySelector('input[type="number"]'), '7');
  await h.set(h.field('Alasan koreksi'), 'Hitung ulang');
  await h.click('Simpan Penyesuaian');
  assert.equal(h.data().products[0].quantity, 7);
  assert.equal(h.data().activityLog[0].action, 'adjusted');
  assert(text(summary(h)).includes('7 buah'));
});
await test('category inventory also uses compact cards', data(product()), async h => {
  await h.click('Kategori');
  const button = h.all('button').find(b => text(b).includes('Segar')); assert(button); button.click(); await wait();
  assert(card(h)); await open(h); assert(h.btn('Edit stok'));
});
await test('inventory navigation preserves recipe availability and stored data', { ...data(product()), recipes: [recipe()] }, async h => {
  await open(h);
  await h.click('▣ Resep');
  assert(text(h.d.getElementById('root')).includes('Menu r1'));
  assert.equal(h.data().recipes[0].ingredients[0].quantity, 2);
});
fs.writeFileSync('docs/INVENTORY-CHECKS.json', JSON.stringify({ method: 'Production bundle in JSDOM: compact card overview, disclosure, batch edit, filter totals, metadata save and correction; no browser layout engine', passed: checks.length, checks }, null, 2) + '\n');
console.log(JSON.stringify({ inventory_checks: checks.length, passed: checks.length }));
