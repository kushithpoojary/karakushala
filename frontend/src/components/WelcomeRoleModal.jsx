import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  LogIn, 
  Store,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function WelcomeRoleModal() {
  const { 
    isWelcomeModalOpen, 
    closeWelcomeModal, 
    selectRole, 
    openUserLogin, 
    openArtisanLogin,
    isArtisanLoggedIn,
    isUserLoggedIn,
    activeUser,
    activeArtisan
  } = useApp();

  const [dontAskAgain, setDontAskAgain] = useState(false);

  if (!isWelcomeModalOpen) return null;

  const handleSelectBuyer = (autoOpenLogin = false) => {
    if (dontAskAgain) {
      try {
        localStorage.setItem('karakushala_role_chosen_persistent', 'buyer');
      } catch (e) {}
    }
    selectRole('buyer');
    if (autoOpenLogin && !isUserLoggedIn) {
      setTimeout(() => openUserLogin(), 200);
    }
  };

  const handleSelectArtisan = () => {
    if (dontAskAgain) {
      try {
        localStorage.setItem('karakushala_role_chosen_persistent', 'artisan');
      } catch (e) {}
    }
    selectRole('artisan');
    if (!isArtisanLoggedIn) {
      setTimeout(() => openArtisanLogin(), 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-stone-950/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => handleSelectBuyer(false)}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-cream-200/80 hover:bg-cream-300 rounded-full transition-colors"
          title="Continue to Storefront"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Top Accent Banner */}
        <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-indigo-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-mustard-300 animate-pulse" />
            <span>ಸ್ವಾಗತ • Welcome to KaraKushala (ಕರಕುಶಲ)</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            How would you like to experience KaraKushala today?
          </h2>
          <p className="text-amber-100/90 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
            ಇಂದು ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹೇಗೆ ಆರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ? Choose whether you are exploring heritage crafts as a buyer or managing listings as an artisan.
          </p>
        </div>

        {/* Two Role Choices Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* ROLE 1: BUYER / CRAFT CONNOISSEUR */}
            <div className="group relative rounded-3xl border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white hover:border-indigo-600/60 p-6 flex flex-col justify-between transition-all hover:shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-2xl shadow-md shadow-indigo-900/20 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                    ಕಲಾಪ್ರೇಮಿ • Buyer
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-indigo-950 group-hover:text-indigo-800 transition-colors">
                    I am a Craft Explorer & Buyer
                  </h3>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5">
                    ಕಲಾಕೃತಿ ಖರೀದಿದಾರ • Art Connoisseur
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Discover authentic <strong>Kasuti embroidery</strong>, sacred coastal <strong>Beedu palm weaves</strong>, and woodcrafts. Over <strong>88%</strong> of your payment flows directly to rural artisan families.
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Transparent fair wage cost breakdowns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rich audio craft stories & provenance</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 pt-4 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => handleSelectBuyer(false)}
                  className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>Explore Storefront (ಖರೀದಿಸಿ)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {!isUserLoggedIn && (
                  <button
                    type="button"
                    onClick={() => handleSelectBuyer(true)}
                    className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold rounded-2xl text-xs border border-indigo-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Sign In with Google / Phone (ಲಾಗಿನ್)</span>
                  </button>
                )}
              </div>
            </div>

            {/* ROLE 2: ARTISAN / WEAVER */}
            <div className="group relative rounded-3xl border-2 border-terracotta-100 bg-gradient-to-b from-terracotta-50/50 to-white hover:border-terracotta-600/60 p-6 flex flex-col justify-between transition-all hover:shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center text-2xl shadow-md shadow-terracotta-600/20 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6 text-amber-200" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-900 border border-terracotta-200">
                    ಕಲಾಕಾರ • Artisan
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-terracotta-700 transition-colors">
                    I am a Karnataka Artisan / Maker
                  </h3>
                  <p className="text-xs font-semibold text-terracotta-700 mt-0.5">
                    ನೇಕಾರ & ಕರಕುಶಲ ಕಲಾಕಾರ • Rural Maker
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Directly showcase your handcrafted creations to buyers worldwide. Manage listings with <strong>voice guidance in Kannada</strong>, track incoming orders, and receive transparent UPI payments.
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>88%+ fair share to artisan bank account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Voice assistance in Kannada (ಧ್ವನಿ ಸಹಾಯ)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 pt-4 border-t border-terracotta-100">
                <button
                  type="button"
                  onClick={handleSelectArtisan}
                  className="w-full py-3 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <UserCheck className="w-4 h-4 text-amber-200" />
                  <span>
                    {isArtisanLoggedIn ? 'Open Artisan Dashboard' : 'Artisan Login & Portal (ಕಲಾಕಾರರ ಲಾಗಿನ್)'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <p className="text-center text-[11px] text-stone-500 font-medium">
                  Quick Mobile OTP or 1-Click Master Demo
                </p>
              </div>
            </div>

          </div>

          {/* Footer note & Remember preference */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-cream-200 text-xs text-stone-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="w-4 h-4 rounded border-cream-400 text-terracotta-600 focus:ring-terracotta-500"
              />
              <span>Remember my role preference on this device</span>
            </label>

            <span className="text-stone-400 hidden sm:inline">
              You can easily switch roles anytime using the top navigation bar.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
