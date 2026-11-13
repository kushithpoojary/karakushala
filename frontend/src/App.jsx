import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ArtisanDashboard from './components/ArtisanDashboard';
import ArtisanLoginModal from './components/ArtisanLoginModal';
import UserLoginModal from './components/UserLoginModal';
import WelcomeRoleModal from './components/WelcomeRoleModal';
import { Sparkles, Compass, AlertCircle, Heart, ShieldCheck, CheckCircle2, Search, X, Volume2, Mic } from 'lucide-react';

export default function App() {
  const { viewMode, toast } = useApp();
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
    <div className="min-h-screen flex flex-col bg-cream-100 text-stone-900 selection:bg-terracotta-200">
      
      {/* Navbar with Mode Switcher, Voice Search & Cart */}
      <Navbar onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Main View Mode Switcher */}
      <main className="flex-1">
        {viewMode === 'artisan' ? (
          <ArtisanDashboard />
        ) : (
          <div>
            {/* Hero Section */}
            <HeroBanner onExploreClick={handleExploreClick} />

            {/* Buyer Catalogue Section */}
            <section ref={catalogueRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
              
              {/* Catalogue Header */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-200">
                      GI Heritage Handcrafts • ಉತ್ತರ ಕರ್ನಾಟಕ & ಕರಾವಳಿ
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl font-bold text-indigo-900 mt-2">
                      Karnataka Living Crafts Catalogue
                    </h2>
                    <p className="text-stone-600 text-xs sm:text-sm mt-1">
                      Each piece is tagged with verified provenance, multi-photo angles, and authentic artisan audio stories.
                    </p>
                  </div>

                  {/* Active Filter Pill Count */}
                  <div className="text-xs text-stone-500 font-medium">
                    Showing <strong className="text-indigo-900">{filteredProducts.length}</strong> of {allProducts.length} authentic crafts
                  </div>
                </div>

                {/* Category Pills */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  productCounts={productCounts}
                />

                {/* Quick Search Suggestion Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700 whitespace-nowrap flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>Popular searches:</span>
                  </span>
                  {quickSearchPills.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setSelectedCategory('All Crafts');
                      }}
                      className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap border ${
                        searchQuery.toLowerCase() === term.toLowerCase()
                          ? 'bg-terracotta-600 text-white border-terracotta-600 font-bold'
                          : 'bg-white hover:bg-cream-200 text-stone-700 border-cream-300'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {/* Active Search Notification Banner */}
                {searchQuery.trim() && (
                  <div className="p-3.5 bg-terracotta-50 border border-terracotta-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-terracotta-900 animate-fadeIn">
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

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-cream-300 p-4 space-y-3">
                      <div className="w-full h-44 bg-cream-200 rounded-xl" />
                      <div className="w-3/4 h-4 bg-cream-200 rounded" />
                      <div className="w-1/2 h-3 bg-cream-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-cream-300 p-12 text-center space-y-4">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    No crafts found matching "{searchQuery}"
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                    Try searching for "Kasuti", "Beedu", "Lamp", "Saree", "Diya", or click one of the popular craft suggestions above.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Crafts');
                    }}
                    className="px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Reset Search & View All Crafts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

            </section>
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <ArtisanLoginModal />
      <UserLoginModal />
      <WelcomeRoleModal />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border ${
              toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-stone-950 border-amber-600'
                : toast.type === 'info'
                ? 'bg-indigo-900 text-white border-indigo-700'
                : 'bg-emerald-800 text-white border-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
