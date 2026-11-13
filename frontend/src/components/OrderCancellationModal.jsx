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
  Info
} from 'lucide-react';

export default function OrderCancellationModal({ isOpen, order, onClose, onOrderCancelled }) {
  const { formatINR, showToast, activeUser } = useApp();

  const [reason, setReason] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN'); // 'en-IN' or 'kn-IN'
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelledSuccess, setIsCancelledSuccess] = useState(false);
  const [cancelledResult, setCancelledResult] = useState(null);

  const recognitionRef = useRef(null);

  const QUICK_REASONS = [
    { en: 'Placed order by mistake', kn: 'ತಪ್ಪಾಗಿ ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ' },
    { en: 'Need to change delivery address', kn: 'ವಿಳಾಸ ಬದಲಾಯಿಸಬೇಕು' },
    { en: 'Delivery time is too long', kn: 'ತಲುಪಲು ಹೆಚ್ಚು ಸಮಯ ಬೇಕು' },
    { en: 'Ordered wrong craft / size / color', kn: 'ತಪ್ಪು ವಸ್ತು ಅಥವಾ ಗಾತ್ರ' },
    { en: 'Found alternative craft item', kn: 'ಬೇರೆ ಕಲಾಕೃತಿ ಬೇಕು' },
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
          setReason(prev => (prev ? `${prev.trim()} ${clean}` : clean));
          setInterimTranscript('');

          // Voice audio confirmation
          if ('speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const utt = new SpeechSynthesisUtterance('Reason noted');
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
          showToast('Microphone access was denied. Please allow microphone permissions.', 'warning');
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

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setInterimTranscript('');
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
  }, [isOpen]);

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
              : '🎙️ Speak your reason... Listening in English...',
            'info'
          );
        }
      } catch (err) {
        console.error('Error starting recognition:', err);
        showToast('Could not access microphone.', 'error');
      }
    }
  };

  const handleApplyQuickReason = (r) => {
    const text = selectedLanguage === 'kn-IN' ? r.kn : r.en;
    setReason(prev => {
      if (!prev) return text;
      if (prev.includes(text)) return prev;
      return `${prev}, ${text}`;
    });
  };

  const handleConfirmCancel = async () => {
    const finalReason = reason.trim() || 'Order cancelled upon customer request';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-50 via-cream-50 to-amber-50 px-6 py-5 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                  Cancel Order • ರದ್ದುಮಾಡಿ
                </span>
                <span className="font-mono text-xs font-bold text-indigo-950">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                {isCancelledSuccess ? 'Order Cancellation Confirmed' : 'Cancel Handcrafted Order'}
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
        <div className="p-6 overflow-y-auto space-y-6">
          
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
                  Your cancellation request for order <strong className="font-mono text-indigo-950">{order.orderNumber}</strong> has been confirmed. The artisan has been notified to halt handcrafting, and reserved materials have been restocked.
                </p>
              </div>

              {/* Refund Summary Card */}
              <div className="bg-cream-50 rounded-2xl p-4 border border-cream-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-stone-500">Refund Amount:</span>
                  <span className="font-serif text-base font-bold text-emerald-800">
                    {formatINR(order.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Payment Mode:</span>
                  <span className="font-semibold text-stone-900">{order.paymentMethod || 'UPI Instant'}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Refund Status:</span>
                  <span className="font-bold text-emerald-700">
                    {isCod ? '✓ COD Liability Cleared (₹0 Due)' : '✓ Full UPI Reversal Initiated'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Reason Recorded:</span>
                  <span className="italic text-stone-700 max-w-xs truncate">
                    "{reason.trim() || 'Customer requested cancellation'}"
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-indigo-950 hover:bg-terracotta-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md active:scale-95"
              >
                Close & Return to Orders (ಮುಕ್ತಾಯ)
              </button>
            </div>
          ) : (
            /* CANCELLATION FORM */
            <div className="space-y-5">
              
              {/* Caution Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">
                    Are you sure you want to cancel this craft order?
                  </p>
                  <p className="text-amber-800 leading-relaxed">
                    Once cancelled, the master weaver/artisan will stop fabric cutting and natural dye preparation immediately. 
                    {isCod 
                      ? ' You will not be charged anything upon delivery.' 
                      : ` Full payment of ${formatINR(order.totalAmount)} will be refunded back to your source account within 1-2 business days.`}
                  </p>
                </div>
              </div>

              {/* Order Mini Summary */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-500 pb-1.5 border-b border-cream-200 font-mono">
                  <span>Order # {order.orderNumber}</span>
                  <span className="font-sans font-bold text-indigo-950">
                    Current Status: {order.orderStatus}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-stone-800">
                      <span className="truncate max-w-[280px]">
                        • {item.title} <span className="text-stone-400">×{item.quantity}</span>
                      </span>
                      <span className="font-serif font-bold text-stone-900">
                        {formatINR((item.priceAtPurchase || item.price) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-cream-200 font-bold text-indigo-950">
                  <span>Refundable Total:</span>
                  <span className="font-serif text-sm text-terracotta-700">{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              {/* VOICE TO TEXT CONVERTER SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <span>Reason for Cancellation</span>
                    <span className="text-terracotta-700 font-medium">(ರದ್ದತಿಗೆ ಕಾರಣ)</span>
                    <span className="text-red-500">*</span>
                  </label>

                  {/* Language Selector for Speech Recognition */}
                  <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-xl border border-cream-300 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('en-IN')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
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
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedLanguage === 'kn-IN'
                          ? 'bg-terracotta-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      ಕನ್ನಡ (Kannada)
                    </button>
                  </div>
                </div>

                {/* Big Voice Converter Trigger Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 border ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 animate-pulse ring-4 ring-red-100'
                        : 'bg-cream-100 hover:bg-amber-100 text-indigo-950 border-cream-300 hover:border-amber-400'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 animate-bounce" />
                        <span>🎙️ Listening... Click to Stop (ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-terracotta-600" />
                        <span>
                          {selectedLanguage === 'kn-IN' 
                            ? '🎙️ ಧ್ವನಿ ಮೂಲಕ ಕಾರಣ ಹೇಳಿ (Speak in Kannada)' 
                            : '🎙️ Speak Reason to Convert to Text (Voice Input)'}
                        </span>
                      </>
                    )}
                  </button>

                  {reason && (
                    <button
                      type="button"
                      onClick={() => setReason('')}
                      className="px-3 py-2.5 text-stone-500 hover:text-red-600 rounded-2xl border border-cream-300 hover:bg-red-50 text-xs font-semibold transition-colors"
                      title="Clear reason"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Voice-to-Text Input Area */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={
                      selectedLanguage === 'kn-IN'
                        ? 'ಧ್ವನಿ ಮೂಲಕ ಹೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ತಪ್ಪಾಗಿ ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ, ವಿಳಾಸ ಬದಲಾಯಿಸಬೇಕು...)'
                        : 'Speak with microphone or type your reason (e.g., "Placed by mistake", "Want different color", "Need to change shipping address")...'
                    }
                    className={`w-full bg-white p-3.5 text-xs sm:text-sm rounded-2xl border transition-all resize-none focus:outline-none focus:ring-2 ${
                      isListening
                        ? 'border-red-400 ring-2 ring-red-200 bg-red-50/20'
                        : 'border-cream-300 focus:border-terracotta-500 focus:ring-terracotta-200'
                    }`}
                  />

                  {/* Listening Indicator Overlay at bottom of textarea */}
                  {isListening && (
                    <div className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-full border border-red-200 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      <span>{interimTranscript ? `Heard: "${interimTranscript}"` : 'Recording voice...'}</span>
                    </div>
                  )}
                </div>

                {/* Quick Selection Preset Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 font-semibold block">
                    Or select a common reason (ತ್ವರಿತ ಆಯ್ಕೆ):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_REASONS.map((r, i) => {
                      const label = selectedLanguage === 'kn-IN' ? r.kn : r.en;
                      const isSelected = reason.includes(label);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplyQuickReason(r)}
                          className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-terracotta-100 text-terracotta-900 border-terracotta-300 font-bold'
                              : 'bg-white hover:bg-cream-100 text-stone-700 border-cream-300'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 text-xs font-semibold transition-colors disabled:opacity-50 touch-target"
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
          )}

        </div>

      </div>
    </div>
  );
}