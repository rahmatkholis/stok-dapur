// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { M, UNITS, _e, addMasterListValue, getUserData, j, removeMasterListValue, renameMasterListValue, saveItemMaster, setItemMasterActive } from "../lib/store.js";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { DraftChoiceModal } from "./InventoryPage.jsx";
var Yn = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  Xn = `0 2px 12px rgba(0,0,0,0.07)`;
function MasterDataPage({
  username: username,
  categories: categories,
  locations: locations,
  itemMasters: itemMasters,
  onRefresh: onRefresh,
  onBack: onBack,
  initialSection = `category`,
  initialItemName: initialItemName,
  onItemCreated: onItemCreated
}) {
  let l = (0, React.useRef)(null),
    [u, d] = (0, React.useState)(initialSection === `location` ? `location` : `category`),
    [f, p] = (0, React.useState)(initialSection === `item`),
    [m, h] = (0, React.useState)(null),
    [g, v] = (0, React.useState)(``),
    [y, b] = (0, React.useState)(``),
    [x, S] = (0, React.useState)(``),
    [C, w] = (0, React.useState)(``),
    [T, E] = (0, React.useState)(false),
    D = u === `category` ? categories : locations,
    O = u === `category` ? `Kategori Produk` : `Lokasi Penyimpanan`,
    k = m?.action === `delete` ? _e(username, u, m.name) : 0;
  function A(e, t = ``) {
    h({
      action: e,
      name: t
    }), v(e === `edit` ? t : ``), b(``), S(``), w(``);
  }
  function j() {
    if (!m || T) return;
    E(true);
    let t = m.action === `add` ? addMasterListValue(username, u, g) : m.action === `edit` ? renameMasterListValue(username, u, m.name, g) : removeMasterListValue(username, u, m.name, k && y || void 0);
    if (E(false), t) {
      S(t);
      return;
    }
    onRefresh(), h(null), w(m.action === `add` ? `${O} ditambahkan.` : m.action === `edit` ? `${O} diperbarui.` : `${O} dihapus.`);
  }
  return <div className={`min-h-screen pb-28 max-w-[480px] mx-auto`} style={{
    background: `var(--background)`,
    ...Yn
  }}>{[<div className={`sticky top-0 z-30 flex items-center gap-3 px-4 pb-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`
    }}>{[<button type={`button`} onClick={() => {
        l.current ? l.current() : onBack();
      }} aria-label={`Kembali`} className={`w-9 h-9 rounded-xl text-lg`} style={{
        background: `var(--muted)`
      }}>{`‹`}</button>, <h2 className={`text-base font-black`}>{`Data Master`}</h2>]}</div>, <div className={`px-4 pt-5`}>{[<div role={`group`} aria-label={`Jenis data master`} className={`grid grid-cols-3 gap-1 p-1 rounded-xl mb-5`} style={{
        background: `var(--muted)`
      }}>{[[`item`, `Item`], [`category`, `Kategori`], [`location`, `Lokasi`]].map(([e, t]) => <button type={`button`} aria-pressed={e === `item` ? f : !f && u === e} onClick={() => {
          e === `item` ? p(true) : (d(e), p(false)), h(null), w(``);
        }} className={`rounded-lg py-2.5 text-sm font-bold`} style={{
          background: (e === `item` ? f : !f && u === e) ? `var(--card)` : `transparent`,
          color: (e === `item` ? f : !f && u === e) ? `var(--foreground)` : `var(--muted-foreground)`,
          boxShadow: (e === `item` ? f : !f && u === e) ? `0 1px 4px rgba(0,0,0,0.08)` : void 0
        }} key={e}>{t}</button>)}</div>, f ? <ItemMasterPage username={username} items={itemMasters} categories={categories} onRefresh={onRefresh} initialName={initialItemName} onCreated={onItemCreated} onBack={onBack} registerBack={e => {
        l.current = e;
      }} /> : <jsxRuntime.Fragment>{[C && <p role={`status`} className={`rounded-xl p-3 text-sm font-semibold mb-4`} style={{
          background: `#DCFCE7`,
          color: `#166534`
        }}>{C}</p>, <div className={`flex items-center justify-between gap-3 mb-3`}>{[<div>{[<h3 className={`font-black text-base`}>{O}</h3>, <p className={`text-xs`} style={{
              color: `var(--muted-foreground)`
            }}>{[D.length, ` data`]}</p>]}</div>, <button type={`button`} onClick={() => A(`add`)} className={`rounded-xl px-3.5 py-2.5 text-sm font-bold text-white`} style={{
            background: `var(--primary)`
          }}>{`+ Tambah`}</button>]}</div>, <div className={`rounded-2xl overflow-hidden`} style={{
          background: `var(--card)`,
          boxShadow: Xn
        }}>{D.length ? D.map((t, n) => <div className={`flex items-center gap-2 px-4 py-3.5`} style={{
            borderTop: n ? `1px solid var(--border)` : void 0
          }} key={t}>{[<div className={`flex-1 min-w-0`}>{[<p className={`font-bold text-sm truncate`}>{t}</p>, <p className={`text-xs mt-0.5`} style={{
                color: `var(--muted-foreground)`
              }}>{_e(username, u, t) ? `Digunakan` : `Belum digunakan`}</p>]}</div>, <button type={`button`} onClick={() => A(`edit`, t)} aria-label={`Edit ${t}`} className={`px-2 py-2 text-xs font-bold`} style={{
              color: `var(--primary)`
            }}>{`Edit`}</button>, <button type={`button`} onClick={() => A(`delete`, t)} aria-label={`Hapus ${t}`} className={`px-2 py-2 text-xs font-bold`} style={{
              color: `#DC2626`
            }}>{`Hapus`}</button>]}</div>) : <p className={`p-6 text-center text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{`Belum ada lokasi. Tambahkan lokasi penyimpanan pertama.`}</p>}</div>]}</jsxRuntime.Fragment>]}</div>, !f && m && <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`
    }} onClick={e => {
      e.target === e.currentTarget && h(null);
    }}>{<div role={`dialog`} aria-modal={`true`} aria-labelledby={`master-dialog-title`} className={`w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 pb-8 flex flex-col gap-4`} style={{
        background: `var(--card)`
      }}>{[<div className={`flex items-center justify-between gap-3`}>{[<h3 id={`master-dialog-title`} className={`font-black text-lg`}>{m.action === `add` ? `Tambah ${O}` : m.action === `edit` ? `Edit ${O}` : `Hapus ${O}`}</h3>, <button type={`button`} onClick={() => h(null)} aria-label={`Tutup`} className={`w-8 h-8 rounded-full text-lg`} style={{
            background: `var(--muted)`
          }}>{`×`}</button>]}</div>, m.action === `delete` ? <jsxRuntime.Fragment>{[<p className={`text-sm`}>{[`Hapus `, <strong>{m.name}</strong>, ` dari daftar `, O.toLowerCase(), `?`]}</p>, k > 0 && u === `category` && <label className={`text-sm font-bold`}>{[`Pindahkan data terkait ke`, <select value={y} onChange={e => {
              b(e.target.value), S(``);
            }} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }}>{[<option value={``}>{`Pilih tujuan`}</option>, D.filter(e => e !== m.name).map(e => <option value={e} key={e}>{e}</option>)]}</select>]}</label>, k > 0 && u === `location` && <label className={`text-sm font-bold`}>{[`Pindahkan lokasi produk ke (opsional)`, <select value={y} onChange={e => {
              b(e.target.value), S(``);
            }} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }}>{[<option value={``}>{`Tidak dipindahkan — kosongkan lokasi`}</option>, D.filter(e => e !== m.name).map(e => <option value={e} key={e}>{e}</option>)]}</select>]}</label>, k > 0 && <p className={`text-sm`} style={{
            color: `var(--muted-foreground)`
          }}>{u === `location` ? `Jika tidak memilih tujuan, lokasi pada produk terkait akan dikosongkan. Stok dan riwayat aktivitas tetap tersimpan.` : `Stok, belanja, resep, dan data terkait akan diperbarui. Riwayat aktivitas tetap tersimpan.`}</p>]}</jsxRuntime.Fragment> : <label className={`text-sm font-bold`}>{[`Nama `, O.toLowerCase(), <input type={`text`} autoFocus={true} maxLength={60} value={g} onChange={e => {
            v(e.target.value), S(``);
          }} onKeyDown={e => {
            e.key === `Enter` && j();
          }} placeholder={u === `category` ? `Contoh: Bahan Segar` : `Contoh: Kulkas atas`} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm outline-none`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`
          }} />]}</label>, x && <p role={`alert`} className={`rounded-xl p-3 text-sm font-semibold`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{x}</p>, <button type={`button`} onClick={j} disabled={T || m.action === `delete` && u === `category` && D.length === 1} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
          background: m.action === `delete` ? `#DC2626` : `var(--primary)`
        }}>{m.action === `delete` ? `Ya, hapus` : `Simpan`}</button>, m.action === `delete` && u === `category` && D.length === 1 && <p className={`text-xs text-center`} style={{
          color: `var(--muted-foreground)`
        }}>{`Sisakan minimal satu kategori.`}</p>]}</div>}</div>]}</div>;
}
function Qn(e) {
  return Jt(e) && [`name`, `category`, `unit`, `packageUnit`, `packageSize`, `packageSizeUnit`].every(t => typeof e[t] == `string`);
}
function ItemMasterPage({
  username: username,
  items: items,
  categories: categories,
  onRefresh: onRefresh,
  initialName: initialName,
  onCreated: onCreated,
  onBack: onBack,
  registerBack: registerBack
}) {
  let [c, l] = (0, React.useState)(null),
    [u, d] = (0, React.useState)(null),
    [f, p] = (0, React.useState)(``),
    [m, h] = (0, React.useState)(categories[0] ?? ``),
    [g, v] = (0, React.useState)(UNITS[0]),
    [y, x] = (0, React.useState)(``),
    [S, C] = (0, React.useState)(``),
    [w, T] = (0, React.useState)(`gram`),
    [E, D] = (0, React.useState)(``),
    [O, k] = (0, React.useState)(``),
    [A, N] = (0, React.useState)(false),
    [P, F] = (0, React.useState)(null),
    I = (u === `add` || u === `edit`) && (f !== (c?.name ?? ``) || m !== (c?.category ?? categories[0] ?? ``) || g !== (c?.unit ?? UNITS[0]) || y !== (c?.packageUnit ?? ``) || S !== String(c?.packageSize ?? ``) || w !== (c?.packageSizeUnit ?? `gram`)),
    {
      clearDraft: L,
      storageFailed: ee
    } = Yt(username, `master:item:${c?.id ?? `new`}`, {
      name: f,
      category: m,
      unit: g,
      packageUnit: y,
      packageSize: S,
      packageSizeUnit: w
    }, I, u === `add` || u === `edit`, c ? JSON.stringify(c) : ``);
  function R(e) {
    I ? F(() => e) : e();
  }
  (0, React.useEffect)(() => (registerBack(() => R(onBack)), () => registerBack(null)), [I, onBack, registerBack]);
  let z = items.filter(e => e.name.toLocaleLowerCase(`id-ID`).includes(O.toLocaleLowerCase(`id-ID`))).sort((e, t) => Number(t.active) - Number(e.active) || e.name.localeCompare(t.name, `id-ID`)),
    B = getUserData(username),
    V = !!c && [...B.products, ...Object.values(B.productArchive ?? {}), ...B.shoppingItems, ...(B.recipes ?? []).flatMap(e => e.ingredients)].some(e => e.itemId === c.id);
  (0, React.useEffect)(() => {
    onCreated && H(`add`);
  }, []);
  function H(t, r = null) {
    let a = t === `add` || t === `edit` ? Gt(username, `master:item:${r?.id ?? `new`}`, Qn, r ? JSON.stringify(r) : ``) : null;
    l(r), d(t), p(a?.name ?? r?.name ?? initialName ?? ``), h(a?.category ?? r?.category ?? categories[0] ?? ``), v(a?.unit ?? r?.unit ?? UNITS[0]), x(a?.packageUnit ?? r?.packageUnit ?? ``), C(a?.packageSize ?? String(r?.packageSize ?? ``)), T(a?.packageSizeUnit ?? r?.packageSizeUnit ?? `gram`), N(!!a), D(``);
  }
  function U() {
    if (!u) return;
    let n = u === `add` || u === `edit` ? saveItemMaster(username, {
      name: f,
      category: m,
      unit: g,
      packageUnit: y || void 0,
      packageSize: y ? Number(S) : void 0,
      packageSizeUnit: y ? w : void 0
    }, c?.id) : setItemMasterActive(username, c.id, u === `activate`);
    if (n) {
      D(n);
      return;
    }
    L();
    let i = u === `add` ? getUserData(username).itemMasters?.find(e => !items.some(t => t.id === e.id)) : void 0;
    onRefresh(), d(null), i && onCreated?.(i);
  }
  return <jsxRuntime.Fragment>{[<div className={`flex items-center justify-between gap-3 mb-3`}>{[<div>{[<h3 className={`font-black text-base`}>{`Master Item`}</h3>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`
        }}>{[items.filter(e => e.active).length, ` aktif · `, items.filter(e => !e.active).length, ` arsip`]}</p>]}</div>, <button type={`button`} onClick={() => H(`add`)} className={`rounded-xl px-3.5 py-2.5 text-sm font-bold text-white`} style={{
        background: `var(--primary)`
      }}>{`+ Tambah`}</button>]}</div>, <input type={`search`} value={O} onChange={e => k(e.target.value)} placeholder={`Cari item...`} aria-label={`Cari item master`} className={`w-full rounded-xl px-4 py-2.5 text-sm mb-3 outline-none`} style={{
      background: `var(--muted)`,
      border: `1px solid var(--border)`
    }} />, <div className={`rounded-2xl overflow-hidden`} style={{
      background: `var(--card)`,
      boxShadow: Xn
    }}>{z.length ? z.map((e, t) => <div className={`px-4 py-3.5 flex items-center gap-2`} style={{
        borderTop: t ? `1px solid var(--border)` : void 0
      }} key={e.id}>{[<div className={`flex-1 min-w-0`}>{[<p className={`font-bold text-sm truncate`}>{e.name}</p>, <p className={`text-xs mt-0.5`} style={{
            color: `var(--muted-foreground)`
          }}>{[e.category, ` · `, e.unit, e.packageUnit ? ` · 1 ${e.packageUnit} = ${e.packageSize} ${e.packageSizeUnit}` : ``, e.active ? `` : ` · Diarsipkan`]}</p>]}</div>, e.active && <button type={`button`} onClick={() => H(`edit`, e)} className={`px-1.5 py-2 text-xs font-bold`} style={{
          color: `var(--primary)`
        }}>{`Edit`}</button>, <button type={`button`} onClick={() => H(e.active ? `archive` : `activate`, e)} className={`px-1.5 py-2 text-xs font-bold`} style={{
          color: e.active ? `#B91C1C` : `#15803D`
        }}>{e.active ? `Arsipkan` : `Aktifkan`}</button>]}</div>) : <p className={`p-6 text-center text-sm`} style={{
        color: `var(--muted-foreground)`
      }}>{`Belum ada item yang sesuai.`}</p>}</div>, u && <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.45)`
    }} onClick={e => {
      e.target === e.currentTarget && R(() => d(null));
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={u === `add` ? `Tambah Master Item` : u === `edit` ? `Edit Master Item` : u === `archive` ? `Arsipkan Item` : `Aktifkan Item`} className={`w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 pb-8 flex flex-col gap-4`} style={{
        background: `var(--card)`
      }}>{[<div className={`flex justify-between items-center`}>{[<h3 className={`font-black text-lg`}>{u === `add` ? `Tambah Item` : u === `edit` ? `Edit Item` : u === `archive` ? `Arsipkan Item` : `Aktifkan Item`}</h3>, <button type={`button`} onClick={() => R(() => d(null))} aria-label={`Tutup`} className={`w-8 h-8 rounded-full text-lg`} style={{
            background: `var(--muted)`
          }}>{`×`}</button>]}</div>, u === `add` || u === `edit` ? <jsxRuntime.Fragment>{[<DraftRestoreNotice restored={A} storageFailed={ee} />, <label className={`text-sm font-bold`}>{[`Nama Item`, <input value={f} maxLength={80} onChange={e => p(e.target.value)} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }} />]}</label>, <label className={`text-sm font-bold`}>{[`Kategori`, <select value={m} onChange={e => h(e.target.value)} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }}>{categories.map(e => <option value={e} key={e}>{e}</option>)}</select>]}</label>, <label className={`text-sm font-bold`}>{[`Satuan dasar`, <select value={g} disabled={u === `edit` && V} onChange={e => v(e.target.value)} className={`w-full mt-2 px-4 py-3 rounded-xl text-sm`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }}>{UNITS.map(e => <option value={e} key={e}>{e}</option>)}</select>]}</label>, u === `edit` && V && <p className={`text-xs`} style={{
            color: `var(--muted-foreground)`
          }}>{`Satuan dikunci karena item sudah digunakan oleh stok, belanja, atau resep.`}</p>, <div className={`rounded-xl p-3 space-y-2`} style={{
            background: `var(--muted)`
          }}>{[<p className={`text-sm font-bold`}>{`Isi kemasan (opsional)`}</p>, <p className={`text-xs`} style={{
              color: `var(--muted-foreground)`
            }}>{`Isi hanya jika ingin mencatat botol/bungkus sekaligus gram atau ml. Contoh: 1 botol = 1000 ml. Ukuran kemasan yang sudah dipakai tidak bisa diubah.`}</p>, <select aria-label={`Satuan kemasan`} value={y} disabled={!!c?.packageUnit && V} onChange={e => x(e.target.value)} className={`w-full px-3 py-2 rounded-xl text-sm`}>{[<option value={``}>{`Tanpa konversi kemasan`}</option>, j.map(e => <option key={e}>{e}</option>)]}</select>, y && <div className={`flex gap-2 items-center`}>{[<span className={`text-xs shrink-0`}>{[`1 `, y, ` =`]}</span>, <input aria-label={`Isi per kemasan`} type={`number`} min={`0.0001`} step={`any`} value={S} disabled={!!c?.packageUnit && V} onChange={e => C(e.target.value)} className={`w-24 min-w-0 px-2 py-2 rounded-xl text-sm`} />, <select aria-label={`Satuan isi kemasan`} value={w} disabled={!!c?.packageUnit && V} onChange={e => T(e.target.value)} className={`min-w-0 flex-1 px-2 py-2 rounded-xl text-sm`}>{M.map(e => <option key={e}>{e}</option>)}</select>]}</div>]}</div>, <p className={`text-xs`} style={{
            color: `var(--muted-foreground)`
          }}>{`Jumlah, kedaluwarsa, dan lokasi diisi saat stok diterima.`}</p>]}</jsxRuntime.Fragment> : <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{u === `archive` ? `Item ${c?.name} tidak akan muncul untuk pencatatan baru. Riwayatnya tetap tersimpan.` : `Item ${c?.name} akan tersedia lagi untuk pencatatan baru.`}</p>, E && <p role={`alert`} className={`rounded-xl p-3 text-sm`} style={{
          color: `#B91C1C`,
          background: `#FEF2F2`
        }}>{E}</p>, <button type={`button`} onClick={U} className={`w-full py-3.5 rounded-xl text-sm font-black text-white`} style={{
          background: u === `archive` ? `#DC2626` : `var(--primary)`
        }}>{u === `archive` ? `Ya, arsipkan` : u === `activate` ? `Aktifkan` : `Simpan`}</button>]}</div>}</div>, P && <DraftChoiceModal onContinue={() => F(null)} onDiscard={() => {
      L(), P(), F(null);
    }} />]}</jsxRuntime.Fragment>;
}
export { Yn, Xn, MasterDataPage, Qn, ItemMasterPage };
