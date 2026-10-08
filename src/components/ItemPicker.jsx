// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { ItemCombobox } from "./ItemCombobox.jsx";
function ItemPicker({
  items: items,
  value: value,
  onSelect: onSelect,
  onAddItem: onAddItem,
  disabled: disabled,
  label = `Nama Item`,
  style: style,
  combined = false
}) {
  let [s, c] = (0, React.useState)(``),
    l = items.filter(e => e.active || e.id === value).filter(e => !s || e.name.toLocaleLowerCase(`id-ID`).includes(s.toLocaleLowerCase(`id-ID`)) || e.id === value).sort((e, t) => e.name.localeCompare(t.name, `id-ID`) || e.unit.localeCompare(t.unit, `id-ID`)),
    u = new Map();
  l.forEach(e => {
    let t = e.name.trim().toLocaleLowerCase(`id-ID`);
    u.set(t, (u.get(t) ?? 0) + 1);
  });
  let d = {
    width: `100%`,
    padding: `10px 14px`,
    borderRadius: 10,
    border: `1.5px solid var(--border)`,
    background: `var(--muted)`,
    color: `var(--foreground)`,
    fontSize: 14
  };
  if (combined) return <ItemCombobox items={items} value={value} onSelect={onSelect} onAddItem={onAddItem} disabled={disabled} label={label} style={style ?? d} />;
  return <div>{[<div className={`flex items-center justify-between gap-3 mb-1.5`}>{[<label className={`text-xs font-semibold uppercase tracking-wide`} style={{
        color: `var(--muted-foreground)`
      }}>{label}</label>, !disabled && <button type={`button`} onClick={() => onAddItem(s.trim())} className={`text-xs font-bold shrink-0`} style={{
        color: `var(--primary)`
      }}>{`Tambah Item Baru`}</button>]}</div>, !disabled && <input type={`search`} aria-label={`Cari ${label.toLowerCase()}`} value={s} onChange={e => c(e.target.value)} placeholder={`Cari item berdasarkan nama`} className={`mb-2`} style={d} />, <select aria-label={label} disabled={disabled} value={value ?? ``} onChange={t => onSelect(items.find(e => e.active && e.id === t.target.value) ?? null)} style={style ?? d}>{[<option value={``}>{`Pilih item`}</option>, l.map(e => {
        let t = (u.get(e.name.trim().toLocaleLowerCase(`id-ID`)) ?? 0) > 1;
        return <option value={e.id} key={e.id}>{[e.name, t ? ` (${e.unit})` : ``, e.active ? `` : ` · Diarsipkan`]}</option>;
      })]}</select>]}</div>;
}
export { ItemPicker };
