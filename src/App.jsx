// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
import * as React from "react";
import { CATEGORIES, getSession, getUserData, logout, seedProducts } from "./lib/store.js";
import { AuthPage } from "./pages/AuthPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { InventoryPage } from "./pages/InventoryPage.jsx";
import { ShoppingPage } from "./pages/ShoppingPage.jsx";
import { MasterDataPage } from "./pages/MasterDataPage.jsx";
import { AccountPage } from "./pages/AccountPage.jsx";
import { ActivityPage } from "./pages/ActivityPage.jsx";
import { RecipesPage } from "./pages/RecipesPage.jsx";
import { BottomNav } from "./components/BottomNav.jsx";
var appFontStyle = {
    fontFamily: `Plus Jakarta Sans, sans-serif`
  },
  PAGE_TITLES = {
    home: `Beranda`,
    inventory: `Inventori`,
    shopping: `Daftar Belanja`,
    recipes: `Resep`,
    activity: `Aktivitas`,
    account: `Akun`
  },
  ADD_BUTTON = {
    inventory: {
      label: `+ Tambah`,
      bg: `var(--primary)`
    },
    shopping: {
      label: `+ Tambah Belanja`,
      bg: `var(--secondary)`
    },
    recipes: {
      label: `+ Buat Resep`,
      bg: `var(--primary)`
    },
    activity: {
      label: `+ Catat Aktivitas`,
      bg: `var(--primary)`
    }
  };
function loadData(e) {
  let t = getUserData(e);
  return {
    products: t.products,
    shoppingItems: t.shoppingItems,
    shoppingActivities: t.shoppingActivities ?? [],
    recipes: t.recipes ?? [],
    categories: t.categories ?? CATEGORIES,
    locations: t.locations ?? [],
    itemMasters: t.itemMasters ?? []
  };
}
function App() {
  let [username, setUsername] = (0, React.useState)(() => {
      let e = getSession();
      return e && seedProducts(e), e;
    }),
    [page, setPage] = (0, React.useState)(`home`),
    [addTrigger, setAddTrigger] = (0, React.useState)(0),
    [activityEntryId, setActivityEntryId] = (0, React.useState)(null),
    [shoppingActivityId, setShoppingActivityId] = (0, React.useState)(null),
    [masterItemIntent, setMasterItemIntent] = (0, React.useState)(null),
    openMasterItem = (e, t) => setMasterItemIntent({
      onCreated: e,
      initialName: t
    }),
    [inventoryStatusIntent, setInventoryStatusIntent] = (0, React.useState)(null),
    [inventoryProductIntent, setInventoryProductIntent] = (0, React.useState)(null);
  function navigateTo(e) {
    setAddTrigger(0), setInventoryStatusIntent(null), setInventoryProductIntent(null), setActivityEntryId(null), setShoppingActivityId(null), setPage(e);
  }
  function openActivityEntry(e) {
    navigateTo(`activity`), setActivityEntryId(e);
  }
  function openShoppingActivity(e) {
    navigateTo(`shopping`), setShoppingActivityId(e);
  }
  function openInventoryStatus(e) {
    setAddTrigger(0), setInventoryProductIntent(null), setInventoryStatusIntent({
      status: e,
      token: Date.now()
    }), setPage(`inventory`);
  }
  function openInventoryProduct(e) {
    setAddTrigger(0), setInventoryStatusIntent(null), setInventoryProductIntent({
      id: e,
      token: Date.now()
    }), setPage(`inventory`);
  }
  let [data, setData] = (0, React.useState)(() => username ? loadData(username) : {
      products: [],
      shoppingItems: [],
      shoppingActivities: [],
      recipes: [],
      categories: CATEGORIES,
      locations: [],
      itemMasters: []
    }),
    refresh = (0, React.useCallback)(() => {
      username && setData(loadData(username));
    }, [username]);
  (0, React.useEffect)(() => {
    let t = document.modelContext;
    if (!username || !t?.registerTool) return;
    let n = new AbortController();
    try {
      Promise.resolve(t.registerTool({
        name: `read_kitchen_inventory`,
        title: `Lihat stok dapur`,
        description: `Baca stok dapur dan daftar belanja akun yang sedang masuk.`,
        inputSchema: {
          type: `object`,
          properties: {},
          additionalProperties: false
        },
        annotations: {
          readOnlyHint: true,
          untrustedContentHint: true
        },
        execute(t) {
          if (!t || typeof t != `object` || Array.isArray(t) || Object.keys(t).length) throw Error(`Masukkan objek kosong.`);
          if (getSession() !== username) throw Error(`Masuk terlebih dahulu.`);
          return loadData(username);
        }
      }, {
        signal: n.signal
      })).catch(() => {});
    } catch {}
    return () => n.abort();
  }, [username]);
  function handleAuth(e) {
    seedProducts(e), setUsername(e), setData(loadData(e)), setPage(`home`);
  }
  function handleLogout() {
    logout(), setUsername(null), setData({
      products: [],
      shoppingItems: [],
      shoppingActivities: [],
      recipes: [],
      categories: CATEGORIES,
      locations: [],
      itemMasters: []
    }), setPage(`home`);
  }
  if (!username) return <AuthPage onAuth={handleAuth} />;
  let addButton = ADD_BUTTON[page];
  return <div className={`min-h-screen`} style={{
    background: `#FAFAF8`,
    maxWidth: 480,
    margin: `0 auto`,
    minHeight: `100vh`
  }}>{[<div className={`sticky top-0 z-30 px-4 flex items-center justify-between`} style={{
      background: `var(--card)`,
      boxShadow: `0 1px 8px rgba(0,0,0,0.06)`,
      paddingTop: `calc(env(safe-area-inset-top, 16px) + 12px)`,
      paddingBottom: 14
    }}>{[<span className={`text-lg font-black`} style={{
        color: `var(--foreground)`,
        ...appFontStyle
      }}>{PAGE_TITLES[page]}</span>, addButton && <button onClick={() => setAddTrigger(e => e + 1)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold`} style={{
        background: addButton.bg,
        color: `#fff`,
        ...appFontStyle
      }}>{addButton.label}</button>, page !== `account` && <button onClick={() => navigateTo(`account`)} aria-label={`Akun`} className={`w-9 h-9 rounded-xl text-lg`} style={{
        background: `var(--muted)`,
        color: `var(--foreground)`
      }}>{`◉`}</button>]}</div>, page === `home` && <HomePage username={username} products={data.products} shoppingItems={data.shoppingItems} onNavigate={navigateTo} onInventoryStatus={openInventoryStatus} onOpenProduct={openInventoryProduct} onRefresh={refresh} />, page === `inventory` && <InventoryPage username={username} products={data.products} categories={data.categories} locations={data.locations} itemMasters={data.itemMasters} onRefresh={refresh} onOpenMasterItem={openMasterItem} onOpenActivityEntry={openActivityEntry} onOpenShoppingActivity={openShoppingActivity} addTrigger={addTrigger} initialStatus={inventoryStatusIntent} initialProduct={inventoryProductIntent} />, page === `shopping` && <ShoppingPage username={username} items={data.shoppingItems} products={data.products} activities={data.shoppingActivities} categories={data.categories} locations={data.locations} itemMasters={data.itemMasters} onRefresh={refresh} onOpenMasterItem={openMasterItem} onOpenActivityEntry={openActivityEntry} onOpenInventory={() => navigateTo(`inventory`)} initialActivityId={shoppingActivityId} addTrigger={addTrigger} />, page === `recipes` && <RecipesPage username={username} recipes={data.recipes} products={data.products} categories={data.categories} locations={data.locations} itemMasters={data.itemMasters} shoppingActivities={data.shoppingActivities} onRefresh={refresh} onShopping={() => navigateTo(`shopping`)} onOpenMasterItem={openMasterItem} addTrigger={addTrigger} />, page === `activity` && <ActivityPage username={username} products={data.products} categories={data.categories} locations={data.locations} onRefresh={refresh} initialEntryId={activityEntryId} onOpenInventory={() => navigateTo(`inventory`)} onOpenShoppingActivity={openShoppingActivity} addTrigger={addTrigger} />, page === `account` && <AccountPage username={username} categories={data.categories} locations={data.locations} itemMasters={data.itemMasters} onRefresh={refresh} onLogout={handleLogout} />, <BottomNav current={page} onChange={navigateTo} />, masterItemIntent && <div className={`fixed inset-0 z-[90] overflow-y-auto`} style={{
      background: `var(--background)`
    }}>{<MasterDataPage username={username} categories={data.categories} locations={data.locations} itemMasters={data.itemMasters} initialSection={`item`} initialItemName={masterItemIntent.initialName} onItemCreated={e => {
        masterItemIntent.onCreated(e), setMasterItemIntent(null);
      }} onRefresh={refresh} onBack={() => setMasterItemIntent(null)} />}</div>]}</div>;
}
export { appFontStyle, PAGE_TITLES, ADD_BUTTON, loadData, App };
