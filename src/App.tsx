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

// ============================================================
// 🎨 Favicon Update Helper
// ============================================================
const updateFavicon = (logoUrl: string, brandInitial: string) => {
  const head = document.head;

  // Remove all existing icon links
  head.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());

  // Determine favicon URL
  let href = '';
  let type = '';

  const trimmed = (logoUrl || '').trim();

  if (trimmed) {
    // Has logo URL
    if (trimmed.startsWith('data:image/svg')) {
      type = 'image/svg+xml';
      href = trimmed;
    } else if (trimmed.startsWith('data:image/png')) {
      type = 'image/png';
      href = trimmed;
    } else if (trimmed.startsWith('data:image/jpeg') || trimmed.startsWith('data:image/jpg')) {
      type = 'image/jpeg';
      href = trimmed;
    } else if (trimmed.startsWith('data:image/webp')) {
      type = 'image/webp';
      href = trimmed;
    } else if (trimmed.startsWith('data:image/')) {
      // Any other data URL
      href = trimmed;
    } else {
      // Regular URL — add cache buster
      const sep = trimmed.includes('?') ? '&' : '?';
      href = `${trimmed}${sep}v=${Date.now()}`;
      const low = trimmed.toLowerCase();
      if (low.endsWith('.svg')) type = 'image/svg+xml';
      else if (low.endsWith('.png')) type = 'image/png';
      else if (low.endsWith('.jpg') || low.endsWith('.jpeg')) type = 'image/jpeg';
      else if (low.endsWith('.webp')) type = 'image/webp';
    }
  } else {
    // Fallback: SVG with brand initial
    const initial = (brandInitial || 'F').trim().charAt(0) || 'F';
    const safeInitial = initial
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="22" fill="#065f46"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
            font-size="58" font-weight="bold" fill="#fbbf24"
            font-family="Hind Siliguri, Arial, sans-serif">${safeInitial}</text>
    </svg>`;

    type = 'image/svg+xml';
    href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  // Standard favicon link
  const iconLink = document.createElement('link');
  iconLink.rel = 'icon';
  if (type) iconLink.type = type;
  iconLink.href = href;
  head.appendChild(iconLink);

  // Apple touch icon (mobile home screen)
  const appleLink = document.createElement('link');
  appleLink.rel = 'apple-touch-icon';
  appleLink.href = href;
  head.appendChild(appleLink);

  // Shortcut icon (legacy)
  const shortcutLink = document.createElement('link');
  shortcutLink.rel = 'shortcut icon';
  if (type) shortcutLink.type = type;
  shortcutLink.href = href;
  head.appendChild(shortcutLink);
};

// ============================================================
// 🎯 Main App Content
// ============================================================
const AppContent: React.FC = () => {
  const { currentPath, activeProductSlug, getProductBySlug, settings } = useStore();

  // 🔄 Update favicon whenever logo or brand name changes
  useEffect(() => {
    updateFavicon(settings.logoUrl || '', settings.banglaName || 'F');
  }, [settings.logoUrl, settings.banglaName]);

  // Route matching:
  const isAdmin =
    currentPath === '/admin' ||
    currentPath === '#admin' ||
    window.location.hash === '#admin';

  if (isAdmin) {
    return <AdminLayout />;
  }

  if (activeProductSlug) {
    const product = getProductBySlug(activeProductSlug);
    if (product) {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
          <Header />
          <main className="flex-1">
            <ProductLandingPage product={product} />
          </main>
          <Footer />
          <CartDrawer />
          <OrderTrackingModal />
          <OrderSuccessModal />
          <UserAuthModal />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
      <CartDrawer />
      <OrderTrackingModal />
      <OrderSuccessModal />
      <UserAuthModal />
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