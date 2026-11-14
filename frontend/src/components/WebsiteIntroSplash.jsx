import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Award } from 'lucide-react';

export default function WebsiteIntroSplash({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Snappy, swift progress counter
    const startTime = Date.now();
    const duration = 1000; // Fast 1 second intro

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 400);
        }, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/92 backdrop-blur-3xl transition-all duration-700 overflow-hidden ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Concentric Sacred Animated Gold Mandala Shockwaves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[580px] h-[580px] rounded-full border border-amber-400/15 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="w-[420px] h-[420px] rounded-full border border-amber-400/25 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="w-[280px] h-[280px] rounded-full border border-amber-300/35 animate-spin" style={{ animationDuration: '18s' }} />
        <div className="w-[180px] h-[180px] rounded-full border-2 border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
      </div>

      {/* 2. Deep Royal Aurora Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-blob1" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl animate-blob2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl animate-blob3" />

      {/* 3. Central Royal Weaving Stage */}
      <div className="relative text-center px-6 max-w-lg mx-auto space-y-6 z-10 animate-popBounce">
        
        {/* Animated Golden Needle & Pulsing Weaver's Spindle */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Pulsing outer ring */}
          <div className="absolute inset-0 rounded-3xl bg-amber-400/25 animate-ping" style={{ animationDuration: '2s' }} />
          
          {/* Sacred golden container with jewel bevel border */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/40 border-2 border-amber-200">
            <span className="transform animate-bounce select-none">
              🪡
            </span>
          </div>

          {/* Orbiting Stardust Sparkles */}
          <span className="absolute -top-2 -right-2 text-amber-300 text-2xl animate-sparkleFloat">
            ✨
          </span>
          <span className="absolute -bottom-1 -left-2 text-yellow-200 text-xl animate-sparkleFloat" style={{ animationDelay: '1s' }}>
            ✦
          </span>
        </div>

        {/* Brand Reveal Typography */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-bold border border-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ಕರ್ನಾಟಕ ಜೀವಂತ ಕರಕುಶಲ ಮಳಿಗೆ • Karnataka Living Crafts</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 tracking-tight drop-shadow-md">
            KaraKushala
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-sm mx-auto leading-relaxed">
            Sacred Kasuti Embroidery • Coastal Beedu Weaves • Master Artisans
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-amber-400 font-bold">
            <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-amber-400/30">GI Certified</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-amber-400/30">88%+ Direct to Weaver</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-amber-400/30">100% Handcrafted</span>
          </div>
        </div>

        {/* Animated Weaving Thread Progress Bar */}
        <div className="space-y-2 max-w-xs mx-auto pt-2">
          <div className="w-full bg-stone-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-amber-400/30 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 h-full rounded-full transition-all duration-75 shadow-lg shadow-amber-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-stone-400 font-mono">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Weaving Handloom Portal...
            </span>
            <span className="font-bold text-amber-300 text-xs">{progress}%</span>
          </div>
        </div>

        {/* Instant Enter Button */}
        <div className="pt-2">
          <button
            onClick={handleSkip}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto btn-press"
          >
            <span>Explore Marketplace (ಪ್ರವೇಶಿಸಿ)</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </div>

      </div>
    </div>
  );
}
