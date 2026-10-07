import { useMemo } from 'react';
import type { Product, ShoppingItem } from '../types';
import { getExpiryStatus, formatDate } from '../types';

const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';
const shadowSm = '0 1px 6px rgba(0,0,0,0.08)';

interface Props {
  username: string;
  products: Product[];
  shoppingItems: ShoppingItem[];
  onNavigate: (page: 'inventory' | 'shopping') => void;
}

export default function HomePage({ username, products, shoppingItems, onNavigate }: Props) {
  const stats = useMemo(() => {
    const expired = products.filter(p => getExpiryStatus(p.expiryDate) === 'expired');
    const expiring = products.filter(p => getExpiryStatus(p.expiryDate) === 'expiring');
    const safe = products.filter(p => getExpiryStatus(p.expiryDate) === 'safe');
    return { expired, expiring, safe, total: products.length };
  }, [products]);

  const urgentProducts = useMemo(() => {
    return [...products]
      .filter(p => getExpiryStatus(p.expiryDate) !== 'safe')
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
      .slice(0, 5);
  }, [products]);

  const shoppingNeeded = shoppingItems.filter(s => !s.bought).length;

  return (
    <div className="pb-24 px-4 pt-6 max-w-[480px] mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Selamat datang,</p>
        <p className="text-xl font-black" style={{ color: 'var(--foreground)' }}>
          {username} 🏠
        </p>
      </div>

      {/* Summary cards */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Total — full width */}
        <StatCard label="Total Produk" value={stats.total} textColor="#fff" bg="#E57034" full />

        {/* Status row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Aman" value={stats.safe.length} textColor="#fff" bg="#22C55E" onClick={() => onNavigate('inventory')} />
          <StatCard label="Segera Habis" value={stats.expiring.length} textColor="#fff" bg="#F5A300" onClick={() => onNavigate('inventory')} />
          <StatCard label="Kedaluwarsa" value={stats.expired.length} textColor="#fff" bg="#EF4444" onClick={() => onNavigate('inventory')} />
        </div>
      </div>

      {/* Shopping summary */}
      {shoppingNeeded > 0 && (
        <button
          onClick={() => onNavigate('shopping')}
          className="w-full text-left rounded-2xl p-4 mb-6 flex items-center justify-between transition-opacity active:opacity-80"
          style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', boxShadow: shadow }}
        >
          <div>
            <p className="text-xs font-bold opacity-80 mb-0.5 tracking-wide">DAFTAR BELANJA</p>
            <p className="text-lg font-black">{shoppingNeeded} item perlu dibeli</p>
          </div>
          <span className="text-2xl">→</span>
        </button>
      )}

      {/* Urgent products */}
      {urgentProducts.length > 0 ? (
        <div>
          <h2 className="font-black text-base mb-3" style={{ color: 'var(--foreground)' }}>
            Perlu Segera Dipakai
          </h2>
          <div className="flex flex-col gap-2">
            {urgentProducts.map(p => (
              <UrgentCard key={p.id} product={p} status={getExpiryStatus(p.expiryDate) as 'expired' | 'expiring'} />
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <EmptyState onNavigate={onNavigate} />
      ) : (
        <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--card)', boxShadow: shadow }}>
          <p className="text-2xl mb-2">✨</p>
          <p className="font-black text-sm" style={{ color: 'var(--foreground)' }}>Semua produk dalam kondisi aman!</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Tidak ada yang perlu segera dipakai</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, textColor, bg, onClick, full }: {
  label: string; value: number; textColor: string; bg: string; onClick?: () => void; full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl p-4 text-left transition-transform active:scale-95 flex flex-col justify-between"
      style={{
        background: bg,
        boxShadow: shadow,
        cursor: onClick ? 'pointer' : 'default',
        width: full ? '100%' : undefined,
        aspectRatio: '1 / 1',
      }}
    >
      <p className="text-4xl font-black leading-none" style={{ color: textColor }}>{value}</p>
      <p className="text-sm font-bold mt-auto pt-2" style={{ color: textColor, opacity: 0.9 }}>{label}</p>
    </button>
  );
}

function UrgentCard({ product, status }: { product: Product; status: 'expired' | 'expiring' }) {
  const isExpired = status === 'expired';
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center justify-between gap-2"
      style={{
        background: '#FFFFFF',
        boxShadow: shadowSm,
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: 'var(--foreground)' }}>{product.name}</p>
        <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          {product.quantity} {product.unit} · {product.category}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isExpired ? '#EF4444' : '#F5A300',
            color: '#fff',
          }}
        >
          {isExpired ? 'Kedaluwarsa' : 'Segera'}
        </span>
        <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          {formatDate(product.expiryDate)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onNavigate }: { onNavigate: (p: 'inventory') => void }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', boxShadow: shadow }}>
      <p className="text-4xl mb-3">🥕</p>
      <p className="font-black text-lg mb-1" style={{ color: 'var(--foreground)' }}>Dapur masih kosong</p>
      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--muted-foreground)' }}>Mulai tambah produk untuk memantau stok Anda</p>
      <button
        onClick={() => onNavigate('inventory')}
        className="px-5 py-2.5 rounded-xl text-sm font-black"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', boxShadow: shadowSm }}
      >
        Tambah Produk
      </button>
    </div>
  );
}
