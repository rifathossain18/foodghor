import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    courierConfig,
    placeOrder,
    currentUser,
    registerUser,
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [deliveryArea, setDeliveryArea] = useState<'Inside Dhaka' | 'Outside Dhaka'>(
    currentUser?.city || 'Inside Dhaka'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (!customerAddress && currentUser.address) setCustomerAddress(currentUser.address);
      if (currentUser.city) setDeliveryArea(currentUser.city);
    }
  }, [currentUser]);

  if (!isCartOpen) return null;

  const deliveryFee =
    deliveryArea === 'Inside Dhaka'
      ? courierConfig.insideDhakaRate
      : courierConfig.outsideDhakaRate;

  const finalTotal = cartTotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('আপনার নাম লিখুন');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('সঠিক ইমেইল এড্রেস লিখুন (কাস্টমার অ্যাকাউন্টের জন্য)');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMsg('সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন');
      return;
    }

    setIsSubmitting(true);
    try {
      let user = currentUser;
      if (!user) {
        user = registerUser(
          customerName.trim(),
          customerPhone.trim(),
          customerEmail.trim(),
          customerAddress.trim(),
          deliveryArea
        );
      }

      placeOrder({
        userId: user.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim(),
        customerCity: deliveryArea,
        items: [...cart],
        subtotal: cartTotal,
        deliveryCharge: deliveryFee,
        total: finalTotal,
        paymentMethod: 'Cash on Delivery',
        courierName: courierConfig.defaultCourier,
      });

      clearCart();
      setIsCartOpen(false);
      setCheckoutStep('cart');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="font-bold text-stone-900 text-lg">
                {checkoutStep === 'cart' ? 'আপনার শপিং ব্যাগ' : 'ক্যাশ অন ডেলিভারি চেকআউট'}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">আপনার ব্যাগ খালি</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                আমাদের খাঁটি ও অর্গানিক সুস্বাদু খাদ্য সম্ভার থেকে আপনার পছন্দের পণ্য যোগ করুন।
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                শপিং শুরু করুন
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.packageId || index}`}
                    className="flex gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200"
                  >
                    <img
                      src={item.image}
                      alt={item.banglaName || item.productName}
                      className="w-16 h-16 object-cover rounded-xl shrink-0 bg-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                        {item.banglaName || item.productName}
                      </h4>
                      {item.packageName && (
                        <span className="text-[11px] text-stone-500 block truncate">
                          {item.packageName}
                        </span>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-black text-emerald-900 text-sm">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.packageId, -1)
                            }
                            className="w-6 h-6 rounded bg-white border border-stone-300 text-xs font-bold hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-stone-900 font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.packageId, 1)
                            }
                            className="w-6 h-6 rounded bg-white border border-stone-300 text-xs font-bold hover:bg-stone-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId, item.packageId)}
                            className="ml-2 text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Summary & Proceed */}
              <div className="p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 font-medium">সাবটোটাল</span>
                  <span className="font-black text-stone-900">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>চেকআউটে এরিয়া অনুযায়ী ডেলিভারি চার্জ যোগ হবে</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>অর্ডার করতে এগিয়ে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Step Form */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <form
                onSubmit={handleCheckoutSubmit}
                className="flex-1 overflow-y-auto p-5 space-y-4"
              >
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    আপনার নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ১১ ডিজিটের মোবাইল নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ইমেইল এড্রেস <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    সম্পূর্ণ ঠিকানা <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ডেলিভারি এরিয়া
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Inside Dhaka')}
                      className={`p-2.5 rounded-xl border text-xs font-bold ${
                        deliveryArea === 'Inside Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      ঢাকার ভিতরে (৳{courierConfig.insideDhakaRate})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Outside Dhaka')}
                      className={`p-2.5 rounded-xl border text-xs font-bold ${
                        deliveryArea === 'Outside Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      ঢাকার বাইরে (৳{courierConfig.outsideDhakaRate})
                    </button>
                  </div>
                </div>

                {/* Final Bill */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>পণ্যের মোট:</span>
                    <span className="font-bold">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold">৳{deliveryFee}</span>
                  </div>
                  <div className="pt-2 border-t border-amber-300/60 flex justify-between font-extrabold text-stone-900 text-sm">
                    <span>সর্বমোট টাকা:</span>
                    <span className="text-emerald-900">৳{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
                  >
                    ব্যাগে ফিরুন
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'প্রসেস হচ্ছে...' : 'অর্ডার সম্পন্ন করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
