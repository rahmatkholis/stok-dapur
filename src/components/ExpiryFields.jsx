// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
function ExpiryFields({
  kind: kind,
  date: date,
  onKindChange: onKindChange,
  onDateChange: onDateChange
}) {
  return <fieldset className={`space-y-2`}>{[<legend className={`text-sm font-bold mb-2`}>{`Informasi kedaluwarsa`}</legend>, <div className={`grid grid-cols-3 gap-2`}>{[[`package`, `Tanggal kemasan`], [`estimated`, `Perkiraan`], [`unknown`, `Belum tahu`]].map(([t, r]) => <label className={`rounded-xl border p-2 text-xs font-bold flex flex-col gap-2`} style={{
        borderColor: kind === t ? `var(--primary)` : `var(--border)`,
        background: kind === t ? `var(--muted)` : `var(--card)`
      }} key={t}>{[<input type={`radio`} name={`expiry-kind`} checked={kind === t} onChange={() => onKindChange(t)} />, r]}</label>)}</div>, kind === `unknown` ? <p className={`text-xs`} style={{
      color: `var(--muted-foreground)`
    }}>{`Stok tampil sebagai Perlu dicek dan belum dihitung siap untuk resep.`}</p> : <label className={`block text-sm font-bold`}>{[kind === `estimated` ? `Tanggal perkiraan` : `Tanggal pada kemasan`, <input type={`date`} value={date} onChange={e => onDateChange(e.target.value)} required={true} className={`w-full rounded-xl px-4 py-3 mt-2 text-sm`} style={{
        background: `var(--muted)`,
        border: `1px solid var(--border)`
      }} />]}</label>]}</fieldset>;
}
export { ExpiryFields };
