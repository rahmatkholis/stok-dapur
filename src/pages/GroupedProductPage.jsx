import * as React from 'react';
import { Qe, describeExpiry, readBatchLedger, roundStockQuantity } from '../lib/store.js';
import { BatchLedger } from '../components/BatchLedger.jsx';
import { StockMovementCard } from '../components/StockMovementCard.jsx';

// Receipts are aggregated for reading only. Editing always selects an original batch.
function GroupedProductPage({ batches, username, onClose, onOpenBatch, onOpenActivityEntry, onOpenShoppingActivity, onDetailModeChange }) {
  const [tab, setTab] = React.useState('detail');
  const tabId = React.useId();
  const heading = React.useRef(null);
  React.useEffect(() => {
    onDetailModeChange?.(true); window.scrollTo(0, 0); heading.current?.focus();
    return () => onDetailModeChange?.(false);
  }, [onDetailModeChange]);
  const first = batches[0];
  const total = roundStockQuantity(batches.reduce((sum, batch) => sum + batch.quantity, 0));
  const ids = new Set(batches.map(batch => batch.id));
  const entries = Qe(username).filter(entry => entry.items.some(item => ids.has(item.productId))).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const quantity = value => `${value.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${first.unit}`;
  const summary = batches.map(batch => readBatchLedger(username, batch.id)).filter(Boolean);
  const purchases = summary.filter(ledger => ledger.origin.kind === 'purchase');
  const others = summary.filter(ledger => ledger.origin.kind !== 'purchase');
  function receipt(ledger) {
    return <div key={ledger.product.id} className="grouped-receipt">
      <BatchLedger view="origin" username={username} productId={ledger.product.id} onOpenShopping={onOpenShoppingActivity} />
      <p className="text-sm">Sisa dari penerimaan ini: <strong>{quantity(ledger.product.quantity)}</strong></p>
      <button type="button" className="grouped-stock-button" onClick={() => onOpenBatch(ledger.product.id)}>Detail / edit penerimaan {ledger.origin.date || 'tanpa tanggal'} · {quantity(ledger.product.quantity)}</button>
    </div>;
  }
  return <div className="product-detail-page grouped-product-page"><div className="max-w-[480px] mx-auto product-detail-shell">
    <header className="product-detail-header"><button type="button" className="product-detail-back" aria-label="Kembali ke inventori" onClick={onClose}>‹</button><h2 ref={heading} tabIndex={-1} className="font-black text-base">Detail Produk</h2></header>
    <div role="tablist" aria-label="Bagian detail produk" className="product-detail-tabs">{[['detail', 'Detail'], ['movements', 'Riwayat Pergerakan Stok']].map(([key, label]) => <button type="button" role="tab" id={`${tabId}-${key}`} aria-selected={tab === key} aria-controls={`${tabId}-${key}-panel`} key={key} onClick={() => setTab(key)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'detail' : event.key === 'End' ? 'movements' : tab === 'detail' ? 'movements' : 'detail'; setTab(next); document.getElementById(`${tabId}-${next}`)?.focus(); } }}>{label}</button>)}</div>
    <div className="product-detail-content space-y-4"><div role="tabpanel" id={`${tabId}-detail-panel`} aria-labelledby={`${tabId}-detail`} hidden={tab !== 'detail'} className="space-y-4">
      <section className="product-detail-fields"><h3 className="font-black text-lg">{first.name}</h3><p>{first.category}</p><p className="font-bold">Stok saat ini: {quantity(total)}</p><p>{describeExpiry(first)}</p><p>Lokasi Penyimpanan: {first.location || 'Tanpa lokasi'}</p><p className="text-sm">Untuk mengubah tanggal, lokasi, atau jumlah, pilih penerimaan yang sesuai di bawah.</p></section>
      {others.length > 0 && <section aria-label="Penerimaan lainnya" className="space-y-3"><h3 className="font-bold">Penerimaan lainnya</h3>{others.map(receipt)}</section>}
      {purchases.length > 0 && <section aria-label="Diterima dari Belanja" className="space-y-3"><h3 className="font-bold">Diterima dari Belanja</h3>{purchases.map(receipt)}</section>}
    </div><div role="tabpanel" id={`${tabId}-movements-panel`} aria-labelledby={`${tabId}-movements`} hidden={tab !== 'movements'} className="space-y-3">
      <section className="product-detail-fields"><p className="font-bold">Stok saat ini: {quantity(total)}</p><div className="grid grid-cols-3 gap-2 text-xs">{[['Dipakai', 'used'], ['Dibuang', 'disposed'], ['Penyesuaian', 'adjusted']].map(([label, key]) => <div key={key}>{label}<p className="font-bold">{summary.every(ledger => ledger.summary.amountsKnown) ? quantity(roundStockQuantity(summary.reduce((sum, ledger) => sum + ledger.summary[key], 0))) : 'Belum dapat dihitung'}</p></div>)}</div>{summary.some(ledger => ledger.summary.consistent === false) && <p role="status" className="text-sm">Sebagian catatan belum menjelaskan seluruh stok saat ini. Periksa penerimaan terkait.</p>}</section>
      <h3 className="font-bold text-sm">Perubahan terbaru</h3>
      {entries.length ? entries.map(entry => <StockMovementCard key={entry.id} showDate entry={{ ...entry, items: entry.items.filter(item => ids.has(item.productId)) }} onOpen={() => entry.action === 'adjusted' ? onOpenBatch(entry.adjustment.productId, entry.id) : onOpenActivityEntry?.(entry.id)} />) : <p className="text-sm">Belum ada perubahan stok yang tercatat.</p>}
      <p className="text-xs">Koreksi berlaku pada penerimaan yang tercantum dalam detail koreksi.</p>
    </div></div>
  </div></div>;
}
export { GroupedProductPage };
