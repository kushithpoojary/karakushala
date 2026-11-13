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
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-cream-300 shadow-sm transition-all">
      {/* Top Heritage Notice Bar */}
      <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-terracotta-700 text-cream-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-mustard-400 animate-pulse" />
        <span>Karnataka Heritage Initiative: <strong>88%+ of each purchase goes directly</strong> to rural Kasuti & Beedu artisans</span>
        <span className="hidden md:inline text-mustard-300">| Dharwad • Udupi • Uttara Kannada</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">

          {/* Logo & Brand Identity */}
          <div
            onClick={navigateToShop}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-terracotta-600 text-white flex items-center justify-center shadow-md shadow-terracotta-600/30 group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl font-serif select-none">🪡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-indigo-900 group-hover:text-terracotta-600 transition-colors">
                  KaraKushala
                </span>
                <span className="text-[10px] sm:text-xs bg-mustard-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-mustard-300">
                  ಕರಕುಶಲ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-600 font-medium hidden sm:block">
                Direct Karnataka Artisan Handloom & Craft Bridge
              </p>
            </div>
          </div>

          {/* Desktop Search Bar with Voice Input (Storefront mode) */}
          {viewMode === 'buyer' && (
            <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
              <VoiceSearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </div>
          )}

          {/* Controls: Mode Switcher & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Accessibility Voice Guidance Button */}
            <button
              onClick={toggleVoice}
              title={audioVoiceAssistance ? "Voice Guidance Active (ಧ್ವನಿ ಸಕ್ರಿಯ)" : "Enable Audio Guidance (ಧ್ವನಿ ಸಹಾಯ)"}
              className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                audioVoiceAssistance
                  ? 'bg-mustard-400 text-stone-900 ring-2 ring-mustard-500 animate-pulse'
                  : 'bg-cream-200 text-stone-600 hover:bg-cream-300'
              }`}
            >
              {audioVoiceAssistance ? <Volume2 className="w-4 h-4 text-stone-900" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline">ಧ್ವನಿ (Audio)</span>
            </button>

            {/* Customer Care Button (Accessible to both buyers and sellers) */}
            <button
              onClick={openCustomerCare}
              title="Customer Care & Grievance Helpdesk (ಗ್ರಾಹಕ ಸೇವೆ / ಕಲಾಕಾರರ ಸಹಾಯ)"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-stone-700 hover:text-stone-900 transition-all flex items-center gap-1.5 text-xs font-bold border border-cream-300 touch-target shadow-xs"
            >
              <Headphones className="w-4 h-4 text-terracotta-600" />
              <span className="hidden sm:inline">Care</span>
              <span className="hidden xl:inline text-[10px] text-stone-500 font-normal">(ಸಹಾಯ)</span>
            </button>

            {/* My Orders & Live Tracking Button (Accessible to customers) */}
            <button
              onClick={navigateToOrders}
              title="My Orders & Live Dispatch Tracking (ನನ್ನ ಆರ್ಡರ್‌ಗಳು)"
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold border touch-target shadow-xs ${
                viewMode === 'buyer' && (customerView === 'my-orders' || customerView === 'track-order')
                  ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-cream-200 hover:bg-cream-300 text-stone-700 hover:text-stone-900 border-cream-300'
              }`}
            >
              <Package className="w-4 h-4 text-terracotta-600" />
              <span>Orders</span>
              <span className="hidden xl:inline text-[10px] text-stone-500 font-normal">(ಆರ್ಡರ್)</span>
            </button>

            {/* Role Switcher Pill: Buyer vs Artisan Dashboard */}
            <div className="bg-cream-200 p-1 rounded-full flex items-center border border-cream-300">
              <button
                onClick={navigateToShop}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  viewMode === 'buyer' && customerView === 'shop'
                    ? 'bg-indigo-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>

              <button
                onClick={() => {
                  if (!isArtisanLoggedIn) {
                    openArtisanLogin();
                  } else {
                    setViewMode('artisan');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
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
                <span className="hidden sm:inline text-[10px] bg-amber-800/40 text-amber-200 px-1.5 py-0.5 rounded-full">
                  ಕಲಾಕಾರ
                </span>
              </button>
            </div>

            {/* Buyer Authentication: User Login Button or User Profile Badge */}
            {!isUserLoggedIn ? (
              <button
                onClick={openUserLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 touch-target"
                title="Log in to Buyer Account (ಖರೀದಿದಾರರ ಲಾಗಿನ್)"
              >
                <User className="w-3.5 h-3.5 text-indigo-800" />
                <span>User Login</span>
                <span className="hidden lg:inline text-[10px] text-indigo-800 font-semibold">(ಲಾಗಿನ್)</span>
              </button>
            ) : (
              <div 
                onClick={navigateToOrders}
                className="flex items-center gap-2 bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200 py-1 px-2.5 rounded-full shadow-xs cursor-pointer transition-colors group"
                title="View My Orders (ಆರ್ಡರ್‌ಗಳನ್ನು ನೋಡಿ)"
              >
                <img
                  src={activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={activeUser?.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-300 shrink-0"
                />
                <span className="font-bold text-indigo-950 text-xs truncate max-w-[90px] hidden sm:inline group-hover:text-terracotta-600 transition-colors">
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
              <div className="hidden md:flex items-center gap-2 bg-cream-50 border border-amber-300/80 py-1 px-2.5 rounded-full shadow-xs">
                <img
                  src={activeArtisan?.profileImage}
                  alt={activeArtisan?.name}
                  className="w-6 h-6 rounded-full object-cover border border-amber-400 shrink-0"
                />
                <span className="font-bold text-stone-900 text-xs truncate max-w-[90px]">
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

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold flex items-center gap-1.5 sm:gap-2 shadow-md shadow-terracotta-500/20 active:scale-95 transition-all touch-target"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-terracotta-700 text-xs font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar with Voice Input (visible on screens < 768px in Storefront mode) */}
        {viewMode === 'buyer' && (
          <div className="md:hidden pb-3 pt-1">
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
