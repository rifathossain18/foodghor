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

const AppContent: React.FC = () => {
  const { currentPath, activeProductSlug, getProductBySlug, navigate } = useStore();

  // Route matching:
  // 1. Is this the hidden Admin Portal?
  const isAdmin = currentPath === '/admin' || currentPath === '#admin' || window.location.hash === '#admin';

  if (isAdmin) {
    return <AdminLayout />;
  }

  // 2. Is this a specific Product Sales Funnel Landing Page?
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

  // 3. Main Storefront Homepage (Strictly NO button or link to /admin!)
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
