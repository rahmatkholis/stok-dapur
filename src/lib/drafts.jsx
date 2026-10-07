// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
var Ut = `dapur_form_draft_v1:`;
function Wt(e, t) {
  return `${Ut}${encodeURIComponent(e)}:${encodeURIComponent(t)}`;
}
function Gt(e, t, n, r = ``) {
  if (!e) return null;
  try {
    let i = localStorage.getItem(Wt(e, t));
    if (!i) return null;
    let a = JSON.parse(i);
    return a.version !== 1 || a.revision !== r || !n(a.values) ? null : a.values;
  } catch {
    return null;
  }
}
function Kt(e, t, n, r = ``) {
  if (!e) return false;
  try {
    return localStorage.setItem(Wt(e, t), JSON.stringify({
      version: 1,
      revision: r,
      values: n
    })), true;
  } catch {
    return false;
  }
}
function qt(e, t) {
  if (e) try {
    localStorage.removeItem(Wt(e, t));
  } catch {}
}
function Jt(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function Yt(e, t, n, r, i = true, a = ``) {
  let [o, s] = (0, React.useState)(false),
    c = JSON.stringify(n);
  return (0, React.useEffect)(() => {
    if (!(!i || !e)) {
      if (!r) {
        qt(e, t), s(false);
        return;
      }
      s(!Kt(e, t, JSON.parse(c), a));
    }
  }, [e, t, c, r, i, a]), (0, React.useEffect)(() => {
    if (!i || !r) return;
    let e = e => {
      e.preventDefault(), e.returnValue = ``;
    };
    return window.addEventListener(`beforeunload`, e), () => window.removeEventListener(`beforeunload`, e);
  }, [i, r]), {
    clearDraft: () => qt(e, t),
    storageFailed: o
  };
}
function DraftRestoreNotice({
  restored: restored,
  storageFailed: storageFailed
}) {
  return !restored && !storageFailed ? null : <p role={storageFailed ? `alert` : `status`} className={`rounded-xl p-3 text-sm`} style={{
    background: storageFailed ? `#FEF2F2` : `#E0E7FF`,
    color: storageFailed ? `#B91C1C` : `#312E81`
  }}>{storageFailed ? `Draf belum bisa disimpan di perangkat ini. Tetap di halaman ini sampai isian disimpan.` : `Draf sebelumnya dipulihkan. Periksa isian sebelum Simpan; stok dan transaksi belum berubah.`}</p>;
}
export { Ut, Wt, Gt, Kt, qt, Jt, Yt, DraftRestoreNotice };
