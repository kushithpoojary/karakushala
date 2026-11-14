import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  ArrowRight, 
  Zap, 
  Clock, 
  MapPin, 
  Award, 
  Volume2,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  const { setViewMode, openOrderPopup } = useApp();

  // Interactive Featured Craft Spotlight Rotator
  const featuredCrafts = [
    {
      id: 'kasuti-silk',
      title: 'Navalgund Geometric Kasuti Saree',
      kannadaTitle: 'ನವಲಗುಂದ ಕಸೂತಿ ಇಳಕಲ್ ಸೀರೆ',
      category: 'Kasuti Embroidery',
      artisan: 'Parvati Bai Deshpande',
      village: 'Navalgund, Dharwad',
      price: 4850,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      hours: 48,
      accentColor: 'from-rose-500 via-amber-500 to-terracotta-600',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
      highlightBadge: '👑 GI Certified Handloom',
      shortQuote: 'Hand-counted temple chariot & Gopuram embroidery with pure mulberry silk.'
    },
    {
      id: 'beedu-lamp',
      title: 'Maravanthe Beedu Palm-Lattice Lamp',
      kannadaTitle: 'ಮರವಂತೆ ಬೀಡು ಬೆತ್ತದ ದೀಪ',
      category: 'Beedu Craft',
      artisan: 'Nagendra Acharya',
      village: 'Kundapura, Udupi',
      price: 2150,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      hours: 22,
      accentColor: 'from-emerald-500 via-teal-500 to-amber-500',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      highlightBadge: '🌿 100% Eco-Bamboo Weave',
      shortQuote: 'Traditional coastal lattice casting meditative shadow play for pooja rooms.'
    },
    {
      id: 'coastal-diya',
      title: 'Kumta Sacred Hand-Carved Teak Diya',
      kannadaTitle: 'ಕುಮಟಾ ಮರದ ನಂದಾದೀಪ',
      category: 'Coastal Wood & Shell',
      artisan: 'Ganesh Naik',
      village: 'Kumta, Uttara Kannada',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      hours: 18,
      accentColor: 'from-amber-500 via-orange-500 to-cyan-600',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      highlightBadge: '🪔 Teakwood & Natural Wax',
      shortQuote: 'Carved with sacred Chalukya temple motifs, seasoned for over 50 years.'
    }
  ];

  const [activeCraftIdx, setActiveCraftIdx] = useState(0);
  const activeCraft = featuredCrafts[activeCraftIdx];

  // Auto-rotate spotlight every 7 seconds if user doesn't click
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCraftIdx(prev => (prev + 1) % featuredCrafts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredCrafts.length]);

  const liveTickerItems = [
    '✨ Smt. Parvati Bai completed a Navalgund Kasuti Ilkal Saree in Dharwad',
    '⚡ 88%+ of purchase directly transferred into artisan escrow',
    '🏛️ Certified Karnataka GI Tag #382 authentic provenance',
    '🌾 40+ rural women in Kundapura weaving sustainable Beedu cane',
    '🚚 Express dispatch directly from artisan loom in 24-48 hours',
    '🎨 100% organic vegetable dyes & handspun mulberry thread'
  ];

  return (
    <section className="relative overflow-hidden border-b border-purple-200/60 bg-white/40 backdrop-blur-md">
      
      {/* Dynamic Multi-Color Animated Aurora Blobs in Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-300/30 to-purple-300/25 blur-3xl pointer-events-none animate-blob1" />
      <div className="absolute top-1/2 -right-28 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-indigo-300/20 via-violet-200/20 to-purple-200/25 blur-3xl pointer-events-none animate-blob2" />
      <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-fuchsia-300/20 via-purple-300/20 to-violet-300/25 blur-3xl pointer-events-none animate-blob3" />

      {/* Floating Animated Sparkles & Needle Spool Accents */}
      <div className="absolute top-8 left-12 text-amber-500 text-2xl animate-sparkleFloat pointer-events-none select-none hidden sm:block">
        ✨
      </div>
      <div className="absolute bottom-16 right-16 text-terracotta-500 text-3xl animate-needleBob pointer-events-none select-none hidden lg:block">
        🪡
      </div>
      <div className="absolute top-24 right-1/4 text-emerald-500 text-xl animate-sparkleFloat pointer-events-none select-none hidden md:block" style={{ animationDelay: '1.5s' }}>
        ✦
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">

          {/* Left Column: Heading, Value Proposition & Lively CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Chromatic Animated Live Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800">
                Direct Karnataka Artisan Bridge • <span className="text-terracotta-700 font-extrabold">ಉತ್ತರ ಕರ್ನಾಟಕ & ಕರಾವಳಿ</span>
              </span>
              <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline">
                88% to Artisans
              </span>
            </div>

            {/* Main Headline with Chromatic Animated Color Shimmer */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-indigo-950 leading-[1.12]">
              Living Heritage Stitched with{' '}
              <span className="animate-chromaText font-black block sm:inline">
                Sacred Devotion
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl font-normal">
              Connect directly with master artisans preserving Karnataka's sacred traditions: 
              the geometric <strong className="text-rose-800 font-bold bg-rose-50 px-1 rounded">Kasuti needlework</strong> of Dharwad, 
              coastal <strong className="text-emerald-800 font-bold bg-emerald-50 px-1 rounded">Beedu cane weaves</strong> of Udupi, 
              and hand-carved heritage crafts. Zero middleman markups.
            </p>

            {/* Lively CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-600 hover:from-terracotta-700 hover:to-terracotta-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-terracotta-600/30 flex items-center gap-2.5 active:scale-95 transition-all touch-target animate-goldHalo"
              >
                <Compass className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Explore Authentic Crafts</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => setViewMode('artisan')}
                className="px-5 py-3.5 rounded-2xl bg-white/90 hover:bg-cream-100 border-2 border-indigo-900/20 hover:border-indigo-900/40 text-indigo-950 font-bold text-sm sm:text-base flex items-center gap-2 active:scale-95 transition-all shadow-sm backdrop-blur-sm"
              >
                <span className="text-base">🪡</span>
                <span>ಕಲಾಕಾರರಾಗಿ ನೋಂದಾಯಿಸಿ (Sell Your Craft)</span>
              </button>
            </div>

            {/* Vibrant Multi-Color Trust Badges with Glowing Accents */}
            <div className="pt-6 border-t border-cream-300/80 grid grid-cols-3 gap-2.5 sm:gap-6 text-stone-800">
              
              {/* Badge 1: 88% Direct Share (Gold / Amber) */}
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs hover:scale-105 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center text-xs sm:text-sm shrink-0 shadow-sm shadow-amber-400/40">
                  88%
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-bold text-stone-900">Direct Share</p>
                  <p className="text-amber-800 text-[11px] font-medium">To artisan family</p>
                </div>
              </div>

              {/* Badge 2: GI Provenance (Emerald Green) */}
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs hover:scale-105 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/40">
                  <ShieldCheck className="w-5 h-5 text-emerald-100" />
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-bold text-stone-900">GI Certified</p>
                  <p className="text-emerald-800 text-[11px] font-medium">Authentic cluster</p>
                </div>
              </div>

              {/* Badge 3: Audio Stories (Royal Indigo / Terracotta) */}
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 shadow-xs hover:scale-105 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white font-bold flex items-center justify-center shrink-0 shadow-sm shadow-indigo-700/40">
                  <Volume2 className="w-5 h-5 text-indigo-200" />
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-bold text-stone-900">Audio Stories</p>
                  <p className="text-indigo-800 text-[11px] font-medium">Hear weaver voice</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Featured Craft Spotlight Card with Multi-Color Aura */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Vibrant Animated Gradient Halo Frame */}
              <div className="relative p-1.5 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-earth-lg animate-rainbowBorder">
                
                <div className="rounded-[22px] overflow-hidden bg-white shadow-inner flex flex-col">
                  
                  {/* Spotlight Image with Shimmer & Floating Ribbon */}
                  <div className="relative h-64 sm:h-72 2xl:h-84 w-full overflow-hidden bg-stone-100 group">
                    <img
                      key={activeCraft.id}
                      src={activeCraft.image}
                      alt={activeCraft.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 animate-fadeIn"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
                    
                    {/* Top Ribbons */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border shadow-sm ${activeCraft.tagColor}`}>
                        {activeCraft.highlightBadge}
                      </span>

                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-900/80 text-white backdrop-blur-md flex items-center gap-1 border border-white/20">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{activeCraft.hours}h Handcrafted</span>
                      </span>
                    </div>

                    {/* Bottom Overlay Text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{activeCraft.village}</span>
                        </span>

                        <span className="text-lg sm:text-xl font-bold font-serif text-white">
                          ₹{activeCraft.price}
                        </span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold leading-tight text-white drop-shadow-sm">
                        {activeCraft.title}
                      </h3>
                      <p className="text-[11px] text-cream-200 line-clamp-1">
                        {activeCraft.shortQuote}
                      </p>
                    </div>
                  </div>

                  {/* Artisan Mini Bar + Quick Order CTA */}
                  <div className="p-3.5 sm:p-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-terracotta-400">
                        🪡
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-sm font-bold text-indigo-950 truncate">
                          {activeCraft.artisan}
                        </p>
                        <p className="text-[11px] text-emerald-800 font-semibold truncate flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Karnataka Certified Guild</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Order Pop-up Button */}
                    <button
                      onClick={() => {
                        openOrderPopup({
                          id: activeCraft.id,
                          title: activeCraft.title,
                          category: activeCraft.category,
                          price: activeCraft.price,
                          images: [activeCraft.image],
                          artisan: {
                            name: activeCraft.artisan,
                            village: activeCraft.village,
                            profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
                          },
                          craftStory: {
                            hoursSpent: activeCraft.hours,
                            culturalSignificance: activeCraft.shortQuote,
                            provenanceLocation: activeCraft.village
                          },
                          stockQuantity: 4
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-terracotta-600/30 transition-all active:scale-95 shrink-0"
                      title="Quick Order with Pop-up Animation"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Order Now</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Craft Selector Thumbnail Dots / Tabs */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {featuredCrafts.map((craft, idx) => (
                  <button
                    key={craft.id}
                    onClick={() => setActiveCraftIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeCraftIdx === idx
                        ? 'w-8 bg-terracotta-600 shadow-sm'
                        : 'w-2.5 bg-cream-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Select ${craft.title}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lively Animated Artisan Platform Pulse Marquee Ticker */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-cream-100 py-2.5 border-t border-indigo-900/60 overflow-hidden relative shadow-inner">
        <div className="flex whitespace-nowrap animate-tickerSlide">
          {[...liveTickerItems, ...liveTickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mx-6 text-xs font-semibold tracking-wide text-stone-200">
              <span className="text-amber-400">✦</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
