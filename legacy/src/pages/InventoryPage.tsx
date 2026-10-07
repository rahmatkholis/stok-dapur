import { useState, useMemo, useEffect } from 'react';
import type { Product } from '../types';
import { CATEGORIES, getExpiryStatus } from '../types';
import ProductModal from '../components/ProductModal';
import CategoryDetailPage from './CategoryDetailPage';
import { addProduct, updateProduct, deleteProduct } from '../store';

interface Props {
  username: string;
  products: Product[];
  onRefresh: () => void;
  addTrigger?: number;
}

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

export default function InventoryPage({ username, products, onRefresh, addTrigger }: Props) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (addTrigger && addTrigger > 0) setShowModal(true);
  }, [addTrigger]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [detailCategory, setDetailCategory] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleAdd(data: Omit<Product, 'id' | 'createdAt'>) {
    const product: Product = {
      ...data,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
    };
    addProduct(username, product);
    onRefresh();
    setShowModal(false);
    showToast('Produk berhasil ditambahkan ✓');
  }

  function handleUpdate(data: Omit<Product, 'id' | 'createdAt'>) {
    if (!editProduct) return;
    updateProduct(username, { ...editProduct, ...data });
    onRefresh();
    setEditProduct(null);
    showToast('Produk berhasil diperbarui ✓');
  }

  function handleDelete(id: string) {
    deleteProduct(username, id);
    onRefresh();
    showToast('Produk dihapus');
  }

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    CATEGORIES.forEach(cat => {
      const items = products
        .filter(p => p.category === cat)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      if (items.length > 0) map[cat] = items;
    });
    return map;
  }, [products]);

  const visibleCategories = useMemo(() => {
    if (!search) return Object.entries(grouped);
    return Object.entries(grouped).filter(([, items]) =>
      items.some(p => p.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [grouped, search]);

  return (
    <div className="pb-24 pt-5 max-w-[480px] mx-auto">
      {/* Search */}
      <div className="px-4 mb-5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)', ...nun }}
          />
        </div>
      </div>

      {/* Category list — full width, stacked */}
      <div className="px-4 flex flex-col gap-3">
        {visibleCategories.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-3xl mb-2">📭</p>
            <p className="font-bold text-sm" style={{ color: 'var(--foreground)', ...nun }}>Belum ada produk</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', ...nun }}>Tambah produk terlebih dahulu</p>
          </div>
        ) : (
          visibleCategories.map(([cat, items]) => (
            <CategoryCard
              key={cat}
              category={cat}
              items={items}
              onClick={() => setDetailCategory(cat)}
            />
          ))
        )}
      </div>

      {/* Detail page overlay */}
      {detailCategory && (
        <div className="fixed inset-0 z-40" style={{ background: 'var(--background)' }}>
          <CategoryDetailPage
            category={detailCategory}
            items={grouped[detailCategory] ?? []}
            onBack={() => setDetailCategory(null)}
            onEdit={p => { setDetailCategory(null); setEditProduct(p); }}
          />
        </div>
      )}

      {/* Modals */}
      {showModal && <ProductModal onSave={handleAdd} onClose={() => setShowModal(false)} />}
      {editProduct && (
        <ProductModal
          product={editProduct}
          onSave={handleUpdate}
          onDelete={() => { handleDelete(editProduct.id); setEditProduct(null); }}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg z-50 whitespace-nowrap"
          style={{ background: 'var(--foreground)', color: 'var(--card)', ...nun }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category, items, onClick }: {
  category: string; items: Product[]; onClick: () => void;
}) {
  const meta = CATEGORY_META[category] ?? { icon: '📦', bg: '#F3F4F6' };
  const expired  = items.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length;
  const expiring = items.filter(p => getExpiryStatus(p.expiryDate) === 'expiring').length;
  const safe     = items.filter(p => getExpiryStatus(p.expiryDate) === 'safe').length;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl p-4 text-left flex items-center gap-4 transition-transform active:scale-[0.98]"
      style={{ background: 'var(--card)', boxShadow: shadow }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: meta.bg }}>
        {meta.icon}
      </div>

      {/* Name + total */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: 'var(--foreground)', ...nun }}>{category}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', ...nun }}>{items.length} produk</p>
      </div>

      {/* Stats: number on top, label below */}
      <div className="flex gap-2 shrink-0">
        <StatPill value={expired}  label="Exp"    bg="#FEF2F2" color="#EF4444" />
        <StatPill value={expiring} label="Segera"  bg="#FFFBEB" color="#D97706" />
        <StatPill value={safe}     label="Aman"    bg="#F0FDF4" color="#15803D" />
      </div>
    </button>
  );
}

function StatPill({ value, label, bg, color }: { value: number; label: string; bg: string; color: string }) {
  return (
    <div className="rounded-xl px-2.5 py-1.5 flex flex-col items-center" style={{ background: bg, minWidth: 38 }}>
      <span className="text-sm font-bold leading-none" style={{ color, ...nun }}>{value}</span>
      <span className="text-[9px] font-bold mt-0.5" style={{ color, ...nun }}>{label}</span>
    </div>
  );
}

