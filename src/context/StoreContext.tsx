import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initialBanners,
  initialCourierConfig,
  initialOrders,
  initialPixelConfig,
  initialProducts,
  initialSettings,
  initialUsers,
} from '../data/initialData';
import {
  Banner, CourierConfig, Order, OrderItem, PixelConfig, PixelEventLog,
  Product, ReviewItem, StoreSettings, UserProfile,
} from '../types';
import { api } from '../lib/api';

interface StoreContextType {
  isLoading: boolean;
  cloudError: string | null;
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
  registerUser: (name: string, phone: string, email: string, address?: string, city?: 'Inside Dhaka' | 'Outside Dhaka') => UserProfile;
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
  updateSettings: (s: StoreSettings) => void;
  addToCart: (i: OrderItem) => void;
  removeFromCart: (pid: string, pkid?: string) => void;
  updateCartQuantity: (pid: string, pkid: string | undefined, d: number) => void;
  clearCart: () => void;
  cartTotal: number; cartCount: number;
}

const Ctx = createContext<StoreContextType | undefined>(undefined);

// LocalStorage only for CART and currentUser (session-level UI)
const ls = {
  get<T>(k: string, f: T): T {
    try { const v = localStorage.getItem('foodghor_' + k); return v ? JSON.parse(v) : f; }
    catch { return f; }
  },
  set(k: string, v: any) {
    try { localStorage.setItem('foodghor_' + k, JSON.stringify(v)); } catch {}
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => ls.get('current_user', null));
  const [courierConfig, setCourierConfig] = useState<CourierConfig>(initialCourierConfig);
  const [pixelConfig, setPixelConfig] = useState<PixelConfig>(initialPixelConfig);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [cart, setCart] = useState<OrderItem[]>(() => ls.get('cart', []));
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

  // ---- Initial load from Cloudflare D1 ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prod, ban, ord, usr, st, cr, px] = await Promise.all([
          api.products.list().catch(() => null),
          api.banners.list().catch(() => null),
          api.orders.list().catch(() => null),
          api.users.list().catch(() => null),
          api.settings.get().catch(() => null),
          api.courier.get().catch(() => null),
          api.pixel.get().catch(() => null),
        ]);
        if (cancelled) return;

        // If settings returned successfully → we're in Cloudflare mode
        if (st !== null) {
          if (prod) setProducts(prod);
          if (ban) setBanners(ban);
          if (ord) setOrders(ord);
          if (usr) setUsers(usr);
          setSettings(st);
          if (cr) setCourierConfig(cr);
          if (px) setPixelConfig(px);
          setCloudError(null);
        } else {
          throw new Error('Settings API did not respond');
        }
      } catch (e: any) {
        if (cancelled) return;
        setCloudError(e?.message || 'Cloud database not reachable');
        console.warn('[StoreContext] Cloud load failed — using defaults:', e?.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist cart + currentUser locally (UI state, not data)
  useEffect(() => ls.set('cart', cart), [cart]);
  useEffect(() => ls.set('current_user', currentUser), [currentUser]);

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

  // --- Helper: fire-and-forget API sync ---
  const syncErr = (label: string) => (e: any) =>
    console.error(`[Sync ${label}]`, e?.message || e);

  // ============ Users ============
  const registerUser = (name: string, phone: string, email: string, address?: string, city: 'Inside Dhaka' | 'Outside Dhaka' = 'Inside Dhaka'): UserProfile => {
    const existing = users.find(
      (u) => u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '') ||
        u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      const updated = { ...existing, name: name || existing.name, address: address || existing.address, city: city || existing.city };
      setUsers((p) => p.map((u) => (u.id === existing.id ? updated : u)));
      setCurrentUser(updated);
      api.users.save(updated).catch(syncErr('user-update'));
      return updated;
    }
    const newUser: UserProfile = {
      id: `u-${Date.now()}`, name: name.trim(), phone: phone.trim(),
      email: email.trim().toLowerCase(), address: address?.trim(),
      city, createdAt: new Date().toISOString(),
      totalOrders: 0, totalSpent: 0, status: 'Active',
    };
    setUsers((p) => [newUser, ...p]);
    setCurrentUser(newUser);
    api.users.save(newUser).catch(syncErr('user-create'));
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
    api.users.save(u).catch(syncErr('user-save'));
  };

  const deleteUser = (id: string) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    if (currentUser?.id === id) setCurrentUser(null);
    api.users.remove(id).catch(syncErr('user-del'));
  };

  // ============ Reviews ============
  const addReview = (data: Omit<ReviewItem, 'id' | 'date' | 'status'>): ReviewItem => {
    const rev: ReviewItem = { ...data, id: `rev-${Date.now()}`, date: 'আজকে', status: 'Approved', verified: true };
    setProducts((prev) =>
      prev.map((p) => p.id === data.productId || p.slug === data.productId ? {
        ...p,
        landingConfig: { ...p.landingConfig, reviews: [rev, ...(p.landingConfig.reviews || [])] },
      } : p)
    );
    // Save updated product
    setTimeout(() => {
      const prod = products.find((p) => p.id === data.productId || p.slug === data.productId);
      if (prod) {
        const upd = { ...prod, landingConfig: { ...prod.landingConfig, reviews: [rev, ...(prod.landingConfig.reviews || [])] } };
        api.products.save(upd).catch(syncErr('review'));
      }
    }, 50);
    return rev;
  };

  const updateReviewStatus = (pid: string, rid: string, status: 'Approved' | 'Pending') => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== pid && p.slug !== pid) return p;
      const upd = { ...p, landingConfig: { ...p.landingConfig, reviews: p.landingConfig.reviews.map((r) => r.id === rid ? { ...r, status } : r) } };
      api.products.save(upd).catch(syncErr('review-status'));
      return upd;
    }));
  };

  const deleteReview = (pid: string, rid: string) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== pid && p.slug !== pid) return p;
      const upd = { ...p, landingConfig: { ...p.landingConfig, reviews: p.landingConfig.reviews.filter((r) => r.id !== rid) } };
      api.products.save(upd).catch(syncErr('review-del'));
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
    api.products.save(p).catch(syncErr('product-add'));
  };
  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
    api.products.save(p).catch(syncErr('product-update'));
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    api.products.remove(id).catch(syncErr('product-del'));
  };
  const getProductBySlug = (s: string) => products.find((p) => p.slug === s);

  // ============ Banners ============
  const updateBanner = (b: Banner) => {
    setBanners((prev) => prev.map((x) => x.id === b.id ? b : x));
    api.banners.save(b).catch(syncErr('banner-update'));
  };
  const addBanner = (data: Omit<Banner, 'id'>): boolean => {
    if (banners.length >= 5) return false;
    const nb: Banner = { ...data, id: `b-${Date.now()}`, order: banners.length + 1 };
    setBanners((prev) => [...prev, nb]);
    api.banners.save(nb).catch(syncErr('banner-add'));
    return true;
  };
  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    api.banners.remove(id).catch(syncErr('banner-del'));
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
    api.orders.save(newOrder).catch(syncErr('order'));

    if (data.userId) {
      setUsers((prev) => prev.map((u) => u.id === data.userId ? {
        ...u, totalOrders: (u.totalOrders || 0) + 1, totalSpent: (u.totalSpent || 0) + newOrder.total,
      } : u));
      if (currentUser?.id === data.userId) {
        setCurrentUser((p) => p ? { ...p, totalOrders: (p.totalOrders || 0) + 1, totalSpent: (p.totalSpent || 0) + newOrder.total } : null);
      }
      const u = users.find((x) => x.id === data.userId);
      if (u) api.users.save({ ...u, totalOrders: (u.totalOrders || 0) + 1, totalSpent: (u.totalSpent || 0) + newOrder.total }).catch(syncErr('user-order'));
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
      api.orders.save(upd).catch(syncErr('order-status'));
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
      api.orders.save(upd).catch(syncErr('courier-assign'));
      return upd;
    }));
  };

  // ============ Config ============
  const updateCourierConfig = (c: CourierConfig) => {
    setCourierConfig(c);
    api.courier.save(c).catch(syncErr('courier'));
  };
  const updatePixelConfig = (c: PixelConfig) => {
    setPixelConfig(c);
    api.pixel.save(c).catch(syncErr('pixel'));
  };
  const clearPixelLogs = () => setPixelLogs([]);
  const updateSettings = (s: StoreSettings) => {
    setSettings(s);
    api.settings.save(s).catch(syncErr('settings'));
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
      isLoading, cloudError,
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