import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Clock, MapPin, ShoppingBag, Eye, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, formatINR } = useApp();

  const artisan = product.artisan || {
    name: 'Karnataka Heritage Artisan',
    village: product.craftStory?.provenanceLocation || 'Karnataka',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  };

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80';
  const hoursSpent = product.craftStory?.hoursSpent || 24;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;
  const isOutOfStock = product.stockQuantity <= 0;

  // Approximate fair share to artisan if not explicitly provided
  const artisanShare = product.priceBreakdown?.artisanFairWage || Math.round(product.price * 0.82);

  return (
    <div className="group bg-white rounded-2xl border border-cream-300 shadow-earth hover:shadow-earth-lg transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={imageSrc}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-900/90 text-cream-50 backdrop-blur-sm shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Craft Story Badge (Hours Spent) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/95 text-stone-950 backdrop-blur-sm shadow-sm border border-amber-300">
            <Clock className="w-3 h-3 text-stone-900" />
            <span>{hoursSpent}h craft</span>
          </span>
        </div>

        {/* Stock Status Indicator */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-amber-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              Only {product.stockQuantity} left!
            </span>
          </div>
        ) : null}

        {/* Photo Gallery Count Badge */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="bg-stone-900/80 backdrop-blur-xs text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              📷 {product.images.length} photos
            </span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            onClick={() => setSelectedProduct(product)}
            className="p-3 bg-white text-indigo-900 hover:bg-cream-100 rounded-full font-bold shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5 text-xs"
            title="Read Craft Story"
          >
            <Eye className="w-4 h-4 text-terracotta-600" />
            <span>Craft Story</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Artisan Micro-Profile */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <img
            src={artisan.profileImage}
            alt={artisan.name}
            className="w-7 h-7 rounded-full object-cover border border-cream-400"
          />
          <div className="text-xs truncate">
            <p className="font-semibold text-stone-900 truncate">{artisan.name}</p>
            <p className="text-stone-500 text-[11px] truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-terracotta-600 inline" />
              {artisan.village}
            </p>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-serif text-base font-bold text-stone-900 line-clamp-2 hover:text-terracotta-600 cursor-pointer transition-colors leading-snug"
          >
            {product.title}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-1 mt-1">
            {product.craftStory?.culturalSignificance || 'Traditional Karnataka heritage craft'}
          </p>
        </div>

        {/* Pricing & Fair Share Info */}
        <div className="pt-2 border-t border-cream-200">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-bold text-indigo-900 font-serif">
                {formatINR(product.price)}
              </span>
              <span className="text-[11px] text-stone-500 ml-1.5">incl. taxes</span>
            </div>
            
            {/* Direct Fair Share Badge */}
            <div className="text-right">
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                ₹{artisanShare} to artisan
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setSelectedProduct(product)}
            className="w-full py-2.5 px-3 rounded-xl bg-cream-200 hover:bg-cream-300 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 touch-target"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Craft Story</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 touch-target ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-sm active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
}
