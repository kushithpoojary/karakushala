import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-cream-300 shadow-earth p-0 overflow-hidden flex flex-col space-y-0">
      
      {/* Image Skeleton with Shimmer Wave */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200 shimmer-skeleton">
        {/* Category Pill Placeholder */}
        <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-white/40" />
        {/* Hours Spent Badge Placeholder */}
        <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-white/40" />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Artisan Micro-Profile Placeholder */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-cream-200 shimmer-skeleton shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="w-24 h-3 rounded bg-cream-200 shimmer-skeleton" />
            <div className="w-16 h-2.5 rounded bg-cream-200 shimmer-skeleton" />
          </div>
        </div>

        {/* Title Placeholder */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded bg-cream-200 shimmer-skeleton" />
          <div className="w-3/4 h-4 rounded bg-cream-200 shimmer-skeleton" />
          <div className="w-1/2 h-3 rounded bg-cream-200 shimmer-skeleton mt-1" />
        </div>

        {/* Price & Fair Share Placeholder */}
        <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
          <div className="w-20 h-6 rounded bg-cream-200 shimmer-skeleton" />
          <div className="w-24 h-5 rounded-full bg-cream-200 shimmer-skeleton" />
        </div>

        {/* Buttons Placeholder */}
        <div className="space-y-2 pt-1">
          <div className="w-full h-9 rounded-xl bg-cream-200 shimmer-skeleton" />
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full h-8 rounded-xl bg-cream-200 shimmer-skeleton" />
            <div className="w-full h-8 rounded-xl bg-cream-200 shimmer-skeleton" />
          </div>
        </div>

      </div>
    </div>
  );
}
