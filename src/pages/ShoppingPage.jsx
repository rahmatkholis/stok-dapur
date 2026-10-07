// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { addShoppingItem, bt, cancelShoppingPurchase, completeShoppingActivity, correctPurchaseQuantity, createShoppingActivity, deleteShoppingActivity, deleteShoppingItem, describeExpiry, formatDate, getAllowedUnits, receiveShoppingPurchase, renameShoppingActivity, updateShoppingPlan, wt } from "../lib/store.js";
import { PhysicalStockConfirmModal } from "../components/PhysicalStockConfirmModal.jsx";
import { ItemPicker } from "../components/ItemPicker.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { DraftChoiceModal } from "./InventoryPage.jsx";
import { ReceivePurchaseModal } from "../components/ReceivePurchaseModal.jsx";
import { ShoppingActivityModal } from "../components/ShoppingActivityModal.jsx";
var In = {
    background: `var(--card)`,
    boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
  },
  Ln = {
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
function Rn(e) {
  return e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : [];
}
function zn(e) {
  return Math.round(Rn(e).reduce((e, t) => e + t.quantity, 0) * 1e4) / 1e4;
}
function Bn(e, t) {
  return e.completedAt ? `completed` : t.some(e => e.bought || zn(e) > 0) ? `progress` : `pending`;
}
function Vn(e) {
  return new Intl.DateTimeFormat(`id-ID`, {
    weekday: `long`,
    day: `numeric`,
    month: `long`,
    year: `numeric`
  }).format(new Date(e));
}
function Hn(e) {
  return new Intl.DateTimeFormat(`id-ID`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`
  }).format(new Date(e));
}
function ShoppingPage({
  username: username,
  items: items,
  products: products,
  activities: activities,
  onRefresh: onRefresh,
  onOpenMasterItem: onOpenMasterItem,
  onOpenActivityEntry: onOpenActivityEntry,
  onOpenInventory: onOpenInventory,
  initialActivityId: initialActivityId,
  addTrigger: addTrigger,
  locations: locations,
  itemMasters: itemMasters
}) {
  let [f, p] = (0, React.useState)(`all`),
    [m, h] = (0, React.useState)(``),
    [g, v] = (0, React.useState)(null),
    [y, b] = (0, React.useState)(false),
    [x, S] = (0, React.useState)(null),
    [w, T] = (0, React.useState)(null),
    [E, D] = (0, React.useState)(null),
    [O, k] = (0, React.useState)(null),
    [A, j] = (0, React.useState)(null),
    [M, N] = (0, React.useState)(null),
    [P, F] = (0, React.useState)(``),
    [I, L] = (0, React.useState)(``),
    [ee, R] = (0, React.useState)(null),
    z = A && A !== `activity` ? wt(username, A.id) : null,
    B = !!z && (z.activities.length > 0 || z.changedStock),
    V = M ? wt(username, M.id) : null,
    H = !!V && (V.activities.length > 0 || V.changedStock);
  (0, React.useEffect)(() => {
    addTrigger && b(true);
  }, [addTrigger]), (0, React.useEffect)(() => {
    initialActivityId && activities.some(e => e.id === initialActivityId) && v(initialActivityId);
  }, [initialActivityId, activities]);
  let U = activities.find(e => e.id === g),
    W = U ? items.filter(e => e.activityId === U.id) : [],
    te = items.find(e => e.id === E),
    ne = items.find(e => e.id === O?.itemId),
    re = ne && Rn(ne).find(e => e.productId === O?.productId),
    ie = products.find(e => e.id === O?.productId)?.quantity ?? 0,
    ae = W.filter(e => e.bought).length,
    oe = !!W.length && W.every(e => e.bought) && !U?.completedAt,
    se = activities.filter(e => e.title.toLocaleLowerCase(`id-ID`).includes(m.trim().toLocaleLowerCase(`id-ID`)) && (f === `all` || Bn(e, items.filter(t => t.activityId === e.id)) === f)).sort((e, t) => (t.completedAt ?? t.updatedAt).localeCompare(e.completedAt ?? e.updatedAt)),
    ce = new Map();
  se.forEach(e => {
    let t = Vn(e.completedAt ?? e.updatedAt);
    ce.set(t, [...(ce.get(t) ?? []), e]);
  });
  function le(e = ``) {
    onRefresh(), L(``), F(e);
  }
  function ue(t, n) {
    let r = createShoppingActivity(username, t, n);
    return r.error ? r.error : (le(`Belanja dan itemnya disimpan.`), b(false), v(r.id), null);
  }
  function de(t) {
    if (!U) return `Aktivitas tidak ditemukan.`;
    let n = renameShoppingActivity(username, U.id, t);
    return n || (le(`Nama aktivitas diperbarui.`), S(null)), n;
  }
  function fe(t) {
    if (!U) return `Aktivitas tidak ditemukan.`;
    let n = w === `add` ? addShoppingItem(username, {
      ...t,
      id: `s_${crypto.randomUUID()}`,
      activityId: U.id,
      bought: false,
      createdAt: new Date().toISOString()
    }) : w ? updateShoppingPlan(username, w.id, t) : `Form item tidak ditemukan.`;
    return n || (le(w === `add` ? `Item ditambahkan.` : `Item diperbarui.`), T(null)), n;
  }
  function pe(t) {
    if (!E) return `Item belanja tidak ditemukan.`;
    let n = receiveShoppingPurchase(username, E, t);
    return n || (D(null), le(`Pembelian dicatat dan stok Inventori bertambah.`)), n;
  }
  function me() {
    if (!M) return;
    let t = cancelShoppingPurchase(username, M.id);
    if (t) {
      L(t);
      return;
    }
    N(null), le(`Pembelian dibatalkan. Item kembali Belum Dibeli.`);
  }
  function he(t, n) {
    if (!O || !ne || !re) return `Pembelian tidak ditemukan.`;
    let r = bt(username, O.itemId, O.productId, t);
    if (r.length && !n) return R({
      quantity: t,
      conflicts: r
    }), null;
    let i = correctPurchaseQuantity(username, O.itemId, O.productId, t, n);
    if (i) return i;
    let a = Math.round((zn(ne) - re.quantity + t) * 1e4) / 1e4,
      o = !!U?.completedAt && a < ne.quantity;
    return k(null), R(null), le(o ? `Pembelian diperbarui. Aktivitas kembali Berjalan karena jumlah rencana belum terpenuhi.` : `Pembelian dan stok Inventori diperbarui.`), null;
  }
  function ge() {
    if (!U || !A) return;
    let t = A === `activity` ? deleteShoppingActivity(username, U.id) : deleteShoppingItem(username, A.id);
    if (t) {
      L(t);
      return;
    }
    (A === `activity` || U.completedAt && W.length === 1) && v(null), j(null), le(`Item belanja dan stok dari pembeliannya dihapus.`);
  }
  function _e() {
    if (!U) return;
    let t = completeShoppingActivity(username, U.id);
    if (t) {
      L(t);
      return;
    }
    le(`Aktivitas belanja selesai.`);
  }
  return <jsxRuntime.Fragment>{[<div className={`max-w-[480px] mx-auto px-4 pt-5 pb-28`}>{[<div role={`tablist`} aria-label={`Status belanja`} className={`grid grid-cols-4 gap-1 p-1 rounded-xl mb-4`} style={{
        background: `var(--muted)`
      }}>{[[`all`, `Semua`], [`pending`, `Perlu Dibeli`], [`progress`, `Berjalan`], [`completed`, `Selesai`]].map(([e, t]) => <button type={`button`} role={`tab`} aria-selected={f === e} onClick={() => p(e)} className={`rounded-lg py-2.5 text-xs font-bold`} style={{
          background: f === e ? `var(--card)` : `transparent`,
          color: f === e ? `var(--primary)` : `var(--muted-foreground)`,
          boxShadow: f === e ? `0 1px 4px rgba(0,0,0,0.08)` : void 0
        }} key={e}>{t}</button>)}</div>, <input type={`search`} aria-label={`Cari aktivitas belanja`} placeholder={`Cari nama aktivitas belanja...`} value={m} onChange={e => h(e.target.value)} className={`mb-5`} style={Ln} />, P && <p role={`status`} className={`rounded-xl p-3 mb-4 text-sm font-bold`} style={{
        background: `#DCFCE7`,
        color: `#166534`
      }}>{P}</p>, se.length ? [...ce.entries()].map(([e, n]) => <section className={`mb-5`} key={e}>{[<h2 className={`text-xs font-black uppercase tracking-wide mb-2`} style={{
          color: `var(--muted-foreground)`
        }}>{e}</h2>, <div className={`space-y-2`}>{n.map(e => {
            let n = items.filter(t => t.activityId === e.id),
              r = n.filter(e => e.bought).length,
              i = Bn(e, n);
            return <button type={`button`} onClick={() => {
              v(e.id), F(``), L(``);
            }} className={`w-full rounded-2xl p-4 text-left`} style={In} key={e.id}>{[<div className={`flex items-start gap-3 justify-between`}>{[<div className={`min-w-0`}>{[<h3 className={`font-black text-sm truncate`}>{e.title}</h3>, <p className={`text-xs mt-1`} style={{
                    color: `var(--muted-foreground)`
                  }}>{[r, `/`, n.length, ` item terbeli · `, e.completedAt ? `Selesai ${Hn(e.completedAt)}` : `Dibuat ${Hn(e.createdAt)}`]}</p>]}</div>, <span className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold`} style={{
                  background: i === `completed` ? `#DCFCE7` : i === `progress` ? `#FFF1E9` : `var(--muted)`,
                  color: i === `completed` ? `#166534` : i === `progress` ? `var(--primary)` : `var(--muted-foreground)`
                }}>{i === `completed` ? `Selesai` : i === `progress` ? `Berjalan` : `Perlu Dibeli`}</span>]}</div>, !e.completedAt && n.length > 0 && r === n.length && <p className={`text-xs font-bold mt-2`} style={{
                color: `#15803D`
              }}>{`Semua item terbeli · siap diselesaikan`}</p>]}</button>;
          })}</div>]}</section>) : <div className={`rounded-2xl p-7 text-center`} style={In}>{[<p className={`text-3xl mb-2`}>{`🛒`}</p>, <h2 className={`font-black text-base`}>{activities.length ? `Aktivitas tidak ditemukan` : `Belum ada aktivitas belanja`}</h2>, <p className={`text-sm mt-1`} style={{
          color: `var(--muted-foreground)`
        }}>{activities.length ? `Coba kata kunci atau status lain.` : `Buat aktivitas untuk mengelompokkan kebutuhan belanja.`}</p>, !activities.length && <button type={`button`} onClick={() => b(true)} className={`mt-4 rounded-xl px-5 py-2.5 text-sm font-bold text-white`} style={{
          background: `var(--primary)`
        }}>{`Buat Aktivitas Belanja`}</button>]}</div>]}</div>, U && <div className={`fixed inset-0 z-[45] overflow-y-auto`} style={{
      background: `var(--background)`
    }}>{<div className={`max-w-[480px] mx-auto min-h-screen pb-28`}>{[<div className={`sticky top-0 z-10 flex items-center gap-3 px-4 pb-3`} style={{
          background: `var(--card)`,
          boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
          paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`
        }}>{[<button type={`button`} onClick={() => {
            v(null), L(``);
          }} aria-label={`Kembali ke daftar belanja`} className={`w-9 h-9 rounded-xl text-lg`} style={{
            background: `var(--muted)`
          }}>{`‹`}</button>, <h2 className={`font-black text-base flex-1 min-w-0 truncate`}>{U.title}</h2>, !U.completedAt && <button type={`button`} onClick={() => S(`edit`)} className={`text-xs font-bold`} style={{
            color: `var(--primary)`
          }}>{`Edit Nama`}</button>]}</div>, <div className={`px-4 pt-5`}>{[<div className={`rounded-2xl p-4 mb-5`} style={In}>{[<div className={`flex items-center justify-between gap-2`}>{[<span className={`text-sm font-black`}>{U.completedAt ? `Selesai` : oe ? `Siap diselesaikan` : W.some(e => zn(e) > 0) ? `Berjalan` : `Perlu Dibeli`}</span>, <strong className={`text-sm`}>{[ae, `/`, W.length, ` item`]}</strong>]}</div>, <div className={`h-2 rounded-full mt-3 overflow-hidden`} style={{
              background: `var(--muted)`
            }}>{<div className={`h-full rounded-full`} style={{
                width: W.length ? `${ae / W.length * 100}%` : `0%`,
                background: `var(--primary)`
              }} />}</div>, <p className={`text-xs mt-3`} style={{
              color: `var(--muted-foreground)`
            }}>{[`Dibuat `, Hn(U.createdAt), U.completedAt ? ` · Selesai ${Hn(U.completedAt)}` : ``]}</p>]}</div>, <div className={`flex items-center justify-between mb-3`}>{[<h3 className={`font-black text-base`}>{`Item Belanja`}</h3>, !U.completedAt && <button type={`button`} onClick={() => T(`add`)} className={`text-sm font-bold`} style={{
              color: `var(--primary)`
            }}>{`+ Tambah Item`}</button>]}</div>, !!U.recipePlans?.length && <details className={`rounded-xl p-3 mb-4 text-sm`} style={{
            background: `var(--muted)`
          }}>{[<summary className={`font-bold`}>{[`Untuk `, U.recipePlans.length, ` rencana masak`]}</summary>, <ul className={`mt-2 space-y-1`}>{U.recipePlans.map(e => <li key={e.id}>{[e.name, ` · `, e.servings, ` porsi`]}</li>)}</ul>]}</details>, W.length ? <div className={`space-y-2`}>{W.map(e => <ShoppingItemCard item={e} readonly={!!U.completedAt} onReceive={() => D(e.id)} onCancel={() => {
              L(``), N(e);
            }} onEdit={() => T(e)} onDelete={() => {
              L(``), j(e);
            }} onEditReceipt={t => k({
              itemId: e.id,
              productId: t
            })} key={e.id} />)}</div> : <div className={`rounded-2xl p-6 text-center text-sm`} style={{
            ...In,
            color: `var(--muted-foreground)`
          }}>{`Belum ada item. Tambahkan kebutuhan belanja pertama.`}</div>, I && <p role={`alert`} className={`p-3 rounded-xl text-sm mt-4`} style={{
            background: `#FEF2F2`,
            color: `#B91C1C`
          }}>{I}</p>, P && <p role={`status`} className={`p-3 rounded-xl text-sm mt-4`} style={{
            background: `#DCFCE7`,
            color: `#166534`
          }}>{P}</p>, !U.completedAt && <button type={`button`} onClick={_e} disabled={!oe} className={`w-full mt-5 py-3.5 rounded-xl text-sm font-black disabled:cursor-not-allowed`} style={{
            background: oe ? `var(--primary)` : `var(--muted)`,
            color: oe ? `#fff` : `var(--muted-foreground)`
          }}>{`Selesaikan Belanja`}</button>, !U.completedAt && !oe && <p className={`text-xs text-center mt-2`} style={{
            color: `var(--muted-foreground)`
          }}>{`Tersedia setelah semua item terbeli.`}</p>, !U.completedAt && !W.length && <button type={`button`} onClick={() => {
            L(``), j(`activity`);
          }} className={`block mx-auto text-xs font-bold mt-6`} style={{
            color: `#B91C1C`
          }}>{`Hapus Aktivitas Kosong`}</button>]}</div>]}</div>}</div>, y && <ShoppingActivityModal username={username} itemMasters={itemMasters} onOpenMasterItem={onOpenMasterItem} onSave={ue} onClose={() => b(false)} />, x && <ShoppingTitleModal title={`Edit Nama Aktivitas`} initial={U?.title ?? ``} submitLabel={`Simpan Nama`} onSave={de} onClose={() => S(null)} />, w && U && <ShoppingItemModal username={username} activityId={U.id} existing={w === `add` ? void 0 : w} activityItems={W} onEditExisting={e => T(e)} onOpenMasterItem={onOpenMasterItem} itemMasters={itemMasters} onSave={fe} onClose={() => T(null)} key={w === `add` ? `add` : w.id} />, te && <ReceivePurchaseModal username={username} item={te} master={itemMasters.find(e => e.id === te.itemId)} alreadyReceived={zn(te)} locations={locations} suggestedLocation={products.filter(e => e.itemId === te.itemId).sort((e, t) => t.createdAt.localeCompare(e.createdAt))[0]?.location} onSave={pe} onClose={() => D(null)} key={te.id} />, ne && re && <PurchaseQuantityModal item={ne} receipt={re} stock={ie} activityCompleted={!!U?.completedAt} onSave={he} onClose={() => k(null)} key={re.productId} />, ee && <PhysicalStockConfirmModal conflicts={ee.conflicts} onClose={() => R(null)} onSave={e => he(ee.quantity, e)} />, M && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.5)`
    }}>{<div role={H ? `dialog` : `alertdialog`} aria-modal={`true`} aria-label={`Batalkan pembelian`} className={`w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 pb-8 space-y-3`} style={{
        background: `var(--card)`
      }}>{[<h2 className={`font-black text-lg`}>{H ? `Pembelian belum bisa dibatalkan` : `Batalkan pembelian ${M.name}?`}</h2>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{H ? `Stok pembelian sudah memiliki perubahan. Buka catatan berikut dari yang terbaru. Penyesuaian yang salah bisa dibatalkan; pemakaian/pembuangan yang salah bisa diedit atau dihapus. Jika kejadiannya benar, pertahankan riwayat dan koreksi jumlah melalui Edit Pembelian.` : `Seluruh pembelian ${M.name} pada item ini akan dibatalkan. Stoknya hilang dari Inventori, tetapi item tetap ada dalam daftar sebagai Belum Dibeli.${U?.completedAt ? ` Aktivitas belanja akan dibuka kembali.` : ``}`}</p>, !!V?.activities.length && <div className={`space-y-2`}>{V.activities.map(e => <button type={`button`} onClick={() => {
            N(null), onOpenActivityEntry(e.id);
          }} className={`w-full rounded-xl p-3 text-left text-sm font-bold`} style={{
            background: `var(--muted)`,
            color: `var(--primary)`
          }} key={e.id}>{[`Lihat Aktivitas: `, e.title, ` →`]}</button>)}</div>, V?.changedStock && !V.activities.length && <button type={`button`} onClick={() => {
          N(null), onOpenInventory();
        }} className={`w-full rounded-xl p-3 text-left text-sm font-bold`} style={{
          background: `var(--muted)`,
          color: `var(--primary)`
        }}>{`Lihat Inventori →`}</button>, I && <p role={`alert`} className={`text-sm`} style={{
          color: `#B91C1C`
        }}>{I}</p>, !H && <button type={`button`} onClick={me} className={`w-full py-3 rounded-xl text-sm font-bold text-white`} style={{
          background: `#DC2626`
        }}>{`Ya, batalkan pembelian`}</button>, <button type={`button`} onClick={() => {
          N(null), L(``);
        }} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          background: `var(--muted)`
        }}>{H ? `Tutup` : `Kembali`}</button>]}</div>}</div>, A && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.5)`
    }}>{<div role={B ? `dialog` : `alertdialog`} aria-modal={`true`} aria-label={B ? `Item tidak dapat dihapus` : `Hapus data belanja`} className={`w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 pb-8 space-y-3`} style={{
        background: `var(--card)`
      }}>{[<h2 className={`font-black text-lg`}>{B ? `${A === `activity` ? `Aktivitas` : A.name} belum bisa dihapus` : `Hapus ${A === `activity` ? `aktivitas kosong` : A.name}?`}</h2>, B ? <jsxRuntime.Fragment>{[<p className={`text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{`Stok dari pembelian ini sudah berubah. Periksa data terkait sebelum menghapus item belanja.`}</p>, !!z?.activities.length && <div className={`space-y-2`}>{z.activities.map(e => <button type={`button`} onClick={() => {
              j(null), onOpenActivityEntry(e.id);
            }} className={`w-full rounded-xl p-3 text-left text-sm flex items-center justify-between gap-3`} style={{
              background: `var(--muted)`
            }} key={e.id}>{[<span>{[<strong>{e.title}</strong>, <span className={`block text-xs mt-0.5`} style={{
                  color: `var(--muted-foreground)`
                }}>{[e.action === `used` ? `Dipakai` : e.action === `disposed` ? `Dibuang` : `Penyesuaian stok`, ` · `, formatDate(e.date)]}</span>]}</span>, <span className={`shrink-0 text-xs font-bold`} style={{
                color: `var(--primary)`
              }}>{`Lihat Aktivitas`}</span>]}</button>)}</div>, z?.changedStock && !z.activities.length && <button type={`button`} onClick={() => {
            j(null), onOpenInventory();
          }} className={`w-full rounded-xl p-3 text-left text-sm font-bold`} style={{
            background: `var(--muted)`,
            color: `var(--primary)`
          }}>{`Lihat Inventori`}</button>]}</jsxRuntime.Fragment> : <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{[z?.receiptsCount ? `Card dan ${z.receiptsCount} pembelian akan dihapus. Stok dari pembelian ini ikut dihapus dari Inventori.` : `Card item ini akan dihapus dari aktivitas belanja.`, A !== `activity` && U?.completedAt && W.length === 1 ? ` Aktivitas ini juga akan hilang karena tidak memiliki item lain.` : ``]}</p>, I && <p role={`alert`} className={`text-sm`} style={{
          color: `#B91C1C`
        }}>{I}</p>, !B && <button type={`button`} onClick={ge} className={`w-full py-3 rounded-xl text-sm font-bold text-white`} style={{
          background: `#DC2626`
        }}>{`Ya, hapus`}</button>, <button type={`button`} onClick={() => {
          j(null), L(``);
        }} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          background: `var(--muted)`
        }}>{B ? `Tutup` : `Batal`}</button>]}</div>}</div>]}</jsxRuntime.Fragment>;
}
function ShoppingItemCard({
  item: item,
  readonly: readonly,
  onReceive: onReceive,
  onCancel: onCancel,
  onEdit: onEdit,
  onDelete: onDelete,
  onEditReceipt: onEditReceipt
}) {
  let s = zn(item);
  return <div className={`rounded-2xl p-4`} style={In}>{[<div className={`flex items-start gap-3`}>{[!readonly && !item.bought ? <button type={`button`} onClick={onReceive} aria-label={`Catat pembelian ${item.name}`} className={`mt-0.5 w-6 h-6 rounded-full border-2 shrink-0`} style={{
        borderColor: `var(--border)`
      }} /> : <span className={`mt-0.5 w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs`} style={{
        background: item.bought ? `var(--secondary)` : `var(--muted)`
      }}>{item.bought ? `✓` : `–`}</span>, <div className={`min-w-0 flex-1`}>{[<p className={`text-sm font-bold`}>{item.name}</p>, <p className={`text-xs mt-0.5`} style={{
          color: `var(--muted-foreground)`
        }}>{[`Rencana `, item.quantity, ` `, item.unit, ` · `, item.category, item.note ? ` · ${item.note}` : ``]}</p>, s > 0 && <p className={`text-xs font-bold mt-1`} style={{
          color: `#15803D`
        }}>{[`Diterima `, s, ` `, item.unit, item.bought ? `` : ` · sisa ${Math.max(0, Math.round((item.quantity - s) * 1e4) / 1e4)} ${item.unit}`]}</p>, Rn(item).map((t, n) => <div className={`mt-2 flex items-start justify-between gap-2`} key={t.productId}>{[<p className={`text-xs`} style={{
            color: `var(--muted-foreground)`
          }}>{[`Pembelian `, n + 1, `: `, t.quantity, ` `, item.unit, ` · `, t.product.receivedDate ? `Tersedia ${formatDate(t.product.receivedDate)}` : `Dicatat ${Hn(t.product.createdAt)}`, ` · `, describeExpiry(t.product), ` · `, t.product.location || `Lokasi tidak diisi`]}</p>, <button type={`button`} onClick={() => onEditReceipt(t.productId)} className={`shrink-0 text-xs font-bold`} style={{
            color: `var(--primary)`
          }}>{`Edit Pembelian`}</button>]}</div>)]}</div>]}</div>, <div className={`flex justify-end gap-4 mt-3 pt-2 text-xs font-bold`} style={{
      borderTop: `1px solid var(--border)`
    }}>{[(s > 0 || item.bought) && <button type={`button`} onClick={onCancel} style={{
        color: `var(--muted-foreground)`
      }}>{`Batalkan Pembelian`}</button>, !readonly && <button type={`button`} onClick={onEdit} style={{
        color: `var(--primary)`
      }}>{`Edit Rencana`}</button>, <button type={`button`} onClick={onDelete} style={{
        color: `#B91C1C`
      }}>{`Hapus`}</button>]}</div>]}</div>;
}
function PurchaseQuantityModal({
  item: item,
  receipt: receipt,
  stock: stock,
  activityCompleted: activityCompleted,
  onSave: onSave,
  onClose: onClose
}) {
  let [o, s] = (0, React.useState)(String(receipt.quantity)),
    [c, l] = (0, React.useState)(``),
    u = Number(o),
    d = Math.max(0, Math.round((receipt.quantity - stock) * 1e4) / 1e4),
    f = Math.round((stock + u - receipt.quantity) * 1e4) / 1e4,
    p = Math.round((zn(item) - receipt.quantity + u) * 1e4) / 1e4,
    m = o.trim() !== `` && Number.isFinite(u) && u > 0 && f >= 0,
    h = activityCompleted && m && p < item.quantity;
  return <div className={`fixed inset-0 z-[65] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.48)`
  }} onClick={e => {
    e.target === e.currentTarget && onClose();
  }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Edit Pembelian`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8`} style={{
      background: `var(--card)`
    }}>{[<div className={`flex items-center justify-between mb-4`}>{[<h2 className={`font-black text-lg`}>{`Edit Pembelian`}</h2>, <button type={`button`} onClick={onClose} aria-label={`Tutup`} className={`text-xl px-2`}>{`×`}</button>]}</div>, <p className={`font-bold text-sm mb-1`}>{item.name}</p>, <p className={`text-xs mb-4`} style={{
        color: `var(--muted-foreground)`
      }}>{[receipt.product.receivedDate ? `Tersedia ${formatDate(receipt.product.receivedDate)}` : `Dicatat ${Hn(receipt.product.createdAt)}`, ` · `, describeExpiry(receipt.product)]}</p>, <form onSubmit={e => {
        e.preventDefault();
        let t = onSave(u);
        t && l(t);
      }}>{[<label className={`block text-sm font-bold`}>{[`Jumlah yang dibeli (`, item.unit, `)`, <input type={`number`} min={`0.0001`} step={`any`} autoFocus={true} value={o} onChange={e => {
            s(e.target.value), l(``);
          }} className={`mt-2`} style={Ln} />]}</label>, <div className={`rounded-xl p-3 my-4 text-sm space-y-1`} style={{
          background: `var(--muted)`
        }}>{[<p>{[`Stok batch saat ini: `, <strong>{[stock, ` `, item.unit]}</strong>]}</p>, <p>{[`Sudah keluar dari batch ini: `, <strong>{[d, ` `, item.unit]}</strong>]}</p>, m && <p>{[`Stok setelah disimpan: `, <strong>{[f, ` `, item.unit]}</strong>]}</p>]}</div>, o.trim() && Number.isFinite(u) && f < 0 && <p className={`text-xs mb-3`} style={{
          color: `#B91C1C`
        }}>{[`Jumlah dibeli minimal `, d, ` `, item.unit, ` karena stok dari batch ini sudah keluar.`]}</p>, h && <p className={`text-xs mb-3`} style={{
          color: `var(--primary)`
        }}>{`Jumlah diterima akan kurang dari rencana. Aktivitas belanja ini kembali Berjalan.`}</p>, c && <p role={`alert`} className={`p-3 rounded-xl text-sm mb-3`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{c}</p>, <button type={`submit`} disabled={!m || u === receipt.quantity} className={`w-full py-3.5 rounded-xl text-sm font-black disabled:cursor-not-allowed`} style={{
          background: m && u !== receipt.quantity ? `var(--primary)` : `var(--muted)`,
          color: m && u !== receipt.quantity ? `#fff` : `var(--muted-foreground)`
        }}>{`Simpan Pembelian`}</button>]}</form>]}</div>}</div>;
}
function ShoppingTitleModal({
  title: title,
  initial: initial,
  submitLabel: submitLabel,
  onSave: onSave,
  onClose: onClose
}) {
  let [a, o] = (0, React.useState)(initial),
    [s, c] = (0, React.useState)(``);
  return <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.45)`
  }} onClick={e => {
    e.target === e.currentTarget && onClose();
  }}>{<form onSubmit={e => {
      e.preventDefault(), c(onSave(a) ?? ``);
    }} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
      background: `var(--card)`
    }}>{[<div className={`flex items-center justify-between`}>{[<h2 className={`font-black text-lg`}>{title}</h2>, <button type={`button`} onClick={onClose} aria-label={`Tutup`}>{`×`}</button>]}</div>, <label className={`block text-sm font-bold`}>{[`Nama aktivitas`, <input autoFocus={true} maxLength={80} value={a} onChange={e => {
          o(e.target.value), c(``);
        }} placeholder={`Contoh: Belanja Mingguan`} className={`mt-2`} style={Ln} />]}</label>, s && <p role={`alert`} className={`text-sm`} style={{
        color: `#B91C1C`
      }}>{s}</p>, <button type={`submit`} className={`w-full py-3.5 rounded-xl text-sm font-black text-white`} style={{
        background: `var(--primary)`
      }}>{submitLabel}</button>]}</form>}</div>;
}
function qn(e) {
  return Jt(e) && [`quantity`, `unit`, `note`].every(t => typeof e[t] == `string`) && (e.itemId === void 0 || typeof e.itemId == `string`);
}
function ShoppingItemModal({
  username: username,
  activityId: activityId,
  existing: existing,
  activityItems: activityItems,
  itemMasters: itemMasters,
  onEditExisting: onEditExisting,
  onOpenMasterItem: onOpenMasterItem,
  onSave: onSave,
  onClose: onClose
}) {
  let l = `shopping:row:${activityId}:${existing?.id ?? `new`}`,
    u = existing ? JSON.stringify(existing) : ``,
    [d] = (0, React.useState)(() => Gt(username, l, qn, u)),
    [f, p] = (0, React.useState)(d ? d.itemId : existing?.itemId),
    [m, h] = (0, React.useState)(d?.quantity ?? (existing ? String(existing.quantity) : ``)),
    [g, v] = (0, React.useState)(d?.unit ?? existing?.unit ?? ``),
    [y, b] = (0, React.useState)(d?.note ?? existing?.note ?? ``),
    x = f !== existing?.itemId || m !== (existing ? String(existing.quantity) : ``) || g !== (existing?.unit ?? ``) || y !== (existing?.note ?? ``),
    {
      clearDraft: S,
      storageFailed: C
    } = Yt(username, l, {
      itemId: f,
      quantity: m,
      unit: g,
      note: y
    }, x, true, u),
    [w, T] = (0, React.useState)(false);
  function E() {
    x ? T(true) : onClose();
  }
  let [D, O] = (0, React.useState)(``),
    k = !!existing && Rn(existing).length > 0,
    A = itemMasters.find(e => e.id === f),
    j = !existing || existing.itemId !== f ? activityItems.find(e => e.id !== existing?.id && e.itemId === f) : void 0;
  function M(e) {
    if (e.preventDefault(), !A) {
      O(`Pilih item dari Data Master.`);
      return;
    }
    if (j) {
      O(`Item ini sudah ada di aktivitas belanja. Ubah jumlah pada item yang sudah ada.`);
      return;
    }
    let t = Number(m);
    if (!m || !Number.isFinite(t) || t <= 0) {
      O(`Jumlah harus lebih dari 0.`);
      return;
    }
    let n = onSave({
      itemId: A.id,
      name: A.name,
      category: A.category,
      unit: g || A.unit,
      quantity: t,
      note: y.trim() || void 0
    });
    n ? O(n) : S();
  }
  return <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.45)`
  }} onClick={e => {
    e.target === e.currentTarget && E();
  }}>{[<div role={`dialog`} aria-modal={`true`} aria-label={existing ? `Edit Rencana Belanja` : `Tambah Item Belanja`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8`} style={{
      background: `var(--card)`
    }}>{[<div className={`flex items-center justify-between mb-4`}>{[<h2 className={`font-black text-lg`}>{existing ? `Edit Rencana Belanja` : `Tambah Item Belanja`}</h2>, <button type={`button`} onClick={E} aria-label={`Tutup`}>{`×`}</button>]}</div>, <form onSubmit={M} className={`space-y-3`}>{[<DraftRestoreNotice restored={!!d} storageFailed={C} />, <ItemPicker items={itemMasters} value={f} disabled={k} onAddItem={e => onOpenMasterItem(e => {
          p(e.id), v(e.unit), O(``);
        }, e)} onSelect={e => {
          p(e?.id), v(e?.unit ?? ``), h(``), O(``);
        }} label={`Nama Item *`} style={Ln} />, j && <div className={`rounded-xl p-3 text-sm`} style={{
          background: `var(--muted)`
        }}>{[<p>{[<strong>{j.name}</strong>, ` sudah ada: `, j.quantity, ` `, j.unit, ` direncanakan.`]}</p>, <button type={`button`} onClick={() => onEditExisting(j)} className={`font-bold mt-2`} style={{
            color: `var(--primary)`
          }}>{`Buka item yang sudah ada`}</button>]}</div>, k && <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`
        }}>{`Item dikunci karena stoknya sudah diterima. Jumlah rencana dan catatan masih bisa diubah.`}</p>, <div className={`grid grid-cols-2 gap-3`}>{[<label className={`text-xs font-bold`}>{[`Jumlah rencana *`, <input type={`number`} min={`0.0001`} step={`any`} value={m} onChange={e => {
              h(e.target.value), O(``);
            }} className={`mt-1`} style={Ln} />]}</label>, <label className={`text-xs font-bold`}>{[`Satuan`, <select disabled={!A} value={g || A?.unit || ``} onChange={e => {
              v(e.target.value), h(``), O(``);
            }} className={`mt-1`} style={Ln}>{A ? getAllowedUnits(A).map(e => <option key={e}>{e}</option>) : <option value={``}>{`Pilih item`}</option>}</select>]}</label>]}</div>, <label className={`block text-xs font-bold`}>{[`Kategori`, <input readOnly={true} value={A?.category ?? ``} placeholder={`Mengikuti item`} className={`mt-1`} style={Ln} />]}</label>, <label className={`block text-xs font-bold`}>{[`Catatan`, <input value={y} onChange={e => b(e.target.value)} placeholder={`Opsional`} className={`mt-1`} style={Ln} />]}</label>, D && <p role={`alert`} className={`p-3 rounded-xl text-sm`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{D}</p>, <button type={`submit`} disabled={!!j} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
          background: `var(--primary)`
        }}>{existing ? `Simpan Rencana` : `Tambah ke Aktivitas`}</button>]}</form>]}</div>, w && <DraftChoiceModal onContinue={() => T(false)} onDiscard={() => {
      S(), onClose();
    }} />]}</div>;
}
export { In, Ln, Rn, zn, Bn, Vn, Hn, ShoppingPage, ShoppingItemCard, PurchaseQuantityModal, ShoppingTitleModal, qn, ShoppingItemModal };
