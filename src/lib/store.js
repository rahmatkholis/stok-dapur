// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
var CATEGORIES = [`Bahan Pokok`, `Sayuran`, `Buah`, `Daging & Ikan`, `Susu & Telur`, `Bumbu`, `Minuman`, `Camilan`, `Lainnya`],
  UNITS = [`kg`, `gram`, `liter`, `ml`, `buah`, `bungkus`, `kaleng`, `botol`, `pcs`, `sachet`],
  EXPIRY_LABELS = {
    expired: `Tanggal terlewat`,
    expiring: `≤3 hari lagi`,
    safe: `>3 hari lagi`,
    unknown: `Perlu dicek`
  };
function getExpiryStatus(expiryDate) {
  if (!expiryDate || Number.isNaN(Date.parse(expiryDate))) return `unknown`;
  let t = new Date();
  t.setHours(0, 0, 0, 0);
  let n = new Date(expiryDate);
  n.setHours(0, 0, 0, 0);
  let r = Math.floor((n.getTime() - t.getTime()) / (1e3 * 60 * 60 * 24));
  return r < 0 ? `expired` : r <= 3 ? `expiring` : `safe`;
}
function formatDate(dateString) {
  return !dateString || Number.isNaN(Date.parse(dateString)) ? `Belum diketahui` : new Date(dateString).toLocaleDateString(`id-ID`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`
  });
}
function describeExpiry(e) {
  return !e.expiryDate || Number.isNaN(Date.parse(e.expiryDate)) ? `Tanggal belum diketahui · perlu dicek` : `${e.expiryKind === `estimated` ? `Perkiraan` : `Kedaluwarsa`} ${formatDate(e.expiryDate)}`;
}
var normalizeName = e => e.trim().toLocaleLowerCase(`id-ID`).replace(/\s+/g, ` `),
  E = {
    kg: {
      family: `weight`,
      factor: 1e3
    },
    gram: {
      family: `weight`,
      factor: 1
    },
    liter: {
      family: `volume`,
      factor: 1e3
    },
    ml: {
      family: `volume`,
      factor: 1
    }
  };
function getUnitFamily(e) {
  return E[e]?.family ?? e;
}
function getUnitFactor(e) {
  return E[e]?.factor ?? 1;
}
function roundQuantity(e) {
  return Math.round(e * 1e4) / 1e4;
}
function convertBaseUnit(e, t, n) {
  if (getUnitFamily(t) !== getUnitFamily(n)) throw Error(`Satuan ${t} dan ${n} tidak sesuai.`);
  return roundQuantity(e * getUnitFactor(t) / getUnitFactor(n));
}
var j = [`botol`, `bungkus`, `kaleng`, `pcs`, `sachet`],
  M = [`gram`, `kg`, `ml`, `liter`];
function getAllowedUnits(e) {
  let t = getUnitFamily(e.unit),
    n = [e.unit, ...Object.keys(E).filter(e => getUnitFamily(e) === t)];
  if (e.packageUnit && e.packageSize && e.packageSizeUnit) {
    let t = getUnitFamily(e.packageSizeUnit);
    n.push(e.packageUnit, ...Object.keys(E).filter(e => getUnitFamily(e) === t));
  }
  return [...new Set(n)];
}
function convertItemUnit(e, t, n, r) {
  if (!Number.isFinite(e) || e < 0) throw Error(`Jumlah harus valid.`);
  if (t === n || getUnitFamily(t) === getUnitFamily(n)) return convertBaseUnit(e, t, n);
  let {
    packageUnit: i,
    packageSize: a,
    packageSizeUnit: o
  } = r;
  if (i && a && o) {
    if (t === i && getUnitFamily(n) === getUnitFamily(o)) return convertBaseUnit(e * a, o, n);
    if (n === i && getUnitFamily(t) === getUnitFamily(o)) return roundQuantity(e * getUnitFactor(t) / (a * getUnitFactor(o)));
  }
  throw Error(`Satuan ${t} dan ${n} tidak sesuai untuk item ini. Atur isi kemasan di Data Master jika diperlukan.`);
}
function todayDate() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function getRecipeAvailability(recipe, products, servings = recipe.servings, masters = [], checkedUnknownIds = []) {
  let a = servings / recipe.servings,
    o = todayDate();
  return recipe.ingredients.map(e => {
    let n = masters.find(t => t.id === e.itemId) ?? {
        unit: e.unit
      },
      s = t => (e.itemId && t.itemId ? t.itemId === e.itemId : normalizeName(t.name) === normalizeName(e.name)) && getAllowedUnits(n).includes(t.unit) && getAllowedUnits(n).includes(e.unit) && t.quantity > 0 && (!t.receivedDate || t.receivedDate <= o),
      c = products.filter(e => s(e) && (e.expiryDate >= o || !e.expiryDate && checkedUnknownIds.includes(e.id))).sort((e, t) => (e.expiryDate || `9999-12-31`).localeCompare(t.expiryDate || `9999-12-31`) || e.createdAt.localeCompare(t.createdAt)),
      l = products.filter(e => s(e) && !e.expiryDate && !checkedUnknownIds.includes(e.id)),
      u = roundQuantity(e.quantity * a),
      d = roundQuantity(c.reduce((t, r) => t + convertItemUnit(r.quantity, r.unit, e.unit, n), 0)),
      f = u,
      p = [];
    for (let t of c) {
      if (f <= 0) break;
      let r = roundQuantity(Math.min(t.quantity, convertItemUnit(f, e.unit, t.unit, n)));
      r <= 0 || (p.push({
        productId: t.id,
        productName: t.name,
        category: t.category,
        unit: t.unit,
        quantity: r
      }), f = roundQuantity(f - convertItemUnit(r, t.unit, e.unit, n)));
    }
    return {
      ingredient: e,
      needed: u,
      available: d,
      unverified: roundQuantity(l.reduce((t, r) => t + convertItemUnit(r.quantity, r.unit, e.unit, n), 0)),
      shortage: roundQuantity(Math.max(0, u - d, f)),
      allocations: p
    };
  });
}
var L = [{
  name: `Beras Pandan Wangi`,
  category: `Bahan Pokok`,
  quantity: 5,
  unit: `kg`,
  expiryDate: `2027-03-15`,
  location: `Lemari dapur`
}, {
  name: `Mie Instan Goreng`,
  category: `Bahan Pokok`,
  quantity: 12,
  unit: `bungkus`,
  expiryDate: `2026-12-01`,
  location: `Lemari dapur`
}, {
  name: `Tepung Terigu Segitiga`,
  category: `Bahan Pokok`,
  quantity: 1,
  unit: `kg`,
  expiryDate: `2026-10-02`,
  location: `Lemari dapur`
}, {
  name: `Gula Pasir`,
  category: `Bahan Pokok`,
  quantity: 2,
  unit: `kg`,
  expiryDate: `2027-06-20`,
  location: `Toples`
}, {
  name: `Minyak Goreng Bimoli`,
  category: `Bahan Pokok`,
  quantity: 2,
  unit: `liter`,
  expiryDate: `2026-09-27`,
  location: `Rak bawah`
}, {
  name: `Bayam Organik`,
  category: `Sayuran`,
  quantity: 250,
  unit: `gram`,
  expiryDate: `2026-10-01`,
  location: `Kulkas bawah`
}, {
  name: `Wortel Baby`,
  category: `Sayuran`,
  quantity: 500,
  unit: `gram`,
  expiryDate: `2026-10-08`,
  location: `Kulkas bawah`
}, {
  name: `Brokoli Segar`,
  category: `Sayuran`,
  quantity: 1,
  unit: `buah`,
  expiryDate: `2026-09-28`,
  location: `Kulkas atas`
}, {
  name: `Kangkung Lokal`,
  category: `Sayuran`,
  quantity: 300,
  unit: `gram`,
  expiryDate: `2026-10-02`,
  location: `Kulkas bawah`
}, {
  name: `Tomat Cherry`,
  category: `Sayuran`,
  quantity: 200,
  unit: `gram`,
  expiryDate: `2026-10-12`,
  location: `Kulkas atas`
}, {
  name: `Pisang Cavendish`,
  category: `Buah`,
  quantity: 6,
  unit: `buah`,
  expiryDate: `2026-10-03`,
  location: `Meja makan`
}, {
  name: `Jeruk Mandarin`,
  category: `Buah`,
  quantity: 8,
  unit: `buah`,
  expiryDate: `2026-10-15`,
  location: `Kulkas atas`
}, {
  name: `Apel Fuji`,
  category: `Buah`,
  quantity: 4,
  unit: `buah`,
  expiryDate: `2026-10-20`,
  location: `Kulkas atas`
}, {
  name: `Mangga Harum Manis`,
  category: `Buah`,
  quantity: 3,
  unit: `buah`,
  expiryDate: `2026-09-29`,
  location: `Meja makan`
}, {
  name: `Semangka Tanpa Biji`,
  category: `Buah`,
  quantity: .5,
  unit: `buah`,
  expiryDate: `2026-10-01`,
  location: `Kulkas bawah`
}, {
  name: `Ayam Fillet Dada`,
  category: `Daging & Ikan`,
  quantity: 600,
  unit: `gram`,
  expiryDate: `2026-10-02`,
  location: `Freezer`
}, {
  name: `Daging Sapi Giling`,
  category: `Daging & Ikan`,
  quantity: 400,
  unit: `gram`,
  expiryDate: `2026-09-28`,
  location: `Freezer`
}, {
  name: `Ikan Salmon Slice`,
  category: `Daging & Ikan`,
  quantity: 300,
  unit: `gram`,
  expiryDate: `2026-10-01`,
  location: `Freezer`
}, {
  name: `Udang Segar Kupas`,
  category: `Daging & Ikan`,
  quantity: 250,
  unit: `gram`,
  expiryDate: `2026-10-05`,
  location: `Freezer`
}, {
  name: `Bakso Sapi Frozen`,
  category: `Daging & Ikan`,
  quantity: 500,
  unit: `gram`,
  expiryDate: `2026-11-30`,
  location: `Freezer`
}, {
  name: `Telur Ayam Kampung`,
  category: `Susu & Telur`,
  quantity: 10,
  unit: `buah`,
  expiryDate: `2026-10-14`,
  location: `Kulkas pintu`
}, {
  name: `Susu UHT Full Cream`,
  category: `Susu & Telur`,
  quantity: 4,
  unit: `kaleng`,
  expiryDate: `2027-02-28`,
  location: `Lemari dapur`
}, {
  name: `Yoghurt Greek Plain`,
  category: `Susu & Telur`,
  quantity: 500,
  unit: `gram`,
  expiryDate: `2026-10-03`,
  location: `Kulkas atas`
}, {
  name: `Keju Cheddar Kraft`,
  category: `Susu & Telur`,
  quantity: 180,
  unit: `gram`,
  expiryDate: `2026-10-25`,
  location: `Kulkas pintu`
}, {
  name: `Mentega Anchor`,
  category: `Susu & Telur`,
  quantity: 200,
  unit: `gram`,
  expiryDate: `2026-11-15`,
  location: `Kulkas pintu`
}, {
  name: `Kecap Manis ABC`,
  category: `Bumbu`,
  quantity: 1,
  unit: `botol`,
  expiryDate: `2027-04-10`,
  location: `Rak bumbu`
}, {
  name: `Saus Tiram Fiesta`,
  category: `Bumbu`,
  quantity: 1,
  unit: `botol`,
  expiryDate: `2026-09-26`,
  location: `Kulkas pintu`
}, {
  name: `Garam Himalaya`,
  category: `Bumbu`,
  quantity: 500,
  unit: `gram`,
  expiryDate: `2028-01-01`,
  location: `Rak bumbu`
}, {
  name: `Merica Bubuk`,
  category: `Bumbu`,
  quantity: 50,
  unit: `gram`,
  expiryDate: `2026-12-31`,
  location: `Rak bumbu`
}, {
  name: `Kaldu Ayam Masako`,
  category: `Bumbu`,
  quantity: 8,
  unit: `sachet`,
  expiryDate: `2027-05-20`,
  location: `Rak bumbu`
}, {
  name: `Air Mineral Aqua 1.5L`,
  category: `Minuman`,
  quantity: 6,
  unit: `botol`,
  expiryDate: `2027-08-15`,
  location: `Rak bawah`
}, {
  name: `Jus Jeruk Minute Maid`,
  category: `Minuman`,
  quantity: 3,
  unit: `kaleng`,
  expiryDate: `2026-10-02`,
  location: `Kulkas atas`
}, {
  name: `Teh Pucuk Harum`,
  category: `Minuman`,
  quantity: 4,
  unit: `botol`,
  expiryDate: `2026-11-10`,
  location: `Kulkas atas`
}, {
  name: `Kopi Kapal Api Bubuk`,
  category: `Minuman`,
  quantity: 200,
  unit: `gram`,
  expiryDate: `2027-01-25`,
  location: `Lemari dapur`
}, {
  name: `Sirup Marjan Cocopandan`,
  category: `Minuman`,
  quantity: 1,
  unit: `botol`,
  expiryDate: `2026-09-25`,
  location: `Kulkas pintu`
}, {
  name: `Keripik Kentang Lays`,
  category: `Camilan`,
  quantity: 3,
  unit: `bungkus`,
  expiryDate: `2026-10-30`,
  location: `Lemari dapur`
}, {
  name: `Biskuit Marie Regal`,
  category: `Camilan`,
  quantity: 2,
  unit: `bungkus`,
  expiryDate: `2026-09-29`,
  location: `Toples`
}, {
  name: `Coklat Kit Kat`,
  category: `Camilan`,
  quantity: 5,
  unit: `buah`,
  expiryDate: `2026-12-15`,
  location: `Kulkas pintu`
}, {
  name: `Kacang Mede Panggang`,
  category: `Camilan`,
  quantity: 150,
  unit: `gram`,
  expiryDate: `2026-10-03`,
  location: `Toples`
}, {
  name: `Popcorn Caramel Garrett`,
  category: `Camilan`,
  quantity: 1,
  unit: `kaleng`,
  expiryDate: `2026-10-18`,
  location: `Lemari dapur`
}, {
  name: `Madu Hutan Murni`,
  category: `Lainnya`,
  quantity: 350,
  unit: `gram`,
  expiryDate: `2028-05-01`,
  location: `Lemari dapur`
}, {
  name: `Selai Kacang Skippy`,
  category: `Lainnya`,
  quantity: 340,
  unit: `gram`,
  expiryDate: `2026-09-27`,
  location: `Lemari dapur`
}, {
  name: `Roti Tawar Sari Roti`,
  category: `Lainnya`,
  quantity: 1,
  unit: `bungkus`,
  expiryDate: `2026-10-02`,
  location: `Meja makan`
}, {
  name: `Agar-Agar Swallow`,
  category: `Lainnya`,
  quantity: 3,
  unit: `bungkus`,
  expiryDate: `2027-07-30`,
  location: `Lemari dapur`
}, {
  name: `Santan Kara Instan`,
  category: `Lainnya`,
  quantity: 6,
  unit: `sachet`,
  expiryDate: `2026-11-05`,
  location: `Lemari dapur`
}];
function seedProducts(username) {
  let t = getUserData(username);
  if (!t.demoSeeded) {
    if (!t.products.length && !t.shoppingItems.length && !t.activityLog?.length && !Object.keys(t.productArchive ?? {}).length) {
      let e = new Date().toISOString();
      t.products = L.map((t, n) => ({
        ...t,
        id: `seed_${n}_${Date.now()}`,
        createdAt: e
      })), t.locations = [...new Set([...(t.locations ?? []), ...t.products.map(e => e.location).filter(e => !!e)])];
    }
    t.demoSeeded = true, saveUserData(username, t);
  }
}
var USERS_KEY = `dapur_users`,
  SESSION_KEY = `dapur_session`;
function getDB() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || `{}`);
  } catch {
    return {};
  }
}
function saveDB(e) {
  localStorage.setItem(USERS_KEY, JSON.stringify(e));
}
function register(username, password, email = ``) {
  let r = getDB();
  return r[username] ? `Username sudah dipakai.` : (r[username] = {
    password: password,
    profile: {
      displayName: username,
      email: email
    },
    data: {
      products: [],
      shoppingItems: []
    }
  }, saveDB(r), localStorage.setItem(SESSION_KEY, username), null);
}
function getProfile(username) {
  return getDB()[username]?.profile ?? {
    displayName: username,
    email: ``
  };
}
function updateProfile(username, displayName) {
  let n = getDB();
  return n[username] ? (n[username].profile = {
    ...(n[username].profile ?? {
      email: ``
    }),
    displayName: displayName
  }, saveDB(n), null) : `Akun tidak ditemukan.`;
}
function updatePassword(username, current, next) {
  let r = getDB();
  return r[username] ? r[username].password === current ? (r[username].password = next, saveDB(r), null) : `Kata sandi saat ini salah.` : `Akun tidak ditemukan.`;
}
function login(username, password) {
  let n = getDB();
  return n[username] ? n[username].password === password ? (localStorage.setItem(SESSION_KEY, username), null) : `Password salah.` : `Akun tidak ditemukan.`;
}
function logout() {
  localStorage.removeItem(SESSION_KEY);
}
function getSession() {
  return localStorage.getItem(SESSION_KEY);
}
function getUserData(username) {
  return normalizeData(username, getDB()[username]?.data ?? {
    products: [],
    shoppingItems: []
  });
}
function saveUserData(username, data) {
  let n = getDB();
  n[username] && (n[username].data = normalizeData(username, data), saveDB(n));
}
function readLegacyLog(e) {
  let t = JSON.parse(localStorage.getItem(`dapur_log_${e}`) || `[]`);
  if (!Array.isArray(t)) throw Error(`Data riwayat tidak valid.`);
  return t.filter(e => !!e && typeof e == `object` && Array.isArray(e.items));
}
function normalizeData(username, data) {
  let n = data.productArchive ?? {},
    r = data.activityLog ?? readLegacyLog(username),
    i = r.map(e => {
      let t = r.find(t => t.reversalOf === e.id);
      return t && !e.cancelledAt ? {
        ...e,
        cancelledAt: t.createdAt
      } : e;
    }),
    a = [...data.products, ...Object.values(n), ...data.shoppingItems.flatMap(e => (e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : []).map(e => e.product)), ...i.flatMap(e => e.items.flatMap(e => e.productSnapshot ? [e.productSnapshot] : []))],
    o = data.recipes ?? [],
    s = data.categories ?? [...new Set([...CATEGORIES, ...a.map(e => e.category), ...data.shoppingItems.map(e => e.category), ...o.flatMap(e => e.ingredients.map(e => e.category)), ...i.flatMap(e => e.items.map(e => e.category))].filter(Boolean))],
    c = data.locations ?? [...new Set(a.map(e => e.location?.trim()).filter(e => !!e))],
    l = [...(data.itemMasters ?? [])],
    u = e => {
      if (e.itemId && l.some(t => t.id === e.itemId)) return e;
      let t = le(e.name, e.unit),
        n = l.find(e => le(e.name, e.unit) === t);
      return n || (n = {
        id: e.itemId || `legacy_${encodeURIComponent(t)}`,
        name: e.name.trim(),
        category: e.category,
        unit: e.unit,
        active: true
      }, l.push(n)), {
        ...e,
        itemId: n.id
      };
    },
    d = data.products.map(u),
    f = [...(data.shoppingActivities ?? [])],
    p = data.shoppingItems.filter(e => !e.activityId);
  if (p.length && !f.some(e => e.id === `legacy_shopping`)) {
    let e = p.map(e => e.createdAt).sort()[0] ?? new Date().toISOString();
    f.push({
      id: `legacy_shopping`,
      title: `Belanja Sebelumnya`,
      createdAt: e,
      updatedAt: e
    });
  }
  let m = data.shoppingItems.map(e => {
      let t = (e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : []).map(e => {
        let t = d.find(t => t.id === e.productId) ?? n[e.productId];
        return {
          ...e,
          product: t ? {
            ...t,
            quantity: e.quantity
          } : e.product
        };
      });
      return u({
        ...e,
        activityId: e.activityId ?? `legacy_shopping`,
        receipts: t,
        receipt: t.at(-1)
      });
    }),
    h = o.map(e => ({
      ...e,
      ingredients: e.ingredients.map(u)
    })),
    g = Object.fromEntries(Object.entries(n).map(([e, t]) => [e, u(t)]));
  return {
    ...data,
    products: d,
    shoppingItems: m,
    shoppingActivities: f,
    recipes: h,
    activityLog: i,
    productArchive: g,
    categories: s,
    locations: c,
    itemMasters: l
  };
}
function le(e, t) {
  return `${e.trim().toLocaleLowerCase(`id-ID`).replace(/\s+/g, ` `)}|${getUnitFamily(t)}`;
}
function ue(e, t, n, r, i) {
  let a = e.itemMasters,
    o = i ? a.find(e => e.id === i) : void 0;
  if (i && !o && fail(`Master Item tidak ditemukan. Pilih kembali item.`), i || (o = a.find(e => le(e.name, e.unit) === le(t, r))), o) return o.active || fail(`${o.name} sudah diarsipkan. Aktifkan kembali di Data Master.`), getAllowedUnits(o).includes(r) || fail(`Satuan ${r} belum tersedia untuk ${o.name}. Atur isi kemasan di Data Master.`), o;
  fail(`Item belum ada di Data Master. Pilih item atau buat item baru terlebih dahulu.`);
}
function saveItemMaster(e, t, n) {
  return transact(e, e => {
    let r = t.name.trim();
    (!r || r.length > 80 || !e.categories.includes(t.category) || !t.unit) && fail(`Isi nama, kategori, dan satuan item.`);
    let i = !!(t.packageUnit || t.packageSize || t.packageSizeUnit);
    if (i && (!t.packageUnit || !t.packageSizeUnit || !t.packageSize || !Number.isFinite(t.packageSize) || t.packageSize <= 0 || t.packageSize > 1e6 || ![`botol`, `bungkus`, `kaleng`, `pcs`, `sachet`].includes(t.packageUnit) || ![`gram`, `kg`, `ml`, `liter`].includes(t.packageSizeUnit)) && fail(`Isi satuan kemasan dan isi per kemasan yang valid.`), i && getUnitFamily(t.unit) !== getUnitFamily(t.packageSizeUnit) && t.unit !== t.packageUnit && fail(`Satuan dasar harus sejenis dengan isi kemasan atau sama dengan satuan kemasan.`), e.itemMasters.find(e => e.id !== n && le(e.name, e.unit) === le(r, t.unit)) && fail(`Item dengan nama dan satuan ini sudah ada.`), !n) {
      e.itemMasters.push({
        ...t,
        name: r,
        id: `item_${crypto.randomUUID()}`,
        active: true
      });
      return;
    }
    let a = e.itemMasters.find(e => e.id === n);
    a || fail(`Item master tidak ditemukan.`);
    let o = [...e.products, ...Object.values(e.productArchive), ...e.shoppingItems, ...e.recipes.flatMap(e => e.ingredients)].some(e => e.itemId === n);
    a.unit !== t.unit && o && fail(`Satuan dasar tidak dapat diubah karena item sudah dipakai. Buat item baru jika satuannya berbeda.`), o && a.packageUnit && (a.packageUnit !== t.packageUnit || a.packageSize !== t.packageSize || a.packageSizeUnit !== t.packageSizeUnit) && fail(`Isi kemasan sudah digunakan oleh stok, belanja, atau resep. Buat Master Item baru jika ukurannya berbeda.`), Object.assign(a, {
      ...t,
      name: r
    }), e.products = e.products.map(e => e.itemId === n ? {
      ...e,
      name: r,
      category: t.category
    } : e), e.productArchive = Object.fromEntries(Object.entries(e.productArchive).map(([e, i]) => [e, i.itemId === n ? {
      ...i,
      name: r,
      category: t.category
    } : i])), e.shoppingItems = e.shoppingItems.map(e => e.itemId === n && !e.bought ? {
      ...e,
      name: r,
      category: t.category
    } : e), e.recipes = e.recipes.map(e => ({
      ...e,
      ingredients: e.ingredients.map(e => e.itemId === n ? {
        ...e,
        name: r,
        category: t.category
      } : e)
    }));
  });
}
function setItemMasterActive(e, t, n) {
  return transact(e, e => {
    let r = e.itemMasters.find(e => e.id === t);
    r || fail(`Item master tidak ditemukan.`), !n && (e.products.some(e => e.itemId === t) || e.shoppingItems.some(e => !e.bought && e.itemId === t) || e.recipes.some(e => e.ingredients.some(e => e.itemId === t))) && fail(`Item masih memiliki stok, belanja tertunda, atau dipakai di resep. Selesaikan data tersebut sebelum mengarsipkan.`), r.active = n;
  });
}
function pe(e) {
  return e === `category` ? `categories` : `locations`;
}
function me(e, t) {
  return e[pe(t)];
}
function he(e, t) {
  return e.trim().toLocaleLowerCase(`id-ID`) === t.trim().toLocaleLowerCase(`id-ID`);
}
function ge(e, t, n) {
  let r = e => e === n ? 1 : 0,
    i = e => r(t === `category` ? e.category : e.location);
  return (t === `category` ? e.itemMasters.filter(e => e.category === n).length : 0) + e.products.reduce((e, t) => e + i(t), 0) + Object.values(e.productArchive).reduce((e, t) => e + i(t), 0) + e.shoppingItems.reduce((e, n) => e + (t === `category` ? r(n.category) : 0) + (n.receipts?.length ? n.receipts : n.receipt ? [n.receipt] : []).reduce((e, t) => e + i(t.product), 0), 0) + (t === `category` ? e.recipes.reduce((e, t) => e + t.ingredients.reduce((e, t) => e + r(t.category), 0), 0) : 0) + e.activityLog.reduce((e, n) => e + n.items.reduce((e, n) => e + (t === `category` ? r(n.category) : 0) + (n.productSnapshot ? i(n.productSnapshot) : 0), 0), 0);
}
function _e(e, t, n) {
  return ge(getUserData(e), t, n);
}
function ve(e, t, n, r) {
  let i = e => t === `category` ? e.category === n ? {
    ...e,
    category: r
  } : e : e.location === n ? {
    ...e,
    location: r || void 0
  } : e;
  e.products = e.products.map(i), t === `category` && (e.itemMasters = e.itemMasters.map(e => e.category === n ? {
    ...e,
    category: r
  } : e)), e.productArchive = Object.fromEntries(Object.entries(e.productArchive).map(([e, t]) => [e, i(t)])), e.shoppingItems = e.shoppingItems.map(e => ({
    ...e,
    category: t === `category` && e.category === n ? r : e.category,
    receipt: e.receipt ? {
      ...e.receipt,
      product: i(e.receipt.product)
    } : void 0,
    receipts: e.receipts?.map(e => ({
      ...e,
      product: i(e.product)
    }))
  })), t === `category` && (e.recipes = e.recipes.map(e => ({
    ...e,
    ingredients: e.ingredients.map(e => e.category === n ? {
      ...e,
      category: r
    } : e)
  }))), e.activityLog = e.activityLog.map(e => ({
    ...e,
    items: e.items.map(e => ({
      ...e,
      category: t === `category` && e.category === n ? r : e.category,
      productSnapshot: e.productSnapshot ? i(e.productSnapshot) : void 0
    }))
  }));
}
function addMasterListValue(e, t, n) {
  return transact(e, e => {
    let r = n.trim();
    (!r || r.length > 60) && fail(`Isi nama 1–60 karakter.`), me(e, t).some(e => he(e, r)) && fail(`Nama ini sudah ada.`), me(e, t).push(r);
  });
}
function renameMasterListValue(e, t, n, r) {
  return transact(e, e => {
    let i = me(e, t);
    i.includes(n) || fail(`Data master tidak ditemukan. Muat ulang halaman.`);
    let a = r.trim();
    (!a || a.length > 60) && fail(`Isi nama 1–60 karakter.`), i.some(e => e !== n && he(e, a)) && fail(`Nama ini sudah ada.`), i[i.indexOf(n)] = a, n !== a && ve(e, t, n, a);
  });
}
function removeMasterListValue(e, t, n, r) {
  return transact(e, e => {
    let i = me(e, t);
    i.includes(n) || fail(`Data master tidak ditemukan. Muat ulang halaman.`), t === `category` && i.length === 1 && fail(`Sisakan minimal satu kategori.`), ge(e, t, n) && (t === `location` ? (r && (r === n || !i.includes(r)) && fail(`Pilihan lokasi tujuan tidak valid.`), ve(e, t, n, r || ``)) : (r || fail(`Pilih tujuan pemindahan data terlebih dahulu.`), (r === n || !i.includes(r)) && fail(`Pilihan tujuan tidak valid.`), ve(e, t, n, r))), e[pe(t)] = i.filter(e => e !== n);
  });
}
function transact(username, change) {
  try {
    let n = getDB();
    if (!n[username]) return `Akun tidak ditemukan.`;
    let r = normalizeData(username, n[username].data);
    return change(r), n[username].data = r, saveDB(n), null;
  } catch (e) {
    return e instanceof Error ? e.message : `Gagal menyimpan perubahan. Coba lagi.`;
  }
}
function fail(e) {
  throw Error(e);
}
function roundStockQuantity(e) {
  return Math.round(e * 1e4) / 1e4;
}
function isValidPositiveQuantity(e) {
  return Number.isFinite(e) && e >= 1e-4 && roundStockQuantity(e) === e;
}
function isValidCalendarDate(e) {
  return /^\d{4}-\d{2}-\d{2}$/.test(e) && !Number.isNaN(Date.parse(e)) && new Date(e).toISOString().slice(0, 10) === e;
}
function hasValidExpiry(e) {
  let t = e.expiryKind ?? `package`;
  return t === `unknown` ? e.expiryDate === `` : (t === `package` || t === `estimated`) && isValidCalendarDate(e.expiryDate);
}
function Ee(e = new Date()) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function validateReceivedDate(e) {
  e.receivedDate && (!isValidCalendarDate(e.receivedDate) || e.receivedDate > Ee()) && fail(`Tanggal stok tersedia harus hari ini atau sebelumnya.`);
}
function isActiveLedgerEvent(e) {
  return !e.cancelledAt && !e.reversalOf;
}
function getStockCorrectionConflicts(e, t, n) {
  let r = Ye(t?.items ?? []),
    i = Ye(n?.items ?? []);
  return [...new Set([...r.keys(), ...i.keys()])].flatMap(a => {
    let o = roundStockQuantity((r.get(a) ?? 0) - (i.get(a) ?? 0));
    if (!o) return [];
    let s = e.activityLog.find(e => e.action === `adjusted` && isActiveLedgerEvent(e) && e.adjustment?.productId === a && [t, n].some(t => t && (t.date < e.date || t.date === e.date && t.createdAt <= e.createdAt))),
      c = e.products.find(e => e.id === a) ?? e.productArchive[a];
    return s && c ? [{
      product: c,
      adjustmentId: s.id,
      adjustmentDate: s.date,
      projectedQuantity: roundStockQuantity(c.quantity + o)
    }] : [];
  });
}
function previewStockCorrectionConflicts(e, t, n) {
  let r = getUserData(e);
  return getStockCorrectionConflicts(r, t ? r.activityLog.find(e => e.id === t.id) : void 0, n);
}
function validatePhysicalStockConfirmations(e, t) {
  for (let n of e) {
    let e = t.find(e => e.productId === n.product.id);
    e || fail(`Stok ${n.product.name} pernah dihitung ulang. Konfirmasi jumlah fisik sekarang sebelum menyimpan koreksi.`), (e.expectedQuantity !== n.product.quantity || e.adjustmentId !== n.adjustmentId) && fail(`Stok berubah sejak konfirmasi dibuka. Tutup lalu periksa kembali.`), (!Number.isFinite(e.quantity) || e.quantity < 0 || roundStockQuantity(e.quantity) !== e.quantity) && fail(`Jumlah fisik harus valid, minimal 0.`);
  }
}
function applyPhysicalStockConfirmations(e, t, n) {
  for (let r of t) {
    let t = n.find(e => e.productId === r.product.id),
      i = e.products.find(e => e.id === t.productId) ?? e.productArchive[t.productId];
    i.quantity !== t.quantity && We(e, i, t.quantity, `Konfirmasi stok fisik setelah koreksi catatan`);
  }
}
function validateStockActivity(e, t) {
  (!t.title.trim() || !t.items.length || !isValidCalendarDate(t.date) || t.date > Ee()) && fail(`Isi nama, minimal satu produk, dan tanggal hari ini atau sebelumnya.`);
  for (let n of t.items) {
    let r = e.products.find(e => e.id === n.productId) ?? e.productArchive[n.productId] ?? n.productSnapshot;
    r?.receivedDate && t.date < r.receivedDate && fail(`${r.name} baru tersedia pada ${r.receivedDate}. Periksa tanggal aktivitas atau tanggal stok tersedia di Inventori.`), t.action === `used` && r?.expiryDate && r.expiryDate < t.date && fail(`${r.name} sudah melewati tanggal kedaluwarsa pada tanggal aktivitas. Periksa tanggal kejadian atau pilih batch yang sesuai.`);
  }
}
function writeBatchQuantity(e, t, n) {
  let r = {
    ...t,
    quantity: roundStockQuantity(n)
  };
  if (r.quantity > 0) {
    let t = e.itemMasters.find(e => e.id === r.itemId);
    t && (t.active = true);
  }
  e.productArchive[t.id] = r, e.products = e.products.filter(e => e.id !== t.id), r.quantity > 0 && e.products.unshift(r);
}
function registerBatchMasterValues(e, t) {
  e.categories.includes(t.category) || e.categories.push(t.category), t.location && !e.locations.includes(t.location) && e.locations.push(t.location);
}
function normalizeStockQuantity(e, t, n) {
  isValidPositiveQuantity(e) || fail(`Jumlah harus lebih dari 0, maksimal 4 angka desimal.`);
  let r = convertItemUnit(e, t, n.unit, n);
  return (!isValidPositiveQuantity(r) || Math.abs(convertItemUnit(r, n.unit, t, n) - e) > 5e-5) && fail(`Jumlah ${e} ${t} terlalu kecil untuk disimpan dalam ${n.unit}. Gunakan satuan dasar yang lebih kecil di Data Master.`), r;
}
function addProduct(username, product) {
  return transact(username, e => {
    validateReceivedDate(product), (!isValidPositiveQuantity(product.quantity) || !hasValidExpiry(product)) && fail(`Isi jumlah dan informasi kedaluwarsa yang valid.`);
    let n = ue(e, product.name, product.category, product.unit, product.itemId),
      r = {
        ...product,
        quantity: normalizeStockQuantity(product.quantity, product.unit, n),
        unit: n.unit,
        name: n.name,
        category: n.category,
        itemId: n.id
      };
    r.stockSource = `manual`, r.initialQuantity = r.quantity, registerBatchMasterValues(e, r), e.products.unshift(r), e.productArchive[r.id] = r;
  });
}
function updateProduct(username, updated) {
  return transact(username, e => {
    let n = e.products.find(e => e.id === updated.id);
    n || fail(`Stok tidak ditemukan. Muat ulang inventori.`), (n.quantity !== updated.quantity || n.unit !== updated.unit || n.itemId !== updated.itemId) && fail(`Untuk mengubah jumlah gunakan Sesuaikan Stok. Item dan satuan stok tidak dapat diganti.`), hasValidExpiry(updated) || fail(`Informasi kedaluwarsa tidak valid.`), validateReceivedDate(updated), updated.receivedDate && e.activityLog.some(e => isActiveLedgerEvent(e) && e.action !== `adjusted` && e.date < updated.receivedDate && e.items.some(e => e.productId === updated.id)) && fail(`Tanggal stok tersedia melewati aktivitas yang sudah tercatat. Koreksi tanggal aktivitas terkait terlebih dahulu.`);
    let r = ue(e, updated.name, updated.category, updated.unit, updated.itemId),
      i = {
        ...updated,
        stockSource: n.stockSource,
        initialQuantity: n.initialQuantity,
        name: r.name,
        category: r.category,
        itemId: r.id
      };
    registerBatchMasterValues(e, i), e.products = e.products.map(e => e.id === i.id ? i : e), e.productArchive[i.id] = i, ze(e, i);
  });
}
function ze(e, t) {
  for (let n of e.shoppingItems) {
    let e = (n.receipts?.length ? n.receipts : n.receipt ? [n.receipt] : []).map(e => e.productId === t.id ? {
      ...e,
      product: {
        ...t,
        quantity: e.quantity
      }
    } : e);
    e.length && (n.receipts = e, n.receipt = e.at(-1));
  }
}
function Be(e, t) {
  let n = e.shoppingItems.find(e => (e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : []).some(e => e.productId === t)),
    r = e.activityLog.filter(e => isActiveLedgerEvent(e) && e.items.some(e => e.productId === t));
  return {
    purchase: n ? {
      itemId: n.id,
      activityId: n.activityId
    } : null,
    activities: r
  };
}
function Ve(e, t) {
  return Be(getUserData(e), t);
}
function readBatchLedger(e, t) {
  let n = getUserData(e),
    r = n.products.find(e => e.id === t) ?? n.productArchive?.[t];
  if (!r) return null;
  let i = n.shoppingItems.find(e => (e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : []).some(e => e.productId === t)),
    a = (i?.receipts?.length ? i.receipts : i?.receipt ? [i.receipt] : []).find(e => e.productId === t),
    o = n.shoppingActivities?.find(e => e.id === i?.activityId),
    s = a ? `purchase` : r.stockSource ?? `unknown`,
    c = a ? a.product.unit === r.unit ? a.quantity : null : r.initialQuantity ?? null,
    l = c !== null && Number.isFinite(c) && c >= 0 ? c : null,
    u = (n.activityLog ?? []).filter(e => e.items.some(e => e.productId === t)).map(e => {
      let n = e.items.filter(e => e.productId === t),
        i = new Map();
      for (let e of n) i.set(e.unit, roundStockQuantity((i.get(e.unit) ?? 0) + e.quantity));
      let a = n.every(e => e.unit === r.unit && Number.isFinite(e.quantity)),
        o = e.adjustment?.productId === t ? e.adjustment : void 0,
        s = e.action === `adjusted` ? a && o && Number.isFinite(o.before) && Number.isFinite(o.after) ? roundStockQuantity(o.after - o.before) : null : a ? -roundStockQuantity(n.reduce((e, t) => e + t.quantity, 0)) : null;
      return {
        id: e.id,
        action: e.action,
        title: e.title,
        date: e.date,
        recordedAt: e.createdAt,
        delta: s,
        quantities: [...i].map(([e, t]) => ({
          unit: e,
          quantity: t
        })),
        before: o?.before,
        after: o?.after,
        cancelled: !!e.cancelledAt,
        reversal: !!e.reversalOf
      };
    }).sort((e, t) => t.date.localeCompare(e.date) || t.recordedAt.localeCompare(e.recordedAt)),
    d = 0,
    f = 0,
    p = 0,
    m = true;
  for (let e of u) if (!(e.cancelled && !(n.activityLog ?? []).some(t => t.reversalOf === e.id))) {
    if (e.delta === null) {
      m = false;
      continue;
    }
    e.action === `used` ? d -= e.delta : e.action === `disposed` ? f -= e.delta : p += e.delta;
  }
  let h = m && l !== null ? roundStockQuantity(l - d - f + p) : null;
  return {
    product: r,
    origin: {
      kind: s,
      quantity: l,
      date: a?.product.receivedDate ?? r.receivedDate,
      recordedAt: a?.product.createdAt ?? r.createdAt,
      title: o?.title,
      shoppingActivityId: o?.id
    },
    events: u,
    summary: {
      used: roundStockQuantity(d),
      disposed: roundStockQuantity(f),
      adjusted: roundStockQuantity(p),
      amountsKnown: m,
      calculatedQuantity: h,
      consistent: h === null ? null : h === roundStockQuantity(r.quantity)
    }
  };
}
function deleteIncorrectBatch(e, t, n) {
  return transact(e, e => {
    let r = e.products.find(e => e.id === t);
    r || fail(`Stok tidak ditemukan. Muat ulang Inventori.`), n && (r.quantity !== n.quantity || r.itemId !== n.itemId || r.name !== n.name || r.category !== n.category || r.unit !== n.unit || r.expiryDate !== n.expiryDate || r.expiryKind !== n.expiryKind || r.location !== n.location) && fail(`${r.name} berubah sejak dibuka. Muat ulang Inventori dan periksa kembali.`);
    let i = Be(e, t);
    i.purchase && fail(`${r.name} berasal dari Belanja. Hapus melalui item Belanja.`), i.activities.length && fail(`${r.name} sudah tercatat di Aktivitas. Periksa aktivitas terkait terlebih dahulu.`), e.products = e.products.filter(e => e.id !== t), delete e.productArchive[t];
  });
}
function We(e, t, n, r, i) {
  let a = t.quantity;
  (!Number.isFinite(n) || n < 0 || roundStockQuantity(n) !== n || a === n) && fail(`Jumlah baru harus berbeda dan tidak boleh negatif.`);
  let o = new Date(),
    s = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, `0`)}-${String(o.getDate()).padStart(2, `0`)}`,
    c = {
      productId: t.id,
      productName: t.name,
      category: t.category,
      quantity: Math.abs(roundStockQuantity(n - a)),
      unit: t.unit,
      productSnapshot: t
    };
  writeBatchQuantity(e, t, n), e.activityLog.unshift({
    id: `adjust_${crypto.randomUUID()}`,
    action: `adjusted`,
    date: s,
    title: r.trim(),
    items: [c],
    adjustment: {
      productId: t.id,
      before: a,
      after: n
    },
    reversalOf: i,
    createdAt: o.toISOString()
  });
}
function adjustPhysicalStock(e, t, n, r) {
  return transact(e, e => {
    let i = e.products.find(e => e.id === t);
    i || fail(`Stok tidak ditemukan. Muat ulang inventori.`), r.trim() || fail(`Isi alasan penyesuaian stok.`), We(e, i, n, r);
  });
}
function Ke(e, t) {
  let n = Qe(e).find(e => e.id === t && e.adjustment?.after === 0);
  return !n || n.cancelledAt ? `Koreksi tidak ditemukan atau sudah pernah dipulihkan.` : cancelStockAdjustment(e, t);
}
function qe(e, t) {
  let n = getUserData(e),
    r = n.activityLog.find(e => e.id === t),
    i = r?.adjustment?.productId,
    a = n.activityLog.findIndex(e => e.id === t),
    o = n.activityLog.slice(0, Math.max(0, a)).filter(e => isActiveLedgerEvent(e) && e.items.some(e => e.productId === i)),
    s = n.products.find(e => e.id === i) ?? n.productArchive[i ?? ``];
  return {
    blockers: o,
    changedStock: !!r?.adjustment && s?.quantity !== r.adjustment.after,
    cancelled: !!r?.cancelledAt,
    product: s
  };
}
function stockAdjustmentEditState(data, id) {
  const index = data.activityLog.findIndex(event => event.id === id);
  const entry = data.activityLog[index];
  const productId = entry?.adjustment?.productId;
  const product = data.products.find(item => item.id === productId) ?? data.productArchive[productId];
  const canEditReason = !!entry?.adjustment && entry.action === 'adjusted' && !entry.cancelledAt && !entry.reversalOf && !data.activityLog.some(event => event.reversalOf === id);
  // Even a later cancelled movement counts: older physical counts must not be rewritten.
  const later = data.activityLog.slice(0, Math.max(0, index)).some(event => event.items?.some(item => item.productId === productId));
  const canEditQuantity = canEditReason && !!product && !later && product.quantity === entry.adjustment.after;
  const version = JSON.stringify([entry?.id, entry?.title, entry?.adjustment, entry?.cancelledAt, entry?.editedAt, entry?.revisions]);
  return { canEditReason, canEditQuantity, version, product };
}
function getStockAdjustmentEditState(username, id) {
  return stockAdjustmentEditState(getUserData(username), id);
}
function editStockAdjustment(username, id, updated, expectedVersion) {
  return transact(username, data => {
    const state = stockAdjustmentEditState(data, id);
    state.canEditReason || fail('Koreksi ini sudah dibatalkan atau merupakan catatan pemulihan dan tidak dapat diedit.');
    expectedVersion && expectedVersion !== state.version && fail('Koreksi berubah sejak dibuka. Buka kembali detail koreksi.');
    const entry = data.activityLog.find(event => event.id === id);
    const title = typeof updated.title === 'string' ? updated.title.trim() : '';
    title || fail('Isi alasan koreksi stok.');
    const after = updated.after;
    (!Number.isFinite(after) || after < 0 || roundStockQuantity(after) !== after) && fail('Jumlah harus nol atau lebih, maksimal 4 angka desimal.');
    const quantityChanged = after !== entry.adjustment.after;
    quantityChanged && !state.canEditQuantity && fail('Stok sudah berubah setelah koreksi ini. Edit alasan saja; gunakan koreksi baru untuk jumlah fisik saat ini.');
    quantityChanged && after === entry.adjustment.before && fail('Gunakan Batalkan Penyesuaian yang Salah untuk mengembalikan jumlah sebelum koreksi.');
    if (!quantityChanged && title === entry.title) return;
    const editedAt = new Date().toISOString();
    entry.revisions ??= [];
    entry.revisions.push({ editedAt, previousTitle: entry.title, previousAfter: entry.adjustment.after, title, after });
    if (quantityChanged) {
      writeBatchQuantity(data, state.product, after);
      entry.adjustment.after = after;
      entry.items[0].quantity = Math.abs(roundStockQuantity(after - entry.adjustment.before));
    }
    entry.title = title;
    entry.editedAt = editedAt;
  });
}
function cancelStockAdjustment(e, t) {
  return transact(e, e => {
    let n = e.activityLog.findIndex(e => e.id === t),
      r = e.activityLog[n];
    if ((!r?.adjustment || r.action !== `adjusted` || r.reversalOf) && fail(`Penyesuaian tidak dapat dibatalkan.`), r.cancelledAt) return;
    let i = r.adjustment.productId,
      a = e.activityLog.slice(0, n).filter(e => isActiveLedgerEvent(e) && e.items.some(e => e.productId === i));
    a.length && fail(`Periksa catatan yang lebih baru terlebih dahulu: ${a[0].title}. Batalkan hanya jika catatan tersebut juga salah.`);
    let o = e.products.find(e => e.id === i) ?? e.productArchive[i];
    (!o || o.quantity !== r.adjustment.after) && fail(`Stok sudah berubah setelah penyesuaian ini. Periksa pembelian terkait atau catat jumlah fisik yang benar melalui Inventori.`), We(e, o, r.adjustment.before, `Pembatalan penyesuaian: ${r.title}`, r.id), r.cancelledAt = new Date().toISOString();
  });
}
function Ye(e) {
  let t = new Map();
  for (let n of e) {
    (!n.productId || !isValidPositiveQuantity(n.quantity)) && fail(`Jumlah produk harus lebih dari 0.`);
    let e = roundStockQuantity((t.get(n.productId) ?? 0) + n.quantity);
    Number.isFinite(e) || fail(`Jumlah produk terlalu besar.`), t.set(n.productId, e);
  }
  return t;
}
function Xe(e, t, n, r = []) {
  let i = Ye(t),
    a = Ye(n);
  for (let o of new Set([...i.keys(), ...a.keys()])) {
    let s = roundStockQuantity((i.get(o) ?? 0) - (a.get(o) ?? 0));
    if (!s) continue;
    let c = e.products.find(e => e.id === o),
      l = r.find(e => e.id === o) ?? c ?? e.productArchive[o] ?? t.find(e => e.productId === o)?.productSnapshot;
    l || fail(`Data stok lama belum lengkap. Isi tanggal kedaluwarsa dan lokasi produk yang akan dikembalikan.`), [...t, ...n].some(e => e.productId === o && e.unit !== l.unit) && fail(`Satuan ${l.name} berubah. Samakan satuannya sebelum mengubah aktivitas.`), hasValidExpiry(l) || fail(`Informasi kedaluwarsa ${l.name} belum lengkap.`);
    let u = roundStockQuantity((c?.quantity ?? 0) + s);
    (!Number.isFinite(u) || u < 0) && fail(`Stok ${l.name} tidak cukup untuk perubahan ini.`), writeBatchQuantity(e, l, u);
  }
}
function Ze(e, t) {
  return t.map(t => ({
    ...t,
    productSnapshot: e.products.find(e => e.id === t.productId) ?? e.productArchive[t.productId] ?? t.productSnapshot
  }));
}
function Qe(e) {
  return getUserData(e).activityLog ?? [];
}
function $e(e, t, n = []) {
  let r = getUserData(e),
    i = Ye(t.items),
    a = Ye(n);
  return t.items.filter((e, t, n) => {
    let o = (i.get(e.productId) ?? 0) - (a.get(e.productId) ?? 0),
      s = r.products.find(t => t.id === e.productId) ?? r.productArchive[e.productId] ?? e.productSnapshot;
    return o > 0 && (!s || !hasValidExpiry(s)) && n.findIndex(t => t.productId === e.productId) === t;
  });
}
function updateActivityEntry(e, t, n = [], r = []) {
  return transact(e, e => {
    let i = e.activityLog.find(e => e.id === t.id);
    i || fail(`Aktivitas tidak ditemukan. Muat ulang riwayat.`), (i.action === `adjusted` || t.action !== i.action) && fail(`Penyesuaian stok tidak dapat diedit. Buat koreksi baru bila diperlukan.`), validateStockActivity(e, t);
    let a = getStockCorrectionConflicts(e, i, t);
    validatePhysicalStockConfirmations(a, r), Xe(e, i.items, t.items, n);
    let o = {
      ...t,
      items: Ze(e, t.items)
    };
    e.activityLog = e.activityLog.map(e => e.id === t.id ? o : e), applyPhysicalStockConfirmations(e, a, r);
  });
}
function deleteActivityEntry(e, t, n = [], r = []) {
  return transact(e, e => {
    let i = e.activityLog.find(e => e.id === t);
    if (!i) return;
    i.action === `adjusted` && fail(`Penyesuaian stok tidak dapat dihapus. Buat koreksi baru bila diperlukan.`);
    let a = getStockCorrectionConflicts(e, i);
    validatePhysicalStockConfirmations(a, r), Xe(e, i.items, [], n), e.activityLog = e.activityLog.filter(e => e.id !== t), applyPhysicalStockConfirmations(e, a, r);
  });
}
function addActivityEntry(e, t, n = []) {
  return transact(e, e => {
    if (t.action === `adjusted` && fail(`Gunakan penyesuaian stok untuk mencatat koreksi.`), e.activityLog.some(e => e.id === t.id)) return;
    validateStockActivity(e, t);
    let r = getStockCorrectionConflicts(e, void 0, t);
    validatePhysicalStockConfirmations(r, n);
    let i = Ze(e, t.items);
    Xe(e, [], i), e.activityLog.unshift({
      ...t,
      items: i
    }), applyPhysicalStockConfirmations(e, r, n);
  });
}
function rt(e, t, n) {
  return previewStockCorrectionConflicts(e, void 0, {
    id: `preview`,
    action: `disposed`,
    date: n,
    title: `Pembuangan`,
    createdAt: new Date().toISOString(),
    items: t.map(e => ({
      productId: e.id,
      productName: e.name,
      category: e.category,
      quantity: e.quantity,
      unit: e.unit
    }))
  });
}
function disposeSelectedBatches(e, t, n, r, i = []) {
  return transact(e, e => {
    (!t.length || new Set(t).size !== t.length) && fail(`Pilih stok yang akan dibuang.`), (!n.trim() || !isValidCalendarDate(r)) && fail(`Isi alasan dan tanggal pembuangan yang valid.`);
    let a = new Date();
    r > `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, `0`)}-${String(a.getDate()).padStart(2, `0`)}` && fail(`Tanggal pembuangan tidak boleh di masa depan.`);
    let o = t.map(t => {
        let n = e.products.find(e => e.id === t);
        return (!n || !isValidPositiveQuantity(n.quantity)) && fail(`Stok pilihan berubah. Pilih kembali item yang akan dibuang.`), n;
      }).map(e => ({
        productId: e.id,
        productName: e.name,
        category: e.category,
        quantity: e.quantity,
        unit: e.unit,
        productSnapshot: e
      })),
      s = {
        id: `dispose_${crypto.randomUUID()}`,
        action: `disposed`,
        date: r,
        title: n.trim(),
        items: o,
        createdAt: a.toISOString()
      };
    validateStockActivity(e, s);
    let c = getStockCorrectionConflicts(e, void 0, s);
    validatePhysicalStockConfirmations(c, i), Xe(e, [], o), e.activityLog.unshift(s), applyPhysicalStockConfirmations(e, c, i);
  });
}
function saveRecipe(e, t) {
  return transact(e, e => {
    (!t.name.trim() || !Number.isInteger(t.servings) || t.servings < 1 || t.servings > 100 || !t.ingredients.length) && fail(`Isi nama resep, jumlah porsi, dan minimal satu bahan.`);
    let n = new Set();
    for (let e of t.ingredients) {
      let t = e.itemId ?? `${normalizeName(e.name)}|${getUnitFamily(e.unit)}`;
      (!normalizeName(e.name) || !isValidPositiveQuantity(e.quantity) || !e.unit) && fail(`Pilih Master Item, jumlah, dan satuan setiap bahan.`), n.has(t) && fail(`${e.name} sudah ada di resep. Gabungkan jumlahnya dalam satu baris.`), n.add(t);
    }
    let r = {
        ...t,
        name: t.name.trim(),
        ingredients: t.ingredients.map(t => {
          let n = ue(e, t.name, t.category, t.unit, t.itemId);
          return convertItemUnit(t.quantity, t.unit, n.unit, n), {
            ...t,
            itemId: n.id,
            name: n.name,
            category: n.category,
            quantity: roundStockQuantity(t.quantity)
          };
        })
      },
      i = e.recipes.findIndex(e => e.id === t.id);
    i < 0 ? e.recipes.unshift(r) : e.recipes[i] = r;
  });
}
function deleteRecipe(e, t) {
  return transact(e, e => {
    e.recipes = e.recipes.filter(e => e.id !== t);
  });
}
function cookRecipe(e, t, n, r, i = []) {
  return transact(e, e => {
    let a = e.recipes.find(e => e.id === t);
    a || fail(`Resep tidak ditemukan.`), (!Number.isInteger(n) || n < 1 || n > 100) && fail(`Jumlah porsi harus 1–100.`);
    let o = e => {
      let t = e.find(e => e.shortage > 0);
      t && fail(t.unverified > 0 ? `Stok ${t.ingredient.name} belum dihitung siap karena ada ${t.unverified} ${t.ingredient.unit} tanpa tanggal. Periksa stok tanpa tanggal di detail Resep atau lengkapi bahan yang kurang.` : `Stok ${t.ingredient.name} kurang ${t.shortage} ${t.ingredient.unit}. Periksa stok terbaru.`);
    };
    o(getRecipeAvailability(a, e.products, n, e.itemMasters, i));
    let s = a;
    if (r !== void 0) {
      let e = new Set(r.map(e => e.ingredientId));
      (r.length !== a.ingredients.length || e.size !== r.length || a.ingredients.some(t => !e.has(t.id))) && fail(`Semua bahan resep harus tetap dicatat. Bahan tidak dapat ditambah, diganti, atau dilewatkan pada Catat Masak.`), r.some(e => !isValidPositiveQuantity(e.quantity)) && fail(`Jumlah setiap bahan harus lebih dari 0, maksimal 4 angka desimal.`), s = {
        ...a,
        servings: n,
        ingredients: a.ingredients.map(e => ({
          ...e,
          quantity: r.find(t => t.ingredientId === e.id).quantity
        }))
      };
    }
    let c = getRecipeAvailability(s, e.products, n, e.itemMasters, i);
    o(c);
    let l = c.flatMap(e => e.allocations);
    l.length || fail(`Belum ada bahan yang dapat dipakai.`);
    let u = new Date(),
      d = `${u.getFullYear()}-${String(u.getMonth() + 1).padStart(2, `0`)}-${String(u.getDate()).padStart(2, `0`)}`,
      f = {
        id: `cook_${crypto.randomUUID()}`,
        action: `used`,
        source: `recipe`,
        recipeId: t,
        servings: n,
        date: d,
        title: a.name,
        createdAt: u.toISOString(),
        items: Ze(e, l)
      };
    validateStockActivity(e, f), Xe(e, [], f.items), e.activityLog.unshift(f);
  });
}
function calculateShoppingCoverage(e, t, n, r, i = `recipe:${t}`) {
  let a = e.recipes.find(e => e.id === t);
  a || fail(`Resep tidak ditemukan.`), (!Number.isInteger(n) || n < 1 || n > 100) && fail(`Jumlah porsi harus 1–100.`);
  let o = {
      id: i,
      recipeId: t,
      name: a.name,
      servings: n,
      ingredients: a.ingredients.map(e => ({
        ...e,
        quantity: roundStockQuantity(e.quantity * n / a.servings)
      }))
    },
    s = r?.recipePlans?.find(e => e.id === i),
    c = !!s && JSON.stringify(s) === JSON.stringify(o),
    l = [...(r?.recipePlans ?? []).filter(e => e.id !== i), o],
    u = new Map();
  l.forEach(t => t.ingredients.forEach(t => {
    let n = e.itemMasters.find(e => e.id === t.itemId);
    n?.active || fail(`Aktifkan Master Item ${t.name} sebelum merencanakan belanja.`), u.set(n.id, roundStockQuantity((u.get(n.id) ?? 0) + convertItemUnit(t.quantity, t.unit, n.unit, n)));
  }));
  let d = e.shoppingItems.filter(e => r && e.activityId === r.id),
    f = new Set(d.flatMap(e => (e.receipts?.length ? e.receipts : e.receipt ? [e.receipt] : []).map(e => e.productId)));
  return {
    plans: l,
    rows: [...u].map(([t, n]) => {
      let r = e.itemMasters.find(e => e.id === t),
        i = roundStockQuantity(e.products.filter(e => e.itemId === t && !f.has(e.id) && e.expiryDate >= Ee() && (!e.receivedDate || e.receivedDate <= Ee())).reduce((e, t) => e + convertItemUnit(t.quantity, t.unit, r.unit, r), 0)),
        a = roundStockQuantity(e.products.filter(e => e.itemId === t && !f.has(e.id) && !e.expiryDate).reduce((e, t) => e + convertItemUnit(t.quantity, t.unit, r.unit, r), 0)),
        o = roundStockQuantity(d.filter(e => e.itemId === t).reduce((e, t) => e + convertItemUnit(Math.max(t.quantity, (t.receipts?.length ? t.receipts : t.receipt ? [t.receipt] : []).reduce((e, t) => e + t.quantity, 0)), t.unit, r.unit, r), 0));
      return {
        itemId: t,
        name: r.name,
        unit: r.unit,
        needed: n,
        available: i,
        unverified: a,
        covered: o,
        additional: c ? 0 : roundStockQuantity(Math.max(0, n - i - o))
      };
    }),
    unchanged: c
  };
}
function previewRecipeShopping(e, t, n, r, i) {
  let a = getUserData(e);
  return calculateShoppingCoverage(a, t, n, a.shoppingActivities.find(e => e.id === r), i);
}
function planRecipeShopping(e, t, n, r, i, a = `recipe:${t}`) {
  return transact(e, e => {
    if (i !== void 0 && e.shoppingActivities.some(e => e.recipePlans?.some(e => e.id === a)) && !a.startsWith(`recipe:`)) return;
    let o;
    if (i !== void 0) {
      let t = i.trim();
      (!t || t.length > 80) && fail(`Isi nama aktivitas belanja (maksimal 80 karakter).`);
      let n = new Date().toISOString();
      o = {
        id: `shop_${crypto.randomUUID()}`,
        title: t,
        createdAt: n,
        updatedAt: n
      }, e.shoppingActivities.unshift(o);
    } else o = dt(e, r);
    let s = calculateShoppingCoverage(e, t, n, o, a);
    if (!s.unchanged) {
      for (let t of s.rows) {
        if (t.additional <= 0) continue;
        let n = e.itemMasters.find(e => e.id === t.itemId),
          r = e.shoppingItems.find(e => e.activityId === o.id && e.itemId === t.itemId);
        if (r) {
          let e = (r.receipts?.length ? r.receipts : r.receipt ? [r.receipt] : []).reduce((e, t) => e + t.quantity, 0);
          r.quantity = roundStockQuantity(Math.max(r.quantity, e) + convertItemUnit(t.additional, n.unit, r.unit, n)), r.bought = false;
        } else e.shoppingItems.unshift({
          id: `recipe_shop_${crypto.randomUUID()}`,
          activityId: o.id,
          itemId: n.id,
          name: n.name,
          category: n.category,
          quantity: t.additional,
          unit: n.unit,
          bought: false,
          createdAt: new Date().toISOString()
        });
      }
      o.recipePlans = s.plans, o.updatedAt = new Date().toISOString();
    }
  });
}
function dt(e, t) {
  if (t) {
    let n = e.shoppingActivities.find(e => e.id === t);
    return (!n || n.completedAt) && fail(`Aktivitas belanja tidak tersedia.`), n;
  }
  let n = e.shoppingActivities.find(e => !e.completedAt);
  if (n) return n;
  let r = new Date().toISOString(),
    i = {
      id: `shop_${crypto.randomUUID()}`,
      title: `Belanja Baru`,
      createdAt: r,
      updatedAt: r
    };
  return e.shoppingActivities.unshift(i), i;
}
function createShoppingActivity(e, t, n) {
  let r = `shop_${crypto.randomUUID()}`,
    i = transact(e, e => {
      let i = t.trim();
      (!i || i.length > 80) && fail(`Isi nama aktivitas belanja (maksimal 80 karakter).`), n.length || fail(`Tambahkan minimal satu item belanja.`);
      let a = new Set(),
        o = new Date().toISOString(),
        s = n.map(t => {
          let n = e.itemMasters.find(e => e.id === t.itemId && e.active);
          return n || fail(`Pilih setiap item dari Data Master.`), a.has(n.id) && fail(`${n.name} sudah ada dalam daftar. Ubah jumlah pada item tersebut.`), a.add(n.id), isValidPositiveQuantity(t.quantity) || fail(`Isi jumlah belanja ${n.name} yang valid.`), {
            id: `s_${crypto.randomUUID()}`,
            activityId: r,
            itemId: n.id,
            name: n.name,
            category: n.category,
            unit: n.unit,
            quantity: normalizeStockQuantity(t.quantity, t.unit ?? n.unit, n),
            note: t.note?.trim() || void 0,
            bought: false,
            receipts: [],
            createdAt: o
          };
        });
      e.shoppingActivities.unshift({
        id: r,
        title: i,
        createdAt: o,
        updatedAt: o
      }), e.shoppingItems.unshift(...s);
    });
  return {
    id: i ? void 0 : r,
    error: i
  };
}
function renameShoppingActivity(e, t, n) {
  return transact(e, e => {
    let r = dt(e, t),
      i = n.trim();
    (!i || i.length > 80) && fail(`Isi nama aktivitas belanja (maksimal 80 karakter).`), r.title = i, r.updatedAt = new Date().toISOString();
  });
}
function deleteShoppingActivity(e, t) {
  return transact(e, e => {
    let n = dt(e, t);
    e.shoppingItems.filter(e => e.activityId === t).some(e => e.receipt || e.receipts?.length) && fail(`Aktivitas yang sudah menerima stok tidak dapat dihapus. Hapus itemnya satu per satu jika diperlukan.`), e.shoppingItems = e.shoppingItems.filter(e => e.activityId !== t), e.shoppingActivities = e.shoppingActivities.filter(e => e.id !== n.id);
  });
}
function completeShoppingActivity(e, t) {
  return transact(e, e => {
    let n = dt(e, t),
      r = e.shoppingItems.filter(e => e.activityId === t);
    (!r.length || r.some(e => !e.bought)) && fail(`Semua item harus terbeli sebelum belanja diselesaikan.`), n.completedAt = new Date().toISOString(), n.updatedAt = n.completedAt;
  });
}
function addShoppingItem(e, t) {
  return transact(e, e => {
    isValidPositiveQuantity(t.quantity) || fail(`Jumlah belanja harus lebih dari 0.`);
    let n = dt(e, t.activityId),
      r = ue(e, t.name, t.category, t.unit, t.itemId);
    e.shoppingItems.some(e => e.activityId === n.id && e.itemId === r.id) && fail(`${r.name} sudah ada di aktivitas ini. Ubah jumlah pada item yang sudah ada.`), e.shoppingItems.unshift({
      ...t,
      quantity: normalizeStockQuantity(t.quantity, t.unit, r),
      unit: r.unit,
      activityId: n.id,
      itemId: r.id,
      name: r.name,
      category: r.category,
      receipts: []
    }), n.updatedAt = new Date().toISOString();
  });
}
function updateShoppingPlan(e, t, n) {
  return transact(e, e => {
    let r = e.shoppingItems.find(e => e.id === t);
    r || fail(`Item belanja tidak ditemukan.`);
    let i = dt(e, r.activityId);
    isValidPositiveQuantity(n.quantity) || fail(`Jumlah belanja harus lebih dari 0.`);
    let a = ue(e, n.name, n.category, n.unit, n.itemId),
      o = normalizeStockQuantity(n.quantity, n.unit, a);
    a.id !== r.itemId && e.shoppingItems.some(e => e.id !== t && e.activityId === i.id && e.itemId === a.id) && fail(`${a.name} sudah ada di aktivitas ini. Ubah jumlah pada item yang sudah ada.`);
    let s = r.receipts?.length ? r.receipts : r.receipt ? [r.receipt] : [];
    s.length && a.id !== r.itemId && fail(`Item yang sudah diterima tidak dapat diganti. Ubah jumlah atau catat kebutuhan baru.`);
    let c = roundStockQuantity(s.reduce((e, t) => e + t.quantity, 0));
    s.length && o < c && fail(`Jumlah rencana tidak boleh kurang dari ${c} ${r.unit} yang sudah dibeli. Gunakan Edit Pembelian jika jumlah yang dibeli salah.`), Object.assign(r, {
      itemId: a.id,
      name: a.name,
      category: a.category,
      unit: a.unit,
      quantity: o,
      note: n.note?.trim() || void 0,
      bought: c >= o
    }), i.updatedAt = new Date().toISOString();
  });
}
function receiveShoppingPurchase(e, t, n) {
  return transact(e, e => {
    let r = e.shoppingItems.find(e => e.id === t);
    r || fail(`Item belanja tidak ditemukan.`);
    let i = dt(e, r.activityId);
    if (r.bought) return;
    validateReceivedDate(n), (!n.name.trim() || !isValidPositiveQuantity(n.quantity) || !hasValidExpiry(n)) && fail(`Isi jumlah dan informasi kedaluwarsa yang valid.`);
    let a = ue(e, n.name, n.category, n.unit, n.itemId ?? r.itemId);
    a.id !== r.itemId && fail(`Item stok yang diterima harus sesuai daftar belanja.`);
    let o = {
      ...n,
      itemId: a.id,
      name: a.name,
      category: a.category,
      unit: a.unit,
      quantity: normalizeStockQuantity(n.quantity, n.unit, a),
      id: `purchase_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString()
    };
    o.stockSource = `purchase`, o.initialQuantity = o.quantity, registerBatchMasterValues(e, o), e.products.unshift(o), e.productArchive[o.id] = o;
    let s = [...(r.receipts?.length ? r.receipts : r.receipt ? [r.receipt] : []), {
        productId: o.id,
        quantity: o.quantity,
        product: o
      }],
      c = roundStockQuantity(s.reduce((e, t) => e + t.quantity, 0));
    Object.assign(r, {
      itemId: a.id,
      name: o.name,
      category: o.category,
      bought: c >= r.quantity,
      receipts: s,
      receipt: s.at(-1)
    }), i.updatedAt = new Date().toISOString();
  });
}
function yt(e, t, n, r) {
  let i = e.shoppingItems.find(e => e.id === t),
    a = (i?.receipts?.length ? i.receipts : i?.receipt ? [i.receipt] : []).find(e => e.productId === n),
    o = e.products.find(e => e.id === n) ?? e.productArchive[n],
    s = e.activityLog.find(e => e.action === `adjusted` && isActiveLedgerEvent(e) && e.adjustment?.productId === n);
  return a && o && s && r !== a.quantity ? [{
    product: o,
    adjustmentId: s.id,
    adjustmentDate: s.date,
    projectedQuantity: roundStockQuantity(o.quantity + r - a.quantity)
  }] : [];
}
function bt(e, t, n, r) {
  return yt(getUserData(e), t, n, r);
}
function correctPurchaseQuantity(e, t, n, r, i = []) {
  return transact(e, e => {
    let a = e.shoppingItems.find(e => e.id === t);
    a || fail(`Item belanja tidak ditemukan.`);
    let o = e.shoppingActivities.find(e => e.id === a.activityId);
    o || fail(`Aktivitas belanja tidak ditemukan.`), isValidPositiveQuantity(r) || fail(`Jumlah dibeli harus lebih dari 0.`);
    let s = a.receipts?.length ? [...a.receipts] : a.receipt ? [a.receipt] : [],
      c = s.findIndex(e => e.productId === n);
    c < 0 && fail(`Pembelian tidak ditemukan. Muat ulang halaman.`);
    let l = s[c],
      u = e.products.find(e => e.id === n) ?? e.productArchive[n];
    (!u || u.unit !== l.product.unit || u.itemId !== a.itemId) && fail(`Batch stok pembelian tidak dapat dikoreksi. Periksa inventori.`);
    let d = roundStockQuantity(r),
      f = roundStockQuantity(u.quantity + d - l.quantity);
    if (f < 0 && fail(`Jumlah dibeli minimal ${roundStockQuantity(l.quantity - u.quantity)} ${a.unit}, karena stok dari pembelian ini sudah keluar.`), d === l.quantity) return;
    let p = yt(e, t, n, r);
    validatePhysicalStockConfirmations(p, i), writeBatchQuantity(e, {
      ...u,
      initialQuantity: d
    }, f), s[c] = {
      ...l,
      quantity: d,
      product: {
        ...l.product,
        initialQuantity: d,
        quantity: d
      }
    };
    let m = roundStockQuantity(s.reduce((e, t) => e + t.quantity, 0));
    a.receipts = s, a.receipt = s.at(-1), a.bought = m >= a.quantity, o.completedAt && !a.bought && (o.completedAt = void 0), o.updatedAt = new Date().toISOString(), applyPhysicalStockConfirmations(e, p, i);
  });
}
function cancelShoppingPurchase(e, t) {
  return transact(e, e => {
    let n = e.shoppingItems.find(e => e.id === t);
    n || fail(`Item belanja tidak ditemukan.`);
    let r = e.shoppingActivities.find(e => e.id === n.activityId);
    r || fail(`Aktivitas belanja tidak ditemukan.`);
    let i = Ct(e, n);
    i.activities.length && fail(`Stok pembelian sudah tercatat dalam Aktivitas. Periksa aktivitas terkait terlebih dahulu.`), i.changedStock && fail(`Stok pembelian sudah berubah di Inventori. Pembelian belum dapat dibatalkan.`), !n.bought && !i.receiptsCount && fail(`Item ini belum memiliki pembelian.`);
    let a = n.receipts?.length ? n.receipts : n.receipt ? [n.receipt] : [],
      o = new Set(a.map(e => e.productId));
    e.products = e.products.filter(e => !o.has(e.id)), a.forEach(t => {
      delete e.productArchive[t.productId];
    }), n.receipts = [], n.receipt = void 0, n.bought = false, r.completedAt = void 0, r.updatedAt = new Date().toISOString();
  });
}
function Ct(e, t) {
  let n = t.receipts?.length ? t.receipts : t.receipt ? [t.receipt] : [],
    r = new Set(n.map(e => e.productId));
  return {
    activities: e.activityLog.filter(e => isActiveLedgerEvent(e) && e.items.some(e => r.has(e.productId))),
    changedStock: n.some(n => {
      let r = e.products.find(e => e.id === n.productId),
        i = e.productArchive[n.productId],
        a = r ?? i;
      return !a || !r || a.itemId !== t.itemId || a.unit !== n.product.unit || roundStockQuantity(a.quantity) !== roundStockQuantity(n.quantity);
    }),
    receiptsCount: n.length
  };
}
function wt(e, t) {
  let n = getUserData(e),
    r = n.shoppingItems.find(e => e.id === t);
  return r ? Ct(n, r) : null;
}
function deleteShoppingItem(e, t) {
  return transact(e, e => {
    let n = e.shoppingItems.find(e => e.id === t);
    n || fail(`Item belanja tidak ditemukan.`);
    let r = e.shoppingActivities.find(e => e.id === n.activityId);
    r || fail(`Aktivitas belanja tidak ditemukan.`);
    let i = Ct(e, n);
    i.activities.length && fail(`Stok item ini sudah tercatat dalam Aktivitas. Periksa aktivitas terkait sebelum menghapus item.`), i.changedStock && fail(`Stok pembelian sudah berubah di Inventori. Item belum dapat dihapus.`);
    let a = n.receipts?.length ? n.receipts : n.receipt ? [n.receipt] : [],
      o = new Set(a.map(e => e.productId));
    e.products = e.products.filter(e => !o.has(e.id)), a.forEach(t => {
      delete e.productArchive[t.productId];
    }), e.shoppingItems = e.shoppingItems.filter(e => e.id !== t), !e.shoppingItems.filter(e => e.activityId === r.id).length && r.completedAt ? e.shoppingActivities = e.shoppingActivities.filter(e => e.id !== r.id) : r.updatedAt = new Date().toISOString();
  });
}
export { getStockAdjustmentEditState, editStockAdjustment, CATEGORIES, UNITS, EXPIRY_LABELS, getExpiryStatus, formatDate, describeExpiry, normalizeName, E, getUnitFamily, getUnitFactor, roundQuantity, convertBaseUnit, j, M, getAllowedUnits, convertItemUnit, todayDate, getRecipeAvailability, L, seedProducts, USERS_KEY, SESSION_KEY, getDB, saveDB, register, getProfile, updateProfile, updatePassword, login, logout, getSession, getUserData, saveUserData, readLegacyLog, normalizeData, le, ue, saveItemMaster, setItemMasterActive, pe, me, he, ge, _e, ve, addMasterListValue, renameMasterListValue, removeMasterListValue, transact, fail, roundStockQuantity, isValidPositiveQuantity, isValidCalendarDate, hasValidExpiry, Ee, validateReceivedDate, isActiveLedgerEvent, getStockCorrectionConflicts, previewStockCorrectionConflicts, validatePhysicalStockConfirmations, applyPhysicalStockConfirmations, validateStockActivity, writeBatchQuantity, registerBatchMasterValues, normalizeStockQuantity, addProduct, updateProduct, ze, Be, Ve, readBatchLedger, deleteIncorrectBatch, We, adjustPhysicalStock, Ke, qe, cancelStockAdjustment, Ye, Xe, Ze, Qe, $e, updateActivityEntry, deleteActivityEntry, addActivityEntry, rt, disposeSelectedBatches, saveRecipe, deleteRecipe, cookRecipe, calculateShoppingCoverage, previewRecipeShopping, planRecipeShopping, dt, createShoppingActivity, renameShoppingActivity, deleteShoppingActivity, completeShoppingActivity, addShoppingItem, updateShoppingPlan, receiveShoppingPurchase, yt, bt, correctPurchaseQuantity, cancelShoppingPurchase, Ct, wt, deleteShoppingItem };
