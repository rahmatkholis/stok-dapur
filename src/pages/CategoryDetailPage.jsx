// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { InventoryProducts } from "../components/InventoryProducts.jsx";
var _n = {
    "Bahan Pokok": {
      icon: `🌾`,
      bg: `#FEF9C3`
    },
    Sayuran: {
      icon: `🥦`,
      bg: `#DCFCE7`
    },
    Buah: {
      icon: `🍎`,
      bg: `#FEE2E2`
    },
    "Daging & Ikan": {
      icon: `🥩`,
      bg: `#FFEDD5`
    },
    "Susu & Telur": {
      icon: `🥛`,
      bg: `#DBEAFE`
    },
    Bumbu: {
      icon: `🧄`,
      bg: `#EDE9FE`
    },
    Minuman: {
      icon: `🧃`,
      bg: `#E0F2FE`
    },
    Camilan: {
      icon: `🍿`,
      bg: `#FEF3C7`
    },
    Lainnya: {
      icon: `📦`,
      bg: `#F3F4F6`
    }
  },
  vn = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  };
function CategoryDetailPage({
  category: category,
  items: items,
  allProducts: allProducts,
  masters: masters,
  controls: controls,
  onBack: onBack,
  onEdit: onEdit
}) {
  let s = _n[category] ?? {
    icon: `📦`,
    bg: `#F3F4F6`
  };
  return <div className={`h-full overflow-y-auto max-w-[480px] mx-auto`} style={{
    background: `var(--background)`
  }}>{[<div className={`sticky top-0 z-30 flex items-center gap-3 px-4 pb-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`
    }}>{[<button type={`button`} onClick={onBack} aria-label={`Kembali ke daftar kategori`} className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0`} style={{
        background: `var(--muted)`,
        color: `var(--foreground)`
      }}>{`←`}</button>, <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0`} style={{
        background: s.bg
      }}>{s.icon}</div>, <div className={`flex-1 min-w-0`}>{[<h2 className={`font-black text-base truncate`} style={{
          color: `var(--foreground)`,
          ...vn
        }}>{category}</h2>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`,
          ...vn
        }}>{[items.length, ` batch ditampilkan`]}</p>]}</div>]}</div>, <div className={`pt-4`}>{controls}</div>, <div className={`px-4 pt-1 pb-24`}>{items.length ? <InventoryProducts products={items} allProducts={allProducts} masters={masters} onEdit={onEdit} /> : <div className={`rounded-2xl p-8 text-center mt-4`} style={{
        background: `var(--card)`,
        border: `1px solid var(--border)`
      }}>{[<p className={`font-bold text-sm`} style={{
          color: `var(--foreground)`,
          ...vn
        }}>{`Produk tidak ditemukan di kategori ini`}</p>, <p className={`text-xs mt-1`} style={{
          color: `var(--muted-foreground)`,
          ...vn
        }}>{`Ubah atau reset pencarian/filter untuk melihat stok lainnya.`}</p>]}</div>}</div>]}</div>;
}
function BatchMetadataModal({
  product: product,
  onSave: onSave,
  onClose: onClose
}) {
  let [r, i] = (0, React.useState)(String(product.quantity)),
    [a, o] = (0, React.useState)(``),
    [s, c] = (0, React.useState)(``),
    [l, u] = (0, React.useState)(false);
  function d(n) {
    n.preventDefault();
    let i = Number(r);
    if (!r.trim() || !Number.isFinite(i) || i < 0 || Math.round(i * 1e4) / 1e4 !== i || i === product.quantity) {
      c(`Isi jumlah fisik yang berbeda, minimal 0, maksimal 4 angka desimal.`);
      return;
    }
    if (!a.trim()) {
      c(`Isi alasan penyesuaian.`);
      return;
    }
    u(true);
    let o = onSave(i, a.trim());
    o && (c(o), u(false));
  }
  let f = {
    width: `100%`,
    padding: `12px 14px`,
    borderRadius: 12,
    background: `var(--muted)`,
    border: `1px solid var(--border)`,
    fontSize: 14
  };
  return <div className={`fixed inset-0 z-[65] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,.5)`
  }} onClick={e => {
    e.target === e.currentTarget && onClose();
  }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Sesuaikan Stok`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8`} style={{
      background: `var(--card)`
    }}>{[<div className={`flex items-center justify-between mb-3`}>{[<h2 className={`font-black text-lg`}>{`Sesuaikan Stok`}</h2>, <button type={`button`} aria-label={`Tutup`} onClick={onClose} className={`text-xl px-2`}>{`×`}</button>]}</div>, <p className={`text-sm mb-4`} style={{
        color: `var(--muted-foreground)`
      }}>{[product.name, ` · stok saat ini `, product.quantity, ` `, product.unit]}</p>, <form onSubmit={d} className={`flex flex-col gap-3`}>{[<label className={`text-sm font-bold`}>Stok tercatat<input aria-label="Stok tercatat" readOnly value={`${product.quantity} ${product.unit}`} style={f} className="mt-1" /></label>, <label className={`text-sm font-bold`}>{[`Jumlah fisik sekarang (`, product.unit, `)`, <input type={`number`} inputMode={`decimal`} step={`any`} min={`0`} value={r} onChange={e => {
            i(e.target.value), c(``);
          }} style={f} className={`mt-1`} />]}</label>, <label className={`text-sm font-bold`}>{[`Alasan koreksi`, <input maxLength={120} value={a} onChange={e => {
            o(e.target.value), c(``);
          }} placeholder={`Contoh: hasil hitung ulang`} style={f} className={`mt-1`} />]}</label>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`
        }}>{`Selisih jumlah dicatat sebagai Koreksi stok di Riwayat Pergerakan Stok. Jika bahan dibuang, gunakan Buang Stok.`}</p>, s && <p role={`alert`} className={`p-3 rounded-xl text-sm`} style={{
          color: `#B91C1C`,
          background: `#FEF2F2`
        }}>{s}</p>, <button type={`submit`} disabled={l} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-60`} style={{
          background: `var(--primary)`
        }}>{l ? `Menyimpan...` : `Simpan Penyesuaian`}</button>]}</form>]}</div>}</div>;
}
export { _n, vn, CategoryDetailPage, BatchMetadataModal };
