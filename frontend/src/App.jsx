import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import ProductDetailModal from './components/ProductDetailModal';
import OrderQuickPopupModal from './components/OrderQuickPopupModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ArtisanDashboard from './components/ArtisanDashboard';
import ArtisanLoginModal from './components/ArtisanLoginModal';
import UserLoginModal from './components/UserLoginModal';
import WelcomeRoleModal from './components/WelcomeRoleModal';
import CustomerCareModal from './components/CustomerCareModal';
import CustomerOrdersPage from './components/CustomerOrdersPage';
import TrackOrderPage from './components/TrackOrderPage';
import ToastNotification from './components/ToastNotification';
import HeritageLatticeBackground from './components/HeritageLatticeBackground';
import WebsiteIntroSplash from './components/WebsiteIntroSplash';
import { Sparkles, Compass, AlertCircle, Heart, ShieldCheck, CheckCircle2, Search, X, Volume2, Mic, Headphones } from 'lucide-react';

export default function App() {
  const { viewMode, customerView, toast, openCustomerCare } = useApp();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [searchQuery, setSearchQuery] = useState('');

  const catalogueRef = useRef(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setAllProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // When search query is entered (typed or via Voice Search), auto-scroll to catalogue
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery]);

  const handleExploreClick = () => {
    catalogueRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter products intelligently across title, category, artisan, materials, and cultural story
  const filteredProducts = allProducts.filter(p => {
    const q = searchQuery.toLowerCase().trim();

    // If search query is active, search across ALL categories
    if (q) {
      const titleMatch = p.title?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const artisanMatch = p.artisan?.name?.toLowerCase().includes(q) || p.artisan?.kannadaName?.includes(q);
      const villageMatch = p.artisan?.village?.toLowerCase().includes(q) || p.craftStory?.provenanceLocation?.toLowerCase().includes(q);
      const materialsMatch = p.craftStory?.materialsUsed?.toLowerCase().includes(q);
      const storyMatch = p.craftStory?.culturalSignificance?.toLowerCase().includes(q);

      const matchesSearch = titleMatch || catMatch || artisanMatch || villageMatch || materialsMatch || storyMatch;
      
      // If user also picked a specific category pill other than "All Crafts", respect it as a secondary filter
      if (selectedCategory !== 'All Crafts') {
        return matchesSearch && p.category === selectedCategory;
      }
      return matchesSearch;
    }

    // If no search query, filter purely by category pill
    if (selectedCategory !== 'All Crafts') {
      return p.category === selectedCategory;
    }

    return true;
  });

  // Calculate live counts per category
  const productCounts = {
    'All Crafts': allProducts.length,
    'Kasuti Embroidery': allProducts.filter(p => p.category === 'Kasuti Embroidery').length,
    'Beedu Craft': allProducts.filter(p => p.category === 'Beedu Craft').length,
    'Coastal Wood & Shell': allProducts.filter(p => p.category === 'Coastal Wood & Shell').length,
  };

  const quickSearchPills = [
    'Kasuti Saree',
    'Beedu Lamp',
    'Coconut Diya',
    'Peacock Tapestry',
    'Storage Chest',
    'Wind Chime',
    'Fisherboat'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-900 selection:bg-terracotta-200 relative overflow-x-hidden">
      
      {/* Opening Website Reveal Intro Splash Animation */}
      <WebsiteIntroSplash />

      {/* Sacred Geometric Kasuti Handloom Lattice Background (Matches User Uploaded Reference) */}
      <HeritageLatticeBackground />

      {/* Ambient Atmospheric Colored Glass Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-16 -left-16 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-violet-300/30 via-purple-200/20 to-transparent blur-3xl animate-blob1" />
        <div className="absolute top-1/3 -right-20 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-indigo-300/25 via-violet-200/20 to-purple-100/25 blur-3xl animate-blob2" />
        <div className="absolute -bottom-20 left-1/4 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-fuchsia-300/20 via-violet-200/20 to-indigo-200/25 blur-3xl animate-blob3" />
      </div>

      {/* Navbar with Mode Switcher, Voice Search & Cart */}
      <Navbar onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Main View Mode Switcher with Glassy Blur-In Page Transition */}
      <main className="flex-1 relative z-10">
        <div key={`${viewMode}-${customerView}`} className="animate-glassPageTransition w-full">
          {viewMode === 'artisan' ? (
            <ArtisanDashboard />
          ) : customerView === 'my-orders' ? (
            <CustomerOrdersPage />
          ) : customerView === 'track-order' ? (
            <TrackOrderPage />
          ) : (
            <div>
              {/* Hero Section (Upper Section: Light Violet Theme Preserved) */}
              <HeroBanner onExploreClick={handleExploreClick} />

              {/* Orange Background Zone starting from Karnataka Living Crafts Catalogue */}
              <div className="relative bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] text-stone-900 border-t-4 border-amber-300 shadow-2xl">
                {/* Subtle traditional warm pattern overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                {/* Ambient warm glowing accents inside orange zone */}
                <div className="absolute top-12 left-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Buyer Catalogue Section */}
                <section ref={catalogueRef} className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-7 relative z-10">
                
                {/* Catalogue Header */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-amber-300 text-stone-900 text-xs font-bold shadow-xs">
                        <span className="text-sm">🏛️</span>
                        <span>GI Heritage Handcrafts • ಉತ್ತರ ಕರ್ನಾಟಕ & ಕರಾವಳಿ ಕ್ಲಸ್ಟರ್</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-2 flex items-center gap-2 flex-wrap drop-shadow-sm">
                        <span>Karnataka Living Crafts Catalogue</span>
                        <span className="text-xs sm:text-sm font-sans font-bold bg-stone-950 text-amber-300 px-3 py-1 rounded-full shadow-md">
                          ಕರಕುಶಲ ಮಳಿಗೆ
                        </span>
                      </h2>
                      <p className="text-orange-100 text-xs sm:text-sm mt-1 font-medium">
                        Each piece is tagged with verified provenance, multi-photo angles, direct fair-wage breakdowns, and authentic artisan voice stories.
                      </p>
                    </div>

                    {/* Active Filter Pill Count */}
                    <div className="text-xs text-stone-900 font-bold bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-orange-200 shadow-sm">
                      Showing <strong className="text-terracotta-700 font-extrabold text-sm">{filteredProducts.length}</strong> of {allProducts.length} authentic crafts
                    </div>
                  </div>

                  {/* Multi-Color Category Pills */}
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    productCounts={productCounts}
                  />

                  {/* Quick Search Suggestion Pills with Colorful Badges */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-500">
                    <span className="font-bold text-white whitespace-nowrap flex items-center gap-1.5 pl-0.5">
                      <Search className="w-3.5 h-3.5 text-amber-300" />
                      <span>Popular:</span>
                    </span>
                    {quickSearchPills.map((term, i) => {
                      const pillGradients = [
                        'hover:border-rose-400 hover:text-rose-700',
                        'hover:border-amber-400 hover:text-amber-800',
                        'hover:border-emerald-400 hover:text-emerald-700',
                        'hover:border-indigo-400 hover:text-indigo-700',
                        'hover:border-cyan-400 hover:text-cyan-700',
                        'hover:border-terracotta-400 hover:text-terracotta-700',
                        'hover:border-purple-400 hover:text-purple-700',
                      ];
                      const hoverClass = pillGradients[i % pillGradients.length];

                      return (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setSelectedCategory('All Crafts');
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border active:scale-95 shadow-xs ${
                            searchQuery.toLowerCase() === term.toLowerCase()
                              ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-amber-300 border-transparent font-bold shadow-sm'
                              : `bg-white/95 text-stone-800 border-cream-300 ${hoverClass}`
                          }`}
                        >
                          {term}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Search Notification Banner */}
                  {searchQuery.trim() && (
                    <div className="p-3.5 bg-white/95 border border-amber-300 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-stone-900 shadow-md animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-terracotta-600" />
                        <span>
                          Search results for: <strong className="font-bold underline">"{searchQuery}"</strong> ({filteredProducts.length} {filteredProducts.length === 1 ? 'craft' : 'crafts'} found)
                        </span>
                      </div>

                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-2.5 py-1 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Clear Search</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Grid with Staggered Entrance & Smooth Skeletons */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-cream-300 p-10 sm:p-14 text-center space-y-5 shadow-earth max-w-2xl mx-auto animate-scaleUp">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-200">
                      🔍
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                        No crafts found matching "{searchQuery}"
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                        Try searching for "Kasuti", "Beedu", "Lamp", "Saree", "Diya", or click one of the popular Karnataka craft tags above.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Crafts');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-stone-900 to-stone-800 hover:bg-black text-amber-300 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 btn-press"
                    >
                      Reset Filter & Explore All Crafts
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </div>
                )}

                </section>
              </div>
          </div>
        )}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <OrderQuickPopupModal />
      <CartDrawer />
      <CheckoutModal />
      <ArtisanLoginModal />
      <UserLoginModal />
      <WelcomeRoleModal />
      <CustomerCareModal />

      {/* Floating Customer Care Help Pill (Bottom-left, accessible to buyers & sellers) */}
      <button
        onClick={openCustomerCare}
        className="fixed bottom-5 left-5 z-30 bg-indigo-900 hover:bg-terracotta-600 text-white px-3.5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 border-2 border-amber-300/40 btn-press"
        title="Customer Care & Artisan Support (ಸಹಾಯವಾಣಿ)"
      >
        <Headphones className="w-4 h-4 text-amber-300" />
        <span className="hidden sm:inline">Customer Care (ಸಹಾಯ)</span>
      </button>

      {/* Sleek Glassmorphic Toast Notification Container */}
      <ToastNotification toast={toast} />

      {/* Heritage Footer */}
      <footer className="bg-indigo-950 text-cream-100 border-t border-indigo-900 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-indigo-900/60">
            
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪡</span>
                <span className="font-serif text-2xl font-bold text-cream-50">KaraKushala (ಕರಕುಶಲ)</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
                A direct-to-consumer digital marketplace bridging rural Karnataka artisans—specializing in 
                intricate Kasuti needle embroidery and sacred coastal Beedu cane weaves—with conscious patrons worldwide.
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold pt-1">
                <span>✓ 88%+ Value to Weavers</span>
                <span>•</span>
                <span>✓ Zero Exploitative Middlemen</span>
                <span>•</span>
                <span>✓ GI Tag Preserved</span>
              </div>
            </div>

            {/* Column 2: Craft Clusters */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Heritage Craft Clusters</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>• Navalgund & Dharwad Kasuti Circle</li>
                <li>• Maravanthe & Kundapura Beedu Weavers</li>
                <li>• Kumta & Honnavar Coastal Guild</li>
                <li>• Badami Chalukyan Motif Archive</li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Empowerment Tools</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>• 3-Step Guided Listing Form</li>
                <li>• Audio Story Player & Voice Guidance</li>
                <li>• Transparent Fair Price Breakdown</li>
                <li>• 1-Tap Ready & Dispatch Tracking</li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
            <p>© 2026 KaraKushala Initiative. Preserving Karnataka living traditions with honor and fair wages.</p>
            <p className="text-stone-400 flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-current inline" /> for Karnataka Artisans
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
