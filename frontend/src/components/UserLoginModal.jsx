import React, { useState, useEffect } from 'react';
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
  ShoppingBag, 
  HelpCircle, 
  Mail, 
  User, 
  ArrowLeft, 
  Plus, 
  Lock, 
  Check
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

  // Google OAuth flow state: 'idle' | 'account-chooser' | 'enter-account' | 'authenticating'
  const [googleStep, setGoogleStep] = useState('idle');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);

  // Custom Google input state
  const [newGoogleEmail, setNewGoogleEmail] = useState('');
  const [newGoogleName, setNewGoogleName] = useState('');
  const [googleEmailError, setGoogleEmailError] = useState('');

  // Persisted Google accounts list
  const [googleAccounts, setGoogleAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('karakushala_google_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'acc_1',
        name: 'Ananya Rao',
        email: 'ananya.rao@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        city: 'Bengaluru, Karnataka'
      },
      {
        id: 'acc_2',
        name: 'Vikram Hegde',
        email: 'vikram.hegde@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        city: 'Mysuru, Karnataka'
      }
    ];
  });

  // Phone OTP login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isUserLoginModalOpen) {
      setGoogleStep('idle');
      setErrorMessage('');
      setOtpSent(false);
      setOtp('');
    }
  }, [isUserLoginModalOpen]);

  if (!isUserLoginModalOpen) return null;

  // Open Google Account Chooser
  const startGoogleSignIn = () => {
    setErrorMessage('');
    setGoogleStep('account-chooser');
  };

  // Perform Google Authentication with selected account
  const executeGoogleAuth = async (account) => {
    setSelectedGoogleAccount(account);
    setGoogleStep('authenticating');

    try {
      // Simulate realistic Google OAuth 2.0 token exchange handshake
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await api.loginUserWithGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        phone: account.phone || '+91 98801 23456'
      });

      // Save account to persistent list if new
      setGoogleAccounts(prev => {
        const exists = prev.some(a => a.email.toLowerCase() === account.email.toLowerCase());
        if (!exists) {
          const updated = [account, ...prev];
          try {
            localStorage.setItem('karakushala_google_accounts', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        }
        return prev;
      });

      if (res.data) {
        loginUser(res.data, res.token);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
      setGoogleStep('account-chooser');
    }
  };

  // Handle custom Google account addition
  const handleAddNewGoogleAccount = (e) => {
    e.preventDefault();
    setGoogleEmailError('');

    if (!newGoogleEmail.trim()) {
      setGoogleEmailError('Please enter an email address.');
      return;
    }

    if (!newGoogleEmail.includes('@') || !newGoogleEmail.includes('.')) {
      setGoogleEmailError('Please enter a valid Google/Gmail address.');
      return;
    }

    const email = newGoogleEmail.trim().toLowerCase();
    const displayName = newGoogleName.trim() || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    
    // Generate avatar with user initials or neutral avatar
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff&size=128`;

    const newAcc = {
      id: `acc_${Date.now()}`,
      name: displayName,
      email,
      avatar,
      city: 'Karnataka, India'
    };

    executeGoogleAuth(newAcc);
  };

  // Phone OTP Handlers
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
      setOtp(res.demoOtp || '1234');
      showToast(`ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ! Demo OTP: ${res.demoOtp || '1234'}`, 'info');
    } catch (err) {
      setErrorMessage(err.message || 'OTP ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* ========================================================= */}
        {/* VIEW 1: GOOGLE AUTHENTICATING SCREEN                      */}
        {/* ========================================================= */}
        {googleStep === 'authenticating' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
              <svg className="w-12 h-12 animate-spin" viewBox="0 0 50 50">
                <circle
                  className="stroke-[#4285F4]"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="5"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-sans text-lg font-bold text-stone-900">
                Signing in with Google...
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {selectedGoogleAccount?.email}
              </p>
              <p className="text-xs text-stone-600 pt-2">
                Connecting securely to <strong>KaraKushala</strong>...
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: GOOGLE ACCOUNT CHOOSER (POPUP DIALOG)             */}
        {/* ========================================================= */}
        {googleStep === 'account-chooser' && (
          <div className="animate-fadeIn">
            {/* Google Header */}
            <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 className="font-sans text-base font-bold text-stone-900 leading-none">
                    Sign in with Google
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Choose an account to continue to <strong>KaraKushala</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGoogleStep('idle')}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Accounts List */}
            <div className="p-4 sm:p-6 space-y-2 max-h-[60vh] overflow-y-auto">
              {googleAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => executeGoogleAuth(account)}
                  className="w-full p-3 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-300 text-left flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-indigo-900">
                        {account.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-400 group-hover:text-indigo-700 shrink-0 flex items-center gap-1">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setGoogleStep('enter-account')}
                className="w-full p-3 rounded-2xl hover:bg-stone-50 border-t border-stone-200 text-left flex items-center gap-3 transition-all text-stone-800 font-semibold text-xs sm:text-sm pt-4 mt-2"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Use another Google Account</p>
                  <p className="text-[11px] text-stone-500">Sign in with your own Gmail or Workspace ID</p>
                </div>
              </button>
            </div>

            {/* Google Footer Disclaimer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 leading-normal flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                To continue, Google will share your name, email address, language preference, and profile picture with KaraKushala. See KaraKushala's Privacy Policy.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: GOOGLE "USE ANOTHER ACCOUNT" FORM                 */}
        {/* ========================================================= */}
        {googleStep === 'enter-account' && (
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGoogleStep('account-chooser')}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
                  title="Back to accounts"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 className="font-sans text-base font-bold text-stone-900 leading-none">
                    Sign in with Google
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    to continue to KaraKushala
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGoogleStep('idle')}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAddNewGoogleAccount} className="p-6 space-y-4">
              {googleEmailError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{googleEmailError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Google Email or Gmail ID *
                </label>
                <input
                  type="email"
                  required
                  value={newGoogleEmail}
                  onChange={(e) => setNewGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-[#4285F4] rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Your Full Name (Display on KaraKushala)
                </label>
                <input
                  type="text"
                  value={newGoogleName}
                  onChange={(e) => setNewGoogleName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-[#4285F4] rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setGoogleStep('account-chooser')}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Next & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: MAIN LOGIN SCREEN (DEFAULT IDLE STATE)            */}
        {/* ========================================================= */}
        {googleStep === 'idle' && (
          <div>
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
                  
                  {/* Primary Google Button that triggers Account Chooser */}
                  <div className="text-center space-y-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={startGoogleSignIn}
                      className="w-full py-4 px-4 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-2xl border-2 border-stone-200 hover:border-[#4285F4] shadow-sm hover:shadow-md flex items-center justify-center gap-3 transition-all active:scale-98 group"
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span className="text-sm sm:text-base">Continue with Google</span>
                    </button>

                    <p className="text-[11px] text-stone-500">
                      Opens Google Account selector to pick or enter your Google credentials
                    </p>
                  </div>

                  {/* Trust & Safety Notice */}
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-950">
                    <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">Verified Google Integration</p>
                      <p className="text-[11px] text-stone-600">
                        Sign in with your preferred Google Account to automatically sync shipping addresses and track handloom deliveries.
                      </p>
                    </div>
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
        )}

      </div>

    </div>
  );
}
