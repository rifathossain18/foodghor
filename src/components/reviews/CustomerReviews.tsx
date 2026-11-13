import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Image as ImageIcon,
  ShieldCheck,
  Filter,
  User,
  Sparkles,
} from 'lucide-react';
import { ReviewItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';

interface CustomerReviewsProps {
  productId: string;
  productName: string;
  reviews: ReviewItem[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productId,
  productName,
  reviews = [],
}) => {
  const { addReview, currentUser, setIsAuthModalOpen } = useStore();

  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});

  // Review Form State
  const [rating, setRating] = useState(5);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState('ঢাকা');
  const [comment, setComment] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const approvedReviews = reviews.filter((r) => r.status !== 'Pending');

  const filteredReviews =
    activeFilter === 'all'
      ? approvedReviews
      : approvedReviews.filter((r) => r.rating === activeFilter);

  // Stats calculation
  const totalReviews = approvedReviews.length;
  const avgRating =
    totalReviews > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const fiveStarCount = approvedReviews.filter((r) => r.rating === 5).length;
  const fourStarCount = approvedReviews.filter((r) => r.rating === 4).length;

  const handleHelpful = (id: string) => {
    setHelpfulLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('দয়া করে আপনার নাম এবং রিভিউ মতামত লিখুন।');
      return;
    }

    addReview({
      productId,
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim() || 'বাংলাদেশ',
      rating,
      comment: comment.trim(),
      image: reviewPhoto || undefined,
      verified: true,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsWriteModalOpen(false);
      setComment('');
      setReviewPhoto('');
    }, 2000);
  };

  return (
    <section className="bg-white py-14 sm:py-20 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Overall Rating Card */}
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Score (4 cols) */}
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-8">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                যাচাইকৃত কাস্টমার রিভিউ
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-3 mt-3">
                <span className="text-5xl font-black text-stone-950 font-sans tracking-tight">
                  {avgRating}
                </span>
                <span className="text-stone-400 text-sm">/ ৫.০</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-stone-600">
                মোট <strong className="text-stone-900">{totalReviews}</strong> জন ক্রেতা এই
                প্রোডাক্টটির প্রশংসা করেছেন
              </p>
            </div>

            {/* Middle Rating Bars (5 cols) */}
            <div className="md:col-span-5 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-12 text-stone-600 font-semibold">৫ স্টার</span>
                <div className="flex-1 h-3 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (fiveStarCount / totalReviews) * 100 : 90}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-mono font-bold text-stone-700">
                  {fiveStarCount}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-12 text-stone-600 font-semibold">৪ স্টার</span>
                <div className="flex-1 h-3 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (fourStarCount / totalReviews) * 100 : 10}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-mono font-bold text-stone-700">
                  {fourStarCount}
                </span>
              </div>
            </div>

            {/* Right Action (3 cols) */}
            <div className="md:col-span-3 text-center md:text-right">
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto md:ml-auto"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-300" />
                <span>রিভিউ লিখুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold text-stone-700">ফিল্টার:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              সকল রিভিউ ({approvedReviews.length})
            </button>
            <button
              onClick={() => setActiveFilter(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFilter === 5
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              ৫ স্টার ({fiveStarCount})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>১০০% যাচাইকৃত আসল ক্রেতাদের মতামত</span>
          </div>
        </div>

        {/* Testimonials Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-sans">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-sans">
                  &quot;{rev.comment}&quot;
                </p>

                {/* Customer Uploaded Photo if attached */}
                {rev.image && (
                  <div className="rounded-xl overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-100">
                    <img
                      src={rev.image}
                      alt="Customer review verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Author & Helpful */}
              <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center">
                    {rev.name.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <span title="ভেরিফাইড ক্রেতা" className="inline-flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-stone-500">{rev.location}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
                  title="উপকারী মনে হয়েছে"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{helpfulLikes[rev.id] ? helpfulLikes[rev.id] + 5 : 5}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Modal */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>

              <div className="text-center mb-5">
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                  আপনার মতামত দিন
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-serif mt-2">
                  {productName} সম্পর্কে আপনার রিভিউ
                </h3>
              </div>

              {submittedSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-base">রিভিউ জমা হয়েছে!</h4>
                  <p className="text-xs text-stone-600">
                    ধন্যবাদ! আপনার মূল্যবান অভিজ্ঞতা অন্যান্য ক্রেতাদের খাঁটি পণ্য বাছাইয়ে সাহায্য করবে।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  {/* Star Rating Selector */}
                  <div className="text-center py-2 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-xs font-bold text-stone-700 block mb-1">
                      রেটিং নির্বাচন করুন:
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        আপনার নাম <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার নাম"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">এলাকা / শহর</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="যেমন: ধানমন্ডি, ঢাকা"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      রিভিউ মতামত <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="পণ্যটির স্বাদ, ঘ্রাণ ও প্যাকেজিং সম্পর্কে আপনার অনুভূতি লিখুন..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  {/* Customer Photo Upload Dropzone */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      পণ্যটির ছবি আপলোড করুন (ঐচ্ছিক):
                    </label>
                    <ImageUploadDropzone
                      value={reviewPhoto}
                      onChange={setReviewPhoto}
                      aspectRatio="4:3"
                      helperText="আপনার হাতে পাওয়া পণ্যের ফটো যোগ করুন"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    রিভিউ সাবমিট করুন
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
