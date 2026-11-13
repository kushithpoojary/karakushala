import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  ArrowLeft, 
  Copy, 
  Check, 
  Search, 
  HelpCircle, 
  XCircle, 
  Calendar, 
  ShieldCheck, 
  Home,
  RefreshCw,
  Phone,
  User,
  ShoppingBag
} from 'lucide-react';

export default function TrackOrderPage() {
  const { 
    trackingOrderId, 
    navigateToOrders, 
    navigateToShop, 
    formatINR, 
    showToast, 
    openCustomerCare 
  } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  // Ordered sequence of stages for normal progression
  const PIPELINE_STAGES = [
    { 
      key: 'Placed', 
      label: 'Order Placed', 
      kannada: 'ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      desc: 'Order received and buyer payment escrow confirmed' 
    },
    { 
      key: 'Confirmed', 
      label: 'Artisan Confirmed', 
      kannada: 'ಕಲಾಕಾರರಿಂದ ದೃಢೀಕರಣ',
      desc: 'Artisan reviewed specifications and allocated natural raw materials' 
    },
    { 
      key: 'Being crafted', 
      label: 'Handcrafting in Progress', 
      kannada: 'ಕಲಾಕೃತಿ ರಚನೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ',
      desc: 'Master weaver/artisan handcrafting item at Karnataka cluster' 
    },
    { 
      key: 'Packed', 
      label: 'Hand-Packed with GI Seal', 
      kannada: 'ಪಾರಂಪರಿಕ ಮುದ್ರೆಯೊಂದಿಗೆ ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ',
      desc: 'Eco-friendly protective packing with heritage certificate' 
    },
    { 
      key: 'Shipped', 
      label: 'Dispatched with Courier', 
      kannada: 'ಕೊರಿಯರ್ ಪಾಲುದಾರರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ',
      desc: 'Handed over to logistics with official tracking AWB' 
    },
    { 
      key: 'Out for delivery', 
      label: 'Out for Delivery', 
      kannada: 'ವಿತರಣೆಗೆ ಹೊರಟಿದೆ',
      desc: 'Courier associate is en route to your shipping address' 
    },
    { 
      key: 'Delivered', 
      label: 'Delivered to Doorstep', 
      kannada: 'ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿಸಲಾಗಿದೆ',
      desc: 'Handed over to customer. Artisan fair wages settled' 
    }
  ];

  const fetchOrder = async (queryId) => {
    setLoading(true);
    try {
      const orders = await api.getOrders();
      setAllOrders(orders || []);
      
      let found = null;
      if (queryId) {
        const q = queryId.trim().toLowerCase();
        found = orders.find(o => 
          o.id?.toLowerCase() === q || 
          o.orderNumber?.toLowerCase() === q || 
          o.trackingNumber?.toLowerCase() === q
        );
      }

      // Default to first order if none matched or none requested
      if (!found && orders.length > 0) {
        found = orders[0];
      }

      setOrder(found);
      if (found) {
        setSearchInput(found.orderNumber || found.id);
      }
    } catch (err) {
      console.error('Error fetching order for tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(trackingOrderId);
  }, [trackingOrderId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchInput.trim().toLowerCase();
    if (!clean) return;

    const matched = allOrders.find(o => 
      o.id?.toLowerCase() === clean || 
      o.orderNumber?.toLowerCase() === clean || 
      o.trackingNumber?.toLowerCase() === clean ||
      o.buyerPhone?.includes(clean)
    );

    if (matched) {
      setOrder(matched);
      showToast(`Showing tracking for ${matched.orderNumber}`, 'success');
    } else {
      showToast(`No order found matching "${searchInput}". Please check Order # or Tracking #`, 'error');
    }
  };

  const copyTracking = (text) => {
    if (!text || text === 'Pending' || text === 'N/A') return;
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    showToast(`Copied tracking number: ${text}`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Find history record for a given status
  const getHistoryEntry = (stageKey) => {
    if (!order?.statusHistory || !Array.isArray(order.statusHistory)) return null;
    return order.statusHistory.find(h => h.status.toLowerCase() === stageKey.toLowerCase());
  };

  // Determine stage status: 'completed' | 'current' | 'upcoming'
  const getStageState = (stageKey) => {
    if (!order) return 'upcoming';
    const currentStatus = order.orderStatus;

    if (currentStatus === 'Cancelled') {
      return stageKey === 'Placed' ? 'completed' : 'upcoming';
    }

    const currentIndex = PIPELINE_STAGES.findIndex(s => s.key.toLowerCase() === currentStatus.toLowerCase());
    const thisIndex = PIPELINE_STAGES.findIndex(s => s.key.toLowerCase() === stageKey.toLowerCase());

    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={navigateToOrders}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-950 hover:text-terracotta-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to My Orders (ಆರ್ಡರ್‌ಗಳ ಪಟ್ಟಿ)</span>
        </button>

        {/* Search by Order / Tracking Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Order # or AWB..."
              className="w-full bg-white pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-900 hover:bg-terracotta-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-cream-300 p-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-terracotta-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-stone-600">ಟ್ರ್ಯಾಕಿಂಗ್ ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ... Fetching tracking history...</p>
        </div>
      ) : !order ? (
        <div className="bg-white rounded-3xl border border-cream-300 p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-900">Order Not Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            We couldn't locate an order matching that reference. Please check your order confirmation receipt or browse your active orders.
          </p>
          <button
            onClick={navigateToOrders}
            className="px-6 py-2.5 bg-indigo-900 text-white rounded-xl text-xs font-bold shadow-md"
          >
            View All My Orders
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Status & Order Header Card */}
          <div className="bg-white rounded-3xl border border-cream-300 shadow-earth p-6 sm:p-8 space-y-6">
            
            {/* Top Row: Order # & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
                  Live Dispatch Tracking • ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್
                </span>
                <div className="flex items-center gap-2 pt-1">
                  <h2 className="font-mono text-xl sm:text-2xl font-black text-indigo-950">
                    {order.orderNumber}
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(order.orderNumber);
                      showToast(`Copied ${order.orderNumber}`, 'info');
                    }}
                    className="p-1 hover:bg-cream-100 rounded text-stone-400 hover:text-stone-700"
                    title="Copy Order Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Status Badge */}
              <div className="sm:text-right space-y-1">
                <span className="text-xs text-stone-500 block">Current Order Status:</span>
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : order.orderStatus === 'Cancelled'
                    ? 'bg-red-100 text-red-900 border-red-300'
                    : order.orderStatus === 'Shipped' || order.orderStatus === 'Out for delivery'
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : 'bg-terracotta-100 text-terracotta-900 border-terracotta-300'
                }`}>
                  {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  {order.orderStatus === 'Cancelled' && <XCircle className="w-4 h-4 text-red-700" />}
                  {order.orderStatus === 'Shipped' && <Truck className="w-4 h-4 text-blue-700" />}
                  {order.orderStatus === 'Out for delivery' && <MapPin className="w-4 h-4 text-blue-700 animate-bounce" />}
                  {['Placed', 'Confirmed', 'Being crafted', 'Packed'].includes(order.orderStatus) && (
                    <Sparkles className="w-4 h-4 text-terracotta-700 animate-pulse" />
                  )}
                  <span>{order.orderStatus}</span>
                </span>
              </div>
            </div>

            {/* Crucial Delivery Info Strip (Estimated Date, Courier, Tracking #) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50 p-5 rounded-2xl border border-cream-300">
              
              {/* Estimated Delivery Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center shrink-0 border border-terracotta-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    Estimated Delivery
                  </span>
                  <strong className="text-sm sm:text-base font-serif text-indigo-950 font-bold block mt-0.5">
                    {order.estimatedDeliveryDate || 'Within 7-9 business days'}
                  </strong>
                  <span className="text-[10px] text-terracotta-700 font-semibold block">
                    ಅಂದಾಜು ತಲುಪುವ ದಿನಾಂಕ
                  </span>
                </div>
              </div>

              {/* Courier Partner */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    Courier Partner
                  </span>
                  <strong className="text-xs sm:text-sm text-stone-900 font-bold block mt-0.5">
                    {order.courier || (['Shipped', 'Out for delivery', 'Delivered'].includes(order.orderStatus) ? 'India Post Speed Post' : 'Allocating upon pack')}
                  </strong>
                  <span className="text-[10px] text-stone-500 block">
                    ಕೊರಿಯರ್ ಸೇವೆ
                  </span>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    Tracking Number (AWB)
                  </span>
                  {order.trackingNumber && order.trackingNumber !== 'Pending' && order.trackingNumber !== 'N/A' ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-indigo-900 text-xs sm:text-sm truncate">
                        {order.trackingNumber}
                      </span>
                      <button
                        onClick={() => copyTracking(order.trackingNumber)}
                        className="p-1 hover:bg-cream-200 rounded text-stone-500 hover:text-stone-900 shrink-0"
                        title="Copy tracking number"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500 italic block mt-0.5">
                      Assigned on dispatch
                    </span>
                  )}
                  <span className="text-[10px] text-stone-500 block">
                    ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* VERTICAL TIMELINE OF ORDER PROGRESS */}
          <div className="bg-white rounded-3xl border border-cream-300 shadow-earth p-6 sm:p-8 space-y-6">
            <div className="border-b border-cream-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-950 flex items-center gap-2">
                  <span>Order Progress Timeline</span>
                  <span className="text-xs text-stone-500 font-sans font-normal">(ಆರ್ಡರ್ ಪ್ರಗತಿ ಟೈಮ್‌ಲೈನ್)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chronological journey of your craft item from raw threads to doorstep delivery.
                </p>
              </div>

              {/* Escrow Guarantee Pill */}
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>GI Certified Authentic</span>
              </span>
            </div>

            {/* Special Cancelled Notice if Order is Cancelled */}
            {order.orderStatus === 'Cancelled' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-red-950 text-sm">Order Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)</h4>
                  <p className="text-red-800 leading-relaxed">
                    {getHistoryEntry('Cancelled')?.note || 'This order was cancelled prior to yarn cutting. Full refund has been initiated to your source payment method.'}
                  </p>
                  <span className="text-[11px] text-red-600 font-medium block">
                    Cancelled at: {getHistoryEntry('Cancelled')?.timestamp ? new Date(getHistoryEntry('Cancelled').timestamp).toLocaleString('en-IN') : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Vertical Stepper Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 py-2">
              
              {/* Connecting Vertical Line (behind steps) */}
              <div 
                className="absolute left-[23px] sm:left-[31px] top-4 bottom-4 w-1 bg-cream-300 -translate-x-1/2 z-0" 
              />

              {PIPELINE_STAGES.map((stage, idx) => {
                const stageState = getStageState(stage.key);
                const historyRecord = getHistoryEntry(stage.key);
                const isCurrent = stageState === 'current';
                const isCompleted = stageState === 'completed';
                const isUpcoming = stageState === 'upcoming';

                return (
                  <div key={stage.key} className="relative z-10 flex items-start gap-4 sm:gap-6 group">
                    
                    {/* Timeline Node Icon Circle */}
                    <div className="relative shrink-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-terracotta-600 text-white ring-4 ring-terracotta-100 animate-pulse'
                          : 'bg-white text-stone-400 border-2 border-cream-300'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ animationDuration: '6s' }} />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Timeline Content Block */}
                    <div className={`flex-1 rounded-2xl p-4 transition-all border ${
                      isCurrent
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                        : isCompleted
                        ? 'bg-cream-50/70 border-cream-200'
                        : 'bg-transparent border-transparent opacity-60'
                    }`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm sm:text-base font-bold ${
                            isCurrent ? 'text-indigo-950' : isCompleted ? 'text-stone-900' : 'text-stone-500'
                          }`}>
                            {stage.label}
                          </h4>
                          <span className="text-[11px] text-terracotta-700 font-semibold">
                            ({stage.kannada})
                          </span>
                          {isCurrent && (
                            <span className="bg-terracotta-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full animate-bounce">
                              Active Stage (ಪ್ರಸ್ತುತ)
                            </span>
                          )}
                        </div>

                        {/* Timestamp from statusHistory */}
                        {historyRecord?.timestamp && (
                          <span className="text-[11px] font-mono text-stone-500 font-medium">
                            {new Date(historyRecord.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at {new Date(historyRecord.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {/* Description & Status History Note */}
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {historyRecord?.note || stage.desc}
                      </p>

                      {/* Extra details for Shipped stage */}
                      {stage.key === 'Shipped' && (order.courier || order.trackingNumber) && (isCompleted || isCurrent) && (
                        <div className="mt-2.5 p-2.5 bg-white/80 rounded-xl border border-cream-300 text-xs flex flex-wrap items-center gap-3">
                          {order.courier && (
                            <span className="text-stone-700">
                              Courier: <strong>{order.courier}</strong>
                            </span>
                          )}
                          {order.trackingNumber && (
                            <span className="font-mono text-indigo-900">
                              AWB: <strong>{order.trackingNumber}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Updated By attribution */}
                      {historyRecord?.updatedBy && (
                        <span className="text-[10px] text-stone-400 mt-2 block">
                          Verified by: {historyRecord.updatedBy}
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Delivery & Items Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipping Destination */}
            <div className="bg-white rounded-3xl border border-cream-300 shadow-earth p-5 sm:p-6 space-y-3">
              <h4 className="font-serif font-bold text-indigo-950 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <span>Shipping Destination (ತಲುಪುವ ವಿಳಾಸ)</span>
              </h4>

              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-xs space-y-2">
                <p className="font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>{order.buyerName}</span>
                </p>
                <p className="text-stone-700 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>{order.buyerPhone}</span>
                </p>
                <p className="text-stone-600 leading-relaxed pt-1 border-t border-cream-200">
                  {order.shippingAddress}
                </p>
              </div>

              {(() => {
                const isCod = (order.paymentMethod || '').toLowerCase().includes('cod') ||
                              (order.paymentMethod || '').toLowerCase().includes('cash on delivery') ||
                              (order.paymentStatus || '').toLowerCase().includes('unpaid') ||
                              (order.paymentStatus || '').toLowerCase().includes('delivery');
                const isDelivered = order.orderStatus === 'Delivered';
                return (
                  <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                    <span>Payment Mode: <strong>{order.paymentMethod || 'Instant UPI'}</strong></span>
                    {isCod && !isDelivered ? (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                        ⏳ Pay on Delivery ({formatINR(order.totalAmount)})
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ✓ {order.paymentStatus || 'PAID'}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Items in this Order */}
            <div className="bg-white rounded-3xl border border-cream-300 shadow-earth p-5 sm:p-6 space-y-3">
              <h4 className="font-serif font-bold text-indigo-950 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-800" />
                <span>Package Contents (ಕಲಾಕೃತಿಗಳು)</span>
              </h4>

              <div className="divide-y divide-cream-100 max-h-48 overflow-y-auto pr-1">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                        alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover border border-cream-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h5>
                        <p className="text-[10px] text-stone-500">Qty: {item.quantity} • {item.craftCluster || 'Karnataka'}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-xs text-stone-900 shrink-0">
                      {formatINR((item.priceAtPurchase || item.price) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-semibold">Total Order Value:</span>
                <strong className="font-serif text-base text-indigo-950">{formatINR(order.totalAmount)}</strong>
              </div>
            </div>

          </div>

          {/* Need Help CTA */}
          <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base sm:text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <span>Have a question about this shipment?</span>
              </h4>
              <p className="text-xs text-stone-300 max-w-lg">
                Our Karnataka rural craft care desk is available to assist you with delivery queries or custom artisan notes.
              </p>
            </div>
            <button
              onClick={openCustomerCare}
              className="px-5 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all shrink-0 active:scale-95 touch-target"
            >
              Contact Customer Care (ಸಹಾಯವಾಣಿ)
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
