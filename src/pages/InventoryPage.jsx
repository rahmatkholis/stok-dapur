// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { EXPIRY_LABELS, addActivityEntry, addProduct, adjustPhysicalStock, deleteIncorrectBatch, getExpiryStatus, updateProduct } from "../lib/store.js";
import { StockAdjustmentModal } from "../components/StockAdjustmentModal.jsx";
import { ProductModal } from "../components/ProductModal.jsx";
import { InventoryProducts, on, sn } from "../components/InventoryProducts.jsx";
import { BatchMetadataModal, CategoryDetailPage } from "./CategoryDetailPage.jsx";
var xn = [{
    key: `recent`,
    label: `Terbaru ditambahkan`,
    shortLabel: `Terbaru`
  }, {
    key: `expiry`,
    label: `Tanggal kedaluwarsa paling awal`,
    shortLabel: `Kedaluwarsa`
  }, {
    key: `name`,
    label: `Nama A–Z`,
    shortLabel: `Nama A–Z`
  }],
  Sn = {
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
  Cn = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  wn = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`;
function InventoryPage({
  username: username,
  products: products,
  onRefresh: onRefresh,
  onOpenMasterItem: onOpenMasterItem,
  onOpenActivityEntry: onOpenActivityEntry,
  onOpenShoppingActivity: onOpenShoppingActivity,
  addTrigger: addTrigger,
  initialStatus: initialStatus,
  initialProduct: initialProduct,
  categories: categories,
  locations: locations,
  itemMasters: itemMasters
}) {
  let [f, p] = (0, React.useState)(``),
    [m, h] = (0, React.useState)(`product`),
    [g, v] = (0, React.useState)(initialStatus?.status ?? `all`),
    [y, b] = (0, React.useState)({
      kind: `all`
    }),
    [S, C] = (0, React.useState)(`recent`),
    [w, T] = (0, React.useState)(null),
    [E, D] = (0, React.useState)(false);
  (0, React.useEffect)(() => {
    if (!w) return;
    let e = e => {
      e.key === `Escape` && T(null);
    };
    return window.addEventListener(`keydown`, e), () => window.removeEventListener(`keydown`, e);
  }, [w]), (0, React.useEffect)(() => {
    addTrigger && addTrigger > 0 && D(true);
  }, [addTrigger]);
  let [O, k] = (0, React.useState)(null);
  (0, React.useEffect)(() => {
    initialProduct && k(products.find(e => e.id === initialProduct.id) ?? null);
  }, [initialProduct?.token]);
  let [A, j] = (0, React.useState)(null),
    [M, N] = (0, React.useState)(null),
    [P, F] = (0, React.useState)(null),
    [I, L] = (0, React.useState)(``);
  function ee(e) {
    L(e), setTimeout(() => L(``), 2500);
  }
  function R(t) {
    return addProduct(username, {
      ...t,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString()
    }) || (onRefresh(), D(false), ee(`Produk berhasil ditambahkan ✓`), null);
  }
  function z(t) {
    return O ? updateProduct(username, {
      ...O,
      ...t
    }) || (onRefresh(), k(null), ee(`Produk berhasil diperbarui ✓`), null) : void 0;
  }
  function B(t) {
    return deleteIncorrectBatch(username, t.id, t) || (onRefresh(), ee(`Produk salah input dihapus`), null);
  }
  function V(t, r) {
    return M ? adjustPhysicalStock(username, M.id, t, r) || (onRefresh(), N(null), ee(`Stok diperbarui dan koreksinya tercatat`), null) : `Stok tidak ditemukan.`;
  }
  function H(t, r, i, a) {
    return A ? addActivityEntry(username, {
      id: `dispose_${crypto.randomUUID()}`,
      action: `disposed`,
      date: i,
      title: r,
      items: [{
        productId: A.id,
        productName: A.name,
        category: A.category,
        quantity: t,
        unit: A.unit
      }],
      createdAt: new Date().toISOString()
    }, a) || (onRefresh(), j(null), ee(`${A.name} dibuang dan stok diperbarui`), null) : `Stok tidak ditemukan.`;
  }
  let U = (0, React.useMemo)(() => on(products, {
      search: f,
      status: g,
      location: y,
      sort: S
    }), [products, f, g, y, S]),
    W = (0, React.useMemo)(() => sn(U, categories), [U, categories]),
    te = (0, React.useMemo)(() => locations.filter(e => products.some(t => t.location === e)), [locations, products]),
    ne = products.some(e => !e.location),
    re = y.kind === `named` ? y.name : y.kind === `none` ? `Tanpa lokasi` : `Semua lokasi`,
    ie = P ? U.filter(e => e.category === P) : [],
    ae = P ? ie.length : U.length;
  function oe() {
    p(``), v(`all`), b({
      kind: `all`
    });
  }
  let se = [{
      key: `all`,
      label: `Semua tanggal`
    }, {
      key: `unknown`,
      label: EXPIRY_LABELS.unknown
    }, {
      key: `safe`,
      label: EXPIRY_LABELS.safe
    }, {
      key: `expiring`,
      label: EXPIRY_LABELS.expiring
    }, {
      key: `expired`,
      label: EXPIRY_LABELS.expired
    }],
    ce = Number(g !== `all`) + Number(y.kind !== `all`),
    le = [se.find(e => e.key === g)?.label, y.kind === `all` ? null : re].filter(e => !!(e && e !== `Semua tanggal`)),
    ue = <div className={`px-4 mb-4`}>{<div className={`relative`}>{[<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{`🔍`}</span>, <input type={`text`} value={f} onChange={e => p(e.target.value)} placeholder={`Cari produk atau kategori...`} aria-label={`Cari produk atau kategori`} className={`w-full pl-9 pr-12 py-2.5 rounded-xl text-sm outline-none`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`,
          color: `var(--foreground)`,
          ...Cn
        }} />, f && <button type={`button`} aria-label={`Hapus pencarian`} onClick={() => p(``)} className={`absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10`} style={{
          color: `var(--muted-foreground)`
        }}>{`×`}</button>]}</div>}</div>,
    de = <jsxRuntime.Fragment>{[<div className={`px-4 pb-3 flex gap-2`} style={Cn}>{[<button type={`button`} aria-haspopup={`dialog`} aria-expanded={w === `filter`} onClick={() => T(`filter`)} className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-semibold`} style={{
          background: ce ? `var(--muted)` : `var(--card)`,
          borderColor: ce ? `var(--primary)` : `var(--border)`,
          color: `var(--foreground)`
        }}>{[<span className={`min-w-0 truncate`}>{[`Filter`, ce ? ` (${ce})` : ``]}</span>, <span aria-hidden={`true`} className={`shrink-0`}>{`⌄`}</span>]}</button>, <button type={`button`} aria-haspopup={`dialog`} aria-expanded={w === `sort`} onClick={() => T(`sort`)} className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-semibold`} style={{
          background: `var(--card)`,
          borderColor: `var(--border)`,
          color: `var(--foreground)`
        }}>{[<span className={`min-w-0 truncate`}>{[`Urutkan: `, xn.find(e => e.key === S)?.shortLabel]}</span>, <span aria-hidden={`true`} className={`shrink-0`}>{`⌄`}</span>]}</button>]}</div>, ce > 0 && <div className={`px-4 pb-2 text-xs font-semibold`} style={{
        color: `var(--muted-foreground)`,
        ...Cn
      }}>{[`Filter aktif: `, le.join(` · `)]}</div>, (f.trim() || ce > 0) && <div className={`px-4 pb-3 flex items-center justify-between gap-2 text-xs`} style={Cn}>{[<span style={{
          color: `var(--muted-foreground)`
        }}>{f.trim() ? `Pencarian: “${f.trim()}”` : `Hasil sesuai filter`}</span>, <button type={`button`} onClick={oe} className={`shrink-0 py-2 font-bold`} style={{
          color: `var(--primary)`
        }}>{`Reset pencarian/filter`}</button>]}</div>]}</jsxRuntime.Fragment>;
  return <div className={`pb-24 pt-5 max-w-[480px] mx-auto`}>{[<div className={`px-4 mb-4`}>{<div role={`group`} aria-label={`Tampilan inventori`} className={`p-1 rounded-xl grid grid-cols-2 gap-1`} style={{
        background: `var(--muted)`
      }}>{[[`product`, `Produk`], [`category`, `Kategori`]].map(([e, t]) => <button type={`button`} aria-pressed={m === e} onClick={() => {
          h(e), F(null);
        }} className={`py-2.5 rounded-lg text-sm font-bold transition-all`} style={{
          background: m === e ? `var(--card)` : `transparent`,
          color: m === e ? `var(--foreground)` : `var(--muted-foreground)`,
          boxShadow: m === e ? `0 1px 4px rgba(0,0,0,0.08)` : `none`,
          ...Cn
        }} key={e}>{t}</button>)}</div>}</div>, ue, de, m === `product` && <jsxRuntime.Fragment>{[<div className={`px-4 pb-2 text-sm font-semibold`} style={{
        color: `var(--muted-foreground)`,
        ...Cn
      }}>{[U.length, ` item stok`]}</div>, <div className={`px-4 flex flex-col gap-2`}>{U.length ? <InventoryProducts products={U} allProducts={products} masters={itemMasters} showCategory={true} onEdit={k} /> : <div className={`rounded-2xl p-8 text-center`} style={{
          background: `var(--card)`,
          border: `1px solid var(--border)`
        }}>{[<p className={`text-3xl mb-2`}>{`📭`}</p>, <p className={`font-bold text-sm`} style={{
            color: `var(--foreground)`,
            ...Cn
          }}>{products.length === 0 ? `Belum ada produk` : `Produk tidak ditemukan`}</p>, <p className={`text-xs mt-1`} style={{
            color: `var(--muted-foreground)`,
            ...Cn
          }}>{products.length === 0 ? `Tambah produk untuk mulai memantau stok` : `Coba ubah pencarian, status, atau lokasi`}</p>]}</div>}</div>]}</jsxRuntime.Fragment>, m === `category` && <div className={`px-4 flex flex-col gap-3`}>{W.length === 0 ? <div className={`rounded-2xl p-8 text-center`} style={{
        background: `var(--card)`,
        border: `1px solid var(--border)`
      }}>{[<p className={`text-3xl mb-2`}>{`📭`}</p>, <p className={`font-bold text-sm`} style={{
          color: `var(--foreground)`,
          ...Cn
        }}>{products.length ? `Produk tidak ditemukan` : `Belum ada produk`}</p>, <p className={`text-xs mt-1`} style={{
          color: `var(--muted-foreground)`,
          ...Cn
        }}>{products.length ? `Coba ubah pencarian, status, atau lokasi` : `Tambah produk terlebih dahulu`}</p>]}</div> : W.map(([e, t]) => <InventoryCategoryCard category={e} items={t} onClick={() => F(e)} key={e} />)}</div>, w && <div className={`fixed inset-0 z-50 flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`
    }} onClick={e => {
      e.target === e.currentTarget && T(null);
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={w === `filter` ? `Filter produk` : `Urutkan produk`} className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-5 max-h-[80vh] overflow-y-auto`} style={{
        background: `var(--card)`,
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 24px)`,
        ...Cn
      }}>{[<div className={`flex items-center gap-3 mb-4`}>{[<h2 className={`font-bold text-base flex-1`} style={{
            color: `var(--foreground)`
          }}>{w === `filter` ? `Filter produk` : `Urutkan produk`}</h2>, <button type={`button`} onClick={() => {
            w === `filter` ? (v(`all`), b({
              kind: `all`
            })) : C(`recent`);
          }} className={`text-sm font-bold px-1`} style={{
            color: `var(--primary)`
          }}>{`Reset`}</button>, <button type={`button`} aria-label={`Tutup`} onClick={() => T(null)} className={`text-xl px-2`} style={{
            color: `var(--muted-foreground)`
          }}>{`×`}</button>]}</div>, w === `filter` ? <jsxRuntime.Fragment>{[<p className={`text-sm font-bold mb-1`} style={{
            color: `var(--foreground)`
          }}>{`Tanggal kedaluwarsa`}</p>, <p className={`text-xs mb-3`} style={{
            color: `var(--muted-foreground)`
          }}>{`Berdasarkan tanggal yang dicatat, bukan kondisi bahan.`}</p>, <div className={`grid grid-cols-2 gap-2 mb-5`}>{se.map(e => <button type={`button`} aria-pressed={g === e.key} onClick={() => v(e.key)} className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold`} style={{
              background: g === e.key ? `var(--muted)` : `var(--card)`,
              borderColor: g === e.key ? `var(--primary)` : `var(--border)`,
              color: `var(--foreground)`
            }} key={e.key}>{e.label}</button>)}</div>, <p className={`text-sm font-bold mb-1`} style={{
            color: `var(--foreground)`
          }}>{`Lokasi`}</p>, <div className={`flex flex-col`}>{[{
              kind: `all`
            }, ...te.map(e => ({
              kind: `named`,
              name: e
            })), ...(ne ? [{
              kind: `none`
            }] : [])].map(e => {
              let t = e.kind === `all` ? `Semua lokasi` : e.kind === `none` ? `Tanpa lokasi` : e.name,
                n = y.kind === e.kind && (e.kind !== `named` || y.kind === `named` && y.name === e.name);
              return <button type={`button`} aria-pressed={n} onClick={() => b(e)} className={`w-full py-3.5 border-b flex items-center justify-between gap-3 text-left text-sm`} style={{
                borderColor: `var(--border)`,
                color: n ? `var(--primary)` : `var(--foreground)`,
                fontWeight: n ? 700 : 500
              }} key={t}>{[<span>{t}</span>, n && <span aria-hidden={`true`}>{`✓`}</span>]}</button>;
            })}</div>, <button type={`button`} onClick={() => T(null)} className={`w-full mt-5 rounded-xl py-3 text-sm font-bold`} style={{
            background: `var(--primary)`,
            color: `#fff`
          }}>{[`Tampilkan `, ae, ` batch stok`]}</button>]}</jsxRuntime.Fragment> : <div className={`flex flex-col`}>{[<p className={`text-xs mb-2`} style={{
            color: `var(--muted-foreground)`
          }}>{`Batch produk yang sama tetap berdekatan. Urutan produk mengikuti batch pertama yang cocok dengan pilihan ini.`}</p>, xn.map(e => {
            let t = S === e.key;
            return <button type={`button`} aria-pressed={t} onClick={() => {
              C(e.key), T(null);
            }} className={`w-full py-3.5 border-b flex items-center justify-between gap-3 text-left text-sm`} style={{
              borderColor: `var(--border)`,
              color: t ? `var(--primary)` : `var(--foreground)`,
              fontWeight: t ? 700 : 500
            }} key={e.key}>{[<span>{e.label}</span>, t && <span aria-hidden={`true`}>{`✓`}</span>]}</button>;
          })]}</div>]}</div>}</div>, P && <div className={`fixed inset-0 z-40`} style={{
      background: `var(--background)`
    }}>{<CategoryDetailPage category={P} items={ie} allProducts={products} masters={itemMasters} controls={<jsxRuntime.Fragment>{[ue, de]}</jsxRuntime.Fragment>} onBack={() => F(null)} onEdit={k} />}</div>, E && <ProductModal categories={categories} locations={locations} itemMasters={itemMasters} requireMasterItem={true} username={username} onRefresh={onRefresh} onOpenMasterItem={onOpenMasterItem} onSave={R} onClose={() => D(false)} />, A && <StockAdjustmentModal username={username} product={A} onSave={H} onClose={() => j(null)} />, M && <BatchMetadataModal product={M} onSave={V} onClose={() => N(null)} />, O && <ProductModal product={O} categories={categories} locations={locations} itemMasters={itemMasters} requireMasterItem={true} username={username} onRefresh={onRefresh} lockMasterSelection={true} onSave={z} onDelete={() => {
      let e = B(O);
      return e || k(null), e;
    }} onOpenActivityEntry={onOpenActivityEntry} onOpenShoppingActivity={onOpenShoppingActivity} onAdjust={() => {
      N(O), k(null);
    }} onWaste={() => {
      j(O), k(null);
    }} onClose={() => k(null)} />, I && <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg z-50 whitespace-nowrap`} style={{
      background: `var(--foreground)`,
      color: `var(--card)`,
      ...Cn
    }}>{I}</div>]}</div>;
}
function InventoryCategoryCard({
  category: category,
  items: items,
  onClick: onClick
}) {
  let r = Sn[category] ?? {
      icon: `📦`,
      bg: `#F3F4F6`
    },
    i = items.filter(e => getExpiryStatus(e.expiryDate) === `expired`).length,
    a = items.filter(e => getExpiryStatus(e.expiryDate) === `expiring`).length,
    o = items.filter(e => getExpiryStatus(e.expiryDate) === `safe`).length,
    s = items.filter(e => getExpiryStatus(e.expiryDate) === `unknown`).length;
  return <button onClick={onClick} className={`w-full rounded-2xl p-4 text-left flex items-center gap-4 transition-transform active:scale-[0.98]`} style={{
    background: `var(--card)`,
    boxShadow: wn
  }}>{[<div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`} style={{
      background: r.bg
    }}>{r.icon}</div>, <div className={`flex-1 min-w-0`}>{[<p className={`font-bold text-sm`} style={{
        color: `var(--foreground)`,
        ...Cn
      }}>{category}</p>, <p className={`text-xs mt-0.5`} style={{
        color: `var(--muted-foreground)`,
        ...Cn
      }}>{[items.length, ` batch ditampilkan`, s ? ` · ${s} perlu dicek` : ``]}</p>]}</div>, <div className={`flex gap-2 shrink-0`}>{[<InventoryStat value={i} label={`Lewat`} bg={`#FEF2F2`} color={`#EF4444`} />, <InventoryStat value={a} label={`≤3 hari`} bg={`#FFFBEB`} color={`#D97706`} />, <InventoryStat value={o} label={`>3 hari`} bg={`#F0FDF4`} color={`#15803D`} />]}</div>]}</button>;
}
function InventoryStat({
  value: value,
  label: label,
  bg: bg,
  color: color
}) {
  return <div className={`rounded-xl px-2.5 py-1.5 flex flex-col items-center`} style={{
    background: bg,
    minWidth: 38
  }}>{[<span className={`text-sm font-bold leading-none`} style={{
      color: color,
      ...Cn
    }}>{value}</span>, <span className={`text-[9px] font-bold mt-0.5`} style={{
      color: color,
      ...Cn
    }}>{label}</span>]}</div>;
}
function DraftChoiceModal({
  onContinue: onContinue,
  onDiscard: onDiscard
}) {
  return <div className={`fixed inset-0 z-[100] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,.52)`
  }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Isian belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
      background: `var(--card)`
    }}>{[<h2 className={`text-lg font-black`}>{`Isian belum disimpan`}</h2>, <p className={`text-sm`}>{`Perubahan yang sudah diisi akan hilang jika kamu keluar tanpa menyimpan.`}</p>, <button type={`button`} onClick={onContinue} className={`w-full rounded-xl py-3 font-bold text-white`} style={{
        background: `var(--primary)`
      }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={onDiscard} className={`w-full rounded-xl py-3 font-bold`} style={{
        color: `#B91C1C`
      }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>;
}
export { xn, Sn, Cn, wn, InventoryPage, InventoryCategoryCard, InventoryStat, DraftChoiceModal };
