import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  TrendingUp,
  Package,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { orders, products, banners, users, navigate } = useStore();

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Confirmed').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* 1. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              মোট বিক্রয় রেভিনিউ
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-sans mt-1">
              ৳{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ক্যাশ অন ডেলিভারি</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              সর্বমোট অর্ডার
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-sans mt-1">
              {orders.length} টি
            </h3>
            <span className="text-[11px] text-stone-500 mt-1 block">
              অপেক্ষমাণ: {pendingCount} টি
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              নিবন্ধিত কাস্টমার
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-sans mt-1">
              {users.length} জন
            </h3>
            <span className="text-[11px] text-purple-700 font-semibold block mt-1">
              প্রোফাইল ডাটাবেজ &rarr;
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Shipped & Courier */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              কুরিয়ারে হস্তান্তর
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-sans mt-1">
              {shippedCount} টি
            </h3>
            <span className="text-[11px] text-indigo-700 font-semibold block mt-1">
              ট্রানজিটে আছে
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              সফল ডেলিভারি
            </span>
            <h3 className="text-2xl font-black text-stone-900 font-sans mt-1">
              {deliveredCount} টি
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              সফলভাবে সম্পন্ন
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Quick Action Shortcut Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigateTab('products')}
          className="p-4 rounded-2xl bg-emerald-950 text-white cursor-pointer hover:bg-emerald-900 transition-all shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              ম্যানেজ করুন
            </span>
            <h4 className="font-bold text-sm mt-0.5">প্রোডাক্ট ও ফানেল</h4>
            <span className="text-xs text-stone-300 mt-1 block">{products.length} টি পণ্য সক্রিয়</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </div>

        <div
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-2xl bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-all shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">
              কাস্টমার ডাটা
            </span>
            <h4 className="font-bold text-sm mt-0.5">ইউজার প্রোফাইল</h4>
            <span className="text-xs text-stone-300 mt-1 block">{users.length} জন কাস্টমার</span>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-400" />
        </div>

        <div
          onClick={() => onNavigateTab('banners')}
          className="p-4 rounded-2xl bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-all shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              হোমপেজ স্লাইডার
            </span>
            <h4 className="font-bold text-sm mt-0.5">৫টি ব্যানার</h4>
            <span className="text-xs text-stone-300 mt-1 block">{banners.length}/5 টি প্রস্তুত</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </div>

        <div
          onClick={() => onNavigateTab('courier')}
          className="p-4 rounded-2xl bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-all shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              লজিস্টিকস
            </span>
            <h4 className="font-bold text-sm mt-0.5">কুরিয়ার ট্র্যাকিং</h4>
            <span className="text-xs text-stone-300 mt-1 block">Steadfast ও Pathao</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </div>

        <div
          onClick={() => onNavigateTab('pixel')}
          className="p-4 rounded-2xl bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-all shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              মার্কেটিং
            </span>
            <h4 className="font-bold text-sm mt-0.5">Facebook Pixel</h4>
            <span className="text-xs text-stone-300 mt-1 block">লাইভ ইভেন্ট সেটআপ</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* 3. Recent Orders & Products Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (lg: 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-stone-900 text-base font-serif">
              সাম্প্রতিক অর্ডারসমূহ
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>সব অর্ডার দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-stone-900 text-sm">
                      #{order.id}
                    </span>
                    <span className="font-bold text-stone-800">
                      {order.customerName}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500 font-mono">{order.customerPhone}</span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5 truncate max-w-sm">
                    {order.items.map((i) => `${i.banglaName || i.productName} (${i.quantity}x)`).join(', ')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-900 text-sm block">
                    ৳{order.total.toLocaleString()}
                  </span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Products List (lg: 1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-stone-900 text-base font-serif">
              সক্রিয় খাদ্যপণ্য
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              ম্যানেজ
            </button>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.slug}`)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.banglaName}
                  className="w-12 h-12 object-cover rounded-lg bg-stone-100 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs truncate">{p.banglaName}</h4>
                  <span className="text-[11px] text-stone-500 block truncate">
                    {p.category} · ৳{p.price}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
