import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, CheckCircle, QrCode, ShieldCheck, Truck, ArrowRight, Sparkles, Copy, Check, HeartHandshake, User } from 'lucide-react';

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
    activeUser
  } = useApp();

  const [buyerName, setBuyerName] = useState('Ananya Rao');
  const [buyerPhone, setBuyerPhone] = useState('+91 98801 23456');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Shanthi Enclave, Indiranagar, Bengaluru, Karnataka');
  const [pinCode, setPinCode] = useState('560038');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'COD'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (activeUser.name) setBuyerName(activeUser.name);
      if (activeUser.phone) setBuyerPhone(activeUser.phone);
      if (activeUser.address) setShippingAddress(activeUser.address);
    }
  }, [activeUser, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const totalAmount = cartSubtotal;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerPhone.trim() || !shippingAddress.trim()) {
      showToast('Please fill in all buyer and shipping address details', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      }));

      const fullAddress = `${shippingAddress.trim()}, PIN: ${pinCode.trim()}`;

      const res = await api.createOrder({
        buyerName,
        buyerPhone,
        shippingAddress: fullAddress,
        items: itemsPayload,
        totalAmount,
        paymentMethod: paymentMethod === 'UPI' ? 'Mocked UPI (Google Pay / PhonePe)' : 'Cash on Delivery (COD)'
      });

      setCompletedOrderData(res);
      setLatestOrderReceipt(res.receipt);
      clearCart();
      showToast('🎉 Order placed and payment confirmed!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪡</span>
            <div>
              <h2 className="font-serif text-lg font-bold text-indigo-900">
                {completedOrderData ? 'Order Confirmed!' : 'Secure Artisan Checkout'}
              </h2>
              <p className="text-[11px] text-stone-500">KaraKushala Direct Handloom Settlement</p>
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
          {completedOrderData ? (
            /* Payment Confirmation Receipt Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  {completedOrderData.receipt?.paymentStatus || 'PAID - MOCKED UPI'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-indigo-900 mt-2">
                  Thank You, {completedOrderData.order?.buyerName}!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Your order has been routed directly to the artisan cooperative in Karnataka.
                </p>
              </div>

              {/* Order & Payment Receipt Card */}
              <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">Order Number:</span>
                  <strong className="text-indigo-900 font-mono font-bold text-sm">
                    {completedOrderData.order?.orderNumber}
                  </strong>
                </div>

                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">Transaction ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-stone-700 text-xs truncate max-w-[160px] sm:max-w-xs">
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

                <div className="flex justify-between items-center border-b border-cream-300 pb-2.5">
                  <span className="text-stone-500">Total Amount Paid:</span>
                  <strong className="text-lg font-serif font-black text-indigo-900">
                    {formatINR(completedOrderData.order?.totalAmount)}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                  <span className="font-semibold flex items-center gap-1">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    Artisan Direct Share:
                  </span>
                  <strong className="font-bold">
                    {formatINR(completedOrderData.receipt?.fairArtisanShareINR || Math.round(completedOrderData.order?.totalAmount * 0.88))}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-[11px] text-stone-500 pt-1">
                  <span>Shipping To:</span>
                  <span className="text-stone-800 text-right truncate max-w-[200px]">
                    {completedOrderData.order?.shippingAddress}
                  </span>
                </div>
              </div>

              {/* Status Update Note */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
                <Truck className="w-5 h-5 text-amber-700 shrink-0" />
                <p>
                  The artisan will receive this order on their dashboard, hand-pack the item, and mark it as <strong>Shipped</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCompletedOrderData(null);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-md"
              >
                Return to Storefront
              </button>
            </div>
          ) : (
            /* Checkout Details & Payment Selection Form */
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  1. Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name (ಪೂರ್ಣ ಹೆಸರು)
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (ಮೊಬೈಲ್)
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Shipping Address (ವಿಳಾಸ)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code (ಪಿನ್ ಕೋಡ್)
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-cream-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  2. Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-terracotta-600 bg-terracotta-50/50 shadow-sm'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">Mock UPI</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">GPay, PhonePe, Paytm, BHIM</p>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-terracotta-600 bg-terracotta-50/50 shadow-sm'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">Cash on Delivery</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Pay cash upon delivery</p>
                  </div>
                </div>

                {/* Mocked UPI QR Preview if UPI selected */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 flex items-center gap-4 animate-fadeIn">
                    <div className="w-16 h-16 bg-white p-1 rounded-xl border border-cream-300 shadow-xs flex items-center justify-center shrink-0">
                      {/* Stylized QR representation */}
                      <div className="w-14 h-14 bg-indigo-900 rounded p-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <span className="w-3 h-3 bg-white rounded-xs" />
                          <span className="w-3 h-3 bg-white rounded-xs" />
                        </div>
                        <div className="flex justify-center">
                          <span className="w-2 h-2 bg-amber-400 rounded-full" />
                        </div>
                        <div className="flex justify-between">
                          <span className="w-3 h-3 bg-white rounded-xs" />
                          <span className="w-1.5 h-1.5 bg-white rounded-xs" />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs">
                      <p className="font-bold text-indigo-900">Mock Direct UPI Gateway</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        UPI ID: <span className="font-mono font-bold text-terracotta-700">artisan@karakushala</span>
                      </p>
                      <p className="text-emerald-700 font-semibold text-[11px] mt-1">
                        ✓ 0% payment gateway fees for rural artisans
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 touch-target ${
                    isSubmitting
                      ? 'bg-stone-300 text-stone-500 cursor-wait'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-terracotta-600/30'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Confirming Artisan Order...</span>
                  ) : (
                    <>
                      <span>Pay & Confirm Order ({formatINR(totalAmount)})</span>
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
