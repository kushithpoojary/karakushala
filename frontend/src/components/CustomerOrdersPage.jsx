import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { getLocalizedProductTitle } from '../utils/translationUtils';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  Copy, 
  Check, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  XCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import OrderCancellationModal from './OrderCancellationModal';

export default function CustomerOrdersPage() {
  const { 
    formatINR, 
    showToast, 
    navigateToTrackOrder, 
    navigateToShop, 
    activeUser, 
<<<<<<< HEAD
    openCustomerCare 
=======
    openCustomerCare,
    currentLanguage,
    t 
>>>>>>> f4f8282 (feat: complete end-to-end regional language titles and real-time streaming multilingual voice STT)
  } = useApp();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [trackInput, setTrackInput] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const copyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast(`Copied "${text}" to clipboard!`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const clean = trackInput.trim();
    if (!clean) {
      showToast('Please enter an Order ID or Tracking Number', 'warning');
      return;
    }
    navigateToTrackOrder(clean);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Placed (ಸ್ವೀಕರಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Confirmed (ಖಚಿತಪಡಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Being crafted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-terracotta-50 text-terracotta-800 border border-terracotta-200">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600 animate-pulse" />
            <span>Being crafted (ರಚಿಸಲಾಗುತ್ತಿದೆ)</span>
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-800 border border-yellow-300">
            <Package className="w-3.5 h-3.5 text-yellow-700" />
            <span>Packed (ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Shipped (ರವಾನಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Out for delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 animate-pulse">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Out for Delivery (ವಿತರಣೆಗೆ ಹೊರಟಿದೆ)</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered (ತಲುಪಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    // 1. Status Filter
    if (selectedFilter === 'In Progress') {
      const activeStatuses = ['Placed', 'Confirmed', 'Being crafted', 'Packed', 'Shipped', 'Out for delivery'];
      if (!activeStatuses.includes(order.orderStatus)) return false;
    } else if (selectedFilter === 'Delivered') {
      if (order.orderStatus !== 'Delivered') return false;
    } else if (selectedFilter === 'Cancelled') {
      if (order.orderStatus !== 'Cancelled') return false;
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const numMatch = order.orderNumber?.toLowerCase().includes(q);
      const trackMatch = order.trackingNumber?.toLowerCase().includes(q);
      const buyerMatch = order.buyerName?.toLowerCase().includes(q);
      const itemMatch = (order.items || []).some(item => item.title?.toLowerCase().includes(q));
      return numMatch || trackMatch || buyerMatch || itemMatch;
    }

    return true;
  });

  return (
    <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cream-100 via-white to-amber-50/50 rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-200">
              Customer Portal • ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-indigo-950">
            My Handcrafted Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
            Track your authentic Karnataka Kasuti, coastal Beedu cane weaves, and wood carvings straight from the master artisan's cluster to your doorstep.
          </p>
        </div>

        {/* 1-Tap Direct Track Search Box */}
        <form onSubmit={handleTrackSubmit} className="bg-white p-3 rounded-2xl border border-cream-300 shadow-sm flex flex-col sm:flex-row items-center gap-2 sm:w-auto w-full">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="Track by Order # or AWB..."
              className="w-full bg-cream-50 pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-900 hover:bg-terracotta-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 touch-target shadow-sm"
          >
            <span>Track Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'In Progress', 'Delivered', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border btn-press touch-target ${
                selectedFilter === tab
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm scale-105'
                  : 'bg-white text-stone-600 hover:bg-cream-100 border-cream-300'
              }`}
            >
              {tab === 'All' && 'All Orders (ಎಲ್ಲವೂ)'}
              {tab === 'In Progress' && 'Active / In Crafting (ಸಿದ್ಧತೆ/ರವಾನೆ)'}
              {tab === 'Delivered' && 'Delivered (ತಲುಪಿದೆ)'}
              {tab === 'Cancelled' && 'Cancelled (ರದ್ದು)'}
            </button>
          ))}
        </div>

        {/* In-Page Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter list by item or ID..."
            className="w-full bg-white pl-9 pr-3 py-2 text-xs rounded-full border border-cream-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus-ring"
          />
        </div>
      </div>

      {/* Orders List with Shimmer Skeletons */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-cream-300 p-6 space-y-4 shadow-earth">
              <div className="flex justify-between items-center pb-3 border-b border-cream-200">
                <div className="w-32 h-5 rounded bg-cream-200 shimmer-skeleton" />
                <div className="w-24 h-6 rounded-full bg-cream-200 shimmer-skeleton" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-cream-200 shimmer-skeleton shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-3/4 h-4 rounded bg-cream-200 shimmer-skeleton" />
                  <div className="w-1/2 h-3 rounded bg-cream-200 shimmer-skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-300 p-12 sm:p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-200 text-terracotta-600 flex items-center justify-center mx-auto text-3xl">
            📦
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No orders found matching "{selectedFilter}"
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {searchQuery 
              ? 'Try modifying your search term or reset filters.'
              : 'Support Karnataka’s living traditions by placing your first direct artisan order!'}
          </p>
          <button
            onClick={navigateToShop}
            className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Heritage Crafts • ಕಲಾಕೃತಿಗಳನ್ನು ನೋಡಿ</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map(order => {
            const items = order.items || [];
            const isDelivered = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';
            const isShipped = ['Shipped', 'Out for delivery', 'Delivered'].includes(order.orderStatus);
            const isCod = (order.paymentMethod || '').toLowerCase().includes('cod') || 
                          (order.paymentMethod || '').toLowerCase().includes('cash on delivery') ||
                          (order.paymentStatus || '').toLowerCase().includes('unpaid') ||
                          (order.paymentStatus || '').toLowerCase().includes('delivery');

            return (
              <div 
                key={order.id || order.orderNumber}
                className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/80 shadow-earth p-5 sm:p-7 space-y-5 card-hover-lift hover:border-amber-400/80 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-indigo-950">
                        {order.orderNumber}
                      </span>
                      <button
                        onClick={() => copyText(order.orderNumber, order.id + '-num')}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                        title="Copy Order Number"
                      >
                        {copiedId === order.id + '-num' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {renderStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-stone-500 block">
                      {isCod && !isDelivered ? 'Payable on Delivery:' : 'Total Amount Paid:'}
                    </span>
                    <span className={`font-serif text-lg sm:text-xl font-bold ${
                      isCod && !isDelivered ? 'text-amber-800' : 'text-indigo-950'
                    }`}>
                      {formatINR(order.totalAmount)}
                    </span>
                    <span className={`text-[10px] font-semibold block ${
                      isCod && !isDelivered ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {isCod && !isDelivered 
                        ? '⏳ Cash / UPI at Doorstep' 
                        : '✓ Direct Artisan Escrow Guaranteed'}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Craft Items ({items.length}):
                  </span>
                  <div className="divide-y divide-cream-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-cream-200 shrink-0 shadow-xs"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                              {getLocalizedProductTitle(item, currentLanguage)}
                            </h4>
                            <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                              {item.artisanName && (
                                <span className="text-terracotta-700 font-semibold">
                                  {item.artisanName}
                                </span>
                              )}
                              {item.craftCluster && (
                                <span>• {item.craftCluster}</span>
                              )}
                              <span>• Qty: {item.quantity}</span>
                            </p>
                          </div>
                        </div>

                        <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 shrink-0">
                          {formatINR((item.priceAtPurchase || item.price) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Delivery Progress Strip */}
                <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Estimated Delivery */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Estimated Delivery (ತಲುಪುವ ದಿನಾಂಕ)
                    </span>
                    <span className="font-bold text-indigo-950 mt-0.5 block">
                      {order.estimatedDeliveryDate || 'Within 7 business days'}
                    </span>
                  </div>

                  {/* Courier Partner */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Courier Partner (ಕೊರಿಯರ್)
                    </span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">
                      {order.courier || (isShipped ? 'India Post Speed Post' : 'Assigned upon packing')}
                    </span>
                  </div>

                  {/* Tracking Number */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Tracking Number (AWB)
                    </span>
                    {order.trackingNumber && order.trackingNumber !== 'Pending' && order.trackingNumber !== 'N/A' ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-bold text-indigo-900 text-xs">
                          {order.trackingNumber}
                        </span>
                        <button
                          onClick={() => copyText(order.trackingNumber, order.id + '-track')}
                          className="text-stone-400 hover:text-stone-700 p-0.5"
                          title="Copy tracking number"
                        >
                          {copiedId === order.id + '-track' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-stone-400 font-mono text-[11px] mt-0.5 block">
                        Generated upon dispatch
                      </span>
                    )}
                  </div>
                </div>

                {/* Cancelled Notice Banner */}
                {order.orderStatus === 'Cancelled' && (
                  <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-900 animate-fadeIn">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-red-950">Order Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)</span>
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                          Refund Processed
                        </span>
                      </div>
                      <p className="text-red-800">
                        Reason: <strong className="font-semibold italic">"{order.cancellationReason || order.statusHistory?.find(h => h.status === 'Cancelled')?.note || 'Cancelled upon customer request.'}"</strong>
                      </p>
                      <p className="text-[11px] text-red-700">
                        {isCod ? '✓ Cash on Delivery payment liability cancelled.' : '✓ Full payment refund scheduled to your account.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-cream-200">
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 w-full sm:w-auto">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate max-w-sm">
                      Delivering to: {order.shippingAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                    {/* PROMINENT ORDER CANCELLATION BUTTON FOR ACTIVE ORDERS */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 touch-target"
                        title="Open Cancellation Options"
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Cancel Order (ಆರ್ಡರ್ ರದ್ದು)</span>
                      </button>
                    )}

                    <button
                      onClick={openCustomerCare}
                      className="px-3.5 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span>Order Help (ಸಹಾಯ)</span>
                    </button>

                    <button
                      onClick={() => navigateToTrackOrder(order.orderNumber || order.id)}
                      className="px-5 py-2.5 bg-indigo-900 hover:bg-terracotta-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:gap-2.5 active:scale-95 touch-target"
                    >
                      <span>Track Order (ಲೈವ್ ಟ್ರ್ಯಾಕ್)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Voice-Enabled Order Cancellation Modal with Options */}
      <OrderCancellationModal
        isOpen={Boolean(cancellingOrder)}
        order={cancellingOrder}
        onClose={() => setCancellingOrder(null)}
        onOrderCancelled={(cancelledIdentifier, cancelledOrder) => {
          const targetId = cancelledIdentifier || cancelledOrder?.id || cancellingOrder?.id;
          const targetNum = cancelledOrder?.orderNumber || cancellingOrder?.orderNumber;

          // Directly REMOVE the ordered item from the ordered list as requested
          setOrders(prev => prev.filter(o => o.id !== targetId && o.orderNumber !== targetNum && o.id !== targetNum));

          // Also remove from local storage orders cache
          try {
            const raw = localStorage.getItem('karakushala_orders_cache');
            if (raw) {
              const list = JSON.parse(raw);
              const updated = list.filter(o => o.id !== targetId && o.orderNumber !== targetNum && o.id !== targetNum);
              localStorage.setItem('karakushala_orders_cache', JSON.stringify(updated));
            }
          } catch (e) {}

          setCancellingOrder(null);
        }}
      />

    </div>
  );
}
