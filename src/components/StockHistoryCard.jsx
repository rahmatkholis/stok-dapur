import { formatDate } from '../lib/store.js';
const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';
const amount = value => value.toLocaleString('id-ID', { maximumFractionDigits: 4 });
function StockHistoryCard({ movement, unit, onOpen }) {
  const incoming = movement.action === 'received';
  const correction = movement.action === 'adjusted';
  const label = incoming ? 'Stok masuk' : movement.reversal ? 'Pembatalan koreksi' : correction ? 'Koreksi stok' : movement.action === 'used' ? 'Dipakai' : 'Dibuang';
  const recordedAmounts = movement.quantities?.every(item => Number.isFinite(item.quantity)) ? movement.quantities.map(item => `${correction ? '' : '−'}${amount(item.quantity)} ${item.unit}`).join(' + ') : '';
  const delta = Number.isFinite(movement.delta) ? `${movement.delta > 0 ? '+' : movement.delta < 0 ? '−' : ''}${amount(Math.abs(movement.delta))} ${unit}` : recordedAmounts ? `${correction ? 'Selisih tercatat: ' : ''}${recordedAmounts}` : 'Jumlah belum diketahui';
  const ariaKind = incoming ? 'stok masuk' : correction ? 'koreksi stok' : movement.action === 'used' ? 'dipakai' : 'dibuang';
  const Content = onOpen ? 'button' : 'div';
  const recorded = movement.recordedAt ? new Date(movement.recordedAt) : new Date(NaN);
  const recordedDay = Number.isNaN(recorded.getTime()) ? null : `${recorded.getFullYear()}-${String(recorded.getMonth() + 1).padStart(2, '0')}-${String(recorded.getDate()).padStart(2, '0')}`;
  const hasBalance = Number.isFinite(movement.before) && Number.isFinite(movement.after);
  return <Content type={onOpen ? 'button' : undefined} onClick={onOpen} aria-label={onOpen ? `Buka ${ariaKind}: ${movement.title}` : undefined} data-movement-id={movement.id} className="stock-history-card w-full rounded-2xl text-left" style={{ background: 'var(--card)', boxShadow: shadow }}>
    <span className="stock-history-heading"><strong className="stock-history-amount" style={{ color: movement.delta > 0 ? '#15803D' : 'var(--foreground)' }}>{delta}</strong><span className="stock-history-kind">{label}</span></span>
    <span className="stock-history-title">{movement.title}</span>
    {movement.cancelled && <span className="stock-history-status">Dibatalkan</span>}
    <span className="stock-history-balance">{hasBalance ? `Stok: ${amount(movement.before)} → ${amount(movement.after)} ${unit}` : 'Stok setelah: Belum diketahui'}</span>
    {movement.date && movement.date !== recordedDay && <span className="stock-history-date">{incoming ? 'Stok tersedia' : 'Terjadi'} {formatDate(movement.date)}</span>}
    <span className="stock-history-date">{Number.isNaN(recorded.getTime()) ? 'Waktu pencatatan belum diketahui' : `Dicatat ${recorded.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}</span>
    <span className="stock-history-source">{movement.source}{onOpen && <span aria-hidden="true"> ›</span>}</span>
  </Content>;
}
export { StockHistoryCard };
