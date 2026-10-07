import { useState, useMemo } from 'react';
import type { Product } from '../types';
import { getExpiryStatus, formatDate } from '../types';

type Filter = 'all' | 'expired' | 'expiring' | 'safe';

const CATEGORY_META: Record<string, { icon: string; bg: string }> = {
  'Bahan Pokok':   { icon: '🌾', bg: '#FEF9C3' },
  'Sayuran':       { icon: '🥦', bg: '#DCFCE7' },
  'Buah':          { icon: '🍎', bg: '#FEE2E2' },
  'Daging & Ikan': { icon: '🥩', bg: '#FFEDD5' },
  'Susu & Telur':  { icon: '🥛', bg: '#DBEAFE' },
  'Bumbu':         { icon: '🧄', bg: '#EDE9FE' },
  'Minuman':       { icon: '🧃', bg: '#E0F2FE' },
  'Camilan':       { icon: '🍿', bg: '#FEF3C7' },
  'Lainnya':       { icon: '📦', bg: '#F3F4F6' },
};

const nun: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans, sans-serif' };
const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';

interface Props {
  category: string;
  items: Product[];
  onBack: () => void;
  onEdit: (p: Product) => void;
}

export default function CategoryDetailPage({ category, items, onBack, onEdit }: Props) {
  const meta = CATEGORY_META[category] ?? { icon: '📦', bg: '#F3F4F6' };
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => ({
    expired:  items.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length,
    expiring: items.filter(p => getExpiryStatus(p.expiryDate) === 'expiring').length,
    safe:     items.filter(p => getExpiryStatus(p.expiryDate) === 'safe').length,
  }), [items]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(p => getExpiryStatus(p.expiryDate) === filter);
  }, [items, filter]);

  const filterOptions: { key: Filter; label: string; count: number; activeBg: string; activeColor: string }[] = [
    { key: 'all',      label: 'Semua',       count: items.length,     activeBg: 'var(--primary)', activeColor: '#fff' },
    { key: 'expired',  label: 'Kedaluwarsa', count: counts.expired,   activeBg: '#EF4444',        activeColor: '#fff' },
    { key: 'expiring', label: 'Segera',      count: counts.expiring,  activeBg: '#F5A623',        activeColor: '#1A1612' },
    { key: 'safe',     label: 'Aman',        count: counts.safe,      activeBg: '#22C55E',        activeColor: '#fff' },
  ];

  return (
    <div className="min-h-screen max-w-[480px] mx-auto" style={{ background: '#FAFAF8' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 pb-3"
        style={{
          background: 'var(--card)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
          style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: meta.bg }}>
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-base truncate" style={{ color: 'var(--foreground)', ...nun }}>{category}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)', ...nun }}>{items.length} produk</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto">
        {filterOptions.map(opt => {
          const active = filter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: active ? opt.activeBg : 'var(--muted)',
                color: active ? opt.activeColor : 'var(--muted-foreground)',
                border: active ? 'none' : '1px solid var(--border)',
                ...nun,
              }}
            >
              {opt.label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: active ? opt.activeColor : 'var(--muted-foreground)',
                }}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product list */}
      <div className="px-4 pt-3 pb-24 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-10 text-center mt-4" style={{ background: 'var(--card)', boxShadow: shadow }}>
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-bold text-sm" style={{ color: 'var(--foreground)', ...nun }}>Tidak ada produk</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', ...nun }}>Coba filter lain</p>
          </div>
        ) : (
          filtered.map(p => (
            <ProductRow key={p.id} product={p} onEdit={() => onEdit(p)} />
          ))
        )}
      </div>
    </div>
  );
}

function ProductRow({ product, onEdit }: { product: Product; onEdit: () => void }) {
  const status = getExpiryStatus(product.expiryDate);
  const cfg = {
    expired:  { label: 'Kedaluwarsa', badgeBg: '#EF4444', badgeColor: '#fff',    dot: '#EF4444', rowBg: '#FFF8F8', border: '#FECACA' },
    expiring: { label: 'Segera',      badgeBg: '#F5A623', badgeColor: '#1A1612', dot: '#F5A623', rowBg: '#FFFDF0', border: '#FDE68A' },
    safe:     { label: 'Aman',        badgeBg: '#D1FAE5', badgeColor: '#065F46', dot: '#22C55E', rowBg: 'var(--card)', border: 'var(--border)' },
  }[status];

  return (
    <div
      className="rounded-2xl px-3.5 py-3.5 flex items-start justify-between gap-3"
      style={{ background: '#FFFFFF', boxShadow: shadow }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate mb-1.5" style={{ color: 'var(--foreground)', ...nun }}>{product.name}</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)', ...nun }}>{product.quantity} {product.unit}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', ...nun }}>Exp: {formatDate(product.expiryDate)}</p>
        {product.location && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', ...nun }}>📍 {product.location}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.badgeBg, color: cfg.badgeColor, ...nun }}
        >
          {cfg.label}
        </span>
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        >
          ✏️
        </button>
      </div>
    </div>
  );
}
