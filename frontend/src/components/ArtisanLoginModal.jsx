import React, { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  Mic,
  MicOff
} from 'lucide-react';

export default function ArtisanLoginModal() {
  const { 
    isArtisanLoginModalOpen, 
    closeArtisanLogin, 
    loginArtisan, 
    showToast,
    audioVoiceAssistance,
    currentLanguage,
    currentLangConfig,
    speakLocalized,
    t
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

  // Registration state: First Name & Last Name
  const [regForm, setRegForm] = useState({
    name: '',
    firstName: '',
    lastName: '',
    kannadaName: '',
    phone: '',
    village: '',
    craftSpecialty: 'Kasuti',
    yearsOfExperience: 10,
    bio: ''
  });

  // Voice speech recognition state
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);

  const toggleVoiceInput = (fieldName) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser. Please try Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (listeningField === fieldName) {
      recognitionRef.current?.stop();
      setListeningField(null);
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (err) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLangConfig?.sttLocale || (currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ml' ? 'ml-IN' : 'en-IN');

    recognition.onstart = () => {
      setListeningField(fieldName);
      showToast(`🎙️ Listening for ${fieldName}... Speak now (ಮಾತನಾಡಿ)`, 'info');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const streamText = (final || interim || '').replace(/[.,!?]/g, '').trim();
      if (streamText) {
        setRegForm(prev => {
          const next = { ...prev, [fieldName]: streamText };
          if (fieldName === 'name') {
            const parts = streamText.split(' ');
            next.firstName = parts[0] || '';
            next.lastName = parts.slice(1).join(' ') || '';
          }
          return next;
        });
      }

      if (final) {
        const clean = final.replace(/[.,!?]/g, '').trim();
        showToast(t('artisanHeardFieldVoice', { value: clean }), 'success');
        speakLocalized('artisanHeardFieldVoice', { value: clean });
        setListeningField(null);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setListeningField(null);
      if (event.error === 'not-allowed') {
        showToast('Microphone access denied. Please allow microphone in browser.', 'warning');
      } else {
        showToast('Voice not recognized. Please speak clearly or type.', 'info');
      }
    };

    recognition.onend = () => {
      setListeningField(null);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
      setListeningField(null);
    }
  };

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

  // Spoken number parser (digits or words)
  const parseNumberFromSpeech = (text) => {
    const match = text.match(/\d+/g);
    if (match && match.length > 0) {
      return match.join('');
    }

    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const wordMap = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
      'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100, 'thousand': 1000, 'lakh': 100000, 'lakhs': 100000
    };

    let total = 0;
    let current = 0;
    let found = false;

    for (const w of words) {
      if (wordMap[w] !== undefined) {
        found = true;
        const val = wordMap[w];
        if (val === 100) {
          current = (current || 1) * 100;
        } else if (val === 1000 || val === 100000) {
          total += (current || 1) * val;
          current = 0;
        } else {
          current += val;
        }
      }
    }
    total += current;
    return found ? total.toString() : text.replace(/\D/g, '') || text;
  };

  const handleVoiceInputResult = (fieldKey, cleanText) => {
    setListeningField(null);
    let recordedValue = cleanText;

    switch (fieldKey) {
      case 'loginPhone': {
        const digits = cleanText.replace(/\D/g, '') || parseNumberFromSpeech(cleanText);
        setPhoneNumber(digits.slice(0, 10));
        recordedValue = digits.slice(0, 10);
        break;
      }
      case 'loginOtp': {
        const digits = cleanText.replace(/\D/g, '') || parseNumberFromSpeech(cleanText);
        setOtp(digits.slice(0, 6));
        recordedValue = digits.slice(0, 6);
        break;
      }
      case 'regFirstName':
        setRegForm(prev => ({ ...prev, firstName: cleanText }));
        break;
      case 'regLastName':
        setRegForm(prev => ({ ...prev, lastName: cleanText }));
        break;
      case 'regPhone': {
        const digits = cleanText.replace(/\D/g, '') || parseNumberFromSpeech(cleanText);
        setRegForm(prev => ({ ...prev, phone: digits.slice(0, 10) }));
        recordedValue = digits.slice(0, 10);
        break;
      }
      case 'regCraftSpecialty': {
        const lower = cleanText.toLowerCase();
        let specialty = 'Kasuti';
        if (lower.includes('beedu') || lower.includes('cane') || lower.includes('palm')) {
          specialty = 'Beedu';
        } else if (lower.includes('coastal') || lower.includes('wood') || lower.includes('shell')) {
          specialty = 'Coastal';
        } else if (lower.includes('kasuti') || lower.includes('embroid') || lower.includes('saree')) {
          specialty = 'Kasuti';
        }
        setRegForm(prev => ({ ...prev, craftSpecialty: specialty }));
        recordedValue = specialty;
        break;
      }
      case 'regVillage':
        setRegForm(prev => ({ ...prev, village: cleanText }));
        break;
      case 'regYearsOfExperience': {
        const parsed = parseNumberFromSpeech(cleanText);
        const digits = parsed.replace(/\D/g, '') || '10';
        setRegForm(prev => ({ ...prev, yearsOfExperience: digits }));
        recordedValue = `${digits} years`;
        break;
      }
      case 'regBio':
        setRegForm(prev => ({ ...prev, bio: cleanText }));
        break;
      default:
        break;
    }

    showToast(`🎙️ Voice Recorded for ${fieldKey}: "${recordedValue}"`, 'success');

    // Audio feedback confirmation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`Recorded ${recordedValue}`);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const startVoiceInput = (fieldKey, fieldLabel = '') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser. Please use Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (listeningField === fieldKey) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setListeningField(null);
      return;
    }

    setListeningField(fieldKey);
    showToast(`🎙️ Listening for ${fieldLabel || fieldKey}... ಮಾತನಾಡಿ`, 'info');

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangConfig?.sttLocale || (currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ml' ? 'ml-IN' : 'en-IN');

      recognition.onresult = (event) => {
        const raw = event.results[0][0].transcript;
        if (!raw) return;
        handleVoiceInputResult(fieldKey, raw.trim());
      };

      recognition.onerror = (event) => {
        setListeningField(null);
        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please allow microphone in browser.', 'warning');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please speak into the mic.', 'info');
        }
      };

      recognition.onend = () => {
        setListeningField(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      setListeningField(null);
    }
  };

  const VoiceButton = ({ fieldKey, label = '' }) => {
    const isThisActive = listeningField === fieldKey;
    return (
      <button
        type="button"
        onClick={() => startVoiceInput(fieldKey, label)}
        className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs shrink-0 ${
          isThisActive
            ? 'bg-red-600 text-white animate-bounce ring-2 ring-red-400'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
        }`}
        title={`Click to speak ${label}`}
      >
        {isThisActive ? (
          <>
            <MicOff className="w-3 h-3 animate-pulse" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-3 h-3 text-amber-700" />
            <span>Voice</span>
          </>
        )}
      </button>
    );
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
        speakLocalized('artisanOtpSentVoice');
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

  // 4. Register New Artisan handler (First Name & Last Name)
  const handleRegisterArtisan = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const resolvedName = regForm.firstName || regForm.name || `${regForm.firstName || ''} ${regForm.lastName || ''}`.trim();
    if (!resolvedName || !regForm.phone || !regForm.village) {
      setErrorMessage('ಮೊದಲ ಹೆಸರು, ಮೊಬೈಲ್ ಮತ್ತು ಗ್ರಾಮ ಕಡ್ಡಾಯ (First Name, Phone, and Village are required)');
      return;
    }

    const clean = regForm.phone.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setErrorMessage('ದಯವಿಟ್ಟು 10-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (Please enter a valid 10-digit mobile number)');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${regForm.firstName || regForm.name || ''} ${regForm.lastName || ''}`.trim() || regForm.firstName || regForm.name;
      const res = await api.registerArtisan({
        name: fullName,
        firstName: regForm.firstName || regForm.name,
        lastName: regForm.lastName,
        kannadaName: regForm.lastName,
        phone: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
        village: regForm.village,
        craftSpecialty: regForm.craftSpecialty,
        bio: regForm.bio,
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
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto animate-scaleUp"
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
            onClick={() => speakLocalized('artisanGuidanceVoice')}
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
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor="artisan-phone-input"
                        className="block text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer"
                      >
                        ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ • Registered Mobile Number *
                      </label>
                      <VoiceButton fieldKey="loginPhone" label="Mobile Number" />
                    </div>
                    <div 
                      onClick={() => document.getElementById('artisan-phone-input')?.focus()}
                      className={`flex items-center w-full rounded-2xl border-2 bg-cream-50 hover:border-terracotta-300 focus-within:border-terracotta-500 focus-within:ring-2 focus-within:ring-terracotta-500/20 focus-within:bg-white transition-all shadow-inner overflow-hidden cursor-text ${
                        listeningField === 'loginPhone' ? 'border-red-500 ring-2 ring-red-400 bg-red-50/30' : 'border-cream-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-cream-200/80 border-r border-cream-300 text-stone-800 font-bold text-sm shrink-0 select-none">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        id="artisan-phone-input"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98451 23450"
                        maxLength={14}
                        className="flex-1 min-w-0 px-4 py-3.5 bg-transparent border-0 text-stone-900 font-semibold text-base focus:outline-none focus:ring-0 placeholder:text-stone-400"
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
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                        4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ • Enter 4-Digit OTP
                      </label>
                      <VoiceButton fieldKey="loginOtp" label="OTP" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="1 2 3 4"
                        maxLength={6}
                        className={`w-full text-center tracking-[0.4em] font-mono text-2xl py-3.5 bg-cream-50 border rounded-2xl text-stone-900 font-bold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all shadow-inner ${
                          listeningField === 'loginOtp' ? 'border-red-500 ring-2 ring-red-400 bg-red-50/30' : 'border-cream-300'
                        }`}
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
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
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
                      className="px-4 py-2.5 bg-indigo-900 hover:bg-terracotta-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all group-hover:scale-[1.02] shrink-0 touch-target"
                    >
                      <span>Login as {artisan.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: New Artisan Registration (First Name & Last Name with Voice-to-Text) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterArtisan} className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-2 text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>
                  Join the KaraKushala artisan cooperative. Direct bank payouts, 88%+ fair share, zero middlemen.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* First Name (previously Full Name) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      First Name (ಮೊದಲ ಹೆಸರು) *
                    </label>
                    <VoiceButton fieldKey="regFirstName" label="First Name" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regForm.firstName || regForm.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegForm(prev => ({
                        ...prev,
                        firstName: val,
                        name: `${val} ${prev.lastName || ''}`.trim()
                      }));
                    }}
                    placeholder="e.g. Shantavva"
                    className={`w-full px-3.5 py-2.5 bg-cream-50 border rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regFirstName' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                </div>

                {/* Last Name (previously Kannada Name) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      Last Name (ಕೊನೆಯ ಹೆಸರು)
                    </label>
                    <VoiceButton fieldKey="regLastName" label="Last Name" />
                  </div>
                  <input
                    type="text"
                    value={regForm.lastName || regForm.kannadaName || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegForm(prev => ({
                        ...prev,
                        lastName: val,
                        kannadaName: val,
                        name: `${prev.firstName || ''} ${val}`.trim()
                      }));
                    }}
                    placeholder="e.g. Badiger / ಬಡಿಗೇರ"
                    className={`w-full px-3.5 py-2.5 bg-cream-50 border rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regLastName' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="artisan-reg-phone" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider cursor-pointer">
                      Mobile Phone (ಮೊಬೈಲ್) *
                    </label>
                    <VoiceButton fieldKey="regPhone" label="Mobile Phone" />
                  </div>
                  <div
                    onClick={() => document.getElementById('artisan-reg-phone')?.focus()}
                    className={`flex items-center w-full rounded-xl border bg-cream-50 focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:bg-white overflow-hidden shadow-inner cursor-text transition-all ${
                      listeningField === 'regPhone' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 px-3 py-2.5 bg-cream-200/80 border-r border-cream-300 text-stone-800 font-bold text-xs shrink-0 select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="artisan-reg-phone"
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="98765 43210"
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent border-0 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Craft Specialty */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      Craft Specialty (ಕಲಾ ಪ್ರಕಾರ) *
                    </label>
                    <VoiceButton fieldKey="regCraftSpecialty" label="Craft Specialty" />
                  </div>
                  <select
                    value={regForm.craftSpecialty}
                    onChange={(e) => setRegForm({ ...regForm, craftSpecialty: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-cream-50 border rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regCraftSpecialty' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  >
                    <option value="Kasuti">Kasuti Embroidery (ಕಸೂತಿ ಕಲೆ)</option>
                    <option value="Beedu">Beedu Craft (ಕರಾವಳಿ ಬೀಡು ಹೆಣಿಗೆ)</option>
                    <option value="Coastal">Coastal Wood & Shell (ಕರಾವಳಿ ಕೆತ್ತನೆ)</option>
                  </select>
                </div>

                {/* Village / District */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      Village / Town (ಗ್ರಾಮ & ಜಿಲ್ಲೆ) *
                    </label>
                    <VoiceButton fieldKey="regVillage" label="Village" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regForm.village}
                    onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                    placeholder="e.g. Navalgund, Dharwad"
                    className={`w-full px-3.5 py-2.5 bg-cream-50 border rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regVillage' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                </div>

                {/* Years Experience */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      Experience in Years (ಅನುಭವ)
                    </label>
                    <VoiceButton fieldKey="regYearsOfExperience" label="Experience Years" />
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={regForm.yearsOfExperience}
                    onChange={(e) => setRegForm({ ...regForm, yearsOfExperience: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-cream-50 border rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regYearsOfExperience' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                </div>
              </div>

              {/* Bio (Heritage Craft Bio) with Voice-to-Text */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Heritage Craft Bio (ನಿಮ್ಮ ಕಲೆಯ ಕಥೆ & ಪಾರಂಪರ್ಯ)
                  </label>
                  <VoiceButton fieldKey="regBio" label="Heritage Craft Bio" />
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={regForm.bio}
                    onChange={(e) => setRegForm({ ...regForm, bio: e.target.value })}
                    placeholder="Describe your handcraft tradition, generational lineage, or speak into the mic..."
                    className={`w-full px-3.5 py-2 bg-cream-50 border rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all ${
                      listeningField === 'regBio' ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                  {listeningField === 'regBio' && (
                    <span className="absolute right-3 bottom-3 text-xs text-red-600 font-bold animate-pulse bg-white/90 px-2 py-0.5 rounded shadow">
                      Recording bio... ಮಾತನಾಡಿ
                    </span>
                  )}
                </div>
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
