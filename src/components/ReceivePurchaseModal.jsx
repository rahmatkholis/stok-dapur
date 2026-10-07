// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { convertItemUnit, getAllowedUnits } from "../lib/store.js";
import { ExpiryFields } from "./ExpiryFields.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { DraftChoiceModal } from "../pages/InventoryPage.jsx";
function kn(e) {
  return Jt(e) && [`quantity`, `unit`, `expiryDate`, `location`, `receivedDate`].every(t => typeof e[t] == `string`) && [`package`, `estimated`, `unknown`].includes(String(e.expiryKind));
}
function An() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function ReceivePurchaseModal({
  username: username,
  item: item,
  master: master,
  alreadyReceived: alreadyReceived,
  locations: locations,
  suggestedLocation: suggestedLocation,
  onSave: onSave,
  onClose: onClose
}) {
  let c = Math.max(0, Math.round((item.quantity - alreadyReceived) * 1e4) / 1e4),
    l = `shopping:receive:${item.id}`,
    u = JSON.stringify(item),
    [d] = (0, React.useState)(() => Gt(username, l, kn, u)),
    [f] = (0, React.useState)(suggestedLocation && locations.includes(suggestedLocation) ? suggestedLocation : ``),
    [p] = (0, React.useState)(An()),
    [m, h] = (0, React.useState)(d?.quantity ?? String(c)),
    [g, v] = (0, React.useState)(d?.unit ?? item.unit),
    [y, b] = (0, React.useState)(d?.expiryKind ?? `package`),
    [x, S] = (0, React.useState)(d?.expiryDate ?? ``),
    [C, w] = (0, React.useState)(d?.location ?? f),
    [T, E] = (0, React.useState)(d?.receivedDate ?? p),
    D = m !== String(c) || g !== item.unit || y !== `package` || !!x || C !== f || T !== p,
    {
      clearDraft: O,
      storageFailed: k
    } = Yt(username, l, {
      quantity: m,
      unit: g,
      expiryKind: y,
      expiryDate: x,
      location: C,
      receivedDate: T
    }, D, true, u),
    [A, j] = (0, React.useState)(false);
  function M() {
    D ? j(true) : onClose();
  }
  let [F, I] = (0, React.useState)(``),
    [L, ee] = (0, React.useState)(false),
    R = Number(m),
    z = m.trim() !== `` && Number.isFinite(R) && R >= 1e-4 && Math.round(R * 1e4) / 1e4 === R,
    B = z && master ? convertItemUnit(R, g, item.unit, master) : R,
    V = z ? Math.max(0, Math.round((c - B) * 1e4) / 1e4) : c;
  function H(e) {
    if (e.preventDefault(), L) return;
    if (!z) {
      I(`Isi jumlah yang dibeli, maksimal 4 angka di belakang koma.`);
      return;
    }
    if (y !== `unknown` && !x) {
      I(`Isi tanggal kemasan atau perkiraan, atau pilih Belum tahu.`);
      return;
    }
    if (!T || T > An()) {
      I(`Tanggal dibeli harus hari ini atau sebelumnya.`);
      return;
    }
    ee(true);
    let n = onSave({
      itemId: item.itemId,
      name: item.name,
      category: item.category,
      unit: g,
      quantity: R,
      expiryKind: y,
      expiryDate: y === `unknown` ? `` : x,
      location: C || void 0,
      receivedDate: T
    });
    n ? (I(n), ee(false)) : O();
  }
  return <div className={`fixed inset-0 z-[65] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,0.48)`
  }} onClick={e => {
    e.target === e.currentTarget && M();
  }}>{[<div role={`dialog`} aria-modal={`true`} aria-label={`Catat barang yang dibeli`} className={`w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 pb-8`} style={{
      background: `var(--card)`
    }}>{[<div className={`flex justify-between items-center gap-3 mb-3`}>{[<h2 className={`font-black text-lg`}>{`Catat yang dibeli`}</h2>, <button type={`button`} onClick={M} aria-label={`Tutup`} className={`text-xl px-2`}>{`×`}</button>]}</div>, <p className={`font-bold text-sm`}>{item.name}</p>, <p className={`text-xs mb-4`} style={{
        color: `var(--muted-foreground)`
      }}>{[item.category, ` · `, item.unit, ` · sisa rencana `, c, ` `, item.unit]}</p>, <form onSubmit={H} className={`space-y-4`}>{[<DraftRestoreNotice restored={!!d} storageFailed={k} />, <label className={`block text-sm font-bold`}>{[`Jumlah yang dibeli (`, g, `)`, <input type={`number`} inputMode={`decimal`} min={`0.0001`} step={`any`} value={m} onChange={e => {
            h(e.target.value), I(``);
          }} className={`w-full rounded-xl px-4 py-3 mt-2`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`
          }} />]}</label>, master && getAllowedUnits(master).length > 1 && <label className={`block text-sm font-bold`}>{[`Satuan`, <select aria-label={`Satuan pembelian`} value={g} onChange={e => {
            v(e.target.value), h(``), I(``);
          }} className={`w-full rounded-xl px-4 py-3 mt-2`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`
          }}>{getAllowedUnits(master).map(e => <option key={e}>{e}</option>)}</select>]}</label>, <ExpiryFields kind={y} date={x} onKindChange={e => {
          b(e), e === `unknown` && S(``), I(``);
        }} onDateChange={e => {
          S(e), I(``);
        }} />, <label className={`block text-sm font-bold`}>{[`Lokasi penyimpanan (opsional)`, <select value={C} onChange={e => w(e.target.value)} className={`w-full rounded-xl px-4 py-3 mt-2`} style={{
            background: `var(--muted)`,
            border: `1px solid var(--border)`
          }}>{[<option value={``}>{`Tanpa lokasi`}</option>, locations.map(e => <option value={e} key={e}>{e}</option>)]}</select>]}</label>, <details className={`text-sm`}>{[<summary className={`font-bold cursor-pointer`}>{`Ubah tanggal dibeli`}</summary>, <label className={`block mt-2`}>{[`Tanggal stok mulai tersedia`, <input type={`date`} value={T} max={An()} onChange={e => {
              E(e.target.value), I(``);
            }} className={`w-full rounded-xl px-4 py-3 mt-2`} style={{
              background: `var(--muted)`,
              border: `1px solid var(--border)`
            }} />]}</label>]}</details>, <p className={`rounded-xl p-3 text-sm`} style={{
          background: `var(--muted)`
        }}>{z ? `Tambah ${B} ${item.unit} ke stok · sisa rencana ${V} ${item.unit}` : `Isi jumlah yang dibeli untuk melihat perubahan stok.`}</p>, F && <p role={`alert`} className={`rounded-xl p-3 text-sm`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{F}</p>, <button type={`submit`} disabled={L || !z} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
          background: `var(--primary)`
        }}>{L ? `Menyimpan...` : `Simpan Pembelian & Stok`}</button>]}</form>]}</div>, A && <DraftChoiceModal onContinue={() => j(false)} onDiscard={() => {
      O(), onClose();
    }} />]}</div>;
}
export { kn, An, ReceivePurchaseModal };
