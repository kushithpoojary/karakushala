import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  X, 
  XCircle, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  RotateCcw, 
  Volume2, 
  HelpCircle,
  RefreshCw,
  Sparkles,
  Info,
  MapPin,
  Clock,
  IndianRupee,
  MessageSquare,
  Check,
  Wallet,
  CreditCard,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';

export default function OrderCancellationModal({ isOpen, order, onClose, onOrderCancelled }) {
  const { formatINR, showToast, activeUser } = useApp();

  // Step 1: Cancellation Reason Selection
  const [selectedReasonKey, setSelectedReasonKey] = useState('accidental');
  const [customReasonText, setCustomReasonText] = useState('');

  // Step 2: Refund Destination Option
  const [refundMethod, setRefundMethod] = useState('original'); // 'original' | 'wallet'

  // Step 3: Item Selection (for multi-item orders)
  const [cancelEntireOrder, setCancelEntireOrder] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Voice to text states
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN'); // 'en-IN' | 'kn-IN'
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceDetectedOption, setVoiceDetectedOption] = useState(null);

  // Submission & Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelledSuccess, setIsCancelledSuccess] = useState(false);
  const [cancelledResult, setCancelledResult] = useState(null);

  const recognitionRef = useRef(null);

  // Structured Cancellation Reason Options with Keywords for Voice Detection
  const CANCELLATION_OPTIONS = [
    {
      id: 'accidental',
      icon: AlertTriangle,
      title: 'Ordered by mistake / Accidental purchase',
      kannada: 'ಆಕಸ್ಮಿಕವಾಗಿ ಅಥವಾ ತಪ್ಪಾಗಿ ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ',
      desc: 'Placed by mistake, double order, or decided not to purchase.',
      keywords: ['mistake', 'accidental', 'accident', 'wrong', 'by mistake', 'ತಪ್ಪು', 'ಆಕಸ್ಮಿಕ', 'ಬೇಡ']
    },
    {
      id: 'address',
      icon: MapPin,
      title: 'Incorrect delivery address or contact number',
      kannada: 'ತಪ್ಪಾದ ವಿಳಾಸ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      desc: 'Need to change shipping doorstep location or recipient phone.',
      keywords: ['address', 'location', 'phone', 'contact', 'house', 'city', 'ವಿಳಾಸ', 'ಫೋನ್', 'ಜಾಗ']
    },
    {
      id: 'delayed',
      icon: Clock,
      title: 'Delivery time is taking too long',
      kannada: 'ತಲುಪಲು ಹೆಚ್ಚು ಸಮಯ ಬೇಕು / ವಿತರಣೆ ತಡವಾಗಿದೆ',
      desc: 'Estimated delivery timeline does not suit my schedule.',
      keywords: ['delay', 'late', 'long', 'slow', 'urgent', 'time', 'days', 'ತಡ', 'ಸಮಯ', 'ಬೇಗ']
    },
    {
      id: 'craft_change',
      icon: Sparkles,
      title: 'Want to change craft style, motif, or color',
      kannada: 'ಬೇರೆ ಕಲಾಕೃತಿ, ಗಾತ್ರ, ಬಣ್ಣ ಅಥವಾ ಕಸೂತಿ ವಿನ್ಯಾಸ ಬೇಕು',
      desc: 'Wish to select a different Kasuti saree, Beedu lamp, or shell carving.',
      keywords: ['change', 'color', 'size', 'craft', 'motif', 'saree', 'lamp', 'style', 'ಬಣ್ಣ', 'ಗಾತ್ರ', 'ಬೇರೆ']
    },
    {
      id: 'price_payment',
      icon: IndianRupee,
      title: 'Price issue or want to change payment mode',
      kannada: 'ಬೆಲೆ ಅಥವಾ ಪಾವತಿ ವಿಧಾನದಲ್ಲಿ ಬದಲಾವಣೆ ಬೇಕು',
      desc: 'Need to re-order using Cash on Delivery or different UPI/Card.',
      keywords: ['price', 'cost', 'expensive', 'payment', 'upi', 'cod', 'cash', 'ಬೆಲೆ', 'ಪಾವತಿ', 'ಹಣ']
    },
    {
      id: 'other',
      icon: MessageSquare,
      title: 'Other custom reason (Speak or type below)',
      kannada: 'ಇತರ ವೈಯಕ್ತಿಕ ಕಾರಣ (ಧ್ವನಿ ಅಥವಾ ಟೈಪ್ ಮೂಲಕ ತಿಳಿಸಿ)',
      desc: 'Dictate or write your specific reason in detail.',
      keywords: ['other', 'different', 'reason', 'something else', 'ಇತರ', 'ಕಾರಣ']
    }
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLanguage;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interimTrans);

        if (finalTrans) {
          const clean = finalTrans.trim();
          const cleanLower = clean.toLowerCase();

          // 1. Check if the spoken voice matches any cancellation option keywords!
          let matchedOption = null;
          for (const opt of CANCELLATION_OPTIONS) {
            const hasKeyword = opt.keywords.some(kw => cleanLower.includes(kw));
            if (hasKeyword) {
              matchedOption = opt;
              break;
            }
          }

          if (matchedOption) {
            setSelectedReasonKey(matchedOption.id);
            setVoiceDetectedOption(matchedOption.title);
            showToast(`🎙️ Voice detected: "${matchedOption.title}"`, 'success');
          }

          // 2. Append transcription to custom reason text box
          setCustomReasonText(prev => (prev ? `${prev.trim()} ${clean}` : clean));
          setInterimTranscript('');

          // 3. Audio confirmation
          if ('speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const utt = new SpeechSynthesisUtterance(matchedOption ? `Selected ${matchedOption.title}` : 'Voice transcribed');
              utt.rate = 1.1;
              window.speechSynthesis.speak(utt);
            } catch (e) {}
          }
        }
      };

      rec.onerror = (event) => {
        console.warn('Speech recognition error in cancellation modal:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          showToast('Microphone access was denied. Please allow microphone permissions in browser.', 'warning');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please speak clearly into your mic.', 'info');
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = rec;
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    };
  }, [selectedLanguage, showToast]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && order) {
      setSelectedReasonKey('accidental');
      setCustomReasonText('');
      setRefundMethod('original');
      setCancelEntireOrder(true);
      setSelectedItemIds((order.items || []).map((_, i) => i));
      setInterimTranscript('');
      setVoiceDetectedOption(null);
      setIsSubmitting(false);
      setIsCancelledSuccess(false);
      setCancelledResult(null);
    } else {
      if (isListening) {
        try {
          recognitionRef.current?.stop();
        } catch (e) {}
        setIsListening(false);
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const toggleListening = () => {
    if (!speechSupported) {
      showToast('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = selectedLanguage;
          recognitionRef.current.start();
          showToast(
            selectedLanguage === 'kn-IN'
              ? '🎙️ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... Listening in Kannada...'
              : '🎙️ Speak your cancellation option or reason...',
            'info'
          );
        }
      } catch (err) {
        console.error('Error starting recognition:', err);
        showToast('Could not access microphone.', 'error');
      }
    }
  };

  const handleConfirmCancel = async () => {
    const selectedOpt = CANCELLATION_OPTIONS.find(o => o.id === selectedReasonKey);
    const reasonParts = [];
    if (selectedOpt) {
      reasonParts.push(selectedOpt.title);
    }
    if (customReasonText.trim()) {
      reasonParts.push(`Notes: ${customReasonText.trim()}`);
    }
    if (refundMethod === 'wallet') {
      reasonParts.push('Settlement: Store Credit Wallet (+ ₹100 Bonus)');
    } else {
      reasonParts.push('Settlement: Refund to Original Payment Source');
    }

    const finalReason = reasonParts.join(' | ') || 'Customer requested order cancellation';
    setIsSubmitting(true);

    try {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }

      const cancelled = await api.cancelOrder(order.id, {
        reason: finalReason,
        cancelledBy: activeUser?.name || 'Customer'
      });

      setCancelledResult(cancelled);
      setIsCancelledSuccess(true);
      showToast(`Order ${order.orderNumber} successfully cancelled!`, 'success');

      if (onOrderCancelled) {
        onOrderCancelled(cancelled);
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      showToast(err.message || 'Failed to cancel order. Please contact support.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCod = (order.paymentMethod || '').toLowerCase().includes('cod') ||
                (order.paymentMethod || '').toLowerCase().includes('cash on delivery') ||
                (order.paymentStatus || '').toLowerCase().includes('unpaid') ||
                (order.paymentStatus || '').toLowerCase().includes('delivery');

  const selectedOptionObj = CANCELLATION_OPTIONS.find(o => o.id === selectedReasonKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 via-cream-50 to-amber-50 px-6 py-4 sm:py-5 border-b border-cream-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                  Order Cancellation • ಆಯ್ಕೆಗಳು
                </span>
                <span className="font-mono text-xs font-bold text-indigo-950">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                {isCancelledSuccess ? 'Order Cancellation Completed' : 'Select Cancellation Options'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-cream-200 text-stone-500 hover:text-stone-900 flex items-center justify-center border border-cream-300 transition-colors shadow-xs"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {isCancelledSuccess ? (
            /* SUCCESS STATE */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl border border-emerald-200 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Order Successfully Cancelled
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your cancellation options for order <strong className="font-mono text-indigo-950">{order.orderNumber}</strong> have been processed. Artisan crafting has been stopped, raw materials have been returned to inventory, and your refund has been scheduled.
                </p>
              </div>

              {/* Settlement Card */}
              <div className="bg-cream-50 rounded-2xl p-4 sm:p-5 border border-cream-200 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-stone-600 font-semibold">Refund Amount:</span>
                  <span className="font-serif text-lg font-bold text-emerald-800">
                    {formatINR(order.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Cancellation Reason Selected:</span>
                  <span className="font-bold text-stone-900 text-right">{selectedOptionObj?.title}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Refund Method:</span>
                  <span className="font-bold text-indigo-950">
                    {isCod 
                      ? '✓ Cash on Delivery Voided (₹0 Payable)' 
                      : refundMethod === 'wallet' 
                      ? '✓ KaraKushala Store Credit Wallet (+ ₹100 Bonus)' 
                      : `✓ Original ${order.paymentMethod || 'UPI'} Account (1-2 Days)`}
                  </span>
                </div>

                {customReasonText && (
                  <div className="pt-2 border-t border-cream-200 text-stone-600">
                    <span className="font-semibold block">Spoken / Custom Notes:</span>
                    <p className="italic text-stone-800 mt-0.5">"{customReasonText}"</p>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-indigo-950 hover:bg-terracotta-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md active:scale-95"
              >
                Close & Return to Orders (ಮುಕ್ತಾಯ)
              </button>
            </div>
          ) : (
            /* STEP-BY-STEP CANCELLATION OPTIONS */
            <div className="space-y-6">

              {/* Order Quick Summary Header */}
              <div className="bg-gradient-to-r from-cream-100 to-amber-50/50 p-4 rounded-2xl border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Order To Cancel:
                  </span>
                  <strong className="font-mono text-sm font-black text-indigo-950">
                    {order.orderNumber}
                  </strong>
                  <span className="text-stone-500 block text-[11px]">
                    Status: <strong className="text-terracotta-700">{order.orderStatus}</strong> • {(order.items || []).length} craft item(s)
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Refundable Value:
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-terracotta-700">
                    {formatINR(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {isCod ? 'Cash on Delivery' : 'Prepaid (Direct Escrow)'}
                  </span>
                </div>
              </div>

              {/* VOICE ASSISTANT BANNER FOR OPTIONS */}
              <div className="bg-indigo-950 text-white p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-cream-100 flex items-center gap-1.5">
                        <span>Voice-to-Text Cancellation Assistant</span>
                        <span className="text-[10px] text-amber-300 font-sans font-normal">(ಧ್ವನಿ ಮೂಲಕ ಆಯ್ಕೆಮಾಡಿ)</span>
                      </h4>
                      <p className="text-[11px] text-stone-300">
                        Speak your cancellation option or dictate reason in English or Kannada!
                      </p>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-indigo-900/90 p-1 rounded-xl border border-indigo-800 text-[11px] font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('en-IN')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedLanguage === 'en-IN'
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('kn-IN')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedLanguage === 'kn-IN'
                          ? 'bg-terracotta-500 text-white shadow-xs'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                {/* Microphone Trigger Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 border ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 animate-pulse ring-4 ring-red-400/30'
                      : 'bg-white hover:bg-amber-100 text-indigo-950 border-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-bounce" />
                      <span>🎙️ Listening... Speak Now (ನಿಮ್ಮ ಕಾರಣ ಹೇಳಿ - Click to Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-terracotta-600" />
                      <span>
                        {selectedLanguage === 'kn-IN'
                          ? '🎙️ ಧ್ವನಿ ಮೂಲಕ ಆಯ್ಕೆ ತಿಳಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ (Speak Cancellation Reason)'
                          : '🎙️ Click to Speak Cancellation Reason (Voice Selection)'}
                      </span>
                    </>
                  )}
                </button>

                {voiceDetectedOption && (
                  <div className="text-[11px] text-amber-300 bg-indigo-900/80 px-3 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Auto-selected from voice: <strong>{voiceDetectedOption}</strong></span>
                  </div>
                )}
              </div>

              {/* SECTION 1: CANCELLATION REASON OPTIONS (RADIO CARDS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>1. Why do you want to cancel this order?</span>
                    <span className="text-terracotta-700 font-semibold">(ರದ್ದತಿಗೆ ಆಯ್ಕೆಗಳು)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-stone-500 font-medium">Select an option:</span>
                </div>

                {/* Option Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CANCELLATION_OPTIONS.map((opt) => {
                    const IconComponent = opt.icon;
                    const isSelected = selectedReasonKey === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedReasonKey(opt.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left relative ${
                          isSelected
                            ? 'bg-amber-50/80 border-terracotta-500 shadow-sm ring-2 ring-terracotta-200'
                            : 'bg-white hover:bg-cream-50 border-cream-200 hover:border-cream-400'
                        }`}
                      >
                        {/* Radio Check Circle */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'border-terracotta-600 bg-terracotta-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-terracotta-700' : 'text-stone-500'}`} />
                            <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-950' : 'text-stone-800'}`}>
                              {opt.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-terracotta-700 font-semibold block mt-0.5">
                            {opt.kannada}
                          </span>
                          <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VOICE-TO-TEXT ADDITIONAL NOTES / REMARKS BOX */}
              <div className="space-y-2 bg-cream-50 p-4 rounded-2xl border border-cream-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                    <span>Additional Remarks or Voice Notes (ಐಚ್ಛಿಕ ವಿವರಣೆ)</span>
                  </label>
                  {customReasonText && (
                    <button
                      type="button"
                      onClick={() => setCustomReasonText('')}
                      className="text-[11px] text-stone-400 hover:text-red-600 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    placeholder={
                      selectedLanguage === 'kn-IN'
                        ? 'ಧ್ವನಿ ಮೂಲಕ ಹೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ಬಣ್ಣ ಬದಲಾಯಿಸಬೇಕು, ವಿಳಾಸ ತಪ್ಪಾಗಿದೆ...)'
                        : 'Speak with microphone or type additional notes (transcribed in real time)...'
                    }
                    className={`w-full bg-white p-3 text-xs rounded-xl border transition-all resize-none focus:outline-none focus:ring-2 ${
                      isListening
                        ? 'border-red-400 ring-2 ring-red-200 bg-red-50/20'
                        : 'border-cream-300 focus:border-terracotta-500 focus:ring-terracotta-200'
                    }`}
                  />

                  {isListening && (
                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      <span>{interimTranscript ? `"${interimTranscript}"` : 'Listening...'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: REFUND DESTINATION OPTIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>2. How would you like your refund settled?</span>
                    <span className="text-terracotta-700 font-semibold">(ಮರುಪಾವತಿ ಆಯ್ಕೆ)</span>
                  </label>
                </div>

                {isCod ? (
                  /* COD notice */
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs flex items-center gap-3 text-amber-900">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold">Cash on Delivery Order</p>
                      <p className="text-[11px] text-amber-800">
                        No advance amount was collected. Your order liability will be cleared to ₹0 and delivery stopped.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Prepaid Refund Choice Cards */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    {/* Option 1: Original Payment Source */}
                    <div
                      onClick={() => setRefundMethod('original')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left ${
                        refundMethod === 'original'
                          ? 'bg-amber-50/80 border-terracotta-500 shadow-sm ring-2 ring-terracotta-200'
                          : 'bg-white hover:bg-cream-50 border-cream-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        refundMethod === 'original'
                          ? 'border-terracotta-600 bg-terracotta-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {refundMethod === 'original' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-600" />
                          <h4 className="text-xs font-bold text-stone-900">
                            Original Payment Source
                          </h4>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Refund credited to your source UPI/Bank account within 24-48 hours.
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                          Full 100% Refund: {formatINR(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Option 2: Instant KaraKushala Wallet Credit with Perk */}
                    <div
                      onClick={() => setRefundMethod('wallet')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left ${
                        refundMethod === 'wallet'
                          ? 'bg-amber-50/80 border-terracotta-500 shadow-sm ring-2 ring-terracotta-200'
                          : 'bg-white hover:bg-cream-50 border-cream-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        refundMethod === 'wallet'
                          ? 'border-terracotta-600 bg-terracotta-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {refundMethod === 'wallet' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-terracotta-600" />
                          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1">
                            <span>Instant Craft Credit Wallet</span>
                            <span className="bg-terracotta-100 text-terracotta-800 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                              +₹100 Perk
                            </span>
                          </h4>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Instant credit + ₹100 Karnataka rural craft support bonus for your next order.
                        </p>
                        <span className="text-[10px] font-bold text-terracotta-700 block mt-1">
                          Total Value: {formatINR(Number(order.totalAmount) + 100)}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-stone-500">
                  <span>Selected Option: </span>
                  <strong className="text-stone-800">{selectedOptionObj?.title}</strong>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 text-xs font-semibold transition-colors disabled:opacity-50 touch-target"
                  >
                    Keep Order (ಬೇಡ, ಹಾಗೆಯೇ ಇರಲಿ)
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 touch-target"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Cancellation...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Confirm Cancellation (ಆರ್ಡರ್ ರದ್ದುಮಾಡಿ)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}