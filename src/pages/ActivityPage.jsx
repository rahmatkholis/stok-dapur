// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { $e, Ke, Qe, Ve, addActivityEntry, cancelStockAdjustment, convertItemUnit, deleteActivityEntry, getAllowedUnits, getUserData, previewStockCorrectionConflicts, qe, updateActivityEntry } from "../lib/store.js";
import { PhysicalStockConfirmModal } from "../components/PhysicalStockConfirmModal.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { ProductModal } from "../components/ProductModal.jsx";
import { ArchivedProductNotice } from "./AccountPage.jsx";
import { Ar } from "./RecipesPage.jsx";
var J = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  mr = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`;
function hr(e, t) {
  return Math.round(e * 1e4) / 1e4;
}
function gr() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function _r(e) {
  return new Date(e + `T00:00:00`).toLocaleDateString(`id-ID`, {
    weekday: `short`,
    day: `numeric`,
    month: `short`,
    year: `numeric`
  });
}
function vr(e) {
  let t = new Date(e);
  return Number.isNaN(t.getTime()) ? `` : t.toLocaleTimeString(`id-ID`, {
    hour: `2-digit`,
    minute: `2-digit`,
    hour12: false
  });
}
function yr(e) {
  return Jt(e) && typeof e.title == `string` && typeof e.date == `string` && Array.isArray(e.draft) && e.draft.every(e => Jt(e) && [`productId`, `productName`, `category`, `unit`].every(t => typeof e[t] == `string`) && typeof e.availableQty == `number` && typeof e.quantity == `number`);
}
function br(e) {
  return Jt(e) && [`id`, `date`, `title`, `createdAt`].every(t => typeof e[t] == `string`) && [`used`, `disposed`].includes(String(e.action)) && Array.isArray(e.items) && e.items.every(e => Jt(e) && [`productId`, `productName`, `category`, `unit`].every(t => typeof e[t] == `string`) && typeof e.quantity == `number`);
}
function ActivityPage({
  username: username,
  products: products,
  categories: categories,
  locations: locations,
  onRefresh: onRefresh,
  onOpenInventory: onOpenInventory,
  onOpenShoppingActivity: onOpenShoppingActivity,
  addTrigger: addTrigger,
  initialIntent: initialIntent,
  initialEntryId: initialEntryId
}) {
  let [u, d] = (0, React.useState)(`main`),
    [f, p] = (0, React.useState)(`used`),
    [m, h] = (0, React.useState)(gr()),
    [g, v] = (0, React.useState)(null),
    [y, b] = (0, React.useState)(() => Qe(username)),
    [x, S] = (0, React.useState)(null);
  (0, React.useEffect)(() => {
    if (!initialEntryId) return;
    let t = Qe(username).find(e => e.id === initialEntryId);
    t && (v(t), d(`detail`));
  }, [initialEntryId, username]), (0, React.useEffect)(() => {
    initialIntent && (p(initialIntent.action), h(gr()), S(initialIntent.product), d(`form`));
  }, [initialIntent?.token]);
  let C = (0, React.useCallback)(() => b(Qe(username)), [username]),
    w = (0, React.useRef)(addTrigger ?? 0);
  (0, React.useEffect)(() => {
    addTrigger && addTrigger !== w.current && d(`choose`), w.current = addTrigger ?? 0;
  }, [addTrigger]);
  function T(e) {
    S(null), p(e), h(gr()), d(`form`);
  }
  function E() {
    onRefresh(), C(), d(`main`);
  }
  function D(e) {
    onRefresh(), v(e), C();
  }
  function O() {
    onRefresh(), d(`main`), C();
  }
  return u === `form` ? <div className={`fixed inset-0 z-50`} style={{
    background: `var(--background)`
  }}>{<ActivityEntryForm username={username} products={products} action={f} initialProduct={x} date={m} onDateChange={h} onBack={() => d(`main`)} onSaved={E} />}</div> : u === `detail` && g ? g.action === `adjusted` ? <AdjustmentDetailPage entry={g} username={username} onOpenEntry={v} onOpenInventory={onOpenInventory} onOpenShoppingActivity={onOpenShoppingActivity} onRestored={() => {
    onRefresh(), C(), d(`main`);
  }} onBack={() => d(`main`)} /> : <div className={`fixed inset-0 z-50`} style={{
    background: `var(--background)`
  }}>{<ActivityDetailPage entry={g} username={username} products={products} categories={categories} locations={locations} onBack={() => d(`main`)} onUpdated={D} onDeleted={O} key={g.id} />}</div> : <jsxRuntime.Fragment>{[<ActivityList log={y} onOpenDetail={e => {
      v(e), d(`detail`);
    }} />, u === `choose` && <div className={`fixed inset-0 z-50 flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`
    }} onClick={e => {
      e.target === e.currentTarget && d(`main`);
    }}>{<div role={`dialog`} aria-modal={`true`} aria-labelledby={`choose-activity-title`} className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-5 flex flex-col gap-3`} style={{
        background: `var(--card)`,
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 24px)`,
        ...J
      }}>{[<div className={`flex items-center justify-between mb-1`}>{[<h2 id={`choose-activity-title`} className={`text-base font-black`} style={{
            color: `var(--foreground)`
          }}>{`Catat Aktivitas`}</h2>, <button type={`button`} onClick={() => d(`main`)} aria-label={`Tutup`} className={`px-2 text-xl`} style={{
            color: `var(--muted-foreground)`
          }}>{`×`}</button>]}</div>, <button type={`button`} onClick={() => T(`used`)} className={`w-full rounded-xl p-4 flex items-center gap-3 text-left`} style={{
          background: `#F0FDF4`,
          color: `var(--foreground)`
        }}>{[<span aria-hidden={`true`} className={`text-xl`}>{`✅`}</span>, <span>{[<strong className={`block text-sm`}>{`Dipakai`}</strong>, <span className={`block text-xs mt-0.5`} style={{
              color: `var(--muted-foreground)`
            }}>{`Catat bahan yang digunakan`}</span>]}</span>]}</button>, <button type={`button`} onClick={() => T(`disposed`)} className={`w-full rounded-xl p-4 flex items-center gap-3 text-left`} style={{
          background: `#FEF2F2`,
          color: `var(--foreground)`
        }}>{[<span aria-hidden={`true`} className={`text-xl`}>{`🗑️`}</span>, <span>{[<strong className={`block text-sm`}>{`Dibuang`}</strong>, <span className={`block text-xs mt-0.5`} style={{
              color: `var(--muted-foreground)`
            }}>{`Catat satu atau beberapa produk yang dibuang`}</span>]}</span>]}</button>]}</div>}</div>]}</jsxRuntime.Fragment>;
}
function ActivityList({
  log: log,
  onOpenDetail: onOpenDetail
}) {
  let [n, r] = (0, React.useState)(`all`),
    [i, a] = (0, React.useState)(``),
    o = log.filter(e => e.action === `used`),
    s = log.filter(e => e.action === `disposed`),
    c = log.filter(e => e.action === `adjusted`),
    l = n === `all` ? log : n === `used` ? o : n === `disposed` ? s : c,
    u = i.trim() ? l.filter(e => (e.title ?? ``).toLowerCase().includes(i.toLowerCase())) : l,
    d = new Map();
  for (let e of [...u].sort((e, t) => (t.date ?? ``).localeCompare(e.date ?? ``) || (t.createdAt ?? ``).localeCompare(e.createdAt ?? ``))) {
    let t = e.date || `unknown`;
    d.has(t) || d.set(t, []), d.get(t).push(e);
  }
  let f = new Date();
  f.setDate(f.getDate() - 1);
  let p = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, `0`)}-${String(f.getDate()).padStart(2, `0`)}`;
  return <div className={`pb-28 pt-5 max-w-[480px] mx-auto`}>{[<div className={`px-4 mb-4`}>{<div className={`grid grid-cols-4 gap-1 p-1 rounded-xl`} style={{
        background: `var(--muted)`
      }}>{[`all`, `used`, `disposed`, `adjusted`].map(t => {
          let i = n === t,
            a = t === `all` ? `var(--primary)` : t === `used` ? `#15803D` : t === `disposed` ? `#B91C1C` : `#0369A1`,
            l = (t === `all` ? log : t === `used` ? o : t === `disposed` ? s : c).length;
          return <button onClick={() => r(t)} className={`py-2 rounded-lg text-xs font-black transition-all`} style={{
            background: i ? `var(--card)` : `transparent`,
            color: i ? a : `var(--muted-foreground)`,
            boxShadow: i ? mr : `none`,
            ...J
          }} key={t}>{[t === `all` ? `Semua` : t === `used` ? `Dipakai` : t === `disposed` ? `Dibuang` : `Koreksi`, ` `, <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full`} style={{
              background: i ? t === `disposed` ? `#FEF2F2` : `#F0FDF4` : `transparent`,
              color: i ? a : `var(--muted-foreground)`
            }}>{l}</span>]}</button>;
        })}</div>}</div>, <div className={`px-4 mb-4`}>{<div className={`relative`}>{[<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{`🔍`}</span>, <input type={`text`} value={i} onChange={e => a(e.target.value)} placeholder={n === `disposed` ? `Cari alasan pembuangan...` : `Cari aktivitas...`} className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`,
          color: `var(--foreground)`,
          ...J
        }} />]}</div>}</div>, <div className={`px-4`}>{u.length === 0 ? <div className={`rounded-2xl p-8 text-center`} style={{
        background: `var(--card)`,
        boxShadow: mr
      }}>{[<p className={`text-3xl mb-3`}>{n === `disposed` ? `🗑️` : `📋`}</p>, <p className={`font-black text-base mb-1`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{i.trim() ? `Tidak ditemukan` : n === `all` ? `Belum ada aktivitas` : `Belum ada riwayat ${n === `used` ? `pemakaian` : n === `disposed` ? `pembuangan` : `koreksi stok`}`}</p>, !i.trim() && <p className={`text-sm font-semibold mb-5`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{`Catat aktivitas produk dapur Anda`}</p>]}</div> : <div className={`flex flex-col gap-6`}>{Array.from(d, ([e, n]) => <section aria-label={`Aktivitas ${e}`} key={e}>{[<div className={`flex items-center justify-between gap-2 mb-3`}>{[<h2 className={`text-sm font-black`} style={{
              color: `var(--foreground)`,
              ...J
            }}>{e === `unknown` ? `Tanggal tidak diketahui` : e === gr() ? `Hari ini` : e === p ? `Kemarin` : _r(e)}</h2>, <span className={`text-xs font-semibold`} style={{
              color: `var(--muted-foreground)`,
              ...J
            }}>{[n.length, ` aktivitas`]}</span>]}</div>, <div className={`flex flex-col gap-3`}>{n.map(e => <ActivityCard entry={e} onOpen={() => onOpenDetail(e)} key={e.id} />)}</div>]}</section>)}</div>}</div>]}</div>;
}
function ActivityCard({
  entry: entry,
  onOpen: onOpen
}) {
  let n = entry.action === `disposed`,
    r = entry.action === `adjusted`,
    i = r ? `#EFF6FF` : n ? `#FEF2F2` : `#F0FDF4`,
    a = entry.items ?? [],
    o = vr(entry.createdAt),
    s = n && a.length === 1 ? `${a[0].productName} · ${a[0].quantity} ${a[0].unit}` : `${a.length} batch stok`;
  return <button onClick={onOpen} className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-left transition-transform active:scale-[0.98]`} style={{
    background: `var(--card)`,
    boxShadow: mr
  }}>{[<div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0`} style={{
      background: i
    }}>{r ? `↔` : n ? `🗑️` : `✅`}</div>, <div className={`flex-1 min-w-0`}>{[<div className={`flex items-center gap-2`}>{[<p className={`font-black text-sm truncate flex-1`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{entry.title || (n ? `Pembuangan` : `Pemakaian`)}</p>, o && <span className={`text-xs font-semibold shrink-0`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{[`Dicatat `, o]}</span>]}</div>, <p className={`text-xs font-semibold mt-0.5`} style={{
        color: `var(--muted-foreground)`,
        ...J
      }}>{[entry.cancelledAt ? `Dibatalkan · ` : entry.reversalOf ? `Pembalikan · ` : ``, r ? `Koreksi stok · ${entry.adjustment?.before ?? `—`} → ${entry.adjustment?.after ?? `—`} ${a[0]?.unit ?? ``}` : `${entry.source === `recipe` ? `Dimasak · ${entry.servings ?? 1} porsi` : n ? `Dibuang` : `Dipakai langsung`} · ${s}`]}</p>]}</div>, <span className={`text-base shrink-0`} style={{
      color: `var(--muted-foreground)`
    }}>{`›`}</span>]}</button>;
}
function AdjustmentDetailPage({
  entry: entry,
  username: username,
  onRestored: onRestored,
  onBack: onBack,
  onOpenEntry: onOpenEntry,
  onOpenInventory: onOpenInventory,
  onOpenShoppingActivity: onOpenShoppingActivity
}) {
  let s = entry.items[0],
    [c, l] = (0, React.useState)(``),
    [u, d] = (0, React.useState)(false),
    f = qe(username, entry.id),
    p = Ve(username, entry.adjustment?.productId ?? ``).purchase;
  (0, React.useEffect)(() => {
    l(``), d(false);
  }, [entry.id]);
  let m = Qe(username).some(t => t.reversalOf === entry.id);
  function h() {
    if (!entry.adjustment) return;
    let r = Ke(username, entry.id);
    if (r) {
      l(r);
      return;
    }
    onRestored();
  }
  return <div className={`fixed inset-0 z-50 overflow-y-auto`} style={{
    background: `var(--background)`
  }}>{<div className={`max-w-[480px] mx-auto min-h-screen`}>{[<div className={`px-4 py-4 flex items-center gap-3`} style={{
        background: `var(--card)`
      }}>{[<button onClick={onBack} aria-label={`Kembali`} className={`w-9 h-9 rounded-xl font-bold`} style={{
          background: `var(--muted)`
        }}>{`‹`}</button>, <h2 className={`font-black text-base`}>{`Detail Koreksi Stok`}</h2>]}</div>, <div className={`p-4 space-y-4`}>{[<div className={`rounded-2xl p-4 space-y-3`} style={{
          background: `var(--card)`,
          boxShadow: mr
        }}>{[<h3 className={`font-black text-lg`}>{entry.title}</h3>, <p className={`text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{[_r(entry.date), ` · `, vr(entry.createdAt)]}</p>, <div className={`h-px`} style={{
            background: `var(--border)`
          }} />, <p className={`text-sm font-bold`}>{s?.productName ?? `Stok`}</p>, <p className={`text-sm`}>{[entry.adjustment?.before ?? `—`, ` `, s?.unit, ` → `, <strong>{[entry.adjustment?.after ?? `—`, ` `, s?.unit]}</strong>]}</p>]}</div>, entry.cancelledAt && <p className={`text-sm font-bold`}>{`Penyesuaian ini sudah dibatalkan. Riwayat tetap tersimpan.`}</p>, !entry.cancelledAt && !entry.reversalOf && !m && <jsxRuntime.Fragment>{f.blockers.length > 0 ? <div className={`space-y-2`}>{[<p className={`text-sm`}>{`Ada catatan yang lebih baru. Periksa dari yang terbaru; koreksi hanya catatan yang salah.`}</p>, f.blockers.map(e => <button onClick={() => onOpenEntry(e)} className={`w-full text-left p-3 rounded-xl text-sm font-bold`} style={{
              background: `var(--muted)`
            }} key={e.id}>{[e.title, ` · `, _r(e.date)]}</button>)]}</div> : f.changedStock ? <div className={`space-y-2`}>{[<p className={`text-sm`}>{`Jumlah stok sudah berubah. Koreksi pembelian jika jumlah belinya salah, atau catat jumlah fisik yang benar di Inventori.`}</p>, p?.activityId && <button onClick={() => onOpenShoppingActivity(p.activityId)} className={`w-full rounded-xl p-3 text-sm font-bold`} style={{
              background: `var(--muted)`
            }}>{`Buka Belanja Terkait`}</button>, <button onClick={onOpenInventory} className={`w-full rounded-xl p-3 text-sm font-bold`} style={{
              background: `var(--muted)`
            }}>{`Buka Inventori untuk Sesuaikan Stok`}</button>]}</div> : <button type={`button`} onClick={() => d(true)} className={`w-full py-3 rounded-xl text-sm font-bold border border-red-600 text-red-700`}>{`Batalkan Penyesuaian yang Salah`}</button>}</jsxRuntime.Fragment>, entry.adjustment?.after === 0 && !m && !entry.cancelledAt && f.blockers.length === 0 && <button type={`button`} onClick={h} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          background: `var(--primary)`,
          color: `#fff`
        }}>{[`Pulihkan `, entry.adjustment.before, ` `, s?.unit, ` ke Inventori`]}</button>, m && !entry.cancelledAt && <p className={`text-sm font-bold`} style={{
          color: `#15803D`
        }}>{`Penyesuaian ini sudah memiliki catatan pemulihan.`}</p>, u && <div role={`alertdialog`} aria-modal={`true`} aria-label={`Konfirmasi pembatalan penyesuaian`} className={`rounded-xl border p-4 space-y-3`}>{[<p className={`text-sm`}>{[`Batalkan hanya jika penyesuaian ini salah. Stok `, s?.productName, ` berubah dari `, entry.adjustment?.after, ` menjadi `, <strong>{[entry.adjustment?.before, ` `, s?.unit]}</strong>, `. Catatan pembatalan tetap tersimpan.`]}</p>, <button onClick={() => {
            let r = cancelStockAdjustment(username, entry.id);
            r ? l(r) : onRestored();
          }} className={`w-full rounded-xl p-3 bg-red-600 text-white font-bold`}>{`Ya, Batalkan Penyesuaian`}</button>, <button onClick={() => d(false)} className={`w-full p-2`}>{`Kembali`}</button>]}</div>, c && <p role={`alert`} className={`p-3 rounded-xl text-sm`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{c}</p>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`
        }}>{`Riwayat koreksi disimpan. Perubahan berikutnya akan tercatat sebagai aktivitas baru.`}</p>]}</div>]}</div>}</div>;
}
function ActivityDetailPage({
  entry: entry,
  username: username,
  products: products,
  categories: categories,
  locations: locations,
  onBack: onBack,
  onUpdated: onUpdated,
  onDeleted: onDeleted
}) {
  let c = entry.action === `disposed`,
    l = c ? `#EF4444` : `#22C55E`,
    u = c ? `#FEF2F2` : `#F0FDF4`,
    d = c ? `Dibuang` : entry.source === `recipe` ? `Dimasak` : `Dipakai`,
    [f, p] = (0, React.useState)(entry),
    [m] = (0, React.useState)(() => Gt(username, `activity:edit:${entry.id}`, br, JSON.stringify(entry))),
    [h, g] = (0, React.useState)(m ?? entry),
    v = JSON.stringify(h) !== JSON.stringify(f),
    {
      clearDraft: y,
      storageFailed: b
    } = Yt(username, `activity:edit:${entry.id}`, h, v, true, JSON.stringify(f)),
    [x, S] = (0, React.useState)(null),
    [C, w] = (0, React.useState)(null),
    [T, E] = (0, React.useState)(false),
    [D, O] = (0, React.useState)(false),
    [k, A] = (0, React.useState)(false),
    [j, M] = (0, React.useState)(``),
    [N, P] = (0, React.useState)(null),
    [F, I] = (0, React.useState)(null);
  function L(e) {
    S(e);
  }
  function ee() {
    v ? A(true) : onBack();
  }
  function R(e, n, r = [], i) {
    let a = previewStockCorrectionConflicts(username, f, e === `update` ? n : void 0);
    if (a.length && !i) return I({
      mode: e,
      entry: n,
      restored: r,
      conflicts: a
    }), null;
    let c = e === `update` ? updateActivityEntry(username, n, r, i) : deleteActivityEntry(username, f.id, r, i);
    if (c) return M(c), c;
    if (y(), M(``), I(null), P(null), O(false), S(null), e === `delete`) onDeleted();else {
      let e = Qe(username).find(e => e.id === n.id);
      p(e), g(e), onUpdated(e);
    }
    return null;
  }
  function z(e) {
    if (e === `update` && (!h.title.trim() || !h.items.length)) {
      M(`Isi nama aktivitas dan minimal satu produk.`);
      return;
    }
    O(false), M(``);
    let n = $e(username, f, e === `update` ? h.items : []);
    if (n.length) {
      P({
        mode: e,
        entry: h,
        missing: n,
        restored: []
      });
      return;
    }
    R(e, h);
  }
  function B() {
    z(`update`);
  }
  function V(e) {
    if (!N) return `Produk tidak ditemukan.`;
    let t = N.missing[0],
      n = [...N.restored, {
        ...e,
        id: t.productId,
        name: t.productName,
        category: t.category,
        unit: t.unit,
        createdAt: f.createdAt
      }];
    return N.missing.length > 1 ? (P({
      ...N,
      missing: N.missing.slice(1),
      restored: n
    }), null) : R(N.mode, N.entry, n);
  }
  function H() {
    y(), g(f), M(``), S(null), w(null);
  }
  function U(e) {
    if (C === null) return;
    let t = h.items.map((t, n) => n === C ? {
      ...t,
      quantity: hr(e, t.unit)
    } : t);
    g(e => ({
      ...e,
      items: t
    })), w(null);
  }
  function W() {
    if (C === null) return;
    let e = h.items.filter((e, t) => t !== C);
    g(t => ({
      ...t,
      items: e
    })), w(null);
  }
  function te(e, t) {
    let n = h.items.some(t => t.productId === e.id) ? h.items.map(n => n.productId === e.id ? {
      ...n,
      quantity: hr(t, n.unit)
    } : n) : [...h.items, {
      productId: e.id,
      productName: e.name,
      category: e.category,
      quantity: hr(t, e.unit),
      unit: e.unit
    }];
    g(e => ({
      ...e,
      items: n
    })), E(false);
  }
  let ne = [...products];
  for (let e of f.items) {
    let t = ne.findIndex(t => t.id === e.productId);
    t >= 0 ? ne[t] = {
      ...ne[t],
      quantity: +(ne[t].quantity + e.quantity).toFixed(4)
    } : ne.push({
      ...(e.productSnapshot ?? {
        id: e.productId,
        name: e.productName,
        category: e.category,
        unit: e.unit,
        expiryDate: ``,
        createdAt: f.createdAt
      }),
      quantity: e.quantity
    });
  }
  let re = C === null ? null : h.items[C],
    ie = ne.find(e => e.id === re?.productId) ?? null;
  return <div className={`h-full max-w-[480px] mx-auto flex flex-col overflow-hidden relative`}>{[<div className={`shrink-0 px-4 pb-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 16px) + 12px)`
    }}>{<div className={`flex items-center gap-3`}>{[<button onClick={ee} className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0`} style={{
          background: `var(--muted)`,
          color: `var(--foreground)`
        }}>{`‹`}</button>, <span className={`font-black text-base flex-1 truncate`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{h.title || d}</span>]}</div>}</div>, <div className={`flex-1 overflow-y-auto px-4 pt-5 pb-40`}>{[<DraftRestoreNotice restored={!!m && v} storageFailed={b} />, j && <p role={`alert`} className={`text-sm rounded-xl px-3 py-2 mb-4`} style={{
        background: `#FEF2F2`,
        color: `#EF4444`
      }}>{j}</p>, <div className={`rounded-2xl p-4 mb-5 flex flex-col gap-0`} style={{
        background: `var(--card)`,
        boxShadow: mr
      }}>{[<div className={`pb-3`}>{[<p className={`text-[10px] font-bold uppercase tracking-widest mb-2`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{`Jenis Aktivitas`}</p>, <span className={`text-[11px] font-black px-2.5 py-1 rounded-full`} style={{
            background: u,
            color: l,
            ...J
          }}>{d}</span>]}</div>, <div className={`h-px`} style={{
          background: `var(--border)`
        }} />, <div className={`py-3`}>{[<p className={`text-[10px] font-bold uppercase tracking-widest mb-2`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{c ? `Alasan` : `Nama Aktivitas`}</p>, x === `title` ? <input type={`text`} value={h.title} onChange={e => g(t => ({
            ...t,
            title: e.target.value
          }))} placeholder={c ? `mis. kedaluwarsa, bau...` : `mis. Masak malam...`} style={Ar} autoFocus={true} /> : <div className={`flex items-center justify-between gap-3`}>{[<p className={`font-black text-sm`} style={{
              color: `var(--foreground)`,
              ...J
            }}>{h.title}</p>, <button onClick={() => L(`title`)} className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs`} style={{
              background: `var(--muted)`,
              color: `var(--muted-foreground)`
            }}>{`✏️`}</button>]}</div>]}</div>, <div className={`h-px`} style={{
          background: `var(--border)`
        }} />, <div className={`pt-3`}>{[<p className={`text-[10px] font-bold uppercase tracking-widest mb-2`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{`Tanggal`}</p>, x === `date` ? <input type={`date`} value={h.date} max={gr()} onChange={e => g(t => ({
            ...t,
            date: e.target.value || t.date
          }))} style={Ar} autoFocus={true} /> : <div className={`flex items-center justify-between gap-3`}>{[<p className={`font-bold text-sm`} style={{
              color: `var(--foreground)`,
              ...J
            }}>{_r(h.date)}</p>, <button onClick={() => L(`date`)} className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs`} style={{
              background: `var(--muted)`,
              color: `var(--muted-foreground)`
            }}>{`✏️`}</button>]}</div>]}</div>]}</div>, <div className={`flex items-center justify-between mb-3`}>{[<p className={`text-xs font-bold uppercase tracking-widest`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{[`Daftar Produk (`, h.items.length, `)`]}</p>, !c && <button onClick={() => E(true)} className={`text-xs font-black px-2.5 py-1 rounded-lg`} style={{
          background: `var(--muted)`,
          color: `var(--primary)`,
          ...J
        }}>{`+ Tambah`}</button>]}</div>, <div className={`flex flex-col gap-2`}>{h.items.map((e, t) => <div className={`rounded-xl px-4 py-3 flex items-center gap-3`} style={{
          background: `var(--card)`,
          boxShadow: `0 1px 6px rgba(0,0,0,0.05)`
        }} key={t}>{[<div className={`flex-1 min-w-0`}>{[<p className={`font-bold text-sm truncate`} style={{
              color: `var(--foreground)`,
              ...J
            }}>{e.productName}</p>, <p className={`text-xs font-semibold mt-0.5`} style={{
              color: `var(--muted-foreground)`,
              ...J
            }}>{e.category}</p>, <ArchivedProductNotice product={ne.find(t => t.id === e.productId) ?? e.productSnapshot} />]}</div>, <span className={`font-black text-sm shrink-0`} style={{
            color: l,
            ...J
          }}>{[e.quantity, ` `, e.unit]}</span>, <button onClick={() => {
            S(null), w(t);
          }} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0`} style={{
            background: `var(--muted)`,
            color: `var(--muted-foreground)`
          }}>{`✏️`}</button>]}</div>)}</div>, <button onClick={() => O(true)} className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2`} style={{
        background: `#FEF2F2`,
        color: `#EF4444`,
        border: `1px solid #FECACA`,
        ...J
      }}>{`🗑️ Hapus Aktivitas`}</button>]}</div>, v && <div className={`absolute bottom-0 left-0 right-0 px-4 pt-3 pb-6 flex gap-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 -2px 16px rgba(0,0,0,0.12)`,
      zIndex: 10
    }}>{[<button onClick={H} className={`px-5 py-3.5 rounded-xl font-bold text-sm shrink-0`} style={{
        background: `var(--muted)`,
        color: `var(--muted-foreground)`,
        ...J
      }}>{`Batalkan`}</button>, <button onClick={B} disabled={!h.title.trim() || !h.items.length} className={`flex-1 py-3.5 rounded-xl font-black text-sm`} style={{
        background: !h.title.trim() || !h.items.length ? `var(--border)` : `var(--primary)`,
        color: !h.title.trim() || !h.items.length ? `var(--muted-foreground)` : `#fff`,
        ...J
      }}>{`Simpan`}</button>]}</div>, k && <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`,
      backdropFilter: `blur(3px)`
    }}>{<div className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4`} style={{
        background: `var(--card)`
      }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
          background: `var(--border)`
        }} />, <div>{[<p className={`font-black text-base mb-1`} style={{
            color: `var(--foreground)`,
            ...J
          }}>{`Keluar tanpa menyimpan?`}</p>, <p className={`text-sm font-semibold`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{`Perubahan yang belum disimpan akan hilang jika kamu keluar sekarang.`}</p>]}</div>, <button onClick={() => {
          y(), onBack();
        }} className={`w-full py-3.5 rounded-xl font-black text-sm`} style={{
          background: `var(--primary)`,
          color: `#fff`,
          ...J
        }}>{`Oke, Keluar`}</button>, <button onClick={() => A(false)} className={`w-full py-3 rounded-xl font-bold text-sm`} style={{
          background: `var(--muted)`,
          color: `var(--muted-foreground)`,
          ...J
        }}>{`Batal`}</button>]}</div>}</div>, D && <DeleteActivityConfirmModal label={d} onCancel={() => O(false)} onConfirm={() => z(`delete`)} />, N && <ProductModal username={username} categories={categories} locations={locations} product={{
      id: N.missing[0].productId,
      name: N.missing[0].productName,
      category: N.missing[0].category,
      quantity: N.missing[0].quantity,
      unit: N.missing[0].unit,
      expiryDate: ``,
      createdAt: f.createdAt
    }} title={`Lengkapi Stok yang Dikembalikan`} submitLabel={N.missing.length > 1 ? `Lanjut` : `Simpan & Perbarui Stok`} lockDetails={true} onSave={V} onClose={() => P(null)} key={N.missing[0].productId} />, C !== null && ie && <ActivityItemModal username={username} product={ie} accentColor={l} initialQty={h.items[C]?.quantity} onClose={() => w(null)} onSave={U} onDelete={W} />, T && <ActivityProductPicker username={username} products={ne.filter(e => (!e.receivedDate || e.receivedDate <= h.date) && (c || !e.expiryDate || e.expiryDate >= h.date))} existingIds={new Set(h.items.map(e => e.productId))} accentColor={l} onClose={() => E(false)} onAdd={te} />, F && <PhysicalStockConfirmModal conflicts={F.conflicts} onClose={() => I(null)} onSave={e => R(F.mode, F.entry, F.restored, e)} />]}</div>;
}
function DeleteActivityConfirmModal({
  label: label,
  onCancel: onCancel,
  onConfirm: onConfirm
}) {
  return <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.45)`,
    backdropFilter: `blur(3px)`
  }} onClick={e => {
    e.target === e.currentTarget && onCancel();
  }}>{<div className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4`} style={{
      background: `var(--card)`
    }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
        background: `var(--border)`
      }} />, <div>{[<p className={`font-black text-base mb-1`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{`Hapus Aktivitas?`}</p>, <p className={`text-sm font-semibold`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{[`Aktivitas `, label.toLowerCase(), ` ini akan dihapus dari riwayat. Jumlah produk yang tercatat akan dikembalikan ke stok inventori.`]}</p>]}</div>, <button onClick={onConfirm} className={`w-full py-3.5 rounded-xl font-black text-sm`} style={{
        background: `#EF4444`,
        color: `#fff`,
        ...J
      }}>{`Ya, Hapus`}</button>, <button onClick={onCancel} className={`w-full py-3 rounded-xl font-bold text-sm`} style={{
        background: `var(--muted)`,
        color: `var(--muted-foreground)`,
        ...J
      }}>{`Batal`}</button>]}</div>}</div>;
}
function ActivityProductPicker({
  username: username,
  products: products,
  existingIds: existingIds,
  accentColor: accentColor,
  onClose: onClose,
  onAdd: onAdd
}) {
  let [o, s] = (0, React.useState)(``),
    [c, l] = (0, React.useState)(null),
    u = products.filter(e => e.quantity > 0 || existingIds.has(e.id)).filter(e => !o.trim() || e.name.toLowerCase().includes(o.toLowerCase()) || e.category.toLowerCase().includes(o.toLowerCase()));
  return <jsxRuntime.Fragment>{[<div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`,
      backdropFilter: `blur(3px)`
    }} onClick={e => {
      e.target === e.currentTarget && onClose();
    }}>{<div className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 max-h-[80vh]`} style={{
        background: `var(--card)`
      }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
          background: `var(--border)`
        }} />, <div className={`flex items-center justify-between`}>{[<p className={`font-black text-base`} style={{
            color: `var(--foreground)`,
            ...J
          }}>{`Tambah Produk`}</p>, <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg`} style={{
            background: `var(--muted)`,
            color: `var(--muted-foreground)`
          }}>{`×`}</button>]}</div>, <div className={`relative`}>{[<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{`🔍`}</span>, <input type={`text`} value={o} onChange={e => s(e.target.value)} placeholder={`Cari produk...`} className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`,
            color: `var(--foreground)`,
            ...J
          }} />]}</div>, <div className={`overflow-y-auto flex flex-col gap-2`}>{u.map(e => <button onClick={() => l(e)} className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98]`} style={{
            background: `var(--muted)`,
            boxShadow: `0 1px 4px rgba(0,0,0,0.05)`
          }} key={e.id}>{[<div className={`flex-1 min-w-0`}>{[<p className={`font-black text-sm truncate`} style={{
                color: `var(--foreground)`,
                ...J
              }}>{e.name}</p>, <p className={`text-xs font-semibold mt-0.5`} style={{
                color: `var(--muted-foreground)`,
                ...J
              }}>{[e.quantity, ` `, e.unit, ` · `, e.category]}</p>, <ArchivedProductNotice product={e} />]}</div>, existingIds.has(e.id) && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0`} style={{
              background: accentColor + `22`,
              color: accentColor
            }}>{`Ada`}</span>]}</button>)}</div>]}</div>}</div>, c && <ActivityItemModal username={username} product={c} accentColor={accentColor} onClose={() => l(null)} onSave={e => {
      onAdd(c, e), l(null);
    }} />]}</jsxRuntime.Fragment>;
}
function ActivityEntryForm({
  username: username,
  products: products,
  action: action,
  date: date,
  onDateChange: onDateChange,
  onBack: onBack,
  onSaved: onSaved,
  initialProduct: initialProduct
}) {
  let c = `activity:new:${action}`,
    [l] = (0, React.useState)(() => Gt(username, c, yr)),
    [u, d] = (0, React.useState)(l?.title ?? ``),
    [f, p] = (0, React.useState)(l?.date ?? date),
    [m, h] = (0, React.useState)(``),
    [g, v] = (0, React.useState)(() => l?.draft ?? (initialProduct ? [{
      productId: initialProduct.id,
      productName: initialProduct.name,
      category: initialProduct.category,
      unit: initialProduct.unit,
      availableQty: initialProduct.quantity,
      quantity: Math.min(1, initialProduct.quantity)
    }] : [])),
    [y, b] = (0, React.useState)(null),
    [x, S] = (0, React.useState)(false),
    [C, w] = (0, React.useState)(``),
    [T, E] = (0, React.useState)(false),
    D = !!u.trim() || g.length > 0 || f !== gr(),
    {
      clearDraft: O,
      storageFailed: k
    } = Yt(username, c, {
      title: u,
      date: f,
      draft: g
    }, D);
  function A() {
    D ? E(true) : onBack();
  }
  let j = action === `disposed`,
    M = j ? `#EF4444` : `#22C55E`,
    N = j ? `Simpan Pembuangan` : `Simpan Pemakaian`,
    P = new Set(g.map(e => e.productId)),
    [F, I] = (0, React.useState)(`Semua`),
    [L, ee] = (0, React.useState)(null),
    R = products.filter(e => e.quantity > 0 && (!e.receivedDate || e.receivedDate <= f) && (j || !e.expiryDate || e.expiryDate >= f)),
    z = [`Semua`, ...Array.from(new Set(R.map(e => e.category))).sort()],
    B = R.filter(e => (F === `Semua` || e.category === F) && (!m.trim() || e.name.toLowerCase().includes(m.toLowerCase()) || e.category.toLowerCase().includes(m.toLowerCase())));
  async function V() {
    if (x) return;
    if (!u.trim()) {
      w(j ? `Alasan wajib diisi.` : `Nama aktivitas wajib diisi.`);
      return;
    }
    if (g.length === 0) {
      w(`Pilih minimal satu produk.`);
      return;
    }
    w(``);
    let t = {
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        action: action,
        date: f,
        title: u.trim(),
        items: g.map(e => ({
          productId: e.productId,
          productName: e.productName,
          category: e.category,
          quantity: e.quantity,
          unit: e.unit
        })),
        createdAt: new Date().toISOString()
      },
      r = previewStockCorrectionConflicts(username, void 0, t);
    if (r.length) {
      ee({
        entry: t,
        conflicts: r
      });
      return;
    }
    H(t);
  }
  function H(t, n) {
    S(true);
    let r = addActivityEntry(username, t, n);
    return r ? (S(false), w(r), r) : (O(), onSaved(), null);
  }
  function U(e, n) {
    let r = products.find(t => t.id === e);
    r && (v(t => t.some(t => t.productId === e) ? t.map(t => t.productId === e ? {
      ...t,
      quantity: n
    } : t) : [...t, {
      productId: r.id,
      productName: r.name,
      category: r.category,
      unit: r.unit,
      availableQty: r.quantity,
      quantity: n
    }]), b(null));
  }
  return <div className={`h-full max-w-[480px] mx-auto flex flex-col overflow-hidden`}>{[<div className={`shrink-0 px-4 pb-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 16px) + 12px)`
    }}>{<div className={`flex items-center gap-3`}>{[<button onClick={A} className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0`} style={{
          background: `var(--muted)`,
          color: `var(--foreground)`
        }}>{`‹`}</button>, <span className={`font-black text-base flex-1`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{j ? `Catat Pembuangan` : `Catat Pemakaian`}</span>, <span className={`text-[11px] font-black px-2.5 py-1 rounded-full shrink-0`} style={{
          background: j ? `#FEF2F2` : `#F0FDF4`,
          color: j ? `#EF4444` : `#22C55E`,
          ...J
        }}>{j ? `🗑️ Dibuang` : `✅ Dipakai`}</span>]}</div>}</div>, <div className={`flex-1 overflow-y-auto`}>{[<div className={`px-4 pt-5 pb-1`}>{[<DraftRestoreNotice restored={!!l} storageFailed={k} />, <div className={`rounded-2xl p-4 flex flex-col gap-4`} style={{
          background: `var(--card)`,
          boxShadow: mr
        }}>{[<div>{[<label className={`block text-xs font-bold uppercase tracking-wide mb-1.5`} style={{
              color: `var(--muted-foreground)`,
              ...J
            }}>{j ? `Alasan *` : `Nama Aktivitas *`}</label>, <input type={`text`} value={u} onChange={e => {
              d(e.target.value), w(``);
            }} placeholder={j ? `mis. kedaluwarsa, bau, rusak...` : `mis. Masak malam, Sarapan...`} style={Ar} />]}</div>, <div>{[<label className={`block text-xs font-bold uppercase tracking-wide mb-1.5`} style={{
              color: `var(--muted-foreground)`,
              ...J
            }}>{`Tanggal Aktivitas`}</label>, <input type={`date`} value={f} max={gr()} onChange={e => {
              let t = e.target.value || gr();
              p(t), onDateChange(t);
            }} style={Ar} />]}</div>]}</div>]}</div>, g.length > 0 && <div className={`px-4 pt-5`}>{[<p className={`text-xs font-bold uppercase tracking-widest mb-3`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{[`Produk yang `, j ? `dibuang` : `dipakai`, ` (`, g.length, `)`]}</p>, <div className={`flex flex-col gap-2`}>{g.map(e => <div className={`rounded-xl px-4 py-3 flex items-center gap-3`} style={{
            background: `var(--card)`,
            boxShadow: `0 1px 6px rgba(0,0,0,0.06)`
          }} key={e.productId}>{[<div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0`} style={{
              background: j ? `#FEF2F2` : `#F0FDF4`
            }}>{j ? `🗑️` : `✅`}</div>, <div className={`flex-1 min-w-0`}>{[<p className={`font-black text-sm truncate`} style={{
                color: `var(--foreground)`,
                ...J
              }}>{e.productName}</p>, <p className={`text-xs font-semibold mt-0.5`} style={{
                color: `var(--muted-foreground)`,
                ...J
              }}>{[e.quantity, ` `, e.unit]}</p>, <ArchivedProductNotice product={products.find(t => t.id === e.productId)} />]}</div>, <div className={`flex items-center gap-1.5 shrink-0`}>{[<button onClick={() => {
                let n = products.find(t => t.id === e.productId);
                n && b(n);
              }} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs`} style={{
                background: `var(--muted)`,
                color: `var(--foreground)`
              }}>{`✏️`}</button>, <button onClick={() => v(t => t.filter(t => t.productId !== e.productId))} className={`w-7 h-7 rounded-lg flex items-center justify-center`} style={{
                background: `#FEF2F2`,
                color: `#EF4444`,
                fontSize: 18,
                lineHeight: 1
              }}>{`×`}</button>]}</div>]}</div>)}</div>]}</div>, <div className={`px-4 pt-5 pb-32`}>{[<p className={`text-xs font-bold uppercase tracking-widest mb-3`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{`Pilih Produk`}</p>, <div className={`relative mb-3`}>{[<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{`🔍`}</span>, <input type={`text`} value={m} onChange={e => h(e.target.value)} placeholder={`Cari produk...`} className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`,
            color: `var(--foreground)`,
            ...J
          }} />]}</div>, <div className={`flex gap-2 overflow-x-auto pb-2 mb-1`} style={{
          scrollbarWidth: `none`
        }}>{z.map(e => {
            let t = F === e;
            return <button onClick={() => I(e)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all`} style={{
              background: t ? M : `var(--muted)`,
              color: t ? `#fff` : `var(--muted-foreground)`,
              ...J
            }} key={e}>{e}</button>;
          })}</div>, <div className={`flex flex-col gap-2`}>{[B.length === 0 && <p className={`text-sm p-3`} style={{
            color: `var(--muted-foreground)`
          }}>{`Tidak ada stok yang sesuai tanggal dan pencarian ini. Periksa tanggal kejadian atau stok di Inventori.`}</p>, B.map(e => {
            let t = P.has(e.id);
            return <button onClick={() => b(e)} className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98]`} style={{
              background: `var(--card)`,
              boxShadow: `0 1px 6px rgba(0,0,0,0.06)`
            }} key={e.id}>{[<div className={`flex-1 min-w-0`}>{[<p className={`font-black text-sm truncate`} style={{
                  color: `var(--foreground)`,
                  ...J
                }}>{e.name}</p>, <p className={`text-xs font-semibold mt-0.5`} style={{
                  color: `var(--muted-foreground)`,
                  ...J
                }}>{[`Stok: `, e.quantity, ` `, e.unit, ` · `, e.category]}</p>, <ArchivedProductNotice product={e} />]}</div>, t ? <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0`} style={{
                background: j ? `#FEF2F2` : `#F0FDF4`,
                color: M,
                ...J
              }}>{`✓ Edit`}</span> : <span className={`text-xl font-bold shrink-0`} style={{
                color: `var(--primary)`
              }}>{`+`}</span>]}</button>;
          })]}</div>]}</div>]}</div>, <div className={`shrink-0 px-4 pt-3 pb-4`} style={{
      background: `var(--card)`,
      boxShadow: `0 -2px 12px rgba(0,0,0,0.08)`
    }}>{[C && <p className={`text-xs font-semibold mb-3 px-3 py-2 rounded-xl`} style={{
        background: `#FEE2E2`,
        color: `#EF4444`,
        ...J
      }}>{C}</p>, <button onClick={V} disabled={x} className={`w-full py-4 rounded-xl font-black text-sm`} style={{
        background: g.length === 0 || !u.trim() ? `var(--border)` : j ? `#EF4444` : `var(--primary)`,
        color: g.length === 0 || !u.trim() ? `var(--muted-foreground)` : `#fff`,
        cursor: g.length === 0 || !u.trim() ? `not-allowed` : `pointer`,
        ...J
      }}>{x ? `Menyimpan...` : g.length === 0 ? `Pilih produk terlebih dahulu` : `${N} (${g.length} batch)`}</button>]}</div>, y && <ActivityItemModal username={username} product={y} accentColor={M} initialQty={g.find(e => e.productId === y.id)?.quantity} onClose={() => b(null)} onSave={e => U(y.id, e)} />, L && <PhysicalStockConfirmModal conflicts={L.conflicts} onClose={() => ee(null)} onSave={e => H(L.entry, e)} />, T && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,.52)`
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Aktivitas belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
        background: `var(--card)`
      }}>{[<h3 className={`text-lg font-black`}>{`Aktivitas belum disimpan`}</h3>, <p className={`text-sm`}>{`Isian dan daftar produk akan hilang jika kamu keluar. Stok belum berubah.`}</p>, <button type={`button`} onClick={() => E(false)} className={`w-full rounded-xl py-3 font-bold text-white`} style={{
          background: `var(--primary)`
        }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={() => {
          O(), onBack();
        }} className={`w-full rounded-xl py-3 font-bold`} style={{
          color: `#B91C1C`
        }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>]}</div>;
}
function ActivityItemModal({
  username: username,
  product: product,
  accentColor: accentColor,
  initialQty: initialQty,
  onClose: onClose,
  onSave: onSave,
  onDelete: onDelete
}) {
  let s = getUserData(username).itemMasters?.find(e => e.id === product.itemId),
    [c, l] = (0, React.useState)(product.unit),
    u = 1e-4,
    d = initialQty ?? Math.min(product.quantity, 1),
    [f, p] = (0, React.useState)(String(d)),
    m = Number(f),
    h = s && f.trim() && Number.isFinite(m) ? convertItemUnit(m, c, product.unit, s) : m,
    g = s ? convertItemUnit(product.quantity, product.unit, c, s) : product.quantity;
  function v(e) {
    p(String(Math.max(u, hr(e, c))));
  }
  let y = f.trim() !== `` && Number.isFinite(m) && m >= u && h >= u && h <= product.quantity && hr(m, c) === m && Math.abs((s ? convertItemUnit(h, product.unit, c, s) : h) - m) <= 5e-5;
  return <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.45)`,
    backdropFilter: `blur(3px)`
  }} onClick={e => {
    e.target === e.currentTarget && onClose();
  }}>{<div className={`w-full max-w-[480px] rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4`} style={{
      background: `var(--card)`
    }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
        background: `var(--border)`
      }} />, <div className={`flex items-start justify-between gap-2`}>{[<div className={`min-w-0`}>{[<h3 className={`font-black text-base truncate`} style={{
            color: `var(--foreground)`,
            ...J
          }}>{product.name}</h3>, <p className={`text-xs font-semibold mt-0.5`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{product.category}</p>, <ArchivedProductNotice product={product} />]}</div>, <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg`} style={{
          background: `var(--muted)`,
          color: `var(--muted-foreground)`
        }}>{`×`}</button>]}</div>, <div className={`rounded-xl px-4 py-3 flex justify-between items-center`} style={{
        background: `var(--muted)`
      }}>{[<span className={`text-xs font-bold uppercase tracking-wide`} style={{
          color: `var(--muted-foreground)`,
          ...J
        }}>{onDelete ? `Maksimum untuk aktivitas ini` : `Stok saat ini`}</span>, <span className={`font-black text-sm`} style={{
          color: `var(--foreground)`,
          ...J
        }}>{[product.quantity, ` `, product.unit]}</span>]}</div>, <div>{[<div className={`flex items-center justify-between mb-2`}>{[<label className={`text-xs font-bold uppercase tracking-wide`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{[`Jumlah (`, c, `)`]}</label>, <button type={`button`} onClick={() => p(String(g))} className={`text-xs font-black px-2.5 py-1 rounded-lg`} style={{
            background: `var(--muted)`,
            color: `var(--primary)`,
            ...J
          }}>{`Seluruh stok`}</button>]}</div>, <input type={`number`} inputMode={`decimal`} value={f} min={u} max={g} step={`any`} aria-label={`Jumlah ${product.name} (${c})`} onChange={e => p(e.target.value)} className={`w-full mb-3 text-center text-3xl font-black outline-none rounded-xl py-3`} style={{
          background: `var(--muted)`,
          border: `1.5px solid var(--border)`,
          color: `var(--foreground)`,
          fontFamily: `Plus Jakarta Sans, sans-serif`
        }} />, s && getAllowedUnits(s).length > 1 && <select aria-label={`Satuan pemakaian`} value={c} onChange={e => {
          l(e.target.value), p(``);
        }} className={`w-full rounded-xl px-3 py-2 mb-3`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`
        }}>{getAllowedUnits(s).map(e => <option key={e}>{e}</option>)}</select>, <input type={`range`} aria-label={`Geser jumlah ${product.name}`} min={0} max={g} step={`any`} value={y ? m : 0} onChange={e => v(parseFloat(e.target.value))} className={`w-full`} style={{
          accentColor: accentColor
        }} />, <div className={`flex justify-between mt-1`}>{[<span className={`text-[10px] font-semibold`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{`0`}</span>, <span className={`text-[10px] font-semibold`} style={{
            color: `var(--muted-foreground)`,
            ...J
          }}>{[g, ` `, c]}</span>]}</div>, f.trim() !== `` && !y && <p role={`alert`} className={`text-xs mt-2`} style={{
          color: `#B91C1C`
        }}>{[`Isi jumlah antara `, u, ` dan `, g, ` `, c, `, maksimal 4 angka di belakang koma.`]}</p>, y && c !== product.unit && <p className={`text-xs mt-2`} style={{
          color: `var(--muted-foreground)`
        }}>{[`Stok berkurang `, h, ` `, product.unit, `.`]}</p>]}</div>, onDelete ? <div className={`flex gap-2 items-stretch`}>{[<button onClick={onDelete} className={`px-4 py-3.5 rounded-xl font-bold text-sm shrink-0`} style={{
          background: `#FEF2F2`,
          color: `#EF4444`,
          border: `1px solid #FECACA`,
          ...J
        }}>{`Hapus Produk`}</button>, <button onClick={() => y && onSave(h)} disabled={!y} className={`flex-1 py-3.5 rounded-xl font-black text-sm`} style={{
          background: y ? accentColor : `var(--border)`,
          color: y ? `#fff` : `var(--muted-foreground)`,
          cursor: y ? `pointer` : `not-allowed`,
          ...J
        }}>{`Perbarui Produk`}</button>]}</div> : <button onClick={() => y && onSave(h)} disabled={!y} className={`w-full py-3.5 rounded-xl font-black text-sm`} style={{
        background: y ? accentColor : `var(--border)`,
        color: y ? `#fff` : `var(--muted-foreground)`,
        cursor: y ? `pointer` : `not-allowed`,
        ...J
      }}>{initialQty === void 0 ? `Tambah ke Daftar` : `Perbarui`}</button>]}</div>}</div>;
}
export { J, mr, hr, gr, _r, vr, yr, br, ActivityPage, ActivityList, ActivityCard, AdjustmentDetailPage, ActivityDetailPage, DeleteActivityConfirmModal, ActivityProductPicker, ActivityEntryForm, ActivityItemModal };
