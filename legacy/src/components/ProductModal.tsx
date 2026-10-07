import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { CATEGORIES, UNITS } from '../types';

interface Props {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void | string | null;
  title?: string;
  submitLabel?: string;
  lockDetails?: boolean;
  onDelete?: () => void;
  onClose: () => void;
}

export default function ProductModal({ product, onSave, onDelete, onClose, title, submitLabel, lockDetails }: Props) {
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0]);
  const [quantity, setQuantity] = useState(String(product?.quantity ?? ''));
  const [unit, setUnit] = useState(product?.unit ?? UNITS[0]);
  const [expiryDate, setExpiryDate] = useState(product?.expiryDate ?? '');
  const [location, setLocation] = useState(product?.location ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Nama produk wajib diisi.'); return; }
    const qty = parseFloat(quantity);
    if (!quantity || !Number.isFinite(qty) || qty <= 0) { setError('Jumlah harus lebih dari 0.'); return; }
    if (!expiryDate) { setError('Tanggal kedaluwarsa wajib diisi.'); return; }
    setError('');
    const saveError = onSave({ name: name.trim(), category, quantity: qty, unit, expiryDate, location: location.trim() || undefined });
    if (saveError) setError(saveError);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-8 flex flex-col gap-4"
        style={{ background: 'var(--card)', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>
            {title ?? (product ? 'Edit Produk' : 'Tambah Produk')}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Nama Produk *">
            <input
              type="text"
              disabled={lockDetails}
              aria-label="Nama Produk"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="misal: Telur Ayam"
              className="input-base"
              style={inputStyle}
            />
          </Field>

          <Field label="Kategori *">
            <select aria-label="Kategori" disabled={lockDetails} value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jumlah *">
              <input
                type="number"
                disabled={lockDetails}
                aria-label="Jumlah"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                min="0.0001"
                step="any"
                style={inputStyle}
              />
            </Field>
            <Field label="Satuan *">
              <select aria-label="Satuan" disabled={lockDetails} value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tanggal Kedaluwarsa *">
            <input
              type="date"
              aria-label="Tanggal Kedaluwarsa"
              value={expiryDate}
              onChange={e => { setExpiryDate(e.target.value); setError(''); }}
              style={inputStyle}
            />
          </Field>

          <Field label="Lokasi Penyimpanan">
            <input
              type="text"
              aria-label="Lokasi Penyimpanan"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="misal: Kulkas bawah"
              style={inputStyle}
            />
          </Field>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', color: '#EF4444' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm mt-1"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {submitLabel ?? (product ? 'Simpan Perubahan' : 'Tambah Produk')}
          </button>

          {product && onDelete && (
            <button
              type="button"
              onClick={() => { if (confirm(`Hapus "${product.name}"?`)) { onDelete(); } }}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ background: '#FEF2F2', color: '#EF4444', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Hapus Produk
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid var(--border)',
  background: 'var(--muted)',
  color: 'var(--foreground)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};
