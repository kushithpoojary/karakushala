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
  RefreshCw,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  MessageSquare,
  Check,
  Wallet,
  CreditCard,
  ShieldCheck,
  CheckSquare,
  Square,
  FileText
} from 'lucide-react';

export default function OrderCancellationModal({ isOpen, order, onClose, onOrderCancelled }) {
  const { formatINR, showToast, activeUser } = useApp();

  // Different reasons list for cancellation
  const CANCELLATION_REASONS = [
    {
      id: 'mistake',
      title: 'Placed order by mistake / Accidental order',
      kannada: 'ಆಕಸ್ಮಿಕವಾಗಿ ಅಥವಾ ತಪ್ಪಾಗಿ ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ',
      desc: 'Accidental click, duplicate order, or changed mind.',
      keywords: ['mistake', 'accidental', 'accident', 'wrong', 'duplicate', 'ತಪ್ಪು', 'ಆಕಸ್ಮಿಕ', 'ಬೇಡ']
    },
    {
      id: 'delivery_delay',
      title: 'Delivery time is too long / Delayed arrival',
      kannada: 'ತಲುಪಲು ಹೆಚ್ಚು ಸಮಯ ಬೇಕು / ವಿತರಣೆ ತಡವಾಗಿದೆ',
      desc: 'Estimated arrival date is too late for my requirement.',
      keywords: ['delay', 'late', 'long', 'slow', 'urgent', 'time', 'days', 'hours', 'ತಡ', 'ಸಮಯ', 'ಬೇಗ']
    },
    {
      id: 'address_change',
      title: 'Incorrect delivery address or contact number',
      kannada: 'ತಪ್ಪಾದ ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ',
      desc: 'Need to change delivery location, door number, or phone.',
      keywords: ['address', 'location', 'phone', 'contact', 'city', 'pincode', 'ವಿಳಾಸ', 'ಫೋನ್', 'ಜಾಗ']
    },
    {
      id: 'item_change',
      title: 'Want to change craft, style, color or size',
      kannada: 'ಬೇರೆ ಕಲಾಕೃತಿ, ಗಾತ್ರ, ಬಣ್ಣ ಅಥವಾ ವಿನ್ಯಾಸ ಬೇಕು',
      desc: 'Wish to select a different Kasuti saree, Beedu weave, or craft.',
      keywords: ['change', 'color', 'size', 'motif', 'saree', 'craft', 'style', 'ಬಣ್ಣ', 'ಗಾತ್ರ', 'ಬೇರೆ']
    },
    {
      id: 'price_issue',
      title: 'Price or shipping cost issue / Found better deal',
      kannada: 'ಬೆಲೆ ಅಥವಾ ಶಿಪ್ಪಿಂಗ್ ವೆಚ್ಚದ ಸಮಸ್ಯೆ / ಬೇರೆ ಕಡೆ ಸಿಕ್ಕಿದೆ',
      desc: 'Found alternative at lower price or budget changed.',
      keywords: ['price', 'cost', 'expensive', 'deal', 'cheap', 'budget', 'ಬೆಲೆ', 'ಹಣ']
    },
    {
      id: 'payment_issue',
      title: 'Payment method issue / Change to COD or UPI',
      kannada: 'ಪಾವತಿ ವಿಧಾನದಲ್ಲಿ ಸಮಸ್ಯೆ / COD ಅಥವಾ UPI ಬದಲಾವಣೆ',
      desc: 'Want to re-order using a different payment option.',
      keywords: ['payment', 'upi', 'cod', 'cash', 'card', 'bank', 'gpay', 'phonepe', 'ಪಾವತಿ']
    },
    {
      id: 'other',
      title: 'Other reason (Specify with voice or typing)',
      kannada: 'ಇತರ ಕಾರಣ (ಧ್ವನಿ ಅಥವಾ ಟೈಪ್ ಮೂಲಕ ತಿಳಿಸಿ)',
      desc: 'Speak or type any specific reason in the box below.',
      keywords: ['other', 'different', 'reason', 'something else', 'ಇತರ', 'ಕಾರಣ']
    }
  ];

  // Selected reason state
  const [selectedReason, setSelectedReason] = useState('mistake');
  const [reasonDetails, setReasonDetails] = useState('');

  // Refund option state
  const [refundOption, setRefundOption] = useState('original'); // 'original' | 'wallet'

  // Voice-to-text states
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN'); // 'en-IN' | 'kn-IN'
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelledSuccess, setIsCancelledSuccess] = useState(false);
  const [cancelledResult, setCancelledResult] = useState(null);

  // Convert spoken words to text and numbers
  // Handles number words (e.g., "two", "ten", "five hundred") and converts to numbers if spoken
  const parseSpeechToTextAndNumbers = (text) => {
    if (!text) return '';

    const numWordMap = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
      'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
      'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000',
      'lakh': '100000', 'lakhs': '100000'
    };

    const tokens = text.split(/\s+/);
    const converted = tokens.map(token => {
      const clean = token.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (numWordMap[clean] !== undefined) {
        return numWordMap[clean];
      }
      return token;
    });

    return converted.join(' ');
  };

  // Check Web Speech API availability
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // Voice recognition trigger function
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser. Please use Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        showToast(
          selectedLanguage === 'kn-IN'
            ? '🎙️ ಧ್ವನಿ ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ (Listening in Kannada)...'
            : '🎙️ Listening... Speak your reason or numbers clearly...',
          'info'
        );
      };

      recognition.onresult = (event) => {
        const rawTranscript = event.results[0][0].transcript;
        if (!rawTranscript) {
          setIsListening(false);
          return;
        }

        // Convert spoken voice directly into text and numbers!
        const parsed = parseSpeechToTextAndNumbers(rawTranscript.trim());

        // Update the reason details input box directly!
        setReasonDetails(prev => (prev ? `${prev.trim()} ${parsed}` : parsed));

        // Smart check: If spoken text mentions any of the reason options, auto-select it!
        const lower = rawTranscript.toLowerCase();
        for (const opt of CANCELLATION_REASONS) {
          const matchedKeyword = opt.keywords.some(kw => lower.includes(kw));
          if (matchedKeyword) {
            setSelectedReason(opt.id);
            break;
          }
        }

        showToast(`🎙️ Converted to text/numbers: "${parsed}"`, 'success');
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error in cancellation modal:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please allow microphone in browser.', 'warning');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please speak into the mic.', 'info');
        } else {
          showToast('Could not convert voice. Please try speaking again or type.', 'info');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  // Reset state on open/close
  useEffect(() => {
    if (isOpen && order) {
      setSelectedReason('mistake');
      setReasonDetails('');
      setRefundOption('original');
      setIsSubmitting(false);
      setIsCancelledSuccess(false);
      setCancelledResult(null);
    } else {
      if (isListening) {
        try { recognitionRef.current?.stop(); } catch (e) {}
        setIsListening(false);
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const isCod = (order.paymentMethod || '').toLowerCase().includes('cod') ||
                (order.paymentMethod || '').toLowerCase().includes('cash on delivery') ||
                (order.paymentStatus || '').toLowerCase().includes('unpaid') ||
                (order.paymentStatus || '').toLowerCase().includes('delivery');

  const selectedReasonObj = CANCELLATION_REASONS.find(r => r.id === selectedReason);

  // Submit cancellation
  const handleConfirmCancel = async () => {
    const reasonParts = [];
    if (selectedReasonObj) {
      reasonParts.push(selectedReasonObj.title);
    }
    if (reasonDetails.trim()) {
      reasonParts.push(`Details: ${reasonDetails.trim()}`);
    }
    if (!isCod) {
      reasonParts.push(refundOption === 'wallet' ? 'Settlement: Store Credit (+₹100 bonus)' : 'Settlement: Original payment source');
    }

    const finalCancellationReason = reasonParts.join(' | ') || 'Customer requested order cancellation';
    setIsSubmitting(true);

    try {
      if (isListening) {
        try { recognitionRef.current?.stop(); } catch (e) {}
        setIsListening(false);
      }

      const cancelled = await api.cancelOrder(order.id, {
        reason: finalCancellationReason,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 via-cream-50 to-amber-50 px-6 py-4 sm:py-5 border-b border-cream-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                  Cancel Order • ಕಾರಣಗಳು
                </span>
                <span className="font-mono text-xs font-bold text-indigo-950">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                {isCancelledSuccess ? 'Order Cancellation Confirmed' : 'Select Reason to Cancel Order'}
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">

          {isCancelledSuccess ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl border border-emerald-200 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Order Successfully Cancelled
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your cancellation request for order <strong className="font-mono text-indigo-950">{order.orderNumber}</strong> has been processed. Artisan crafting has been stopped, raw materials have been restocked into catalogue, and refund has been recorded.
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
                  <span>Cancellation Reason:</span>
                  <span className="font-bold text-stone-900 text-right">{selectedReasonObj?.title}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Refund Method:</span>
                  <span className="font-bold text-indigo-950">
                    {isCod 
                      ? '✓ Cash on Delivery Cancelled (₹0 Due)' 
                      : refundOption === 'wallet' 
                      ? '✓ KaraKushala Store Credit Wallet (+ ₹100 Bonus)' 
                      : `✓ Original ${order.paymentMethod || 'UPI'} Account (1-2 Days)`}
                  </span>
                </div>

                {reasonDetails && (
                  <div className="pt-2 border-t border-cream-200 text-stone-600">
                    <span className="font-semibold block">Notes / Numbers Transcribed:</span>
                    <p className="italic text-stone-800 mt-0.5">"{reasonDetails}"</p>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-indigo-950 hover:bg-terracotta-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md active:scale-95"
              >
                Close & View My Orders (ಮುಕ್ತಾಯ)
              </button>
            </div>
          ) : (
            /* ACTIVE CANCELLATION FLOW */
            <div className="space-y-5">
              
              {/* Order Mini Info Card */}
              <div className="bg-gradient-to-r from-cream-100 to-amber-50/50 p-4 rounded-2xl border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Order Reference:
                  </span>
                  <strong className="font-mono text-sm font-black text-indigo-950">
                    {order.orderNumber}
                  </strong>
                  <span className="text-stone-500 block text-[11px]">
                    Status: <strong className="text-terracotta-700">{order.orderStatus}</strong> • {(order.items || []).length} item(s)
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Refund Amount:
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-terracotta-700">
                    {formatINR(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {isCod ? 'Cash on Delivery' : 'Prepaid (Direct Escrow)'}
                  </span>
                </div>
              </div>

              {/* SECTION 1: ASKING DIFFERENT CANCELLATION REASONS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>1. Please select a reason for cancellation</span>
                    <span className="text-terracotta-700 font-semibold">(ರದ್ದತಿಗೆ ಕಾರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-500">Choose one:</span>
                </div>

                {/* List of Different Reasons (Selectable Radio Cards) */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {CANCELLATION_REASONS.map((r) => {
                    const isSelected = selectedReason === r.id;

                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReason(r.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-50/80 border-terracotta-500 shadow-sm ring-1 ring-terracotta-200'
                            : 'bg-white hover:bg-cream-50 border-cream-200'
                        }`}
                      >
                        {/* Radio Dot */}
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'border-terracotta-600 bg-terracotta-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-stone-800'}`}>
                            {r.title}
                          </h4>
                          <span className="text-[10px] text-terracotta-700 font-semibold block">
                            {r.kannada}
                          </span>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {r.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: VOICE TO TEXT / NUMBERS CONVERTER BOX */}
              <div className="space-y-2 bg-gradient-to-br from-cream-50 to-amber-50/40 p-4 rounded-2xl border border-cream-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-terracotta-600" />
                    <span>2. Speak or Type Reason / Numbers</span>
                    <span className="text-terracotta-700 font-semibold">(ಧ್ವನಿ ಅಥವಾ ಸಂಖ್ಯೆಗಳನ್ನು ಹೇಳಿ)</span>
                  </label>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-cream-300 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('en-IN')}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        selectedLanguage === 'en-IN'
                          ? 'bg-indigo-950 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('kn-IN')}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        selectedLanguage === 'kn-IN'
                          ? 'bg-terracotta-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600">
                  Click the mic to speak. Your voice is directly converted into text and numbers (e.g., reason, phone number, pin code, or days) right inside the box:
                </p>

                {/* Input Textarea with Integrated Voice Button */}
                <div className="relative">
                  <textarea
                    rows={2}
                    value={reasonDetails}
                    onChange={(e) => setReasonDetails(e.target.value)}
                    placeholder={
                      selectedLanguage === 'kn-IN'
                        ? 'ಧ್ವನಿ ಮೂಲಕ ಹೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ೨ ದಿನ ತಡವಾಗಿದೆ, ವಿಳಾಸ ತಪ್ಪಾಗಿದೆ, ೯೮೪೫೧೨೩೪೫೦...)'
                        : 'Click mic to speak or type (e.g. "Ordered 2 items by mistake", "delayed by 3 days", "phone 9880123456")...'
                    }
                    className={`w-full bg-white pl-3.5 pr-24 py-3 text-xs sm:text-sm rounded-xl border transition-all resize-none focus:outline-none focus:ring-2 ${
                      isListening
                        ? 'border-red-400 ring-2 ring-red-200 bg-red-50/20'
                        : 'border-cream-300 focus:border-terracotta-500 focus:ring-terracotta-200'
                    }`}
                  />

                  {/* Right side Voice Button inside the box */}
                  <div className="absolute right-2 top-2.5 flex items-center gap-1.5">
                    {reasonDetails && (
                      <button
                        type="button"
                        onClick={() => setReasonDetails('')}
                        className="text-[10px] text-stone-400 hover:text-red-600 font-bold px-1.5 py-1 rounded hover:bg-cream-100"
                        title="Clear"
                      >
                        Clear
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-90 border ${
                        isListening
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 animate-pulse ring-2 ring-red-300'
                          : 'bg-terracotta-600 hover:bg-terracotta-700 text-white border-terracotta-600'
                      }`}
                      title={isListening ? 'Click to stop listening' : 'Click to speak (Voice to Text/Number)'}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4 animate-bounce" />
                          <span className="text-[10px]">Listening...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span className="text-[10px]">Voice</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct quick action chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="text-stone-400 font-medium">Quick add:</span>
                  {[
                    'Placed by mistake',
                    '2 days late',
                    'Change address',
                    'Wrong size/color'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setReasonDetails(prev => (prev ? `${prev}, ${chip}` : chip))}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-cream-200 border border-cream-300 text-stone-700 text-[10px] font-semibold transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: REFUND METHOD (IF PREPAID) */}
              {!isCod && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>3. Refund Settlement Option</span>
                    <span className="text-terracotta-700 font-semibold">(ಮರುಪಾವತಿ ಆಯ್ಕೆ)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      onClick={() => setRefundOption('original')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        refundOption === 'original'
                          ? 'bg-amber-50/80 border-terracotta-500 ring-1 ring-terracotta-200'
                          : 'bg-white hover:bg-cream-50 border-cream-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        refundOption === 'original'
                          ? 'border-terracotta-600 bg-terracotta-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {refundOption === 'original' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <strong className="text-stone-900 block">Original UPI / Bank Source</strong>
                        <span className="text-[11px] text-stone-600 block">
                          Full refund of {formatINR(order.totalAmount)} credited in 24–48 hours.
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => setRefundOption('wallet')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        refundOption === 'wallet'
                          ? 'bg-amber-50/80 border-terracotta-500 ring-1 ring-terracotta-200'
                          : 'bg-white hover:bg-cream-50 border-cream-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        refundOption === 'wallet'
                          ? 'border-terracotta-600 bg-terracotta-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {refundOption === 'wallet' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <strong className="text-stone-900 flex items-center gap-1">
                          <span>KaraKushala Wallet Credit</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded">
                            +₹100 Bonus
                          </span>
                        </strong>
                        <span className="text-[11px] text-stone-600 block">
                          Instant credit: {formatINR(Number(order.totalAmount) + 100)} for next order.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-3 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-stone-500">
                  <span>Selected Reason: </span>
                  <strong className="text-stone-900">{selectedReasonObj?.title}</strong>
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
                        <span>Cancelling Order...</span>
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