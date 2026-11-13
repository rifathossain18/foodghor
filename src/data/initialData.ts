import { Banner, CourierConfig, Order, PixelConfig, Product, StoreSettings, UserProfile } from '../types';

// ============================================================
// ⚙️ Store Settings — শুধু ব্র্যান্ডিং বেসিক, বাকি সব খালি
//    (Admin → Settings থেকে সব পূরণ করবেন)
// ============================================================
export const initialSettings: StoreSettings = {
  // Basic branding
  storeName: 'FoodGhor',
  banglaName: 'ফুডঘর',
  tagline: 'বিশুদ্ধতা ও ঐতিহ্যের বিশ্বস্ত প্রতিষ্ঠান',
  logoUrl: '',

  // Contact info (Admin Settings থেকে সেট করুন)
  phone: '',
  whatsapp: '',
  address: '',
  email: '',
  facebookUrl: '',

  // Announcement
  announcementBarText: '',
  showAnnouncementBar: false,

  // Admin security (প্রথমবার /admin এ ঢুকলে সেটআপ হবে)
  adminPin: '',
  adminRecoveryCode: '',

  // Other
  enableGuestCheckout: false,
  cloudflareWorkerUrl: '',
};

// ============================================================
// 🎨 Banners — খালি (Admin → Banner স্লাইডার থেকে ৫টি যোগ করবেন)
// ============================================================
export const initialBanners: Banner[] = [];

// ============================================================
// 📦 Products — খালি (Admin → প্রোডাক্ট থেকে যোগ করবেন)
// ============================================================
export const initialProducts: Product[] = [];

// ============================================================
// 🛒 Orders — খালি (কাস্টমার অর্ডার করলে অটো যোগ হবে)
// ============================================================
export const initialOrders: Order[] = [];

// ============================================================
// 👥 Users — খালি (কাস্টমার রেজিস্টার করলে অটো যোগ হবে)
// ============================================================
export const initialUsers: UserProfile[] = [];

// ============================================================
// 🚚 Courier — শুধু ডিফল্ট রেট, API keys Admin থেকে সেট করবেন
// ============================================================
export const initialCourierConfig: CourierConfig = {
  defaultCourier: 'Steadfast',
  steadfastApiKey: '',
  steadfastSecretKey: '',
  pathaoClientId: '',
  pathaoClientSecret: '',
  insideDhakaRate: 70,
  outsideDhakaRate: 130,
  freeDeliveryThreshold: 2500,
  autoGenerateTracking: true,
};

// ============================================================
// 📊 Pixel — শুধু ডিফল্ট, Pixel ID Admin থেকে সেট করবেন
// ============================================================
export const initialPixelConfig: PixelConfig = {
  pixelId: '',
  isEnabled: false,
  trackPageView: true,
  trackViewContent: true,
  trackAddToCart: true,
  trackInitiateCheckout: true,
  trackPurchase: true,
  testEventCode: '',
};