import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, Copy, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, orders } = useStore();
  const [searchKey, setSearchKey] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKey.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.customerPhone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
        (o.trackingCode && o.trackingCode.toLowerCase() === query)
    );

    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsTrackingOpen(false);
            setMatchedOrder(null);
            setHasSearched(false);
            setSearchKey('');
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            লাইভ অর্ডার ও কুরিয়ার ট্র্যাকিং
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            আপনার অর্ডার নম্বর (যেমন: FG-9842) অথবা মোবাইল নম্বর দিয়ে পার্সেল ট্র্যাক করুন
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="অর্ডার আইডি (FG-XXXX) বা মোবাইল নম্বর..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>ট্র্যাক করুন</span>
          </button>
        </form>

        {/* Search Result Display */}
        {hasSearched && (
          <div>
            {!matchedOrder ? (
              <div className="p-6 rounded-2xl bg-stone-50 text-center border border-stone-200">
                <Clock className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="font-bold text-stone-800 text-sm">কোনো অর্ডার পাওয়া যায়নি</h4>
                <p className="text-xs text-stone-500 mt-1">
                  অনুগ্রহ করে আপনার সঠিক অর্ডার আইডি অথবা অর্ডার করার সময় দেওয়া মোবাইল নম্বরটি লিখুন।
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Parcel Summary Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase">
                      অর্ডার নম্বর
                    </span>
                    <h3 className="text-lg font-black text-stone-900 font-mono">
                      #{matchedOrder.id}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      গ্রাহক: <span className="font-semibold">{matchedOrder.customerName}</span> (
                      {matchedOrder.customerCity === 'Inside Dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase">
                      কুরিয়ার পার্টনার
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {matchedOrder.courierName} কুরিয়ার
                      </span>
                      {matchedOrder.trackingCode && (
                        <button
                          onClick={() => handleCopy(matchedOrder.trackingCode!)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-stone-300 text-[11px] font-mono hover:bg-stone-50 text-stone-700"
                          title="ট্র্যাকিং কোড কপি করুন"
                        >
                          <span>{matchedOrder.trackingCode}</span>
                          {copiedCode ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-stone-400" />
                          )}
                        </button>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-800 mt-0.5">
                      স্ট্যাটাস: {matchedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Progress Journey Steps */}
                <div className="border border-stone-200 rounded-2xl p-5 bg-white">
                  <h4 className="font-bold text-stone-900 text-sm mb-4">
                    পার্সেল লাইভ ট্র্যাকিং টাইমলাইন:
                  </h4>
                  <div className="space-y-4">
                    {matchedOrder.trackingHistory.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative">
                        {/* Vertical line */}
                        {idx !== matchedOrder.trackingHistory.length - 1 && (
                          <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-emerald-200 -z-0" />
                        )}
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                              {step.status}
                            </h5>
                            <span className="text-[10px] sm:text-xs text-stone-400 font-mono">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5 font-sans">{step.note}</p>
                          {step.location && (
                            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{step.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordered Items Summary */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-xs text-stone-700 mb-2">অর্ডারের আইটেমসমূহ:</h5>
                  <div className="space-y-1.5 text-xs">
                    {matchedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-stone-800">
                        <span>
                          {item.banglaName || item.productName} ({item.packageName || '১x'}) x{' '}
                          {item.quantity}
                        </span>
                        <span className="font-bold">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span>মোট পরিশোধযোগ্য (ক্যাশ অন ডেলিভারি):</span>
                      <span className="text-emerald-900 font-black">
                        ৳{matchedOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
