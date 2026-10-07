// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { getAllowedUnits } from "../lib/store.js";
import { ItemPicker } from "./ItemPicker.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
function Mn(e) {
  return Jt(e) && typeof e.title == `string` && Array.isArray(e.rows) && e.rows.every(e => Jt(e) && [`id`, `quantity`, `note`].every(t => typeof e[t] == `string`) && (e.itemId === void 0 || typeof e.itemId == `string`) && (e.unit === void 0 || typeof e.unit == `string`));
}
var Nn = {
    width: `100%`,
    padding: `10px 14px`,
    borderRadius: 10,
    border: `1.5px solid var(--border)`,
    background: `var(--muted)`,
    color: `var(--foreground)`,
    fontSize: 14,
    outline: `none`,
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  Pn = () => ({
    id: crypto.randomUUID(),
    itemId: void 0,
    quantity: ``,
    note: ``
  });
function ShoppingActivityModal({
  username: username,
  itemMasters: itemMasters,
  onOpenMasterItem: onOpenMasterItem,
  onSave: onSave,
  onClose: onClose
}) {
  let [a] = (0, React.useState)(() => Gt(username, `shopping:new`, Mn)),
    [o, s] = (0, React.useState)(a?.title ?? ``),
    [c, l] = (0, React.useState)(() => a?.rows ?? [Pn()]),
    [u, d] = (0, React.useState)(``),
    [f, p] = (0, React.useState)(false),
    m = !!o.trim() || c.length !== 1 || c.some(e => !!e.itemId || !!e.quantity.trim() || !!e.note.trim()),
    {
      clearDraft: h,
      storageFailed: g
    } = Yt(username, `shopping:new`, {
      title: o,
      rows: c
    }, m);
  function v(e, t) {
    l(n => n.map(n => n.id === e ? {
      ...n,
      ...t
    } : n)), d(``);
  }
  function y() {
    m ? p(true) : onClose();
  }
  function b(e) {
    if (e.preventDefault(), !o.trim()) {
      d(`Isi nama aktivitas belanja.`);
      return;
    }
    if (!c.length) {
      d(`Tambahkan minimal satu item belanja.`);
      return;
    }
    let t = onSave(o, c.map(e => ({
      itemId: e.itemId,
      quantity: Number(e.quantity),
      unit: e.unit,
      note: e.note.trim() || void 0
    })));
    t ? d(t) : h();
  }
  return <div className={`fixed inset-0 z-[45] overflow-y-auto`} style={{
    background: `var(--background)`
  }}>{[<form onSubmit={b} className={`max-w-[480px] mx-auto min-h-screen flex flex-col`} style={{
      background: `var(--background)`
    }}>{[<div className={`sticky top-0 z-10 flex items-center gap-3 px-4 pb-3`} style={{
        background: `var(--card)`,
        boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
        paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`
      }}>{[<button type={`button`} onClick={y} aria-label={`Kembali ke daftar belanja`} className={`w-9 h-9 rounded-xl text-lg`} style={{
          background: `var(--muted)`
        }}>{`‹`}</button>, <h2 className={`font-black text-base`}>{`Tambah Belanja`}</h2>]}</div>, <div className={`px-4 pt-5 pb-8 flex-1 space-y-5`}>{[<DraftRestoreNotice restored={!!a} storageFailed={g} />, <div className={`rounded-2xl p-4`} style={{
          background: `var(--card)`,
          boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
        }}>{<label className={`block text-sm font-bold`}>{[`Nama Belanja *`, <input autoFocus={true} maxLength={80} value={o} onChange={e => {
              s(e.target.value), d(``);
            }} placeholder={`Contoh: Belanja Mingguan`} className={`mt-2`} style={Nn} />]}</label>}</div>, <section>{[<div className={`flex items-center justify-between mb-3`}>{[<h3 className={`font-black text-base`}>{[`Item Belanja `, <span className={`text-sm`} style={{
                color: `var(--muted-foreground)`
              }}>{[`(`, c.length, `)`]}</span>]}</h3>, <button type={`button`} onClick={() => {
              l(e => [...e, Pn()]), d(``);
            }} className={`text-sm font-bold`} style={{
              color: `var(--primary)`
            }}>{`+ Tambah Item`}</button>]}</div>, c.length ? <div className={`space-y-3`}>{c.map((e, r) => {
              let i = itemMasters.find(t => t.id === e.itemId);
              return <div className={`rounded-2xl p-4 space-y-3`} style={{
                background: `var(--card)`,
                boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
              }} key={e.id}>{[<div className={`flex justify-between items-center`}>{[<strong className={`text-sm`}>{[`Item `, r + 1]}</strong>, <button type={`button`} onClick={() => {
                    l(t => t.filter(t => t.id !== e.id)), d(``);
                  }} className={`text-xs font-bold`} style={{
                    color: `#B91C1C`
                  }}>{`Hapus Item`}</button>]}</div>, <ItemPicker items={itemMasters} value={e.itemId} onAddItem={t => onOpenMasterItem(t => v(e.id, {
                  itemId: t.id,
                  unit: t.unit
                }), t)} onSelect={t => v(e.id, {
                  itemId: t?.id,
                  unit: t?.unit,
                  quantity: ``
                })} label={`Nama Item *`} style={Nn} />, <div className={`grid grid-cols-2 gap-3`}>{[<label className={`text-xs font-bold`}>{[`Jumlah rencana *`, <input type={`number`} min={`0.0001`} step={`any`} value={e.quantity} onChange={t => v(e.id, {
                      quantity: t.target.value
                    })} className={`mt-1`} style={Nn} />]}</label>, <label className={`text-xs font-bold`}>{[`Satuan`, <select disabled={!i} value={e.unit ?? i?.unit ?? ``} onChange={t => v(e.id, {
                      unit: t.target.value,
                      quantity: ``
                    })} className={`mt-1`} style={Nn}>{i ? getAllowedUnits(i).map(e => <option key={e}>{e}</option>) : <option value={``}>{`Pilih item`}</option>}</select>]}</label>]}</div>, <label className={`block text-xs font-bold`}>{[`Catatan`, <input value={e.note} onChange={t => v(e.id, {
                    note: t.target.value
                  })} placeholder={`Opsional`} className={`mt-1`} style={Nn} />]}</label>]}</div>;
            })}</div> : <p className={`rounded-2xl p-5 text-sm text-center`} style={{
            background: `var(--card)`,
            color: `var(--muted-foreground)`
          }}>{`Belum ada item belanja.`}</p>]}</section>]}</div>, <div className={`sticky bottom-0 px-4 pt-3`} style={{
        background: `var(--card)`,
        boxShadow: `0 -2px 12px rgba(0,0,0,0.06)`,
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 16px)`
      }}>{[u && <p role={`alert`} className={`rounded-xl p-3 mb-3 text-sm`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{u}</p>, <button type={`submit`} className={`w-full py-3.5 rounded-xl text-sm font-black text-white`} style={{
          background: `var(--primary)`
        }}>{`Simpan Belanja`}</button>]}</div>]}</form>, f && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,0.52)`
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Belanja belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={{
        background: `var(--card)`
      }}>{[<h3 className={`text-lg font-black`}>{`Belanja belum disimpan`}</h3>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{`Nama dan item belanja yang sudah diisi akan hilang jika kamu keluar.`}</p>, <button type={`button`} onClick={() => p(false)} className={`w-full py-3.5 rounded-xl text-sm font-black text-white`} style={{
          background: `var(--primary)`
        }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={() => {
          h(), onClose();
        }} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
          color: `#B91C1C`,
          background: `var(--muted)`
        }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>]}</div>;
}
export { Mn, Nn, Pn, ShoppingActivityModal };
