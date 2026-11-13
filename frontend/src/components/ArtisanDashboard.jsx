import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_ARTISANS } from '../data/mockData';
import GuidedListingForm from './GuidedListingForm';
import ArtisanOrdersList from './ArtisanOrdersList';
import { PlusCircle, Package, Layers, Sparkles, Volume2, UserCheck, CheckCircle2, TrendingUp, IndianRupee, Store, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

export default function ArtisanDashboard() {
  const {
    activeArtisan,
    setActiveArtisan,
    setViewMode,
    formatINR,
    showToast,
    audioVoiceAssistance
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'new-craft', 'products'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getArtisanDashboard(activeArtisan.id);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load artisan dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`ಕಲಾಕೃತಿಯನ್ನು ತೆಗೆದುಹಾಕಬೇಕೆ? Are you sure you want to remove "${product.title}" from your listings?`);
    if (!confirmed) return;

    setDeletingId(product.id);
    try {
      await api.deleteProduct(product.id);
      showToast(`Removed "${product.title}" from your listed crafts.`, 'info');
      await fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to remove craft', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [activeArtisan.id]);

  const speakGuidance = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Welcome Banner & Artisan Profile Switcher */}
      <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <img
            src={activeArtisan.profileImage}
            alt={activeArtisan.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-amber-300 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-stone-950 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeArtisan.craftSpecialty} Master Artisan
              </span>
              <span className="text-xs text-amber-200">
                {activeArtisan.village}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>ನಮಸ್ಕಾರ, {activeArtisan.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-cream-100 max-w-xl">
              {activeArtisan.bio}
            </p>
          </div>
        </div>

        {/* Switch Artisan Selector & Voice Help */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-terracotta-900/60 p-3 rounded-2xl border border-terracotta-400/40">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
              Switch Artisan Demo Profile:
            </label>
            <select
              value={activeArtisan.id}
              onChange={(e) => {
                const found = MOCK_ARTISANS.find(a => a.id === e.target.value);
                if (found) setActiveArtisan(found);
              }}
              className="bg-white text-stone-900 font-semibold text-xs rounded-xl px-3 py-2 border-0 focus:ring-2 focus:ring-amber-400 shadow-inner"
            >
              {MOCK_ARTISANS.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.craftSpecialty} - {a.village.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => speakGuidance(`ನಮಸ್ಕಾರ ${activeArtisan.name}. ನಿಮ್ಮ ಒಟ್ಟು ಆದಾಯ ${dashboardData?.metrics?.totalEarningsINR || 0} ರೂಪಾಯಿಗಳು. ನಿಮ್ಮ ಹೊಸ ಆರ್ಡರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.`)}
            className="p-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all self-stretch sm:self-auto justify-center"
            title="Read Dashboard Aloud in Kannada"
          >
            <Volume2 className="w-4 h-4 text-stone-900" />
            <span>ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ (Listen)</span>
          </button>
        </div>

      </div>

      {/* High-Contrast Visual Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-earth flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0">
            ₹
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Earnings (ಒಟ್ಟು ಆದಾಯ)
            </p>
            <h3 className="font-serif text-2xl font-black text-indigo-900">
              {formatINR(dashboardData?.metrics?.totalEarningsINR || 0)}
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold">100% direct bank payout</span>
          </div>
        </div>

        {/* Incoming Orders to Ship */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-earth flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              To Dispatch (ಕಳುಹಿಸಬೇಕಾದ)
            </p>
            <h3 className="font-serif text-2xl font-black text-amber-900">
              {dashboardData?.metrics?.pendingOrdersCount || 0}
            </h3>
            <span className="text-[10px] text-amber-800 font-semibold">1-tap ready button</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-earth flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Completed (ತಲುಪಿದವು)
            </p>
            <h3 className="font-serif text-2xl font-black text-indigo-900">
              {dashboardData?.metrics?.completedOrdersCount || 0}
            </h3>
            <span className="text-[10px] text-stone-500">Delivered to buyers</span>
          </div>
        </div>

        {/* Active Products Listed */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-earth flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Live Crafts (ನನ್ನ ಕಲೆಗಳು)
            </p>
            <h3 className="font-serif text-2xl font-black text-terracotta-700">
              {dashboardData?.metrics?.totalProducts || 0}
            </h3>
            <span className="text-[10px] text-stone-500">Visible to buyers</span>
          </div>
        </div>

      </div>

      {/* Artisan Tab Navigation Pills (Large Touch Targets) */}
      <div className="flex items-center gap-3 border-b border-cream-300 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-target shadow-sm ${
            activeTab === 'orders'
              ? 'bg-indigo-900 text-white shadow-indigo-900/20'
              : 'bg-white hover:bg-cream-200 text-stone-700 border border-cream-300'
          }`}
        >
          <Package className="w-4 h-4 text-amber-300" />
          <span>Incoming Orders ({dashboardData?.orders?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-craft')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-target shadow-sm ${
            activeTab === 'new-craft'
              ? 'bg-terracotta-600 text-white shadow-terracotta-600/30'
              : 'bg-white hover:bg-cream-200 text-stone-700 border border-cream-300'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>Add New Craft (ಹೊಸ ಕಲೆ ಸೇರಿಸಿ)</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-target shadow-sm ${
            activeTab === 'products'
              ? 'bg-indigo-900 text-white shadow-indigo-900/20'
              : 'bg-white hover:bg-cream-200 text-stone-700 border border-cream-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Listed Crafts ({dashboardData?.products?.length || 0})</span>
        </button>

        <button
          onClick={fetchDashboard}
          className="ml-auto p-2.5 rounded-xl bg-white hover:bg-cream-200 text-stone-600 border border-cream-300 shadow-xs"
          title="Refresh Dashboard"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tab 1: Incoming Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-indigo-900">
              Orders for {activeArtisan.name}
            </h2>
            <span className="text-xs text-stone-500">
              Tap "Mark as Ready / Shipped" to update buyer
            </span>
          </div>

          <ArtisanOrdersList
            orders={dashboardData?.orders || []}
            onOrderStatusUpdated={fetchDashboard}
          />
        </div>
      )}

      {/* Tab 2: 3-Step Guided Listing Form */}
      {activeTab === 'new-craft' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <GuidedListingForm
            onProductCreated={() => {
              fetchDashboard();
              setActiveTab('products');
            }}
          />
        </div>
      )}

      {/* Tab 3: My Listed Crafts */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-indigo-900">
              Crafts Handcrafted by {activeArtisan.name}
            </h2>
            <button
              onClick={() => setActiveTab('new-craft')}
              className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Another Craft</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dashboardData?.products || []).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-cream-300 shadow-earth p-4 flex gap-4"
              >
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80'}
                  alt={product.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-cream-300"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cream-200 text-stone-700 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-stone-900 mt-1 line-clamp-2">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream-200">
                    <div>
                      <span className="font-serif font-bold text-base text-indigo-900">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        Stock: <strong className="text-stone-900">{product.stockQuantity}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deletingId === product.id}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
                      title="Delete / Remove this craft listing (ಕಲಾಕೃತಿಯನ್ನು ತೆಗೆದುಹಾಕಿ)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === product.id ? 'Removing...' : 'Remove'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
