import React from 'react';
import { CheckCircle2, MessageCircle, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsTrackingOpen, settings } = useStore();

  if (!lastPlacedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 text-emerald-700" />
        </div>

        <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
          অর্ডার সফল হয়েছে!
        </span>

        <h2 className="text-2xl font-black text-stone-900 font-serif">
          ধন্যবাদ, {lastPlacedOrder.customerName}!
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
          আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে। আমাদের কাস্টমার কেয়ার প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবে।
        </p>

        {/* Order Details Receipt Box */}
        <div className="my-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">অর্ডার আইডি:</span>
            <span className="font-mono font-black text-emerald-900 text-sm">
              #{lastPlacedOrder.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">মোবাইল:</span>
            <span className="font-semibold text-stone-900">{lastPlacedOrder.customerPhone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">ডেলিভারি ঠিকানা:</span>
            <span className="font-medium text-stone-800 text-right max-w-[220px] truncate">
              {lastPlacedOrder.customerAddress}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">পেমেন্ট মেথড:</span>
            <span className="font-bold text-amber-700">ক্যাশ অন ডেলিভারি (COD)</span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm">
            <span>সর্বমোট প্রদেয়:</span>
            <span className="text-base font-black text-emerald-900">
              ৳{lastPlacedOrder.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>ডেলিভারিম্যানের সামনে পার্সেলটি খুলে দেখে টাকা পরিশোধ করুন</span>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              const order = lastPlacedOrder;
              setLastPlacedOrder(null);
              setIsTrackingOpen(true);
            }}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>লাইভ পার্সেল ট্র্যাক করুন</span>
          </button>

          <a
            href={`https://wa.me/88${settings.whatsapp}?text=${encodeURIComponent(
              `হ্যালো ফুডঘর! আমি অর্ডার #${lastPlacedOrder.id} কনফার্ম করেছি (নাম: ${lastPlacedOrder.customerName})।`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold rounded-xl border border-[#25D366]/30 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
            <span>হোয়াটসঅ্যাপে আপডেট জানতে মেসেজ দিন</span>
          </a>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
          >
            শপিং চালিয়ে যান
          </button>
        </div>
      </div>
    </div>
  );
};
