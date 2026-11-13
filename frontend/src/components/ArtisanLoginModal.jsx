import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_ARTISANS } from '../data/mockData';
import { 
  X, 
  Smartphone, 
  KeyRound, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function ArtisanLoginModal() {
  const { 
    isArtisanLoginModalOpen, 
    closeArtisanLogin, 
    loginArtisan, 
    showToast,
    audioVoiceAssistance 
  } = useApp();

  // Active sub-tab: 'otp' | 'demo' | 'register'
  const [activeTab, setActiveTab] = useState('otp');

  // Phone OTP login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notRegisteredHint, setNotRegisteredHint] = useState(false);

  // Registration state
  const [regForm, setRegForm] = useState({
    name: '',
    kannadaName: '',
    phone: '',
    village: '',
    craftSpecialty: 'Kasuti',
    yearsOfExperience: 10,
    bio: ''
  });

  // Available artisans for 1-click demo login
  const [availableArtisans, setAvailableArtisans] = useState(MOCK_ARTISANS);

  useEffect(() => {
    if (isArtisanLoginModalOpen) {
      // Refresh artisan list from backend when modal opens
      api.getArtisans().then(list => {
        if (list && list.length > 0) {
          setAvailableArtisans(list);
        }
      }).catch(() => {});
      // Reset errors
      setErrorMessage('');
      setNotRegisteredHint(false);
    }
  }, [isArtisanLoginModalOpen]);

  if (!isArtisanLoginModalOpen) return null;

  const playKannadaAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  };

  // 1. Send OTP handler
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setNotRegisteredHint(false);

    const clean = phoneNumber.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setErrorMessage('ದಯವಿಟ್ಟು 10-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Please enter a valid 10-digit mobile number)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendArtisanOtp(phoneNumber);
      setOtpSent(true);
      setSentToPhone(clean);
      setDemoOtpCode(res.demoOtp || '1234');
      setOtp(res.demoOtp || '1234'); // Pre-fill for ultra-smooth testing experience
      showToast(`ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ! Demo OTP: ${res.demoOtp || '1234'}`, 'info');

      if (audioVoiceAssistance) {
        playKannadaAudio(`ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ. ಡೆಮೊ ಕೋಡ್ ಒಂದು ಎರಡು ಮೂರು ನಾಲ್ಕು.`);
      }
    } catch (err) {
      if (err.requiresRegistration || err.message?.toLowerCase().includes('not registered') || err.message?.toLowerCase().includes('register')) {
        setNotRegisteredHint(true);
        setErrorMessage(err.message || 'ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನೋಂದಾಯಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ನೋಂದಣಿ ಟ್ಯಾಬ್ ಬಳಸಿ.');
      } else {
        setErrorMessage(err.message || 'OTP ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Log In handler
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!otp || otp.trim().length < 4) {
      setErrorMessage('ದಯವಿಟ್ಟು 4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ ನಮೂದಿಸಿ (Please enter 4-digit OTP)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.loginArtisan({
        phone: sentToPhone || phoneNumber,
        otp: otp.trim()
      });

      if (res.data) {
        loginArtisan(res.data, res.token);
      } else {
        throw new Error('Artisan login data missing from server response');
      }
    } catch (err) {
      setErrorMessage(err.message || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸರಿಯಾದ ಒಟಿಪಿ ನಮೂದಿಸಿ.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick 1-Click Demo Login handler
  const handleQuickLogin = async (artisan) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.loginArtisan({ artisanId: artisan.id });
      if (res.data) {
        loginArtisan(res.data, res.token);
      } else {
        loginArtisan(artisan);
      }
    } catch (err) {
      // Fallback
      loginArtisan(artisan);
    } finally {
      setLoading(false);
    }
  };

  // 4. Register New Artisan handler
  const handleRegisterArtisan = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regForm.name || !regForm.phone || !regForm.village) {
      setErrorMessage('ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಗ್ರಾಮ ಕಡ್ಡಾಯ (Name, Phone, and Village are required)');
      return;
    }

    const clean = regForm.phone.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setErrorMessage('ದಯವಿಟ್ಟು 10-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Please enter a valid 10-digit mobile number)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerArtisan({
        ...regForm,
        phone: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
        yearsOfExperience: Number(regForm.yearsOfExperience) || 5
      });

      if (res.data) {
        loginArtisan(res.data, res.token);
        showToast(`ಅಭಿನಂದನೆಗಳು! Welcome to KaraKushala, ${res.data.name}!`, 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heritage Header Banner */}
        <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-indigo-900 text-white p-6 sm:p-7 relative">
          
          {/* Close button */}
          <button
            onClick={closeArtisanLogin}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-mustard-300" />
            <span>ಕರ್ನಾಟಕ ಕಲಾಕಾರರ ಪೋರ್ಟಲ್ • Artisan Gateway</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>ಕಲಾಕಾರರ ಲಾಗಿನ್</span>
            <span className="text-amber-200 text-lg sm:text-xl font-normal font-sans">| Artisan Login</span>
          </h2>

          <p className="text-xs sm:text-sm text-cream-100 mt-1.5 leading-relaxed max-w-md">
            Direct portal for rural Karnataka Kasuti, Beedu cane & coastal craft masters to manage listings, track buyer orders, and view transparent UPI earnings.
          </p>

          {/* Voice Assistance Button */}
          <button
            type="button"
            onClick={() => playKannadaAudio("ಕಲಾಕಾರರ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಒಂದು ಕ್ಲಿಕ್ ಡೆಮೊ ಮೂಲಕ ಲಾಗಿನ್ ಆಗಿ ನಿಮ್ಮ ಕಲಾಕೃತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.")}
            className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-stone-900" />
            <span>ಧ್ವನಿ ಸಹಾಯ (Listen in Kannada)</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-cream-200 bg-cream-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('otp');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'otp'
                ? 'bg-white text-terracotta-700 shadow-sm border border-cream-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-terracotta-600" />
            <span>Mobile OTP</span>
            <span className="hidden sm:inline text-[11px] text-stone-500 font-normal">(ಮೊಬೈಲ್)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('demo');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'demo'
                ? 'bg-white text-indigo-900 shadow-sm border border-cream-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-700" />
            <span>1-Click Demo</span>
            <span className="hidden sm:inline text-[11px] text-stone-500 font-normal">(ಡೆಮೊ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'register'
                ? 'bg-white text-emerald-800 shadow-sm border border-cream-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-700" />
            <span>New Artisan</span>
            <span className="hidden sm:inline text-[11px] text-stone-500 font-normal">(ನೋಂದಣಿ)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[70vh] overflow-y-auto">

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{errorMessage}</p>
                {notRegisteredHint && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setRegForm(prev => ({ ...prev, phone: phoneNumber }));
                      setErrorMessage('');
                    }}
                    className="text-xs font-bold text-terracotta-700 hover:underline flex items-center gap-1"
                  >
                    <span>Click here to register as a new artisan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: Mobile OTP Login */}
          {activeTab === 'otp' && (
            <div className="space-y-5 animate-fadeIn">
              {!otpSent ? (
                // Step 1: Enter Phone Number
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ • Registered Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-stone-600 font-bold text-sm border-r border-cream-300 pr-2">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98451 23450"
                        maxLength={14}
                        className="w-full pl-22 pr-4 py-3.5 bg-cream-50 border border-cream-300 rounded-2xl text-stone-900 font-semibold text-base focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all shadow-inner"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Enter the 10-digit mobile number associated with your craft guild or self-help cooperative.
                    </p>
                  </div>

                  {/* Registered artisan quick pills */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 uppercase">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Quick Test Numbers (Click to autofill):</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPhoneNumber('98451 23450')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-stone-800 font-medium transition-colors"
                      >
                        98451 23450 (Parvati - Kasuti)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneNumber('94812 67891')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-stone-800 font-medium transition-colors"
                      >
                        94812 67891 (Ganesh - Beedu)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneNumber('97410 88234')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-stone-800 font-medium transition-colors"
                      >
                        97410 88234 (Kavita - Coastal)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full py-3.5 px-5 bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-terracotta-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] touch-target"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ... (Sending OTP)</span>
                      </>
                    ) : (
                      <>
                        <span>ಒಟಿಪಿ ಕಳುಹಿಸಿ • Send OTP via SMS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
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
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ • Enter 4-Digit OTP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="1 2 3 4"
                        maxLength={6}
                        className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3.5 bg-cream-50 border border-cream-300 rounded-2xl text-stone-900 font-bold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all shadow-inner"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Demo OTP Notice & Autofill */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950">
                    <span>
                      Demo Testing OTP is: <strong className="font-mono font-bold bg-amber-200 px-1.5 py-0.5 rounded text-stone-900">1234</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp('1234')}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg shadow-xs"
                    >
                      Autofill 1234
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-3.5 px-5 bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-terracotta-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] touch-target"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ... (Verifying)</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>ದೃಢೀಕರಿಸಿ ಲಾಗಿನ್ ಆಗಿ • Verify & Enter Portal</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-stone-600 hover:text-terracotta-700 font-medium underline"
                    >
                      Didn't receive SMS? Resend OTP (ಮರುಕಳುಹಿಸಿ)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: 1-Click Quick Demo Login */}
          {activeTab === 'demo' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-stone-600">
                Choose an authentic Karnataka master artisan below for instant 1-click access without SMS:
              </div>

              <div className="space-y-3">
                {availableArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="p-4 rounded-2xl border border-cream-300 bg-cream-50/60 hover:bg-cream-100 hover:border-terracotta-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={artisan.profileImage}
                        alt={artisan.name}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-indigo-950 text-sm sm:text-base">
                            {artisan.name}
                          </h4>
                          {artisan.kannadaName && (
                            <span className="text-[11px] text-stone-600 font-medium hidden sm:inline">
                              ({artisan.kannadaName})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-600">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                            {artisan.craftSpecialty} Craft
                          </span>
                          <span className="flex items-center gap-0.5 text-stone-500">
                            <MapPin className="w-3 h-3 text-terracotta-500 inline" />
                            {artisan.village.split(',')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                          {artisan.bio}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuickLogin(artisan)}
                      className="px-4 py-2.5 bg-indigo-900 hover:bg-terracotta-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all group-hover:scale-102 shrink-0 touch-target"
                    >
                      <span>Login as {artisan.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: New Artisan Registration */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterArtisan} className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-2 text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>
                  Join the KaraKushala artisan cooperative. Direct bank payouts, 88%+ fair share, zero middlemen.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Full Name (ಹೆಸರು) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Shantavva Badiger"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>

                {/* Kannada Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Kannada Name (ಕನ್ನಡದಲ್ಲಿ ಹೆಸರು)
                  </label>
                  <input
                    type="text"
                    value={regForm.kannadaName}
                    onChange={(e) => setRegForm({ ...regForm, kannadaName: e.target.value })}
                    placeholder="ಉದಾ: ಶಾಂತವ್ವ ಬಡಿಗೇರ"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Mobile Phone (ಮೊಬೈಲ್) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>

                {/* Craft Specialty */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Craft Specialty (ಕಲಾ ಪ್ರಕಾರ) *
                  </label>
                  <select
                    value={regForm.craftSpecialty}
                    onChange={(e) => setRegForm({ ...regForm, craftSpecialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  >
                    <option value="Kasuti">Kasuti Embroidery (ಕಸೂತಿ ಕಸೂತಿ ಕಲೆ)</option>
                    <option value="Beedu">Beedu Craft (ಕರಾವಳಿ ಬೀಡು ಹೆಣಿಗೆ)</option>
                    <option value="Coastal">Coastal Wood & Shell (ಕರಾವಳಿ ಕೆತ್ತನೆ)</option>
                  </select>
                </div>

                {/* Village / District */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Village / Town (ಗ್ರಾಮ & ಜಿಲ್ಲೆ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.village}
                    onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                    placeholder="e.g. Navalgund, Dharwad"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>

                {/* Years Experience */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Experience in Years (ಅನುಭವ)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={regForm.yearsOfExperience}
                    onChange={(e) => setRegForm({ ...regForm, yearsOfExperience: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Heritage Craft Bio (ನಿಮ್ಮ ಕಲೆಯ ಕಥೆ & ಪಾರಂಪರ್ಯ)
                </label>
                <textarea
                  rows={2}
                  value={regForm.bio}
                  onChange={(e) => setRegForm({ ...regForm, bio: e.target.value })}
                  placeholder="Describe your handcraft tradition, generational lineage, or cooperative..."
                  className="w-full px-3.5 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-800/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] touch-target"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ... (Registering Profile)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>ನೋಂದಾಯಿಸಿ ಪ್ರವೇಶಿಸಿ • Register & Enter Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Footer Security Badge */}
        <div className="bg-cream-100/90 px-6 py-3.5 border-t border-cream-200 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Karnataka Craft Preservation Guarantee</span>
          </span>
          <span>Zero Commission Middlemen</span>
        </div>

      </div>

    </div>
  );
}
