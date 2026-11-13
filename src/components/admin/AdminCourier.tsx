import React, { useState } from 'react';
import { Truck, Save, ShieldCheck, Key, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CourierConfig } from '../../types';

export const AdminCourier: React.FC = () => {
  const { courierConfig, updateCourierConfig } = useStore();
  const [formData, setFormData] = useState<CourierConfig>({ ...courierConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourierConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 font-serif">
              কুরিয়ার সার্ভিস ও লাইভ ট্র্যাকিং সেটআপ
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              স্টেডফাস্ট, পাঠাও ও রেডএক্স কুরিয়ার এপিআই এবং ডেলিভারি চার্জ কনফিগার করুন
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>কুরিয়ার কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Default Courier & Rates */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm font-serif">
            ১. ডিফল্ট কুরিয়ার ও ডেলিভারি চার্জ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                ডিফল্ট কুরিয়ার নির্বাচন করুন
              </label>
              <select
                value={formData.defaultCourier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultCourier: e.target.value as CourierConfig['defaultCourier'],
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold bg-white cursor-pointer"
              >
                <option value="Steadfast">Steadfast Courier (স্টেডফাস্ট কুরিয়ার)</option>
                <option value="Pathao">Pathao Courier (পাঠাও কুরিয়ার)</option>
                <option value="RedX">RedX Logistics (রেডএক্স)</option>
                <option value="Paperfly">Paperfly Delivery (পেপারফ্লাই)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                ফ্রি ডেলিভারি মিনিমাম কার্ট মূল্য (৳)
              </label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                ঢাকার ভিতরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                value={formData.insideDhakaRate}
                onChange={(e) =>
                  setFormData({ ...formData, insideDhakaRate: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                value={formData.outsideDhakaRate}
                onChange={(e) =>
                  setFormData({ ...formData, outsideDhakaRate: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={formData.autoGenerateTracking}
                onChange={(e) =>
                  setFormData({ ...formData, autoGenerateTracking: e.target.checked })
                }
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>নতুন অর্ডারে স্বয়ংক্রিয়ভাবে কুরিয়ার কনসাইনমেন্ট ট্র্যাকিং কোড জেনারেট করুন</span>
            </label>
          </div>
        </div>

        {/* 2. Steadfast Courier Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm font-serif flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-800" />
              <span>২. Steadfast Courier API ক্রেডেনশিয়াল</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Steadfast API Key</label>
              <input
                type="text"
                value={formData.steadfastApiKey}
                onChange={(e) =>
                  setFormData({ ...formData, steadfastApiKey: e.target.value })
                }
                placeholder="st_live_xxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Steadfast Secret Key</label>
              <input
                type="password"
                value={formData.steadfastSecretKey}
                onChange={(e) =>
                  setFormData({ ...formData, steadfastSecretKey: e.target.value })
                }
                placeholder="st_sec_xxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Pathao Courier Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm font-serif flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-800" />
              <span>৩. Pathao Courier API ক্রেডেনশিয়াল</span>
            </h3>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Pathao Client ID</label>
              <input
                type="text"
                value={formData.pathaoClientId}
                onChange={(e) =>
                  setFormData({ ...formData, pathaoClientId: e.target.value })
                }
                placeholder="pth_client_xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Pathao Secret Key</label>
              <input
                type="password"
                value={formData.pathaoClientSecret}
                onChange={(e) =>
                  setFormData({ ...formData, pathaoClientSecret: e.target.value })
                }
                placeholder="pth_sec_xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>কুরিয়ার সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
