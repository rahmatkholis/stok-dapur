// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { convertItemUnit, describeExpiry, getAllowedUnits, getUserData, rt } from "../lib/store.js";
import { PhysicalStockConfirmModal } from "./PhysicalStockConfirmModal.jsx";
var kt = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  At = e => Math.round(e * 1e4) / 1e4,
  jt = 1e-4;
function Mt() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function StockAdjustmentModal({
  username: username,
  product: product,
  onSave: onSave,
  onClose: onClose
}) {
  let i = getUserData(username).itemMasters?.find(e => e.id === product.itemId),
    [a, o] = (0, React.useState)(product.unit),
    s = Math.min(product.quantity, product.unit === `kg` || product.unit === `liter` ? .1 : 1),
    [c, l] = (0, React.useState)(String(At(s))),
    [u, d] = (0, React.useState)(``),
    [f, p] = (0, React.useState)(Mt()),
    [m, h] = (0, React.useState)(``),
    [g, v] = (0, React.useState)(false),
    [y, b] = (0, React.useState)(null),
    x = Number(c),
    S = i && c.trim() && Number.isFinite(x) ? convertItemUnit(x, a, product.unit, i) : x,
    C = i ? convertItemUnit(product.quantity, product.unit, a, i) : product.quantity,
    T = c.trim() !== `` && Number.isFinite(x) && x >= jt && S >= jt && S <= product.quantity && At(x) === x && Math.abs((i ? convertItemUnit(S, product.unit, a, i) : S) - x) <= 5e-5;
  function E() {
    if (g) return;
    if (!T) {
      h(`Isi jumlah antara ${jt} dan ${product.quantity} ${product.unit}, maksimal 4 angka di belakang koma.`);
      return;
    }
    if (!u.trim()) {
      h(`Isi alasan pembuangan.`);
      return;
    }
    if (!f || f > Mt()) {
      h(`Pilih tanggal hari ini atau sebelumnya.`);
      return;
    }
    let r = rt(username, [{
      ...product,
      quantity: S
    }], f);
    if (r.length) {
      b(r);
      return;
    }
    v(true);
    let i = onSave(S, u.trim(), f);
    i && (h(i), v(false));
  }
  return <div className={`fixed inset-0 z-[60] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.45)`,
    backdropFilter: `blur(3px)`
  }} onClick={e => {
    e.target === e.currentTarget && onClose();
  }}>{[<div role={`dialog`} aria-modal={`true`} aria-labelledby={`waste-title`} className={`w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4`} style={{
      background: `var(--card)`,
      ...kt
    }}>{[<div className={`w-10 h-1 rounded-full mx-auto`} style={{
        background: `var(--border)`
      }} />, <div className={`flex items-start justify-between gap-3`}>{[<div>{[<h2 id={`waste-title`} className={`font-black text-lg`} style={{
            color: `var(--foreground)`
          }}>{`Buang stok`}</h2>, <p className={`text-sm font-bold mt-1`} style={{
            color: `var(--foreground)`
          }}>{product.name}</p>, <p className={`text-xs mt-1`} style={{
            color: `var(--muted-foreground)`
          }}>{[describeExpiry(product), ` · `, product.location || `Lokasi tidak diisi`]}</p>]}</div>, <button type={`button`} onClick={onClose} aria-label={`Tutup`} className={`w-8 h-8 rounded-full text-lg shrink-0`} style={{
          background: `var(--muted)`,
          color: `var(--muted-foreground)`
        }}>{`×`}</button>]}</div>, <div className={`rounded-xl px-4 py-3 flex items-center justify-between`} style={{
        background: `var(--muted)`
      }}>{[<span className={`text-sm font-bold`} style={{
          color: `var(--muted-foreground)`
        }}>{`Stok tersedia`}</span>, <strong className={`text-sm`} style={{
          color: `var(--foreground)`
        }}>{[product.quantity, ` `, product.unit]}</strong>]}</div>, <div>{[<div className={`flex items-center justify-between gap-3 mb-2`}>{[<label htmlFor={`waste-quantity`} className={`font-bold text-sm`} style={{
            color: `var(--foreground)`
          }}>{[`Jumlah dibuang (`, a, `)`]}</label>, <button type={`button`} onClick={() => {
            l(String(C)), h(``);
          }} className={`text-xs font-black px-2.5 py-1 rounded-lg`} style={{
            background: `#FEF2F2`,
            color: `#B91C1C`
          }}>{`Seluruh stok`}</button>]}</div>, <input id={`waste-quantity`} type={`number`} inputMode={`decimal`} min={jt} max={C} step={`any`} value={c} onChange={e => {
          l(e.target.value), h(``);
        }} className={`w-full text-center text-3xl font-black outline-none rounded-xl py-3 mb-3`} style={{
          background: `var(--muted)`,
          border: `1.5px solid var(--border)`,
          color: `var(--foreground)`,
          ...kt
        }} />, i && getAllowedUnits(i).length > 1 && <select aria-label={`Satuan pembuangan`} value={a} onChange={e => {
          o(e.target.value), l(``), h(``);
        }} className={`w-full rounded-xl px-3 py-2 mb-3`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`
        }}>{getAllowedUnits(i).map(e => <option key={e}>{e}</option>)}</select>, <input type={`range`} aria-label={`Geser jumlah ${product.name} yang dibuang`} min={0} max={C} step={`any`} value={T ? x : 0} onChange={e => {
          l(String(Math.max(jt, At(Number(e.target.value))))), h(``);
        }} className={`w-full`} style={{
          accentColor: `#DC2626`
        }} />, <div className={`flex justify-between text-xs mt-1`} style={{
          color: `var(--muted-foreground)`
        }}>{[<span>{`0`}</span>, <span>{[C, ` `, a]}</span>]}</div>, T && a !== product.unit && <p className={`text-xs mt-1`} style={{
          color: `var(--muted-foreground)`
        }}>{[`Stok berkurang `, S, ` `, product.unit, `.`]}</p>]}</div>, <label className={`font-bold text-sm`} style={{
        color: `var(--foreground)`
      }}>{[`Alasan pembuangan`, <input type={`text`} value={u} onChange={e => {
          d(e.target.value), h(``);
        }} placeholder={`Contoh: kedaluwarsa, rusak, bau...`} maxLength={120} className={`w-full rounded-xl px-4 py-3 mt-2 outline-none text-sm`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`,
          color: `var(--foreground)`,
          ...kt
        }} />]}</label>, <label className={`font-bold text-sm`} style={{
        color: `var(--foreground)`
      }}>{[`Tanggal pembuangan`, <input type={`date`} value={f} max={Mt()} onChange={e => {
          p(e.target.value), h(``);
        }} className={`w-full rounded-xl px-4 py-3 mt-2 outline-none text-sm`} style={{
          background: `var(--muted)`,
          border: `1px solid var(--border)`,
          color: `var(--foreground)`,
          ...kt
        }} />]}</label>, m && <p role={`alert`} className={`rounded-xl px-3 py-2 text-sm font-semibold`} style={{
        background: `#FEF2F2`,
        color: `#B91C1C`
      }}>{m}</p>, <p className={`text-xs`} style={{
        color: `var(--muted-foreground)`
      }}>{`Jumlah ini akan dikurangi dari stok dan dicatat sebagai satu aktivitas pembuangan.`}</p>, <button type={`button`} onClick={E} disabled={g} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-60`} style={{
        background: `#DC2626`
      }}>{g ? `Menyimpan...` : `Buang ${T ? x : ``} ${a}`}</button>]}</div>, y && <PhysicalStockConfirmModal conflicts={y} onClose={() => b(null)} onSave={e => onSave(S, u.trim(), f, e)} />]}</div>;
}
export { kt, At, jt, Mt, StockAdjustmentModal };
