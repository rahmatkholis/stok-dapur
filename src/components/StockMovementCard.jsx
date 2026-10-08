import * as jsxRuntime from "react/jsx-runtime";
const J = { fontFamily: `Plus Jakarta Sans, sans-serif` };
const mr = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`;
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
function StockMovementCard({
  entry: entry,
  onOpen: onOpen,
  showDate = false
}) {
  let n = entry.action === `disposed`,
    r = entry.action === `adjusted`,
    i = r ? `#EFF6FF` : n ? `#FEF2F2` : `#F0FDF4`,
    a = entry.items ?? [],
    o = vr(entry.createdAt),
    s = n && a.length === 1 ? `${a[0].productName} · ${a[0].quantity} ${a[0].unit}` : `${a.length} batch stok`;
  const adjustmentDelta = entry.adjustment ? Math.round((entry.adjustment.after - entry.adjustment.before) * 1e4) / 1e4 : 0;
  const amounts = new Map();
  for (const item of a) amounts.set(item.unit, Math.round(((amounts.get(item.unit) ?? 0) + item.quantity) * 1e4) / 1e4);
  const movementAmount = [...amounts].map(([unit, quantity]) => `−${quantity.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${unit}`).join(' + ');
  return <button onClick={onOpen} type={`button`} aria-label={showDate ? `Buka ${r ? `koreksi stok` : n ? `pembuangan` : `pemakaian`}: ${entry.title}` : undefined} className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-left transition-transform active:scale-[0.98]`} style={{
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
      }}>{[entry.cancelledAt ? `Dibatalkan · ` : entry.reversalOf ? `Pembalikan · ` : ``, r ? `Koreksi stok · ${entry.adjustment?.before ?? `—`} → ${entry.adjustment?.after ?? `—`} ${a[0]?.unit ?? ``}` : `${entry.source === `recipe` ? `Dimasak · ${entry.servings ?? 1} porsi` : n ? `Dibuang` : `Dipakai langsung`} · ${s}`]}</p>, showDate && <p className={`text-xs mt-1`} style={{ color: `var(--muted-foreground)` }}>{[_r(entry.date), r && entry.adjustment ? ` · ${adjustmentDelta > 0 ? `+` : adjustmentDelta < 0 ? `−` : ``}${Math.abs(adjustmentDelta)} ${a[0]?.unit ?? ``}` : ` · ${movementAmount}`]}</p>, showDate && entry.editedAt && <p className="text-xs mt-1" style={{ color: `var(--muted-foreground)` }}>Diedit · {new Date(entry.editedAt).toLocaleString(`id-ID`)}</p>]}</div>, <span className={`text-base shrink-0`} style={{
      color: `var(--muted-foreground)`
    }}>{`›`}</span>]}</button>;
}
export { StockMovementCard };
