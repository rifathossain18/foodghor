import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initialBanners, initialCourierConfig, initialOrders, initialPixelConfig,
  initialProducts, initialSettings, initialUsers,
} from '../data/initialData';
import {
  Banner, CourierConfig, Order, OrderItem, PixelConfig, PixelEventLog,
  Product, ReviewItem, StoreSettings, UserProfile,
} from '../types';
import { api } from '../lib/api';

interface StoreContextType {
  isLoading: boolean;
  cloudError: string | null;
  retryLoad: () => void;
  products: Product[]; banners: Banner[]; orders: Order[]; users: UserProfile[];
  currentUser: UserProfile | null;
  courierConfig: CourierConfig; pixelConfig: PixelConfig; pixelLogs: PixelEventLog[];
  settings: StoreSettings; cart: OrderItem[];
  isCartOpen: boolean; isTrackingOpen: boolean; isAuthModalOpen: boolean;
  currentPath: string; activeProductSlug: string | null;
  lastPlacedOrder: Order | null;
  setIsCartOpen: (v: boolean) => void;
  setIsTrackingOpen: (v: boolean) => void;
  setIsAuthModalOpen: (v: boolean) => void;
  setLastPlacedOrder: (o: Order | null) => void;
  navigate: (p: string) => void;
  registerUser: (name: string, phone: string, email: string, address?: string, city?: 'Inside Dhaka' | 'Outside Dhaka') => Promise<UserProfile>;
  loginUser: (id: string) => UserProfile | null;
  logoutUser: () => void;
  updateUserProfile: (u: UserProfile) => void;
  deleteUser: (id: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (s: string) => Product | undefined;
  addReview: (r: Omit<ReviewItem, 'id' | 'date' | 'status'>) => ReviewItem;
  updateReviewStatus: (pid: string, rid: string, s: 'Approved' | 'Pending') => void;
  deleteReview: (pid: string, rid: string) => void;
  updateBanner: (b: Banner) => void;
  addBanner: (b: Omit<Banner, 'id'>) => boolean;
  deleteBanner: (id: string) => void;
  placeOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingHistory'>) => Order;
  updateOrderStatus: (id: string, s: Order['status'], note?: string) => void;
  assignCourierTracking: (id: string, c: string, t: string, note?: string) => void;
  updateCourierConfig: (c: CourierConfig) => void;
  updatePixelConfig: (c: PixelConfig) => void;
  clearPixelLogs: () => void;
  firePixelEvent: (n: string, d?: Record<string, unknown>) => void;
  updateSettings: (s: StoreSettings) => Promise<void>;
  addToCart: (i: OrderItem) => void;
  removeFromCart: (pid: string, pkid?: string) => void;
  updateCartQuantity: (pid: string, pkid: string | undefined, d: number) => void;
  clearCart: () => void;
  cartTotal: number; cartCount: number;
}

const Ctx = createContext<StoreContextType | undefined>(undefined);

// ⚠️ sessionStorage ONLY (cleared when tab closes) — NOT localStorage
// শুধু cart আর logged-in user এখানে থাকে, যাতে ট্যাব refresh করলে হারিয়ে না যায়
// কিন্তু ট্যাব বন্ধ করলে মুছে যাবে — কোনো persistence নেই
const ss = {
  get<T>(k: string, f: T): T {
    try {
      const v = sessionStorage.getItem('foodghor_' + k);
      return v ? JSON.parse(v) : f;
    } catch { return f; }
  },
  set(k: string, v: any) {
    try { sessionStorage.setItem('foodghor_' + k, JSON.stringify(v)); } catch {}
  },
  remove(k: string) {
    try { sessionStorage.removeItem('foodghor_' + k); } catch {}
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [loadTrigger, setLoadTrigger] = useState(0);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => ss.get('current_user', null));
  const [courierConfig, setCourierConfig] = useState<CourierConfig>(initialCourierConfig);
  const [pixelConfig, setPixelConfig] = useState<PixelConfig>(initialPixelConfig);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [cart, setCart] = useState<OrderItem[]>(() => ss.get('cart', []));
  const [pixelLogs, setPixelLogs] = useState<PixelEventLog[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const h = window.location.hash;
    if (h.startsWith('#/')) return h.slice(1);
    if (h === '#admin') return '/admin';
    return window.location.pathname || '/';
  });

  // ---- LOAD FROM D1 (only source of truth) ----
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setCloudError(null);

    (async () => {
      try {
        const [prod, ban, ord, usr, st, cr, px] = await Promise.all([
          api.products.list(),
          api.banners.list(),
          api.orders.list(),
          api.users.list(),
          api.settings.get(),
          api.courier.get(),
          api.pixel.get(),
        ]);
        if (cancelled) return;

        if (prod) setProducts(prod);
        if (ban) setBanners(ban);
        if (ord) setOrders(ord);
        if (usr) setUsers(usr);
        if (st) setSettings(st);
        if (cr) setCourierConfig(cr);
        if (px) setPixelConfig(px);

        setCloudError(null);
      } catch (e: any) {
        if (cancelled) return;
        const msg = e?.message || 'Cloud API not reachable';
        setCloudError(msg);
        console.error('[StoreContext] D1 load failed:', msg);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [loadTrigger]);

  // Persist only cart + currentUser to sessionStorage (per-tab, cleared on close)
  useEffect(() => ss.set('cart', cart), [cart]);
  useEffect(() => {
    if (currentUser) ss.set('current_user', currentUser);
    else ss.remove('current_user');
  }, [currentUser]);

  // Route sync
  useEffect(() => {
    const h = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) setCurrentPath(hash.slice(1));
      else if (hash === '#admin') setCurrentPath('/admin');
      else setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', h);
    window.addEventListener('hashchange', h);
    return () => {
      window.removeEventListener('popstate', h);
      window.removeEventListener('hashchange', h);
    };
  }, []);

  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.location.hash = path;
      setCurrentPath(path);
    }
  };

  const match = currentPath.match(/^\/product\/([^/?#]+)/);
  const activeProductSlug = match ? match[1] : null;

  const retryLoad = () => setLoadTrigger((n) => n + 1);

  // ---- Sync helper: throw console warning on failure ----
  const syncFail = (label: string, e: any) =>
    console.error(`[D1 sync FAILED] ${label}:`, e?.message || e);

  // ============ Users ============
  const registerUser = async (
    name: string, phone: string, email: string,
    address?: string, city: 'Inside Dhaka' | 'Outside Dhaka' = 'Inside Dhaka'
  ): Promise<UserProfile> => {
    const existing = users.find(
      (u) => u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '') ||
        u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      const updated = { ...existing, name: name || existing.name, address: address || existing.address, city: city || existing.city };
      try { await api.users.save(updated); } catch (e) { syncFail('user-update', e); }
      setUsers((p) => p.map((u) => (u.id === existing.id ? updated : u)));
      setCurrentUser(updated);
      return updated;
    }
    const newUser: UserProfile = {
      id: `u-${Date.now()}`, name: name.trim(), phone: phone.trim(),
      email: email.trim().toLowerCase(), address: address?.trim(),
      city, createdAt: new Date().toISOString(),
      totalOrders: 0, totalSpent: 0, status: 'Active',
    };
    try { await api.users.save(newUser); } catch (e) { syncFail('user-create', e); }
    setUsers((p) => [newUser, ...p]);
    setCurrentUser(newUser);
    return newUser;
  };

  const loginUser = (id: string) => {
    const c = id.trim().toLowerCase();
    const cPhone = c.replace(/\D/g, '');
    const found = users.find(
      (u) => (cPhone && u.phone.replace(/\D/g, '').includes(cPhone)) || u.email.toLowerCase() === c
    );
    if (found) { setCurrentUser(found); return found; }
    return null;
  };

  const logoutUser = () => setCurrentUser(null);

  const updateUserProfile = (u: UserProfile) => {
    setUsers((p) => p.map((x) => (x.id === u.id ? u : x)));
    if (currentUser?.id === u.id) setCurrentUser(u);
    api.users.save(u).catch((e) => syncFail('user-save', e));
  };

  const deleteUser = (id: string) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    if (currentUser?.id === id) setCurrentUser(null);
    api.users.remove(id).catch((e) => syncFail('user-del', e));
  };

  // ============ Reviews ============
  const addReview = (data: Omit<ReviewItem, 'id' | 'date' | 'status'>): ReviewItem => {
    const rev: ReviewItem = { ...data, id: `rev-${Date.now()}`, date: 'আজকে', status: 'Approved', verified: true };
    setProducts((prev) => prev.map((p) => {
      if (p.id !== data.productId && p.slug !== data.productId) return p;
      const upd = { ...p, landingConfig: { ...p.landingConfig, reviews: [rev, ...(p.landingConfig.reviews || [])] } };
      api.products.save(upd).catch((e) => syncFail('review-add', e));
      return upd;
    }));
    return rev;
  };

  const updateReviewStatus = (pid: string, rid: string, status: 'Approved' | 'Pending') => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== pid && p.slug !== pid) return p;
      const upd = { ...p, landingConfig: { ...p.landingConfig, reviews: p.landingConfig.reviews.map((r) => r.id === rid ? { ...r, status } : r) } };
      api.products.save(upd).catch((e) => syncFail('review-status', e));
      return upd;
    }));
  };

  const deleteReview = (pid: string, rid: string) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== pid && p.slug !== pid) return p;
      const upd = { ...p, landingConfig: { ...p.landingConfig, reviews: p.landingConfig.reviews.filter((r) => r.id !== rid) } };
      api.products.save(upd).catch((e) => syncFail('review-del', e));
      return upd;
    }));
  };

  // ============ Pixel ============
  const firePixelEvent = (name: string, data: Record<string, unknown> = {}) => {
    if (!pixelConfig.isEnabled) return;
    if (name === 'PageView' && !pixelConfig.trackPageView) return;
    if (name === 'ViewContent' && !pixelConfig.trackViewContent) return;
    if (name === 'AddToCart' && !pixelConfig.trackAddToCart) return;
    if (name === 'InitiateCheckout' && !pixelConfig.trackInitiateCheckout) return;
    if (name === 'Purchase' && !pixelConfig.trackPurchase) return;
    const log: PixelEventLog = {
      id: `px-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventName: name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: true }),
      data,
    };
    setPixelLogs((prev) => [log, ...prev.slice(0, 49)]);
    try { (window as any).fbq?.('track', name, data); } catch {}
  };

  useEffect(() => { firePixelEvent('PageView', { path: currentPath }); }, [currentPath]);

  // ============ Products ============
  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    api.products.save(p).catch((e) => syncFail('product-add', e));
  };
  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
    api.products.save(p).catch((e) => syncFail('product-update', e));
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    api.products.remove(id).catch((e) => syncFail('product-del', e));
  };
  const getProductBySlug = (s: string) => products.find((p) => p.slug === s);

  // ============ Banners ============
  const updateBanner = (b: Banner) => {
    setBanners((prev) => prev.map((x) => x.id === b.id ? b : x));
    api.banners.save(b).catch((e) => syncFail('banner-update', e));
  };
  const addBanner = (data: Omit<Banner, 'id'>): boolean => {
    if (banners.length >= 5) return false;
    const nb: Banner = { ...data, id: `b-${Date.now()}`, order: banners.length + 1 };
    setBanners((prev) => [...prev, nb]);
    api.banners.save(nb).catch((e) => syncFail('banner-add', e));
    return true;
  };
  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    api.banners.remove(id).catch((e) => syncFail('banner-del', e));
  };

  // ============ Orders ============
  const placeOrder = (data: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingHistory'>): Order => {
    const oid = `FG-${Math.floor(1000 + Math.random() * 9000)}`;
    const tc = `${courierConfig.defaultCourier.slice(0, 2).toUpperCase()}-${Math.floor(1e6 + Math.random() * 9e6)}`;
    const now = new Date();
    const newOrder: Order = {
      ...data, id: oid, status: 'Pending', courierName: courierConfig.defaultCourier,
      trackingCode: courierConfig.autoGenerateTracking ? tc : undefined,
      createdAt: now.toISOString(),
      trackingHistory: [{
        status: 'অর্ডার প্লেস করা হয়েছে',
        timestamp: now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        note: 'অর্ডারটি সফলভাবে সিস্টেমে জমা হয়েছে।',
        location: 'FoodGhor',
      }],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    api.orders.save(newOrder).catch((e) => syncFail('order-place', e));

    if (data.userId) {
      const u = users.find((x) => x.id === data.userId);
      if (u) {
        const upd = { ...u, totalOrders: (u.totalOrders || 0) + 1, totalSpent: (u.totalSpent || 0) + newOrder.total };
        setUsers((prev) => prev.map((x) => x.id === data.userId ? upd : x));
        if (currentUser?.id === data.userId) setCurrentUser(upd);
        api.users.save(upd).catch((e) => syncFail('user-order-metrics', e));
      }
    }

    firePixelEvent('Purchase', { orderId: oid, value: newOrder.total, currency: 'BDT' });
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status'], note?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const bnMap: Record<Order['status'], string> = {
        Pending: 'অপেক্ষমাণ', Confirmed: 'নিশ্চিত', Processing: 'প্রসেসিং',
        Shipped: 'কুরিয়ারে', Delivered: 'ডেলিভার্ড', Cancelled: 'বাতিল',
      };
      const upd: Order = { ...o, status, trackingHistory: [...o.trackingHistory, {
        status: bnMap[status],
        timestamp: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        note: note || `স্ট্যাটাস: ${bnMap[status]}`,
        location: 'Central Hub',
      }]};
      api.orders.save(upd).catch((e) => syncFail('order-status', e));
      return upd;
    }));
  };

  const assignCourierTracking = (id: string, courier: string, code: string, note?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const upd: Order = { ...o, courierName: courier, trackingCode: code, status: 'Shipped', trackingHistory: [...o.trackingHistory, {
        status: 'কুরিয়ারে হস্তান্তর',
        timestamp: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        note: note || `${courier} → ${code}`,
        location: `${courier} Hub`,
      }]};
      api.orders.save(upd).catch((e) => syncFail('courier-assign', e));
      return upd;
    }));
  };

  // ============ Config ============
  const updateCourierConfig = (c: CourierConfig) => {
    setCourierConfig(c);
    api.courier.save(c).catch((e) => syncFail('courier', e));
  };
  const updatePixelConfig = (c: PixelConfig) => {
    setPixelConfig(c);
    api.pixel.save(c).catch((e) => syncFail('pixel', e));
  };
  const clearPixelLogs = () => setPixelLogs([]);

  // ⚠️ updateSettings is now ASYNC and THROWS on failure
  const updateSettings = async (s: StoreSettings) => {
    await api.settings.save(s);  // throws if fails — no silent failure
    setSettings(s);
  };

  // ============ Cart ============
  const addToCart = (item: OrderItem) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.productId === item.productId && x.packageId === item.packageId);
      if (i > -1) { const c = [...prev]; c[i].quantity += item.quantity; return c; }
      return [...prev, item];
    });
    firePixelEvent('AddToCart', { product: item.productName, price: item.price });
    setIsCartOpen(true);
  };
  const removeFromCart = (pid: string, pkid?: string) =>
    setCart((prev) => prev.filter((i) => !(i.productId === pid && (pkid ? i.packageId === pkid : true))));
  const updateCartQuantity = (pid: string, pkid: string | undefined, d: number) =>
    setCart((prev) => prev.map((i) => i.productId === pid && (!pkid || i.packageId === pkid)
      ? (i.quantity + d > 0 ? { ...i, quantity: i.quantity + d } : null) : i
    ).filter(Boolean) as OrderItem[]);
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((c, i) => c + i.quantity, 0);

  return (
    <Ctx.Provider value={{
      isLoading, cloudError, retryLoad,
      products, banners, orders, users, currentUser, courierConfig, pixelConfig,
      pixelLogs, settings, cart, isCartOpen, isTrackingOpen, isAuthModalOpen,
      currentPath, activeProductSlug, lastPlacedOrder,
      setIsCartOpen, setIsTrackingOpen, setIsAuthModalOpen, setLastPlacedOrder,
      navigate, registerUser, loginUser, logoutUser, updateUserProfile, deleteUser,
      addProduct, updateProduct, deleteProduct, getProductBySlug,
      addReview, updateReviewStatus, deleteReview,
      updateBanner, addBanner, deleteBanner,
      placeOrder, updateOrderStatus, assignCourierTracking,
      updateCourierConfig, updatePixelConfig, clearPixelLogs, firePixelEvent,
      updateSettings, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount,
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be inside StoreProvider');
  return c;
};