import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, HeartHandshake, Compass, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  const { setViewMode } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-200/80 via-cream-100 to-cream-100 border-b border-cream-300 py-12 sm:py-16">
      {/* Background Decorative Motif Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-terracotta-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-mustard-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">

          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta-100 border border-terracotta-300 text-terracotta-800 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-ping" />
              <span>Direct-to-Consumer Heritage Bridge • ಉತ್ತರ ಕರ್ನಾಟಕ & ಕರಾವಳಿ</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-indigo-900 leading-[1.15]">
              Living Heritage Stitched with <span className="text-terracotta-600 italic">Sacred Devotion</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
              Connect directly with master artisans preserving Karnataka's centuries-old traditions: 
              the geometric <strong className="text-indigo-900 font-semibold">Kasuti embroidery</strong> of Dharwad, 
              sacred <strong className="text-indigo-900 font-semibold">Beedu palm-lattice</strong> of Udupi, and coastal hand-carved handicrafts. 
              Zero middleman markups.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-terracotta-600/30 flex items-center gap-2 active:scale-95 transition-all touch-target"
              >
                <Compass className="w-5 h-5 text-mustard-300" />
                <span>Explore Authentic Crafts</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setViewMode('artisan')}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-cream-200 border-2 border-indigo-900/20 text-indigo-900 font-bold text-sm sm:text-base flex items-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <span>ಕಲಾಕಾರರಾಗಿ ನೋಂದಾಯಿಸಿ (Sell Your Craft)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-cream-300/80 grid grid-cols-3 gap-3 sm:gap-6 text-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-mustard-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
                  88%
                </div>
                <div className="text-xs sm:text-sm leading-tight">
                  <p className="font-bold text-stone-900">Direct Share</p>
                  <p className="text-stone-500">Goes to artisan</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm leading-tight">
                  <p className="font-bold text-stone-900">GI & Provenance</p>
                  <p className="text-stone-500">Verified cluster origin</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-800 shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm leading-tight">
                  <p className="font-bold text-stone-900">Audio Stories</p>
                  <p className="text-stone-500">Hear artisan voice</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Collage & Featured Artisan Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card */}
              <div className="rounded-3xl overflow-hidden shadow-earth-lg border-4 border-white bg-white">
                <div className="relative h-64 sm:h-72 2xl:h-96 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                    alt="Karnataka Kasuti Handloom Ilkal Saree"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-terracotta-600 px-2.5 py-1 rounded-full text-cream-50">
                      GI Heritage Spotlight
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold mt-1 text-cream-50">
                      Navalgund Kasuti & Ilkal Silk
                    </h3>
                    <p className="text-xs text-cream-200 line-clamp-1">
                      Chalukyan temple chariot & Gopuram thread-counted motifs
                    </p>
                  </div>
                </div>

                {/* Micro Artisan Testimonial Pill */}
                <div className="p-4 bg-cream-50 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                    alt="Parvati Bai"
                    className="w-12 h-12 rounded-full object-cover border-2 border-terracotta-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-indigo-900">Parvati Bai Deshpande</p>
                      <span className="text-emerald-700 text-xs">✓ Verified</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      "With KaraKushala, our 35-woman Dharwad guild sells directly to art lovers."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-indigo-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-indigo-700">
                <span className="text-xl">🏛️</span>
                <div className="text-left text-xs">
                  <p className="font-bold text-amber-300">Badami • Dharwad • Udupi</p>
                  <p className="text-stone-300">Preserving 800-yr Craft Heritage</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
