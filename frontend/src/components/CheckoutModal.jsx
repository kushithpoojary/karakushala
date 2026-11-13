import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  X, 
  CheckCircle, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  HeartHandshake, 
  User, 
  Clock, 
  Smartphone, 
  Send, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  Lock, 
  Bell, 
  HelpCircle,
  Banknote
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    clearCart,
    formatINR,
    showToast,
    setLatestOrderReceipt,
    activeUser,
    navigateToTrackOrder,
    audioVoiceAssistance
  } = useApp();

  const [buyerName, setBuyerName] = useState('Ananya Rao');
  const [buyerPhone, setBuyerPhone] = useState('+91 98801 23456');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Shanthi Enclave, Indiranagar, Bengaluru, Karnataka');
  const [pinCode, setPinCode] = useState('560038');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'COD'
  
  // Realistic UPI Sub-features State
  const [upiTab, setUpiTab] = useState('qr'); // 'qr' | 'vpa' | 'apps'
  const [upiVpa, setUpiVpa] = useState('ananya.rao@okhdfcbank');
  const [vpaVerified, setVpaVerified] = useState(false);
  const [isSendingCollect, setIsSendingCollect] = useState(false);
  const [collectSentNotice, setCollectSentNotice] = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(299); // 4m 59s
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Simulated NPCI Verification State
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  const countdownTimerRef = useRef(null);

  useEffect(() => {
    if (activeUser) {
      if (activeUser.name) setBuyerName(activeUser.name);
      if (activeUser.phone) setBuyerPhone(activeUser.phone);
      if (activeUser.address) setShippingAddress(activeUser.address);
    }
  }, [activeUser, isCheckoutOpen]);

  // Live countdown timer for dynamic UPI QR / Collect
  useEffect(() => {
    if (isCheckoutOpen && paymentMethod === 'UPI') {
      setUpiCountdown(299);
      countdownTimerRef.current = setInterval(() => {
        setUpiCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownTimerRef.current);
  }, [isCheckoutOpen, paymentMethod]);

  if (!isCheckoutOpen) return null;

  const totalAmount = cartSubtotal;

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Play audio confirmation chime if speech is supported
  const playConfirmationChime = (text) => {
    if ('speechSynthesis' in window && audioVoiceAssistance) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  // Handle Verify VPA
  const handleVerifyVpa = () => {
    if (!upiVpa || !upiVpa.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. mobile@upi or name@bank)', 'warning');
      return;
    }
    setVpaVerified(true);
    showToast('✓ Verified UPI ID: ' + upiVpa + ' (Bank of Karnataka / HDFC)', 'success');
  };

  // Handle Send Collect Request
  const handleSendCollect = () => {
    if (!upiVpa || !upiVpa.includes('@')) {
      showToast('Please enter a valid UPI ID', 'warning');
      return;
    }
    setIsSendingCollect(true);
    setTimeout(() => {
      setIsSendingCollect(false);
      setCollectSentNotice(true);
      showToast(`📱 Collect Request for ${formatINR(totalAmount)} sent to ${upiVpa}! Check your phone.`, 'info');
    }, 1200);
  };

  // Actual realistic payment submission pipeline
  const processFinalOrderSubmission = async (resolvedMethod) => {
    setIsSubmitting(true);
    try {
      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
        image: item.product.images?.[0] || item.product.imageUrl || ''
      }));

      const fullAddress = `${shippingAddress.trim()}, PIN: ${pinCode.trim()}`;

      const res = await api.createOrder({
        buyerName,
        buyerPhone,
        shippingAddress: fullAddress,
        items: itemsPayload,
        totalAmount,
        paymentMethod: resolvedMethod
      });

      setCompletedOrderData(res);
      setLatestOrderReceipt(res.receipt);
      clearCart();

      const isCod = resolvedMethod.toLowerCase().includes('cod') || resolvedMethod.toLowerCase().includes('cash on delivery');
      if (isCod) {
        showToast('📦 Order placed with Cash on Delivery! Pay when package arrives.', 'info');
        playConfirmationChime('ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ಹಣ ಪಾವತಿಸಿ.');
      } else {
        showToast('🎉 UPI Payment verified! Direct artisan escrow confirmed.', 'success');
        playConfirmationChime('ಧನ್ಯವಾದಗಳು! ಯುಪಿಐ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
      setIsVerifyingUpi(false);
    }
  };

  // Form submit handler with simulated realistic NPCI handshake for UPI
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerPhone.trim() || !shippingAddress.trim()) {
      showToast('Please fill in buyer name, phone, and delivery address details', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    // If COD, submit immediately with Cash on Delivery
    if (paymentMethod === 'COD') {
      await processFinalOrderSubmission('Cash on Delivery (COD)');
      return;
    }

    // If UPI, run realistic 3-stage verification handshake
    setIsVerifyingUpi(true);
    setVerificationStep(1);

    setTimeout(() => {
      setVerificationStep(2); // Validating with NPCI & State Bank of India
    }, 1000);

    setTimeout(() => {
      setVerificationStep(3); // Escrow allocation & approval
    }, 2200);

    setTimeout(async () => {
      let upiDetail = 'Instant UPI (Dynamic QR Code)';
      if (upiTab === 'vpa') upiDetail = `UPI Collect (${upiVpa})`;
      else if (upiTab === 'apps') upiDetail = 'UPI App Intent (Google Pay / PhonePe)';

      await processFinalOrderSubmission(upiDetail);
    }, 3100);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const isCompletedCod = completedOrderData?.receipt?.isCod || 
    completedOrderData?.order?.paymentMethod?.toLowerCase().includes('cod') || 
    completedOrderData?.order?.paymentMethod?.toLowerCase().includes('cash on delivery') ||
    completedOrderData?.order?.paymentStatus?.toLowerCase().includes('unpaid') ||
    completedOrderData?.order?.paymentStatus?.toLowerCase().includes('delivery');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta-600 text-white flex items-center justify-center text-base shadow-sm">
              🪡
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-indigo-900 leading-tight">
                {completedOrderData 
                  ? (isCompletedCod ? 'Order Placed (Cash on Delivery)' : 'UPI Payment Confirmed!') 
                  : 'Secure Artisan Checkout'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {isCompletedCod ? 'Pay upon Doorstep Delivery' : '88%+ Direct Artisan Wage Escrow'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedOrderData(null);
            }}
            className="p-2 rounded-full hover:bg-cream-200 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* SIMULATED NPCI UPI VERIFICATION HANDSHAKE OVERLAY */}
          {isVerifyingUpi && (
            <div className="py-8 px-4 text-center space-y-6 animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-cream-200 border-t-terracotta-600 animate-spin" />
                <span className="absolute text-2xl">⚡</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-indigo-950">
                  Verifying UPI Transfer with Bank...
                </h3>
                <p className="text-xs text-stone-500">
                  Secure NPCI 256-bit encrypted direct artisan handshake
                </p>
              </div>

              {/* 3 Interactive Steps */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-left space-y-3 max-w-sm mx-auto text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    verificationStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {verificationStep > 1 ? '✓' : '1'}
                  </div>
                  <span className={verificationStep >= 1 ? 'font-bold text-stone-900' : 'text-stone-400'}>
                    Connecting to NPCI UPI Network
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    verificationStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {verificationStep > 2 ? '✓' : '2'}
                  </div>
                  <span className={verificationStep >= 2 ? 'font-bold text-stone-900' : 'text-stone-400'}>
                    State Bank of India Merchant Authorization
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    verificationStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {verificationStep >= 3 ? '✓' : '3'}
                  </div>
                  <span className={verificationStep >= 3 ? 'font-bold text-emerald-800' : 'text-stone-400'}>
                    Direct 88% Artisan Escrow Locked
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-stone-400 block animate-pulse">
                Please do not close or refresh this window...
              </span>
            </div>
          )}

          {/* PAYMENT CONFIRMATION SCREEN (HANDLES COD vs UPI CORRECTLY) */}
          {!isVerifyingUpi && completedOrderData ? (
            <div className="space-y-6 text-center py-2 animate-fadeIn">
              
              {/* Top Status Icon Circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
                isCompletedCod ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isCompletedCod ? (
                  <Clock className="w-10 h-10" />
                ) : (
                  <CheckCircle className="w-10 h-10" />
                )}
              </div>

              <div>
                {/* Status Pill: Accurately reflects Cash on Delivery vs Paid via UPI */}
                <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                  isCompletedCod 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}>
                  {isCompletedCod ? (
                    <>
                      <Banknote className="w-3.5 h-3.5 text-amber-700" />
                      <span>CASH ON DELIVERY • PAYMENT DUE AT DOORSTEP</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>PAID VIA UPI • NPCI TRANSACTION VERIFIED</span>
                    </>
                  )}
                </span>

                <h3 className="font-serif text-2xl font-bold text-indigo-950 mt-2.5">
                  {isCompletedCod ? 'Order Confirmed!' : `Thank You, ${completedOrderData.order?.buyerName}!`}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                  {isCompletedCod
                    ? 'Your handcrafted item has been routed to the artisan loom. Please pay the delivery agent in cash or UPI when your parcel arrives.'
                    : 'Your payment has been directly routed into the Karnataka artisan cooperative escrow.'}
                </p>
              </div>

              {/* Order & Payment Receipt Card */}
              <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 text-left space-y-3 text-xs sm:text-sm">
                
                {/* Order Number */}
                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">Order Number:</span>
                  <strong className="text-indigo-900 font-mono font-bold text-sm">
                    {completedOrderData.order?.orderNumber}
                  </strong>
                </div>

                {/* Reference ID (UTR for UPI / COD Reference) */}
                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">
                    {isCompletedCod ? 'COD Reference ID:' : 'UPI Transaction ID (UTR):'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-stone-800 text-xs truncate max-w-[170px] sm:max-w-xs font-semibold">
                      {completedOrderData.receipt?.transactionId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(completedOrderData.receipt?.transactionId)}
                      className="p-1 hover:bg-cream-300 rounded text-stone-600"
                      title="Copy transaction ID"
                    >
                      {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Amount Paid vs Amount Due */}
                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">
                    {isCompletedCod ? 'Amount Due on Delivery:' : 'Total Amount Paid:'}
                  </span>
                  <strong className={`text-lg font-serif font-black ${
                    isCompletedCod ? 'text-amber-800' : 'text-emerald-800'
                  }`}>
                    {formatINR(completedOrderData.order?.totalAmount)}
                  </strong>
                </div>

                {/* Payment Status Label */}
                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">Payment Status:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCompletedCod
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isCompletedCod ? 'UNPAID • DUE ON DELIVERY' : 'PAID (SUCCESS)'}
                  </span>
                </div>

                {/* Fair Artisan Share */}
                <div className="flex justify-between items-center text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="font-semibold flex items-center gap-1.5 text-xs">
                    <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Artisan Direct Share (88%+):</span>
                  </span>
                  <strong className="font-bold text-xs sm:text-sm">
                    {formatINR(completedOrderData.receipt?.fairArtisanShareINR || Math.round(completedOrderData.order?.totalAmount * 0.88))}
                  </strong>
                </div>

                {/* Shipping Address */}
                <div className="flex justify-between items-start text-[11px] text-stone-500 pt-1">
                  <span className="shrink-0">Delivering To:</span>
                  <span className="text-stone-800 text-right truncate max-w-[240px]">
                    {completedOrderData.order?.shippingAddress}
                  </span>
                </div>
              </div>

              {/* Status Update Note Banner */}
              <div className={`p-4 rounded-2xl border text-xs text-left flex items-start gap-3 ${
                isCompletedCod 
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                {isCompletedCod ? (
                  <Banknote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                ) : (
                  <Truck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold">
                    {isCompletedCod ? 'Doorstep Payment Instructions:' : 'Dispatch Pipeline Active:'}
                  </p>
                  <p className="leading-relaxed">
                    {isCompletedCod
                      ? `Please keep ${formatINR(completedOrderData.order?.totalAmount)} in cash or have your UPI app ready to scan the courier partner's QR code upon delivery.`
                      : 'The artisan will verify loom materials, hand-pack the item with the Karnataka GI Tag seal, and mark it as Shipped.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const orderNum = completedOrderData.order?.orderNumber || completedOrderData.order?.id;
                    setIsCheckoutOpen(false);
                    setCompletedOrderData(null);
                    navigateToTrackOrder(orderNum);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all touch-target"
                >
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>Track Your Order Now (ಲೈವ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCompletedOrderData(null);
                  }}
                  className="w-full py-2.5 px-6 rounded-2xl bg-cream-200 hover:bg-cream-300 text-stone-700 font-bold text-xs transition-colors"
                >
                  Return to Storefront
                </button>
              </div>

            </div>
          ) : !isVerifyingUpi && (
            /* CHECKOUT DETAILS & REALISTIC MULTI-STEP UPI / COD SELECTION FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Order Items Preview */}
              <div className="bg-cream-100 p-3.5 rounded-2xl border border-cream-300 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-800">
                    Ordering {cart.length} craft {cart.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="text-stone-500 truncate max-w-xs">
                    {cart.map(c => c.product.title).join(', ')}
                  </p>
                </div>
                <span className="font-serif text-base font-bold text-indigo-900">
                  {formatINR(totalAmount)}
                </span>
              </div>

              {/* Shipping Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>1. Delivery & Buyer Details (ವಿತರಣೆ ವಿವರಗಳು)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name (ಪೂರ್ಣ ಹೆಸರು) *
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (ಮೊಬೈಲ್) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Shipping Address (ವಿಳಾಸ) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-medium"
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code (ಪಿನ್ ಕೋಡ್) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-medium"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-cream-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>2. Select Payment Method (ಪಾವತಿ ವಿಧಾನ)</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-indigo-900 bg-indigo-50/60 shadow-sm ring-2 ring-indigo-300/50'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-indigo-700" />
                        <span>Instant UPI</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Zero Fee
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">QR Code, GPay, PhonePe, VPA</p>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-terracotta-600 bg-terracotta-50/60 shadow-sm ring-2 ring-terracotta-300/50'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-terracotta-600" />
                        <span>Cash on Delivery</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">Pay cash or UPI at doorstep</p>
                  </div>
                </div>

                {/* CASH ON DELIVERY EXPLANATION BANNER */}
                {paymentMethod === 'COD' && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>Cash on Delivery Selected (ಮನೆಬಾಗಿಲಿಗೆ ಪಾವತಿ)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      You will pay <strong>{formatINR(totalAmount)}</strong> in cash or via courier UPI QR when your handcrafted parcel is delivered. 
                      No advance payment is debited now.
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Artisan reservation confirmed upon checkout</span>
                    </div>
                  </div>
                )}

                {/* REALISTIC MULTI-STEP UPI PAYMENT ENGINE */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 space-y-4 animate-fadeIn">
                    
                    {/* Header Strip with Live Expiry Countdown */}
                    <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-950 flex items-center gap-1">
                          <span>NPCI Verified UPI Gateway</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono font-bold">LIVE</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
                        <Clock className="w-3.5 h-3.5 text-terracotta-600 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>Expires in: </span>
                        <strong className="text-terracotta-700 font-bold">{formatCountdown(upiCountdown)}</strong>
                      </div>
                    </div>

                    {/* 3 UPI Sub-tabs */}
                    <div className="grid grid-cols-3 gap-1.5 bg-cream-200/70 p-1 rounded-xl text-xs font-bold text-center">
                      <button
                        type="button"
                        onClick={() => setUpiTab('qr')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                          upiTab === 'qr'
                            ? 'bg-white text-indigo-950 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiTab('vpa')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                          upiTab === 'vpa'
                            ? 'bg-white text-indigo-950 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>UPI ID / VPA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiTab('apps')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                          upiTab === 'apps'
                            ? 'bg-white text-indigo-950 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>UPI Apps</span>
                      </button>
                    </div>

                    {/* SUB-TAB 1: DYNAMIC UPI QR CODE */}
                    {upiTab === 'qr' && (
                      <div className="space-y-4 pt-1 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-cream-200 shadow-xs">
                          
                          {/* Realistic Dynamic QR Graphic */}
                          <div className="relative w-36 h-36 bg-stone-950 p-2 rounded-2xl shadow-md shrink-0 flex flex-col justify-between">
                            <div className="flex justify-between">
                              {/* Corner Target 1 */}
                              <div className="w-8 h-8 border-4 border-white rounded-md p-1 flex items-center justify-center">
                                <span className="w-3.5 h-3.5 bg-amber-400 rounded-xs" />
                              </div>
                              {/* Corner Target 2 */}
                              <div className="w-8 h-8 border-4 border-white rounded-md p-1 flex items-center justify-center">
                                <span className="w-3.5 h-3.5 bg-amber-400 rounded-xs" />
                              </div>
                            </div>

                            {/* Centered Brand Shield */}
                            <div className="self-center bg-white p-1 rounded-lg shadow-sm border border-stone-300 flex items-center justify-center">
                              <span className="text-xs font-serif font-black text-indigo-950">🪡 KK</span>
                            </div>

                            <div className="flex justify-between items-end">
                              {/* Corner Target 3 */}
                              <div className="w-8 h-8 border-4 border-white rounded-md p-1 flex items-center justify-center">
                                <span className="w-3.5 h-3.5 bg-amber-400 rounded-xs" />
                              </div>
                              {/* Mini matrix pattern */}
                              <div className="grid grid-cols-2 gap-1 p-1">
                                <span className="w-2 h-2 bg-white rounded-xs" />
                                <span className="w-2 h-2 bg-amber-400 rounded-xs" />
                                <span className="w-2 h-2 bg-white rounded-xs" />
                                <span className="w-2 h-2 bg-white rounded-xs" />
                              </div>
                            </div>
                          </div>

                          {/* QR Instructions & Details */}
                          <div className="text-xs space-y-2 flex-1 w-full text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-950 text-sm">
                                Pay {formatINR(totalAmount)}
                              </span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                                Verified Merchant
                              </span>
                            </div>

                            <p className="text-[11px] text-stone-600">
                              Scan using <strong>Google Pay, PhonePe, Paytm, BHIM, Cred</strong> or any banking app.
                            </p>

                            <div className="p-2 bg-cream-100 rounded-xl border border-cream-200 flex items-center justify-between text-[11px] font-mono">
                              <span className="text-stone-700 truncate">VPA: <strong>karakushala.coop@sbi</strong></span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText('karakushala.coop@sbi');
                                  setCopiedVpa(true);
                                  showToast('Copied UPI ID: karakushala.coop@sbi', 'info');
                                  setTimeout(() => setCopiedVpa(false), 2000);
                                }}
                                className="p-1 hover:bg-cream-200 rounded text-stone-600 shrink-0"
                                title="Copy UPI VPA"
                              >
                                {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>

                            <p className="text-[10px] text-stone-500">
                              • Zero convenience fee • 88% instant artisan credit
                            </p>
                          </div>

                        </div>

                        {/* Supported Apps Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] text-stone-500 font-medium">
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">Google Pay</span>
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">PhonePe</span>
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">Paytm</span>
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">BHIM UPI</span>
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">CRED</span>
                          <span className="px-2 py-1 bg-white border border-cream-200 rounded-md">Amazon Pay</span>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: ENTER UPI ID / VPA */}
                    {upiTab === 'vpa' && (
                      <div className="space-y-3 pt-1 animate-fadeIn text-xs text-left">
                        <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                          Enter Your Virtual Payment Address (UPI ID)
                        </label>
                        
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={upiVpa}
                              onChange={e => {
                                setUpiVpa(e.target.value);
                                setVpaVerified(false);
                                setCollectSentNotice(false);
                              }}
                              placeholder="e.g. yourname@okhdfcbank or 9880123456@ybl"
                              className="w-full bg-white border border-cream-300 rounded-xl px-3.5 py-2.5 font-mono text-xs focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                            />
                            {vpaVerified && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyVpa}
                            className="px-3 py-2 bg-cream-200 hover:bg-cream-300 text-stone-800 font-bold rounded-xl text-xs shrink-0 transition-colors"
                          >
                            Verify
                          </button>
                        </div>

                        {/* Quick Handle Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-stone-500 font-semibold">Quick handles:</span>
                          {['@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@axl'].map(handle => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const base = upiVpa.split('@')[0] || 'ananya.rao';
                                setUpiVpa(base + handle);
                                setVpaVerified(true);
                              }}
                              className="text-[10px] font-mono px-2 py-0.5 bg-white hover:bg-cream-200 border border-cream-300 rounded-md text-stone-700 transition-colors"
                            >
                              {handle}
                            </button>
                          ))}
                        </div>

                        {/* Send Collect Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleSendCollect}
                            disabled={isSendingCollect}
                            className="w-full py-2.5 px-4 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                          >
                            {isSendingCollect ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Bell className="w-4 h-4 text-amber-300" />
                            )}
                            <span>Send Collect Request to My Phone</span>
                          </button>
                        </div>

                        {/* Collect Sent Notification Banner */}
                        {collectSentNotice && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] text-emerald-950 space-y-1 animate-fadeIn">
                            <p className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Notification sent to your mobile UPI app!</span>
                            </p>
                            <p className="text-stone-600">
                              Open <strong>PhonePe, Google Pay, or Paytm</strong> on your mobile phone to approve the {formatINR(totalAmount)} transfer. Once authorized, click <strong>Pay & Confirm Order</strong> below.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUB-TAB 3: DIRECT UPI APPS INTENT */}
                    {upiTab === 'apps' && (
                      <div className="space-y-3 pt-1 animate-fadeIn text-xs text-left">
                        <p className="text-[11px] text-stone-600">
                          Select your preferred app for 1-tap instant biometric UPI authorization:
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Google Pay */}
                          <div 
                            onClick={() => {
                              showToast('Opening Google Pay UPI gateway handshake...', 'info');
                            }}
                            className="p-3 bg-white hover:bg-cream-100 border border-cream-300 rounded-xl cursor-pointer flex items-center gap-2.5 shadow-xs transition-all active:scale-95"
                          >
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                              G
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">Google Pay</span>
                              <span className="text-[10px] text-stone-500">Fast UPI</span>
                            </div>
                          </div>

                          {/* PhonePe */}
                          <div 
                            onClick={() => {
                              showToast('Opening PhonePe UPI gateway handshake...', 'info');
                            }}
                            className="p-3 bg-white hover:bg-cream-100 border border-cream-300 rounded-xl cursor-pointer flex items-center gap-2.5 shadow-xs transition-all active:scale-95"
                          >
                            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                              पे
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">PhonePe</span>
                              <span className="text-[10px] text-stone-500">Direct Bank</span>
                            </div>
                          </div>

                          {/* Paytm */}
                          <div 
                            onClick={() => {
                              showToast('Opening Paytm UPI gateway handshake...', 'info');
                            }}
                            className="p-3 bg-white hover:bg-cream-100 border border-cream-300 rounded-xl cursor-pointer flex items-center gap-2.5 shadow-xs transition-all active:scale-95"
                          >
                            <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                              P
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">Paytm UPI</span>
                              <span className="text-[10px] text-stone-500">Zero Charges</span>
                            </div>
                          </div>

                          {/* CRED */}
                          <div 
                            onClick={() => {
                              showToast('Opening CRED UPI gateway handshake...', 'info');
                            }}
                            className="p-3 bg-white hover:bg-cream-100 border border-cream-300 rounded-xl cursor-pointer flex items-center gap-2.5 shadow-xs transition-all active:scale-95"
                          >
                            <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              C
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">CRED Pay</span>
                              <span className="text-[10px] text-stone-500">Artisan Coins</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isVerifyingUpi}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 touch-target ${
                    paymentMethod === 'COD'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-terracotta-600/30'
                  }`}
                >
                  {isSubmitting || isVerifyingUpi ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{paymentMethod === 'COD' ? 'Placing COD Order...' : 'Authorizing UPI Payment...'}</span>
                    </div>
                  ) : paymentMethod === 'COD' ? (
                    <>
                      <Banknote className="w-5 h-5" />
                      <span>Place Cash on Delivery Order ({formatINR(totalAmount)})</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-amber-200" />
                      <span>Verify & Pay {formatINR(totalAmount)} via UPI</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
