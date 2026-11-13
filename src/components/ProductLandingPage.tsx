import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ArrowRight,
  PackageCheck,
  AlertCircle,
  Award,
  HeartHandshake,
  Users,
  Flame,
  User,
  Mail,
  Lock,
} from 'lucide-react';
import { Product, ProductPackage } from '../types';
import { useStore } from '../context/StoreContext';
import { CustomerReviews } from './reviews/CustomerReviews';

interface ProductLandingPageProps {
  product: Product;
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({ product }) => {
  const {
    courierConfig,
    settings,
    placeOrder,
    firePixelEvent,
    currentUser,
    registerUser,
    setIsAuthModalOpen,
  } = useStore();
  const cfg = product.landingConfig;

  // Selected package state
  const defaultPackage =
    cfg.packages?.find((p) => p.popular) || cfg.packages?.[0] || {
      id: 'default',
      name: product.name,
      weight: product.unit,
      price: product.price,
      regularPrice: product.regularPrice,
    };

  const [selectedPackage, setSelectedPackage] = useState<ProductPackage>(defaultPackage);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);

  // Form Fields (Pre-filled if logged in)
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [deliveryArea, setDeliveryArea] = useState<'Inside Dhaka' | 'Outside Dhaka'>(
    currentUser?.city || 'Inside Dhaka'
  );
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Synchronize when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (!customerAddress && currentUser.address) setCustomerAddress(currentUser.address);
      if (currentUser.city) setDeliveryArea(currentUser.city);
    }
  }, [currentUser]);

  // Dynamic Urgency Countdown Timer
  const [timeLeft, setTimeLeft] = useState((cfg.countdownMinutes || 45) * 60);
  const [liveViewers, setLiveViewers] = useState(42);
  const [stockLeft, setStockLeft] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 2700));
    }, 1000);

    const viewerInterval = setInterval(() => {
      setLiveViewers((prev) => Math.floor(35 + Math.random() * 18));
    }, 12000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerInterval);
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const { minutes, seconds } = formatTimer(timeLeft);

  // Fire ViewContent pixel on mount
  useEffect(() => {
    firePixelEvent('ViewContent', {
      productName: product.name,
      productId: product.id,
      price: selectedPackage.price,
      currency: 'BDT',
    });
  }, [product.id, selectedPackage.price]);

  // Pricing calculations
  const deliveryFee =
    deliveryArea === 'Inside Dhaka'
      ? courierConfig.insideDhakaRate
      : courierConfig.outsideDhakaRate;

  const subtotal = selectedPackage.price * quantity;
  const grandTotal = subtotal + deliveryFee;

  // Form submission with MANDATORY customer account creation
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      setFormError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)।');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setFormError('সঠিক ইমেইল এড্রেস দিন (কাস্টমার অ্যাকাউন্ট ভেরিফিকেশনের জন্য)।');
      return;
    }
    if (!customerAddress.trim()) {
      setFormError('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure user profile is registered/updated
      let user = currentUser;
      if (!user) {
        user = registerUser(
          customerName.trim(),
          customerPhone.trim(),
          customerEmail.trim(),
          customerAddress.trim(),
          deliveryArea
        );
      }

      // 2. Place Order linked to User
      placeOrder({
        userId: user.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim(),
        customerCity: deliveryArea,
        customerNote: customerNote.trim() || undefined,
        items: [
          {
            productId: product.id,
            productName: product.name,
            banglaName: product.banglaName,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            price: selectedPackage.price,
            quantity: quantity,
            image: product.image,
          },
        ],
        subtotal,
        deliveryCharge: deliveryFee,
        total: grandTotal,
        paymentMethod: 'Cash on Delivery',
        courierName: courierConfig.defaultCourier,
      });

      // Clear non-user fields
      setCustomerNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToOrderForm = () => {
    document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-900 min-h-screen pb-20 lg:pb-0">
      {/* 1. Dynamic Urgency Countdown & 'Limited Time Offer' Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-800 to-amber-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 lg:sticky lg:top-20 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Urgency Message */}
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span className="text-amber-200">লিমিটেড টাইম সুপার ডিল:</span>
            <span>আজকের অর্ডারে বিশেষ ডিসকাউন্ট ও ফ্রি গিফট!</span>
          </div>

          {/* Countdown Clock + Viewers */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-950/40 px-3 py-1 rounded-xl border border-white/10 font-bold">
              <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-stone-300 text-[11px]">অফার শেষ হতে:</span>
              <div className="flex items-center gap-1 font-mono text-amber-300 text-sm">
                <span className="bg-stone-900/80 px-1.5 py-0.5 rounded">{minutes}</span>
                <span>:</span>
                <span className="bg-stone-900/80 px-1.5 py-0.5 rounded">{seconds}</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] bg-black/20 px-2.5 py-1 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{liveViewers} জন লাইভ দেখছেন</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Sales Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visual Showcase & Package Selector (lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges and Main Headline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{cfg.heroBadge || '১০০% খাঁটি ও প্রিমিয়াম ফুড'}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>মাত্র {stockLeft} টি অবশিষ্ট আছে</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-stone-950 font-serif leading-tight">
                {cfg.headline}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
                {cfg.subHeadline}
              </p>
            </div>

            {/* Main Image Showcase */}
            <div className="bg-white rounded-3xl p-3 border border-stone-200/90 shadow-md">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={activeImage}
                  alt={product.banglaName}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ফুডঘর অরিজিনাল কোয়ালিটি সার্টিফাইড</span>
                </div>
              </div>

              {/* Thumbnail Switcher */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImage === img
                          ? 'border-emerald-700 shadow-md scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Package / Weight Selection Cards */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-emerald-700" />
                  <span>প্যাকেজ নির্বাচন করুন (বেশি পরিমাণে অতিরিক্ত ছাড়!)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cfg.packages.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  const discount = pkg.regularPrice - pkg.price;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-md ring-2 ring-emerald-700/20'
                          : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm">
                          সেরা অফার
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-500">{pkg.weight}</span>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-emerald-700 bg-emerald-700' : 'border-stone-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1">{pkg.name}</h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-emerald-900">৳{pkg.price}</span>
                          <span className="text-xs text-stone-400 line-through">
                            ৳{pkg.regularPrice}
                          </span>
                        </div>
                        {discount > 0 && (
                          <span className="text-[11px] font-semibold text-amber-700 block mt-0.5">
                            সাশ্রয়: ৳{discount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Sourcing Highlights */}
            <div className="bg-emerald-950 text-emerald-50 rounded-3xl p-6 shadow-lg border border-emerald-900">
              <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>ফুডঘরের খাঁটি খাদ্যপণ্যের বিশেষত্ব:</span>
              </h3>
              <ul className="space-y-3 text-sm text-stone-200 font-medium">
                {cfg.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: 1-Click Fast Checkout Form with Mandatory Account Creation */}
          <div id="order-form-section" className="lg:col-span-5 lg:sticky lg:top-36 z-20">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-emerald-700 ring-4 ring-emerald-700/10">
              {/* Form Header */}
              <div className="text-center pb-5 border-b border-stone-200">
                <span className="bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
                  ক্যাশ অন ডেলিভারি ফর্ম
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                  অর্ডার করতে নিচের তথ্য দিন
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  নিরাপদ অর্ডার ও ডেলিভারি ট্র্যাকিংয়ের জন্য কাস্টমার প্রোফাইল তৈরি হবে।
                </p>
              </div>

              {/* Logged in User Bar if authenticated */}
              {currentUser ? (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>লগইনকৃত: {currentUser.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-[11px] text-emerald-800 font-bold hover:underline"
                  >
                    পরিবর্তন
                  </button>
                </div>
              ) : (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center text-[11px] text-amber-900 font-medium flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>অর্ডার করার সময় আপনার নামে স্বয়ংক্রিয় কাস্টমার একাউন্ট তৈরি হবে</span>
                </div>
              )}

              {/* Form Validation Error */}
              {formError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleOrderSubmit} className="mt-5 space-y-3.5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    আপনার নাম <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: সাব্বির আহমেদ"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Email (Mandatory as requested) */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    ইমেইল এড্রেস (অ্যাকাউন্ট ও মেমোর জন্য) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-stone-50/50"
                  />
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    ডেলিভারি এরিয়া বেছে নিন <span className="text-rose-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Inside Dhaka')}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        deliveryArea === 'Inside Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span>ঢাকার ভিতরে</span>
                      <span className="text-emerald-700 font-extrabold mt-0.5">
                        ৳{courierConfig.insideDhakaRate}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Outside Dhaka')}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        deliveryArea === 'Outside Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span>ঢাকার বাইরে</span>
                      <span className="text-emerald-700 font-extrabold mt-0.5">
                        ৳{courierConfig.outsideDhakaRate}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100/70 border border-stone-200">
                  <span className="text-xs font-bold text-stone-800">অর্ডারের পরিমাণ:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-50 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-stone-900 text-sm font-sans w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bill Summary Breakdown */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span>নির্বাচিত পণ্য:</span>
                    <span className="font-bold text-stone-900 truncate max-w-[200px]">
                      {product.banglaName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>প্যাকেজ:</span>
                    <span className="font-semibold text-stone-900">
                      {selectedPackage.name} ({quantity}x)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>পণ্যের মূল্য:</span>
                    <span className="font-bold text-stone-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold text-stone-900">৳{deliveryFee}</span>
                  </div>
                  <div className="pt-2 border-t border-amber-300/60 flex justify-between items-baseline text-sm font-extrabold text-stone-950">
                    <span>সর্বমোট প্রদেয়:</span>
                    <span className="text-lg text-emerald-900">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Primary Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-white text-base sm:text-lg font-black rounded-2xl shadow-xl hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-700"
                >
                  <PackageCheck className="w-5 h-5 text-amber-400" />
                  <span>
                    {isSubmitting
                      ? 'অর্ডার প্রসেস হচ্ছে...'
                      : `অর্ডার কনফার্ম করুন — ৳${grandTotal.toLocaleString()}`}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Direct WhatsApp Order Option */}
                <a
                  href={`https://wa.me/88${settings.whatsapp}?text=${encodeURIComponent(
                    `হ্যালো ফুডঘর! আমি "${product.banglaName} (${selectedPackage.name})" অর্ডার করতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold rounded-xl border border-[#25D366]/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                  <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন</span>
                </a>

                {/* Guarantee Note */}
                <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>পণ্য হাতে পেয়ে দেখে শতভাগ নিশ্চিত হয়ে মূল্য দিন</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust Strip */}
      <section className="bg-white border-y border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">সরাসরি ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-500 mt-0.5">পণ্য হাতে পেয়ে মূল্য দিন</p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">১০০% অর্গানিক ও ল্যাব টেস্টেড</h4>
              <p className="text-xs text-stone-500 mt-0.5">ভেজালহীন আসল বিশুদ্ধতা</p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">ইনস্ট্যান্ট রিটার্ন নিশ্চয়তা</h4>
              <p className="text-xs text-stone-500 mt-0.5">পছন্দ না হলে ফেরত দিন</p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-2">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-stone-500 mt-0.5">হটলাইন: {settings.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: FoodGhor vs Regular Market */}
      {cfg.comparison && cfg.comparison.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              তুলনামূলক পার্থক্য
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif mt-3">
              কেন ফুডঘরের পণ্য বাজারের সাধারণ পণ্যের চেয়ে আলাদা?
            </h2>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-900 text-white text-xs sm:text-sm">
                  <th className="py-4 px-4 sm:px-6 font-bold w-1/3">বৈশিষ্ট্য</th>
                  <th className="py-4 px-4 sm:px-6 font-bold w-1/3 bg-emerald-800 text-amber-300">
                    ফুডঘর (১০০% খাঁটি)
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold w-1/3 text-stone-300">
                    বাজারের সাধারণ পণ্য
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {cfg.comparison.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                    <td className="py-4 px-4 sm:px-6 font-bold text-stone-900">{item.feature}</td>
                    <td className="py-4 px-4 sm:px-6 font-semibold text-emerald-900 bg-emerald-50/40">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{item.ourProduct}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-stone-500">
                      <span>{item.regularMarket}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. Health Benefits */}
      {cfg.benefits && cfg.benefits.length > 0 && (
        <section className="bg-stone-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                স্বাস্থ্যের সুরক্ষায়
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif mt-3">
                পণ্যটির অনন্য স্বাস্থ্য ও পুষ্টি উপকারিতা
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cfg.benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 font-bold">
                    0{i + 1}
                  </div>
                  <h3 className="font-bold text-stone-900 text-base mb-2 font-serif">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. How it is made / Process */}
      {cfg.howItIsMade && cfg.howItIsMade.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              আমাদের প্রক্রিয়াজাতকরণ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif mt-3">
              কীভাবে প্রস্তুত হয় ফুডঘরের খাঁটি খাদ্যপণ্য?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cfg.howItIsMade.map((step) => (
              <div
                key={step.step}
                className="relative bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 font-black text-xl flex items-center justify-center mb-4 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Dedicated Customer Reviews Component (pulls verified buyer testimonials & photo uploads) */}
      <CustomerReviews
        productId={product.id}
        productName={product.banglaName}
        reviews={cfg.reviews || []}
      />

      {/* 8. FAQs Accordion */}
      {cfg.faqs && cfg.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              সাধারণ জিজ্ঞাসা
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif mt-3">
              সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {cfg.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm open:shadow-md transition-all"
              >
                <summary className="flex items-center justify-between p-5 font-bold text-stone-900 text-sm sm:text-base cursor-pointer list-none select-none">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-sans">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 9. Bottom Repeat Order CTA Section */}
      <section className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white py-16 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <HeartHandshake className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif">
            পরিবারের সুস্বাস্থ্যের জন্য আজই খাঁটি পণ্য সংগ্রহ করুন
          </h2>
          <p className="text-sm sm:text-base text-stone-300">
            কোনোরূপ ঝুঁকি নেই – পণ্য হাতে পেয়ে চেক করে তারপর মূল্য পরিশোধ করুন।
          </p>
          <div className="pt-3">
            <button
              onClick={scrollToOrderForm}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 text-base sm:text-lg font-black rounded-2xl shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <PackageCheck className="w-5 h-5" />
              <span>উপরে গিয়ে সরাসরি অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. Sticky Mobile Bottom Order Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-stone-500 block">মোট প্রদেয় মূল্য</span>
          <span className="text-lg font-black text-emerald-900 font-sans">
            ৳{grandTotal.toLocaleString()}
          </span>
        </div>
        <button
          onClick={scrollToOrderForm}
          className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <PackageCheck className="w-4 h-4 text-amber-300" />
          <span>এখনই অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
};
