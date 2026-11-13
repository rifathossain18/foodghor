import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BannerCarousel: React.FC = () => {
  const { banners, navigate } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = activeBanners.length;

  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total, isHovered]);

  if (total === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    if (deltaX > 50) {
      handleNext();
    } else if (deltaX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-stone-900 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Lateral Sliding Strip Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-[360px] sm:h-[460px] md:h-[540px] lg:h-[580px]"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative h-full flex items-center"
          >
            {/* Background Image with Measured Scrim */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
            {/* Dark Gradient Overlay for 100% WCAG AA Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-transparent sm:to-stone-950/20" />
            <div className="absolute inset-0 bg-radial-[at_top_left] from-emerald-950/40 via-transparent to-black/30 pointer-events-none" />

            {/* Banner Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
              <div className="max-w-2xl space-y-4 sm:space-y-5">
                {banner.tag && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{banner.tag}</span>
                  </div>
                )}

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif">
                  {banner.title}
                </h1>

                <p className="text-sm sm:text-lg text-stone-200 leading-relaxed font-normal max-w-xl">
                  {banner.subtitle}
                </p>

                <div className="pt-2 sm:pt-4 flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (banner.linkUrl.startsWith('/')) {
                        navigate(banner.linkUrl);
                      } else if (banner.linkUrl.startsWith('#')) {
                        const el = document.querySelector(banner.linkUrl);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/product/sundarban-wild-honey');
                      }
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>{banner.buttonText || 'অর্ডার করুন'}</span>
                    <ArrowRight className="w-4 h-4 text-stone-900" />
                  </button>

                  <a
                    href="#products"
                    className="inline-flex items-center px-4 py-3 text-sm font-medium text-stone-200 hover:text-white transition-colors"
                  >
                    সব প্রোডাক্ট দেখুন
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Controls */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-8 bg-amber-400'
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
