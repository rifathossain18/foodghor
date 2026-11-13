import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProductLandingPage } from './components/ProductLandingPage';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { UserAuthModal } from './components/auth/UserAuthModal';
import { AdminLayout } from './components/admin/AdminLayout';

const updateFavicon = (logoUrl: string, brandInitial: string) => {
  const head = document.head;
  head.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());
  let href = '';
  let type = '';
  const trimmed = (logoUrl || '').trim();
  if (trimmed) {
    if (trimmed.startsWith('data:image/svg')) { type = 'image/svg+xml'; href = trimmed; }
    else if (trimmed.startsWith('data:image/png')) { type = 'image/png'; href = trimmed; }
    else if (trimmed.startsWith('data:image/jpeg') || trimmed.startsWith('data:image/jpg')) { type = 'image/jpeg'; href = trimmed; }
    else if (trimmed.startsWith('data:image/webp')) { type = 'image/webp'; href = trimmed; }
    else if (trimmed.startsWith('data:image/')) { href = trimmed; }
    else {
      const sep = trimmed.includes('?') ? '&' : '?';
      href = `${trimmed}${sep}v=${Date.now()}`;
      const low = trimmed.toLowerCase();
      if (low.endsWith('.svg')) type = 'image/svg+xml';
      else if (low.endsWith('.png')) type = 'image/png';
      else if (low.endsWith('.jpg') || low.endsWith('.jpeg')) type = 'image/jpeg';
      else if (low.endsWith('.webp')) type = 'image/webp';
    }
  } else {
    const initial = (brandInitial || 'F').trim().charAt(0) || 'F';
    const safe = initial.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#065f46"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="58" font-weight="bold" fill="#fbbf24" font-family="Hind Siliguri, Arial, sans-serif">${safe}</text></svg>`;
    type = 'image/svg+xml';
    href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  const iconLink = document.createElement('link');
  iconLink.rel = 'icon'; if (type) iconLink.type = type; iconLink.href = href;
  head.appendChild(iconLink);
  const appleLink = document.createElement('link');
  appleLink.rel = 'apple-touch-icon'; appleLink.href = href;
  head.appendChild(appleLink);
  const shortcutLink = document.createElement('link');
  shortcutLink.rel = 'shortcut icon'; if (type) shortcutLink.type = type; shortcutLink.href = href;
  head.appendChild(shortcutLink);
};

// ========== Global loading ==========
const LoadingScreen = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-800 text-amber-400 font-bold text-3xl flex items-center justify-center animate-pulse">
        ফু
      </div>
      <p className="text-stone-600 text-sm font-semibold">D1 ডাটাবেস থেকে লোড হচ্ছে...</p>
      <div className="mt-3 w-48 h-1 mx-auto bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-700 animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  </div>
);

// ========== Global error ==========
const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 max-w-md w-full shadow-lg">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-stone-900 mb-2">ডাটাবেসে সংযোগ ব্যর্থ</h2>
        <p className="text-sm text-stone-600 mb-4">
          Cloudflare D1 থেকে ডাটা লোড করা যাচ্ছে না। নিচের চেকলিস্ট দেখুন:
        </p>
      </div>
      <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-700 space-y-1 mb-4">
        <p>✅ Cloudflare Pages Settings → Functions → D1 bindings → <code className="bg-white px-1 rounded">DB</code> = <code className="bg-white px-1 rounded">foodghor-db</code></p>
        <p>✅ Build command: <code className="bg-white px-1 rounded">npm run build</code></p>
        <p>✅ Build output: <code className="bg-white px-1 rounded">dist</code></p>
        <p>✅ <code className="bg-white px-1 rounded">functions/api/[[route]].ts</code> ফাইল deployed হয়েছে</p>
      </div>
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 font-mono mb-4 break-all">
        {error}
      </div>
      <button onClick={onRetry} className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl">
        আবার চেষ্টা করুন
      </button>
      <p className="text-[11px] text-stone-500 mt-3 text-center">
        টেস্ট করুন:{' '}
        <a href="/api/health" target="_blank" rel="noreferrer" className="underline text-emerald-700">/api/health</a>
      </p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { currentPath, activeProductSlug, getProductBySlug, settings, isLoading, cloudError, retryLoad } = useStore();

  useEffect(() => {
    updateFavicon(settings.logoUrl || '', settings.banglaName || 'F');
  }, [settings.logoUrl, settings.banglaName]);

  // ⚠️ Wait for D1 load BEFORE deciding what to render
  if (isLoading) return <LoadingScreen />;
  if (cloudError) return <ErrorScreen error={cloudError} onRetry={retryLoad} />;

  const isAdmin = currentPath === '/admin' || currentPath === '#admin' || window.location.hash === '#admin';
  if (isAdmin) return <AdminLayout />;

  if (activeProductSlug) {
    const product = getProductBySlug(activeProductSlug);
    if (product) {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
          <Header />
          <main className="flex-1"><ProductLandingPage product={product} /></main>
          <Footer />
          <CartDrawer /><OrderTrackingModal /><OrderSuccessModal /><UserAuthModal />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
      <Header />
      <main className="flex-1"><HomePage /></main>
      <Footer />
      <CartDrawer /><OrderTrackingModal /><OrderSuccessModal /><UserAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}