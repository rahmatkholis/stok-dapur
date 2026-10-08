// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as jsxRuntime from "react/jsx-runtime";
import { readBatchLedger } from "../lib/store.js";
function Zt(e) {
  let t = new Date(`${e}T00:00:00`);
  return Number.isNaN(t.getTime()) ? `Tanggal belum diketahui` : t.toLocaleDateString(`id-ID`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`
  });
}
function Qt(e) {
  let t = new Date(e);
  return Number.isNaN(t.getTime()) ? `Waktu pencatatan belum diketahui` : `Dicatat ${t.toLocaleString(`id-ID`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`,
    hour: `2-digit`,
    minute: `2-digit`
  })}`;
}
function $t(e) {
  return `${e > 0 ? `+` : e < 0 ? `−` : ``}${Math.abs(e)}`;
}
function BatchLedger({
  username: username,
  productId: productId,
  onOpenShopping: onOpenShopping,
  onOpenActivity: onOpenActivity,
  view = `all`
}) {
  let i = readBatchLedger(username, productId);
  if (!i) return null;
  let {
      product: a,
      origin: o,
      events: s,
      summary: c
    } = i,
    l = o.kind === `purchase` ? `Diterima dari Belanja` : o.kind === `manual` ? `Ditambahkan langsung ke Inventori` : `Asal stok belum tercatat`;
  function u(e) {
    let t = e.reversal ? `Pembatalan penyesuaian` : e.action === `adjusted` ? `Penyesuaian` : e.action === `used` ? `Dipakai` : `Dibuang`,
      n = <jsxRuntime.Fragment>{[<div className={`flex justify-between items-start gap-3`}>{[<div className={`min-w-0`}>{[<strong className={`block text-sm`}>{t}</strong>, <span className={`block text-sm break-words mt-0.5`}>{e.title}</span>]}</div>, <strong className={`shrink-0 text-sm`} style={{
            color: e.cancelled ? `var(--muted-foreground)` : e.delta !== null && e.delta > 0 ? `#15803D` : `var(--foreground)`
          }}>{e.delta === null ? e.quantities.map(e => `${e.quantity} ${e.unit}`).join(` + `) : `${$t(e.delta)} ${a.unit}`}</strong>]}</div>, e.action === `adjusted` && e.delta !== null && e.before !== void 0 && e.after !== void 0 && <p className={`text-xs mt-1`}>{[e.before, ` → `, e.after, ` `, a.unit, e.cancelled ? ` · Dibatalkan` : ``]}</p>, <p className={`text-xs mt-1`} style={{
          color: `var(--muted-foreground)`
        }}>{[`Terjadi `, Zt(e.date)]}</p>, <p className={`text-xs mt-0.5`} style={{
          color: `var(--muted-foreground)`
        }}>{[Qt(e.recordedAt), onOpenActivity ? ` · Buka catatan →` : ``]}</p>]}</jsxRuntime.Fragment>;
    return onOpenActivity ? <button type={`button`} onClick={() => onOpenActivity(e.id)} aria-label={`Buka ${t.toLowerCase()}: ${e.title}`} className={`w-full text-left py-3`} style={{
      borderTop: `1px solid var(--border)`
    }} key={e.id}>{n}</button> : <div className={`py-3`} style={{
      borderTop: `1px solid var(--border)`
    }} key={e.id}>{n}</div>;
  }
  return <section aria-label={view === `origin` ? l : view === `movements` ? `Riwayat Pergerakan Stok` : `Asal dan perubahan stok`} className={`rounded-2xl p-4 space-y-3`} style={{
    border: view === `all` ? `1px solid var(--border)` : `none`,
    boxShadow: view === `all` ? `none` : `0 2px 12px rgba(0,0,0,0.07)`,
    background: `var(--card)`
  }}>{[view === `all` && <h3 className={`font-black text-sm`}>{`Asal dan perubahan stok`}</h3>, view !== `movements` && <div className={`rounded-xl p-3 text-sm space-y-1`} style={{
      background: `var(--muted)`
    }}>{[<p className={`font-bold`}>{l}</p>, o.quantity !== null && <p>{[o.kind === `purchase` ? `Jumlah pembelian` : `Jumlah awal`, `: `, <strong>{[o.quantity, ` `, a.unit]}</strong>]}</p>, o.date && <p className={`text-xs`}>{[`Stok tersedia `, Zt(o.date)]}</p>, <p className={`text-xs`} style={{
        color: `var(--muted-foreground)`
      }}>{Qt(o.recordedAt)}</p>, o.kind === `unknown` || o.quantity === null ? <p className={`text-xs`} style={{
        color: `var(--muted-foreground)`
      }}>{`Catatan lama belum menyimpan asal atau jumlah awal yang lengkap.`}</p> : null, o.shoppingActivityId && onOpenShopping && <button type={`button`} onClick={() => onOpenShopping(o.shoppingActivityId)} className={`block w-full text-left py-2 text-sm font-bold`} style={{
        color: `var(--primary)`
      }}>{[o.title || `Buka Belanja`, ` →`]}</button>, o.kind === `purchase` && <p className={`text-xs`} style={{
        color: `var(--muted-foreground)`
      }}>{`Jika pembelian salah dicatat, perbaiki melalui Belanja.`}</p>]}</div>, view !== `origin` && <jsxRuntime.Fragment>{[c.amountsKnown && <div className={`grid grid-cols-3 gap-2 text-xs`}>{[[`Dipakai`, `${c.used} ${a.unit}`], [`Dibuang`, `${c.disposed} ${a.unit}`], [`Penyesuaian`, `${$t(c.adjusted)} ${a.unit}`]].map(([e, t]) => <div key={e}>{[<p style={{
          color: `var(--muted-foreground)`
        }}>{e}</p>, <p className={`font-bold mt-1 break-words`}>{t}</p>]}</div>)}</div>, <p className={`text-sm font-bold`}>{[`Stok saat ini: `, a.quantity, ` `, a.unit]}</p>, !c.amountsKnown && <p className={`text-xs`} style={{
      color: `#92400E`
    }}>{`Sebagian catatan memakai satuan berbeda atau informasi perubahan belum lengkap. Total perubahan belum dapat dihitung.`}</p>, c.consistent === false && <p role={`status`} className={`text-xs`} style={{
      color: `#92400E`
    }}>{`Jumlah awal dan perubahan yang tersimpan belum menjelaskan seluruh stok saat ini. Periksa catatan terkait sebelum membuat koreksi.`}</p>, s.length ? <div>{[<p className={`text-xs font-bold mb-1`}>{`Perubahan terbaru`}</p>, s.slice(0, 3).map(u), s.length > 3 && <details>{[<summary className={`text-sm font-bold py-2 cursor-pointer`} style={{
          color: `var(--primary)`
        }}>{[`Lihat `, s.length - 3, ` catatan lainnya`]}</summary>, s.slice(3).map(u)]}</details>, <p className={`text-xs`} style={{
        color: `var(--muted-foreground)`
      }}>{`Buka catatan untuk memperbaiki pemakaian, pembuangan, atau penyesuaian yang salah. Ringkasan mengikuti catatan yang tersimpan saat ini.`}</p>]}</div> : <p className={`text-xs`} style={{
      color: `var(--muted-foreground)`
    }}>{`Belum ada perubahan stok yang tercatat pada batch ini.`}</p>]}</jsxRuntime.Fragment>]}</section>;
}
export { Zt, Qt, $t, BatchLedger };
