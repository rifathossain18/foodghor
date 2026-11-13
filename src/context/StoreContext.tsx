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
  Banner,
  CourierConfig,
  Order,
  OrderItem,
  PixelConfig,
  PixelEventLog,
  Product,
  ReviewItem,
  StoreSettings,
  UserProfile,
} from '../types';

interface StoreContextType {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  users: UserProfile[];
  currentUser: UserProfile | null;
  courierConfig: CourierConfig;
  pixelConfig: PixelConfig;
  pixelLogs: PixelEventLog[];
  settings: StoreSettings;
  cart: OrderItem[];
  isCartOpen: boolean;
  isTrackingOpen: boolean;
  isAuthModalOpen: boolean;
  currentPath: string;
  activeProductSlug: string | null;
  lastPlacedOrder: Order | null;
  setIsCartOpen: (open: boolean) => void;
  setIsTrackingOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setLastPlacedOrder: (order: Order | null) => void;
  navigate: (path: string) => void;
  // User Authentication
  registerUser: (name: string, phone: string, email: string, address?: string, city?: 'Inside Dhaka' | 'Outside Dhaka') => UserProfile;
  loginUser: (phoneOrEmail: string) => UserProfile | null;
  logoutUser: () => void;
  updateUserProfile: (user: UserProfile) => void;
  deleteUser: (id: string) => void;
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  // Reviews
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'status'>) => ReviewItem;
  updateReviewStatus: (productId: string, reviewId: string, status: 'Approved' | 'Pending') => void;
  deleteReview: (productId: string, reviewId: string) => void;
  // Banner actions
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => boolean;
  deleteBanner: (id: string) => void;
  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingHistory'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  assignCourierTracking: (orderId: string, courierName: string, trackingCode: string, note?: string) => void;
  // Courier & Pixel actions
  updateCourierConfig: (config: CourierConfig) => void;
  updatePixelConfig: (config: PixelConfig) => void;
  clearPixelLogs: () => void;
  firePixelEvent: (eventName: string, data?: Record<string, unknown>) => void;
  // Store Settings actions
  updateSettings: (newSettings: StoreSettings) => void;
  // Cart actions
  addToCart: (item: OrderItem) => void;
  removeFromCart: (productId: string, packageId?: string) => void;
  updateCartQuantity: (productId: string, packageId: string | undefined, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper for local storage retrieval
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`foodghor_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`foodghor_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadStorage('products', initialProducts));
  const [banners, setBanners] = useState<Banner[]>(() => loadStorage('banners', initialBanners));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage('orders', initialOrders));
  const [users, setUsers] = useState<UserProfile[]>(() => loadStorage('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadStorage('current_user', null));
  const [courierConfig, setCourierConfig] = useState<CourierConfig>(() =>
    loadStorage('courierConfig', initialCourierConfig)
  );
  const [pixelConfig, setPixelConfig] = useState<PixelConfig>(() =>
    loadStorage('pixelConfig', initialPixelConfig)
  );
  const [settings, setSettings] = useState<StoreSettings>(() => loadStorage('settings', initialSettings));
  const [cart, setCart] = useState<OrderItem[]>(() => loadStorage('cart', []));
  const [pixelLogs, setPixelLogs] = useState<PixelEventLog[]>(() => loadStorage('pixelLogs', []));

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Routing state based on window.location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return hash.slice(1);
    }
    if (hash === '#admin') return '/admin';
    return pathname || '/';
  });

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash.startsWith('#/')) {
        setCurrentPath(hash.slice(1));
      } else if (hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(path || '/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
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

  // Determine active product slug if path is /product/:slug
  const productMatch = currentPath.match(/^\/product\/([^/?#]+)/);
  const activeProductSlug = productMatch ? productMatch[1] : null;

  // Persist states
  useEffect(() => saveStorage('products', products), [products]);
  useEffect(() => saveStorage('banners', banners), [banners]);
  useEffect(() => saveStorage('orders', orders), [orders]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('courierConfig', courierConfig), [courierConfig]);
  useEffect(() => saveStorage('pixelConfig', pixelConfig), [pixelConfig]);
  useEffect(() => saveStorage('settings', settings), [settings]);
  useEffect(() => saveStorage('cart', cart), [cart]);
  useEffect(() => saveStorage('pixelLogs', pixelLogs), [pixelLogs]);

  // User Authentication
  const registerUser = (
    name: string,
    phone: string,
    email: string,
    address?: string,
    city: 'Inside Dhaka' | 'Outside Dhaka' = 'Inside Dhaka'
  ): UserProfile => {
    // Check if user with phone or email already exists
    const existing = users.find(
      (u) =>
        u.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '') ||
        u.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      const updatedUser = {
        ...existing,
        name: name || existing.name,
        address: address || existing.address,
        city: city || existing.city,
      };
      setUsers((prev) => prev.map((u) => (u.id === existing.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
      return updatedUser;
    }

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address: address?.trim(),
      city,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  };

  const loginUser = (phoneOrEmail: string): UserProfile | null => {
    const clean = phoneOrEmail.trim().toLowerCase();
    const cleanPhone = clean.replace(/[^0-9]/g, '');
    const found = users.find(
      (u) =>
        (cleanPhone && u.phone.replace(/[^0-9]/g, '').includes(cleanPhone)) ||
        u.email.toLowerCase() === clean
    );
    if (found) {
      setCurrentUser(found);
      return found;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updated: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  // Review Actions
  const addReview = (reviewData: Omit<ReviewItem, 'id' | 'date' | 'status'>): ReviewItem => {
    const newRev: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'আজকে',
      status: 'Approved',
      verified: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId || p.slug === reviewData.productId) {
          return {
            ...p,
            landingConfig: {
              ...p.landingConfig,
              reviews: [newRev, ...(p.landingConfig.reviews || [])],
            },
          };
        }
        return p;
      })
    );

    return newRev;
  };

  const updateReviewStatus = (productId: string, reviewId: string, status: 'Approved' | 'Pending') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId || p.slug === productId) {
          const updatedRevs = p.landingConfig.reviews.map((r) =>
            r.id === reviewId ? { ...r, status } : r
          );
          return { ...p, landingConfig: { ...p.landingConfig, reviews: updatedRevs } };
        }
        return p;
      })
    );
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId || p.slug === productId) {
          const updatedRevs = p.landingConfig.reviews.filter((r) => r.id !== reviewId);
          return { ...p, landingConfig: { ...p.landingConfig, reviews: updatedRevs } };
        }
        return p;
      })
    );
  };

  // Facebook Pixel firing engine
  const firePixelEvent = (eventName: string, data: Record<string, unknown> = {}) => {
    if (!pixelConfig.isEnabled) return;

    if (eventName === 'PageView' && !pixelConfig.trackPageView) return;
    if (eventName === 'ViewContent' && !pixelConfig.trackViewContent) return;
    if (eventName === 'AddToCart' && !pixelConfig.trackAddToCart) return;
    if (eventName === 'InitiateCheckout' && !pixelConfig.trackInitiateCheckout) return;
    if (eventName === 'Purchase' && !pixelConfig.trackPurchase) return;

    const newLog: PixelEventLog = {
      id: `px-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      data,
    };

    setPixelLogs((prev) => [newLog, ...prev.slice(0, 49)]);

    try {
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      if (typeof fbq === 'function') {
        fbq('track', eventName, data);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    firePixelEvent('PageView', { path: currentPath });
  }, [currentPath]);

  // Products CRUD
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  // Banner actions (max 5 banners)
  const updateBanner = (updated: Banner) => {
    setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const addBanner = (bannerData: Omit<Banner, 'id'>): boolean => {
    if (banners.length >= 5) {
      return false;
    }
    const newBanner: Banner = {
      ...bannerData,
      id: `b-${Date.now()}`,
      order: banners.length + 1,
    };
    setBanners((prev) => [...prev, newBanner]);
    return true;
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Order actions
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingHistory'>
  ): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `FG-${randomNum}`;
    const trackingCode = `${courierConfig.defaultCourier.slice(0, 2).toUpperCase()}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'Pending',
      courierName: courierConfig.defaultCourier,
      trackingCode: courierConfig.autoGenerateTracking ? trackingCode : undefined,
      createdAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'অর্ডার প্লেস করা হয়েছে',
          timestamp: new Date().toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: 'অর্ডারটি সফলভাবে সিস্টেমে জমা হয়েছে। দ্রুত ভেরিফিকেশন করা হবে।',
          location: 'FoodGhor Central Portal',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // If user is linked, update their purchase metrics
    if (orderData.userId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === orderData.userId) {
            return {
              ...u,
              totalOrders: (u.totalOrders || 0) + 1,
              totalSpent: (u.totalSpent || 0) + newOrder.total,
            };
          }
          return u;
        })
      );
      if (currentUser?.id === orderData.userId) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                totalOrders: (prev.totalOrders || 0) + 1,
                totalSpent: (prev.totalSpent || 0) + newOrder.total,
              }
            : null
        );
      }
    }

    // Fire purchase pixel event
    firePixelEvent('Purchase', {
      orderId: newOrder.id,
      value: newOrder.total,
      currency: 'BDT',
      itemsCount: newOrder.items.length,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const statusBengaliMap: Record<Order['status'], string> = {
          Pending: 'অপেক্ষমাণ',
          Confirmed: 'অর্ডার নিশ্চিত করা হয়েছে',
          Processing: 'প্যাকেজিং ও প্রসেসিং চলছে',
          Shipped: 'কুরিয়ারে হস্তান্তর করা হয়েছে',
          Delivered: 'সফলভাবে ডেলিভার্ড',
          Cancelled: 'অর্ডার বাতিল করা হয়েছে',
        };
        const newHistory = [
          ...order.trackingHistory,
          {
            status: statusBengaliMap[status],
            timestamp: new Date().toLocaleDateString('bn-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            note: note || `অর্ডার স্ট্যাটাস পরিবর্তিত হয়ে '${statusBengaliMap[status]}' হয়েছে।`,
            location: 'Central Warehouse / Dispatch Hub',
          },
        ];
        return { ...order, status, trackingHistory: newHistory };
      })
    );
  };

  const assignCourierTracking = (
    orderId: string,
    courierName: string,
    trackingCode: string,
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const newHistory = [
          ...order.trackingHistory,
          {
            status: 'কুরিয়ারে হস্তান্তর ও ট্র্যাকিং কোড জেনারেট',
            timestamp: new Date().toLocaleDateString('bn-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            note: note || `${courierName} কুরিয়ারে হস্তান্তর করা হয়েছে। ট্র্যাকিং কোড: ${trackingCode}`,
            location: `${courierName} Hub`,
          },
        ];
        return {
          ...order,
          courierName,
          trackingCode,
          status: 'Shipped' as const,
          trackingHistory: newHistory,
        };
      })
    );
  };

  // Config actions
  const updateCourierConfig = (config: CourierConfig) => setCourierConfig(config);
  const updatePixelConfig = (config: PixelConfig) => setPixelConfig(config);
  const clearPixelLogs = () => setPixelLogs([]);
  const updateSettings = (newSettings: StoreSettings) => setSettings(newSettings);

  // Cart actions
  const addToCart = (item: OrderItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.packageId === item.packageId
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    firePixelEvent('AddToCart', {
      product: item.productName,
      price: item.price,
      quantity: item.quantity,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, packageId?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (packageId ? i.packageId === packageId : true))
      )
    );
  };

  const updateCartQuantity = (productId: string, packageId: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId === productId && (!packageId || i.packageId === packageId)) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        banners,
        orders,
        users,
        currentUser,
        courierConfig,
        pixelConfig,
        pixelLogs,
        settings,
        cart,
        isCartOpen,
        isTrackingOpen,
        isAuthModalOpen,
        currentPath,
        activeProductSlug,
        lastPlacedOrder,
        setIsCartOpen,
        setIsTrackingOpen,
        setIsAuthModalOpen,
        setLastPlacedOrder,
        navigate,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        deleteUser,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        addReview,
        updateReviewStatus,
        deleteReview,
        updateBanner,
        addBanner,
        deleteBanner,
        placeOrder,
        updateOrderStatus,
        assignCourierTracking,
        updateCourierConfig,
        updatePixelConfig,
        clearPixelLogs,
        firePixelEvent,
        updateSettings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
