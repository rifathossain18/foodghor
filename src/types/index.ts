export interface ProductPackage {
  id: string;
  name: string;
  weight: string;
  price: number;
  regularPrice: number;
  popular?: boolean;
}

export interface ComparisonItem {
  feature: string;
  ourProduct: string;
  regularMarket: string;
}

export interface BenefitItem {
  title: string;
  desc: string;
  iconName?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  desc: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  id: string;
  productId?: string;
  name: string;
  phone?: string;
  email?: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  image?: string;
  verified: boolean;
  status: 'Approved' | 'Pending';
}

export interface ProductLandingConfig {
  headline: string;
  subHeadline: string;
  heroBadge: string;
  countdownMinutes: number;
  urgencyBannerText?: string;
  limitedStockCount?: number;
  liveViewersMin?: number;
  liveViewersMax?: number;
  highlights: string[];
  packages: ProductPackage[];
  comparison: ComparisonItem[];
  benefits: BenefitItem[];
  howItIsMade: ProcessStep[];
  guarantees: string[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  banglaName: string;
  category: string;
  price: number;
  regularPrice: number;
  unit: string;
  inStock: boolean;
  stockCount: number;
  image: string;
  galleryImages: string[];
  shortDescription: string;
  landingConfig: ProductLandingConfig;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  active: boolean;
  order: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  banglaName?: string;
  packageId?: string;
  packageName?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface TrackingEntry {
  status: string;
  timestamp: string;
  note: string;
  location?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: 'Inside Dhaka' | 'Outside Dhaka';
  customerNote?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  courierName: string;
  trackingCode?: string;
  trackingHistory: TrackingEntry[];
  createdAt: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  address?: string;
  city?: 'Inside Dhaka' | 'Outside Dhaka';
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
}

export interface CourierConfig {
  defaultCourier: 'Steadfast' | 'Pathao' | 'RedX' | 'Paperfly';
  steadfastApiKey: string;
  steadfastSecretKey: string;
  pathaoClientId: string;
  pathaoClientSecret: string;
  insideDhakaRate: number;
  outsideDhakaRate: number;
  freeDeliveryThreshold: number;
  autoGenerateTracking: boolean;
}

export interface PixelConfig {
  pixelId: string;
  isEnabled: boolean;
  trackPageView: boolean;
  trackViewContent: boolean;
  trackAddToCart: boolean;
  trackInitiateCheckout: boolean;
  trackPurchase: boolean;
  testEventCode: string;
}

export interface PixelEventLog {
  id: string;
  eventName: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface StoreSettings {
  storeName: string;
  banglaName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  facebookUrl: string;
  announcementBarText: string;
  showAnnouncementBar: boolean;
  adminPin: string;
  adminRecoveryCode?: string;
  enableGuestCheckout: boolean; // default false as required: users MUST create account
  cloudflareWorkerUrl?: string;
}
