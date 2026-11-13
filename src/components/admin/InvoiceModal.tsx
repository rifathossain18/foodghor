import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order, StoreSettings } from '../../types';

interface InvoiceModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-300 relative print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Screen Action Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 text-sm">ইনভয়েস / ক্যাশ মেমো প্রিন্ট</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
              #{order.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Document */}
        <div className="space-y-6 text-stone-900 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b-2 border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 font-bold text-base flex items-center justify-center">
                  ফু
                </div>
                <h1 className="text-2xl font-black font-serif tracking-tight text-stone-950">
                  {settings.banglaName}
                </h1>
              </div>
              <p className="text-xs text-stone-500 mt-1">{settings.tagline}</p>
              <p className="text-xs text-stone-600 mt-0.5">ঠিকানা: {settings.address}</p>
              <p className="text-xs text-stone-600">হটলাইন: {settings.phone} · ইমেইল: {settings.email}</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-stone-900 text-white font-mono font-bold text-xs uppercase tracking-wider rounded">
                CASH MEMO / চালান
              </span>
              <p className="font-mono font-black text-lg text-stone-900 mt-2">
                ইনভয়েস: #{order.id}
              </p>
              <p className="text-xs text-stone-500">
                তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs font-semibold text-emerald-800">
                পেমেন্ট: {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Customer & Courier Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1.5">
                গ্রাহকের বিবরণ:
              </h4>
              <p className="font-semibold text-stone-900">{order.customerName}</p>
              <p className="text-stone-600 mt-0.5">মোবাইল: {order.customerPhone}</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                ঠিকানা: {order.customerAddress}
              </p>
              <p className="text-stone-500 mt-0.5">
                এলাকা: {order.customerCity === 'Inside Dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
              </p>
            </div>

            <div className="text-right">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1.5">
                ডেলিভারি ও কুরিয়ার:
              </h4>
              <p className="font-semibold text-stone-900">কুরিয়ার: {order.courierName}</p>
              {order.trackingCode && (
                <p className="font-mono text-emerald-800 font-bold mt-0.5">
                  ট্র্যাকিং কোড: {order.trackingCode}
                </p>
              )}
              <p className="text-stone-600 mt-0.5">অর্ডার স্ট্যাটাস: {order.status}</p>
              {order.customerNote && (
                <p className="text-stone-500 italic mt-1">নোট: {order.customerNote}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border-collapse border border-stone-300 text-xs">
            <thead>
              <tr className="bg-stone-100 text-stone-800 border-b border-stone-300">
                <th className="py-2.5 px-3 font-bold border-r border-stone-300 w-12 text-center">নং</th>
                <th className="py-2.5 px-3 font-bold border-r border-stone-300">পণ্যের বিবরণ</th>
                <th className="py-2.5 px-3 font-bold border-r border-stone-300 text-center">প্যাকেজ</th>
                <th className="py-2.5 px-3 font-bold border-r border-stone-300 text-center">পরিমাণ</th>
                <th className="py-2.5 px-3 font-bold border-r border-stone-300 text-right">একক মূল্য</th>
                <th className="py-2.5 px-3 font-bold text-right">মোট (টাকা)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-stone-200">
                  <td className="py-2.5 px-3 text-center border-r border-stone-300 font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-stone-300 font-medium">
                    {item.banglaName || item.productName}
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-stone-300 text-stone-600">
                    {item.packageName || 'রেগুলার'}
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-stone-300 font-bold font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-stone-300 font-mono">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-mono">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="py-2 px-3 text-right font-semibold border-r border-stone-300">
                  উপমোট (Subtotal):
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold">
                  ৳{order.subtotal.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="py-2 px-3 text-right font-semibold border-r border-stone-300">
                  ডেলিভারি চার্জ:
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold">
                  ৳{order.deliveryCharge}
                </td>
              </tr>
              <tr className="bg-stone-100 text-stone-950 font-bold text-sm">
                <td colSpan={5} className="py-2.5 px-3 text-right border-r border-stone-300">
                  সর্বমোট পরিশোধযোগ্য (Cash on Delivery):
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-900">
                  ৳{order.total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Barcode & Signature */}
          <div className="pt-6 flex justify-between items-end border-t border-stone-200">
            <div className="space-y-1">
              <div className="h-10 w-48 bg-stone-900 flex items-center justify-around px-2 text-white font-mono text-[9px] tracking-widest">
                ||| | |||| | ||| |||| | ||
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                {order.trackingCode || order.id}
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 border-b border-stone-400 pb-1 mb-1" />
              <p className="text-xs text-stone-600 font-medium">অনুমোদিত স্বাক্ষর</p>
            </div>
          </div>

          <div className="text-center text-[11px] text-stone-500 pt-3 border-t border-dashed border-stone-300">
            ফুডঘরের সাথে থাকার জন্য ধন্যবাদ! যেকোনো প্রয়োজনে কল করুন: {settings.phone}
          </div>
        </div>
      </div>
    </div>
  );
};
