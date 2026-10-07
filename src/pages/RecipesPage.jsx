// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { addProduct, cookRecipe, deleteRecipe, describeExpiry, getAllowedUnits, getRecipeAvailability, planRecipeShopping, previewRecipeShopping, saveRecipe } from "../lib/store.js";
import { ItemPicker } from "../components/ItemPicker.jsx";
import { DraftRestoreNotice, Gt, Jt, Yt } from "../lib/drafts.jsx";
import { ProductModal } from "../components/ProductModal.jsx";
var Ar = {
  width: `100%`,
  padding: `10px 14px`,
  borderRadius: 10,
  border: `1.5px solid var(--border)`,
  background: `var(--muted)`,
  color: `var(--foreground)`,
  fontSize: 14,
  outline: `none`,
  fontFamily: `Plus Jakarta Sans, sans-serif`,
  fontWeight: 600
};
function jr(e) {
  return Array.isArray(e) && e.every(e => Jt(e) && typeof e.ingredientId == `string` && typeof e.quantity == `string`);
}
var Mr = {
    background: `var(--card)`,
    boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
  },
  Nr = {
    background: `var(--muted)`,
    border: `1px solid var(--border)`
  },
  Pr = e => Math.round(e * 1e4) / 1e4;
function CookRecipePage({
  username: username,
  recipe: recipe,
  servings: servings,
  products: products,
  masters: masters,
  checkedUnknownIds: checkedUnknownIds,
  onRefresh: onRefresh,
  onBack: onBack,
  onSaved: onSaved
}) {
  let l = `recipe:cook:${recipe.id}:${servings}`,
    u = JSON.stringify(recipe),
    [d] = (0, React.useState)(() => getRecipeAvailability(recipe, products, servings, masters, checkedUnknownIds).map(e => ({
      ingredientId: e.ingredient.id,
      quantity: String(e.needed)
    }))),
    [f] = (0, React.useState)(() => {
      let t = Gt(username, l, jr, u);
      return t?.length === d.length && d.every(e => t.some(t => t.ingredientId === e.ingredientId)) ? t : null;
    }),
    [p, m] = (0, React.useState)(f ?? d),
    h = JSON.stringify(p) !== JSON.stringify(d),
    {
      clearDraft: g,
      storageFailed: v
    } = Yt(username, l, p, h, true, u),
    [y, b] = (0, React.useState)(false),
    [x, S] = (0, React.useState)(false),
    [C, T] = (0, React.useState)(``),
    E = (0, React.useRef)(false),
    D = getRecipeAvailability(recipe, products, servings, masters, checkedUnknownIds),
    O = D.length > 0 && D.every(e => e.shortage === 0),
    k = p.length === recipe.ingredients.length && p.every(e => e.quantity.trim() && Number.isFinite(Number(e.quantity)) && Number(e.quantity) >= 1e-4 && Pr(Number(e.quantity)) === Number(e.quantity)),
    A = {
      ...recipe,
      servings: servings,
      ingredients: recipe.ingredients.map(e => ({
        ...e,
        quantity: Number(p.find(t => t.ingredientId === e.id)?.quantity)
      }))
    },
    j = k ? getRecipeAvailability(A, products, servings, masters, checkedUnknownIds) : [],
    M = k && j.length > 0 && j.every(e => e.shortage === 0);
  function N() {
    if (E.current) return;
    if (!O || !M) {
      T(`Periksa jumlah dan stok bahan sebelum menyimpan.`);
      return;
    }
    E.current = true;
    let r = cookRecipe(username, recipe.id, servings, p.map(e => ({
      ingredientId: e.ingredientId,
      quantity: Number(e.quantity)
    })), checkedUnknownIds);
    if (r) {
      E.current = false, T(r), onRefresh();
      return;
    }
    g(), onRefresh(), onSaved();
  }
  return <div className={`fixed inset-0 z-50 overflow-y-auto`} style={{
    background: `#FAFAF8`
  }}>{[<div className={`max-w-[480px] mx-auto min-h-screen pb-28`}>{[<div className={`sticky top-0 z-10 px-4 pb-3 flex items-center gap-3`} style={{
        background: `var(--card)`,
        boxShadow: `0 1px 8px rgba(0,0,0,.06)`,
        paddingTop: `calc(env(safe-area-inset-top, 16px) + 12px)`
      }}>{[<button type={`button`} onClick={() => {
          h ? b(true) : onBack();
        }} aria-label={`Kembali ke detail resep`} className={`w-9 h-9 rounded-xl font-bold`} style={{
          background: `var(--muted)`
        }}>{`←`}</button>, <h1 className={`font-black text-base`}>{`Konfirmasi Masak`}</h1>]}</div>, <div className={`px-4 pt-5 space-y-4`}>{[<DraftRestoreNotice restored={!!f} storageFailed={v} />, <div className={`rounded-2xl p-4`} style={Mr}>{[<h2 className={`font-black text-lg`}>{recipe.name}</h2>, <p className={`text-sm mt-1`} style={{
            color: `var(--muted-foreground)`
          }}>{[servings, ` porsi · `, recipe.ingredients.length, ` bahan`]}</p>]}</div>, <section className={`rounded-2xl p-4`} style={Mr}>{[<div className={`flex justify-between items-center gap-3 mb-3`}>{[<h2 className={`font-black text-base`}>{`Pemakaian bahan`}</h2>, <button type={`button`} onClick={() => S(e => !e)} className={`text-xs font-bold px-2 py-2`} style={{
              color: `var(--primary)`
            }}>{x ? `Selesai Mengubah` : `Ubah Pemakaian`}</button>]}</div>, recipe.ingredients.map(e => {
            let t = p.find(t => t.ingredientId === e.id),
              n = j.find(t => t.ingredient.id === e.id);
            return <div className={`py-3`} style={{
              borderTop: `1px solid var(--border)`
            }} key={e.id}>{[<div className={`flex justify-between items-center gap-3`}>{[<p className={`font-bold text-sm`}>{e.name}</p>, x ? <label className={`flex items-center gap-2 text-sm shrink-0`}>{[<input aria-label={`Jumlah ${e.name} (${e.unit})`} type={`number`} min={`0.0001`} step={`any`} value={t.quantity} onChange={t => {
                    m(n => n.map(n => n.ingredientId === e.id ? {
                      ...n,
                      quantity: t.target.value
                    } : n)), T(``);
                  }} className={`w-24 rounded-xl p-2 text-sm`} style={Nr} />, <span>{e.unit}</span>]}</label> : <strong className={`text-sm`}>{[t.quantity || `—`, ` `, e.unit]}</strong>]}</div>, n && n.shortage > 0 && <p className={`text-xs mt-2`} style={{
                color: `#B91C1C`
              }}>{[`Jumlah dipakai melebihi stok. Kurang `, n.shortage, ` `, e.unit, `.`]}</p>, n && <details className={`mt-2 text-xs`} style={{
                color: `var(--muted-foreground)`
              }}>{[<summary className={`cursor-pointer`}>{[`Lihat batch otomatis (`, n.allocations.length, `)`]}</summary>, <div className={`pt-2 space-y-1`}>{n.allocations.map(e => {
                    let t = products.find(t => t.id === e.productId);
                    return <p key={e.productId}>{[e.quantity, ` `, e.unit, ` · `, t ? describeExpiry(t) : `Stok tidak tersedia`, ` · `, t?.location || `Tanpa lokasi`]}</p>;
                  })}</div>]}</details>]}</div>;
          }), <p className={`text-xs mt-3`} style={{
            color: `var(--muted-foreground)`
          }}>{`Batch dipilih otomatis dari yang paling dekat kedaluwarsa. Setiap bahan dicatat sesuai jumlah di atas.`}</p>, x && <p className={`text-xs mt-2`} style={{
            color: `var(--muted-foreground)`
          }}>{`Sesuaikan jumlah aktual untuk masakan ini. Isi setiap bahan lebih dari 0.`}</p>]}</section>, !O && <p role={`alert`} className={`rounded-xl p-3 text-sm`} style={{
          background: `#FEF3C7`,
          color: `#92400E`
        }}>{`Stok bahan sudah berubah dan resep belum cukup. Kembali ke detail Resep untuk melengkapi stok.`}</p>, !k && <p role={`alert`} className={`text-sm`} style={{
          color: `#B91C1C`
        }}>{`Isi jumlah setiap bahan lebih dari 0, maksimal 4 angka desimal.`}</p>, C && <p role={`alert`} className={`rounded-xl p-3 text-sm`} style={{
          background: `#FEF2F2`,
          color: `#B91C1C`
        }}>{C}</p>, <button type={`button`} disabled={!O || !M} onClick={N} className={`w-full py-4 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
          background: `var(--primary)`
        }}>{`Simpan & Kurangi Stok`}</button>]}</div>]}</div>, y && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,.52)`
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Pemakaian belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={Mr}>{[<h2 className={`text-lg font-black`}>{`Pemakaian belum disimpan`}</h2>, <p className={`text-sm`}>{`Jumlah yang diubah akan hilang jika kamu keluar. Masakan belum dicatat.`}</p>, <button type={`button`} onClick={() => b(false)} className={`w-full rounded-xl py-3 font-bold text-white`} style={{
          background: `var(--primary)`
        }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={() => {
          g(), onBack();
        }} className={`w-full rounded-xl py-3 font-bold`} style={{
          color: `#B91C1C`
        }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>]}</div>;
}
function Ir(e) {
  return Jt(e) && typeof e.name == `string` && typeof e.servings == `number` && Array.isArray(e.ingredients) && e.ingredients.every(e => Jt(e) && [`id`, `name`, `category`, `unit`].every(t => typeof e[t] == `string`) && typeof e.quantity == `number` && (e.itemId === void 0 || typeof e.itemId == `string`));
}
var Lr = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  Rr = {
    background: `var(--card)`,
    boxShadow: `0 2px 12px rgba(0,0,0,0.07)`
  },
  zr = {
    background: `var(--muted)`,
    border: `1px solid var(--border)`,
    color: `var(--foreground)`,
    ...Lr
  };
function Br(e) {
  return {
    id: crypto.randomUUID(),
    name: ``,
    category: e,
    quantity: 1,
    unit: `buah`
  };
}
function RecipesPage({
  username: username,
  recipes: recipes,
  products: products,
  categories: categories,
  locations: locations,
  itemMasters: itemMasters,
  shoppingActivities: shoppingActivities,
  onRefresh: onRefresh,
  onShopping: onShopping,
  onOpenMasterItem: onOpenMasterItem,
  addTrigger: addTrigger
}) {
  let [d, f] = (0, React.useState)(`list`),
    [p, m] = (0, React.useState)(`all`),
    [h, g] = (0, React.useState)(null),
    [v, y] = (0, React.useState)(null),
    [b, x] = (0, React.useState)(``),
    [S, C] = (0, React.useState)(1),
    [T, E] = (0, React.useState)([Br(categories[0] ?? ``)]),
    [D, O] = (0, React.useState)(1),
    [k, A] = (0, React.useState)(``),
    [j, M] = (0, React.useState)(``),
    [P, F] = (0, React.useState)(false),
    [L, ee] = (0, React.useState)(false),
    [R, z] = (0, React.useState)(`new`),
    [B, V] = (0, React.useState)(``),
    [H, U] = (0, React.useState)(``),
    [W, te] = (0, React.useState)(false),
    [ne, re] = (0, React.useState)(false),
    [ie, ae] = (0, React.useState)(false),
    [oe, se] = (0, React.useState)([]),
    [ce, le] = (0, React.useState)([]),
    [ue, de] = (0, React.useState)(false),
    [fe, pe] = (0, React.useState)(false),
    me = (0, React.useRef)(addTrigger ?? 0),
    he = recipes.find(e => e.id === h),
    ge = v ? b !== v.name || S !== v.servings || JSON.stringify(T) !== JSON.stringify(v.ingredients) : !!b.trim() || S !== 1 || T.length !== 1 || T.some(e => !!e.itemId || e.quantity !== 1 || e.unit !== `buah`),
    {
      clearDraft: _e,
      storageFailed: ve
    } = Yt(username, `recipe:${v?.id ?? `new`}`, {
      name: b,
      servings: S,
      ingredients: T
    }, ge, d === `form`, v ? JSON.stringify(v) : ``);
  function ye() {
    ge ? de(true) : f(v ? `detail` : `list`);
  }
  let be = shoppingActivities.find(e => e.id === R)?.recipePlans?.find(e => e.recipeId === h),
    xe = be && !W ? be.id : H,
    Se = null,
    G = ``;
  if (L && he) try {
    Se = previewRecipeShopping(username, he.id, D, R === `new` ? void 0 : R, xe);
  } catch (e) {
    G = e instanceof Error ? e.message : `Periksa rencana belanja.`;
  }
  (0, React.useEffect)(() => {
    addTrigger && addTrigger !== me.current && Ce(null), me.current = addTrigger ?? 0;
  }, [addTrigger]);
  function K(e) {
    M(e), setTimeout(() => M(``), 3500);
  }
  function Ce(t) {
    let n = Gt(username, `recipe:${t?.id ?? `new`}`, Ir, t ? JSON.stringify(t) : ``);
    y(t), x(n?.name ?? t?.name ?? ``), C(n?.servings ?? t?.servings ?? 1), E(n?.ingredients ?? t?.ingredients.map(e => ({
      ...e
    })) ?? [Br(categories[0] ?? ``)]), pe(!!n), A(``), f(`form`);
  }
  function we(e) {
    g(e.id), O(e.servings), se([]), A(``), f(`detail`);
  }
  function Te(e, t) {
    E(n => n.map(n => n.id === e ? {
      ...n,
      ...t
    } : n)), A(``);
  }
  function Ee() {
    let t = new Date().toISOString(),
      n = {
        id: v?.id ?? `recipe_${crypto.randomUUID()}`,
        name: b,
        servings: S,
        ingredients: T,
        createdAt: v?.createdAt ?? t,
        updatedAt: t
      },
      r = saveRecipe(username, n);
    if (r) {
      A(r);
      return;
    }
    _e(), onRefresh(), g(n.id), O(n.servings), f(`detail`), K(v ? `Resep diperbarui` : `Resep tersimpan. Stok belum berubah.`);
  }
  function De() {
    if (!he) return;
    let t = deleteRecipe(username, he.id);
    if (t) {
      A(t), F(false);
      return;
    }
    onRefresh(), F(false), g(null), f(`list`), K(`Resep dihapus. Riwayat masak tetap tersimpan.`);
  }
  function Oe() {
    if (!he) return;
    let t = planRecipeShopping(username, he.id, D, R === `new` ? void 0 : R, R === `new` ? B : void 0, xe);
    if (t) {
      A(t);
      return;
    }
    ee(false), onRefresh(), onShopping();
  }
  let ke = he ? getRecipeAvailability(he, products, D, itemMasters, oe) : [],
    Ae = ke.length > 0 && ke.every(e => e.shortage === 0),
    je = new Date().toLocaleDateString(`sv-SE`),
    Me = he ? products.filter(e => !e.expiryDate && e.quantity > 0 && (!e.receivedDate || e.receivedDate <= je) && he.ingredients.some(t => t.itemId === e.itemId)) : [],
    Ne = recipes.map(e => {
      let t = getRecipeAvailability(e, products, e.servings, itemMasters);
      return {
        recipe: e,
        missing: t.filter(e => e.shortage > 0).length,
        needsCheck: t.some(e => e.shortage > 0 && e.unverified > 0)
      };
    }),
    Pe = Ne.filter(e => e.missing === 0).length,
    Fe = Ne.filter(e => p === `all` || (p === `ready` ? e.missing === 0 : e.missing > 0));
  return <jsxRuntime.Fragment>{[d === `list` ? <div className={`max-w-[480px] mx-auto px-4 pt-5 pb-28`}>{[<p className={`text-sm mb-5`} style={{
        color: `var(--muted-foreground)`,
        ...Lr
      }}>{`Simpan bahan masakan favorit. Membuat resep tidak mengurangi stok.`}</p>, <div role={`tablist`} aria-label={`Filter resep`} className={`grid grid-cols-3 gap-1 p-1 rounded-xl mb-5`} style={{
        background: `var(--muted)`
      }}>{[{
          id: `all`,
          label: `Semua`,
          count: recipes.length
        }, {
          id: `ready`,
          label: `Siap`,
          count: Pe
        }, {
          id: `missing`,
          label: `Kurang`,
          count: recipes.length - Pe
        }].map(e => {
          let t = p === e.id;
          return <button type={`button`} role={`tab`} aria-selected={t} onClick={() => m(e.id)} className={`rounded-lg py-2.5 text-xs font-black transition-colors`} style={{
            background: t ? `var(--card)` : `transparent`,
            color: t ? `var(--primary)` : `var(--muted-foreground)`,
            boxShadow: t ? `0 1px 5px rgba(0,0,0,0.08)` : `none`,
            ...Lr
          }} key={e.id}>{[e.label, ` `, <span className={`ml-1`}>{e.count}</span>]}</button>;
        })}</div>, Fe.length === 0 ? <div className={`rounded-2xl p-7 text-center`} style={Rr}>{[<p className={`text-4xl mb-3`}>{`🍳`}</p>, <h2 className={`font-black text-lg mb-1`} style={{
          color: `var(--foreground)`,
          ...Lr
        }}>{p === `all` ? `Belum ada resep` : p === `ready` ? `Belum ada resep siap` : `Tidak ada resep yang kurang`}</h2>, <p className={`text-sm mb-5`} style={{
          color: `var(--muted-foreground)`,
          ...Lr
        }}>{p === `all` ? `Tambahkan bahan untuk melihat apa yang tersedia dan kurang.` : p === `ready` ? `Resep akan tampil di sini saat semua bahannya tersedia.` : `Semua resep sudah memiliki bahan yang cukup.`}</p>, p === `all` && <button onClick={() => Ce(null)} className={`px-5 py-3 rounded-xl font-bold text-sm text-white`} style={{
          background: `var(--primary)`
        }}>{`+ Buat Resep`}</button>]}</div> : <div className={`flex flex-col gap-3`}>{Fe.map(({
          recipe: e,
          missing: t,
          needsCheck: n
        }) => <button onClick={() => we(e)} className={`w-full rounded-2xl p-4 text-left flex items-center gap-3`} style={Rr} key={e.id}>{[<span className={`w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl`}>{`🍽️`}</span>, <span className={`flex-1 min-w-0`}>{[<span className={`block font-black text-base truncate`} style={{
              color: `var(--foreground)`,
              ...Lr
            }}>{e.name}</span>, <span className={`block text-xs mt-1`} style={{
              color: `var(--muted-foreground)`,
              ...Lr
            }}>{[e.servings, ` porsi · `, e.ingredients.length, ` bahan`]}</span>]}</span>, <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg`} style={{
            background: t ? `#FEF3C7` : `#DCFCE7`,
            color: t ? `#92400E` : `#166534`
          }}>{t ? n ? `Perlu cek stok` : `${t} kurang` : `Siap`}</span>]}</button>)}</div>]}</div> : d === `form` ? <div className={`fixed inset-0 z-50 overflow-y-auto`} style={{
      background: `#FAFAF8`
    }}>{<div className={`max-w-[480px] mx-auto min-h-screen pb-8`}>{[<RecipePageHeader title={v ? `Edit Resep` : `Buat Resep`} onBack={ye} />, <div className={`px-4 pt-5 space-y-5`}>{[<DraftRestoreNotice restored={fe} storageFailed={ve} />, <section className={`rounded-2xl p-4 space-y-4`} style={Rr}>{[<label className={`block text-sm font-bold`} style={Lr}>{[`Nama resep`, <input value={b} onChange={e => {
                x(e.target.value), A(``);
              }} placeholder={`Contoh: Telur dadar`} className={`w-full rounded-xl p-3 mt-2 outline-none`} style={zr} />]}</label>, <label className={`block text-sm font-bold`} style={Lr}>{[`Hasil (porsi)`, <input type={`number`} min={`1`} max={`100`} step={`1`} value={S} onChange={e => C(Number(e.target.value))} className={`w-full rounded-xl p-3 mt-2 outline-none`} style={zr} />]}</label>]}</section>, <section>{[<h2 className={`font-black text-base mb-1`} style={Lr}>{`Bahan`}</h2>, <p className={`text-xs mb-3`} style={{
              color: `var(--muted-foreground)`
            }}>{`Pilih item untuk tiap bahan. Bahan baru dapat dibuat di Data Master; stoknya tetap nol sampai ditambahkan.`}</p>, <div className={`space-y-3`}>{T.map((e, t) => <div className={`rounded-2xl p-4 space-y-3`} style={Rr} key={e.id}>{[<div className={`flex items-center justify-between`}>{[<strong className={`text-sm`} style={Lr}>{[`Bahan `, t + 1]}</strong>, T.length > 1 && <button onClick={() => E(t => t.filter(t => t.id !== e.id))} className={`text-xs font-bold`} style={{
                    color: `#DC2626`
                  }}>{`Hapus`}</button>]}</div>, <ItemPicker items={itemMasters} value={e.itemId} onAddItem={t => onOpenMasterItem(t => Te(e.id, {
                  itemId: t.id,
                  name: t.name,
                  category: t.category,
                  unit: t.unit
                }), t)} onSelect={t => Te(e.id, {
                  itemId: t?.id,
                  name: t?.name ?? ``,
                  category: t?.category ?? categories[0] ?? ``,
                  unit: t?.unit ?? `buah`
                })} label={`Nama bahan ${t + 1}`} style={{
                  ...zr,
                  width: `100%`,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14
                }} />, <div className={`grid grid-cols-2 gap-3`}>{[<label className={`block text-xs font-bold`} style={Lr}>{[`Jumlah`, <input type={`number`} min={`0.0001`} step={`any`} value={e.quantity} onChange={t => Te(e.id, {
                      quantity: Number(t.target.value)
                    })} className={`w-full rounded-xl p-3 mt-1 outline-none text-sm`} style={zr} />]}</label>, <label className={`block text-xs font-bold`} style={Lr}>{[`Satuan`, <select value={e.unit} disabled={!e.itemId} onChange={t => Te(e.id, {
                      unit: t.target.value
                    })} className={`w-full rounded-xl p-3 mt-1 outline-none text-sm`} style={zr}>{getAllowedUnits(itemMasters.find(t => t.id === e.itemId) ?? {
                        unit: e.unit
                      }).map(e => <option key={e}>{e}</option>)}</select>]}</label>]}</div>, <label className={`block text-xs font-bold`} style={Lr}>{[`Kategori`, <input readOnly={true} value={e.itemId ? e.category : ``} placeholder={`Mengikuti item`} className={`w-full rounded-xl p-3 mt-1 outline-none text-sm`} style={zr} />]}</label>]}</div>)}</div>, <button onClick={() => E(e => [...e, Br(categories[0] ?? ``)])} className={`w-full mt-3 py-3 rounded-xl text-sm font-bold`} style={{
              color: `var(--primary)`,
              background: `#FFF1E9`
            }}>{`+ Tambah Bahan`}</button>]}</section>, k && <p role={`alert`} className={`text-sm p-3 rounded-xl`} style={{
            color: `#B91C1C`,
            background: `#FEF2F2`
          }}>{k}</p>, <button onClick={Ee} className={`w-full py-4 rounded-xl text-sm font-black text-white`} style={{
            background: `var(--primary)`
          }}>{`Simpan Resep`}</button>]}</div>]}</div>}</div> : d === `confirm` && he ? <CookRecipePage username={username} recipe={he} servings={D} products={products} masters={itemMasters} checkedUnknownIds={oe} onRefresh={onRefresh} onBack={() => {
      A(``), f(`detail`);
    }} onSaved={() => {
      f(`detail`), se([]), A(``), K(`Masakan tercatat di Aktivitas dan stok sudah dikurangi.`);
    }} key={`${he.id}:${D}`} /> : he ? <div className={`fixed inset-0 z-50 overflow-y-auto`} style={{
      background: `#FAFAF8`
    }}>{<div className={`max-w-[480px] mx-auto min-h-screen pb-28`}>{[<RecipePageHeader title={`Detail Resep`} onBack={() => {
          A(``), se([]), f(`list`);
        }} />, <div className={`px-4 pt-5 space-y-5`}>{[<div className={`rounded-2xl p-5`} style={Rr}>{[<div className={`flex justify-between gap-3`}>{[<div>{[<p className={`text-xs font-bold mb-1`} style={{
                  color: `var(--primary)`
                }}>{`RESEP`}</p>, <h1 className={`font-black text-xl`} style={{
                  color: `var(--foreground)`,
                  ...Lr
                }}>{he.name}</h1>, <p className={`text-sm mt-1`} style={{
                  color: `var(--muted-foreground)`
                }}>{[he.ingredients.length, ` bahan · resep asli `, he.servings, ` porsi`]}</p>]}</div>, <button onClick={() => Ce(he)} aria-label={`Edit resep`} className={`self-start px-3 py-2 rounded-lg text-sm font-bold`} style={{
                background: `var(--muted)`
              }}>{`Edit`}</button>]}</div>, <button onClick={() => F(true)} className={`text-xs font-bold mt-4`} style={{
              color: `#B91C1C`
            }}>{`Hapus Resep`}</button>]}</div>, <label className={`block text-sm font-bold`} style={Lr}>{[`Porsi yang akan dibuat`, <input type={`number`} min={`1`} max={`100`} step={`1`} value={D} onChange={e => O(Number(e.target.value))} className={`w-full rounded-xl p-3 mt-2 outline-none`} style={zr} />]}</label>, <section>{[<h2 className={`font-black text-base mb-3`} style={Lr}>{`Ketersediaan bahan`}</h2>, <div className={`space-y-2`}>{ke.map(e => <div className={`rounded-2xl p-4`} style={Rr} key={e.ingredient.id}>{[<div className={`flex justify-between gap-3`}>{[<div>{[<p className={`font-black text-sm`} style={Lr}>{e.ingredient.name}</p>, <p className={`text-xs mt-1`} style={{
                      color: `var(--muted-foreground)`
                    }}>{[`Butuh `, e.needed, ` `, e.ingredient.unit, ` · Dihitung tersedia `, e.available, ` `, e.ingredient.unit]}</p>, e.unverified > 0 && <p className={`text-xs mt-1`} style={{
                      color: `#92400E`
                    }}>{[`Ada `, e.unverified, ` `, e.ingredient.unit, ` tanpa tanggal yang belum diperiksa.`]}</p>]}</div>, <span className={`text-xs font-bold shrink-0 self-start px-2 py-1 rounded-lg`} style={{
                    background: e.shortage ? `#FEF3C7` : `#DCFCE7`,
                    color: e.shortage ? `#92400E` : `#166534`
                  }}>{e.shortage ? e.unverified ? `Perlu dicek` : `Kurang ${e.shortage}` : `Cukup`}</span>]}</div>, e.allocations.length > 0 && <details className={`mt-3 text-xs`} style={{
                  color: `var(--muted-foreground)`
                }}>{[<summary className={`cursor-pointer font-bold`}>{`Lihat stok yang dipakai`}</summary>, <div className={`pt-2 space-y-1`}>{e.allocations.map(e => {
                      let t = products.find(t => t.id === e.productId);
                      return <p key={e.productId}>{[e.quantity, ` `, e.unit, ` · `, t ? describeExpiry(t) : `Stok tidak ditemukan`]}</p>;
                    })}</div>]}</details>]}</div>)}</div>]}</section>, Me.length > 0 && <div className={`rounded-xl p-3 space-y-2`} style={{
            background: `#FFFBEB`,
            color: `#92400E`
          }}>{[<p className={`text-xs`}>{`Stok tanpa tanggal perlu diperiksa sebelum dihitung untuk masakan ini. Tanggalnya tetap tercatat sebagai Belum Tahu.`}</p>, <button type={`button`} onClick={() => {
              le(oe), ae(true);
            }} className={`text-sm font-bold py-1`}>{oe.length ? `Tinjau Pemeriksaan Stok` : `Periksa Stok Tanpa Tanggal`}</button>]}</div>, k && <p role={`alert`} className={`text-sm p-3 rounded-xl`} style={{
            color: `#B91C1C`,
            background: `#FEF2F2`
          }}>{k}</p>, <div className={`space-y-2`}>{[<button onClick={() => {
              Ae && (A(``), f(`confirm`));
            }} disabled={!Ae || !Number.isInteger(D) || D < 1 || D > 100} className={`w-full py-4 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
              background: `var(--primary)`
            }}>{[`Catat Masak · `, D, ` porsi`]}</button>, !Ae && <p className={`text-xs text-center`} style={{
              color: `var(--muted-foreground)`
            }}>{`Catat Masak tersedia setelah semua bahan cukup. Lengkapi bahan yang kurang atau periksa stok tanpa tanggal.`}</p>, <button onClick={() => {
              z(shoppingActivities.find(e => !e.completedAt)?.id ?? `new`), V(`Belanja untuk ${he.name}`), U(`meal_${crypto.randomUUID()}`), te(false), A(``), ee(true);
            }} disabled={!Number.isInteger(D) || D < 1 || D > 100} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
              background: `#FFF1E9`,
              color: `var(--primary)`
            }}>{`Rencanakan Bahan ke Belanja`}</button>, !Ae && <button type={`button`} onClick={() => re(true)} className={`w-full py-3 rounded-xl text-sm font-bold`} style={{
              background: `var(--muted)`
            }}>{`Tambah Stok yang Sudah Ada di Dapur`}</button>]}</div>]}</div>]}</div>}</div> : null, ne && <ProductModal title={`Tambah Stok`} categories={categories} locations={locations} itemMasters={itemMasters} username={username} requireMasterItem={true} onRefresh={onRefresh} onOpenMasterItem={onOpenMasterItem} onClose={() => re(false)} onSave={t => {
      let n = addProduct(username, {
        ...t,
        id: `manual_${crypto.randomUUID()}`,
        createdAt: new Date().toISOString()
      });
      return n || (onRefresh(), re(false)), n;
    }} />, ie && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,.5)`
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Periksa stok tanpa tanggal`} className={`w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 pb-8 space-y-4`} style={Rr}>{[<div className={`flex justify-between items-center`}>{[<h2 className={`font-black text-lg`}>{`Periksa Stok Tanpa Tanggal`}</h2>, <button type={`button`} onClick={() => ae(false)} aria-label={`Tutup`} className={`p-2`}>{`×`}</button>]}</div>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{`Centang batch yang kondisinya sudah kamu periksa sebelum dipakai. Pemeriksaan ini berlaku untuk masakan yang sedang dicatat.`}</p>, Me.map(e => <label className={`flex gap-3 rounded-xl p-3 text-sm`} style={{
          background: `var(--muted)`
        }} key={e.id}>{[<input type={`checkbox`} checked={ce.includes(e.id)} onChange={t => le(n => t.target.checked ? [...n, e.id] : n.filter(t => t !== e.id))} className={`mt-1`} />, <span>{[<strong className={`block`}>{e.name}</strong>, <span className={`block text-xs mt-1`}>{[e.quantity, ` `, e.unit, ` · `, e.location || `Tanpa lokasi`, ` · dicatat `, new Date(e.createdAt).toLocaleDateString(`id-ID`)]}</span>, <span className={`block text-xs mt-2`}>{`Saya telah memeriksa kondisi bahan pada batch ini.`}</span>]}</span>]}</label>), <button type={`button`} onClick={() => {
          se(ce.filter(e => Me.some(t => t.id === e))), ae(false);
        }} className={`w-full py-3.5 rounded-xl font-black text-sm text-white`} style={{
          background: `var(--primary)`
        }}>{`Konfirmasi Pemeriksaan`}</button>]}</div>}</div>, L && <div className={`fixed inset-0 z-[70] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,.5)`
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Pilih aktivitas belanja`} className={`w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 pb-8 space-y-4`} style={Rr}>{[<div className={`flex items-center justify-between`}>{[<h2 className={`font-black text-lg`}>{`Masukkan ke Belanja`}</h2>, <button type={`button`} onClick={() => ee(false)} aria-label={`Tutup`}>{`×`}</button>]}</div>, <label className={`block text-sm font-bold`}>{[`Aktivitas belanja`, <select value={R} onChange={e => {
            z(e.target.value), te(false), A(``);
          }} className={`w-full p-3 rounded-xl mt-2 text-sm`} style={zr}>{[shoppingActivities.filter(e => !e.completedAt).map(e => <option value={e.id} key={e.id}>{e.title}</option>), <option value={`new`}>{`+ Buat aktivitas baru`}</option>]}</select>]}</label>, R === `new` && <label className={`block text-sm font-bold`}>{[`Nama aktivitas`, <input maxLength={80} value={B} onChange={e => {
            V(e.target.value), A(``);
          }} className={`w-full p-3 rounded-xl mt-2 text-sm`} style={zr} />]}</label>, be && <div className={`rounded-xl p-3 space-y-2`} style={{
          background: `var(--muted)`
        }}>{[<p className={`text-sm`}>{[`Resep ini sudah direncanakan untuk `, be.servings, ` porsi. Secara default, rencana yang sama diperbarui tanpa digandakan.`]}</p>, <label className={`flex gap-2 text-sm font-bold`}>{[<input type={`checkbox`} checked={W} onChange={e => te(e.target.checked)} />, `Tambahkan sebagai masakan lain (`, D, ` porsi lagi)`]}</label>]}</div>, Se && <section className={`space-y-2`}>{[<h3 className={`font-bold text-sm`}>{[`Kebutuhan gabungan `, Se.plans.length, ` rencana masak`]}</h3>, Se.rows.map(e => <div className={`rounded-xl p-3 text-sm`} style={{
            background: `var(--muted)`
          }} key={e.itemId}>{[<strong>{e.name}</strong>, <p>{[`Butuh `, e.needed, ` `, e.unit, ` · stok di luar belanja ini `, e.available, ` `, e.unit]}</p>, e.unverified > 0 && <p className={`font-bold`} style={{
              color: `#92400E`
            }}>{[`Ada `, e.unverified, ` `, e.unit, ` stok tanpa tanggal yang belum dihitung. Periksa sebelum membeli.`]}</p>, <p>{[`Sudah direncanakan/diterima: `, e.covered, ` `, e.unit]}</p>, <p className={`font-bold`}>{[`Tambahan belanja: `, e.additional, ` `, e.unit]}</p>]}</div>), <p className={`text-xs`} style={{
            color: `var(--muted-foreground)`
          }}>{Se.unchanged ? `Rencana ini sudah tersimpan. Menyimpan lagi tidak menambah jumlah belanja.` : `Hanya kekurangan gabungan yang ditambahkan. Stok yang sama dihitung sekali. Jumlah belanja yang sudah ada tidak dikurangi otomatis; gunakan Edit Rencana jika berlebih.`}</p>]}</section>, G && <p role={`alert`} className={`text-sm text-red-700`}>{G}</p>, k && <p role={`alert`} className={`text-sm`} style={{
          color: `#B91C1C`
        }}>{k}</p>, <button type={`button`} disabled={!!G} onClick={Oe} className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50`} style={{
          background: `var(--primary)`
        }}>{`Simpan Rencana & Tambahan Belanja`}</button>]}</div>}</div>, P && <div className={`fixed inset-0 z-[70] flex items-center justify-center px-4`} style={{
      background: `rgba(0,0,0,.5)`
    }}>{<div role={`dialog`} aria-modal={`true`} aria-label={`Hapus resep`} className={`w-full max-w-sm rounded-2xl p-5 space-y-3`} style={Rr}>{[<h2 className={`font-black text-lg`}>{`Hapus resep?`}</h2>, <p className={`text-sm`} style={{
          color: `var(--muted-foreground)`
        }}>{`Resep dihapus. Aktivitas yang sudah tercatat tetap ada.`}</p>, <button onClick={De} className={`w-full p-3 rounded-xl text-white font-bold text-sm`} style={{
          background: `#DC2626`
        }}>{`Ya, Hapus Resep`}</button>, <button onClick={() => F(false)} className={`w-full p-3 rounded-xl font-bold text-sm`} style={{
          background: `var(--muted)`
        }}>{`Batal`}</button>]}</div>}</div>, ue && <div className={`fixed inset-0 z-[80] flex items-end justify-center`} style={{
      background: `rgba(0,0,0,.52)`
    }}>{<div role={`alertdialog`} aria-modal={`true`} aria-label={`Resep belum disimpan`} className={`w-full max-w-[480px] rounded-t-3xl p-5 pb-8 space-y-4`} style={Rr}>{[<h2 className={`text-lg font-black`}>{`Resep belum disimpan`}</h2>, <p className={`text-sm`}>{`Nama dan bahan yang sudah diisi akan hilang jika kamu keluar.`}</p>, <button type={`button`} onClick={() => de(false)} className={`w-full rounded-xl py-3 font-bold text-white`} style={{
          background: `var(--primary)`
        }}>{`Lanjutkan Mengisi`}</button>, <button type={`button`} onClick={() => {
          _e(), de(false), f(v ? `detail` : `list`);
        }} className={`w-full rounded-xl py-3 font-bold`} style={{
          color: `#B91C1C`
        }}>{`Keluar Tanpa Menyimpan`}</button>]}</div>}</div>, j && <p role={`status`} className={`fixed z-[80] bottom-24 left-1/2 -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg w-max max-w-[90vw]`} style={{
      background: `var(--foreground)`
    }}>{j}</p>]}</jsxRuntime.Fragment>;
}
function RecipePageHeader({
  title: title,
  onBack: onBack
}) {
  return <div className={`sticky top-0 z-10 px-4 pb-3 flex items-center gap-3`} style={{
    background: `var(--card)`,
    boxShadow: `0 1px 8px rgba(0,0,0,.06)`,
    paddingTop: `calc(env(safe-area-inset-top, 16px) + 12px)`
  }}>{[<button onClick={onBack} aria-label={`Kembali`} className={`w-9 h-9 rounded-xl font-bold`} style={{
      background: `var(--muted)`
    }}>{`←`}</button>, <span className={`font-black text-base`} style={Lr}>{title}</span>]}</div>;
}
export { Ar, jr, Mr, Nr, Pr, CookRecipePage, Ir, Lr, Rr, zr, Br, RecipesPage, RecipePageHeader };
