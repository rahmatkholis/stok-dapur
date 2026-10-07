import { useState, useEffect } from 'react';
import type { ShoppingItem, Product } from '../types';
import { CATEGORIES, UNITS } from '../types';
import ProductModal from '../components/ProductModal';
import { addShoppingItem, completeShoppingItem, undoShoppingPurchase, deleteShoppingItem } from '../store';

interface Props {
  username: string;
  items: ShoppingItem[];
  onRefresh: () => void;
  addTrigger?: number;
}

export default function ShoppingPage({ username, items, onRefresh, addTrigger }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [receiving, setReceiving] = useState<ShoppingItem | null>(null);

  useEffect(() => {
    if (addTrigger && addTrigger > 0) setShowForm(true);
  }, [addTrigger]);
  const [toast, setToast] = useState('');

  const needed = items.filter(i => !i.bought);
  const bought = items.filter(i => i.bought);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleToggle(id: string) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (!item.bought) { setReceiving(item); return; }
    const error = undoShoppingPurchase(username, id);
    if (error) { showToast(error); return; }
    onRefresh();
    showToast(item.receipt ? 'Belanja dibatalkan, stok dikurangi' : 'Item kembali ke daftar belanja');
  }

  function handleReceive(data: Omit<Product, 'id' | 'createdAt'>): string | null {
    if (!receiving) return 'Item belanja tidak ditemukan.';
    const error = completeShoppingItem(username, receiving.id, data);
    if (error) return error;
    setReceiving(null);
    onRefresh();
    showToast('Sudah dibeli, stok ditambahkan ✓');
    return null;
  }

  function handleDelete(id: string) {
    deleteShoppingItem(username, id);
    onRefresh();
    showToast(items.find(i => i.id === id)?.bought ? 'Item belanja dihapus, stok tetap tersimpan' : 'Item dihapus');
  }

  function handleAdd(data: Omit<ShoppingItem, 'id' | 'createdAt' | 'bought'>) {
    const item: ShoppingItem = {
      ...data,
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      bought: false,
      createdAt: new Date().toISOString(),
    };
    addShoppingItem(username, item);
    onRefresh();
    setShowForm(false);
    showToast('Item ditambahkan ✓');
  }

  return (
    <div className="pb-24 pt-5 max-w-[480px] mx-auto">
      {needed.length > 0 && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            {needed.length} item perlu dibeli
          </p>
        </div>
      )}

      <div className="px-4">
        {items.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-display font-bold text-lg mb-1" style={{ color: 'var(--foreground)' }}>Daftar belanja kosong</p>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Tambah kebutuhan belanja Anda</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
            >
              Tambah Item
            </button>
          </div>
        ) : (
          <>
            {needed.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Perlu Dibeli</p>
                <div className="flex flex-col gap-2">
                  {needed.map(item => (
                    <ShoppingCard
                      key={item.id}
                      item={item}
                      onToggle={() => handleToggle(item.id)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            {bought.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Sudah Dibeli ({bought.length})</p>
                <div className="flex flex-col gap-2">
                  {bought.map(item => (
                    <ShoppingCard
                      key={item.id}
                      item={item}
                      onToggle={() => handleToggle(item.id)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {receiving && (
        <ProductModal
          product={{ id: receiving.id, name: receiving.name, category: receiving.category, quantity: receiving.quantity, unit: receiving.unit, expiryDate: '', createdAt: receiving.createdAt }}
          title="Masukkan Stok Belanja"
          submitLabel="Sudah Dibeli & Tambah Stok"
          onSave={handleReceive}
          onClose={() => setReceiving(null)}
        />
      )}
      {showForm && <AddItemForm onSave={handleAdd} onClose={() => setShowForm(false)} />}

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50 w-[calc(100%-32px)] max-w-[448px] whitespace-normal"
          style={{ background: 'var(--foreground)', color: 'var(--card)' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function ShoppingCard({ item, onToggle, onDelete }: { item: ShoppingItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <div
      className="rounded-xl px-3.5 py-3 flex items-center gap-3 transition-opacity"
      style={{
        background: item.bought ? 'var(--muted)' : 'var(--card)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        opacity: item.bought ? 0.65 : 1,
      }}
    >
      <button
        onClick={onToggle}
        aria-label={`${item.bought ? 'Batalkan pembelian' : 'Tandai sudah dibeli'} ${item.name}`}
        aria-pressed={item.bought}
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: item.bought ? 'var(--secondary)' : 'var(--border)',
          background: item.bought ? 'var(--secondary)' : 'transparent',
          color: '#fff',
        }}
      >
        {item.bought && <span className="text-xs font-bold">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--foreground)', textDecoration: item.bought ? 'line-through' : 'none' }}
        >
          {item.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="font-mono-data">{item.quantity} {item.unit}</span>
          {' '}· {item.category}
          {item.note && <span> · {item.note}</span>}
        </p>
      </div>
      <button
        onClick={onDelete}
        aria-label={`Hapus belanja ${item.name}`}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
      >
        ×
      </button>
    </div>
  );
}

function AddItemForm({ onSave, onClose }: {
  onSave: (data: Omit<ShoppingItem, 'id' | 'createdAt' | 'bought'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Nama item wajib diisi.'); return; }
    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) { setError('Jumlah harus lebih dari 0.'); return; }
    onSave({ name: name.trim(), category, quantity: qty, unit, note: note.trim() || undefined });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid var(--border)', background: 'var(--muted)',
    color: 'var(--foreground)', fontSize: 14, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-8 flex flex-col gap-4"
        style={{ background: 'var(--card)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>Tambah Item Belanja</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Nama Item *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="misal: Bawang Merah" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Kategori</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Jumlah *</label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" min="0.01" step="any" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Satuan</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Catatan</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="opsional" style={inputStyle} />
          </div>
          {error && <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', color: '#EF4444' }}>{error}</p>}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-sm mt-1"
            style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
          >
            Tambah ke Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
