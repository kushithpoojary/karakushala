import React, { useEffect, useRef, useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';

export default function HeritageLatticeBackground() {
  const canvasRef = useRef(null);

  // Background theme: 'violet' (Light Violet / Lavender) default
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('karakushala_bg_theme') || 'violet';
    } catch {
      return 'violet';
    }
  });

  const [showThemeControls, setShowThemeControls] = useState(false);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('karakushala_bg_theme', newTheme);
    } catch {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use alpha: false for maximum GPU compositing performance
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      // Cap DPR to 1.25 for buttery smooth 60fps rendering without lag
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Floating subtle thread particles (ambient craft silk dust) - Fast & light
    const particleCount = 25;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        radius: 1.2 + Math.random() * 2.0,
        speedY: 1.2 + Math.random() * 1.6, // Faster brisk float speed
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: 0.35 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      });
    }

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // 1. Draw Background Gradient according to active reference theme
      if (theme === 'twilight') {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height * 0.85);
        bgGrad.addColorStop(0, '#212338');
        bgGrad.addColorStop(0.42, '#342938');
        bgGrad.addColorStop(0.75, '#523c39');
        bgGrad.addColorStop(1, '#66453c');
        ctx.fillStyle = bgGrad;
      } else if (theme === 'sandalwood') {
        const bgGrad = ctx.createLinearGradient(0, 0, width * 0.35, height);
        bgGrad.addColorStop(0, '#F9EDE3');
        bgGrad.addColorStop(0.35, '#F6DEC9');
        bgGrad.addColorStop(0.7, '#F1CEB3');
        bgGrad.addColorStop(1, '#E9C0A2');
        ctx.fillStyle = bgGrad;
      } else {
        // LIGHT VIOLET THEME (Upper Section)
        const bgGrad = ctx.createLinearGradient(0, 0, width * 0.45, height);
        bgGrad.addColorStop(0, '#FCF9FF');
        bgGrad.addColorStop(0.30, '#F3EAFF');
        bgGrad.addColorStop(0.68, '#E6D7FB');
        bgGrad.addColorStop(1, '#D8C3F6');
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, width, height);

      // FASTER ANIMATION SPEED PARAMETERS (Visibly swift, lively, and energetic)
      const breathingWave = Math.sin(elapsed * 2.2) * 0.05 + 1; // 2x faster breathing wave
      const lineGlowPulse = Math.sin(elapsed * 2.8) * 0.14 + 0.45; // 2x faster pulse

      // 2. Exact Sacred Geometric Kasuti Mandala Lattice Grid
      const baseSpacing = Math.max(130, Math.min(160, width / 8));
      const spacing = baseSpacing * breathingWave;
      const radius = spacing * 0.44;

      const startCol = 0;
      const endCol = Math.ceil(width / spacing) + 1;
      const startRow = 0;
      const endRow = Math.ceil(height / spacing) + 1;

      // Color palette for linework
      let strokeColor, secondaryStroke, dotColor, particleColor;
      if (theme === 'twilight') {
        strokeColor = `rgba(238, 198, 158, ${lineGlowPulse * 1.15})`;
        secondaryStroke = `rgba(215, 172, 132, ${lineGlowPulse * 0.85})`;
        dotColor = `rgba(255, 218, 175, ${lineGlowPulse * 1.6})`;
        particleColor = 'rgba(238, 198, 158, ';
      } else if (theme === 'sandalwood') {
        strokeColor = `rgba(196, 128, 80, ${lineGlowPulse})`;
        secondaryStroke = `rgba(212, 149, 107, ${lineGlowPulse * 0.8})`;
        dotColor = `rgba(188, 118, 72, ${lineGlowPulse * 1.5})`;
        particleColor = 'rgba(212, 149, 107, ';
      } else {
        strokeColor = `rgba(139, 92, 246, ${lineGlowPulse * 1.15})`;
        secondaryStroke = `rgba(167, 139, 250, ${lineGlowPulse * 0.85})`;
        dotColor = `rgba(124, 58, 237, ${lineGlowPulse * 1.6})`;
        particleColor = 'rgba(167, 139, 250, ';
      }

      ctx.save();
      // Stationary fixed grid — zero cursor shaking!

      // --- Pass 1: Connecting Inter-cell Diagonal Lines (Sacred Grid Weave) ---
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = secondaryStroke;
      ctx.beginPath();

      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cx = c * spacing;
          const cy = r * spacing;

          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + spacing, cy + spacing);
          ctx.moveTo(cx + spacing, cy);
          ctx.lineTo(cx, cy + spacing);

          ctx.moveTo(cx - radius, cy);
          ctx.lineTo(cx + radius, cy);
          ctx.moveTo(cx, cy - radius);
          ctx.lineTo(cx, cy + radius);
        }
      }
      ctx.stroke();

      // --- Pass 2: Main Geometric Units (Concentric Diamonds + Inscribed Circles + Knot Dots) ---
      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cx = c * spacing;
          const cy = r * spacing;

          // Faster lively cell micro-oscillation (elapsed * 2.4)
          const cellPhase = (c * 17 + r * 23) * 0.12;
          const cellRot = Math.sin(elapsed * 2.4 + cellPhase) * 0.065;
          const r1 = radius;
          const r2 = radius * 0.62;
          const rInnerCircle = radius * 0.28;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(cellRot);

          // 1. Outer Circumscribed Circle
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.stroke();

          // 2. Outer Diamond
          ctx.lineWidth = 1.45;
          ctx.beginPath();
          ctx.moveTo(0, -r1);
          ctx.lineTo(r1, 0);
          ctx.lineTo(0, r1);
          ctx.lineTo(-r1, 0);
          ctx.closePath();
          ctx.stroke();

          // 3. Inner Concentric Diamond
          ctx.strokeStyle = secondaryStroke;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(0, -r2);
          ctx.lineTo(r2, 0);
          ctx.lineTo(0, r2);
          ctx.lineTo(-r2, 0);
          ctx.closePath();
          ctx.stroke();

          // 4. Central Inner Circle
          ctx.beginPath();
          ctx.arc(0, 0, rInnerCircle, 0, Math.PI * 2);
          ctx.stroke();

          // 5. Node / Knot Dots at Diamond Vertices
          ctx.fillStyle = dotColor;
          const dotRadius = 2.5;

          const outerDots = [
            [0, -r1], [r1, 0], [0, r1], [-r1, 0]
          ];
          for (let i = 0; i < outerDots.length; i++) {
            ctx.beginPath();
            ctx.arc(outerDots[i][0], outerDots[i][1], dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          const innerDots = [
            [0, -r2], [r2, 0], [0, r2], [-r2, 0]
          ];
          for (let i = 0; i < innerDots.length; i++) {
            ctx.beginPath();
            ctx.arc(innerDots[i][0], innerDots[i][1], dotRadius * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      ctx.restore();

      // 3. Floating Light Craft Particles (Silk Dust Drift - Swift & Lively)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(elapsed * 2.0 + p.phase) * 0.45;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity + Math.sin(elapsed * 2.5 + p.phase) * 0.2;
        ctx.fillStyle = `${particleColor}${Math.max(0.1, currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <>
      {/* 1. Background Geometric Lattice Canvas (Single lightweight canvas, zero lag) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 select-none"
        style={{ opacity: 0.96 }}
        aria-hidden="true"
      />

      {/* Floating Theme Controller Pill */}
      <aside 
        aria-label="Heritage lattice animation theme controls"
        className="fixed bottom-5 right-5 z-40"
      >
        <div className="relative group">
          {showThemeControls ? (
            <div className="bg-white/95 backdrop-blur-xl border border-purple-200/80 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 min-w-[220px] animate-popBounce">
              <div className="flex items-center justify-between pb-1 border-b border-purple-100">
                <span className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-violet-600" />
                  Upper Theme
                </span>
                <button
                  type="button"
                  onClick={() => setShowThemeControls(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs px-1"
                  aria-label="Close theme options"
                >
                  ✕
                </button>
              </div>

              {/* Theme 1: Light Violet (Default) */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme('violet');
                  setShowThemeControls(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'violet'
                    ? 'bg-violet-100 text-violet-950 border border-violet-400 shadow-xs'
                    : 'hover:bg-purple-50 text-stone-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FCF9FF] via-[#E6D7FB] to-[#D8C3F6] border border-violet-400 shadow-xs flex-shrink-0" />
                <div className="text-left">
                  <p className="leading-tight font-bold text-violet-900">Light Violet (Default)</p>
                  <p className="text-[10px] text-stone-500 font-normal">Upper Page Atmosphere</p>
                </div>
              </button>

              {/* Theme 2: Sandalwood Silk */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme('sandalwood');
                  setShowThemeControls(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'sandalwood'
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#F9EDE3] via-[#F6DEC9] to-[#E9C0A2] border border-amber-400 shadow-xs flex-shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Sandalwood Silk</p>
                  <p className="text-[10px] text-stone-500 font-normal">Warm Peach Theme</p>
                </div>
              </button>

              {/* Theme 3: Twilight Dusk */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme('twilight');
                  setShowThemeControls(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'twilight'
                    ? 'bg-indigo-100/90 text-indigo-950 border border-indigo-300 shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#212338] via-[#523c39] to-[#66453c] border border-amber-300 shadow-xs flex-shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Twilight Dusk</p>
                  <p className="text-[10px] text-stone-500 font-normal">Indigo Bronze Theme</p>
                </div>
              </button>

              <div className="pt-1 border-t border-purple-100 flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center gap-1 text-violet-700 font-medium">
                  <Sparkles className="w-2.5 h-2.5 text-violet-600" />
                  Performance: Silky Smooth 60FPS
                </span>
                <span className="text-[10px] text-purple-600">Standard Cursor Active</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowThemeControls(true)}
              className="bg-white/90 hover:bg-white backdrop-blur-xl border border-violet-300/80 hover:border-violet-500 text-stone-800 shadow-lg hover:shadow-xl rounded-full px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 group"
              title="Upper Theme Selector"
              aria-label="Upper Theme Selector"
            >
              <Palette className="w-3.5 h-3.5 text-violet-600 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">
                {theme === 'violet' ? 'Light Violet' : theme === 'twilight' ? 'Twilight Dusk' : 'Sandalwood Silk'}
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
