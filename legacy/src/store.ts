import type { Product, ShoppingItem, UserData, ActivityEntry, ActivityItem } from './types';

const SEED_PRODUCTS: Omit<Product, 'id' | 'createdAt'>[] = [
  // Bahan Pokok
  { name: 'Beras Pandan Wangi', category: 'Bahan Pokok', quantity: 5, unit: 'kg', expiryDate: '2027-03-15', location: 'Lemari dapur' },
  { name: 'Mie Instan Goreng', category: 'Bahan Pokok', quantity: 12, unit: 'bungkus', expiryDate: '2026-12-01', location: 'Lemari dapur' },
  { name: 'Tepung Terigu Segitiga', category: 'Bahan Pokok', quantity: 1, unit: 'kg', expiryDate: '2026-10-02', location: 'Lemari dapur' },
  { name: 'Gula Pasir', category: 'Bahan Pokok', quantity: 2, unit: 'kg', expiryDate: '2027-06-20', location: 'Toples' },
  { name: 'Minyak Goreng Bimoli', category: 'Bahan Pokok', quantity: 2, unit: 'liter', expiryDate: '2026-09-27', location: 'Rak bawah' },

  // Sayuran
  { name: 'Bayam Organik', category: 'Sayuran', quantity: 250, unit: 'gram', expiryDate: '2026-10-01', location: 'Kulkas bawah' },
  { name: 'Wortel Baby', category: 'Sayuran', quantity: 500, unit: 'gram', expiryDate: '2026-10-08', location: 'Kulkas bawah' },
  { name: 'Brokoli Segar', category: 'Sayuran', quantity: 1, unit: 'buah', expiryDate: '2026-09-28', location: 'Kulkas atas' },
  { name: 'Kangkung Lokal', category: 'Sayuran', quantity: 300, unit: 'gram', expiryDate: '2026-10-02', location: 'Kulkas bawah' },
  { name: 'Tomat Cherry', category: 'Sayuran', quantity: 200, unit: 'gram', expiryDate: '2026-10-12', location: 'Kulkas atas' },

  // Buah
  { name: 'Pisang Cavendish', category: 'Buah', quantity: 6, unit: 'buah', expiryDate: '2026-10-03', location: 'Meja makan' },
  { name: 'Jeruk Mandarin', category: 'Buah', quantity: 8, unit: 'buah', expiryDate: '2026-10-15', location: 'Kulkas atas' },
  { name: 'Apel Fuji', category: 'Buah', quantity: 4, unit: 'buah', expiryDate: '2026-10-20', location: 'Kulkas atas' },
  { name: 'Mangga Harum Manis', category: 'Buah', quantity: 3, unit: 'buah', expiryDate: '2026-09-29', location: 'Meja makan' },
  { name: 'Semangka Tanpa Biji', category: 'Buah', quantity: 0.5, unit: 'buah', expiryDate: '2026-10-01', location: 'Kulkas bawah' },

  // Daging & Ikan
  { name: 'Ayam Fillet Dada', category: 'Daging & Ikan', quantity: 600, unit: 'gram', expiryDate: '2026-10-02', location: 'Freezer' },
  { name: 'Daging Sapi Giling', category: 'Daging & Ikan', quantity: 400, unit: 'gram', expiryDate: '2026-09-28', location: 'Freezer' },
  { name: 'Ikan Salmon Slice', category: 'Daging & Ikan', quantity: 300, unit: 'gram', expiryDate: '2026-10-01', location: 'Freezer' },
  { name: 'Udang Segar Kupas', category: 'Daging & Ikan', quantity: 250, unit: 'gram', expiryDate: '2026-10-05', location: 'Freezer' },
  { name: 'Bakso Sapi Frozen', category: 'Daging & Ikan', quantity: 500, unit: 'gram', expiryDate: '2026-11-30', location: 'Freezer' },

  // Susu & Telur
  { name: 'Telur Ayam Kampung', category: 'Susu & Telur', quantity: 10, unit: 'buah', expiryDate: '2026-10-14', location: 'Kulkas pintu' },
  { name: 'Susu UHT Full Cream', category: 'Susu & Telur', quantity: 4, unit: 'kaleng', expiryDate: '2027-02-28', location: 'Lemari dapur' },
  { name: 'Yoghurt Greek Plain', category: 'Susu & Telur', quantity: 500, unit: 'gram', expiryDate: '2026-10-03', location: 'Kulkas atas' },
  { name: 'Keju Cheddar Kraft', category: 'Susu & Telur', quantity: 180, unit: 'gram', expiryDate: '2026-10-25', location: 'Kulkas pintu' },
  { name: 'Mentega Anchor', category: 'Susu & Telur', quantity: 200, unit: 'gram', expiryDate: '2026-11-15', location: 'Kulkas pintu' },

  // Bumbu
  { name: 'Kecap Manis ABC', category: 'Bumbu', quantity: 1, unit: 'botol', expiryDate: '2027-04-10', location: 'Rak bumbu' },
  { name: 'Saus Tiram Fiesta', category: 'Bumbu', quantity: 1, unit: 'botol', expiryDate: '2026-09-26', location: 'Kulkas pintu' },
  { name: 'Garam Himalaya', category: 'Bumbu', quantity: 500, unit: 'gram', expiryDate: '2028-01-01', location: 'Rak bumbu' },
  { name: 'Merica Bubuk', category: 'Bumbu', quantity: 50, unit: 'gram', expiryDate: '2026-12-31', location: 'Rak bumbu' },
  { name: 'Kaldu Ayam Masako', category: 'Bumbu', quantity: 8, unit: 'sachet', expiryDate: '2027-05-20', location: 'Rak bumbu' },

  // Minuman
  { name: 'Air Mineral Aqua 1.5L', category: 'Minuman', quantity: 6, unit: 'botol', expiryDate: '2027-08-15', location: 'Rak bawah' },
  { name: 'Jus Jeruk Minute Maid', category: 'Minuman', quantity: 3, unit: 'kaleng', expiryDate: '2026-10-02', location: 'Kulkas atas' },
  { name: 'Teh Pucuk Harum', category: 'Minuman', quantity: 4, unit: 'botol', expiryDate: '2026-11-10', location: 'Kulkas atas' },
  { name: 'Kopi Kapal Api Bubuk', category: 'Minuman', quantity: 200, unit: 'gram', expiryDate: '2027-01-25', location: 'Lemari dapur' },
  { name: 'Sirup Marjan Cocopandan', category: 'Minuman', quantity: 1, unit: 'botol', expiryDate: '2026-09-25', location: 'Kulkas pintu' },

  // Camilan
  { name: 'Keripik Kentang Lays', category: 'Camilan', quantity: 3, unit: 'bungkus', expiryDate: '2026-10-30', location: 'Lemari dapur' },
  { name: 'Biskuit Marie Regal', category: 'Camilan', quantity: 2, unit: 'bungkus', expiryDate: '2026-09-29', location: 'Toples' },
  { name: 'Coklat Kit Kat', category: 'Camilan', quantity: 5, unit: 'buah', expiryDate: '2026-12-15', location: 'Kulkas pintu' },
  { name: 'Kacang Mede Panggang', category: 'Camilan', quantity: 150, unit: 'gram', expiryDate: '2026-10-03', location: 'Toples' },
  { name: 'Popcorn Caramel Garrett', category: 'Camilan', quantity: 1, unit: 'kaleng', expiryDate: '2026-10-18', location: 'Lemari dapur' },

  // Lainnya
  { name: 'Madu Hutan Murni', category: 'Lainnya', quantity: 350, unit: 'gram', expiryDate: '2028-05-01', location: 'Lemari dapur' },
  { name: 'Selai Kacang Skippy', category: 'Lainnya', quantity: 340, unit: 'gram', expiryDate: '2026-09-27', location: 'Lemari dapur' },
  { name: 'Roti Tawar Sari Roti', category: 'Lainnya', quantity: 1, unit: 'bungkus', expiryDate: '2026-10-02', location: 'Meja makan' },
  { name: 'Agar-Agar Swallow', category: 'Lainnya', quantity: 3, unit: 'bungkus', expiryDate: '2027-07-30', location: 'Lemari dapur' },
  { name: 'Santan Kara Instan', category: 'Lainnya', quantity: 6, unit: 'sachet', expiryDate: '2026-11-05', location: 'Lemari dapur' },
];

export function seedProducts(username: string) {
  const data = getUserData(username);
  if (data.demoSeeded) return;
  // Existing data must never be replaced by demo stock after everything is used.
  if (!data.products.length && !data.shoppingItems.length && !data.activityLog?.length && !Object.keys(data.productArchive ?? {}).length) {
    const now = new Date().toISOString();
    data.products = SEED_PRODUCTS.map((p, i) => ({ ...p, id: `seed_${i}_${Date.now()}`, createdAt: now }));
  }
  data.demoSeeded = true;
  saveUserData(username, data);
}

const USERS_KEY = 'dapur_users';
const SESSION_KEY = 'dapur_session';

export interface UserProfile {
  displayName: string;
  email: string;
}

interface UsersDB {
  [username: string]: { password: string; profile?: UserProfile; data: UserData };
}

function getDB(): UsersDB {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDB(db: UsersDB) {
  localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

export function register(username: string, password: string, email = ''): string | null {
  const db = getDB();
  if (db[username]) return 'Username sudah dipakai.';
  db[username] = { password, profile: { displayName: username, email }, data: { products: [], shoppingItems: [] } };
  saveDB(db);
  localStorage.setItem(SESSION_KEY, username);
  return null;
}

export function getProfile(username: string): UserProfile {
  const db = getDB();
  return db[username]?.profile ?? { displayName: username, email: '' };
}

export function updateProfile(username: string, displayName: string): string | null {
  const db = getDB();
  if (!db[username]) return 'Akun tidak ditemukan.';
  db[username].profile = { ...db[username].profile ?? { email: '' }, displayName };
  saveDB(db);
  return null;
}

export function updatePassword(username: string, current: string, next: string): string | null {
  const db = getDB();
  if (!db[username]) return 'Akun tidak ditemukan.';
  if (db[username].password !== current) return 'Kata sandi saat ini salah.';
  db[username].password = next;
  saveDB(db);
  return null;
}

export function login(username: string, password: string): string | null {
  const db = getDB();
  if (!db[username]) return 'Akun tidak ditemukan.';
  if (db[username].password !== password) return 'Password salah.';
  localStorage.setItem(SESSION_KEY, username);
  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function getUserData(username: string): UserData {
  const db = getDB();
  const data = db[username]?.data ?? { products: [], shoppingItems: [] };
  return normalizeData(username, data);
}

export function saveUserData(username: string, data: UserData) {
  const db = getDB();
  if (!db[username]) return;
  db[username].data = normalizeData(username, data);
  saveDB(db);
}

// Move legacy history into the same document as inventory on the next write.
// One localStorage.setItem commits inventory + shopping + history together.
function readLegacyLog(username: string): ActivityEntry[] {
  const raw: unknown = JSON.parse(localStorage.getItem(`dapur_log_${username}`) || '[]');
  if (!Array.isArray(raw)) throw new Error('Data riwayat tidak valid.');
  return raw.filter((e): e is ActivityEntry => !!e && typeof e === 'object' && Array.isArray(e.items));
}

function normalizeData(username: string, data: UserData): UserData {
  return { ...data, activityLog: data.activityLog ?? readLegacyLog(username), productArchive: data.productArchive ?? {} };
}

function transact(username: string, change: (data: UserData) => void): string | null {
  try {
    const db = getDB();
    if (!db[username]) return 'Akun tidak ditemukan.';
    const data = normalizeData(username, db[username].data);
    change(data);
    db[username].data = data;
    saveDB(db);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Gagal menyimpan perubahan. Coba lagi.';
  }
}

function fail(message: string): never { throw new Error(message); }
function roundQuantity(quantity: number) { return Math.round(quantity * 10000) / 10000; }
function validQuantity(quantity: number) {
  return Number.isFinite(quantity) && quantity > 0 && Number.isFinite(roundQuantity(quantity)) && roundQuantity(quantity) > 0;
}
function validDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
}

// Archive zero-stock/deleted products so reversals preserve expiry and location.
function saveProductQuantity(data: UserData, product: Product, quantity: number) {
  const updated = { ...product, quantity: roundQuantity(quantity) };
  data.productArchive![product.id] = updated;
  data.products = data.products.filter(p => p.id !== product.id);
  if (updated.quantity > 0) data.products.unshift(updated);
}

// Product helpers
export function addProduct(username: string, product: Product) {
  const data = getUserData(username);
  data.products = [product, ...data.products];
  data.productArchive![product.id] = product;
  saveUserData(username, data);
}

export function updateProduct(username: string, updated: Product) {
  const data = getUserData(username);
  data.products = data.products.map(p => p.id === updated.id ? updated : p);
  data.productArchive![updated.id] = updated;
  saveUserData(username, data);
}

export function deleteProduct(username: string, id: string) {
  const data = getUserData(username);
  const product = data.products.find(p => p.id === id);
  if (product) data.productArchive![id] = { ...product, quantity: 0 };
  data.products = data.products.filter(p => p.id !== id);
  saveUserData(username, data);
}

function totals(items: ActivityItem[]) {
  const result = new Map<string, number>();
  for (const item of items) {
    if (!item.productId || !validQuantity(item.quantity)) fail('Jumlah produk harus lebih dari 0.');
    const total = roundQuantity((result.get(item.productId) ?? 0) + item.quantity);
    if (!Number.isFinite(total)) fail('Jumlah produk terlalu besar.');
    result.set(item.productId, total);
  }
  return result;
}

// Revert the previous activity then apply the edited activity as one transaction.
function applyActivityChange(data: UserData, previous: ActivityItem[], next: ActivityItem[], restored: Product[] = []) {
  const oldTotals = totals(previous);
  const newTotals = totals(next);
  for (const id of new Set([...oldTotals.keys(), ...newTotals.keys()])) {
    const delta = roundQuantity((oldTotals.get(id) ?? 0) - (newTotals.get(id) ?? 0));
    if (!delta) continue;
    const live = data.products.find(p => p.id === id);
    const snapshot = restored.find(p => p.id === id) ?? live ?? data.productArchive![id] ?? previous.find(i => i.productId === id)?.productSnapshot;
    if (!snapshot) fail('Data stok lama belum lengkap. Isi tanggal kedaluwarsa dan lokasi produk yang akan dikembalikan.');
    if ([...previous, ...next].some(i => i.productId === id && i.unit !== snapshot.unit)) fail(`Satuan ${snapshot.name} berubah. Samakan satuannya sebelum mengubah aktivitas.`);
    if (!validDate(snapshot.expiryDate)) fail(`Tanggal kedaluwarsa ${snapshot.name} belum lengkap.`);
    const newQty = roundQuantity((live?.quantity ?? 0) + delta);
    if (!Number.isFinite(newQty) || newQty < 0) fail(`Stok ${snapshot.name} tidak cukup untuk perubahan ini.`);
    saveProductQuantity(data, snapshot, newQty);
  }
}

function snapshotItems(data: UserData, items: ActivityItem[]): ActivityItem[] {
  return items.map(item => ({ ...item, productSnapshot: data.products.find(p => p.id === item.productId) ?? data.productArchive![item.productId] ?? item.productSnapshot }));
}

export function getActivityLog(username: string): ActivityEntry[] {
  return getUserData(username).activityLog ?? [];
}

export function getMissingActivityProducts(username: string, entry: ActivityEntry, nextItems: ActivityItem[] = []): ActivityItem[] {
  const data = getUserData(username);
  const oldTotals = totals(entry.items);
  const newTotals = totals(nextItems);
  return entry.items.filter((item, index, items) => {
    const delta = (oldTotals.get(item.productId) ?? 0) - (newTotals.get(item.productId) ?? 0);
    const known = data.products.find(p => p.id === item.productId) ?? data.productArchive![item.productId] ?? item.productSnapshot;
    return delta > 0 && (!known || !validDate(known.expiryDate)) && items.findIndex(i => i.productId === item.productId) === index;
  });
}

export function updateActivityEntry(username: string, entry: ActivityEntry, restored: Product[] = []): string | null {
  return transact(username, data => {
    const previous = data.activityLog!.find(e => e.id === entry.id);
    if (!previous) fail('Aktivitas tidak ditemukan. Muat ulang riwayat.');
    if (!entry.title.trim() || !entry.items.length || !validDate(entry.date)) fail('Isi nama aktivitas, tanggal, dan minimal satu produk.');
    applyActivityChange(data, previous.items, entry.items, restored);
    const updated = { ...entry, items: snapshotItems(data, entry.items) };
    data.activityLog = data.activityLog!.map(e => e.id === entry.id ? updated : e);
  });
}

export function deleteActivityEntry(username: string, id: string, restored: Product[] = []): string | null {
  return transact(username, data => {
    const previous = data.activityLog!.find(e => e.id === id);
    if (!previous) return; // A repeated delete must not restore stock twice.
    applyActivityChange(data, previous.items, [], restored);
    data.activityLog = data.activityLog!.filter(e => e.id !== id);
  });
}

export function addActivityEntry(username: string, entry: ActivityEntry): string | null {
  return transact(username, data => {
    if (data.activityLog!.some(e => e.id === entry.id)) return;
    if (!entry.title.trim() || !entry.items.length || !validDate(entry.date)) fail('Isi nama aktivitas, tanggal, dan minimal satu produk.');
    const items = snapshotItems(data, entry.items);
    applyActivityChange(data, [], items);
    data.activityLog!.unshift({ ...entry, items });
  });
}

// Shopping helpers
export function addShoppingItem(username: string, item: ShoppingItem) {
  const data = getUserData(username);
  data.shoppingItems = [item, ...data.shoppingItems];
  saveUserData(username, data);
}

export function completeShoppingItem(username: string, id: string, received: Omit<Product, 'id' | 'createdAt'>): string | null {
  return transact(username, data => {
    const item = data.shoppingItems.find(i => i.id === id);
    if (!item) fail('Item belanja tidak ditemukan.');
    if (item.bought) return; // Retrying the same receipt must not add stock twice.
    if (!received.name.trim() || !validQuantity(received.quantity) || !validDate(received.expiryDate)) fail('Isi nama produk, jumlah, dan tanggal kedaluwarsa yang valid.');
    const product: Product = { ...received, name: received.name.trim(), quantity: roundQuantity(received.quantity), id: `purchase_${crypto.randomUUID()}`, createdAt: new Date().toISOString() };
    data.products.unshift(product); // Each purchase keeps its own expiry and stock identity.
    data.productArchive![product.id] = product;
    Object.assign(item, { name: product.name, category: product.category, quantity: product.quantity, unit: product.unit, bought: true, receipt: { productId: product.id, quantity: product.quantity, product } });
  });
}

export function undoShoppingPurchase(username: string, id: string): string | null {
  return transact(username, data => {
    const item = data.shoppingItems.find(i => i.id === id);
    if (!item) fail('Item belanja tidak ditemukan.');
    if (!item.bought) return;
    if (item.receipt) {
      const product = data.products.find(p => p.id === item.receipt!.productId);
      if (!product || product.quantity < item.receipt.quantity) fail('Belanja tidak bisa dibatalkan karena stok pembelian ini sudah berkurang. Koreksi pemakaian/pembuangan terlebih dahulu.');
      if (product.unit !== item.receipt.product.unit) fail('Satuan stok pembelian berubah. Samakan satuannya sebelum membatalkan belanja.');
      saveProductQuantity(data, product, product.quantity - item.receipt.quantity);
    }
    // Legacy checked items never credited inventory, so there is nothing to reverse.
    item.bought = false;
    delete item.receipt;
  });
}

export function deleteShoppingItem(username: string, id: string) {
  const data = getUserData(username);
  // Clearing a checklist item does not undo an actual purchase.
  data.shoppingItems = data.shoppingItems.filter(s => s.id !== id);
  saveUserData(username, data);
}
