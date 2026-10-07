export type ExpiryStatus = 'expired' | 'expiring' | 'safe';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO date string YYYY-MM-DD
  location?: string;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  note?: string;
  bought: boolean;
  receipt?: { productId: string; quantity: number; product: Product };
  createdAt: string;
}

export interface UserData {
  products: Product[];
  shoppingItems: ShoppingItem[];
  activityLog?: ActivityEntry[];
  productArchive?: Record<string, Product>;
  demoSeeded?: boolean;
}

export interface ActivityItem {
  productSnapshot?: Product;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface ActivityEntry {
  id: string;
  action: 'used' | 'disposed';
  date: string;       // YYYY-MM-DD, user-selectable
  title: string;      // activity name (used) or disposal reason (disposed)
  items: ActivityItem[];
  createdAt: string;
}

export type Page = 'home' | 'inventory' | 'shopping' | 'use' | 'account';

export const CATEGORIES = [
  'Bahan Pokok',
  'Sayuran',
  'Buah',
  'Daging & Ikan',
  'Susu & Telur',
  'Bumbu',
  'Minuman',
  'Camilan',
  'Lainnya',
];

export const UNITS = ['kg', 'gram', 'liter', 'ml', 'buah', 'bungkus', 'kaleng', 'botol', 'pcs', 'sachet'];

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring';
  return 'safe';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
