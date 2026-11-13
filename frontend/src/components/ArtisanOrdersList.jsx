import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Truck, CheckCircle, Package, Clock, Phone, MapPin, ArrowRight, User } from 'lucide-react';

export default function ArtisanOrdersList({ orders = [], onOrderStatusUpdated }) {
  const { formatINR, showToast } = useApp();
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = 'Shipped';
    if (currentStatus === 'Accepted' || currentStatus === 'Pending') {
      nextStatus = 'Shipped';
    } else if (currentStatus === 'Shipped') {
      nextStatus = 'Delivered';
    } else {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const updated = await api.updateOrderStatus(orderId, nextStatus);
      showToast(`Order status updated to "${nextStatus}"!`, 'success');
      if (onOrderStatusUpdated) onOrderStatusUpdated(updated);
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Ready to Pack (ಸಿದ್ಧಪಡಿಸಿ)</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            <span>In Transit (ರವಾನಿಸಲಾಗಿದೆ)</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivered (ತಲುಪಿದೆ)</span>
          </span>
        );
      default:
        return <span className="text-xs font-bold bg-stone-100 px-2 py-0.5 rounded">{status}</span>;
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-cream-300 p-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-cream-200 text-terracotta-600 flex items-center justify-center mx-auto text-2xl">
          📦
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900">No incoming orders yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          When buyers order your handcrafted items, orders will appear here with 1-tap dispatch buttons.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isUpdating = updatingOrderId === order.id;
        const items = order.artisanItems || order.items || [];
        const isDelivered = order.orderStatus === 'Delivered';
        const isShipped = order.orderStatus === 'Shipped';

        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-cream-300 shadow-earth p-5 sm:p-6 transition-all hover:border-terracotta-400"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-indigo-900">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Total payout for this artisan */}
              <div className="sm:text-right">
                <span className="text-[11px] text-stone-500 block">Artisan Payment:</span>
                <span className="font-serif text-xl font-bold text-emerald-800">
                  {formatINR(order.artisanSubtotal || order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 bg-cream-50 p-3.5 rounded-2xl my-3">
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
                Craft Items Ordered (ಕಲಾಕೃತಿಗಳು):
              </p>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-terracotta-100 text-terracotta-800 font-bold flex items-center justify-center text-[11px]">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-stone-800">{item.title}</span>
                  </div>
                  <span className="font-serif font-bold text-stone-900">
                    {formatINR((item.priceAtPurchase || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* 1-Tap Status Action Button */}
            <div className="pt-4 border-t border-cream-200 mt-3 flex items-center justify-end">
              {!isDelivered ? (
                <button
                  onClick={() => handleUpdateStatus(order.id, order.orderStatus)}
                  disabled={isUpdating}
                  className={`py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all touch-target ${
                    isShipped
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-terracotta-600/30'
                  }`}
                >
                  {isUpdating ? (
                    <span>Updating...</span>
                  ) : isShipped ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>One-Tap: Mark as Delivered (ತಲುಪಿದೆ ಎಂದು ಗುರುತಿಸಿ)</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>One-Tap: Mark as Ready / Shipped (ರವಾನಿಸಲಾಗಿದೆ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order Fully Completed & Payment Settled</span>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
