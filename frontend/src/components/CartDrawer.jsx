import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatINR,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const directArtisanTotal = Math.round(cartSubtotal * 0.85);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-cream-300 animate-slideInRight">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-300 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta-600" />
              <h2 className="font-serif text-xl font-bold text-indigo-900">Your Craft Bag</h2>
              <span className="text-xs font-bold bg-cream-200 text-stone-700 px-2.5 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-cream-200 text-stone-500 hover:text-stone-900 transition-colors touch-target"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-cream-200/60 border-b border-cream-300 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-stone-700 mb-1.5">
                Add <strong>{formatINR(amountNeeded)}</strong> more for <span className="text-terracotta-700 font-bold">Free Insured Courier</span>!
              </p>
            ) : (
              <p className="text-emerald-800 font-bold mb-1.5 flex items-center gap-1">
                <span>🎉</span> You unlocked Free Insured Karnataka Handloom Courier!
              </p>
            )}
            <div className="w-full bg-cream-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-terracotta-600 h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 text-terracotta-500 flex items-center justify-center mx-auto text-2xl">
                  🪡
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Your craft bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our authentic Kasuti embroidery and coastal Beedu handicrafts to support Karnataka weavers.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-md"
                >
                  Browse Heritage Catalogue
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white rounded-2xl border border-cream-300 flex gap-3 shadow-xs"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=200&q=80'}
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-cream-300 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {product.artisan?.name || 'Karnataka Artisan'} • {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-serif text-sm font-bold text-indigo-900">
                        {formatINR(product.price * quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-cream-100 rounded-lg p-1 border border-cream-300">
                        <button
                          onClick={() => updateCartQuantity(product.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-300 text-stone-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-300 text-stone-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-cream-300 space-y-4 shadow-lg">
              
              {/* Direct Artisan Impact Note */}
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
                <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
                <p>
                  <strong>{formatINR(directArtisanTotal)}</strong> will be credited directly to the artisans' bank accounts!
                </p>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-600">Total Payable:</span>
                <span className="font-serif text-2xl font-black text-indigo-900">
                  {formatINR(cartSubtotal)}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-base shadow-lg shadow-terracotta-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all touch-target"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
