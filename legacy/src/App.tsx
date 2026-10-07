import { useState, useCallback } from 'react';
import { getSession, logout, getUserData, seedProducts } from './store';
import type { Page, Product, ShoppingItem } from './types';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ShoppingPage from './pages/ShoppingPage';
import AccountPage from './pages/AccountPage';
import UsePage from './pages/UsePage';
import BottomNav from './components/BottomNav';

const pjs: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans, sans-serif' };

const PAGE_TITLES: Record<Page, string> = {
  home: 'Beranda',
  inventory: 'Inventori',
  shopping: 'Daftar Belanja',
  use: 'Pakai',
  account: 'Akun',
};

// Button config per page: label + background color
const ADD_BUTTON: Partial<Record<Page, { label: string; bg: string }>> = {
  inventory: { label: '+ Tambah',       bg: 'var(--primary)' },
  shopping:  { label: '+ Tambah',       bg: 'var(--secondary)' },
  use:       { label: '+ Tambah Pakai', bg: 'var(--primary)' },
};

function loadData(username: string) {
  const d = getUserData(username);
  return { products: d.products, shoppingItems: d.shoppingItems };
}

export default function App() {
  const [username, setUsername] = useState<string | null>(() => {
    const u = getSession();
    if (u) seedProducts(u);
    return u;
  });
  const [page, setPage] = useState<Page>('home');
  const [addTrigger, setAddTrigger] = useState(0);

  function navigateTo(p: Page) {
    setAddTrigger(0); // reset so new page doesn't auto-trigger
    setPage(p);
  }
  const [data, setData] = useState<{ products: Product[]; shoppingItems: ShoppingItem[] }>(
    () => username ? loadData(username) : { products: [], shoppingItems: [] }
  );

  const refresh = useCallback(() => {
    if (username) setData(loadData(username));
  }, [username]);

  function handleAuth(user: string) {
    seedProducts(user);
    setUsername(user);
    setData(loadData(user));
    setPage('home');
  }

  function handleLogout() {
    logout();
    setUsername(null);
    setData({ products: [], shoppingItems: [] });
    setPage('home');
  }

  if (!username) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const addBtn = ADD_BUTTON[page];

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      {/* Per-page top bar — respects safe-area-inset-top for mobile notch/island */}
      <div
        className="sticky top-0 z-30 px-4 flex items-center justify-between"
        style={{
          background: 'var(--card)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          paddingTop: 'calc(env(safe-area-inset-top, 16px) + 12px)',
          paddingBottom: 14,
        }}
      >
        <span className="text-lg font-black" style={{ color: 'var(--foreground)', ...pjs }}>
          {PAGE_TITLES[page]}
        </span>
        {addBtn && (
          <button
            onClick={() => setAddTrigger(n => n + 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
            style={{ background: addBtn.bg, color: '#fff', ...pjs }}
          >
            {addBtn.label}
          </button>
        )}
      </div>

      {/* Pages */}
      {page === 'home' && (
        <HomePage
          username={username}
          products={data.products}
          shoppingItems={data.shoppingItems}
          onNavigate={navigateTo}
        />
      )}
      {page === 'inventory' && (
        <InventoryPage
          username={username}
          products={data.products}
          onRefresh={refresh}
          addTrigger={addTrigger}
        />
      )}
      {page === 'shopping' && (
        <ShoppingPage
          username={username}
          items={data.shoppingItems}
          onRefresh={refresh}
          addTrigger={addTrigger}
        />
      )}
      {page === 'use' && (
        <UsePage
          username={username}
          products={data.products}
          onRefresh={refresh}
          addTrigger={addTrigger}
        />
      )}
      {page === 'account' && (
        <AccountPage
          username={username}
          onLogout={handleLogout}
        />
      )}

      <BottomNav current={page} onChange={navigateTo} />
    </div>
  );
}
