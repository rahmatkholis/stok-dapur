// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { describeExpiry, getProfile, updatePassword, updateProfile } from "../lib/store.js";
import { MasterDataPage } from "./MasterDataPage.jsx";
var er = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  tr = `0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)`,
  nr = [`#E57034`, `#2BBFA3`, `#7C3AED`, `#0369A1`, `#D97706`, `#15803D`];
function rr(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) t = e.charCodeAt(n) + ((t << 5) - t);
  return nr[Math.abs(t) % nr.length];
}
var ir = {
  width: `100%`,
  padding: `10px 14px`,
  borderRadius: 10,
  border: `1.5px solid var(--border)`,
  background: `var(--muted)`,
  color: `var(--foreground)`,
  fontSize: 14,
  outline: `none`,
  fontFamily: `Plus Jakarta Sans, sans-serif`
};
function AccountPage({
  username: username,
  categories: categories,
  locations: locations,
  itemMasters: itemMasters,
  onRefresh: onRefresh,
  onLogout: onLogout
}) {
  let o = getProfile(username),
    [s, c] = (0, React.useState)(null),
    [l, u] = (0, React.useState)(o.displayName),
    d = (l || username).slice(0, 2).toUpperCase(),
    f = rr(username);
  return s === `profile` ? <EditProfilePage username={username} initialName={l} email={o.email || ``} onBack={t => {
    t && u(getProfile(username).displayName), c(null);
  }} /> : s === `password` ? <ChangePasswordPage username={username} onBack={() => c(null)} /> : s === `master` ? <MasterDataPage username={username} categories={categories} locations={locations} itemMasters={itemMasters} onRefresh={onRefresh} onBack={() => c(null)} /> : <div className={`pb-28 pt-6 px-4 max-w-[480px] mx-auto`}>{[<div className={`rounded-2xl p-5 flex items-center gap-4 mb-6`} style={{
      background: `var(--card)`,
      boxShadow: tr
    }}>{[<div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0`} style={{
        background: f,
        color: `#fff`,
        ...er
      }}>{d}</div>, <div className={`min-w-0`}>{[<p className={`font-black text-base truncate`} style={{
          color: `var(--foreground)`,
          ...er
        }}>{l || username}</p>, <p className={`text-xs mt-0.5 font-medium`} style={{
          color: `var(--muted-foreground)`,
          ...er
        }}>{[`@`, username]}</p>, o.email && <p className={`text-xs mt-0.5 font-medium truncate`} style={{
          color: `var(--muted-foreground)`,
          ...er
        }}>{o.email}</p>]}</div>]}</div>, <div className={`rounded-2xl overflow-hidden mb-4`} style={{
      background: `var(--card)`,
      boxShadow: tr
    }}>{[<p className={`px-5 pt-4 pb-2 text-[11px] font-bold uppercase tracking-widest`} style={{
        color: `var(--muted-foreground)`,
        ...er
      }}>{`Pengaturan`}</p>, <AccountMenuItem icon={`👤`} label={`Pengaturan Profil`} sub={`Ubah nama tampilan`} onClick={() => c(`profile`)} />, <div className={`h-px mx-5`} style={{
        background: `var(--border)`
      }} />, <AccountMenuItem icon={`▤`} label={`Data Master`} sub={`Kategori produk dan lokasi penyimpanan`} onClick={() => c(`master`)} />, <div className={`h-px mx-5`} style={{
        background: `var(--border)`
      }} />, <AccountMenuItem icon={`🔒`} label={`Ubah Kata Sandi`} sub={`Ganti kata sandi akun`} onClick={() => c(`password`)} />]}</div>, <button onClick={() => {
      confirm(`Yakin ingin keluar?`) && onLogout();
    }} className={`w-full py-3.5 rounded-2xl font-black text-sm mt-2`} style={{
      background: `#FEF2F2`,
      color: `#EF4444`,
      ...er
    }}>{`Keluar`}</button>]}</div>;
}
function AccountMenuItem({
  icon: icon,
  label: label,
  sub: sub,
  onClick: onClick
}) {
  return <button onClick={onClick} className={`w-full px-5 py-4 flex items-center gap-4 transition-colors active:bg-[var(--muted)] text-left`}>{[<div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0`} style={{
      background: `var(--muted)`
    }}>{icon}</div>, <div className={`flex-1 min-w-0`}>{[<p className={`font-bold text-sm`} style={{
        color: `var(--foreground)`,
        ...er
      }}>{label}</p>, <p className={`text-xs font-medium mt-0.5`} style={{
        color: `var(--muted-foreground)`,
        ...er
      }}>{sub}</p>]}</div>, <span className={`text-base`} style={{
      color: `var(--muted-foreground)`
    }}>{`›`}</span>]}</button>;
}
function EditProfilePage({
  username: username,
  initialName: initialName,
  email: email,
  onBack: onBack
}) {
  let [i, a] = (0, React.useState)(initialName),
    [o, s] = (0, React.useState)(false),
    [c, l] = (0, React.useState)(``),
    [u, d] = (0, React.useState)(``),
    f = i.trim() !== initialName;
  async function p(t) {
    if (t.preventDefault(), !i.trim()) {
      d(`Nama tidak boleh kosong.`);
      return;
    }
    s(true), d(``), l(``), await new Promise(e => setTimeout(e, 300));
    let n = updateProfile(username, i.trim());
    s(false), n ? d(n) : (l(`Nama berhasil disimpan.`), setTimeout(() => onBack(true), 800));
  }
  return <AccountPageShell title={`Pengaturan Profil`} onBack={() => onBack(false)}>{<form onSubmit={p} className={`flex flex-col gap-4`}>{[<AccountField label={`Nama`}>{<input type={`text`} value={i} onChange={e => {
          a(e.target.value), d(``), l(``);
        }} placeholder={`Nama tampilan`} style={ir} />}</AccountField>, <AccountField label={`Email`}>{[<input type={`email`} value={email} readOnly={true} placeholder={`Tidak tersedia`} style={{
          ...ir,
          opacity: .55,
          cursor: `not-allowed`
        }} />, <p className={`text-[10px] mt-1 font-medium`} style={{
          color: `var(--muted-foreground)`,
          ...er
        }}>{`Email tidak dapat diubah`}</p>]}</AccountField>, u && <AccountFeedback type={`error`} text={u} />, c && <AccountFeedback type={`success`} text={c} />, <AccountSubmitButton loading={o} disabled={!f} label={`Simpan Perubahan`} />]}</form>}</AccountPageShell>;
}
function ChangePasswordPage({
  username: username,
  onBack: onBack
}) {
  let [n, r] = (0, React.useState)(``),
    [i, a] = (0, React.useState)(``),
    [o, s] = (0, React.useState)(``),
    [c, l] = (0, React.useState)(false),
    [u, d] = (0, React.useState)(``),
    [f, p] = (0, React.useState)(``),
    m = n.length > 0 && i.length > 0 && o.length > 0;
  async function h(c) {
    if (c.preventDefault(), !n || !i || !o) {
      p(`Semua field wajib diisi.`);
      return;
    }
    if (i.length < 6) {
      p(`Kata sandi baru minimal 6 karakter.`);
      return;
    }
    if (i !== o) {
      p(`Konfirmasi kata sandi tidak cocok.`);
      return;
    }
    l(true), p(``), d(``), await new Promise(e => setTimeout(e, 300));
    let u = updatePassword(username, n, i);
    l(false), u ? p(u) : (d(`Kata sandi berhasil diubah.`), r(``), a(``), s(``), setTimeout(() => onBack(), 1e3));
  }
  return <AccountPageShell title={`Ubah Kata Sandi`} onBack={onBack}>{<form onSubmit={h} className={`flex flex-col gap-4`}>{[<AccountField label={`Kata Sandi Saat Ini`}>{<input type={`password`} value={n} onChange={e => {
          r(e.target.value), p(``);
        }} placeholder={`••••••••`} style={ir} />}</AccountField>, <AccountField label={`Kata Sandi Baru`}>{<input type={`password`} value={i} onChange={e => {
          a(e.target.value), p(``);
        }} placeholder={`Min. 6 karakter`} style={ir} />}</AccountField>, <AccountField label={`Konfirmasi Kata Sandi Baru`}>{<input type={`password`} value={o} onChange={e => {
          s(e.target.value), p(``);
        }} placeholder={`Ulangi kata sandi baru`} style={ir} />}</AccountField>, f && <AccountFeedback type={`error`} text={f} />, u && <AccountFeedback type={`success`} text={u} />, <AccountSubmitButton loading={c} disabled={!m} label={`Simpan Perubahan`} />]}</form>}</AccountPageShell>;
}
function AccountPageShell({
  title: title,
  onBack: onBack,
  children: children
}) {
  return <div className={`min-h-screen`} style={{
    background: `var(--background)`
  }}>{[<div className={`sticky top-0 z-30 px-4 pb-3.5 flex items-center gap-3`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`
    }}>{[<button onClick={onBack} className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 transition-opacity active:opacity-60`} style={{
        background: `var(--muted)`,
        color: `var(--foreground)`
      }}>{`‹`}</button>, <span className={`text-base font-black`} style={{
        color: `var(--foreground)`,
        ...er
      }}>{title}</span>]}</div>, <div className={`px-4 pt-6 pb-24 max-w-[480px] mx-auto`}>{<div className={`rounded-2xl p-5`} style={{
        background: `var(--card)`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
      }}>{children}</div>}</div>]}</div>;
}
function AccountField({
  label: label,
  children: children
}) {
  return <div>{[<label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide`} style={{
      color: `var(--muted-foreground)`,
      ...er
    }}>{label}</label>, children]}</div>;
}
function AccountFeedback({
  type: type,
  text: text
}) {
  return <p className={`text-sm px-3 py-2 rounded-xl font-semibold`} style={{
    background: type === `error` ? `#FEE2E2` : `#D1FAE5`,
    color: type === `error` ? `#EF4444` : `#065F46`,
    ...er
  }}>{text}</p>;
}
function AccountSubmitButton({
  loading: loading,
  disabled: disabled,
  label: label
}) {
  return <button type={`submit`} disabled={loading || disabled} className={`w-full py-3 rounded-xl font-black text-sm transition-all`} style={{
    background: disabled ? `var(--border)` : `var(--primary)`,
    color: disabled ? `var(--muted-foreground)` : `#fff`,
    cursor: disabled ? `not-allowed` : `pointer`,
    ...er
  }}>{loading ? `Menyimpan...` : label}</button>;
}
function ArchivedProductNotice({
  product: product
}) {
  return product ? <p className={`text-xs mt-1`} style={{
    color: `var(--muted-foreground)`
  }}>{[describeExpiry(product), ` · `, product.location || `Lokasi tidak diisi`]}</p> : null;
}
export { er, tr, nr, rr, ir, AccountPage, AccountMenuItem, EditProfilePage, ChangePasswordPage, AccountPageShell, AccountField, AccountFeedback, AccountSubmitButton, ArchivedProductNotice };
