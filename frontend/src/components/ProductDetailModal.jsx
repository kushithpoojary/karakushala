import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AudioStoryPlayer from './AudioStoryPlayer';
import { X, Clock, MapPin, Sparkles, ShieldCheck, ShoppingBag, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, Layers, Tag, Eye, Zap } from 'lucide-react';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart, openOrderPopup, formatINR, setIsCartOpen, setIsCheckoutOpen } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const artisan = selectedProduct.artisan || {
    name: 'Karnataka Master Artisan',
    village: selectedProduct.craftStory?.provenanceLocation || 'Karnataka, India',
    craftSpecialty: selectedProduct.category,
    yearsOfExperience: 20,
    bio: 'Dedicated practitioner of Karnataka living handicrafts.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
  };

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

  const craftStory = selectedProduct.craftStory || {};
  const hoursSpent = craftStory.hoursSpent || 24;

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Price transparency breakdown
  const price = Number(selectedProduct.price);
  const fairWage = selectedProduct.priceBreakdown?.artisanFairWage || Math.round(price * 0.82);
  const materialsCost = selectedProduct.priceBreakdown?.rawMaterialsDyes || Math.round(price * 0.13);
  const logisticsCost = selectedProduct.priceBreakdown?.packagingLogistics || (price - fairWage - materialsCost);

  const handleBuyNow = () => {
    const item = selectedProduct;
    setSelectedProduct(null);
    openOrderPopup(item);
  };

  const imageDescriptions = [
    'Full Product Perspective',
    'Intricate Texture & Stitch Detail',
    'Natural Dye & Material Highlight',
    'Artisan Loom & Handcrafted Angle'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-cream-50 w-full max-w-4xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scaleUp">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 bg-white/80 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full border border-terracotta-200">
              {selectedProduct.category}
            </span>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Verified Karnataka Cluster • {images.length} High-Res Photos
            </span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 rounded-full hover:bg-cream-200 text-stone-500 hover:text-stone-900 transition-colors touch-target"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">

            {/* Left Column: Image Gallery & Previews */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Main Image with Navigation Arrows */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-cream-300 shadow-md group">
                <img
                  src={images[activeImageIdx] || images[0]}
                  alt={`${selectedProduct.title} - View ${activeImageIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Handcrafted Hours Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-amber-500/95 text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{hoursSpent} Hours Handcrafted</span>
                  </span>
                </div>

                {/* Image Counter & Caption Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    📷 Photo {activeImageIdx + 1} of {images.length} • {imageDescriptions[activeImageIdx % imageDescriptions.length]}
                  </span>
                </div>

                {/* Left/Right Interactive Arrow Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all active:scale-95 z-10"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all active:scale-95 z-10"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Image Thumbnails Gallery */}
              {images.length > 1 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                    <span>Craft View Gallery ({images.length} Perspectives)</span>
                    <span className="text-terracotta-600">Click photo to view</span>
                  </p>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                          activeImageIdx === idx
                            ? 'border-terracotta-600 ring-2 ring-terracotta-600/30 shadow-md scale-102'
                            : 'border-cream-300 opacity-70 hover:opacity-100 hover:border-terracotta-400'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Story Player UI to justify premium pricing */}
              <AudioStoryPlayer
                artisanName={artisan.name}
                craftTitle={selectedProduct.title}
                storyText={craftStory.audioNarration || selectedProduct.storyAudioQuote || craftStory.culturalSignificance}
              />
            </div>

            {/* Right Column: Title, Artisan, Pricing, Transparent Breakdown */}
            <div className="md:col-span-6 space-y-6">
              
              {/* Product Title */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-indigo-900 leading-tight">
                  {selectedProduct.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-stone-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                  <span>{craftStory.provenanceLocation || artisan.village}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Stock: {selectedProduct.stockQuantity} units available</span>
                </div>
              </div>

              {/* Price Tag & Fair Share Notice */}
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-3xl font-serif font-black text-indigo-900">
                      {formatINR(price)}
                    </span>
                    <span className="text-xs text-stone-500 ml-2">All taxes included</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                    Fair Wage Guaranteed
                  </span>
                </div>

                {/* Transparent Fair Price Breakdown */}
                <div className="pt-3 border-t border-cream-200 space-y-1.5 text-xs">
                  <p className="font-bold text-stone-800 uppercase text-[10px] tracking-wider mb-1 flex items-center justify-between">
                    <span>Direct Price Breakdown Transparency</span>
                    <span className="text-terracotta-600 font-bold">100% Ethical</span>
                  </p>
                  
                  <div className="flex justify-between text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      Direct Artisan Fair Wage (ಕಲಾಕಾರರ ಪಾಲು):
                    </span>
                    <strong className="text-emerald-800 font-bold">{formatINR(fairWage)} (82%)</strong>
                  </div>

                  <div className="flex justify-between text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Ethical Materials & Natural Dyes:
                    </span>
                    <span>{formatINR(materialsCost)} (13%)</span>
                  </div>

                  <div className="flex justify-between text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                      Protective Eco-Packing & Shipping:
                    </span>
                    <span>{formatINR(logisticsCost)} (5%)</span>
                  </div>

                  {/* Horizontal visual bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex mt-2 bg-stone-200">
                    <div style={{ width: '82%' }} className="bg-emerald-600" title="Artisan share" />
                    <div style={{ width: '13%' }} className="bg-amber-500" title="Materials" />
                    <div style={{ width: '5%' }} className="bg-stone-400" title="Logistics" />
                  </div>
                </div>
              </div>

              {/* Authentic Karnataka Artisan Profile Card */}
              <div className="p-4 bg-white rounded-2xl border border-cream-300 flex items-center gap-3.5 shadow-sm">
                <img
                  src={artisan.profileImage}
                  alt={artisan.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-terracotta-500 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">{artisan.name}</h3>
                    {artisan.kannadaName && (
                      <span className="text-xs text-amber-900 font-semibold bg-amber-100 px-2 py-0.2 rounded-full">
                        {artisan.kannadaName}
                      </span>
                    )}
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-stone-500">{artisan.village}</p>
                  <p className="text-xs text-terracotta-700 font-semibold mt-0.5">
                    {artisan.yearsOfExperience} Years Heritage Mastercraft • {artisan.craftSpecialty} Specialist
                  </p>
                </div>
              </div>

              {/* Add to Cart / Buy Now Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => addToCart(selectedProduct, 1)}
                  disabled={selectedProduct.stockQuantity <= 0}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-terracotta-600 text-terracotta-700 hover:bg-terracotta-50 font-bold text-sm transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedProduct.stockQuantity <= 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-600 hover:from-terracotta-700 hover:to-terracotta-700 text-white font-bold text-sm shadow-md shadow-terracotta-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 touch-target animate-goldHalo"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Order Now • ₹{price}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Provenance & Craft Story Card (Deep Dive Section) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm space-y-6">
            <div className="border-b border-cream-200 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest">
                  Heritage Provenance & Cultural Significance
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-indigo-900 mt-1">
                  The Story Behind This Sacred Handcrafted Masterpiece
                </h3>
              </div>
              <span className="text-2xl">🏛️</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Motif & Cultural Significance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-terracotta-600" />
                  <h4>Cultural Motif & Legend</h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-cream-100/60 p-3.5 rounded-xl border border-cream-300/80">
                  {craftStory.culturalSignificance || "Traditional motifs inspired by Karnataka's temple architecture and folk arts."}
                </p>
              </div>

              {/* Handloom Materials Used */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <h4>Materials & Natural Dyes</h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-cream-100/60 p-3.5 rounded-xl border border-cream-300/80">
                  {craftStory.materialsUsed || "Handspun cotton, pure mulberry silk, organic vegetable dyes."}
                </p>
              </div>

              {/* Provenance Cluster & Cluster Origin */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h4>Artisan Cluster Origin</h4>
                </div>
                <div className="bg-cream-100/60 p-3.5 rounded-xl border border-cream-300/80 space-y-1 text-xs sm:text-sm text-stone-700">
                  <p className="font-semibold text-stone-900">{craftStory.provenanceLocation || artisan.village}</p>
                  <p className="text-stone-600 text-xs">Direct cooperative linkage, protecting centuries of oral textile memory.</p>
                </div>
              </div>

            </div>

            {/* Artisan Biography & Cooperative Impact Note */}
            <div className="bg-gradient-to-r from-cream-100 via-amber-50/50 to-cream-100 p-4 sm:p-5 rounded-2xl border border-amber-200/80 flex items-start gap-4">
              <span className="text-2xl mt-1">🌿</span>
              <div className="text-xs sm:text-sm text-stone-800">
                <p className="font-bold text-indigo-900 mb-1">Empowerment & Living Wage Commitment</p>
                <p className="text-stone-700 leading-relaxed">
                  {artisan.bio} By supporting {artisan.name}, you directly sustain home-based weaving circles in rural Karnataka where women maintain economic self-reliance.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
