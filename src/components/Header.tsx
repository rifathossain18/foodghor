import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShoppingBag,
  Search,
  PhoneCall,
  Truck,
  ShieldCheck,
  X,
  Menu,
  Home,
  Package,
  Info,
  User,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { resolveImageUrl } from '../lib/imagePath';

export const Header: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    setIsTrackingOpen,
    setIsAuthModalOpen,
    currentUser,
    navigate,
    products,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.banglaName.includes(searchQuery) ||
          p.category.includes(searchQuery)
      )
    : [];

  const goToSection = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      {settings.showAnnouncementBar && settings.announcementBarText && (
        <div className="bg-emerald-900 text-emerald-50 text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-1.5 sm:gap-2">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="line-clamp-2 sm:line-clamp-none">
            {settings.announcementBarText}
          </span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-2 sm:gap-3 shrink-0 select-none"
        >
          {settings.logoUrl ? (
            <img
              src={resolveImageUrl(settings.logoUrl)}
              alt={settings.storeName}
              className="h-9 sm:h-12 w-auto object-contain max-w-[120px] sm:max-w-[160px]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center shadow-md text-amber-400 font-bold text-base sm:text-xl border border-emerald-700/50">
                ফু
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 font-serif block leading-none">
                  {settings.banglaName}
                </span>
                <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-800 tracking-wider uppercase block mt-0.5">
                  {settings.storeName} Organic
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => navigate('/')}
            className="hover:text-emerald-800 transition-colors cursor-pointer"
          >
            হোম
          </button>
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              goToSection('products');
            }}
            className="hover:text-emerald-800 transition-colors"
          >
            সকল খাদ্যপণ্য
          </a>
          <a
            href="#story"
            onClick={(e) => {
              e.preventDefault();
              goToSection('story');
            }}
            className="hover:text-emerald-800 transition-colors"
          >
            আমাদের বিশুদ্ধতা
          </a>
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="flex items-center gap-1.5 text-emerald-800 font-semibold hover:text-emerald-950 transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>অর্ডার ট্র্যাকিং</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 sm:p-2.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
            aria-label="পণ্য খুঁজুন"
          >
            <Search className="w-5 h-5" />
          </button>

          <a
            href={`tel:${settings.phone}`}
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200/60"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>হটলাইন: {settings.phone}</span>
          </a>

          {currentUser ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-stone-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
              title="কাস্টমার প্রোফাইল"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                {currentUser.name.slice(0, 1)}
              </div>
              <span className="max-w-[70px] sm:max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-700 hover:text-emerald-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200/60 cursor-pointer"
            >
              <span>লগইন / একাউন্ট</span>
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm hover:shadow transition-all relative cursor-pointer"
            aria-label="শপিং ব্যাগ"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">ব্যাগ</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-stone-900 text-[10px] sm:text-xs font-bold rounded-full h-4 sm:h-5 min-w-4 sm:min-w-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* 3-dot / Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE MENU DRAWER — createPortal দিয়ে document.body-তে  */}
      {/* render হচ্ছে, তাই হেডারের backdrop-blur আর বাধা দেবে না   */}
      {/* ========================================================= */}
      {isMobileMenuOpen &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
            />

            {/* Drawer Panel */}
            <div className="absolute top-0 right-0 h-full w-72 max-w-[85%] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-400 font-bold flex items-center justify-center text-sm">
                    ফু
                  </div>
                  <span className="font-bold text-stone-900 font-serif">
                    {settings.banglaName}
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
                  aria-label="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Items */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl text-left transition-colors"
                >
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span className="flex-1">হোম পেজ</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => goToSection('products')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl text-left transition-colors"
                >
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span className="flex-1">সকল খাদ্যপণ্য</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => goToSection('story')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl text-left transition-colors"
                >
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span className="flex-1">আমাদের বিশুদ্ধতা</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-900 bg-amber-50 hover:bg-amber-100 rounded-xl text-left border border-amber-200 transition-colors"
                >
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span className="flex-1">অর্ডার ট্র্যাকিং</span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </button>

                <div className="my-2 border-t border-stone-200" />

                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-normal">
                        প্রোফাইল দেখুন
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl text-left transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                    <span className="flex-1">লগইন / একাউন্ট</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                )}

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <div className="flex-1">
                    <div>কল করুন</div>
                    <div className="text-[11px] text-stone-500 font-mono font-normal">
                      {settings.phone}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </a>
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-stone-200 bg-stone-50">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ব্যাগ দেখুন ({cartCount})</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Quick Search Overlay Modal — এটাও portal-এ render হচ্ছে */}
      {isSearchOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <Search className="w-5 h-5 text-emerald-700" />
                  <span>পছন্দের খাবার খুঁজুন</span>
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যেমন: মধু, ঘি, সরিষার তেল, বাদাম..."
                  className="w-full px-4 py-3 text-base rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
                {searchQuery.trim() === '' ? (
                  <div className="text-center py-8 text-stone-500 text-sm">
                    যেকোনো পণ্যের নাম বা ক্যাটাগরি লিখে সার্চ করুন
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-sm">
                    কোনো পণ্য খুঁজে পাওয়া যায়নি।
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        navigate(`/product/${p.slug}`);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer border border-transparent hover:border-stone-200 transition-all"
                    >
                      <img
                        src={resolveImageUrl(p.image)}
                        alt={p.banglaName}
                        className="w-14 h-14 object-cover rounded-lg bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 text-sm truncate">
                          {p.banglaName}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">
                          {p.category} · {p.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-800 text-sm">
                          ৳{p.price}
                        </span>
                        <span className="block text-[11px] text-stone-400 line-through">
                          ৳{p.regularPrice}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};