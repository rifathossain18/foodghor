import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Eye,
  ChevronDown,
  User,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { InvoiceModal } from './InvoiceModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, assignCourierTracking, settings, courierConfig } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Tracking code input state per order
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { courier: string; code: string }>>({});

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const handleAssignTracking = (orderId: string) => {
    const current = trackingInputs[orderId] || {
      courier: courierConfig.defaultCourier,
      code: `${courierConfig.defaultCourier.slice(0, 2).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };
    if (!current.code.trim()) {
      alert('ট্র্যাকিং কোড লিখুন');
      return;
    }
    assignCourierTracking(orderId, current.courier, current.code.trim());
    alert(`অর্ডার #${orderId} সফলভাবে ${current.courier} কুরিয়ারে হস্তান্তর ও ট্র্যাকিং কোড এসাইন করা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Filters */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 font-serif">
            অর্ডার ও ইনভয়েস ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            মোট অর্ডার: {orders.length} টি · কুরিয়ার ট্র্যাকিং কোড প্রদান ও ক্যাশ মেমো প্রিন্ট করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="অর্ডার আইডি, ফোন বা নাম..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white cursor-pointer"
          >
            <option value="All">সকল স্ট্যাটাস ({orders.length})</option>
            <option value="Pending">Pending (অপেক্ষমাণ)</option>
            <option value="Confirmed">Confirmed (নিশ্চিত)</option>
            <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
            <option value="Shipped">Shipped (কুরিয়ারে)</option>
            <option value="Delivered">Delivered (ডেলিভার্ড)</option>
            <option value="Cancelled">Cancelled (বাতিল)</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">অর্ডার নং ও সময়</th>
                <th className="py-3.5 px-4">গ্রাহকের তথ্য</th>
                <th className="py-3.5 px-4">আইটেম ও মূল্য</th>
                <th className="py-3.5 px-4">কুরিয়ার ও ট্র্যাকিং</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">মেমো ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const inputState = trackingInputs[order.id] || {
                    courier: order.courierName || courierConfig.defaultCourier,
                    code: order.trackingCode || '',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* 1. Order ID & Time */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-black text-stone-900 text-sm block">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-stone-400 block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-1 font-medium">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* 2. Customer Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-900 block text-xs">
                            {order.customerName}
                          </span>
                          <span className="font-mono text-emerald-800 font-semibold block text-xs">
                            {order.customerPhone}
                          </span>
                          <span className="text-stone-500 block text-[11px] line-clamp-2 max-w-[200px]">
                            {order.customerAddress}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {order.customerCity === 'Inside Dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                          </span>
                        </div>
                      </td>

                      {/* 3. Items & Bill */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-[11px] text-stone-700">
                              <span className="font-semibold text-stone-900">
                                {item.banglaName || item.productName}
                              </span>{' '}
                              ({item.packageName || '১x'}) × {item.quantity}
                            </div>
                          ))}
                          <div className="pt-1 border-t border-stone-100 flex items-baseline gap-1.5">
                            <span className="font-black text-stone-900 text-sm font-sans">
                              ৳{order.total.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              (ডেলিভারি: ৳{order.deliveryCharge})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Courier & Tracking */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-800">
                              {order.courierName}
                            </span>
                            {order.trackingCode ? (
                              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                {order.trackingCode}
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 italic">
                                ট্র্যাকিং নেই
                              </span>
                            )}
                          </div>

                          {/* Quick assign tracking field if pending/processing */}
                          {!order.trackingCode && (
                            <div className="flex items-center gap-1 pt-1">
                              <input
                                type="text"
                                placeholder="কোড লিখুন..."
                                value={inputState.code}
                                onChange={(e) =>
                                  setTrackingInputs({
                                    ...trackingInputs,
                                    [order.id]: { ...inputState, code: e.target.value },
                                  })
                                }
                                className="w-28 px-2 py-1 text-[11px] rounded border border-stone-300 font-mono"
                              />
                              <button
                                onClick={() => handleAssignTracking(order.id)}
                                className="px-2 py-1 bg-emerald-800 text-white text-[10px] font-bold rounded cursor-pointer"
                              >
                                যোগ
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Status Changer */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="Pending">Pending (অপেক্ষমাণ)</option>
                          <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                          <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
                          <option value="Shipped">Shipped (কুরিয়ারে)</option>
                          <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                          <option value="Cancelled">Cancelled (বাতিল)</option>
                        </select>
                      </td>

                      {/* 6. Invoice & Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1 cursor-pointer"
                            title="মেমো প্রিন্ট করুন"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-800" />
                            <span>ক্যাশ মেমো</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        settings={settings}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
};
