// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import { convertItemUnit, describeExpiry, getAllowedUnits, getExpiryStatus, formatDate } from "../lib/store.js";
function on(e, t) {
  let n = t.search.trim().toLocaleLowerCase(`id-ID`);
  return e.filter(e => (!n || e.name.toLocaleLowerCase(`id-ID`).includes(n) || e.category.toLocaleLowerCase(`id-ID`).includes(n)) && (t.location.kind === `all` || (t.location.kind === `none` ? !e.location : e.location === t.location.name)) && (t.status === `all` || getExpiryStatus(e.expiryDate) === t.status)).sort((e, n) => {
    let r = e.name.localeCompare(n.name, `id-ID`);
    if (t.sort === `recent`) return n.createdAt.localeCompare(e.createdAt) || r;
    let i = (e.expiryDate || `9999-12-31`).localeCompare(n.expiryDate || `9999-12-31`);
    return t.sort === `name` ? r || i : i || r;
  });
}
function sn(e, t) {
  let n = new Map();
  for (let t of e) {
    let e = n.get(t.category) ?? [];
    e.push(t), n.set(t.category, e);
  }
  return [...new Set([...t, ...n.keys()])].filter(e => n.has(e)).map(e => [e, n.get(e)]);
}
var cn = e => Math.round(e * 1e4) / 1e4,
  ln = e => e.itemId ? `item:${e.itemId}` : `batch:${e.id}`;
function un(e, t) {
  let n = new Map(),
    r = getAllowedUnits(t);
  for (let i of e) {
    let e = i.unit,
      a = i.quantity;
    if (r.includes(e)) try {
      a = convertItemUnit(a, e, t.unit, t), e = t.unit;
    } catch {}
    n.set(e, (n.get(e) ?? 0) + a);
  }
  return [...n].map(([e, t]) => ({
    unit: e,
    quantity: cn(t)
  }));
}
function dn(e, t, n, r) {
  let i = new Map(),
    a = new Map();
  for (let e of t) {
    let t = ln(e),
      n = i.get(t) ?? [];
    n.push(e), i.set(t, n);
  }
  for (let t of e) {
    let e = ln(t),
      n = a.get(e) ?? [];
    n.push(t), a.set(e, n);
  }
  return [...a].map(([e, t]) => {
    let a = t[0],
      o = i.get(e) ?? t,
      s = n.find(e => e.id === a.itemId),
      c = s ?? {
        unit: a.unit
      },
      l = getAllowedUnits(c),
      u = o.filter(e => e.quantity > 0 && l.includes(e.unit) && e.expiryDate >= r && (!e.receivedDate || e.receivedDate <= r));
    return {
      key: e,
      name: s?.name ?? a.name,
      category: s?.category ?? a.category,
      linked: !!s,
      unit: c.unit,
      batches: t,
      allBatchCount: o.length,
      total: un(o, c),
      shown: un(t, c),
      recipeAvailable: un(u, c),
      excludedBatchCount: o.length - u.length,
      incompatibleBatchCount: o.filter(e => !l.includes(e.unit)).length
    };
  });
}
var fn = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  pn = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`;
function InventoryBatchCard({
  product: product,
  onEdit: onEdit,
  showCategory = false,
  hideName = false
}) {
  let i = {
    expired: {
      label: `Tanggal terlewat`,
      badgeBg: `#EF4444`,
      badgeColor: `#fff`
    },
    expiring: {
      label: `≤3 hari lagi`,
      badgeBg: `#F5A623`,
      badgeColor: `#1A1612`
    },
    safe: {
      label: `>3 hari lagi`,
      badgeBg: `#D1FAE5`,
      badgeColor: `#065F46`
    },
    unknown: {
      label: `Perlu dicek`,
      badgeBg: `#E0E7FF`,
      badgeColor: `#312E81`
    }
  }[getExpiryStatus(product.expiryDate)];
  return <div className={`rounded-2xl px-3.5 py-3.5`} style={{
    background: `#FFFFFF`,
    boxShadow: pn
  }}>{<div className={`flex items-start justify-between gap-3`}>{[<div className={`flex-1 min-w-0`}>{[!hideName && <p className={`font-black text-sm truncate mb-1.5`} style={{
          color: `var(--foreground)`,
          ...fn
        }}>{product.name}</p>, showCategory && <p className={`text-xs mb-1.5 font-semibold`} style={{
          color: `var(--muted-foreground)`,
          ...fn
        }}>{product.category}</p>, <p className={`text-xs`} style={{
          color: `var(--muted-foreground)`,
          ...fn
        }}>{[product.quantity, ` `, product.unit]}</p>, <p className={`text-xs mt-0.5`} style={{
          color: `var(--muted-foreground)`,
          ...fn
        }}>{describeExpiry(product)}</p>, product.location && <p className={`text-xs mt-0.5`} style={{
          color: `var(--muted-foreground)`,
          ...fn
        }}>{[`📍 `, product.location]}</p>]}</div>, <div className={`flex items-center gap-2 shrink-0`}>{[<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full`} style={{
          background: i.badgeBg,
          color: i.badgeColor,
          ...fn
        }}>{i.label}</span>, <button onClick={onEdit} aria-label={`Edit ${product.name}, ${product.quantity} ${product.unit}, ${describeExpiry(product)}${product.location ? `, ${product.location}` : ``}`} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm`} style={{
          background: `rgba(0,0,0,0.05)`
        }}>{`✏️`}</button>]}</div>]}</div>}</div>;
}
function hn(e) {
  return e.map(e => `${e.quantity.toLocaleString(`id-ID`, {
    maximumFractionDigits: 4
  })} ${e.unit}`).join(` + `);
}
function inventoryStatus(batches, today) {
  const stocked = batches.filter(batch => batch.quantity > 0);
  if (!stocked.length) return { label: 'Stok habis', tone: 'muted' };
  const expired = stocked.filter(batch => getExpiryStatus(batch.expiryDate) === 'expired').length;
  if (expired) return { label: expired === stocked.length ? 'Tanggal terlewat' : 'Sebagian melewati tanggal', tone: 'danger' };
  const expiring = stocked.filter(batch => getExpiryStatus(batch.expiryDate) === 'expiring').length;
  if (expiring) return { label: stocked.length === 1 ? 'Tanggal mendekat' : 'Ada tanggal yang mendekat', tone: 'warning' };
  const unknown = stocked.filter(batch => getExpiryStatus(batch.expiryDate) === 'unknown').length;
  if (unknown) return { label: unknown === stocked.length ? 'Tanggal belum diisi' : 'Sebagian tanggal belum diisi', tone: 'muted' };
  const pending = stocked.filter(batch => batch.receivedDate && batch.receivedDate > today).length;
  if (pending) return { label: pending === stocked.length ? 'Belum tersedia' : 'Sebagian belum tersedia', tone: 'muted' };
  return null;
}
function InventoryProducts({ products, allProducts, masters, onEdit }) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const groups = dn(products, allProducts, masters, today);
  return <div className="inventory-product-list">
    {groups.flatMap(group => group.batches.map(batch => {
      const amount = `${batch.quantity.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${batch.unit}`;
      const status = inventoryStatus([batch], today);
      const dateLabel = batch.expiryDate && getExpiryStatus(batch.expiryDate) !== 'unknown'
        ? `${batch.expiryKind === 'estimated' ? 'Perkiraan ' : ''}${formatDate(batch.expiryDate)}` : null;
      return <button type="button" className="inventory-product inventory-product-summary" key={batch.id}
        onClick={() => onEdit(batch)}
        aria-label={`Edit ${group.name}, ${amount}, ${describeExpiry(batch)}${batch.location ? `, ${batch.location}` : ''}`}>
        <span className="inventory-product-heading">
          <span className="inventory-product-name">{group.name}</span>
          <span className="inventory-product-quantity">{amount}</span>
        </span>
        <span className="inventory-product-meta">
          <span>{batch.location || 'Tanpa lokasi'}</span>
          {dateLabel && <span>{dateLabel}</span>}
        </span>
        {status && <span className={`inventory-product-status inventory-product-status-${status.tone}`}>{status.label}</span>}
      </button>;
    }))}
  </div>;
}

export { on, sn, cn, ln, un, dn, fn, pn, InventoryBatchCard, hn, InventoryProducts };
