import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { getLocalizedProductTitle } from '../utils/translationUtils';
import { 
  Truck, 
  CheckCircle2, 
  Package, 
  Clock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  User, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  X, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ArtisanOrdersList({ orders = [], onOrderStatusUpdated }) {
<<<<<<< HEAD
  const { formatINR, showToast } = useApp();
=======
  const { formatINR, showToast, currentLanguage, t } = useApp();
>>>>>>> f4f8282 (feat: complete end-to-end regional language titles and real-time streaming multilingual voice STT)

  const [activeFilter, setActiveFilter] = useState('All');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedHistoryOrderId, setExpandedHistoryOrderId] = useState(null);

  // Dispatch Modal State (Required when marking Shipped)
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    courier: 'India Post Speed Post',
    customCourier: '',
    trackingNumber: '',
    estimatedDeliveryDate: '',
    note: ''
  });
  const [dispatchError, setDispatchError] = useState('');

  const COURIER_OPTIONS = [
    'India Post Speed Post (ಭಾರತೀಯ ಅಂಚೆ)',
    'Delhivery Express',
    'DTDC Karnataka Rural Courier',
    'Blue Dart Logistics',
    'Karnataka State Rural Logistics (KSRL)',
    'Other / Custom Courier'
  ];

  const ORDER_STATUS_PIPELINE = [
    'Placed',
    'Confirmed',
    'Being crafted',
    'Packed',
    'Shipped',
    'Out for delivery',
    'Delivered',
    'Cancelled'
  ];

  // Helper to open dispatch modal
  const openDispatchModal = (order) => {
    // Default estimated date to +4 days
    const d = new Date();
    d.setDate(d.getDate() + 4);
    const est = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    setDispatchForm({
      courier: order.courier && order.courier !== 'Pending Dispatch Allocation' ? order.courier : 'India Post Speed Post',
      customCourier: '',
      trackingNumber: order.trackingNumber && order.trackingNumber !== 'Pending' ? order.trackingNumber : `IN-POST-KA-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDeliveryDate: order.estimatedDeliveryDate || est,
      note: 'Dispatched from artisan cooperative workshop with protective packing.'
    });
    setDispatchError('');
    setDispatchModalOrder(order);
  };

  const closeDispatchModal = () => {
    setDispatchModalOrder(null);
    setDispatchError('');
  };

  // Direct status update handler
  const handleUpdateStatus = async (order, targetStatus) => {
    // If target is Shipped, strictly require modal for courier & tracking number
    if (targetStatus === 'Shipped') {
      openDispatchModal(order);
      return;
    }

    setUpdatingOrderId(order.id);
    try {
      const updated = await api.updateOrderStatus(order.id, targetStatus, {
        updatedBy: 'Artisan Workshop'
      });
      showToast(`Order status updated to "${targetStatus}"!`, 'success');
      if (onOrderStatusUpdated) onOrderStatusUpdated(updated);
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Submit dispatch modal (Marking as Shipped)
  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    setDispatchError('');

    const resolvedCourier = dispatchForm.courier === 'Other / Custom Courier'
      ? dispatchForm.customCourier.trim()
      : dispatchForm.courier;

    const resolvedTracking = dispatchForm.trackingNumber.trim();

    // Strict validation requirement
    if (!resolvedCourier) {
      setDispatchError('Courier partner name is strictly required.');
      return;
    }

    if (!resolvedTracking) {
      setDispatchError('Tracking number / AWB number is strictly required.');
      return;
    }

    setUpdatingOrderId(dispatchModalOrder.id);

    try {
      const updated = await api.updateOrderStatus(dispatchModalOrder.id, 'Shipped', {
        courier: resolvedCourier,
        trackingNumber: resolvedTracking,
        estimatedDeliveryDate: dispatchForm.estimatedDeliveryDate.trim(),
        note: dispatchForm.note.trim() || `Dispatched via ${resolvedCourier}. Tracking: ${resolvedTracking}`,
        updatedBy: 'Artisan Logistics'
      });

      showToast(`Order marked as SHIPPED via ${resolvedCourier}! Tracking: ${resolvedTracking}`, 'success');
      if (onOrderStatusUpdated) onOrderStatusUpdated(updated);
      closeDispatchModal();
    } catch (err) {
      setDispatchError(err.message || 'Failed to dispatch order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Next suggested status
  const getNextSuggestedStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Placed':
        return 'Confirmed';
      case 'Confirmed':
        return 'Being crafted';
      case 'Being crafted':
        return 'Packed';
      case 'Packed':
        return 'Shipped';
      case 'Shipped':
        return 'Out for delivery';
      case 'Out for delivery':
        return 'Delivered';
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>Placed (ಸ್ವೀಕರಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Confirmed (ದೃಢೀಕರಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Being crafted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-terracotta-100 text-terracotta-900 border border-terracotta-300 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-700 animate-pulse" />
            <span>Being crafted (ರಚನೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ)</span>
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300 px-3 py-1 rounded-full">
            <Package className="w-3.5 h-3.5 text-yellow-700" />
            <span>Packed (ಸಿದ್ಧವಾಗಿದೆ)</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-indigo-700" />
            <span>Shipped (ರವಾನಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Out for delivery':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1 rounded-full animate-pulse">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            <span>Out for Delivery (ವಿತರಣೆಗೆ ಹೊರಟಿದೆ)</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivered & Paid (ತಲುಪಿದೆ)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)</span>
          </span>
        );
      default:
        return <span className="text-xs font-bold bg-stone-100 px-2 py-0.5 rounded">{status}</span>;
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'New') {
      return ['Placed', 'Confirmed'].includes(order.orderStatus);
    } else if (activeFilter === 'Crafting') {
      return order.orderStatus === 'Being crafted';
    } else if (activeFilter === 'Dispatched') {
      return ['Packed', 'Shipped', 'Out for delivery'].includes(order.orderStatus);
    } else if (activeFilter === 'Delivered') {
      return order.orderStatus === 'Delivered';
    }
    return true;
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-cream-300 p-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-cream-200 text-terracotta-600 flex items-center justify-center mx-auto text-3xl">
          📦
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900">No incoming orders yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          When buyers order your handcrafted items, orders will appear here with full status lifecycle and courier dispatch tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Sub-Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'All', label: `All Orders (${orders.length})` },
            { id: 'New', label: 'New / Confirmed' },
            { id: 'Crafting', label: 'Being Crafted' },
            { id: 'Dispatched', label: 'Packed / Shipped' },
            { id: 'Delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border btn-press touch-target ${
                activeFilter === tab.id
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm scale-105'
                  : 'bg-white text-stone-600 hover:bg-cream-100 border-cream-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-semibold">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders Grid */}
      <div className="space-y-5">
        {filteredOrders.map((order) => {
          const isUpdating = updatingOrderId === order.id;
          const items = order.artisanItems || order.items || [];
          const isDelivered = order.orderStatus === 'Delivered';
          const isCancelled = order.orderStatus === 'Cancelled';
          const nextStatus = getNextSuggestedStatus(order.orderStatus);
          const isHistoryExpanded = expandedHistoryOrderId === order.id;

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-cream-300 shadow-earth p-5 sm:p-6 card-hover-lift hover:border-terracotta-400 space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-cream-200">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-indigo-900">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Artisan Direct Earnings */}
                <div className="sm:text-right">
                  <span className="text-[11px] text-stone-500 block">Artisan Fair Share (88%+):</span>
                  <span className="font-serif text-xl font-bold text-emerald-800">
                    {formatINR(order.artisanSubtotal || order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block">
                    Zero Middlemen Deductions
                  </span>
                </div>
              </div>

              {/* Buyer & Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 bg-cream-50 p-4 rounded-2xl">
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>Buyer: {order.buyerName}</span>
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{order.buyerPhone}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-stone-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{order.shippingAddress}</span>
                  </p>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-2 py-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Craft Items to Prepare (ಸಿದ್ಧಪಡಿಸಬೇಕಾದ ಕಲಾಕೃತಿಗಳು):
                </p>
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm bg-cream-100/50 p-2.5 rounded-xl border border-cream-200">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-terracotta-100 text-terracotta-800 font-bold flex items-center justify-center text-xs">
                        {item.quantity}x
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 block">{getLocalizedProductTitle(item, currentLanguage)}</span>
                        {item.craftCluster && (
                          <span className="text-[10px] text-stone-500 block">{item.craftCluster}</span>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-stone-900">
                      {formatINR((item.priceAtPurchase || item.price) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Courier & Tracking Strip (if already assigned) */}
              {(order.courier || order.trackingNumber) && order.trackingNumber !== 'Pending' && order.trackingNumber !== 'N/A' && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-wrap items-center justify-between text-xs text-indigo-950">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-700" />
                    <span>Courier: <strong>{order.courier}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>AWB: <strong>{order.trackingNumber}</strong></span>
                  </div>
                  {order.estimatedDeliveryDate && (
                    <div className="text-[11px] text-stone-600">
                      Est Delivery: <strong>{order.estimatedDeliveryDate}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Status Change Timeline History Toggle */}
              {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setExpandedHistoryOrderId(isHistoryExpanded ? null : order.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-600 hover:text-indigo-900 transition-colors"
                  >
                    <span>View Status History ({order.statusHistory.length} updates)</span>
                    {isHistoryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isHistoryExpanded && (
                    <div className="mt-2.5 p-3.5 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-2 animate-fadeIn">
                      <p className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
                        Timestamped Audit Log (ದೃಢೀಕರಣ ಇತಿಹಾಸ):
                      </p>
                      <div className="space-y-2">
                        {order.statusHistory.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-[11px] border-b border-cream-200 last:border-0 pb-1.5 last:pb-0">
                            <span className="w-2 h-2 rounded-full bg-terracotta-500 mt-1 shrink-0" />
                            <div className="flex-1">
                              <span className="font-bold text-stone-900">{h.status}</span>
                              <span className="text-stone-500 ml-1.5">
                                • {new Date(h.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <p className="text-stone-600 text-[10px] mt-0.5">{h.note}</p>
                            </div>
                            <span className="text-[10px] text-stone-400 italic shrink-0">
                              {h.updatedBy || 'System'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons & Status Pipeline Controls */}
              <div className="pt-3.5 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Manual Status Selector Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] font-bold text-stone-600 shrink-0">
                    Change Status:
                  </span>
                  <select
                    disabled={isUpdating || isDelivered || isCancelled}
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order, e.target.value)}
                    className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs font-bold text-stone-800 focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  >
                    {ORDER_STATUS_PIPELINE.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 1-Tap Quick Advance Action Button */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {!isDelivered && !isCancelled && nextStatus ? (
                    <button
                      onClick={() => handleUpdateStatus(order, nextStatus)}
                      disabled={isUpdating}
                      className={`w-full sm:w-auto py-2.5 px-5 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all touch-target ${
                        nextStatus === 'Shipped'
                          ? 'bg-indigo-900 hover:bg-indigo-950 text-white shadow-indigo-900/30'
                          : nextStatus === 'Delivered'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-terracotta-600/30'
                      }`}
                    >
                      {isUpdating ? (
                        <span>Updating...</span>
                      ) : nextStatus === 'Shipped' ? (
                        <>
                          <Truck className="w-4 h-4 text-amber-200" />
                          <span>Dispatch & Mark Shipped (ಕೊರಿಯರ್ ರವಾನೆ)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Advance to: {nextStatus}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : isDelivered ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Order Completed & Funds Remitted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Order Cancelled</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* DISPATCH ORDER MODAL (STRICTLY REQUIRED WHEN MARKING SHIPPED) */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div 
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-terracotta-700 text-white p-6 relative">
              <button
                onClick={closeDispatchModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <Truck className="w-5 h-5 text-amber-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Dispatch & Shipping Verification
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Mark Order as Shipped
              </h3>
              <p className="text-xs text-cream-200 mt-1">
                Order <span className="font-mono font-bold text-white">{dispatchModalOrder.orderNumber}</span> • Customer: {dispatchModalOrder.buyerName}
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4">
              
              {dispatchError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{dispatchError}</span>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Courier and Tracking Number are strictly required.</strong> The customer will receive this tracking number on their live timeline for real-time delivery monitoring.
                </span>
              </div>

              {/* 1. Courier Partner Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Courier Partner (ಕೊರಿಯರ್ ಸೇವೆ) *
                </label>
                <select
                  required
                  value={dispatchForm.courier}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, courier: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {dispatchForm.courier === 'Other / Custom Courier' && (
                  <input
                    type="text"
                    required
                    value={dispatchForm.customCourier}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, customCourier: e.target.value })}
                    placeholder="Enter custom courier name (e.g. Professional Couriers)..."
                    className="w-full mt-2 px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                  />
                )}
              </div>

              {/* 2. Tracking Number (AWB) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Tracking Number / Consignment ID (AWB ಸಂಖ್ಯೆ) *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchForm.trackingNumber}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })}
                  placeholder="e.g. IN-POST-KA-99248 or DELH-KK-12345"
                  className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                />
                <span className="text-[10px] text-stone-500 block">
                  Found on the postal / courier dispatch slip.
                </span>
              </div>

              {/* 3. Estimated Delivery Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Estimated Delivery Date (ಅಂದಾಜು ತಲುಪುವ ದಿನಾಂಕ) *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchForm.estimatedDeliveryDate}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, estimatedDeliveryDate: e.target.value })}
                  placeholder="e.g. Nov 20, 2026"
                  className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                />
              </div>

              {/* 4. Dispatch Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Dispatch Notes (ರವಾನೆ ವಿವರಗಳು - Optional)
                </label>
                <textarea
                  rows={2}
                  value={dispatchForm.note}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, note: e.target.value })}
                  placeholder="e.g. Hand-packed in moisture-proof banana fiber box with Karnataka GI tag."
                  className="w-full px-3.5 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={closeDispatchModal}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingOrderId === dispatchModalOrder.id}
                  className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/30 flex items-center gap-2 active:scale-95 transition-all touch-target"
                >
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>Confirm Dispatch & Mark Shipped</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
