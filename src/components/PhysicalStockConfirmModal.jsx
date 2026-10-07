// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { describeExpiry } from "../lib/store.js";
function PhysicalStockConfirmModal({
  conflicts: conflicts,
  onSave: onSave,
  onClose: onClose
}) {
  let [r, i] = (0, React.useState)({}),
    [a, o] = (0, React.useState)(``),
    [s, c] = (0, React.useState)(false);
  return <div className={`fixed inset-0 z-[85] flex items-end justify-center`} style={{
    background: `rgba(0,0,0,.5)`
  }}>{<form role={`dialog`} aria-modal={`true`} aria-labelledby={`confirm-physical-title`} className={`w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 pb-8 space-y-4`} style={{
      background: `var(--card)`
    }} onSubmit={n => {
      if (n.preventDefault(), s) return;
      if (conflicts.some(e => !r[e.product.id]?.trim() || !Number.isFinite(Number(r[e.product.id])) || Number(r[e.product.id]) < 0)) {
        o(`Isi jumlah fisik sekarang untuk setiap stok, minimal 0.`);
        return;
      }
      c(true);
      let i = onSave(conflicts.map(e => ({
        productId: e.product.id,
        adjustmentId: e.adjustmentId,
        expectedQuantity: e.product.quantity,
        quantity: Number(r[e.product.id])
      })));
      i && (o(i), c(false));
    }}>{[<h2 id={`confirm-physical-title`} className={`text-lg font-black`}>{`Konfirmasi stok fisik sekarang`}</h2>, <p className={`text-sm`}>{`Stok ini sudah pernah dihitung ulang. Koreksi catatan lama dapat mengubah hasilnya. Periksa jumlah yang benar-benar masih ada sebelum menyimpan.`}</p>, conflicts.map(e => <div className={`rounded-xl p-4 space-y-2`} style={{
        background: `var(--muted)`
      }} key={e.product.id}>{[<strong>{e.product.name}</strong>, <p className={`text-xs`}>{[describeExpiry(e.product), ` · `, e.product.location || `Lokasi tidak diisi`]}</p>, <p className={`text-sm`}>{[`Tercatat sekarang: `, e.product.quantity, ` `, e.product.unit]}</p>, <p className={`text-sm`}>{[`Hasil koreksi sebelum hitung ulang: `, e.projectedQuantity, ` `, e.product.unit]}</p>, <label className={`block text-sm font-bold`}>{[`Jumlah fisik sekarang (`, e.product.unit, `)`, <input required={true} type={`number`} min={`0`} step={`0.0001`} inputMode={`decimal`} value={r[e.product.id] ?? ``} onChange={t => i(n => ({
            ...n,
            [e.product.id]: t.target.value
          }))} className={`w-full mt-2 p-3 rounded-xl border`} style={{
            background: `var(--card)`
          }} />]}</label>]}</div>), <p className={`text-xs`}>{`Jumlah akhir mengikuti konfirmasi ini. Selisih penyesuaian dicatat di Aktivitas bersama koreksi.`}</p>, a && <p role={`alert`} className={`text-sm text-red-700`}>{a}</p>, <button disabled={s} type={`submit`} className={`w-full rounded-xl py-3.5 font-bold text-white`} style={{
        background: `var(--primary)`
      }}>{s ? `Menyimpan...` : `Simpan Koreksi & Jumlah Fisik`}</button>, <button type={`button`} onClick={onClose} className={`w-full py-3 font-bold`}>{`Kembali`}</button>]}</form>}</div>;
}
export { PhysicalStockConfirmModal };
