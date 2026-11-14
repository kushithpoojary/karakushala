import React from 'react';
import { useApp } from '../context/AppContext';
import VoiceSearchBar from './VoiceSearchBar';
import { ShoppingBag, Sparkles, UserCheck, Store, Volume2, VolumeX, ShieldCheck, LogIn, LogOut, User, Compass, Headphones, Package } from 'lucide-react';

export default function Navbar({ onSearchChange, searchQuery }) {
  const {
    viewMode,
    setViewMode,
    customerView,
    navigateToOrders,
    navigateToTrackOrder,
    navigateToShop,
    cartCount,
    isCartBouncing,
    setIsCartOpen,
    activeArtisan,
    isArtisanLoggedIn,
    openArtisanLogin,
    logoutArtisan,
    activeUser,
    isUserLoggedIn,
    openUserLogin,
    logoutUser,
    openWelcomeModal,
    openCustomerCare,
    audioVoiceAssistance,
    setAudioVoiceAssistance,
    showToast
  } = useApp();

  const toggleVoice = () => {
    const next = !audioVoiceAssistance;
    setAudioVoiceAssistance(next);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (next) {
        showToast('ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯವಾಗಿದೆ (Voice Guidance Enabled)', 'info');
        const u = new SpeechSynthesisUtterance("ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯವಾಗಿದೆ. Voice guidance is active for KaraKushala artisan marketplace.");
        u.lang = 'kn-IN';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } else {
        showToast('Voice guidance turned off', 'info');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-cream-300 shadow-sm transition-all w-full">
      {/* Top Heritage Notice Bar */}
      <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-terracotta-700 text-cream-50 text-xs py-1.5 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-mustard-400 animate-pulse shrink-0" />
        <span className="truncate">Karnataka Heritage Initiative: <strong>88%+ of each purchase goes directly</strong> to rural Kasuti & Beedu artisans</span>
        <span className="hidden xl:inline text-mustard-300 shrink-0">| Dharwad • Udupi • Uttara Kannada</span>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">

          {/* Logo & Brand Identity */}
          <div
            onClick={navigateToShop}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-terracotta-600 text-white flex items-center justify-center shadow-md shadow-terracotta-600/30 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-lg sm:text-2xl font-serif select-none">🪡</span>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-indigo-900 group-hover:text-terracotta-600 transition-colors">
                  KaraKushala
                </span>
                <span className="text-[10px] sm:text-xs bg-mustard-100 text-amber-900 font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-mustard-300 shrink-0">
                  ಕರಕುಶಲ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-600 font-medium hidden 2xl:block">
                Direct Karnataka Artisan Handloom & Craft Bridge
              </p>
            </div>
          </div>

          {/* Desktop Search Bar with Voice Input (visible on xl and above so buttons never get squished) */}
          {viewMode === 'buyer' && (
            <div className="hidden xl:flex flex-1 max-w-sm 2xl:max-w-md mx-2 2xl:mx-4 min-w-[200px]">
              <VoiceSearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </div>
          )}

          {/* Controls: Mode Switcher, Login, Care & Cart (Always comfortably fits in viewport) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">

            {/* Accessibility Voice Guidance Button */}
            <button
              onClick={toggleVoice}
              title={audioVoiceAssistance ? "Voice Guidance Active (ಧ್ವನಿ ಸಕ್ರಿಯ)" : "Enable Audio Guidance (ಧ್ವನಿ ಸಹಾಯ)"}
              className={`p-1.5 sm:p-2.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 btn-press ${
                audioVoiceAssistance
                  ? 'bg-mustard-400 text-stone-900 ring-2 ring-mustard-500 animate-pulse'
                  : 'bg-cream-200 text-stone-600 hover:bg-cream-300'
              }`}
              aria-label="Toggle voice guidance"
            >
              {audioVoiceAssistance ? <Volume2 className="w-4 h-4 text-stone-900" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden 2xl:inline">ಧ್ವನಿ (Audio)</span>
            </button>

            {/* Customer Care Button (Accessible to both buyers and sellers) */}
            <button
              onClick={openCustomerCare}
              title="Customer Care & Grievance Helpdesk (ಗ್ರಾಹಕ ಸೇವೆ / ಕಲಾಕಾರರ ಸಹಾಯ)"
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-stone-700 hover:text-stone-900 transition-all flex items-center gap-1.5 text-xs font-bold border border-cream-300 touch-target shadow-xs shrink-0 btn-press"
            >
              <Headphones className="w-4 h-4 text-terracotta-600" />
              <span className="hidden md:inline">Care</span>
            </button>

            {/* My Orders & Live Tracking Button (Accessible to customers) */}
            <button
              onClick={navigateToOrders}
              title="My Orders & Live Dispatch Tracking (ನನ್ನ ಆರ್ಡರ್‌ಗಳು)"
              className={`p-1.5 sm:px-2.5 sm:py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold border touch-target shadow-xs shrink-0 btn-press ${
                viewMode === 'buyer' && (customerView === 'my-orders' || customerView === 'track-order')
                  ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-cream-200 hover:bg-cream-300 text-stone-700 hover:text-stone-900 border-cream-300'
              }`}
            >
              <Package className="w-4 h-4 text-terracotta-600" />
              <span className="hidden md:inline">Orders</span>
            </button>

            {/* Role Switcher Pill: Buyer vs Artisan Dashboard */}
            <div className="bg-cream-200 p-0.5 sm:p-1 rounded-full flex items-center border border-cream-300 shrink-0">
              <button
                onClick={navigateToShop}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'buyer' && customerView === 'shop'
                    ? 'bg-indigo-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
                <span className="sm:hidden">Shop</span>
              </button>

              <button
                onClick={() => {
                  if (!isArtisanLoggedIn) {
                    openArtisanLogin();
                  } else {
                    setViewMode('artisan');
                  }
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'artisan'
                    ? 'bg-terracotta-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-200" />
                <span>Artisan</span>
                {isArtisanLoggedIn && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white"></span>
                )}
              </button>
            </div>

            {/* Buyer Authentication: User Login Button or User Profile Badge */}
            {!isUserLoggedIn ? (
              <button
                onClick={openUserLogin}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 touch-target shrink-0 btn-press"
                title="Log in to Buyer Account (ಖರೀದಿದಾರರ ಲಾಗಿನ್)"
              >
                <User className="w-3.5 h-3.5 text-indigo-800" />
                <span className="whitespace-nowrap">Login</span>
              </button>
            ) : (
              <div 
                onClick={navigateToOrders}
                className="flex items-center gap-1.5 sm:gap-2 bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200 py-1 px-2 sm:px-2.5 rounded-full shadow-xs cursor-pointer transition-colors group shrink-0"
                title="View My Orders (ಆರ್ಡರ್‌ಗಳನ್ನು ನೋಡಿ)"
              >
                <img
                  src={activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={activeUser?.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-300 shrink-0"
                />
                <span className="font-bold text-indigo-950 text-xs truncate max-w-[70px] sm:max-w-[90px] hidden sm:inline group-hover:text-terracotta-600 transition-colors">
                  {activeUser?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logoutUser();
                  }}
                  title="Sign out of Buyer Account (ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸಿ)"
                  className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors ml-0.5"
                  aria-label="Logout user"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* When in Artisan mode and Artisan is logged in, show Artisan badge */}
            {viewMode === 'artisan' && isArtisanLoggedIn && (
              <div className="hidden lg:flex items-center gap-2 bg-cream-50 border border-amber-300/80 py-1 px-2.5 rounded-full shadow-xs shrink-0">
                <img
                  src={activeArtisan?.profileImage}
                  alt={activeArtisan?.name}
                  className="w-6 h-6 rounded-full object-cover border border-amber-400 shrink-0"
                />
                <span className="font-bold text-stone-900 text-xs truncate max-w-[80px]">
                  {activeArtisan?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={logoutArtisan}
                  title="Log out of Artisan Portal"
                  className="p-1 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Logout artisan"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Cart Button with Lively Wobble/Bounce Animation */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 sm:px-3.5 sm:py-2 rounded-full font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all touch-target shrink-0 btn-press ${
                isCartBouncing
                  ? 'bg-amber-500 text-stone-950 animate-cartWiggle ring-4 ring-amber-300 ring-offset-2 shadow-amber-500/50'
                  : 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-terracotta-500/20'
              }`}
              aria-label="Open Cart"
            >
              <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isCartBouncing ? 'scale-110 text-stone-950' : ''}`} />
              <span className="hidden sm:inline text-xs sm:text-sm">Cart</span>
              {cartCount > 0 && (
                <span className={`text-xs font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center transition-all ${
                  isCartBouncing
                    ? 'bg-stone-900 text-amber-300 scale-125'
                    : 'bg-white text-terracotta-700'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Search Bar for screens below xl (smoothly placed under main bar with zero overflow) */}
        {viewMode === 'buyer' && (
          <div className="xl:hidden pb-3 pt-1">
            <VoiceSearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
        )}

      </div>
    </header>
  );
}
