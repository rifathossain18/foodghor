import React from 'react';
import { Phone, Mail, MapPin, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setIsTrackingOpen, navigate } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="border-b border-stone-800/80 py-8 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">১০০% নির্ভেজাল খাদ্যপণ্য</h4>
              <p className="text-xs text-stone-400 mt-0.5">ল্যাব টেস্টেড ও কোনো প্রকার কেমিক্যাল বা প্রিজারভেটিভ মুক্ত</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/50 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">সারাদেশে ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-400 mt-0.5">পণ্য হাতে পেয়ে যাচাই করে মূল্য পরিশোধ করার ১০০% সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">২৪/৭ কাস্টমার সার্ভিস</h4>
              <p className="text-xs text-stone-400 mt-0.5">যেকোনো তথ্যে কল বা হোয়াটসঅ্যাপ করুন {settings.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-400 font-bold text-xl flex items-center justify-center border border-emerald-700">
                ফু
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white font-serif block leading-none">
                  {settings.banglaName}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block mt-0.5">
                  {settings.storeName} Organic
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans">
              {settings.tagline}। সুন্দরবনের খাঁটি বুনো মধু, চাটমোহরের ঐতিহ্যবাহী গাওয়া ঘি, ঘানি ভাঙা সরিষার তেল ও পুষ্টিকর বাদাম নিয়ে আপনার ঘরে বিশুদ্ধতার স্বাদ পৌঁছে দেওয়াই আমাদের লক্ষ্য।
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>হটলাইন: {settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ইমেইল: {settings.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-serif">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <a
                  href="#products"
                  className="hover:text-emerald-400 transition-colors"
                >
                  সকল খাদ্যপণ্য
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>লাইভ অর্ডার ট্র্যাকিং</span>
                </button>
              </li>
              <li>
                <a
                  href="#story"
                  className="hover:text-emerald-400 transition-colors"
                >
                  আমাদের বিশুদ্ধতার গল্প
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="hover:text-emerald-400 transition-colors"
                >
                  গ্রাহকদের মতামত
                </a>
              </li>
            </ul>
          </div>

          {/* Sourcing & Categories */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-serif">
              খাদ্যপণ্যের বিভাগ
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>সুন্দরবনের প্রাকৃতিক চাকের মধু</li>
              <li>পাবনার ঐতিহ্যবাহী গাওয়া ঘি</li>
              <li>কাঠের ঘানি ভাঙা কাঁচা সরিষার তেল</li>
              <li>রয়্যাল এনার্জি ড্রাই ফ্রুটস ও বাদাম মিক্স</li>
              <li>কালোজিরা ও অর্গানিক সিডস</li>
            </ul>
          </div>

          {/* Delivery & Payment Partners */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-serif">
              ডেলিভারি ও পেমেন্ট
            </h3>
            <p className="text-xs text-stone-400 mb-3">
              সারাদেশে বিশ্বস্ত কুরিয়ার নেটওয়ার্কের মাধ্যমে ক্যাশ অন ডেলিভারি:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-300 mb-5">
              <div className="p-2 rounded-lg bg-stone-800 text-center border border-stone-700/60">
                Steadfast Courier
              </div>
              <div className="p-2 rounded-lg bg-stone-800 text-center border border-stone-700/60">
                Pathao Courier
              </div>
              <div className="p-2 rounded-lg bg-stone-800 text-center border border-stone-700/60">
                RedX Logistics
              </div>
              <div className="p-2 rounded-lg bg-stone-800 text-center border border-stone-700/60">
                Paperfly Delivery
              </div>
            </div>

            <span className="text-[11px] text-stone-400 block mb-1">পেমেন্ট মেথড:</span>
            <div className="flex flex-wrap gap-2 text-[11px] text-stone-300 font-medium">
              <span className="px-2.5 py-1 bg-stone-800 rounded border border-stone-700">ক্যাশ অন ডেলিভারি (COD)</span>
              <span className="px-2.5 py-1 bg-stone-800 rounded border border-stone-700">বিকাশ (bKash)</span>
              <span className="px-2.5 py-1 bg-stone-800 rounded border border-stone-700">নগদ (Nagad)</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName} ({settings.banglaName}) - সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>শতভাগ খাঁটি ও নিরাপদ খাবারের অঙ্গীকার</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
