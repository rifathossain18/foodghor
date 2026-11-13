import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BannerCarousel } from './BannerCarousel';
import { ProductCard } from './ProductCard';

export const HomePage: React.FC = () => {
  const { products, settings, setIsTrackingOpen, navigate } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');

  // Extract unique categories
  const categories = ['সকল', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'সকল'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Lateral 5-Photo Banner Carousel */}
      <section>
        <BannerCarousel />
      </section>

      {/* 2. Value Proposition Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-500 mt-0.5">পণ্য হাতে পেয়ে টাকা দিন</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">১০০% অর্গানিক নিশ্চয়তা</h4>
              <p className="text-xs text-stone-500 mt-0.5">ল্যাব টেস্টেড খাঁটি পণ্য</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">মানিব্যাক গ্যারান্টি</h4>
              <p className="text-xs text-stone-500 mt-0.5">পছন্দ না হলে রিটার্ন সুবিধা</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">সরাসরি নিজস্ব সোর্সিং</h4>
              <p className="text-xs text-stone-500 mt-0.5">মধ্যস্বত্বভোগী ছাড়া খাঁটি পণ্য</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Catalog & Category Filter */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            বিশুদ্ধ খাদ্য সম্ভার
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-950 font-serif mt-2.5">
            ফুডঘরের জনপ্রিয় প্রিমিয়াম খাদ্যপণ্য
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans">
            প্রতিটি পণ্যের বিস্তারিত সেলস ফানেল ল্যান্ডিং পেজ দেখতে পণ্যটিতে ক্লিক করুন
          </p>
        </div>

        {/* Category Pills (Functional Button Filter Controls) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Brand Story & Craftsmanship Showcase */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block">
                আমাদের বিশুদ্ধতার প্রতিশ্রুতি
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
                খাদ্যে ভেজাল নয়, বিশুদ্ধতাই আমাদের মূল শক্তি
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-sans">
                আজকের বাজারে যখন খাঁটি খাবারের তীব্র সংকট, তখনই ফুডঘরের জন্ম। সুন্দরবনের গভীরে মৌয়ালদের সংগৃহীত কাঁচা মধু থেকে শুরু করে পাবনার দেশি গাভীর দুধের খাঁটি গাওয়া ঘি—আমরা কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি কৃষকের ঘর থেকে আপনার খাবার টেবিলে পণ্য পৌঁছে দেই।
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>কোনো কৃত্রিম ফ্লেভার বা কেমিক্যাল নেই</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>সম্পূর্ণ হাইজিনিক কাচের জারে প্যাকেজিং</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ল্যাব টেস্টেড ও বিএসটিআই স্ট্যান্ডার্ড</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>পণ্য দেখে ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-800">
                <img
                  src="/src/assets/images/hero_foodghor_gourmet_honey_ghee_1794499288257.jpg"
                  alt="FoodGhor Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Strip */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            গ্রাহকদের প্রশংসা
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif mt-2">
            হাজারো পরিবারের প্রতিদিনের নির্ভরতা
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
              &quot;সুন্দরবনের মধুটা সত্যি অসাধারণ! গন্ধ আর স্বাদে আসল বুনো মধুর প্রমাণ পাওয়া যায়। বাচ্চাদের প্রতিদিন সকালে দিচ্ছি। ডেলিভারিও খুব দ্রুত পেয়েছি।&quot;
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs">
              <h4 className="font-bold text-stone-900">মাহবুবুর রহমান</h4>
              <p className="text-stone-500 text-[11px]">উত্তরা, ঢাকা · ভেরিফাইড ক্রেতা</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
              &quot;পাবনার গাওয়া ঘি এর ঘ্রাণ একদম ছেলেবেলার স্মৃতির মতো। পোলাও রান্না করেছিলাম, সবাই খুব প্রশংসা করেছে। প্যাকেজিংও খুব চমৎকার ছিল।&quot;
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs">
              <h4 className="font-bold text-stone-900">ফারহানা জামান</h4>
              <p className="text-stone-500 text-[11px]">ধানমন্ডি, ঢাকা · ভেরিফাইড ক্রেতা</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
              &quot;ঘানি ভাঙা সরিষার তেল ও ড্রাই ফ্রুটস কম্বো অর্ডার করেছিলাম। সরিষার তেলের ঝাঁঝ যেমন হওয়া উচিত ঠিক তেমনই। ফুডঘরকে অনেক ধন্যবাদ।&quot;
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs">
              <h4 className="font-bold text-stone-900">জহিরুল কাইয়ুম</h4>
              <p className="text-stone-500 text-[11px]">জিইসি মোড়, চট্টগ্রাম · ভেরিফাইড ক্রেতা</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Order Tracking Quick Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-stone-950 text-lg sm:text-xl font-serif">
                ইতিমধ্যে অর্ডার করেছেন? আপনার পার্সেল ট্র্যাক করুন
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                মোবাইল নম্বর বা অর্ডার আইডি দিয়ে কুরিয়ার ডেলিভারির লাইভ স্ট্যাটাস দেখুন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(true)}
            className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>লাইভ ট্র্যাক করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
