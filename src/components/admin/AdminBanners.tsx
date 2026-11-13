import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Banner } from "../../types";
import { ImageUploadDropzone } from "../common/ImageUploadDropzone";
import { resolveImageUrl } from "../../lib/imagePath";

export const AdminBanners: React.FC = () => {
  const { banners, updateBanner, addBanner, deleteBanner } = useStore();
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presetImages = [
    { label: "ফুডঘর প্রিমিয়াম আর্ট স্প্রেড", url: "/images/hero_foodghor_gourmet_honey_ghee_1794499288257.jpg" },
    { label: "সুন্দরবনের খাঁটি মধু", url: "/images/product_sundarban_raw_honey_1794499288912.jpg" },
    { label: "পাবনার সুবাসিত ঘি", url: "/images/product_pure_cow_ghee_1794499290154.jpg" },
    { label: "ঘানি ভাঙা সরিষার তেল", url: "/images/product_cold_pressed_mustard_oil_1794499290697.jpg" },
    { label: "রয়্যাল ড্রাই ফ্রুটস কম্বো", url: "/images/product_premium_dryfruits_combo_1794499290032.jpg" },
  ];

  const handleAddNew = () => {
    if (banners.length >= 5) {
      alert("সর্বোচ্চ ৫ টি ব্যানার ফটো যুক্ত করা যাবে। যেকোনো একটি ব্যানার ডিলিট করে নতুন ব্যানার দিন।");
      return;
    }
    const newB: Banner = {
      id: `b-${Date.now()}`,
      title: "নতুন আকর্ষণীয় ফুড অফার",
      subtitle: "প্রাকৃতিক ও নির্ভেজাল খাবারের সাথে থাকুন প্রতিদিন।",
      tag: "নতুন কালেকশন",
      imageUrl: presetImages[0].url,
      linkUrl: "#products",
      buttonText: "অর্ডার করতে ক্লিক করুন",
      active: true,
      order: banners.length + 1,
    };
    setEditingBanner(newB);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingBanner) return;
    const exists = banners.some((b) => b.id === editingBanner.id);
    if (exists) {
      updateBanner(editingBanner);
    } else {
      addBanner(editingBanner);
    }
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 font-serif">
              হোমপেজ ব্যানার ক্যারোসেল (সর্বোচ্চ ৫টি ফটো)
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
              {banners.length}/5 টি ব্যানার
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            মেইন হোমপেজের হরাইজন্টাল স্লাইডার ব্যানার ম্যানেজ করুন। গ্রাহকরা এগুলো সাইড দিয়ে স্লাইড করে দেখতে পাবেন।
          </p>
        </div>

        <button
          onClick={handleAddNew}
          disabled={banners.length >= 5}
          className={`px-5 py-3 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 ${
            banners.length >= 5
              ? "bg-stone-300 text-stone-500 cursor-not-allowed"
              : "bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যানার যুক্ত করুন</span>
        </button>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                <img
                  src={resolveImageUrl(banner.imageUrl)}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-sm">
                  স্লাইড #{index + 1}
                </span>

                <button
                  onClick={() => updateBanner({ ...banner, active: !banner.active })}
                  className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                    banner.active ? "bg-emerald-600 text-white" : "bg-stone-600 text-stone-200"
                  }`}
                >
                  {banner.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </button>
              </div>

              <div className="p-4 space-y-2">
                {banner.tag && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                    {banner.tag}
                  </span>
                )}
                <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{banner.title}</h4>
                <p className="text-xs text-stone-500 line-clamp-2">{banner.subtitle}</p>
                <div className="pt-2 text-[11px] text-stone-600 flex items-center justify-between border-t border-stone-100">
                  <span>বাটন: &quot;{banner.buttonText}&quot;</span>
                  <span className="text-emerald-800 font-mono font-medium truncate max-w-[120px]">
                    {banner.linkUrl}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(banner)}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>এডিট করুন</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`আপনি কি স্লাইড "${banner.title}" ডিলিট করতে চান?`)) {
                    deleteBanner(banner.id);
                  }
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="ডিলিট"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-base font-serif">ক্যারোসেল ব্যানার এডিটর</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">ব্যানার শিরোনাম</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">উপ-শিরোনাম (বর্ণনা)</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ট্যাগ টেক্সট</label>
                  <input
                    type="text"
                    value={editingBanner.tag}
                    onChange={(e) => setEditingBanner({ ...editingBanner, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={editingBanner.buttonText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  বাটন ক্লিক লিংক (URL বা প্রোডাক্ট পাথ)
                </label>
                <input
                  type="text"
                  value={editingBanner.linkUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                  placeholder="/product/sundarban-wild-honey অথবা #products"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              <div>
                <ImageUploadDropzone
                  value={editingBanner.imageUrl}
                  onChange={(dataUrl) => setEditingBanner({ ...editingBanner, imageUrl: dataUrl })}
                  label="ব্যানার ফটো আপলোড (File Upload / Drag & Drop)"
                  helperText="১৬:৯ অনুপাতে ডিভাইসের ফটো আপলোড করুন"
                  aspectRatio="16:9"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBanner.active}
                    onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                    className="w-4 h-4 text-emerald-800 rounded"
                  />
                  <span className="font-bold text-stone-800">ব্যানারটি সক্রিয় রাখুন</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};