import { formatDate } from '../lib/store.js';
const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';
const amount = value => value.toLocaleString('id-ID', { maximumFractionDigits: 4 });
function StockHistoryCard({ movement, unit, onOpen }) {
  const incoming = movement.action === 'received';
  const correction = movement.action === 'adjusted';
  const label = incoming ? movement.source === 'Inventori' ? 'Stok awal · Inventori' : `Stok masuk · ${movement.source}`
    : movement.reversal ? 'Pembatalan koreksi' : correction ? 'Koreksi stok' : movement.action === 'used' ? 'Dipakai · Aktivitas' : 'Dibuang · Aktivitas';
  const recordedAmounts = movement.quantities?.every(item => Number.isFinite(item.quantity)) ? movement.quantities.map(item => `${correction ? '' : '−'}${amount(item.quantity)} ${item.unit}`).join(' + ') : '';
  const delta = Number.isFinite(movement.delta) ? `${movement.delta > 0 ? '+' : movement.delta < 0 ? '−' : ''}${amount(Math.abs(movement.delta))} ${unit}` : recordedAmounts || 'Jumlah belum diketahui';
  const ariaKind = incoming ? 'stok masuk' : correction ? 'koreksi stok' : movement.action === 'used' ? 'dipakai' : 'dibuang';
  const Content = onOpen ? 'button' : 'div';
  const recorded = movement.recordedAt ? new Date(movement.recordedAt) : new Date(NaN);
  const recordedDay = Number.isNaN(recorded.getTime()) ? null : `${recorded.getFullYear()}-${String(recorded.getMonth() + 1).padStart(2, '0')}-${String(recorded.getDate()).padStart(2, '0')}`;
  const date = movement.date && movement.date !== recordedDay ? formatDate(movement.date)
    : recordedDay ? recorded.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : formatDate(movement.date);
  // Keep essential layout inline so cached styles cannot collapse the card's text.
  return <Content type={onOpen ? 'button' : undefined} onClick={onOpen} aria-label={onOpen ? `Buka ${ariaKind}: ${movement.title}` : undefined} data-movement-id={movement.id} className="stock-history-card w-full rounded-2xl text-left" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 16, border: 0, borderRadius: 16, textAlign: 'left', background: 'var(--card)', color: 'var(--foreground)', boxShadow: shadow, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
    <span className="stock-history-body" style={{ display: 'block', flex: 1, minWidth: 0 }}>
      <span className="stock-history-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ display: 'block', flex: 1, minWidth: 0 }}>
          <span className="stock-history-kind" style={{ display: 'block', fontSize: 14, lineHeight: 1.5, color: 'var(--muted-foreground)', overflowWrap: 'anywhere' }}>{label}{movement.cancelled ? ' · Dibatalkan' : ''}</span>
          <strong className="stock-history-title" style={{ display: 'block', marginTop: 4, fontSize: 16, lineHeight: 1.5, fontWeight: 700, overflowWrap: 'anywhere' }}>{movement.title}</strong>
        </span>
        <strong className="stock-history-amount" style={{ display: 'block', maxWidth: '42%', minWidth: 0, textAlign: 'right', fontSize: 16, lineHeight: 1.5, fontWeight: 700, overflowWrap: 'anywhere', color: movement.cancelled ? 'var(--muted-foreground)' : movement.delta > 0 ? '#15803D' : 'var(--foreground)' }}>{delta}</strong>
      </span>
      <span className="stock-history-date" style={{ display: 'block', marginTop: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{date}</span>
    </span>
    {onOpen && <span className="stock-history-arrow" aria-hidden="true" style={{ display: 'block', flex: '0 0 16px', textAlign: 'right', fontSize: 24, lineHeight: 1, color: 'var(--muted-foreground)' }}>›</span>}
  </Content>;
}
export { StockHistoryCard };
