// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { UNITS, Ve, getAllowedUnits } from "../lib/store.js";
import { ItemPicker } from "./ItemPicker.jsx";
import { ExpiryFields } from "./ExpiryFields.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { BatchLedger } from "./BatchLedger.jsx";
function tn(e) {
  return Jt(e) && [`name`, `category`, `quantity`, `unit`, `expiryDate`, `receivedDate`, `location`].every(t => typeof e[t] == `string`) && (e.itemId === void 0 || typeof e.itemId == `string`) && [`unknown`, `package`, `estimated`].includes(String(e.expiryKind));
}
function ProductModal({
  product: product,
  onSave: onSave,
  onDelete: onDelete,
  onWaste: onWaste,
  onClose: onClose,
  title: title,
  submitLabel: submitLabel,
  lockDetails: lockDetails,
  categories: categories,
  locations: locations,
  itemMasters = [],
  requireMasterItem = false,
  username: username,
  onRefresh: onRefresh,
  onOpenMasterItem: onOpenMasterItem,
  onOpenShoppingActivity: onOpenShoppingActivity,
  onOpenActivityEntry: onOpenActivityEntry,
  lockMasterSelection: lockMasterSelection,
  onAdjust: onAdjust
}) {
  let x = `product:${product?.id ?? `new`}`,
    S = product ? JSON.stringify(product) : ``,
    [C] = (0, React.useState)(() => Gt(username, x, tn, S)),
    [w, T] = (0, React.useState)(C?.name ?? product?.name ?? ``),
    [E, D] = (0, React.useState)(C?.itemId ?? product?.itemId),
    [O, k] = (0, React.useState)(C?.category ?? product?.category ?? categories[0] ?? ``),
    [A, j] = (0, React.useState)(C?.quantity ?? String(product?.quantity ?? ``)),
    [M, P] = (0, React.useState)(C?.unit ?? product?.unit ?? UNITS[0]),
    [F, I] = (0, React.useState)(C?.expiryDate ?? product?.expiryDate ?? ``),
    [L, ee] = (0, React.useState)(C?.expiryKind ?? product?.expiryKind ?? (product?.expiryDate ? `package` : `unknown`)),
    R = new Date().toLocaleDateString(`sv-SE`),
    [z, B] = (0, React.useState)(C?.receivedDate ?? product?.receivedDate ?? (product && (onDelete || lockDetails) ? `` : R)),
    [V, H] = (0, React.useState)(C?.location ?? product?.location ?? ``),
    [U, W] = (0, React.useState)(``),
    [te, ne] = (0, React.useState)(false),
    [re, ie] = (0, React.useState)(false),
    [ae, oe] = (0, React.useState)(false),
    se = product && username && onDelete ? Ve(username, product.id) : null,
    ce = !!se && (!!se.purchase || !!se.activities.length),
    le = !!product && !!onDelete,
    ue = !!product && (E !== product.itemId || w.trim() !== product.name || O !== product.category || !le && Number(A) !== product.quantity || M !== product.unit || F !== product.expiryDate || L !== (product.expiryKind ?? (product.expiryDate ? `package` : `unknown`)) || z !== (product.receivedDate ?? ``) || V.trim() !== (product.location ?? ``)),
    de = product ? ue : !!E || !!w.trim() || !!A.trim() || !!F || L !== `unknown` || !!V || z !== R || O !== (categories[0] ?? ``) || M !== UNITS[0],
    {
      clearDraft: fe,
      storageFailed: pe
    } = Yt(username, x, {
      name: w,
      itemId: E,
      category: O,
      quantity: A,
      unit: M,
      expiryDate: F,
      expiryKind: L,
      receivedDate: z,
      location: V
    }, de, true, S);
  function me() {
    de ? oe(true) : onClose();
  }
  (0, React.useEffect)(() => (document.body.style.overflow = `hidden`, () => {
    document.body.style.overflow = ``;
  }), []);
  function he(e) {
    if (e.preventDefault(), le && !ue) return;
    if (requireMasterItem && !itemMasters.some(e => e.active && e.id === E)) {
      W(`Pilih item dari Data Master.`);
      return;
    }
    if (!w.trim()) {
      W(`Nama produk wajib diisi.`);
      return;
    }
    if (!categories.includes(O)) {
      W(`Pilih kategori dari Data Master.`);
      return;
    }
    if (V && !locations.includes(V)) {
      W(`Pilih lokasi dari Data Master.`);
      return;
    }
    let n = parseFloat(A);
    if (!A || !Number.isFinite(n) || n <= 0) {
      W(`Jumlah harus lebih dari 0.`);
      return;
    }
    if (L !== `unknown` && !F) {
      W(`Isi tanggal kemasan atau tanggal perkiraan.`);
      return;
    }
    W(``);
    let r = onSave({
      itemId: E,
      name: w.trim(),
      category: O,
      quantity: n,
      unit: M,
      expiryKind: L,
      expiryDate: L === `unknown` ? `` : F,
      receivedDate: z || void 0,
      location: V.trim() || void 0
    });
    r ? W(r) : fe();
  }
  function ge() {
    if (ue) {
      W(`Simpan perubahan terlebih dahulu sebelum membuang stok.`);
      return;
    }
    onWaste?.();
  }
  function _e() {
    if (ue) {
      W(`Simpan perubahan produk terlebih dahulu sebelum memperbaiki catatan stok.`);
      return;
    }
    W(``), ie(true);
  }
  function ve(e) {
    if (ue) {
      W(`Simpan perubahan produk terlebih dahulu sebelum membuka catatan terkait.`);
      return;
    }
    e?.();
  }
  return <div className={`fixed inset-0 z-50 flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.4)`,
    backdropFilter: `blur(2px)`
  }} onClick={e => {
    e.target === e.currentTarget && me();
  }}>{[<div role={`dialog`} aria-modal={`true`} aria-label={title ?? (product ? `Edit Produk` : `Tambah Produk`)} className={`w-full max-w-[480px] rounded-t-3xl flex flex-col`} style={{
      background: `var(--card)`,
      maxHeight: `92vh`,
      overflow: `hidden`
    }}>{[<div className={`flex items-center justify-between gap-3 px-5 pt-5 pb-3 shrink-0`}>{[<h2 className={`font-display font-bold text-lg`} style={{
          color: `var(--foreground)`
        }}>{title ?? (product ? `Edit Produk` : `Tambah Produk`)}</h2>, <div className={`flex items-center gap-2`}>{[onWaste && product && <button type={`button`} onClick={ge} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold`} style={{
            background: `var(--card)`,
            border: `1.5px solid #1A1612`,
            color: `#1A1612`
          }}>{`Buang Stok`}</button>, <button type={`button`} onClick={me} aria-label={`Tutup`} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg`} style={{
            background: `var(--muted)`,
            color: `var(--muted-foreground)`
          }}>{`×`}</button>]}</div>]}</div>, <form onSubmit={he} className={`flex flex-col min-h-0`}>{[<div className={`px-5 pt-2 pb-5 overflow-y-auto flex flex-col gap-3 min-h-0`}>{[<DraftRestoreNotice restored={!!C} storageFailed={pe} />, le && username && product && <BatchLedger username={username} productId={product.id} onOpenShopping={onOpenShoppingActivity ? e => ve(() => onOpenShoppingActivity(e)) : void 0} onOpenActivity={onOpenActivityEntry ? e => ve(() => onOpenActivityEntry(e)) : void 0} />, <div>{requireMasterItem && username && onRefresh ? <ItemPicker items={itemMasters} label={`Nama Produk *`} value={E} onAddItem={e => onOpenMasterItem?.(e => {
              D(e.id), T(e.name), k(e.category), P(e.unit), W(``);
            }, e)} disabled={lockDetails || lockMasterSelection} onSelect={t => {
              D(t?.id), T(t?.name ?? ``), k(t?.category ?? categories[0] ?? ``), t && (product && product.unit !== t.unit && product.itemId !== t.id && j(``), P(t.unit)), W(``);
            }} style={an} /> : <jsxRuntime.Fragment>{[<label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide`} style={{
                color: `var(--muted-foreground)`
              }}>{`Nama Produk *`}</label>, <datalist id={`inventory-master-items`}>{itemMasters.filter(e => e.active).map(e => <option value={e.name} key={e.id} />)}</datalist>, <input type={`text`} list={`inventory-master-items`} disabled={lockDetails} aria-label={`Nama Produk`} value={w} onChange={e => {
                let t = e.target.value,
                  n = itemMasters.find(e => e.active && e.name.toLocaleLowerCase(`id-ID`) === t.trim().toLocaleLowerCase(`id-ID`));
                T(t), D(n?.id), n && (k(n.category), P(n.unit)), W(``);
              }} placeholder={`misal: Telur Ayam`} className={`input-base`} style={an} />, w.trim() && !E && !lockDetails && <p className={`text-xs mt-1`} style={{
                color: `var(--muted-foreground)`
              }}>{`Item baru akan dibuat saat disimpan.`}</p>]}</jsxRuntime.Fragment>}</div>, <ProductField label={`Kategori *`}>{requireMasterItem ? <input aria-label={`Kategori`} readOnly={true} value={E ? O : ``} placeholder={`Mengikuti item yang dipilih`} style={an} /> : <select aria-label={`Kategori`} disabled={lockDetails} value={O} onChange={e => {
              k(e.target.value), D(void 0), W(``);
            }} style={an}>{categories.map(e => <option key={e}>{e}</option>)}</select>}</ProductField>, <div className={`grid grid-cols-2 gap-3`}>{[<ProductField label={`Jumlah *`}>{[<input type={`number`} readOnly={le} disabled={lockDetails} aria-label={`Jumlah`} value={A} onChange={e => {
                j(e.target.value), W(``);
              }} placeholder={`0`} min={`0.0001`} step={`any`} style={an} />, le && <p className={`text-xs mt-1`} style={{
                color: `var(--muted-foreground)`
              }}>{`Untuk mengubah jumlah, pilih Perbaiki catatan stok di bawah.`}</p>]}</ProductField>, <ProductField label={`Satuan *`}>{[requireMasterItem ? <select aria-label={`Satuan`} disabled={lockDetails || le || !E} value={M} onChange={e => {
                P(e.target.value), W(``);
              }} style={an}>{E && getAllowedUnits(itemMasters.find(e => e.id === E) ?? {
                  unit: M
                }).map(e => <option key={e}>{e}</option>)}</select> : <select aria-label={`Satuan`} disabled={lockDetails} value={M} onChange={e => {
                P(e.target.value), D(void 0), W(``);
              }} style={an}>{UNITS.map(e => <option key={e}>{e}</option>)}</select>, requireMasterItem && product && itemMasters.find(e => e.id === E)?.unit !== M && <p className={`text-xs mt-1`} style={{
                color: `var(--muted-foreground)`
              }}>{`Satuan stok lama dipertahankan agar jumlahnya tidak berubah.`}</p>]}</ProductField>]}</div>, <ProductField label={`Tanggal stok tersedia`}>{[<input type={`date`} aria-label={`Tanggal stok tersedia`} max={R} value={z} onChange={e => {
              B(e.target.value), W(``);
            }} style={an} />, <p className={`text-xs mt-1`} style={{
              color: `var(--muted-foreground)`
            }}>{[`Tanggal bahan mulai ada di dapur. Bisa diisi tanggal sebelumnya jika baru dicatat sekarang.`, product && !product.receivedDate ? ` Tanggal stok lama belum diketahui.` : ``]}</p>]}</ProductField>, <ExpiryFields kind={L} date={F} onKindChange={e => {
            ee(e), e === `unknown` && I(``), W(``);
          }} onDateChange={e => {
            I(e), W(``);
          }} />, <ProductField label={`Lokasi Penyimpanan (opsional)`}>{[<select aria-label={`Lokasi Penyimpanan`} value={V} onChange={e => {
              H(e.target.value), W(``);
            }} style={an}>{[<option value={``}>{`Pilih lokasi (opsional)`}</option>, locations.map(e => <option value={e} key={e}>{e}</option>)]}</select>, !locations.length && <p className={`text-xs mt-1`} style={{
              color: `var(--muted-foreground)`
            }}>{`Tambahkan lokasi di Akun → Data Master.`}</p>]}</ProductField>]}</div>, <div className={`px-5 pt-3 shrink-0`} style={{
          borderTop: `1px solid var(--border)`,
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 18px)`,
          background: `var(--card)`
        }}>{[U && <p role={`alert`} className={`text-sm px-3 py-2 rounded-lg mb-3`} style={{
            background: `#FEE2E2`,
            color: `#B91C1C`
          }}>{U}</p>, le && <button type={`button`} onClick={_e} className={`w-full py-3 rounded-xl font-bold text-sm mb-3`} style={{
            background: `var(--muted)`,
            color: `var(--foreground)`
          }}>{`Perbaiki catatan stok`}</button>, onDelete && product && <p className={`text-xs mb-3`} style={{
            color: `var(--muted-foreground)`
          }}>{se?.purchase ? `Batch berasal dari Belanja. Untuk salah pembelian, buka catatan Belanja pada bagian Asal dan perubahan stok.` : se?.activities.length ? `Batch sudah memiliki Aktivitas. Perbaiki catatan yang salah melalui riwayat di atas sebelum menghapusnya.` : `Hapus Produk untuk batch yang salah input. Jika bahan benar-benar dibuang, gunakan Buang Stok.`}</p>, onDelete && product && <button type={`button`} onClick={() => {
            W(``), ne(true);
          }} className={`w-full py-3 rounded-xl font-bold text-sm mb-3`} style={{
            background: `var(--card)`,
            border: `1.5px solid #DC2626`,
            color: `#B91C1C`
          }}>{`Hapus Produk`}</button>, <button type={`submit`} disabled={le && !ue} className={`w-full py-3.5 rounded-xl font-bold text-sm disabled:cursor-not-allowed`} style={{
            background: le && !ue ? `var(--muted)` : `var(--primary)`,
            color: le && !ue ? `var(--muted-foreground)` : `var(--primary-foreground)`,
            fontFamily: `Plus Jakarta Sans, sans-serif`
          }}>{submitLabel ?? (product ? `Simpan Perubahan` : `Tambah Produk`)}</button>]}</div>]}</form>]}</div>, re && product && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.52)`
    }}>{<div role={`dialog`} aria-modal={`true`} aria-labelledby={`correction-title`} className={`w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-8 space-y-3`} style={{
        background: `var(--card)`
      }}>{[<h3 id={`correction-title`} className={`text-lg font-black`}>{`Apa yang perlu diperbaiki?`}</h3>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{[product.name, ` · stok saat ini `, product.quantity, ` `, product.unit, `. Pilih catatan yang keliru; kejadian yang benar tetap disimpan.`]}</p>, onAdjust && <button type={`button`} onClick={() => {
          ie(false), onAdjust();
        }} className={`w-full p-3 rounded-xl text-left text-sm`} style={{
          background: `var(--muted)`
        }}>{[<strong className={`block`}>{`Jumlah fisik berbeda`}</strong>, <span>{`Catat hasil hitung stok sebenarnya.`}</span>]}</button>, se?.purchase && <button type={`button`} onClick={() => {
          ie(false), onOpenShoppingActivity?.(se.purchase.activityId);
        }} className={`w-full p-3 rounded-xl text-left text-sm`} style={{
          background: `var(--muted)`
        }}>{[<strong className={`block`}>{`Pembelian salah dicatat`}</strong>, <span>{`Buka aktivitas belanja untuk edit atau batalkan pembelian terkait.`}</span>]}</button>, !!se?.activities.length && <div className={`space-y-2`}>{[<p className={`text-sm font-bold`}>{`Catatan terkait (dari yang terbaru)`}</p>, se.activities.map(e => <button type={`button`} onClick={() => {
            ie(false), onOpenActivityEntry?.(e.id);
          }} className={`w-full p-3 rounded-xl text-left text-sm`} style={{
            background: `var(--muted)`
          }} key={e.id}>{[<strong className={`block`}>{[e.action === `adjusted` ? `Penyesuaian` : e.action === `used` ? `Pemakaian` : `Pembuangan`, `: `, e.title]}</strong>, <span>{`Periksa dan koreksi hanya jika catatan ini salah.`}</span>]}</button>)]}</div>, !se?.purchase && onDelete && <button type={`button`} onClick={() => {
          ie(false), ne(true);
        }} className={`w-full p-3 rounded-xl text-left text-sm`} style={{
          background: `var(--muted)`
        }}>{[<strong className={`block`}>{`Stok awal salah input`}</strong>, <span>{se?.activities.length ? `Perbaiki aktivitas terkait lebih dahulu sebelum menghapus.` : `Hapus batch yang memang tidak pernah ada.`}</span>]}</button>, <button type={`button`} onClick={() => ie(false)} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          background: `var(--muted)`
        }}>{`Kembali`}</button>]}</div>}</div>, te && product && onDelete && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.52)`
    }} onClick={e => {
      e.target === e.currentTarget && ne(false);
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-labelledby={`delete-product-title`} className={`w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-5 flex flex-col gap-4`} style={{
        background: `var(--card)`,
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 28px)`
      }}>{[<h3 id={`delete-product-title`} className={`text-lg font-black`}>{ce ? `Produk belum bisa dihapus` : `Hapus produk?`}</h3>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{ce ? <jsxRuntime.Fragment>{[`Batch ini terhubung ke Belanja atau Aktivitas. Koreksi hanya catatan yang salah.`, se?.activities.some(e => e.action === `adjusted`) ? ` Buka penyesuaian terkait, lalu pilih Batalkan Penyesuaian yang Salah. Jika ada catatan lebih baru, periksa dari yang terbaru. Riwayat tetap tersimpan.` : ``]}</jsxRuntime.Fragment> : <jsxRuntime.Fragment>{[<strong style={{
              color: `var(--foreground)`
            }}>{product.name}</strong>, ` dan stoknya akan hilang dari Inventori karena salah input. Tindakan ini tidak dicatat sebagai pemakaian atau pembuangan.`]}</jsxRuntime.Fragment>}</p>, se?.purchase && <button type={`button`} onClick={() => {
          ne(false), onOpenShoppingActivity?.(se.purchase.activityId);
        }} className={`w-full py-3 rounded-xl text-left text-sm font-bold`} style={{
          background: `var(--muted)`,
          color: `var(--primary)`
        }}>{`Stok berasal dari Belanja · Buka aktivitas belanja →`}</button>, se?.activities.map(e => <button type={`button`} onClick={() => {
          ne(false), onOpenActivityEntry?.(e.id);
        }} className={`w-full py-3 rounded-xl text-left text-sm font-bold`} style={{
          background: `var(--muted)`,
          color: `var(--primary)`
        }} key={e.id}>{[`Tercatat di Aktivitas: `, e.title, ` · Lihat →`]}</button>), U && <p role={`alert`} className={`text-sm`} style={{
          color: `#B91C1C`
        }}>{U}</p>, !ce && <button type={`button`} onClick={() => {
          let e = onDelete();
          e ? W(e) : fe();
        }} className={`w-full py-3.5 rounded-xl text-sm font-black text-white`} style={{
          background: `#DC2626`
        }}>{`Ya, hapus produk`}</button>, <button type={`button`} onClick={() => {
          ne(false), W(``);
        }} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          background: `var(--muted)`,
          color: `var(--foreground)`
        }}>{ce ? `Tutup` : `Batal`}</button>]}</div>}</div>, ae && <div className={`fixed inset-0 z-[80] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.52)`
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Produk belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
        background: `var(--card)`
      }}>{[<h3 className={`text-lg font-black`}>{`Produk belum disimpan`}</h3>, <p className={`text-sm`}>{`Perubahan yang sudah diisi akan hilang jika kamu keluar.`}</p>, <button type={`button`} onClick={() => oe(false)} className={`w-full py-3 rounded-xl font-bold text-white`} style={{
          background: `var(--primary)`
        }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={() => {
          fe(), onClose();
        }} className={`w-full py-3 rounded-xl font-bold`} style={{
          color: `#B91C1C`
        }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>]}</div>;
}
function ProductField({
  label: label,
  children: children
}) {
  return <div>{[<label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide`} style={{
      color: `var(--muted-foreground)`
    }}>{label}</label>, children]}</div>;
}
var an = {
  width: `100%`,
  padding: `10px 14px`,
  borderRadius: 10,
  border: `1.5px solid var(--border)`,
  background: `var(--muted)`,
  color: `var(--foreground)`,
  fontSize: 14,
  outline: `none`,
  fontFamily: `Plus Jakarta Sans, sans-serif`
};
export { tn, ProductModal, ProductField, an };
