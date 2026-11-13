import React, { useState } from 'react';
import { Activity, Save, CheckCircle2, ShieldCheck, Play, Trash2, Radio } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PixelConfig } from '../../types';

export const AdminPixel: React.FC = () => {
  const { pixelConfig, updatePixelConfig, pixelLogs, clearPixelLogs, firePixelEvent } = useStore();
  const [formData, setFormData] = useState<PixelConfig>({ ...pixelConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePixelConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestTrigger = (eventName: string) => {
    firePixelEvent(eventName, {
      test: true,
      time: new Date().toISOString(),
      sampleProduct: 'Sundarban Raw Wild Honey',
      value: 850,
      currency: 'BDT',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 font-serif">
              Facebook Pixel & Conversion API সেটআপ
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              মেটা পিক্সেল আইডি যুক্ত করুন এবং ই-কমার্স সেলস ফানেল ইভেন্ট ট্র্যাকিং কনফিগার করুন
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>ফেসবুক পিক্সেল কনফিগারেশন সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">পিক্সেল আইডি ও প্রাথমিক ট্র্যাকিং</h3>
              <p className="text-xs text-stone-500">আপনার মেটা বিজনেস ম্যানেজার থেকে পিক্সেল আইডি দিন</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                className="w-5 h-5 text-emerald-800 rounded"
              />
              <span className="font-bold text-xs text-stone-800">পিক্সেল চালু রাখুন (Enabled)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Facebook Pixel ID <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pixelId}
                onChange={(e) => setFormData({ ...formData, pixelId: e.target.value })}
                placeholder="যেমন: 984712048591823"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Test Event Code (Meta Test Sandbox)
              </label>
              <input
                type="text"
                value={formData.testEventCode}
                onChange={(e) => setFormData({ ...formData, testEventCode: e.target.value })}
                placeholder="যেমন: TEST12345"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          {/* Event Toggles */}
          <div className="pt-3 border-t border-stone-200">
            <span className="font-bold text-stone-900 text-xs block mb-3">
              অটোমেটিক ই-কমার্স ফানেল ইভেন্ট নির্বাচন:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trackPageView}
                  onChange={(e) =>
                    setFormData({ ...formData, trackPageView: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-800 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">PageView</span>
                  <span className="text-[11px] text-stone-500">যেকোনো পেজ পরিদর্শনে</span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trackViewContent}
                  onChange={(e) =>
                    setFormData({ ...formData, trackViewContent: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-800 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">ViewContent</span>
                  <span className="text-[11px] text-stone-500">ল্যান্ডিং পেজ লোডে</span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trackAddToCart}
                  onChange={(e) =>
                    setFormData({ ...formData, trackAddToCart: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-800 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">AddToCart</span>
                  <span className="text-[11px] text-stone-500">ব্যাগে পণ্য যোগ করলে</span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trackInitiateCheckout}
                  onChange={(e) =>
                    setFormData({ ...formData, trackInitiateCheckout: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-800 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">InitiateCheckout</span>
                  <span className="text-[11px] text-stone-500">অর্ডার ফর্মে তথ্য লিখলে</span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trackPurchase}
                  onChange={(e) =>
                    setFormData({ ...formData, trackPurchase: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-800 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">Purchase</span>
                  <span className="text-[11px] text-stone-500">সফল অর্ডারে (৳ মান সহ)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>পিক্সেল সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </form>

      {/* Live Pixel Event Inspector Log */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
            <h3 className="font-bold text-stone-900 text-sm">
              লাইভ পিক্সেল ইভেন্ট ইন্সপেক্টর (Real-Time Event Stream)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTestTrigger('PageView')}
              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-lg border border-stone-200 cursor-pointer"
            >
              + Test PageView
            </button>
            <button
              onClick={() => handleTestTrigger('Purchase')}
              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-200 cursor-pointer"
            >
              + Test Purchase
            </button>
            <button
              onClick={clearPixelLogs}
              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
              title="লগ ক্লিয়ার করুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {pixelLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            এখনো কোনো ইভেন্ট ফায়ার হয়নি। ওয়েবসাইটে ভিজিট করুন বা টেস্ট বাটন চাপুন।
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {pixelLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-900 text-[11px]">
                    {log.eventName}
                  </span>
                  <div className="font-mono text-[11px] text-stone-600">
                    {JSON.stringify(log.data)}
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-mono shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
