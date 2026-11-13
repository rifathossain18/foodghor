import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
  Eye,
  Sparkles,
  Save,
  X,
  Package,
  Layers,
  HelpCircle,
  MessageSquare,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductLandingConfig, ProductPackage, ReviewItem } from '../../types';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, navigate } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'basic' | 'funnel' | 'packages' | 'comparison' | 'benefits' | 'faqs'
  >('basic');

  // 📸 প্রতি প্রোডাক্টে সর্বোচ্চ ৫টি ছবি (১টি Main + ৪টি Gallery)
  const MAX_IMAGES_PER_PRODUCT = 5;
  const MAX_GALLERY_IMAGES = MAX_IMAGES_PER_PRODUCT - 1; // = 4

  const presetImages = [
    { label: 'সুন্দরবনের খাঁটি মধু', url: '/src/assets/images/product_sundarban_raw_honey_1794499288912.jpg' },
    { label: 'পাবনার গাওয়া ঘি', url: '/src/assets/images/product_pure_cow_ghee_1794499290154.jpg' },
    { label: 'ঘানি ভাঙা সরিষার তেল', url: '/src/assets/images/product_cold_pressed_mustard_oil_1794499290697.jpg' },
    { label: 'রয়্যাল ড্রাই ফ্রুটস কম্বো', url: '/src/assets/images/product_premium_dryfruits_combo_1794499290032.jpg' },
    { label: 'ফুডঘর প্রিমিয়াম হার্ভেস্ট', url: '/src/assets/images/hero_foodghor_gourmet_honey_ghee_1794499288257.jpg' },
  ];

  const handleCreateNew = () => {
    const newProd: Product = {
      id: `p-${Date.now()}`,
      slug: `product-${Date.now()}`,
      name: 'New Gourmet Product',
      banglaName: 'নতুন অর্গানিক খাদ্যপণ্য',
      category: 'খাঁটি মধু',
      price: 900,
      regularPrice: 1200,
      unit: '১ কেজি',
      inStock: true,
      stockCount: 50,
      image: presetImages[0].url,
      galleryImages: [presetImages[0].url, presetImages[4].url],
      shortDescription: '১০০% খাঁটি ও প্রাকৃতিক বিশুদ্ধ খাবার।',
      landingConfig: {
        headline: 'শতভাগ খাঁটি ও প্রাকৃতিক খাদ্যপণ্য – সরাসরি নিজস্ব সংগ্রহ!',
        subHeadline:
          'কোনো কেমিক্যাল, প্রিজারভেটিভ বা ক্ষতিকর উপাদান ছাড়া প্রাকৃতিক খাবার। ঘরে বসেই আসল স্বাদ নিন।',
        heroBadge: '১০০% খাঁটি ও ল্যাব টেস্টেড',
        countdownMinutes: 45,
        highlights: [
          '১০০% প্রাকৃতিক ও সরাসরি নিজস্ব তত্ত্বাবধানে সংগৃহীত',
          'কোনো ভেজাল বা কৃত্রিম ফ্লেভার নেই',
          'পণ্য হাতে পেয়ে চেক করে টাকা দেওয়ার নিশ্চয়তা',
        ],
        packages: [
          { id: 'p1', name: 'রেগুলার প্যাক', weight: '৫০০ গ্রাম', price: 900, regularPrice: 1200 },
          { id: 'p2', name: 'সেভার কম্বো প্যাক', weight: '১ কেজি', price: 1750, regularPrice: 2400, popular: true },
        ],
        comparison: [
          { feature: 'কোয়ালিটি ও বিশুদ্ধতা', ourProduct: '১০০% খাঁটি ও ল্যাব টেস্টেড', regularMarket: 'ভেজাল ও ক্ষতিকর রাসায়নিক যুক্ত' },
          { feature: 'ডেলিভারি সুবিধা', ourProduct: 'পণ্য দেখে টাকা দেওয়ার সুবিধা', regularMarket: 'প্যাকেট খুললে রিটার্ন নেই' },
        ],
        benefits: [
          { title: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি', desc: 'প্রাকৃতিক পুষ্টি উপাদান শরীরের শক্তি ও কার্যক্ষমতা বাড়িয়ে তোলে।' },
          { title: 'হজমে সাহায্য করে', desc: 'দৈনন্দিন হজম ক্ষমতা উন্নত করে ও শরীর সতেজ রাখে।' },
        ],
        howItIsMade: [
          { step: 1, title: 'প্রাকৃতিক উৎস চিহ্নিতকরণ', desc: 'সেরা উৎস থেকে সরাসরি কাঁচামাল সংগ্রহ।' },
          { step: 2, title: 'হাইজিনিক প্রসেসিং', desc: 'উন্নত প্রযুক্তিতে ধুলোবালিমুক্ত প্যাকেজিং।' },
        ],
        guarantees: ['১০০% ক্যাশ অন ডেলিভারি', 'পছন্দ না হলে মানিব্যাক গ্যারান্টি'],
        faqs: [
          { question: 'পণ্যটি হাতে পেতে কত সময় লাগবে?', answer: 'ঢাকার মধ্যে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।' },
        ],
        reviews: [
          { id: 'r1', name: 'মোঃ রফিকুল ইসলাম', location: 'ঢাকা', rating: 5, date: '১ দিন আগে', comment: 'খুবই চমৎকার স্বাদ ও কোয়ালিটি। ধন্যবাদ ফুডঘর!', verified: true, status: 'Approved' },
        ],
      },
    };

    setEditingProduct(newProd);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleSave = () => {
    if (!editingProduct) return;

    // 📸 সর্বোচ্চ ৫টি ছবি লিমিট চেক
    const totalImages = 1 + (editingProduct.galleryImages?.length || 0);
    if (totalImages > MAX_IMAGES_PER_PRODUCT) {
      alert(
        `সর্বোচ্চ ${MAX_IMAGES_PER_PRODUCT} টি ছবি অনুমোদিত (১টি মূল ছবি + ${MAX_GALLERY_IMAGES}টি গ্যালারি)।\n\nআপনি এখন ${totalImages - 1} টি গ্যালারি ছবি দিয়েছেন। ${totalImages - MAX_IMAGES_PER_PRODUCT} টি ছবি মুছে ফেলুন।`
      );
      return;
    }

    const exists = products.some((p) => p.id === editingProduct.id);
    if (exists) {
      updateProduct(editingProduct);
    } else {
      addProduct(editingProduct);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 font-serif">
            প্রোডাক্ট ও সেলস ফানেল ল্যান্ডিং পেজ ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            এখানে নতুন পণ্য যুক্ত করুন এবং প্রতিটি পণ্যের পূর্ণাঙ্গ সেলস ফানেল ল্যান্ডিং পেজ কাস্টমাইজ করুন।
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রোডাক্ট ও ল্যান্ডিং পেজ তৈরি</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">ছবি ও নাম</th>
                <th className="py-3.5 px-4">ক্যাটাগরি</th>
                <th className="py-3.5 px-4">মূল্য (বিক্রয় / রেগুলার)</th>
                <th className="py-3.5 px-4">স্টক স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-center">ল্যান্ডিং পেজ প্রিভিউ</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.banglaName}
                        className="w-12 h-12 object-cover rounded-xl bg-stone-100 border border-stone-200"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{p.banglaName}</h4>
                        <p className="text-[11px] text-stone-500">{p.name} · {p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-emerald-900 text-sm">৳{p.price}</span>
                    <span className="text-stone-400 line-through ml-1.5">৳{p.regularPrice}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProduct({ ...p, inStock: !p.inStock })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        p.inStock
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.inStock ? 'ইন-স্টক (Active)' : 'স্টক আউট'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>ল্যান্ডিং পেজ দেখুন</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="সম্পূর্ণ ল্যান্ডিং পেজ এডিট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${p.banglaName}" মুছে ফেলতে চান?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ PRODUCT EDITOR MODAL ============ */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* ---- Modal Header (fixed) ---- */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <div>
                <h3 className="font-black text-stone-900 text-base sm:text-lg font-serif">
                  প্রোডাক্ট ও সেলস ফানেল এডিটর
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 truncate max-w-[250px] sm:max-w-none">
                  {editingProduct.banglaName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">সংরক্ষণ</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ---- Tab Nav (fixed, scrollable on mobile) ---- */}
            <div className="flex border-b border-stone-200 px-3 sm:px-5 gap-1 sm:gap-2 overflow-x-auto bg-white py-2 text-[11px] sm:text-xs font-semibold shrink-0">
              {[
                { key: 'basic', label: '১. বেসিক তথ্য ও ফটো' },
                { key: 'funnel', label: '২. হেডলাইন ও কপি' },
                { key: 'packages', label: '৩. প্যাকেজ ও অফার' },
                { key: 'comparison', label: '৪. বাজার তুলনা' },
                { key: 'benefits', label: '৫. উপকারিতা' },
                { key: 'faqs', label: '৬. FAQ' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-2.5 sm:px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.key
                      ? 'bg-emerald-800 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ---- Scrollable Body ---- */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {/* ============================================================ */}
              {/* TAB 1: BASIC INFO                                           */}
              {/* ============================================================ */}
              {activeTab === 'basic' && (
                <div className="space-y-3 text-xs">
                  {/* Row 1: বাংলা নাম | ইংরেজি নাম */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        বাংলা নাম <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingProduct.banglaName}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, banglaName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">ইংরেজি নাম</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  {/* Row 2: ক্যাটাগরি | পরিমাণ | Stock Count | স্টক স্ট্যাটাস */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">ক্যাটাগরি</label>
                      <input
                        type="text"
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, category: e.target.value })
                        }
                        placeholder="খাঁটি মধু"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">পরিমাণ / ইউনিট</label>
                      <input
                        type="text"
                        value={editingProduct.unit}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, unit: e.target.value })
                        }
                        placeholder="৫০০ গ্রাম"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={editingProduct.stockCount}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stockCount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">স্টক স্ট্যাটাস</label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            inStock: !editingProduct.inStock,
                          })
                        }
                        className={`w-full py-2 px-3 rounded-lg border-2 text-xs font-bold cursor-pointer transition-colors ${
                          editingProduct.inStock
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                            : 'border-rose-300 bg-rose-50 text-rose-800'
                        }`}
                      >
                        {editingProduct.inStock ? '✓ ইন-স্টক' : '✕ স্টক আউট'}
                      </button>
                    </div>
                  </div>

                  {/* Row 3: মূল্য | রেগুলার মূল্য | Slug */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        বিক্রয় মূল্য (৳) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">রেগুলার মূল্য (৳)</label>
                      <input
                        type="number"
                        value={editingProduct.regularPrice}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            regularPrice: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-bold text-stone-700 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={editingProduct.slug}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="pt-2 border-t border-stone-200">
                    <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>প্রোডাক্ট ফটো (সর্বোচ্চ {MAX_IMAGES_PER_PRODUCT} টি)</span>
                    </h4>
                  </div>

                  {/* Row 4: Main Image | Gallery — SIDE BY SIDE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Main Image */}
                    <div>
                      <ImageUploadDropzone
                        value={editingProduct.image}
                        onChange={(dataUrl) =>
                          setEditingProduct({ ...editingProduct, image: dataUrl })
                        }
                        label={`মূল ছবি (1 / ${MAX_IMAGES_PER_PRODUCT})`}
                        helperText="16:9 অনুপাতে ছবি দিন"
                        aspectRatio="16:9"
                      />
                    </div>

                    {/* Right: Gallery (max 4 + 1 main = 5 total) */}
                    <div className="space-y-2">
                      {/* Counter + Add button */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <label className="block font-bold text-stone-800 text-xs">
                            গ্যালারি (
                            <span
                              className={
                                (editingProduct.galleryImages?.length || 0) >= MAX_GALLERY_IMAGES
                                  ? 'text-rose-600'
                                  : 'text-emerald-800'
                              }
                            >
                              {editingProduct.galleryImages?.length || 0}
                            </span>
                            /{MAX_GALLERY_IMAGES} টি)
                          </label>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            মূল ছবি ১টি + গ্যালারি {MAX_GALLERY_IMAGES}টি = মোট {MAX_IMAGES_PER_PRODUCT}টি
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={
                            (editingProduct.galleryImages?.length || 0) >= MAX_GALLERY_IMAGES
                          }
                          onClick={() => {
                            const cur = editingProduct.galleryImages || [];
                            if (cur.length >= MAX_GALLERY_IMAGES) return;
                            setEditingProduct({
                              ...editingProduct,
                              galleryImages: [...cur, ''],
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors shrink-0 ${
                            (editingProduct.galleryImages?.length || 0) >= MAX_GALLERY_IMAGES
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200 cursor-pointer'
                          }`}
                        >
                          {(editingProduct.galleryImages?.length || 0) >= MAX_GALLERY_IMAGES
                            ? '✓ সর্বোচ্চ লিমিট'
                            : `+ যোগ করুন (${
                                MAX_GALLERY_IMAGES -
                                (editingProduct.galleryImages?.length || 0)
                              })`}
                        </button>
                      </div>

                      {/* Gallery grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                        {(editingProduct.galleryImages || []).map((gImg, gIdx) => (
                          <div key={gIdx} className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = editingProduct.galleryImages.filter(
                                  (_, idx) => idx !== gIdx
                                );
                                setEditingProduct({ ...editingProduct, galleryImages: cur });
                              }}
                              className="absolute -top-1 -right-1 z-20 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow"
                              title="মুছুন"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <ImageUploadDropzone
                              value={gImg}
                              onChange={(dataUrl) => {
                                const cur = [...editingProduct.galleryImages];
                                cur[gIdx] = dataUrl;
                                setEditingProduct({ ...editingProduct, galleryImages: cur });
                              }}
                              label=""
                              helperText="ছবি দিন"
                              aspectRatio="1:1"
                            />
                          </div>
                        ))}
                        {(editingProduct.galleryImages || []).length === 0 && (
                          <div className="col-span-2 sm:col-span-3 text-center text-[11px] text-stone-400 py-6 border-2 border-dashed rounded-xl">
                            কোনো গ্যালারি ছবি নেই। উপরে "+ যোগ করুন" চাপুন।
                          </div>
                        )}
                      </div>

                      {/* Warning when full */}
                      {(editingProduct.galleryImages?.length || 0) >= MAX_GALLERY_IMAGES && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-medium flex items-start gap-1.5">
                          <span className="text-amber-600">⚠️</span>
                          <span>
                            সর্বোচ্চ {MAX_GALLERY_IMAGES}টি গ্যালারি ছবি যোগ করা যাবে। আরও যোগ করতে হলে
                            আগের কোনো ছবি <strong>X</strong> বাটন দিয়ে মুছে ফেলুন।
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 2: SALES FUNNEL HEADLINE & COPY                          */}
              {/* ============================================================ */}
              {activeTab === 'funnel' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      ল্যান্ডিং পেজ মূল আকর্ষক হেডলাইন
                    </label>
                    <textarea
                      rows={2}
                      value={editingProduct.landingConfig.headline}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          landingConfig: {
                            ...editingProduct.landingConfig,
                            headline: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">সাব-হেডলাইন</label>
                    <textarea
                      rows={2}
                      value={editingProduct.landingConfig.subHeadline}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          landingConfig: {
                            ...editingProduct.landingConfig,
                            subHeadline: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">হিরো ব্যাজ টেক্সট</label>
                      <input
                        type="text"
                        value={editingProduct.landingConfig.heroBadge}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: {
                              ...editingProduct.landingConfig,
                              heroBadge: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">কাউন্টডাউন (মিনিট)</label>
                      <input
                        type="number"
                        value={editingProduct.landingConfig.countdownMinutes}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: {
                              ...editingProduct.landingConfig,
                              countdownMinutes: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      মূল হাইলাইটস বুলেট পয়েন্ট:
                    </label>
                    <div className="space-y-2">
                      {editingProduct.landingConfig.highlights.map((h, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const copy = [...editingProduct.landingConfig.highlights];
                              copy[i] = e.target.value;
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, highlights: copy },
                              });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingProduct.landingConfig.highlights.filter(
                                (_, idx) => idx !== i
                              );
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, highlights: copy },
                              });
                            }}
                            className="p-2 text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: {
                              ...editingProduct.landingConfig,
                              highlights: [
                                ...editingProduct.landingConfig.highlights,
                                'নতুন বৈশিষ্ট্য লিখুন',
                              ],
                            },
                          });
                        }}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                      >
                        + নতুন পয়েন্ট যোগ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 3: PACKAGES                                            */}
              {/* ============================================================ */}
              {activeTab === 'packages' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-sm">
                      প্যাকেজ ও কম্বো সেভার অফার:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPkg: ProductPackage = {
                          id: `pkg-${Date.now()}`,
                          name: 'নতুন কম্বো প্যাক',
                          weight: '১ কেজি',
                          price: 1500,
                          regularPrice: 2000,
                        };
                        setEditingProduct({
                          ...editingProduct,
                          landingConfig: {
                            ...editingProduct.landingConfig,
                            packages: [...editingProduct.landingConfig.packages, newPkg],
                          },
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold"
                    >
                      + নতুন প্যাকেজ
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingProduct.landingConfig.packages.map((pkg, i) => (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="প্যাকেজের নাম"
                            value={pkg.name}
                            onChange={(e) => {
                              const copy = [...editingProduct.landingConfig.packages];
                              copy[i].name = e.target.value;
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, packages: copy },
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="ওজন/সাইজ"
                            value={pkg.weight}
                            onChange={(e) => {
                              const copy = [...editingProduct.landingConfig.packages];
                              copy[i].weight = e.target.value;
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, packages: copy },
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                          />
                          <input
                            type="number"
                            placeholder="অফার মূল্য"
                            value={pkg.price}
                            onChange={(e) => {
                              const copy = [...editingProduct.landingConfig.packages];
                              copy[i].price = Number(e.target.value);
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, packages: copy },
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono font-bold"
                          />
                          <input
                            type="number"
                            placeholder="রেগুলার মূল্য"
                            value={pkg.regularPrice}
                            onChange={(e) => {
                              const copy = [...editingProduct.landingConfig.packages];
                              copy[i].regularPrice = Number(e.target.value);
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, packages: copy },
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 text-stone-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!pkg.popular}
                              onChange={(e) => {
                                const copy = [...editingProduct.landingConfig.packages];
                                copy[i].popular = e.target.checked;
                                setEditingProduct({
                                  ...editingProduct,
                                  landingConfig: { ...editingProduct.landingConfig, packages: copy },
                                });
                              }}
                            />
                            <span>সেরা অফার (Best Value)</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingProduct.landingConfig.packages.filter(
                                (_, idx) => idx !== i
                              );
                              setEditingProduct({
                                ...editingProduct,
                                landingConfig: { ...editingProduct.landingConfig, packages: copy },
                              });
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                          >
                            মুছে ফেলুন
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 4: COMPARISON                                          */}
              {/* ============================================================ */}
              {activeTab === 'comparison' && (
                <div className="space-y-4 text-xs">
                  <span className="font-bold text-stone-800 text-sm block">
                    ফুডঘর বনাম বাজারের সাধারণ পণ্যের তুলনা:
                  </span>
                  {editingProduct.landingConfig.comparison.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="বৈশিষ্ট্য"
                          value={c.feature}
                          onChange={(e) => {
                            const copy = [...editingProduct.landingConfig.comparison];
                            copy[i].feature = e.target.value;
                            setEditingProduct({
                              ...editingProduct,
                              landingConfig: { ...editingProduct.landingConfig, comparison: copy },
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="ফুডঘরের গুণ"
                          value={c.ourProduct}
                          onChange={(e) => {
                            const copy = [...editingProduct.landingConfig.comparison];
                            copy[i].ourProduct = e.target.value;
                            setEditingProduct({
                              ...editingProduct,
                              landingConfig: { ...editingProduct.landingConfig, comparison: copy },
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-emerald-900"
                        />
                        <input
                          type="text"
                          placeholder="বাজারের অবস্থা"
                          value={c.regularMarket}
                          onChange={(e) => {
                            const copy = [...editingProduct.landingConfig.comparison];
                            copy[i].regularMarket = e.target.value;
                            setEditingProduct({
                              ...editingProduct,
                              landingConfig: { ...editingProduct.landingConfig, comparison: copy },
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 5: BENEFITS                                            */}
              {/* ============================================================ */}
              {activeTab === 'benefits' && (
                <div className="space-y-4 text-xs">
                  <span className="font-bold text-stone-800 text-sm block">
                    স্বাস্থ্য ও পুষ্টি উপকারিতা:
                  </span>
                  {editingProduct.landingConfig.benefits.map((b, i) => (
                    <div key={i} className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                      <input
                        type="text"
                        placeholder="উপকারিতার শিরোনাম"
                        value={b.title}
                        onChange={(e) => {
                          const copy = [...editingProduct.landingConfig.benefits];
                          copy[i].title = e.target.value;
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: { ...editingProduct.landingConfig, benefits: copy },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="বিস্তারিত বর্ণনা"
                        value={b.desc}
                        onChange={(e) => {
                          const copy = [...editingProduct.landingConfig.benefits];
                          copy[i].desc = e.target.value;
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: { ...editingProduct.landingConfig, benefits: copy },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 6: FAQS                                                */}
              {/* ============================================================ */}
              {activeTab === 'faqs' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-sm">সাধারণ প্রশ্ন-উত্তর:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          landingConfig: {
                            ...editingProduct.landingConfig,
                            faqs: [
                              ...editingProduct.landingConfig.faqs,
                              { question: 'নতুন প্রশ্ন?', answer: 'সঠিক উত্তর লিখুন।' },
                            ],
                          },
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold"
                    >
                      + নতুন FAQ
                    </button>
                  </div>

                  {editingProduct.landingConfig.faqs.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                      <input
                        type="text"
                        placeholder="প্রশ্ন"
                        value={f.question}
                        onChange={(e) => {
                          const copy = [...editingProduct.landingConfig.faqs];
                          copy[i].question = e.target.value;
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: { ...editingProduct.landingConfig, faqs: copy },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="উত্তর"
                        value={f.answer}
                        onChange={(e) => {
                          const copy = [...editingProduct.landingConfig.faqs];
                          copy[i].answer = e.target.value;
                          setEditingProduct({
                            ...editingProduct,
                            landingConfig: { ...editingProduct.landingConfig, faqs: copy },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---- Modal Footer (fixed) ---- */}
            <div className="px-4 sm:px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-stone-500 hidden sm:inline">
                ✓ সব পরিবর্তন সেভ করতে "সংরক্ষণ" চাপুন
              </span>
              <div className="flex items-center gap-2 ml-auto">
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
        </div>
      )}
    </div>
  );
};