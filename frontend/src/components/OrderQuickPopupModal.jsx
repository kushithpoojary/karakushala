import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  Volume2, 
  CheckCircle2, 
  Heart,
  Truck,
  Award,
  Zap
} from 'lucide-react';

export default function OrderQuickPopupModal() {
  const {
    orderPopupProduct,
    closeOrderPopup,
    addToCart,
    setIsCheckoutOpen,
    formatINR,
    showToast,
    audioVoiceAssistance
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (orderPopupProduct) {
      setQuantity(1);
      setIsOrdering(false);

      // Play soft speech intro if audio voice assistance is toggled on
      if (audioVoiceAssistance && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const artisanName = orderPopupProduct.artisan?.name || 'ಕರ್ನಾಟಕ ಕಲಾಕಾರರು';
        const u = new SpeechSynthesisUtterance(
          `${orderPopupProduct.title}. ತಯಾರಕರು ${artisanName}. ಬೆಲೆ ${orderPopupProduct.price} ರೂಪಾಯಿಗಳು.`
        );
        u.lang = 'kn-IN';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    }
  }, [orderPopupProduct, audioVoiceAssistance]);

  if (!orderPopupProduct) return null;

  const product = orderPopupProduct;
  const artisan = product.artisan || {
    name: 'Karnataka Master Artisan',
    village: product.craftStory?.provenanceLocation || 'Karnataka, India',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  };

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80';
  const price = Number(product.price);
  const artisanSharePerItem = product.priceBreakdown?.artisanFairWage || Math.round(price * 0.82);
  const totalAmount = price * quantity;
  const totalArtisanShare = artisanSharePerItem * quantity;
  const hoursSpent = product.craftStory?.hoursSpent || 24;
  const maxStock = product.stockQuantity || 5;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity(q => q + 1);
    } else {
      showToast(`Only ${maxStock} handcrafted items available!`, 'warning');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  // Instant Checkout: add to cart & open checkout modal immediately
  const handleInstantCheckout = () => {
    setIsOrdering(true);
    addToCart(product, quantity, false);
    setTimeout(() => {
      closeOrderPopup();
      setIsCheckoutOpen(true);
    }, 280);
  };

  // Add to Cart & continue browsing: triggers navbar bounce without interrupting view
  const handleAddToBag = () => {
    addToCart(product, quantity, false);
    showToast(`✨ ${quantity} × "${product.title}" added to your bag!`, 'success');
    closeOrderPopup();
  };

  // Web Speech API Voice preview for the craft item
  const handleSpeakDetails = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech not supported on this browser', 'info');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const speechText = `${product.title}. Created by master artisan ${artisan.name} in ${artisan.village}. Total price ${formatINR(totalAmount)} for ${quantity} items, with ${formatINR(totalArtisanShare)} going directly to the artisan family. Handcrafted with ${hoursSpent} hours of dedicated work.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Lively Pop-up Container with Spring Bounce Animation */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-amber-300/80 overflow-hidden my-auto animate-popBounce">
        
        {/* Festive Floating Background Sparkles */}
        <div className="absolute top-2 left-6 text-amber-400 text-lg animate-sparkleFloat pointer-events-none select-none">
          ✨
        </div>
        <div className="absolute top-8 right-14 text-terracotta-400 text-sm animate-sparkleFloat pointer-events-none select-none" style={{ animationDelay: '1.2s' }}>
          ✦
        </div>
        <div className="absolute -bottom-4 right-8 text-amber-500/20 text-6xl pointer-events-none select-none">
          🪡
        </div>

        {/* Modal Header Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-700 text-white">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-lg text-sm backdrop-blur-xs">
              ⚡
            </span>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <span>Quick Order (ತ್ವರಿತ ಖರೀದಿ)</span>
                <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Live Pop-up
                </span>
              </h3>
              <p className="text-[11px] text-cream-200">
                Direct Handloom & Handicraft Artisan Bridge
              </p>
            </div>
          </div>

          <button
            onClick={closeOrderPopup}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:rotate-90"
            aria-label="Close pop-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Product Showcase Card */}
          <div className="flex flex-col sm:flex-row gap-4 p-3.5 bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl border border-cream-300/80 shadow-xs relative">
            
            {/* Product Image with Shimmer & Badge */}
            <div className="relative w-full sm:w-28 sm:h-28 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-stone-100 border border-cream-300 shrink-0">
              <img
                src={imageSrc}
                alt={product.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-1 left-1">
                <span className="bg-indigo-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {product.category?.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin className="w-3 h-3 text-terracotta-600" />
                  <span className="font-semibold text-stone-700">{artisan.village}</span>
                  <span>•</span>
                  <span>{artisan.name}</span>
                </div>

                <h4 className="font-serif text-base font-bold text-indigo-950 leading-snug line-clamp-2 mt-0.5">
                  {product.title}
                </h4>
              </div>

              {/* Price & GI Tag Badge */}
              <div className="flex items-baseline justify-between pt-1 border-t border-cream-200">
                <div>
                  <span className="text-xl font-bold font-serif text-indigo-900">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-stone-500 ml-1">/ piece</span>
                </div>

                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>GI Certified</span>
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Quantity Selector & Price Transparency */}
          <div className="bg-white rounded-2xl border border-cream-300 p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-800">Select Quantity (ಪ್ರಮಾಣ)</p>
                <p className="text-[11px] text-stone-500">
                  {maxStock} handcrafted items ready in artisan stock
                </p>
              </div>

              {/* Lively Bouncing Counter Controls */}
              <div className="flex items-center gap-3 bg-cream-100 p-1 rounded-xl border border-cream-300">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-cream-200 disabled:opacity-40 text-stone-800 font-bold flex items-center justify-center shadow-xs transition-all active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-6 text-center font-bold text-base text-indigo-950 font-serif">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-cream-200 disabled:opacity-40 text-stone-800 font-bold flex items-center justify-center shadow-xs transition-all active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Fair Wage Calculation Callout */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🌾</span>
                <div>
                  <p className="font-bold text-emerald-950">
                    Artisan Family Earnings: <strong className="text-emerald-700 font-serif text-sm">{formatINR(totalArtisanShare)}</strong>
                  </p>
                  <p className="text-[10px] text-emerald-800">
                    88%+ directly credited to {artisan.name}'s cooperative account
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">
                Fair Wage
              </span>
            </div>

            {/* Total Payable Summary */}
            <div className="flex items-center justify-between pt-1 border-t border-cream-200 text-xs">
              <span className="text-stone-600 font-medium">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
              <span className="text-lg font-bold font-serif text-indigo-950">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          {/* Audio Assistance Voice Button */}
          <button
            onClick={handleSpeakDetails}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isPlayingAudio
                ? 'bg-amber-100 border-amber-400 text-amber-950 animate-pulse'
                : 'bg-cream-100 hover:bg-cream-200 border-cream-300 text-stone-700'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-700 animate-bounce' : 'text-terracotta-600'}`} />
            <span>
              {isPlayingAudio ? 'ಧ್ವನಿ ಓದಲಾಗುತ್ತಿದೆ (Playing Voice Guide)...' : '🔊 Listen to Craft Details (ಆಡಿಯೋ ವಿವರ ಕೇಳಿ)'}
            </span>
          </button>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 bg-cream-50 p-2 rounded-lg border border-cream-200">
              <Truck className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
              <span>Ships in 24-48 hrs</span>
            </div>
            <div className="flex items-center gap-1.5 bg-cream-50 p-2 rounded-lg border border-cream-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Genuine Handloom</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            
            {/* Primary: Instant Checkout */}
            <button
              onClick={handleInstantCheckout}
              disabled={isOrdering}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-600 hover:from-terracotta-700 hover:to-terracotta-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-terracotta-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 touch-target animate-goldHalo"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Proceed to Instant Checkout (ಆರ್ಡರ್ ಮಾಡಿ) • {formatINR(totalAmount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary: Add to Bag and Continue Browsing */}
            <button
              onClick={handleAddToBag}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border-2 border-indigo-900/20 text-indigo-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 touch-target"
            >
              <ShoppingBag className="w-4 h-4 text-terracotta-600" />
              <span>Add to Cart & Keep Browsing (ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ)</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
