import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_BUYERS } from '../data/mockData';
import { 
  X, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Heart,
  ShoppingBag,
  HelpCircle,
  Mail,
  User
} from 'lucide-react';

export default function UserLoginModal() {
  const { 
    isUserLoginModalOpen, 
    closeUserLogin, 
    loginUser, 
    showToast 
  } = useApp();

  // Active method tab: 'google' | 'phone'
  const [activeMethod, setActiveMethod] = useState('google');

  // Phone OTP login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Google sign in custom email state
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  if (!isUserLoginModalOpen) return null;

  // 1. Google 1-Click Sign In
  const handleGoogleLogin = async (mockBuyerProfile = null) => {
    setLoading(true);
    setErrorMessage('');
    try {
      let payload = {};
      if (mockBuyerProfile) {
        payload = {
          email: mockBuyerProfile.email,
          name: mockBuyerProfile.name,
          phone: mockBuyerProfile.phone,
          avatar: mockBuyerProfile.avatar
        };
      } else if (customGoogleEmail) {
        payload = {
          email: customGoogleEmail,
          name: customGoogleName || customGoogleEmail.split('@')[0],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        };
      } else {
        // Default to demo profile
        payload = {
          email: MOCK_BUYERS[0].email,
          name: MOCK_BUYERS[0].name,
          phone: MOCK_BUYERS[0].phone,
          avatar: MOCK_BUYERS[0].avatar
        };
      }

      const res = await api.loginUserWithGoogle(payload);
      if (res.data) {
        loginUser(res.data, res.token);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Phone OTP: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    const clean = phoneNumber.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setErrorMessage('ದಯವಿಟ್ಟು 10-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Please enter a valid 10-digit mobile number)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendUserOtp(phoneNumber);
      setOtpSent(true);
      setSentToPhone(clean);
      setOtp(res.demoOtp || '1234'); // Pre-fill demo OTP for fast testing
      showToast(`ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ! Demo OTP: ${res.demoOtp || '1234'}`, 'info');
    } catch (err) {
      setErrorMessage(err.message || 'OTP ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Phone OTP: Verify & Sign In
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!otp || otp.trim().length < 4) {
      setErrorMessage('ದಯವಿಟ್ಟು 4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ ನಮೂದಿಸಿ (Please enter 4-digit OTP)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.loginUserWithPhone({
        phone: sentToPhone || phoneNumber,
        otp: otp.trim(),
        name: buyerName.trim()
      });

      if (res.data) {
        loginUser(res.data, res.token);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-stone-950/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heritage Header Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-terracotta-700 text-white p-6 sm:p-7 relative">
          
          {/* Close button */}
          <button
            onClick={closeUserLogin}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-4 h-4 text-mustard-300" />
            <span>ಕಲಾಪ್ರೇಮಿ ಪೋರ್ಟಲ್ • Craft Lover Gateway</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>ಖರೀದಿದಾರರ ಲಾಗಿನ್</span>
            <span className="text-amber-200 text-lg sm:text-xl font-normal font-sans">| Buyer Sign In</span>
          </h2>

          <p className="text-xs sm:text-sm text-cream-100 mt-1.5 leading-relaxed">
            Sign in to securely save delivery addresses, track authentic handloom orders, and directly support Karnataka's rural artisan clusters.
          </p>
        </div>

        {/* Tab Switcher: Google Account vs Mobile OTP */}
        <div className="flex border-b border-cream-200 bg-cream-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveMethod('google');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'google'
                ? 'bg-white text-indigo-900 shadow-sm border border-cream-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMethod('phone');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'phone'
                ? 'bg-white text-terracotta-700 shadow-sm border border-cream-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-terracotta-600" />
            <span>Mobile OTP (ಮೊಬೈಲ್)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[72vh] overflow-y-auto space-y-5">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          {/* METHOD 1: GOOGLE ACCOUNT LOGIN */}
          {activeMethod === 'google' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Primary 1-Click Google Button */}
              <div className="text-center space-y-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleGoogleLogin(MOCK_BUYERS[0])}
                  className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-stone-700 font-bold rounded-2xl border-2 border-stone-200 hover:border-indigo-400 shadow-sm flex items-center justify-center gap-3 transition-all active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="text-sm sm:text-base">Continue with Google</span>
                </button>

                <p className="text-[11px] text-stone-500">
                  Instant secure sign-in via Google OAuth
                </p>
              </div>

              {/* Quick Demo Buyer Accounts */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-mustard-500" />
                  <span>Or Pick a Demo Buyer Account:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MOCK_BUYERS.map((buyer) => (
                    <button
                      key={buyer.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handleGoogleLogin(buyer)}
                      className="p-3 bg-cream-50 hover:bg-cream-100 border border-cream-300 hover:border-indigo-300 rounded-2xl text-left flex items-center gap-3 transition-all group"
                    >
                      <img
                        src={buyer.avatar}
                        alt={buyer.name}
                        className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                      />
                      <div className="truncate">
                        <p className="font-bold text-stone-900 text-xs truncate group-hover:text-indigo-900">
                          {buyer.name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {buyer.email}
                        </p>
                        <p className="text-[9px] text-terracotta-700 font-medium">
                          {buyer.city}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option to type custom email */}
              <div className="pt-1">
                {!showCustomGoogleInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="text-xs text-indigo-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Use another Google account</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="p-3.5 bg-cream-50 border border-cream-300 rounded-2xl space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase">
                        Google Email
                      </label>
                      <input
                        type="email"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3 py-2 bg-white border border-cream-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder="e.g. Ramesh Kulkarni"
                        className="w-full px-3 py-2 bg-white border border-cream-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!customGoogleEmail || loading}
                      onClick={() => handleGoogleLogin()}
                      className="w-full py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      Sign In with Custom Google Account
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* METHOD 2: MOBILE PHONE OTP LOGIN */}
          {activeMethod === 'phone' && (
            <div className="space-y-5 animate-fadeIn">
              {!otpSent ? (
                // Step 1: Enter Mobile Number
                <form onSubmit={handleSendOtp} className="space-y-4">
                  
                  {/* Buyer Name Optional */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="buyer-name-input" 
                      className="block text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer"
                    >
                      ಹೆಸರು • Your Name (Optional)
                    </label>
                    <input
                      id="buyer-name-input"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Ananya Rao"
                      className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-300 focus:border-terracotta-500 rounded-2xl text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Phone Input with Unified, 100% Clickable Flex Container */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="buyer-phone-input" 
                      className="block text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer"
                    >
                      ಮೊಬೈಲ್ ಸಂಖ್ಯೆ • Mobile Phone Number *
                    </label>
                    
                    <div 
                      onClick={() => document.getElementById('buyer-phone-input')?.focus()}
                      className="flex items-center w-full rounded-2xl border-2 border-cream-300 bg-cream-50 hover:border-terracotta-300 focus-within:border-terracotta-500 focus-within:ring-2 focus-within:ring-terracotta-500/20 focus-within:bg-white transition-all shadow-inner overflow-hidden cursor-text"
                    >
                      {/* Flag and Prefix */}
                      <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-cream-200/80 border-r border-cream-300 text-stone-800 font-bold text-sm shrink-0 select-none">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      
                      {/* Native Clean Input */}
                      <input
                        id="buyer-phone-input"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98801 23456"
                        maxLength={14}
                        className="flex-1 min-w-0 px-4 py-3.5 bg-transparent border-0 text-stone-900 font-semibold text-base focus:outline-none focus:ring-0 placeholder:text-stone-400"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">
                      We will send a 4-digit verification OTP to your mobile number.
                    </p>
                  </div>

                  {/* Quick Test Numbers */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 uppercase">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Quick Test Numbers (Click to fill):</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber('98801 23456');
                          setBuyerName('Ananya Rao');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-stone-800 font-medium transition-colors"
                      >
                        98801 23456 (Ananya)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber('99887 76655');
                          setBuyerName('Vikram Hegde');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-stone-800 font-medium transition-colors"
                      >
                        99887 76655 (Vikram)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <span>Send Verification OTP (ಒಟಿಪಿ ಕಳುಹಿಸಿ)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                // Step 2: Enter OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        OTP sent to: <strong>+91 {sentToPhone}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-emerald-800 font-bold underline hover:text-emerald-950"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label 
                      htmlFor="buyer-otp-input"
                      className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
                    >
                      4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ • Enter 4-Digit OTP
                    </label>
                    <input
                      id="buyer-otp-input"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="1 2 3 4"
                      maxLength={6}
                      className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3.5 bg-cream-50 border-2 border-cream-300 focus:border-terracotta-500 rounded-2xl text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white transition-all shadow-inner"
                      autoFocus
                    />
                    <p className="text-[11px] text-stone-500 text-center">
                      Demo OTP for testing: <strong className="text-stone-900">1234</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <span>Verify & Sign In (ಲಾಗಿನ್ ದೃಢೀಕರಿಸಿ)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
