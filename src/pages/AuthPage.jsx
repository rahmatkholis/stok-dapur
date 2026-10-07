// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { login, register } from "../lib/store.js";
function AuthPage({
  onAuth: onAuth
}) {
  let [t, n] = (0, React.useState)(`login`),
    [r, i] = (0, React.useState)(``),
    [a, o] = (0, React.useState)(``),
    [s, c] = (0, React.useState)(``),
    [l, u] = (0, React.useState)(false);
  async function d(n) {
    if (n.preventDefault(), !r.trim() || !a.trim()) {
      c(`Username dan password wajib diisi.`);
      return;
    }
    u(true), c(``), await new Promise(e => setTimeout(e, 300));
    let i = t === `login` ? login(r.trim(), a) : register(r.trim(), a);
    if (u(false), i) {
      c(i);
      return;
    }
    onAuth(r.trim());
  }
  return <div className={`min-h-screen flex flex-col`} style={{
    background: `#FAFAF8`
  }}>{[<div className={`relative overflow-hidden`} style={{
      height: 220
    }}>{[<div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full`} style={{
        background: `var(--primary)`,
        opacity: .15
      }} />, <div className={`absolute top-4 right-16 w-20 h-20 rounded-full`} style={{
        background: `var(--accent)`,
        opacity: .3
      }} />, <div className={`absolute -top-4 left-8 w-28 h-28`} style={{
        background: `var(--secondary)`,
        opacity: .12,
        borderRadius: `40% 60% 60% 40% / 60% 30% 70% 40%`
      }} />, <div className={`absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 pt-12`}>{[<div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3`} style={{
          background: `var(--primary)`
        }}>{<span className={`text-2xl`}>{`🍳`}</span>}</div>, <h1 className={`font-display text-3xl font-bold`} style={{
          color: `var(--foreground)`
        }}>{`Dapur`}</h1>, <p className={`text-sm mt-1`} style={{
          color: `var(--muted-foreground)`
        }}>{`Pantau stok, kurangi pemborosan`}</p>]}</div>]}</div>, <div className={`flex-1 px-5 pb-10`}>{<div className={`rounded-2xl p-6`} style={{
        background: `var(--card)`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.08)`
      }}>{[<div className={`flex rounded-xl p-1 mb-6`} style={{
          background: `var(--muted)`
        }}>{[`login`, `register`].map(e => <button onClick={() => {
            n(e), c(``);
          }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all`} style={{
            background: t === e ? `var(--primary)` : `transparent`,
            color: t === e ? `var(--primary-foreground)` : `var(--muted-foreground)`
          }} key={e}>{e === `login` ? `Masuk` : `Daftar`}</button>)}</div>, <form onSubmit={d} className={`flex flex-col gap-4`}>{[<div>{[<label className={`block text-sm font-medium mb-1.5`} style={{
              color: `var(--foreground)`
            }}>{`Username`}</label>, <input type={`text`} value={r} onChange={e => i(e.target.value)} placeholder={`nama_pengguna`} autoCapitalize={`none`} className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all`} style={{
              background: `var(--muted)`,
              border: `1.5px solid var(--border)`,
              color: `var(--foreground)`,
              fontFamily: `DM Mono, monospace`
            }} />]}</div>, <div>{[<label className={`block text-sm font-medium mb-1.5`} style={{
              color: `var(--foreground)`
            }}>{`Password`}</label>, <input type={`password`} value={a} onChange={e => o(e.target.value)} placeholder={`••••••••`} className={`w-full px-4 py-3 rounded-xl text-sm outline-none`} style={{
              background: `var(--muted)`,
              border: `1.5px solid var(--border)`,
              color: `var(--foreground)`
            }} />]}</div>, s && <p className={`text-sm px-3 py-2 rounded-lg`} style={{
            background: `#FEE2E2`,
            color: `#EF4444`
          }}>{s}</p>, <button type={`submit`} disabled={l} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity`} style={{
            background: `var(--primary)`,
            color: `var(--primary-foreground)`,
            opacity: l ? .7 : 1
          }}>{l ? `Memproses...` : t === `login` ? `Masuk` : `Buat Akun`}</button>]}</form>]}</div>}</div>]}</div>;
}
export { AuthPage };
