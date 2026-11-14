import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WebsiteIntroSplash({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        // Start smooth fade-out
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 600);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream-100/90 backdrop-blur-2xl transition-all duration-700 ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background light orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl animate-blob1" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl animate-blob2" />

      <div className="relative text-center px-6 max-w-md mx-auto space-y-6 animate-popBounce">
        
        {/* Animated Golden Needle Badge */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Pulsing golden rings */}
          <div className="absolute inset-0 rounded-3xl bg-amber-400/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-terracotta-600 via-amber-500 to-terracotta-700 text-white flex items-center justify-center text-4xl shadow-xl shadow-terracotta-600/30 border-2 border-amber-300">
            <span className="transform hover:rotate-12 transition-transform select-none">
              🪡
            </span>
          </div>
          {/* Orbiting Sparkle */}
          <span className="absolute -top-1 -right-1 text-amber-500 text-xl animate-sparkleFloat">
            ✨
          </span>
        </div>

        {/* Brand Reveal */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ಕರ್ನಾಟಕ ಕರಕುಶಲ • Living Traditions</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
            KaraKushala
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-sm mx-auto leading-relaxed">
            Direct Karnataka Artisan Handloom & Sacred Living Craft Bridge
          </p>

          <p className="text-[11px] text-terracotta-700 font-bold">
            Navalgund Kasuti • Maravanthe Beedu • Kumta Woodcraft
          </p>
        </div>

        {/* Animated Weaving Thread Progress Bar */}
        <div className="space-y-1.5 max-w-xs mx-auto pt-2">
          <div className="w-full bg-cream-300/80 h-1.5 rounded-full overflow-hidden p-0.5 border border-cream-400/60 shadow-inner">
            <div
              className="bg-gradient-to-r from-terracotta-600 via-amber-500 to-indigo-600 h-full rounded-full transition-all duration-75 shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono">
            <span>Weaving Handloom Portal...</span>
            <span className="font-bold text-terracotta-700">{progress}%</span>
          </div>
        </div>

        {/* Skip Button */}
        <div>
          <button
            onClick={handleSkip}
            className="text-[11px] text-stone-400 hover:text-stone-700 underline font-semibold transition-colors"
          >
            Enter Marketplace directly →
          </button>
        </div>

      </div>
    </div>
  );
}
