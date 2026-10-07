// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { addActivityEntry, describeExpiry, disposeSelectedBatches, getExpiryStatus, rt } from "../lib/store.js";
import { PhysicalStockConfirmModal } from "../components/PhysicalStockConfirmModal.jsx";
import { StockAdjustmentModal } from "../components/StockAdjustmentModal.jsx";
var Pt = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`,
  Ft = `0 1px 6px rgba(0,0,0,0.08)`;
function It() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function HomePage({
  username: username,
  products: products,
  shoppingItems: shoppingItems,
  onNavigate: onNavigate,
  onInventoryStatus: onInventoryStatus,
  onOpenProduct: onOpenProduct,
  onRefresh: onRefresh
}) {
  let [s, c] = (0, React.useState)(false),
    [l, u] = (0, React.useState)(new Set()),
    [d, f] = (0, React.useState)(null),
    [p, m] = (0, React.useState)(null),
    [h, g] = (0, React.useState)(false),
    [v, y] = (0, React.useState)(``),
    [b, x] = (0, React.useState)(It),
    [C, T] = (0, React.useState)(``),
    [E, D] = (0, React.useState)(false),
    [O, k] = (0, React.useState)(``),
    [A, j] = (0, React.useState)(null),
    M = (0, React.useMemo)(() => ({
      expired: products.filter(e => getExpiryStatus(e.expiryDate) === `expired`),
      expiring: products.filter(e => getExpiryStatus(e.expiryDate) === `expiring`),
      safe: products.filter(e => getExpiryStatus(e.expiryDate) === `safe`),
      unknown: products.filter(e => getExpiryStatus(e.expiryDate) === `unknown`),
      total: products.length
    }), [products]),
    N = (0, React.useMemo)(() => {
      let e = [...products].filter(e => getExpiryStatus(e.expiryDate) !== `safe`).sort((e, t) => (e.expiryDate || `9999-12-31`).localeCompare(t.expiryDate || `9999-12-31`));
      return s ? e : e.slice(0, 5);
    }, [products, s]),
    P = N.filter(e => l.has(e.id));
  function F(e) {
    u(t => {
      let n = new Set(t);
      return n.has(e) ? n.delete(e) : n.add(e), n;
    });
  }
  function I() {
    c(false), u(new Set());
  }
  function L(t, n, r, i) {
    return d ? addActivityEntry(username, {
      id: `dispose_${crypto.randomUUID()}`,
      action: `disposed`,
      date: r,
      title: n,
      items: [{
        productId: d.id,
        productName: d.name,
        category: d.category,
        quantity: t,
        unit: d.unit
      }],
      createdAt: new Date().toISOString()
    }, i) || (f(null), k(`${d.name} berhasil dibuang.`), onRefresh(), null) : `Stok tidak ditemukan.`;
  }
  function ee(t) {
    if (E) return `Sedang menyimpan.`;
    if (!v.trim()) return T(`Isi alasan pembuangan.`), `Isi alasan pembuangan.`;
    if (!b || b > It()) return T(`Pilih tanggal hari ini atau sebelumnya.`), `Pilih tanggal hari ini atau sebelumnya.`;
    let n = rt(username, P, b);
    if (n.length && !t) return j(n), null;
    D(true);
    let r = disposeSelectedBatches(username, P.map(e => e.id), v, b, t);
    if (r) return T(r), D(false), r;
    let i = P.length;
    return g(false), j(null), D(false), y(``), x(It()), I(), k(`${i} item berhasil dibuang.`), onRefresh(), null;
  }
  let R = shoppingItems.filter(e => !e.bought).length;
  return <div className={`${s && P.length ? `pb-44` : `pb-24`} px-4 pt-6 max-w-[480px] mx-auto`}>{[O && <div role={`status`} className={`rounded-xl px-4 py-3 mb-4 text-sm font-bold flex items-center justify-between gap-3`} style={{
      background: `#DCFCE7`,
      color: `#166534`
    }}>{[<span>{O}</span>, <button type={`button`} onClick={() => k(``)} aria-label={`Tutup pesan`}>{`×`}</button>]}</div>, <div className={`mb-6`}>{[<p className={`text-sm font-semibold`} style={{
        color: `var(--muted-foreground)`
      }}>{`Selamat datang,`}</p>, <p className={`text-xl font-black`} style={{
        color: `var(--foreground)`
      }}>{[username, ` 🏠`]}</p>]}</div>, <div className={`grid grid-cols-3 gap-3 mb-6`} style={{
      gridAutoRows: `1fr`
    }}>{[<StatCard label={`Total Batch Stok`} value={M.total} textColor={`#fff`} bg={`#E57034`} full={true} />, <StatCard label={`>3 hari lagi`} value={M.safe.length} textColor={`#fff`} bg={`#22C55E`} onClick={() => onInventoryStatus(`safe`)} />, <StatCard label={`≤3 hari lagi`} value={M.expiring.length} textColor={`#fff`} bg={`#F5A300`} onClick={() => onInventoryStatus(`expiring`)} />, <StatCard label={`Tanggal terlewat`} value={M.expired.length} textColor={`#fff`} bg={`#EF4444`} onClick={() => onInventoryStatus(`expired`)} />]}</div>, <p className={`text-xs mb-6 -mt-4 px-1`} style={{
      color: `var(--muted-foreground)`
    }}>{`Ringkasan berdasarkan tanggal yang dicatat, bukan kondisi bahan.`}</p>, !!M.unknown.length && <button type={`button`} onClick={() => onInventoryStatus(`unknown`)} className={`w-full text-left rounded-xl p-3 mb-6 text-sm font-bold`} style={{
      background: `#E0E7FF`,
      color: `#312E81`
    }}>{[M.unknown.length, ` batch tanpa tanggal · Perlu dicek di Inventori`]}</button>, R > 0 && <button onClick={() => onNavigate(`shopping`)} className={`w-full text-left rounded-2xl p-4 mb-6 flex items-center justify-between transition-opacity active:opacity-80`} style={{
      background: `var(--secondary)`,
      color: `var(--secondary-foreground)`,
      boxShadow: Pt
    }}>{[<div>{[<p className={`text-xs font-bold opacity-80 mb-0.5 tracking-wide`}>{`DAFTAR BELANJA`}</p>, <p className={`text-lg font-black`}>{[R, ` item perlu dibeli`]}</p>]}</div>, <span className={`text-2xl`}>{`→`}</span>]}</button>, N.length > 0 ? <div>{[<div className={`flex items-center justify-between mb-3`}>{[<h2 className={`font-black text-base`} style={{
          color: `var(--foreground)`
        }}>{`Perlu Ditinjau`}</h2>, <button type={`button`} className={`text-sm font-black px-2 py-1`} style={{
          color: `var(--primary)`
        }} onClick={() => {
          s ? I() : (c(true), k(``));
        }}>{s ? `Batal` : `Pilih`}</button>]}</div>, s && <p className={`text-xs mb-3`} style={{
        color: `var(--muted-foreground)`
      }}>{`Pilih item untuk membuang seluruh stoknya.`}</p>, <div className={`flex flex-col gap-2`}>{N.map(e => <ExpiryProductCard product={e} status={getExpiryStatus(e.expiryDate)} selecting={s} selected={l.has(e.id)} onClick={() => s ? F(e.id) : m(e)} key={e.id} />)}</div>]}</div> : products.length === 0 ? <HomeEmptyState onNavigate={onNavigate} /> : <div className={`rounded-2xl p-5 text-center`} style={{
      background: `var(--card)`,
      boxShadow: Pt
    }}>{[<p className={`text-2xl mb-2`}>{`✨`}</p>, <p className={`font-black text-sm`} style={{
        color: `var(--foreground)`
      }}>{`Tidak ada tanggal yang dekat atau terlewat`}</p>, <p className={`text-xs mt-1`} style={{
        color: `var(--muted-foreground)`
      }}>{`Periksa kondisi bahan sebelum dipakai.`}</p>]}</div>, s && P.length > 0 && <div className={`fixed left-0 right-0 mx-auto max-w-[480px] z-[39] px-4 pb-3 pt-3`} style={{
      bottom: `calc(70px + env(safe-area-inset-bottom, 0px))`,
      background: `#FAFAF8`,
      boxShadow: `0 -4px 16px rgba(0,0,0,0.06)`
    }}>{<button type={`button`} onClick={() => {
        T(``), g(true);
      }} className={`w-full py-3 rounded-xl text-sm font-black text-white`} style={{
        background: `#DC2626`
      }}>{[`Buang `, P.length, ` batch`]}</button>}</div>, d && <StockAdjustmentModal username={username} product={d} onSave={L} onClose={() => f(null)} />, p && <div className={`fixed inset-0 z-[55] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`
    }} onClick={e => {
      e.target === e.currentTarget && m(null);
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Tinjau ${p.name}`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
        background: `var(--card)`
      }}>{[<div className={`flex items-start justify-between gap-3`}>{[<div>{[<h3 className={`text-lg font-black`}>{p.name}</h3>, <p className={`text-sm mt-1`} style={{
              color: `var(--muted-foreground)`
            }}>{[p.quantity, ` `, p.unit, ` · `, p.category]}</p>]}</div>, <button type={`button`} onClick={() => m(null)} aria-label={`Tutup`} className={`text-xl px-2`}>{`×`}</button>]}</div>, <div className={`rounded-xl p-3 text-sm space-y-1`} style={{
          background: `var(--muted)`
        }}>{[<p>{describeExpiry(p)}</p>, <p>{[`Lokasi: `, p.location || `Belum diisi`]}</p>]}</div>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{getExpiryStatus(p.expiryDate) === `expired` ? `Tanggal sudah terlewat. Periksa kondisi stok dan buang bila tidak layak.` : getExpiryStatus(p.expiryDate) === `unknown` ? `Periksa bahan dan lengkapi tanggalnya di Inventori sebelum dipakai untuk resep.` : `Tanggal segera tiba. Periksa kondisi bahan sebelum memasak atau membuangnya.`}</p>, <button type={`button`} onClick={() => {
          onOpenProduct(p.id), m(null);
        }} className={`w-full rounded-xl py-3.5 font-bold text-sm text-white`} style={{
          background: `var(--primary)`
        }}>{getExpiryStatus(p.expiryDate) === `unknown` ? `Periksa Stok di Inventori` : `Lihat Stok di Inventori`}</button>, getExpiryStatus(p.expiryDate) === `expiring` && <button type={`button`} onClick={() => {
          onNavigate(`recipes`), m(null);
        }} className={`w-full rounded-xl py-3 font-bold text-sm`} style={{
          border: `1px solid var(--border)`
        }}>{`Lihat Resep`}</button>, <button type={`button`} onClick={() => {
          f(p), m(null);
        }} className={`w-full rounded-xl py-3 font-bold text-sm`} style={{
          border: `1px solid #DC2626`,
          color: `#B91C1C`
        }}>{`Buang Stok`}</button>]}</div>}</div>, A && <PhysicalStockConfirmModal conflicts={A} onSave={ee} onClose={() => j(null)} />, h && <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`,
      backdropFilter: `blur(3px)`
    }} onClick={e => {
      e.target === e.currentTarget && !E && g(false);
    }}>{<div role={`dialog`} aria-modal={`true`} aria-labelledby={`bulk-waste-title`} className={`w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4`} style={{
        background: `var(--card)`
      }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
          background: `var(--border)`
        }} />, <div className={`flex items-start justify-between gap-3`}>{[<div>{[<h2 id={`bulk-waste-title`} className={`font-black text-lg`}>{[`Buang `, P.length, ` batch?`]}</h2>, <p className={`text-sm mt-1`} style={{
              color: `var(--muted-foreground)`
            }}>{`Seluruh stok item berikut akan dibuang.`}</p>]}</div>, <button type={`button`} onClick={() => g(false)} disabled={E} aria-label={`Tutup`} className={`w-8 h-8 rounded-full text-lg shrink-0`} style={{
            background: `var(--muted)`,
            color: `var(--muted-foreground)`
          }}>{`×`}</button>]}</div>, <div className={`rounded-xl px-4 py-3 max-h-44 overflow-y-auto`} style={{
          background: `var(--muted)`
        }}>{P.map(e => <div className={`flex justify-between gap-3 py-1.5 text-sm`} key={e.id}>{[<span className={`min-w-0`}>{[<strong className={`block truncate`}>{e.name}</strong>, <small style={{
                color: `var(--muted-foreground)`
              }}>{[describeExpiry(e), ` · `, e.location || `Tanpa lokasi`]}</small>]}</span>, <strong className={`shrink-0`}>{[e.quantity, ` `, e.unit]}</strong>]}</div>)}</div>, <label className={`font-bold text-sm`}>{[`Alasan pembuangan`, <input type={`text`} value={v} onChange={e => {
            y(e.target.value), T(``);
          }} placeholder={`Contoh: kedaluwarsa, rusak...`} maxLength={120} className={`w-full rounded-xl px-4 py-3 mt-2 outline-none text-sm`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`,
            color: `var(--foreground)`
          }} />]}</label>, <label className={`font-bold text-sm`}>{[`Tanggal pembuangan`, <input type={`date`} value={b} max={It()} onChange={e => {
            x(e.target.value), T(``);
          }} className={`w-full rounded-xl px-4 py-3 mt-2 outline-none text-sm`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`,
            color: `var(--foreground)`
          }} />]}</label>, C && <p role={`alert`} className={`rounded-xl px-3 py-2 text-sm font-semibold`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{C}</p>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`
        }}>{`Semua item dicatat dalam satu aktivitas pembuangan. Jumlah tiap produk bisa dikoreksi di riwayat.`}</p>, <button type={`button`} onClick={() => ee()} disabled={E || !P.length} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-60`} style={{
          background: `#DC2626`
        }}>{E ? `Menyimpan...` : `Ya, buang ${P.length} batch`}</button>]}</div>}</div>]}</div>;
}
function StatCard({
  label: label,
  value: value,
  textColor: textColor,
  bg: bg,
  onClick: onClick,
  full: full
}) {
  return <button onClick={onClick} className={`rounded-2xl p-4 text-left transition-transform active:scale-95 flex flex-col justify-between`} style={{
    background: bg,
    boxShadow: Pt,
    cursor: onClick ? `pointer` : `default`,
    width: full ? `100%` : void 0,
    gridColumn: full ? `1 / -1` : void 0,
    aspectRatio: full ? void 0 : `1 / 1`
  }}>{[<p className={`text-4xl font-black leading-none`} style={{
      color: textColor
    }}>{value}</p>, <p className={`text-sm font-bold mt-auto pt-2`} style={{
      color: textColor,
      opacity: .9
    }}>{label}</p>]}</button>;
}
function ExpiryProductCard({
  product: product,
  status: status,
  selecting: selecting,
  selected: selected,
  onClick: onClick
}) {
  let a = status === `expired`;
  return <button type={`button`} onClick={onClick} aria-pressed={selecting ? selected : void 0} aria-label={selecting ? `${selected ? `Batalkan pilihan` : `Pilih`} ${product.name}` : `Tinjau stok ${product.name}`} className={`w-full text-left rounded-2xl px-4 py-3 flex items-center justify-between gap-3 transition-opacity active:opacity-70`} style={{
    background: `#FFFFFF`,
    boxShadow: Ft,
    outline: selecting && selected ? `2px solid #DC2626` : void 0
  }}>{[selecting && <span aria-hidden={`true`} className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center`} style={{
      border: selected ? `2px solid #DC2626` : `2px solid #A1A1AA`,
      background: selected ? `#DC2626` : `#fff`
    }}>{selected && <span className={`w-2 h-2 rounded-full bg-white`} />}</span>, <div className={`flex-1 min-w-0`}>{[<p className={`font-black text-sm truncate`} style={{
        color: `var(--foreground)`
      }}>{product.name}</p>, <p className={`text-xs mt-0.5 font-semibold`} style={{
        color: `var(--muted-foreground)`
      }}>{[product.quantity, ` `, product.unit, ` · `, product.category]}</p>]}</div>, <div className={`text-right shrink-0`}>{[<span className={`text-xs font-bold px-2 py-0.5 rounded-full`} style={{
        background: a ? `#EF4444` : status === `unknown` ? `#E0E7FF` : `#F5A300`,
        color: status === `unknown` ? `#312E81` : `#fff`
      }}>{a ? `Tanggal terlewat` : status === `unknown` ? `Perlu dicek` : `≤3 hari lagi`}</span>, <p className={`text-xs mt-1 font-semibold`} style={{
        color: `var(--muted-foreground)`
      }}>{describeExpiry(product)}</p>]}</div>, !selecting && <span aria-hidden={`true`} className={`text-xl font-bold pl-1`} style={{
      color: `var(--muted-foreground)`
    }}>{`›`}</span>]}</button>;
}
function HomeEmptyState({
  onNavigate: onNavigate
}) {
  return <div className={`rounded-2xl p-8 text-center`} style={{
    background: `var(--card)`,
    boxShadow: Pt
  }}>{[<p className={`text-4xl mb-3`}>{`🥕`}</p>, <p className={`font-black text-lg mb-1`} style={{
      color: `var(--foreground)`
    }}>{`Dapur masih kosong`}</p>, <p className={`text-sm font-semibold mb-4`} style={{
      color: `var(--muted-foreground)`
    }}>{`Mulai tambah produk untuk memantau stok Anda`}</p>, <button onClick={() => onNavigate(`inventory`)} className={`px-5 py-2.5 rounded-xl text-sm font-black`} style={{
      background: `var(--primary)`,
      color: `var(--primary-foreground)`,
      boxShadow: Ft
    }}>{`Tambah Produk`}</button>]}</div>;
}
export { Pt, Ft, It, HomePage, StatCard, ExpiryProductCard, HomeEmptyState };
