import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Headphones, 
  Mic, 
  MicOff, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  FileText, 
  Send, 
  UserCheck, 
  ShoppingBag, 
  Play, 
  Square,
  HelpCircle
} from 'lucide-react';

export default function CustomerCareModal() {
  const { 
    isCustomerCareModalOpen, 
    closeCustomerCare, 
    activeUser, 
    activeArtisan, 
    viewMode,
    showToast,
    audioVoiceAssistance 
  } = useApp();

  // Role: 'buyer' or 'artisan'
  const [userRole, setUserRole] = useState('buyer');

  // Form Fields
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('Quality & Authenticity');
  const [orderRef, setOrderRef] = useState('');
  const [complaintText, setComplaintText] = useState('');

  // Voice Recording & Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize role and contact details based on active session
  useEffect(() => {
    if (viewMode === 'artisan' || activeArtisan) {
      setUserRole('artisan');
      if (activeArtisan) {
        setName(activeArtisan.name || '');
        setContact(activeArtisan.phone || '');
        setCategory('Payment / UPI Fair Share Payout');
      }
    } else {
      setUserRole('buyer');
      if (activeUser) {
        setName(activeUser.name || '');
        setContact(activeUser.phone || activeUser.email || '');
        setCategory('Delivery & Tracking');
      }
    }
  }, [viewMode, activeArtisan, activeUser, isCustomerCareModalOpen]);

  // Set up Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Indian English / Regional handling

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        const clean = currentTranscript.trim();
        setVoiceTranscript(clean);
        setComplaintText((prev) => {
          if (!prev.includes(clean)) {
            return prev ? `${prev} ${clean}` : clean;
          }
          return prev;
        });
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition warning:', e.error);
      };

      recognitionRef.current = rec;
    }
  }, []);

  if (!isCustomerCareModalOpen) return null;

  // Audio Guidance in Kannada
  const speakKannada = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Start Voice Message Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Also start speech-to-text
      try {
        recognitionRef.current?.start();
      } catch (e) {}

      showToast('🎙️ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಆರಂಭವಾಗಿದೆ (Voice recording started)...', 'info');
      if (audioVoiceAssistance) {
        speakKannada("ನಿಮ್ಮ ದೂರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ. ರೆಕಾರ್ಡಿಂಗ್ ಆರಂಭವಾಗಿದೆ.");
      }
    } catch (err) {
      console.warn('Microphone error:', err);
      showToast('Microphone access denied. You can type your complaint below.', 'warning');
    }
  };

  // Stop Voice Message Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      showToast('✓ ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗಿದೆ! Voice message saved.', 'success');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Complaint Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!complaintText.trim() && !audioUrl) {
      showToast('Please type your complaint or record a voice message.', 'warning');
      return;
    }

    if (!name.trim() || !contact.trim()) {
      showToast('Please provide your name and contact number/email.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `TKT-KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: ticketId,
        userRole,
        name,
        contact,
        category,
        orderRef: orderRef || 'N/A',
        description: complaintText,
        hasVoiceMessage: Boolean(audioUrl),
        duration: recordingDuration ? `${recordingDuration}s` : null,
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'Under Review by Grievance Redressal Cell'
      };

      setTicketData(newTicket);
      setIsSubmitting(false);
      showToast(`ದೂರು ದಾಖಲಾಗಿದೆ! Complaint Ticket ${ticketId} created.`, 'success');

      if (audioVoiceAssistance) {
        speakKannada(`ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ದೂರು ಸಂಖ್ಯೆ ${ticketId} ದಾಖಲಾಗಿದೆ. ನಮ್ಮ ಗ್ರಾಹಕ ಸೇವಾ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲಿದೆ.`);
      }
    }, 900);
  };

  const handleReset = () => {
    setTicketData(null);
    setComplaintText('');
    setAudioUrl(null);
    setVoiceTranscript('');
    setRecordingDuration(0);
  };

  // Categories based on role
  const buyerCategories = [
    'Delivery & Tracking (ವಿತರಣೆ & ಟ್ರ್ಯಾಕಿಂಗ್)',
    'Quality & Authenticity (ಗುಣಮಟ್ಟ & ದೃಢೀಕರಣ)',
    'Payment & UPI Refund (ಪಾವತಿ & ಮರುಪಾವತಿ)',
    'Damaged in Courier (ಸಾರಿಗೆಯಲ್ಲಿ ಹಾನಿ)',
    'General Inquiry (ಸಾಮಾನ್ಯ ವಿಚಾರಣೆ)'
  ];

  const artisanCategories = [
    'Payment / UPI Fair Share Payout (ಬ್ಯಾಂಕ್ ಪಾವತಿ & ಪಾಲು)',
    'Product Listing & Photo Help (ಕಲಾಕೃತಿ ಪಟ್ಟಿ ಮಾಡುವಲ್ಲಿ ಸಹಾಯ)',
    'Courier / Pickup Delay (ಕೊರಿಯರ್ ಪಿಕಪ್ ವಿಳಂಬ)',
    'Raw Material Sourcing (ಕಚ್ಚಾ ವಸ್ತುಗಳ ಸಮಸ್ಯೆ)',
    'Voice & Kannada App Assistance (ಧ್ವನಿ ಸಹಾಯ & ತಾಂತ್ರಿಕತೆ)'
  ];

  const currentCategories = userRole === 'artisan' ? artisanCategories : buyerCategories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-stone-950/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta-700 via-indigo-900 to-terracotta-800 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={closeCustomerCare}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-1.5">
            <Headphones className="w-4 h-4 text-mustard-300" />
            <span>ಗ್ರಾಹಕ ಸೇವೆ & ಕಲಾಕಾರರ ಸಹಾಯ • Support & Grievance Cell</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Customer Care Helpdesk</span>
          </h2>

          <p className="text-xs sm:text-sm text-cream-100 mt-1 leading-relaxed">
            Fast resolution for Karnataka craft connoisseurs and rural artisans across Dharwad, Udupi & Uttara Kannada.
          </p>

          {/* Role Pill Switcher */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-amber-200 font-medium">I am filing as:</span>
            <div className="bg-black/25 p-1 rounded-xl flex items-center border border-white/20">
              <button
                type="button"
                onClick={() => setUserRole('buyer')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userRole === 'buyer'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buyer (ಖರೀದಿದಾರ)</span>
              </button>

              <button
                type="button"
                onClick={() => setUserRole('artisan')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userRole === 'artisan'
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Artisan (ಕಲಾಕಾರ)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {!ticketData ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* User Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    ನಿಮ್ಮ ಹೆಸರು • Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Parvati Bai / Ananya Rao"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    ಮೊಬೈಲ್ ಅಥವಾ ಇಮೇಲ್ • Mobile / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+91 98451 23450 or name@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Order Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    ವಿಭಾಗ • Complaint Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  >
                    {currentCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    ಆರ್ಡರ್ ಸಂಖ್ಯೆ • Order Ref # (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="e.g. KK-2026-8942"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* VOICE COMPLAINT RECORDING SECTION */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-cream-100 border border-amber-300/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-terracotta-600" />
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      ಧ್ವನಿ ಸಂದೇಶ ದೂರು • Voice Message Complaint
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Kannada & English
                  </span>
                </div>

                <p className="text-xs text-stone-600">
                  Prefer speaking? Tap the mic below to speak your grievance in Kannada or English. It will record your voice note and auto-transcribe it!
                </p>

                {/* Recorder Control Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Mic className="w-4 h-4 text-amber-200" />
                      <span>Start Voice Recording (ಮಾತನಾಡಿ)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm animate-pulse transition-all active:scale-95"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        <span>Stop Recording ({formatTimer(recordingDuration)})</span>
                      </button>
                      <span className="text-xs font-mono text-red-600 font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                        Recording Live...
                      </span>
                    </div>
                  )}

                  {/* Audio Playback Preview if recorded */}
                  {audioUrl && !isRecording && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-cream-300 shadow-xs">
                      <span className="text-xs text-stone-600 font-medium">Recorded Note:</span>
                      <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
                    </div>
                  )}
                </div>
              </div>

              {/* TYPED COMPLAINT SECTION */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>ಲಿಖಿತ ದೂರು ವಿವರ • Typed Complaint Description *</span>
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {complaintText.length} characters
                  </span>
                </div>

                <textarea
                  rows={4}
                  required
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Describe your issue in detail. If you used the voice recording above, your spoken words are automatically transcribed here."
                  className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-300 focus:border-terracotta-500 rounded-2xl text-stone-900 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Ticket...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint / Grievance (ದೂರು ಸಲ್ಲಿಸಿ)</span>
                  </>
                )}
              </button>

            </form>
          ) : (
            /* CONFIRMATION TICKET RECEIPT */
            <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  ದೂರು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ • Complaint Registered
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Ticket #{ticketData.id}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-emerald-200 text-left text-xs space-y-2 max-w-md mx-auto shadow-xs">
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-bold text-stone-900">{ticketData.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-bold text-stone-900">{ticketData.category}</span>
                </div>
                {ticketData.orderRef !== 'N/A' && (
                  <div className="flex justify-between py-1 border-b border-cream-200">
                    <span className="text-stone-500">Order Ref:</span>
                    <span className="font-bold text-stone-900">{ticketData.orderRef}</span>
                  </div>
                )}
                {ticketData.hasVoiceMessage && (
                  <div className="flex justify-between py-1 border-b border-cream-200">
                    <span className="text-stone-500">Voice Note Attached:</span>
                    <span className="font-bold text-emerald-700">✓ Yes ({ticketData.duration})</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-amber-700">{ticketData.status}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Our Karnataka craft ombudsman team will review your case within <strong>24 to 48 hours</strong> and call/email you directly.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                File Another Inquiry / Return
              </button>
            </div>
          )}

          {/* CUSTOMER CARE DIRECT CONTACT INFO SECTION (BELOW FORM AS REQUESTED) */}
          <div className="pt-4 border-t border-cream-200 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mustard-500" />
              <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                Direct Karnataka Craft Helpline & Contacts (ನೇರ ಸಂಪರ್ಕ ವಿವರಗಳು)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Phone Card */}
              <div className="p-3.5 bg-cream-50 border border-cream-300 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Helpline & WhatsApp (ದೂರವಾಣಿ)
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    <a href="tel:+918023456789" className="hover:text-terracotta-600 transition-colors">
                      +91 80 2345 6789
                    </a>
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Toll-Free: <strong>1800-599-4252</strong> (Mon–Sat, 9AM–7PM)
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-3.5 bg-cream-50 border border-cream-300 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Official Support Email (ಇಮೇಲ್)
                  </p>
                  <p className="text-xs font-bold text-stone-900">
                    <a href="mailto:support@karakushala.in" className="hover:text-indigo-600 transition-colors">
                      support@karakushala.in
                    </a>
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Artisans: <strong>sahaya@karakushala.in</strong>
                  </p>
                </div>
              </div>

            </div>

            {/* Operating Address & SLA */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-600 gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                <span>Karnataka Handloom Bhavan, Navalgund & Coastal Center, Udupi</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>24-Hour Redressal Guarantee</span>
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
