import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
process.env.STOK_AUDIT_BUNDLE = new URL('../dist/assets/app.js', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { harness, base, product, activity, wait, text } = require('./audit/harness.cjs');
const checks = [];
const data = (...products) => ({ ...base(), products });
const panel = (h, tab) => h.d.getElementById(h.all('[role="tab"]').find(button => text(button) === tab).getAttribute('aria-controls'));
const open = async h => { await h.click('▤ Inventori'); h.d.querySelector('.inventory-product').click(); await wait(); };
const submit = async h => { h.d.querySelector('form').dispatchEvent(new h.w.Event('submit', { bubbles: true, cancelable: true })); await wait(); };
async function test(name, fixture, run) {
  const h = harness({ data: fixture });
  try { await wait(); await run(h); assert.equal(h.errors.length, 0, h.errors.join('\n')); checks.push(name); }
  finally { h.close(); }
}
await test('existing batch opens a normal page, focuses heading, and returns to the filtered list', data(product()), async h => {
  await h.click('▤ Inventori'); await h.set(h.field('Cari produk atau kategori'), 'TELUR');
  h.d.querySelector('.inventory-product').click(); await wait();
  assert(h.d.querySelector('.product-detail-page'));
  assert(!h.d.querySelector('[role="dialog"]'));
  assert(!h.d.querySelector('nav'));
  assert(!h.d.querySelector('.inventory-product'));
  assert.equal(h.d.body.style.overflow, '');
  assert.equal(h.d.activeElement.tagName, 'H2');
  await h.click('Kembali ke inventori');
  assert(h.d.querySelector('nav'));
  assert.equal(h.field('Cari produk atau kategori').value, 'TELUR');
});
const ledger = data(product('p1', 'egg', 6, { initialQuantity: 10 }));
ledger.activityLog = [
  activity('adjust', 1, { action: 'adjusted', title: 'Hitung ulang', adjustment: { productId: 'p1', before: 7, after: 6 } }),
  activity('dispose', 1, { action: 'disposed', title: 'Rusak' }),
  activity('use', 2, { title: 'Sarapan' }),
];
await test('Detail contains fields and origin last; movement totals and events are in the other tab', ledger, async h => {
  await open(h);
  const before = h.raw();
  const detail = panel(h, 'Detail'), movements = panel(h, 'Riwayat Pergerakan Stok');
  assert(!detail.hidden); assert(movements.hidden);
  assert.equal(detail.lastElementChild.tagName, 'SECTION');
  assert(text(detail.lastElementChild).includes('Ditambahkan langsung ke Inventori'));
  assert(!text(detail).includes('Sarapan'));
  assert(!text(detail).includes('Perubahan terbaru'));
  await h.click('Riwayat Pergerakan Stok');
  assert(detail.hidden); assert(!movements.hidden);
  for (const label of ['Dipakai', '2 buah', 'Dibuang', '1 buah', 'Penyesuaian', '−1 buah', 'Sarapan', 'Rusak', 'Hitung ulang']) assert(text(movements).includes(label), label);
  assert(!text(movements).includes('Ditambahkan langsung ke Inventori'));
  assert(!text(movements).includes('Jumlah awal'));
  assert.equal(h.raw(), before);
});
await test('tab switches preserve unsaved metadata and saving changes only the selected batch', data(product('first'), product('second', 'egg', 4, { location: 'Rak' })), async h => {
  await h.click('▤ Inventori'); h.d.querySelectorAll('.inventory-product')[1].click(); await wait();
  await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas');
  await h.click('Riwayat Pergerakan Stok'); await h.click('Detail');
  assert.equal(h.field('Lokasi Penyimpanan').value, 'Kulkas');
  await h.click('Simpan Perubahan');
  assert.equal(h.data().products.find(p => p.id === 'second').location, 'Kulkas');
  assert.equal(h.data().products.find(p => p.id === 'second').quantity, 4);
  assert.equal(h.data().products.find(p => p.id === 'first').location ?? '', '');
});
await test('back protects unsaved changes and discard restores the recorded value', data(product()), async h => {
  await open(h); const before = h.raw();
  await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas'); await h.click('Kembali ke inventori');
  assert(h.d.querySelector('[role="alertdialog"]'));
  await h.click('Lanjutkan Mengisi'); assert.equal(h.field('Lokasi Penyimpanan').value, 'Kulkas');
  await h.click('Kembali ke inventori'); await h.click('Keluar Tanpa Menyimpan');
  assert.equal(h.raw(), before);
});
await test('unsaved metadata blocks opening an activity until it is saved or discarded', ledger, async h => {
  await open(h); await h.set(h.field('Lokasi Penyimpanan'), 'Kulkas'); await h.click('Riwayat Pergerakan Stok');
  await h.click('Buka dipakai: Sarapan');
  assert(h.d.querySelector('.product-detail-page'));
  assert(text(h.d.querySelector('[role="alert"]')).includes('Simpan perubahan'));
});
await test('movement entry opens the matching activity', ledger, async h => {
  await open(h); await h.click('Riwayat Pergerakan Stok'); await h.click('Buka dipakai: Sarapan');
  assert(!h.d.querySelector('.product-detail-page'));
  assert(text(h.d.getElementById('root')).includes('Sarapan'));
  assert(h.d.querySelector('nav'));
});
const purchase = data(product('p1', 'egg', 10, { stockSource: 'purchase' }));
purchase.shoppingActivities = [{ id: 'trip', title: 'Belanja Mingguan', status: 'ongoing', createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' }];
purchase.shoppingItems = [{ id: 'shopping-egg', activityId: 'trip', itemId: 'egg', name: 'Telur', category: 'Segar', quantity: 10, unit: 'buah', status: 'purchased', createdAt: '2026-10-01T00:00:00Z', receipts: [{ id: 'receipt', productId: 'p1', quantity: 10, product: product('p1'), createdAt: '2026-10-01T00:00:00Z' }] }];
await test('shopping receipt is below storage location and opens its shopping record', purchase, async h => {
  await open(h);
  const detail = panel(h, 'Detail'), origin = detail.lastElementChild;
  assert(text(origin).includes('Diterima dari Belanja'));
  assert(text(origin).includes('Jumlah pembelian: 10 buah'));
  assert(!text(panel(h, 'Riwayat Pergerakan Stok')).includes('Diterima dari Belanja'));
  origin.querySelector('button').click(); await wait();
  assert(!h.d.querySelector('.product-detail-page'));
  assert(text(h.d.getElementById('root')).includes('Belanja Mingguan'), JSON.stringify({ dom: text(h.d.getElementById('root')), errors: h.errors, data: h.data().shoppingActivities }));
});
await test('correction and deletion restrictions remain in the movement tab', purchase, async h => {
  await open(h); await h.click('Riwayat Pergerakan Stok'); await h.click('Hapus Produk');
  assert(text(h.d.querySelector('[role="alertdialog"]')).includes('Produk belum bisa dihapus'));
  assert.equal(h.data().products.length, 1);
});
await test('product search and dropdown are one input, with category and unit following selection', data(), async h => {
  await h.click('▤ Inventori'); await h.click('+ Tambah');
  const input = h.field('Nama Produk *');
  assert.equal(input.getAttribute('role'), 'combobox');
  assert(!h.d.querySelector('input[placeholder="Cari item berdasarkan nama"]'));
  assert(!h.d.querySelector('select[aria-label="Nama Produk *"]'));
  await h.set(input, 'bEr');
  assert.equal(h.d.querySelectorAll('[role="option"]').length, 1);
  await h.click('Beras');
  assert.equal(input.value, 'Beras'); assert.equal(h.field('Kategori').value, 'Pokok'); assert.equal(h.field('Satuan').value, 'gram');
  await h.set(h.field('Jumlah'), '100'); await h.click('Tambah Produk');
  assert.equal(h.data().products[0].itemId, 'rice'); assert.equal(h.data().products[0].quantity, 100);
});
await test('typing an unmatched name cannot accidentally save the old selected item', data(), async h => {
  await h.click('▤ Inventori'); await h.click('+ Tambah');
  const input = h.field('Nama Produk *'); await h.set(input, 'Telur'); await h.click('Telur');
  await h.set(input, 'Tidak Ada');
  assert(text(h.d.querySelector('[role="listbox"]')).includes('Produk tidak ditemukan'));
  await h.set(h.field('Jumlah'), '3'); await submit(h);
  assert.equal(h.data().products.length, 0);
  assert(text(h.d.querySelector('[role="alert"]')).includes('Pilih item'));
});
await test('combobox supports arrow selection, Enter and Escape', data(), async h => {
  await h.click('▤ Inventori'); await h.click('+ Tambah');
  const input = h.field('Nama Produk *'); input.focus(); await wait();
  await h.set(input, 'tel'); input.dispatchEvent(new h.w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await wait();
  assert.equal(input.value, 'Telur'); assert.equal(input.getAttribute('aria-expanded'), 'false');
  await h.click('Buka pilihan nama produk *');
  assert.equal(h.d.querySelectorAll('[role="option"]').length, 3);
  input.dispatchEvent(new h.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await wait();
  assert.equal(input.value, 'Telur'); assert.equal(input.getAttribute('aria-expanded'), 'false');
});
await test('existing batch identity and quantity stay protected while date and location are editable', data(product()), async h => {
  await open(h);
  assert(h.field('Nama Produk *').disabled);
  assert(h.field('Jumlah').readOnly);
  assert(h.field('Satuan').disabled);
  assert(!h.field('Lokasi Penyimpanan').disabled);
});
await test('keyboard tabs switch the visible panel and focus', data(product()), async h => {
  await open(h);
  const detail = h.all('[role="tab"]').find(button => text(button) === 'Detail');
  detail.focus(); detail.dispatchEvent(new h.w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); await wait();
  assert.equal(text(h.d.activeElement), 'Riwayat Pergerakan Stok');
  assert(!panel(h, 'Riwayat Pergerakan Stok').hidden);
});
fs.writeFileSync('docs/PRODUCT-DETAIL-CHECKS.json', JSON.stringify({ method: 'Production React bundle in JSDOM; page navigation, tab separation, stock invariants, shopping and activity links, unsaved guard, combobox and keyboard; no browser layout engine', passed: checks.length, checks }, null, 2) + '\n');
console.log(JSON.stringify({ product_detail_checks: checks.length, passed: checks.length }));
