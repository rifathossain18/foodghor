import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  Key,
  Lock,
  Download,
  Database,
  Cloud,
  Copy,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';
import { downloadCloudflareBackup, generateCloudflareSQLSeeds } from '../../lib/cloudflareD1';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    products,
    banners,
    orders,
    users,
    courierConfig,
    pixelConfig,
  } = useStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // 🔑 রিকভারি কোড জেনারেটর (XXXX-XXXX-XXXX-XXXX format)
  const generateNewRecoveryCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const code = Array.from(array)
      .map((b) => chars[b % chars.length])
      .join('');
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
  };

  const handleGenerateRecoveryCode = () => {
    if (
      formData.adminRecoveryCode &&
      !confirm(
        'নতুন কোড তৈরি করলে পুরনো কোড আর কাজ করবে না!\n\nনতুন কোড দেখানো হবে এবং সেভ করতে হবে। চালিয়ে যাবেন?'
      )
    ) {
      return;
    }
    const newCode = generateNewRecoveryCode();
    setFormData({ ...formData, adminRecoveryCode: newCode });
    alert(
      `নতুন রিকভারি কোড তৈরি হয়েছে:\n\n${newCode}\n\nএটি সেভ করুন! "সকল সেটিংস সংরক্ষণ করুন" চাপলে স্থায়ী হবে।`
    );
  };

  const handleCopyRecoveryCode = () => {
    if (!formData.adminRecoveryCode) return;
    navigator.clipboard.writeText(formData.adminRecoveryCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 font-serif">
              স্টোর ব্র্যান্ডিং, লোগো ও সাধারণ সেটিংস
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              লোগো পরিবর্তন, হটলাইন, হোয়াটসঅ্যাপ নম্বর, অ্যানাউন্সমেন্ট, অ্যাডমিন পিন ও রিকভারি কোড কনফিগার করুন
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে এবং লাইভ ওয়েবসাইটে প্রদর্শিত হচ্ছে!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Logo Management */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-bold text-stone-900 text-sm font-serif flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-800" />
                <span>স্টোর লোগো সেটআপ</span>
              </h3>
              <p className="text-xs text-stone-500">
                এখানে আপনার ব্র্যান্ড লোগোর ইমেজ URL দিন অথবা ফাঁকা রাখলে প্রিমিয়াম টেক্সট লোগো দেখানো হবে
              </p>
            </div>

            {formData.logoUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoUrl: '' })}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                ডিফল্ট টেক্সট লোগোতে রিসেট
              </button>
            )}
          </div>

          <div className="space-y-4">
            <ImageUploadDropzone
              value={formData.logoUrl}
              onChange={(dataUrl) => setFormData({ ...formData, logoUrl: dataUrl })}
              label="ব্র্যান্ড লোগো আপলোড (Device File Upload / Drag & Drop)"
              helperText="আপনার দোকানের লোগো ছবি আপলোড করুন বা লিংক দিন"
              aspectRatio="auto"
            />

            {/* Logo Preview */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-4">
              <span className="text-xs font-bold text-stone-500 uppercase">হেডারে কেমন দেখাবে:</span>
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo preview"
                  className="h-12 w-auto max-w-[200px] object-contain bg-white p-1 rounded-lg border border-stone-200"
                />
              ) : (
                <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-400 font-bold text-lg flex items-center justify-center">
                    ফু
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-base font-serif block leading-none">
                      {formData.banglaName || 'ফুডঘর'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 tracking-wider uppercase block">
                      {formData.storeName || 'FoodGhor'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Brand Identity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm font-serif">
            ব্র্যান্ড নাম ও স্লোগান
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                স্টোর বাংলা নাম <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.banglaName}
                onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">স্টোর ইংরেজি নাম</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">ট্যাগলাইন / স্লোগান</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Contact & WhatsApp */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm font-serif">
            যোগাযোগ ও কাস্টমার কেয়ার
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                হটলাইন ফোন নম্বর <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                অফিসিয়াল হোয়াটসঅ্যাপ নম্বর (01xxxxxxxxx)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">সাপোর্ট ইমেইল</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">অফিস / গুদাম ঠিকানা</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4. Top Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm font-serif">
              টপ অ্যানাউন্সমেন্ট ব্যানার নোটিশ
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.showAnnouncementBar}
                onChange={(e) =>
                  setFormData({ ...formData, showAnnouncementBar: e.target.checked })
                }
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>ব্যানার চালু রাখুন</span>
            </label>
          </div>

          <div>
            <input
              type="text"
              value={formData.announcementBarText}
              onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
            />
          </div>
        </div>

        {/* 5. Admin Security PIN */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-stone-900 text-sm font-serif">
              অ্যাডমিন পোর্টাল পাসওয়ার্ড (Access PIN)
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            /admin এ লগইন করার জন্য পাসওয়ার্ড পরিবর্তন করুন
          </p>

          <div className="max-w-xs">
            <input
              type="password"
              value={formData.adminPin}
              onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
              placeholder="নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-bold"
            />
          </div>
        </div>

        {/* 5.5. 🔐 Admin Recovery Code Management */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-sm font-serif">
              অ্যাডমিন রিকভারি কোড
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            পাসওয়ার্ড ভুলে গেলে এই কোড দিয়ে পাসওয়ার্ড রিসেট করবেন। কোডটি নিরাপদ জায়গায় সংরক্ষণ করুন।
          </p>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                বর্তমান রিকভারি কোড:
              </label>
              {formData.adminRecoveryCode ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2.5 bg-white border border-stone-300 rounded-lg font-mono text-sm font-bold text-emerald-900 select-all break-all">
                    {formData.adminRecoveryCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyRecoveryCode}
                    className="px-3 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
                    title="কপি করুন"
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    কোনো রিকভারি কোড সেট করা নেই। নিচের বাটন দিয়ে নতুন কোড তৈরি করুন। কোড ছাড়া
                    পাসওয়ার্ড ভুলে গেলে অ্যাকাউন্ট রিকভার করা যাবে না।
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGenerateRecoveryCode}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {formData.adminRecoveryCode
                  ? 'নতুন রিকভারি কোড তৈরি করুন'
                  : 'রিকভারি কোড তৈরি করুন'}
              </span>
            </button>

            <div className="text-[11px] text-stone-500 flex items-start gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                নতুন কোড তৈরি করলে <strong>পুরনো কোড আর কাজ করবে না</strong>। "সকল সেটিংস সংরক্ষণ
                করুন" চাপলে স্থায়ী হবে।
              </span>
            </div>
          </div>
        </div>

        {/* 6. Cloudflare D1 & Full-Stack Deployment Helper */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm font-serif">
                Cloudflare D1 ডাটাবেজ ব্যাকআপ ও মাইগ্রেশন
              </h3>
              <p className="text-xs text-stone-500">
                ক্লাউডফ্লেয়ার (Cloudflare Pages + Workers + D1) এ সরাসরি হোস্ট ও ডাটা সিঙ্ক করার টুল
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
            <p className="text-stone-700 leading-relaxed">
              আপনার ওয়েবসাইটের সকল পণ্য, ব্যানার, ইউজার প্রোফাইল ও সেটিংস এক ক্লিকে ক্লাউডফ্লেয়ার
              ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন।
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  downloadCloudflareBackup({
                    users,
                    products,
                    orders,
                    banners,
                    settings: formData,
                    courierConfig,
                    pixelConfig,
                    exportedAt: new Date().toISOString(),
                  });
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-sm text-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloudflare D1 JSON ব্যাকআপ ডাউনলোড</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const sqlScript = generateCloudflareSQLSeeds({
                    products,
                    banners,
                  });
                  const blob = new Blob([sqlScript], { type: 'text/sql' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `cloudflare_d1_seed_${new Date().toISOString().slice(0, 10)}.sql`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-xs"
              >
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cloudflare D1 SQL স্ক্রিপ্ট তৈরি</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সকল সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};