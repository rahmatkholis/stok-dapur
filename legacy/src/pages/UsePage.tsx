import { useState, useCallback, useRef, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import type { Product, ActivityEntry, ActivityItem } from '../types';
import {
  getActivityLog, addActivityEntry, getMissingActivityProducts,
  updateActivityEntry, deleteActivityEntry,
} from '../store';

const pjs: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans, sans-serif' };
const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';

const INTEGER_UNITS = new Set(['buah', 'bungkus', 'kaleng', 'botol', 'pcs', 'sachet']);
function roundQty(v: number, _unit: string) { return Math.round(v * 10000) / 10000; }
function todayStr() { return new Date().toISOString().split('T')[0]; }
function formatDateId(s: string) {
  return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

interface DraftItem { productId: string; productName: string; category: string; unit: string; availableQty: number; quantity: number; }
type UseView = 'main' | 'form' | 'detail';

interface Props { username: string; products: Product[]; onRefresh: () => void; addTrigger?: number; }

export default function UsePage({ username, products, onRefresh, addTrigger }: Props) {
  const [view, setView] = useState<UseView>('main');
  const [selectedAction, setSelectedAction] = useState<'used' | 'disposed'>('used');
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [showTypePopup, setShowTypePopup] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ActivityEntry | null>(null);
  const [log, setLog] = useState<ActivityEntry[]>(() => getActivityLog(username));

  const refreshLog = useCallback(() => setLog(getActivityLog(username)), [username]);

  const prevTrigger = useRef(addTrigger ?? 0);
  useEffect(() => {
    if (addTrigger && addTrigger !== prevTrigger.current) {
      setShowTypePopup(true);
    }
    prevTrigger.current = addTrigger ?? 0;
  }, [addTrigger]);

  function openForm(action: 'used' | 'disposed') {
    setSelectedAction(action);
    setSelectedDate(todayStr());
    setShowTypePopup(false);
    setView('form');
  }

  function handleSaved() { onRefresh(); refreshLog(); setView('main'); }

  function handleEntryUpdated(updated: ActivityEntry) {
    onRefresh();
    setSelectedEntry(updated);
    refreshLog();
  }

  function handleEntryDeleted() {
    onRefresh();
    setView('main');
    refreshLog();
  }

  if (view === 'form') {
    return (
      <div className="fixed inset-0 z-50" style={{ background: 'var(--background)' }}>
        <FormView username={username} products={products} action={selectedAction}
          onActionChange={setSelectedAction} date={selectedDate} onDateChange={setSelectedDate}
          onBack={() => setView('main')} onSaved={handleSaved} />
      </div>
    );
  }

  if (view === 'detail' && selectedEntry) {
    return (
      <div className="fixed inset-0 z-50" style={{ background: 'var(--background)' }}>
        <DetailView
          entry={selectedEntry}
          username={username}
          products={products}
          onBack={() => setView('main')}
          onUpdated={handleEntryUpdated}
          onDeleted={handleEntryDeleted}
        />
      </div>
    );
  }

  return (
    <MainView log={log} onOpenDetail={e => { setSelectedEntry(e); setView('detail'); }}
      showTypePopup={showTypePopup} onClosePopup={() => setShowTypePopup(false)}
      onSelectType={openForm} />
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

function MainView({ log, onOpenDetail, showTypePopup, onClosePopup, onSelectType }: {
  log: ActivityEntry[];
  onOpenDetail: (e: ActivityEntry) => void;
  showTypePopup: boolean;
  onClosePopup: () => void;
  onSelectType: (a: 'used' | 'disposed') => void;
}) {
  const [tab, setTab] = useState<'used' | 'disposed'>('used');
  const [search, setSearch] = useState('');

  const usedLog = log.filter(e => e.action === 'used');
  const disposedLog = log.filter(e => e.action === 'disposed');
  const tabLog = tab === 'used' ? usedLog : disposedLog;
  const visible = search.trim()
    ? tabLog.filter(e => (e.title ?? '').toLowerCase().includes(search.toLowerCase()))
    : tabLog;

  return (
    <div className="pb-28 pt-5 max-w-[480px] mx-auto">
      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
          {(['used', 'disposed'] as const).map(t => {
            const active = tab === t;
            const color = t === 'used' ? '#22C55E' : '#EF4444';
            const count = (t === 'used' ? usedLog : disposedLog).length;
            return (
              <button key={t} onClick={() => setTab(t)}
                className="py-2 rounded-lg text-sm font-black transition-all"
                style={{ background: active ? 'var(--card)' : 'transparent', color: active ? color : 'var(--muted-foreground)', boxShadow: active ? shadow : 'none', ...pjs }}
              >
                {t === 'used' ? '✅ Dipakai' : '🗑️ Dibuang'}
                {' '}
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: active ? (t === 'used' ? '#F0FDF4' : '#FEF2F2') : 'transparent', color: active ? color : 'var(--muted-foreground)' }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'used' ? 'Cari nama aktivitas...' : 'Cari alasan pembuangan...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)', ...pjs }}
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4">
        {visible.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', boxShadow: shadow }}>
            <p className="text-3xl mb-3">{tab === 'used' ? '📋' : '🗑️'}</p>
            <p className="font-black text-base mb-1" style={{ color: 'var(--foreground)', ...pjs }}>
              {search.trim() ? 'Tidak ditemukan' : `Belum ada riwayat ${tab === 'used' ? 'pemakaian' : 'pembuangan'}`}
            </p>
            {!search.trim() && (
              <p className="text-sm font-semibold mb-5" style={{ color: 'var(--muted-foreground)', ...pjs }}>Catat aktivitas produk dapur Anda</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map(e => <HistoryCard key={e.id} entry={e} onOpen={() => onOpenDetail(e)} />)}
          </div>
        )}
      </div>

      {showTypePopup && <TypeSelectPopup onClose={onClosePopup} onSelect={onSelectType} />}
    </div>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({ entry, onOpen }: { entry: ActivityEntry; onOpen: () => void }) {
  const isDisposed = entry.action === 'disposed';
  const accentBg = isDisposed ? '#FEF2F2' : '#F0FDF4';
  const items = entry.items ?? [];
  return (
    <button onClick={onOpen}
      className="w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-left transition-transform active:scale-[0.98]"
      style={{ background: 'var(--card)', boxShadow: shadow }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: accentBg }}>
        {isDisposed ? '🗑️' : '✅'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: 'var(--foreground)', ...pjs }}>
          {entry.title || (isDisposed ? 'Pembuangan' : 'Pemakaian')}
        </p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>
          {items.length} produk · {formatDateId(entry.date)}
        </p>
      </div>
      <span className="text-base shrink-0" style={{ color: 'var(--muted-foreground)' }}>›</span>
    </button>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function DetailView({ entry, username, products, onBack, onUpdated, onDeleted }: {
  entry: ActivityEntry; username: string; products: Product[];
  onBack: () => void; onUpdated: (e: ActivityEntry) => void; onDeleted: () => void;
}) {
  const isDisposed = entry.action === 'disposed';
  const accentColor = isDisposed ? '#EF4444' : '#22C55E';
  const accentBg = isDisposed ? '#FEF2F2' : '#F0FDF4';
  const label = isDisposed ? 'Dibuang' : 'Dipakai';

  // `saved` = last persisted. `pending` = in-progress edits not yet saved.
  const [saved, setSaved] = useState<ActivityEntry>(entry);
  const [pending, setPending] = useState<ActivityEntry>(entry);
  const hasPending = JSON.stringify(pending) !== JSON.stringify(saved);

  // Which inline meta field is open (title | date | null). Only one at a time.
  const [editingField, setEditingField] = useState<'title' | 'date' | null>(null);

  // Product edit modal
  const [editingProductIdx, setEditingProductIdx] = useState<number | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [error, setError] = useState('');
  const [restoreRequest, setRestoreRequest] = useState<{ mode: 'update' | 'delete'; entry: ActivityEntry; missing: ActivityItem[]; restored: Product[] } | null>(null);

  // Open a meta field; closing the other if open (keeping whatever was typed)
  function openField(f: 'title' | 'date') { setEditingField(f); }

  function handleBack() {
    if (hasPending) { setShowDiscardConfirm(true); } else { onBack(); }
  }

  function commitChange(mode: 'update' | 'delete', entry: ActivityEntry, restored: Product[] = []): string | null {
    const saveError = mode === 'update'
      ? updateActivityEntry(username, entry, restored)
      : deleteActivityEntry(username, saved.id, restored);
    if (saveError) { setError(saveError); return saveError; }
    setError('');
    setRestoreRequest(null);
    setShowDeleteConfirm(false);
    setEditingField(null);
    if (mode === 'delete') onDeleted();
    else {
      const updated = getActivityLog(username).find(e => e.id === entry.id)!;
      setSaved(updated);
      setPending(updated);
      onUpdated(updated);
    }
    return null;
  }

  function requestChange(mode: 'update' | 'delete') {
    if (mode === 'update' && (!pending.title.trim() || !pending.items.length)) { setError('Isi nama aktivitas dan minimal satu produk.'); return; }
    setShowDeleteConfirm(false);
    setError('');
    const missing = getMissingActivityProducts(username, saved, mode === 'update' ? pending.items : []);
    if (missing.length) { setRestoreRequest({ mode, entry: pending, missing, restored: [] }); return; }
    commitChange(mode, pending);
  }

  function handleSave() { requestChange('update'); }

  function restoreProduct(data: Omit<Product, 'id' | 'createdAt'>): string | null {
    if (!restoreRequest) return 'Produk tidak ditemukan.';
    const item = restoreRequest.missing[0];
    const restored = [...restoreRequest.restored, { ...data, id: item.productId, name: item.productName, category: item.category, unit: item.unit, createdAt: saved.createdAt }];
    if (restoreRequest.missing.length > 1) {
      setRestoreRequest({ ...restoreRequest, missing: restoreRequest.missing.slice(1), restored });
      return null;
    }
    return commitChange(restoreRequest.mode, restoreRequest.entry, restored);
  }

  function handleCancel() {
    setPending(saved);
    setError('');
    setEditingField(null);
    setEditingProductIdx(null);
  }

  // Product edit via ProductInputModal
  function handleProductSave(qty: number) {
    if (editingProductIdx === null) return;
    const items = pending.items.map((it, i) =>
      i === editingProductIdx ? { ...it, quantity: roundQty(qty, it.unit) } : it
    );
    setPending(prev => ({ ...prev, items }));
    setEditingProductIdx(null);
  }

  function handleProductDelete() {
    if (editingProductIdx === null) return;
    const items = pending.items.filter((_, i) => i !== editingProductIdx);
    setPending(prev => ({ ...prev, items }));
    setEditingProductIdx(null);
  }

  function addProduct(product: Product, qty: number) {
    const exists = pending.items.some(it => it.productId === product.id);
    const items = exists
      ? pending.items.map(it => it.productId === product.id ? { ...it, quantity: roundQty(qty, it.unit) } : it)
      : [...pending.items, { productId: product.id, productName: product.name, category: product.category, quantity: roundQty(qty, product.unit), unit: product.unit }];
    setPending(prev => ({ ...prev, items }));
    setShowAddProduct(false);
  }

  // Editing a historic deduction can use the current stock plus its original amount.
  const editableProducts: Product[] = [...products];
  for (const item of saved.items) {
    const index = editableProducts.findIndex(p => p.id === item.productId);
    if (index >= 0) {
      editableProducts[index] = { ...editableProducts[index], quantity: +(editableProducts[index].quantity + item.quantity).toFixed(4) };
    } else {
      editableProducts.push({ ...(item.productSnapshot ?? { id: item.productId, name: item.productName, category: item.category, unit: item.unit, expiryDate: '', createdAt: saved.createdAt }), quantity: item.quantity });
    }
  }
  const editingProductItem = editingProductIdx !== null ? pending.items[editingProductIdx] : null;
  const editingProduct = editableProducts.find(p => p.id === editingProductItem?.productId) ?? null;

  return (
    <div className="h-full max-w-[480px] mx-auto flex flex-col overflow-hidden relative">
      {/* Topbar */}
      <div className="shrink-0 px-4 pb-3"
        style={{ background: 'var(--card)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', paddingTop: 'calc(env(safe-area-inset-top, 16px) + 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={handleBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
          >‹</button>
          <span className="font-black text-base flex-1 truncate" style={{ color: 'var(--foreground)', ...pjs }}>
            {pending.title || label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-40">
        {error && <p role="alert" className="text-sm rounded-xl px-3 py-2 mb-4" style={{ background: '#FEF2F2', color: '#EF4444' }}>{error}</p>}

        {/* Meta card */}
        <div className="rounded-2xl p-4 mb-5 flex flex-col gap-0" style={{ background: 'var(--card)', boxShadow: shadow }}>

          {/* Jenis Aktivitas */}
          <div className="pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)', ...pjs }}>Jenis Aktivitas</p>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: accentBg, color: accentColor, ...pjs }}>{label}</span>
          </div>

          <div className="h-px" style={{ background: 'var(--border)' }} />

          {/* Title field */}
          <div className="py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)', ...pjs }}>
              {isDisposed ? 'Alasan' : 'Nama Aktivitas'}
            </p>
            {editingField === 'title' ? (
              <input type="text" value={pending.title}
                onChange={e => setPending(p => ({ ...p, title: e.target.value }))}
                placeholder={isDisposed ? 'mis. kedaluwarsa, bau...' : 'mis. Masak malam...'}
                style={fieldInputStyle} autoFocus />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-sm" style={{ color: 'var(--foreground)', ...pjs }}>{pending.title}</p>
                <button onClick={() => openField('title')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >✏️</button>
              </div>
            )}
          </div>

          <div className="h-px" style={{ background: 'var(--border)' }} />

          {/* Date field */}
          <div className="pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)', ...pjs }}>Tanggal</p>
            {editingField === 'date' ? (
              <input type="date" value={pending.date} max={todayStr()}
                onChange={e => setPending(p => ({ ...p, date: e.target.value || p.date }))}
                style={fieldInputStyle} autoFocus />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-sm" style={{ color: 'var(--foreground)', ...pjs }}>{formatDateId(pending.date)}</p>
                <button onClick={() => openField('date')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >✏️</button>
              </div>
            )}
          </div>

        </div>

        {/* Products */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', ...pjs }}>
            Daftar Produk ({pending.items.length})
          </p>
          <button onClick={() => setShowAddProduct(true)}
            className="text-xs font-black px-2.5 py-1 rounded-lg"
            style={{ background: 'var(--muted)', color: 'var(--primary)', ...pjs }}
          >+ Tambah</button>
        </div>

        <div className="flex flex-col gap-2">
          {pending.items.map((item, i) => (
            <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'var(--card)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--foreground)', ...pjs }}>{item.productName}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>{item.category}</p>
              </div>
              <span className="font-black text-sm shrink-0" style={{ color: accentColor, ...pjs }}>{item.quantity} {item.unit}</span>
              <button onClick={() => { setEditingField(null); setEditingProductIdx(i); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >✏️</button>
            </div>
          ))}
        </div>

        {/* Delete activity button */}
        <button onClick={() => setShowDeleteConfirm(true)}
          className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', ...pjs }}
        >
          🗑️ Hapus Aktivitas
        </button>
      </div>

      {/* Floating save bar — appears whenever pending !== saved */}
      {hasPending && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-6 flex gap-3"
          style={{ background: 'var(--card)', boxShadow: '0 -2px 16px rgba(0,0,0,0.12)', zIndex: 10 }}
        >
          <button onClick={handleCancel}
            className="px-5 py-3.5 rounded-xl font-bold text-sm shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', ...pjs }}
          >Batalkan</button>
          <button onClick={handleSave} disabled={!pending.title.trim() || !pending.items.length}
            className="flex-1 py-3.5 rounded-xl font-black text-sm"
            style={{
              background: (!pending.title.trim() || !pending.items.length) ? 'var(--border)' : 'var(--primary)',
              color: (!pending.title.trim() || !pending.items.length) ? 'var(--muted-foreground)' : '#fff', ...pjs,
            }}
          >Simpan</button>
        </div>
      )}

      {/* Discard confirm — back pressed with unsaved changes */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
        >
          <div className="w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4" style={{ background: 'var(--card)' }}>
            <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'var(--border)' }} />
            <div>
              <p className="font-black text-base mb-1" style={{ color: 'var(--foreground)', ...pjs }}>Keluar tanpa menyimpan?</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)', ...pjs }}>
                Perubahan yang belum disimpan akan hilang jika kamu keluar sekarang.
              </p>
            </div>
            <button onClick={onBack}
              className="w-full py-3.5 rounded-xl font-black text-sm"
              style={{ background: 'var(--primary)', color: '#fff', ...pjs }}
            >Oke, Keluar</button>
            <button onClick={() => setShowDiscardConfirm(false)}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', ...pjs }}
            >Batal</button>
          </div>
        </div>
      )}

      {/* Delete activity confirm */}
      {showDeleteConfirm && (
        <DeleteConfirmPopup label={label} onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => requestChange('delete')} />
      )}

      {restoreRequest && (
        <ProductModal
          key={restoreRequest.missing[0].productId}
          product={{ id: restoreRequest.missing[0].productId, name: restoreRequest.missing[0].productName, category: restoreRequest.missing[0].category, quantity: restoreRequest.missing[0].quantity, unit: restoreRequest.missing[0].unit, expiryDate: '', createdAt: saved.createdAt }}
          title="Lengkapi Stok yang Dikembalikan"
          submitLabel={restoreRequest.missing.length > 1 ? 'Lanjut' : 'Simpan & Perbarui Stok'}
          lockDetails
          onSave={restoreProduct}
          onClose={() => setRestoreRequest(null)}
        />
      )}

      {/* Edit product modal (same ProductInputModal as FormView) */}
      {editingProductIdx !== null && editingProduct && (
        <ProductInputModal
          product={editingProduct}
          accentColor={accentColor}
          initialQty={pending.items[editingProductIdx]?.quantity}
          onClose={() => setEditingProductIdx(null)}
          onSave={handleProductSave}
          onDelete={handleProductDelete}
        />
      )}

      {/* Add product modal */}
      {showAddProduct && (
        <AddProductModal
          products={editableProducts}
          existingIds={new Set(pending.items.map(it => it.productId))}
          accentColor={accentColor}
          onClose={() => setShowAddProduct(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}

// ─── Delete Confirm Popup ─────────────────────────────────────────────────────

function DeleteConfirmPopup({ label, onCancel, onConfirm }: {
  label: string; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4" style={{ background: 'var(--card)' }}>
        <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'var(--border)' }} />
        <div>
          <p className="font-black text-base mb-1" style={{ color: 'var(--foreground)', ...pjs }}>Hapus Aktivitas?</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)', ...pjs }}>
            Aktivitas {label.toLowerCase()} ini akan dihapus dari riwayat. Jumlah produk yang tercatat akan dikembalikan ke stok inventori.
          </p>
        </div>
        <button onClick={onConfirm}
          className="w-full py-3.5 rounded-xl font-black text-sm"
          style={{ background: '#EF4444', color: '#fff', ...pjs }}
        >
          Ya, Hapus
        </button>
        <button onClick={onCancel}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', ...pjs }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}

// ─── Add Product Modal (for edit mode) ───────────────────────────────────────

function AddProductModal({ products, existingIds, accentColor, onClose, onAdd }: {
  products: Product[];
  existingIds: Set<string>;
  accentColor: string;
  onClose: () => void;
  onAdd: (product: Product, qty: number) => void;
}) {
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Product | null>(null);

  const list = products.filter(p => p.quantity > 0 || existingIds.has(p.id)).filter(p =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Product list bottom sheet */}
      <div className="fixed inset-0 z-[60] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full max-w-[480px] rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 max-h-[80vh]" style={{ background: 'var(--card)' }}>
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'var(--border)' }} />
          <div className="flex items-center justify-between">
            <p className="font-black text-base" style={{ color: 'var(--foreground)', ...pjs }}>Tambah Produk</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>×</button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)', ...pjs }}
            />
          </div>
          <div className="overflow-y-auto flex flex-col gap-2">
            {list.map(product => (
              <button key={product.id} onClick={() => setPicked(product)}
                className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98]"
                style={{ background: 'var(--muted)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate" style={{ color: 'var(--foreground)', ...pjs }}>{product.name}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>{product.quantity} {product.unit} · {product.category}</p>
                </div>
                {existingIds.has(product.id) && <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{ background: accentColor + '22', color: accentColor }}>Ada</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ProductInputModal opens on top when a product is picked */}
      {picked && (
        <ProductInputModal
          product={picked}
          accentColor={accentColor}
          onClose={() => setPicked(null)}
          onSave={qty => { onAdd(picked, qty); setPicked(null); }}
        />
      )}
    </>
  );
}

// ─── Type Select Popup ────────────────────────────────────────────────────────

function TypeSelectPopup({ onClose, onSelect }: { onClose: () => void; onSelect: (a: 'used' | 'disposed') => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] rounded-t-3xl px-5 pt-4 pb-10 flex flex-col gap-3" style={{ background: 'var(--card)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: 'var(--border)' }} />
        <p className="font-black text-base mb-1" style={{ color: 'var(--foreground)', ...pjs }}>Pilih Jenis Aktivitas</p>
        <button onClick={() => onSelect('used')} className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-transform active:scale-[0.98]" style={{ background: '#F0FDF4' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#DCFCE7' }}>✅</div>
          <div>
            <p className="font-black text-sm" style={{ color: '#15803D', ...pjs }}>Dipakai</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#16A34A', ...pjs }}>Produk digunakan untuk memasak atau dikonsumsi</p>
          </div>
        </button>
        <button onClick={() => onSelect('disposed')} className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-transform active:scale-[0.98]" style={{ background: '#FEF2F2' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#FEE2E2' }}>🗑️</div>
          <div>
            <p className="font-black text-sm" style={{ color: '#B91C1C', ...pjs }}>Dibuang</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#DC2626', ...pjs }}>Produk expired, rusak, atau tidak layak konsumsi</p>
          </div>
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold mt-1" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', ...pjs }}>Batal</button>
      </div>
    </div>
  );
}

// ─── Form View ────────────────────────────────────────────────────────────────

function FormView({ username, products, action, onActionChange, date, onDateChange, onBack, onSaved }: {
  username: string; products: Product[]; action: 'used' | 'disposed'; onActionChange: (a: 'used' | 'disposed') => void;
  date: string; onDateChange: (d: string) => void; onBack: () => void; onSaved: () => void;
}) {
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [pickedProduct, setPickedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isDisposed = action === 'disposed';
  const accentColor = isDisposed ? '#EF4444' : '#22C55E';
  const saveLabel = isDisposed ? 'Simpan Pembuangan' : 'Simpan Pemakaian';
  const draftIds = new Set(draft.map(d => d.productId));
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const availableProducts = products.filter(p => p.quantity > 0);
  const categories = ['Semua', ...Array.from(new Set(availableProducts.map(p => p.category))).sort()];

  const listProducts = availableProducts.filter(p =>
    (selectedCategory === 'Semua' || p.category === selectedCategory) &&
    (!search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleSave() {
    if (saving) return;
    if (!title.trim()) { setError(isDisposed ? 'Alasan wajib diisi.' : 'Nama aktivitas wajib diisi.'); return; }
    if (draft.length === 0) { setError('Pilih minimal satu produk.'); return; }
    setSaving(true); setError('');
    const entry: ActivityEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      action, date, title: title.trim(),
      items: draft.map(d => ({ productId: d.productId, productName: d.productName, category: d.category, quantity: d.quantity, unit: d.unit } satisfies ActivityItem)),
      createdAt: new Date().toISOString(),
    };
    const saveError = addActivityEntry(username, entry);
    if (saveError) { setSaving(false); setError(saveError); return; }
    onSaved();
  }

  function handleModalSave(productId: string, qty: number) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setDraft(prev => {
      const exists = prev.some(d => d.productId === productId);
      if (exists) return prev.map(d => d.productId === productId ? { ...d, quantity: qty } : d);
      return [...prev, { productId: product.id, productName: product.name, category: product.category, unit: product.unit, availableQty: product.quantity, quantity: qty }];
    });
    setPickedProduct(null);
  }

  return (
    <div className="h-full max-w-[480px] mx-auto flex flex-col overflow-hidden">
      <div className="shrink-0 px-4 pb-3"
        style={{ background: 'var(--card)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', paddingTop: 'calc(env(safe-area-inset-top, 16px) + 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>‹</button>
          <span className="font-black text-base flex-1" style={{ color: 'var(--foreground)', ...pjs }}>Catat Aktivitas</span>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full shrink-0"
            style={{ background: isDisposed ? '#FEF2F2' : '#F0FDF4', color: isDisposed ? '#EF4444' : '#22C55E', ...pjs }}
          >{isDisposed ? '🗑️ Dibuang' : '✅ Dipakai'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-1">
          <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ background: 'var(--card)', boxShadow: shadow }}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>
                {isDisposed ? 'Alasan *' : 'Nama Aktivitas *'}
              </label>
              <input type="text" value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
                placeholder={isDisposed ? 'mis. kedaluwarsa, bau, rusak...' : 'mis. Masak malam, Sarapan...'}
                style={fieldInputStyle} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>Tanggal Aktivitas</label>
              <input type="date" value={date} max={todayStr()} onChange={e => onDateChange(e.target.value || todayStr())} style={fieldInputStyle} />
            </div>
          </div>
        </div>

        {draft.length > 0 && (
          <div className="px-4 pt-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)', ...pjs }}>
              Produk yang {isDisposed ? 'dibuang' : 'dipakai'} ({draft.length})
            </p>
            <div className="flex flex-col gap-2">
              {draft.map(item => (
                <div key={item.productId} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'var(--card)', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: isDisposed ? '#FEF2F2' : '#F0FDF4' }}>
                    {isDisposed ? '🗑️' : '✅'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: 'var(--foreground)', ...pjs }}>{item.productName}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>{item.quantity} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => { const p = products.find(x => x.id === item.productId); if (p) setPickedProduct(p); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>✏️</button>
                    <button onClick={() => setDraft(p => p.filter(d => d.productId !== item.productId))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444', fontSize: 18, lineHeight: 1 }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pt-5 pb-32">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)', ...pjs }}>Pilih Produk</p>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)', ...pjs }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all"
                  style={{
                    background: active ? accentColor : 'var(--muted)',
                    color: active ? '#fff' : 'var(--muted-foreground)',
                    ...pjs,
                  }}
                >{cat}</button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {listProducts.map(product => {
              const inDraft = draftIds.has(product.id);
              return (
                <button key={product.id} onClick={() => setPickedProduct(product)}
                  className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98]"
                  style={{ background: 'var(--card)', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: 'var(--foreground)', ...pjs }}>{product.name}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>Stok: {product.quantity} {product.unit} · {product.category}</p>
                  </div>
                  {inDraft
                    ? <span className="text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0" style={{ background: isDisposed ? '#FEF2F2' : '#F0FDF4', color: accentColor, ...pjs }}>✓ Edit</span>
                    : <span className="text-xl font-bold shrink-0" style={{ color: 'var(--primary)' }}>+</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pt-3 pb-4" style={{ background: 'var(--card)', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        {error && <p className="text-xs font-semibold mb-3 px-3 py-2 rounded-xl" style={{ background: '#FEE2E2', color: '#EF4444', ...pjs }}>{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-xl font-black text-sm"
          style={{ background: (draft.length === 0 || !title.trim()) ? 'var(--border)' : isDisposed ? '#EF4444' : 'var(--primary)', color: (draft.length === 0 || !title.trim()) ? 'var(--muted-foreground)' : '#fff', cursor: (draft.length === 0 || !title.trim()) ? 'not-allowed' : 'pointer', ...pjs }}
        >
          {saving ? 'Menyimpan...' : draft.length === 0 ? 'Pilih produk terlebih dahulu' : `${saveLabel} (${draft.length} produk)`}
        </button>
      </div>

      {pickedProduct && (
        <ProductInputModal product={pickedProduct} accentColor={accentColor}
          initialQty={draft.find(d => d.productId === pickedProduct.id)?.quantity}
          onClose={() => setPickedProduct(null)}
          onSave={qty => handleModalSave(pickedProduct.id, qty)}
        />
      )}
    </div>
  );
}

// ─── Product Input Modal ──────────────────────────────────────────────────────

function ProductInputModal({ product, accentColor, initialQty, onClose, onSave, onDelete }: {
  product: Product; accentColor: string; initialQty?: number; onClose: () => void; onSave: (qty: number) => void; onDelete?: () => void;
}) {
  const step = INTEGER_UNITS.has(product.unit) && Number.isInteger(product.quantity) ? 1 : 0.0001;
  const min = Math.min(step, product.quantity);
  const initQ = initialQty ?? min;
  const [qty, setQty] = useState(initQ);
  const [qtyStr, setQtyStr] = useState(String(initQ));

  function syncFromSlider(val: number) { const r = roundQty(val, product.unit); setQty(r); setQtyStr(String(r)); }
  function syncFromInput(val: string) { setQtyStr(val); setQty(roundQty(parseFloat(val), product.unit)); }
  function handleBlur() { const n = parseFloat(qtyStr); if (isNaN(n) || n <= 0) { setQty(min); setQtyStr(String(min)); } else { const v = roundQty(Math.min(n, product.quantity), product.unit); setQty(v); setQtyStr(String(v)); } }
  const isValid = Number.isFinite(qty) && qty > 0 && qty <= product.quantity;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4" style={{ background: 'var(--card)' }}>
        <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'var(--border)' }} />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-black text-base truncate" style={{ color: 'var(--foreground)', ...pjs }}>{product.name}</h3>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>{product.category}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>×</button>
        </div>
        <div className="rounded-xl px-4 py-3 flex justify-between items-center" style={{ background: 'var(--muted)' }}>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)', ...pjs }}>{onDelete ? 'Maksimum untuk aktivitas ini' : 'Stok saat ini'}</span>
          <span className="font-black text-sm" style={{ color: 'var(--foreground)', ...pjs }}>{product.quantity} {product.unit}</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)', ...pjs }}>Jumlah ({product.unit})</label>
            <button type="button" onClick={() => syncFromSlider(product.quantity)} className="text-xs font-black px-2.5 py-1 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--primary)', ...pjs }}>Seluruh stok</button>
          </div>
          <input type="number" value={qtyStr} min={min} max={product.quantity} step={step}
            onChange={e => syncFromInput(e.target.value)} onBlur={handleBlur}
            className="w-full mb-3 text-center text-3xl font-black outline-none rounded-xl py-3"
            style={{ background: 'var(--muted)', border: '1.5px solid var(--border)', color: 'var(--foreground)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
          <input type="range" min={0} max={product.quantity} step={step} value={qty}
            onChange={e => syncFromSlider(parseFloat(e.target.value))} className="w-full" style={{ accentColor }} />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-semibold" style={{ color: 'var(--muted-foreground)', ...pjs }}>0</span>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--muted-foreground)', ...pjs }}>{product.quantity} {product.unit}</span>
          </div>
        </div>
        {onDelete ? (
          <div className="flex gap-2 items-stretch">
            <button onClick={onDelete}
              className="px-4 py-3.5 rounded-xl font-bold text-sm shrink-0"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', ...pjs }}
            >Hapus Produk</button>
            <button onClick={() => isValid && onSave(qty)} disabled={!isValid}
              className="flex-1 py-3.5 rounded-xl font-black text-sm"
              style={{ background: !isValid ? 'var(--border)' : accentColor, color: !isValid ? 'var(--muted-foreground)' : '#fff', cursor: !isValid ? 'not-allowed' : 'pointer', ...pjs }}
            >Perbarui Produk</button>
          </div>
        ) : (
          <button onClick={() => isValid && onSave(qty)} disabled={!isValid}
            className="w-full py-3.5 rounded-xl font-black text-sm"
            style={{ background: !isValid ? 'var(--border)' : accentColor, color: !isValid ? 'var(--muted-foreground)' : '#fff', cursor: !isValid ? 'not-allowed' : 'pointer', ...pjs }}
          >
            {initialQty !== undefined ? 'Perbarui' : 'Tambah ke Daftar'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const fieldInputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid var(--border)', background: 'var(--muted)',
  color: 'var(--foreground)', fontSize: 14, outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600,
};
