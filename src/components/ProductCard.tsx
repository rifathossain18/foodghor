import React from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart } = useStore();

  const discountAmount = product.regularPrice - product.price;
  const discountPercent = Math.round((discountAmount / product.regularPrice) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      banglaName: product.banglaName,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-emerald-600/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.banglaName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
            {discountPercent}% ছাড় (৳{discountAmount})
          </div>
        )}

        {/* Stock Status Badge */}
        {product.inStock ? (
          <div className="absolute top-3 right-3 bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ইন-স্টক</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-rose-900/80 backdrop-blur-sm text-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            স্টক আউট
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1 font-medium">
            <span className="text-emerald-800 font-semibold">{product.category}</span>
            <span>পরিমাণ: {product.unit}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1 font-serif">
            {product.banglaName}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-sans">
            {product.name}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-1 text-stone-900">4.9</span>
            </div>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">
              {product.landingConfig.reviews?.length || 12} টি কাস্টমার রিভিউ
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-stone-950 font-sans tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            {product.regularPrice > product.price && (
              <span className="text-sm text-stone-400 line-through">
                ৳{product.regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>কার্ট-এ যোগ</span>
            </button>

            <button
              onClick={() => navigate(`/product/${product.slug}`)}
              className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>বিস্তারিত দেখুন</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
